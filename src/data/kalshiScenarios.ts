import { loadKalshiMarketSeries, KALSHI_SOURCE_CATALOG, type KalshiMarket, type KalshiMarketConfig, type KalshiPricePoint } from './kalshi.ts'
import type { Checkpoint, CheckpointId, FactorDefinition, FactorObservation, MarketPoint, Scenario, ScenarioCategory } from '../domain/types.ts'

const DAY_MS = 24 * 60 * 60 * 1000
const checkpointIds: CheckpointId[] = ['60d', '45d', '30d', '15d']
const checkpointDays = [60, 45, 30, 15]

type ScenarioEditorial = {
  category: ScenarioCategory
  categoryTone: Scenario['categoryTone']
  dek: string
  context: string
}

const editorial: Record<string, ScenarioEditorial> = {
  'fed-september-2026': {
    category: 'Economics',
    categoryTone: 'blue',
    dek: 'Rates, inflation, and the next move from the central bank.',
    context: 'Read the market as it moves toward the September meeting. Every observation is sourced from Kalshi and frozen at its checkpoint date.',
  },
  'iran-nuclear-deal-2026': {
    category: 'Politics',
    categoryTone: 'green',
    dek: 'A high-stakes geopolitical question with a clock attached.',
    context: 'Track a live market on a possible US–Iran agreement. The numbers below are Kalshi prices, not a house view.',
  },
  'anthropic-ipo-october': {
    category: 'Technology',
    categoryTone: 'blue',
    dek: 'The AI boom meets public-market ambition.',
    context: 'Follow a live Kalshi contract on whether Anthropic announces an IPO by October. The market is the baseline; your theory is the experiment.',
  },
  'odyssey-best-picture': {
    category: 'Entertainment',
    categoryTone: 'amber',
    dek: 'A major film title, a long awards runway, and one early market.',
    context: 'Use the live Kalshi price as your starting point. Decide which market-derived signals deserve weight before awards season unfolds.',
  },
}

const formatDate = (value: string | undefined) => value
  ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  : 'Unknown date'

