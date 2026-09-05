import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'

const [inputPath, outputPath, manifestPath] = process.argv.slice(2)
if (!inputPath || !outputPath || !manifestPath) throw new Error('Usage: node scripts/import-kalshi-candles.mjs input.json output.csv manifest.json')

const raw = await readFile(inputPath)
const payload = JSON.parse(raw.toString())
const candles = [...payload.candlesticks].sort((left, right) => left.end_period_ts - right.end_period_ts)
const rows = ['time,q,raw_price,bid,ask,volume,open_interest,mark_type,stale']

for (const candle of candles) {
  const traded = candle.price?.close === null || candle.price?.close === undefined ? null : Number(candle.price.close)
  const bid = candle.yes_bid?.close === null || candle.yes_bid?.close === undefined ? null : Number(candle.yes_bid.close)
  const ask = candle.yes_ask?.close === null || candle.yes_ask?.close === undefined ? null : Number(candle.yes_ask.close)
  const spread = bid === null || ask === null ? null : ask - bid
  const midpoint = spread !== null && spread >= 0 && spread <= 0.2 ? (bid + ask) / 2 : null
  const probability = traded ?? midpoint
  if (probability === null || probability < 0 || probability > 1) continue
  const markType = traded !== null ? 'trade' : 'midpoint'
  rows.push([
    new Date(candle.end_period_ts * 1000).toISOString(), probability.toFixed(4), traded?.toFixed(4) ?? '', bid?.toFixed(4) ?? '', ask?.toFixed(4) ?? '',
    Number(candle.volume ?? 0).toFixed(2), Number(candle.open_interest ?? 0).toFixed(2), markType, 'false',
  ].join(','))
}

const normalized = `${rows.join('\n')}\n`
const sha256 = (value) => createHash('sha256').update(value).digest('hex')
await writeFile(outputPath, normalized)
await writeFile(manifestPath, `${JSON.stringify({
  provider: 'Kalshi',
  ticker: payload.ticker,
  retrievedAt: new Date().toISOString(),
  request: 'GET /trade-api/v2/historical/markets/KXOSCARPIC-26-ONE/candlesticks?start_ts=1758549600&end_ts=1773633600&period_interval=60',
  rawSha256: sha256(raw), normalizedSha256: sha256(normalized),
  rawCandles: candles.length, normalizedObservations: rows.length - 1,
  coverageStart: rows[1]?.split(',')[0], coverageEnd: rows.at(-1)?.split(',')[0],
  transformVersion: 'kalshi-hourly-v1',
  markPolicy: 'Use the candle close when traded; otherwise use the closing bid/ask midpoint only when spread is at most 20 points.',
}, null, 2)}\n`)
