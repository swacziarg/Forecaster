import type { MarketPoint } from '../domain/types.ts'

/** Public Kalshi market-data boundary used by the live game. */
const API_ROOT = '/api/kalshi/trade-api/v2'
const DAY_MS = 24 * 60 * 60 * 1000

export type KalshiMarketConfig = {
  id: string
  ticker: string
  eventTicker: string
  seriesTicker: string
  label: string
  category: 'Politics' | 'Economics' | 'Technology' | 'Entertainment' | 'Sports'
}

export const KALSHI_SOURCE_CATALOG: KalshiMarketConfig[] = [
  { id: 'canada-liberal-majority-2025', ticker: 'KXCANCOALITION-30-L', eventTicker: 'KXCANCOALITION-30', seriesTicker: 'KXCANCOALITION', label: 'Canada: Liberal majority government', category: 'Politics' },
  { id: 'fed-december-2025-cut', ticker: 'KXFEDDECISION-25DEC-C25', eventTicker: 'KXFEDDECISION-25DEC', seriesTicker: 'KXFEDDECISION', label: 'Fed cuts 25 bps in December 2025', category: 'Economics' },
  { id: 'one-battle-best-picture-2026', ticker: 'KXOSCARPIC-26-ONE', eventTicker: 'KXOSCARPIC-26', seriesTicker: 'KXOSCARPIC', label: 'One Battle After Another wins Best Picture', category: 'Entertainment' },
  { id: 'seattle-football-champion-2026', ticker: 'KXSB-26-SEA', eventTicker: 'KXSB-26', seriesTicker: 'KXSB', label: 'Seattle wins the 2026 pro-football championship', category: 'Sports' },
]

export type KalshiMarket = {
  ticker?: string
  title?: string
  subtitle?: string
  open_time?: string
  close_time?: string
  expected_expiration_time?: string
  latest_expiration_time?: string
  settlement_ts?: string
  status?: string
  result?: string
  volume_fp?: string
  open_interest_fp?: string
  last_price_dollars?: string
  last_price?: number
  [key: string]: unknown
}

type KalshiQuote = {
  close?: string
  close_dollars?: string
}

export type KalshiCandle = {
  end_period_ts?: number
  price?: Record<string, unknown>
  yes_ask?: KalshiQuote
  yes_bid?: KalshiQuote
  volume?: string
  volume_fp?: string
  open_interest?: string
  open_interest_fp?: string
}

type KalshiResponse<T> = T & { market?: KalshiMarket; candlesticks?: KalshiCandle[] }

export type KalshiPricePoint = MarketPoint & {
  timestamp: string
  volume: number
  openInterest: number
}

class KalshiApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const isNotFound = (error: unknown) => error instanceof KalshiApiError && error.status === 404

/** Fetch a JSON response through the Vite proxy, keeping credentials out of the client bundle. */
export async function fetchKalshiJson<T>(path: string): Promise<KalshiResponse<T>> {
  const response = await fetch(`${API_ROOT}${path}`, { cache: 'no-store' })
  const body = await response.text()
  let parsed: unknown = {}
  try {
    parsed = body ? JSON.parse(body) : {}
  } catch {
    parsed = {}
  }
  if (!response.ok) {
    const message = typeof parsed === 'object' && parsed !== null && 'message' in parsed && typeof parsed.message === 'string'
      ? parsed.message
      : `Kalshi returned HTTP ${response.status}`
    throw new KalshiApiError(response.status, message)
  }
  return parsed as KalshiResponse<T>
}

export async function fetchKalshiMarket(config: KalshiMarketConfig): Promise<{ market: KalshiMarket; historical: boolean }> {
  try {
    const response = await fetchKalshiJson<unknown>(`/historical/markets/${encodeURIComponent(config.ticker)}`)
    if (response.market) return { market: response.market, historical: true }
  } catch (error) {
    if (!isNotFound(error)) throw error
  }

  const response = await fetchKalshiJson<unknown>(`/markets/${encodeURIComponent(config.ticker)}`)
  if (!response.market) throw new Error(`Kalshi did not return metadata for ${config.ticker}.`)
  return { market: response.market, historical: false }
}

