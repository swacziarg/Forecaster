export type MarketSeriesPoint = {
  timestamp: string
  probability: number
}

export type ImpactConfidence = 'High' | 'Medium' | 'Low'
export type ExpectedDirection = 'Helps Trump' | 'Hurts Trump' | 'Ambiguous'

export type ImpactSource = {
  label: string
  publisher: string
  url: string
  publishedAt: string
}

export type ImpactEventDefinition = {
  id: string
  title: string
  shortTitle: string
  timestamp: string
  dateLabel: string
  category: 'Debate' | 'Campaign' | 'Candidate change' | 'Polling' | 'Legal' | 'Media'
  summary: string
  mechanism: string
  expectedDirection: ExpectedDirection
  interpretation: string
  competingExplanation: string
  confidence: ImpactConfidence
  attributionShare: number
  source: ImpactSource
}

export type EventImpact = ImpactEventDefinition & {
  beforeProbability: number
  immediateProbability: number
  stabilizedProbability: number
  followThroughProbability: number
  immediateMovement: number
  observedMovement: number
  followThroughMovement: number
  attributedImpact: number
  counterfactualProbability: number
  attributionShare: number
  samples: { before: number; immediate: number; stabilized: number; followThrough: number }
}

export type CampaignSummary = {
  firstProbability: number
  finalProbability: number
  netMovement: number
  lowProbability: number
  highProbability: number
  observations: number
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const logit = (probability: number) => Math.log(clamp(probability, 0.000001, 0.999999) / (1 - clamp(probability, 0.000001, 0.999999)))
const sigmoid = (value: number) => 1 / (1 + Math.exp(-value))

const median = (values: number[]) => {
  if (values.length === 0) throw new Error('An event window has no market observations.')
  const ordered = [...values].sort((a, b) => a - b)
  const middle = Math.floor(ordered.length / 2)
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2
}

const samplesBetween = (points: MarketSeriesPoint[], start: number, end: number) => points
  .filter((point) => {
    const timestamp = Date.parse(point.timestamp)
    return timestamp >= start && timestamp < end
  })
  .map((point) => point.probability)

export const parseHourlyMarketCsv = (csv: string): MarketSeriesPoint[] => {
  const lines = csv.trim().split(/\r?\n/)
  if (lines[0] !== 'time,q') throw new Error('Election market data has an unexpected header.')

  const points = lines.slice(1).map((line, index) => {
    const [timestamp, rawProbability] = line.split(',')
    const probability = Number(rawProbability)
    if (!timestamp || !Number.isFinite(Date.parse(timestamp)) || !Number.isFinite(probability) || probability <= 0 || probability >= 1) {
      throw new Error(`Election market data has an invalid row at line ${index + 2}.`)
    }
    return { timestamp, probability }
  })

  if (points.length < 3000) throw new Error('Election market data is incomplete.')
  return points.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
}

export const summarizeCampaign = (points: MarketSeriesPoint[]): CampaignSummary => {
  if (points.length === 0) throw new Error('Election market data is empty.')
  const probabilities = points.map((point) => point.probability)
  return {
    firstProbability: probabilities[0],
    finalProbability: probabilities[probabilities.length - 1],
    netMovement: probabilities[probabilities.length - 1] - probabilities[0],
    lowProbability: Math.min(...probabilities),
    highProbability: Math.max(...probabilities),
    observations: points.length,
  }
}

export const calculateEventImpact = (points: MarketSeriesPoint[], event: ImpactEventDefinition, attributionShare = event.attributionShare): EventImpact => {
  const eventTime = Date.parse(event.timestamp)
  const hour = 60 * 60 * 1000
  const beforeSamples = samplesBetween(points, eventTime - 12 * hour, eventTime)
  const immediateSamples = samplesBetween(points, eventTime, eventTime + 6 * hour)
  const stabilizedSamples = samplesBetween(points, eventTime + 18 * hour, eventTime + 36 * hour)
  const followThroughSamples = samplesBetween(points, eventTime + 48 * hour, eventTime + 72 * hour)
  const beforeProbability = median(beforeSamples)
  const immediateProbability = median(immediateSamples)
  const stabilizedProbability = median(stabilizedSamples)
  const followThroughProbability = median(followThroughSamples)
  const share = clamp(attributionShare, 0, 100)
  const attributedLogOdds = (logit(stabilizedProbability) - logit(beforeProbability)) * share / 100
  const counterfactualProbability = sigmoid(logit(stabilizedProbability) - attributedLogOdds)

  return {
    ...event,
    attributionShare: share,
    beforeProbability,
    immediateProbability,
    stabilizedProbability,
    followThroughProbability,
    immediateMovement: immediateProbability - beforeProbability,
    observedMovement: stabilizedProbability - beforeProbability,
    followThroughMovement: followThroughProbability - beforeProbability,
    attributedImpact: stabilizedProbability - counterfactualProbability,
    counterfactualProbability,
    samples: { before: beforeSamples.length, immediate: immediateSamples.length, stabilized: stabilizedSamples.length, followThrough: followThroughSamples.length },
  }
}

export const calculateEventImpacts = (points: MarketSeriesPoint[], events: ImpactEventDefinition[], attributionShares: Record<string, number> = {}) => events
  .map((event) => calculateEventImpact(points, event, attributionShares[event.id] ?? event.attributionShare))

export const rankByObservedImpact = (impacts: EventImpact[]) => [...impacts]
  .sort((a, b) => Math.abs(b.observedMovement) - Math.abs(a.observedMovement))

export const moveRankedItem = (order: string[], id: string, destinationIndex: number) => {
  const sourceIndex = order.indexOf(id)
  if (sourceIndex < 0) return order
  const next = [...order]
  next.splice(sourceIndex, 1)
  next.splice(clamp(destinationIndex, 0, next.length), 0, id)
  return next
}

export const scoreImpactRanking = (userOrder: string[], marketOrder: string[]) => {
  if (userOrder.length !== marketOrder.length || new Set(userOrder).size !== userOrder.length || marketOrder.some((id) => !userOrder.includes(id))) {
    throw new Error('Impact rankings must contain the same unique events.')
  }
  const marketRanks = new Map(marketOrder.map((id, index) => [id, index]))
  const distance = userOrder.reduce((total, id, index) => total + Math.abs(index - marketRanks.get(id)!), 0)
  const maximumDistance = Math.floor(userOrder.length * userOrder.length / 2)
  return Math.round((1 - distance / maximumDistance) * 100)
}