const formatDelta = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)} pts`
const clampSignal = (value: number) => Math.min(Math.max(Math.abs(value), 0), 1)

const pointAtOrBefore = (points: KalshiPricePoint[], index: number, lookbackDays: number) => {
  const target = Date.parse(points[index].timestamp) - lookbackDays * DAY_MS
  let match = Math.max(0, index - 1)
  for (let cursor = index; cursor >= 0; cursor -= 1) {
    if (Date.parse(points[cursor].timestamp) <= target) {
      match = cursor
      break
    }
  }
  return match
}

const numeric = (value: unknown) => {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const resolvedOutcome = (market: KalshiMarket): boolean | null => {
  const result = market.result?.toLowerCase()
  if (result === 'yes') return true
  if (result === 'no') return false
  return null
}

const checkpointIndexesFor = (points: KalshiPricePoint[]) => {
  const latestIndex = points.length - 1
  const latestTimestamp = Date.parse(points[latestIndex].timestamp)
  const indexes = checkpointDays.map((days) => {
    const target = latestTimestamp - days * DAY_MS
    const index = points.findIndex((point) => Date.parse(point.timestamp) >= target)
    return index === -1 ? 0 : Math.max(0, index - 1)
  })
  if (Date.parse(points[indexes[0]].timestamp) > latestTimestamp - 45 * DAY_MS) {
    throw new Error('Kalshi returned less than 45 days of usable history for this market.')
  }
  return indexes
}

type FactorMeasurement = {
  reading: string
  context: string
  signal: number
}

const buildFactor = (
  id: string,
  label: string,
  shortLabel: string,
  description: string,
  cue: string,
  points: KalshiPricePoint[],
  checkpointIndexes: number[],
  measure: (index: number) => FactorMeasurement,
): FactorDefinition => ({
  id,
  label,
  shortLabel,
  description,
  cue,
  observations: Object.fromEntries(checkpointIds.map((checkpointId, checkpointIndex) => [checkpointId, measure(checkpointIndexes[checkpointIndex])])) as Record<CheckpointId, FactorObservation>,
})

const buildFactors = (points: KalshiPricePoint[], checkpointIndexes: number[]): FactorDefinition[] => {
  const recentMomentum = (index: number): FactorMeasurement => {
    const prior = pointAtOrBefore(points, index, 7)
    const delta = points[index].probability - points[prior].probability
    return {
      reading: `${formatDelta(delta)} over 7d`,
      context: 'Kalshi probability change over the latest seven days available at this cutoff.',
      signal: clampSignal(delta / 15),
    }
  }

  const longerTrend = (index: number): FactorMeasurement => {
    const prior = pointAtOrBefore(points, index, 30)
    const delta = points[index].probability - points[prior].probability
    return {
      reading: `${formatDelta(delta)} over 30d`,
      context: 'Kalshi probability change over the latest thirty days available at this cutoff.',
      signal: clampSignal(delta / 25),
    }
  }

  const consistency = (index: number): FactorMeasurement => {
    const start = pointAtOrBefore(points, index, 14)
    const window = points.slice(start, index + 1)
    const changes = window.slice(1).map((point, offset) => point.probability - window[offset].probability)
    const upDays = changes.filter((change) => change > 0).length
    const ratio = changes.length ? upDays / changes.length : 0.5
    return {
      reading: `${upDays}/${changes.length || 1} sessions closed higher`,
      context: 'Share of observed Kalshi sessions that finished above the prior session.',
      signal: clampSignal((ratio - 0.5) * 2),
    }
  }

  const rangePosition = (index: number): FactorMeasurement => {
    const start = pointAtOrBefore(points, index, 30)
    const window = points.slice(start, index + 1).map((point) => point.probability)
    const low = Math.min(...window)
    const high = Math.max(...window)
    const midpoint = (low + high) / 2
    const signal = high === low ? 0 : (points[index].probability - midpoint) / ((high - low) / 2)
    return {
      reading: `${points[index].probability.toFixed(1)}% in ${low.toFixed(1)}–${high.toFixed(1)}% range`,
      context: 'Current Kalshi probability relative to its trailing thirty-day range.',
      signal: clampSignal(signal),
    }
  }

  const activity = (index: number): FactorMeasurement => {
    const start = pointAtOrBefore(points, index, 7)
    const currentVolume = points.slice(start, index + 1).reduce((sum, point) => sum + point.volume, 0)
    const priorStart = pointAtOrBefore(points, start, 7)
    const priorVolume = points.slice(priorStart, Math.max(priorStart + 1, start)).reduce((sum, point) => sum + point.volume, 0)
    const change = priorVolume > 0 ? ((currentVolume - priorVolume) / priorVolume) * 100 : 0
    return {
      reading: `${Math.round(currentVolume).toLocaleString()} contracts over 7d (${change >= 0 ? '+' : ''}${change.toFixed(0)}%)`,
      context: 'Kalshi contract volume compared with the prior seven-day window.',
      signal: clampSignal(change / 100),
    }
  }

  return [
    buildFactor('recent-momentum', 'Recent momentum', 'Momentum', 'The market probability change over the latest seven days available at this checkpoint.', 'If recent momentum is informative, it makes this event…', points, checkpointIndexes, recentMomentum),
    buildFactor('longer-trend', 'Longer trend', '30d trend', 'The market probability change over the latest thirty days available at this checkpoint.', 'If the longer trend is informative, it makes this event…', points, checkpointIndexes, longerTrend),
    buildFactor('consistency', 'Direction consistency', 'Consistency', 'How often the market closed higher during the recent two-week window.', 'If consistent movement is informative, it makes this event…', points, checkpointIndexes, consistency),
    buildFactor('range-position', 'Position in range', 'Range position', 'Where the current probability sits inside its trailing thirty-day range.', 'If range position is informative, it makes this event…', points, checkpointIndexes, rangePosition),
    buildFactor('activity', 'Trading activity', 'Activity', 'A liquidity and attention signal from Kalshi contract volume.', 'If trading activity is informative, it makes this event…', points, checkpointIndexes, activity),
  ]
}

const buildCheckpoints = (points: KalshiPricePoint[], indexes: number[]): Checkpoint[] => checkpointIds.map((id, index) => ({
  id,
  label: `${checkpointDays[index]} days before the latest Kalshi observation`,
  shortLabel: `${checkpointDays[index]}d`,
  date: formatDate(points[indexes[index]].timestamp),
  cutoffTimestamp: points[indexes[index]].timestamp,
  marketProbability: Math.round(points[indexes[index]].probability * 10) / 10,
}))

const buildMarketHistory = (points: KalshiPricePoint[], indexes: number[], outcome: boolean | null, market: KalshiMarket): MarketPoint[] => {
  const history: MarketPoint[] = indexes.map((index) => ({
    label: points[index].label,
    probability: points[index].probability,
    timestamp: points[index].timestamp,
  }))
  const latest = points[points.length - 1]
  if (latest.timestamp !== history[history.length - 1].timestamp) history.push({ label: 'Latest', probability: latest.probability, timestamp: latest.timestamp })
  if (outcome !== null) history.push({
    label: 'Resolution',
    probability: outcome ? 100 : 0,
    timestamp: market.settlement_ts ?? market.close_time ?? new Date().toISOString(),
    resolution: true,
  })
  return history
}

const buildScenario = async (config: KalshiMarketConfig): Promise<Scenario> => {
  const { market, points, fetchedAt } = await loadKalshiMarketSeries(config)
  if (points.length < 10) throw new Error(`${config.ticker} returned too little usable Kalshi history.`)
  const checkpointIndexes = checkpointIndexesFor(points)
  const details = editorial[config.id]
  const outcome = resolvedOutcome(market)
  const resolutionTimestamp = market.settlement_ts ?? market.close_time ?? market.expected_expiration_time ?? new Date().toISOString()
  return {
    id: config.id,
    title: market.title ?? config.label,
    shortTitle: config.label,
    question: market.title ?? config.label,
    category: details.category,
    categoryTone: details.categoryTone,
    dek: details.dek,
    context: details.context,
    resolutionDate: formatDate(resolutionTimestamp),
    resolutionTimestamp,
    outcome,
    outcomeLabel: outcome === null ? 'Awaiting Kalshi settlement.' : `Kalshi settled ${outcome ? 'YES' : 'NO'}.`,
    checkpoints: buildCheckpoints(points, checkpointIndexes),
    marketHistory: buildMarketHistory(points, checkpointIndexes, outcome, market),
    factors: buildFactors(points, checkpointIndexes),
    source: {
      provider: 'Kalshi',
      ticker: config.ticker,
      eventTicker: config.eventTicker,
      seriesTicker: config.seriesTicker,
      fetchedAt,
      sourceUrl: `https://external-api.kalshi.com/trade-api/v2/markets/${encodeURIComponent(config.ticker)}`,
      volume: numeric(market.volume_fp),
      openInterest: numeric(market.open_interest_fp),
    },
    live: true,
  }
}

export async function loadKalshiScenarios(): Promise<Scenario[]> {
  return Promise.all(KALSHI_SOURCE_CATALOG.map(buildScenario))
}