const toSeconds = (value: string | undefined, fallback: number) => {
  const timestamp = value ? Date.parse(value) : Number.NaN
  return Number.isFinite(timestamp) ? Math.floor(timestamp / 1000) : fallback
}

export async function fetchKalshiCandles(config: KalshiMarketConfig, market: KalshiMarket, historical: boolean): Promise<KalshiCandle[]> {
  const now = Date.now()
  const openMs = market.open_time ? Date.parse(market.open_time) : now - 90 * DAY_MS
  const closeMs = market.close_time ? Date.parse(market.close_time) : now
  const endMs = historical ? Math.min(closeMs || now, now) : now
  const startMs = historical ? openMs : Math.max(openMs, endMs - 100 * DAY_MS)
  const params = new URLSearchParams({
    start_ts: String(toSeconds(new Date(startMs).toISOString(), 0)),
    end_ts: String(toSeconds(new Date(endMs).toISOString(), 0)),
    period_interval: '1440',
  })
  const encodedTicker = encodeURIComponent(config.ticker)
  const historicalPath = `/historical/markets/${encodedTicker}/candlesticks?${params.toString()}`
  const livePath = `/series/${encodeURIComponent(config.seriesTicker)}/markets/${encodedTicker}/candlesticks?${params.toString()}`
  const paths = historical ? [historicalPath, livePath] : [livePath, historicalPath]
  let lastError: unknown

  for (const path of paths) {
    try {
      const response = await fetchKalshiJson<unknown>(path)
      if (response.candlesticks) return response.candlesticks
    } catch (error) {
      lastError = error
      if (!isNotFound(error)) throw error
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Kalshi did not return candlesticks for ${config.ticker}.`)
}

const numeric = (value: unknown) => {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const priceFrom = (candle: KalshiCandle) => {
  const price = candle.price ?? {}
  const tradedPrice = [price.close, price.close_dollars, price.mean, price.mean_dollars, price.open, price.open_dollars]
    .find((value) => value !== undefined && value !== null)
  if (tradedPrice !== undefined) {
    const parsed = numeric(tradedPrice)
    return parsed <= 1 ? parsed * 100 : parsed
  }
  const bid = numeric(candle.yes_bid?.close_dollars ?? candle.yes_bid?.close)
  const ask = numeric(candle.yes_ask?.close_dollars ?? candle.yes_ask?.close)
  if (bid > 0 && ask > 0) return (bid + ask) * 50
  return Math.max(bid, ask) * 100
}

/** Normalize Kalshi candlesticks into the market-history shape used by the product. */
export const normalizeKalshiCandles = (candles: KalshiCandle[]): KalshiPricePoint[] => candles
  .filter((candle) => Number.isFinite(candle.end_period_ts) && candle.end_period_ts)
  .map((candle) => ({
    label: new Date((candle.end_period_ts as number) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
    timestamp: new Date((candle.end_period_ts as number) * 1000).toISOString(),
    probability: Math.round(Math.min(Math.max(priceFrom(candle), 0), 100) * 10) / 10,
    volume: numeric(candle.volume ?? candle.volume_fp),
    openInterest: numeric(candle.open_interest ?? candle.open_interest_fp),
  }))
  .filter((point) => Number.isFinite(point.probability))
  .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
  .filter((point, index, points) => index === 0 || point.timestamp !== points[index - 1].timestamp)

/** One call for consumers that need a market plus its normalized daily history. */
export async function loadKalshiMarketSeries(config: KalshiMarketConfig) {
  const fetchedAt = new Date().toISOString()
  const { market, historical } = await fetchKalshiMarket(config)
  const candles = await fetchKalshiCandles(config, market, historical)
  return { config, market, points: normalizeKalshiCandles(candles), historical, fetchedAt }
}
