import type { MarkType, MeasurementProfile, StudyEvent, WindowOffset } from './study.ts'

export type MarketSeriesPoint = {
  timestamp: string
  probability: number
  rawPrice?: number
  bid?: number
  ask?: number
  volume?: number
  openInterest?: number
  markType?: MarkType
  stale?: boolean
  providerFlags?: string[]
}

export type ImpactConfidence = 'High' | 'Medium' | 'Low'
export type ExpectedDirection = 'Helps Trump' | 'Hurts Trump' | 'Ambiguous'
export type ImpactSource = { label: string; publisher: string; url: string; publishedAt: string }

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

export type WindowQuality = {
  expectedBuckets: number
  validBuckets: number
  tradedBuckets: number
  quoteBuckets: number
  staleBuckets: number
  coverage: number
  maximumGapBuckets: number
  medianSpread: number | null
  totalVolume: number
  distinctUpdates: number
  status: 'usable' | 'insufficient'
  reasons: string[]
}

export type CalculatedWindow = { level: number | null; start: string; end: string; quality: WindowQuality }

export type StudyEventImpact = {
  eventId: string
  event: StudyEvent
  windows: { anticipation: CalculatedWindow; reference: CalculatedWindow; immediate: CalculatedWindow; stabilized: CalculatedWindow; delayed: CalculatedWindow }
  anticipationMove: number | null
  immediateResponse: number | null
  shortTermResponse: number | null
  delayedIncrement: number | null
  cumulativeDelayedResponse: number | null
  logOddsResponse: number | null
  sensitivityShare: number
  counterfactualProbability: number | null
  attributedImpact: number | null
  qualityStatus: 'usable' | 'indeterminate'
  ordinaryMovement: { classification: 'unusually large' | 'ordinary' | 'not detectable' | 'indeterminate'; threshold: number | null; sampleCount: number }
  overlaps: string[]
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

export type CampaignSummary = { firstProbability: number; finalProbability: number; netMovement: number; lowProbability: number; highProbability: number; observations: number }
export type SeriesAudit = { observations: number; duplicateTimestamps: string[]; missingBuckets: string[]; outOfOrderRows: number; coverageStart: string; coverageEnd: string }

export const MONTHS_PROFILE: MeasurementProfile = {
  id: 'months-hourly-v1', label: 'Months / hourly', cadenceMinutes: 60,
  anticipation: { startHours: -84, endHours: -12 }, reference: { startHours: -12, endHours: 0 }, immediate: { startHours: 0, endHours: 6 }, stabilized: { startHours: 18, endHours: 36 }, delayed: { startHours: 48, endHours: 72 },
  quality: { minimumCoverage: 0.6, maximumGapShare: 0.5, minimumDistinctUpdates: 3, maximumSpread: 0.2 }, tieThreshold: 0.01,
}

export const LEGACY_ELECTION_PROFILE: MeasurementProfile = {
  ...MONTHS_PROFILE, id: 'election-legacy-hourly-v1', label: 'Legacy election hourly windows', quality: { minimumCoverage: 0, maximumGapShare: 1, minimumDistinctUpdates: 1 }, tieThreshold: 0,
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const logit = (probability: number) => Math.log(clamp(probability, 0.000001, 0.999999) / (1 - clamp(probability, 0.000001, 0.999999)))
const sigmoid = (value: number) => 1 / (1 + Math.exp(-value))

export const normalizeContractProbability = (nativeYesProbability: number, selectedPerspective: 'YES' | 'NO') => {
  if (!Number.isFinite(nativeYesProbability) || nativeYesProbability < 0 || nativeYesProbability > 1) throw new Error('Contract probability must be between 0 and 1.')
  return selectedPerspective === 'YES' ? nativeYesProbability : 1 - nativeYesProbability
}

export const normalizeObservationPerspective = (point: MarketSeriesPoint, selectedPerspective: 'YES' | 'NO'): MarketSeriesPoint => selectedPerspective === 'YES' ? point : {
  ...point,
  probability: normalizeContractProbability(point.probability, 'NO'),
  rawPrice: point.rawPrice === undefined ? undefined : normalizeContractProbability(point.rawPrice, 'NO'),
  bid: point.ask === undefined ? undefined : normalizeContractProbability(point.ask, 'NO'),
  ask: point.bid === undefined ? undefined : normalizeContractProbability(point.bid, 'NO'),
}

const median = (values: number[]) => {
  if (values.length === 0) throw new Error('An event window has no market observations.')
  const ordered = [...values].sort((a, b) => a - b)
  const middle = Math.floor(ordered.length / 2)
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2
}

const samplesBetween = (points: MarketSeriesPoint[], start: number, end: number) => points.filter((point) => {
  const timestamp = Date.parse(point.timestamp)
  return timestamp >= start && timestamp < end
})

export const parseMarketCsv = (csv: string): MarketSeriesPoint[] => {
  const lines = csv.trim().split(/\r?\n/)
  const header = lines[0]?.split(',') ?? []
  if (header[0] !== 'time' || header[1] !== 'q') throw new Error('Market data has an unexpected header.')
  const indexOf = (name: string) => header.indexOf(name)
  const optionalNumber = (values: string[], name: string) => {
    const index = indexOf(name)
    if (index < 0 || values[index] === '') return undefined
    const value = Number(values[index])
    return Number.isFinite(value) ? value : undefined
  }
  return lines.slice(1).map((line, index) => {
    const values = line.split(',')
    const timestamp = values[0]
    const probability = Number(values[1])
    if (!timestamp || !Number.isFinite(Date.parse(timestamp)) || !Number.isFinite(probability) || probability < 0 || probability > 1) throw new Error(`Market data has an invalid row at line ${index + 2}.`)
    const markType = values[indexOf('mark_type')] as MarkType | undefined
    return { timestamp, probability, rawPrice: optionalNumber(values, 'raw_price'), bid: optionalNumber(values, 'bid'), ask: optionalNumber(values, 'ask'), volume: optionalNumber(values, 'volume'), openInterest: optionalNumber(values, 'open_interest'), markType: markType || undefined, stale: values[indexOf('stale')] === 'true' }
  }).sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
}

export const parseHourlyMarketCsv = (csv: string): MarketSeriesPoint[] => {
  const points = parseMarketCsv(csv)
  if (points.length < 3000) throw new Error('Election market data is incomplete.')
  return points
}

export function normalizeObservationSeries(points: MarketSeriesPoint[], cadenceMinutes: number) {
  const cadence = cadenceMinutes * 60 * 1000
  const revisions = new Map<number, MarketSeriesPoint>()
  for (const point of points) {
    const bucket = Math.floor(Date.parse(point.timestamp) / cadence) * cadence
    const current = revisions.get(bucket)
    if (!current || Date.parse(point.timestamp) >= Date.parse(current.timestamp)) revisions.set(bucket, { ...point, timestamp: new Date(bucket).toISOString(), providerFlags: current ? [...(point.providerFlags ?? []), 'provider-revision'] : point.providerFlags })
  }
  return [...revisions.values()].sort((left, right) => Date.parse(left.timestamp) - Date.parse(right.timestamp))
}

export function auditSeries(points: MarketSeriesPoint[], cadenceMinutes = 60): SeriesAudit {
  if (!points.length) throw new Error('Market data is empty.')
  const cadence = cadenceMinutes * 60 * 1000
  const duplicateTimestamps: string[] = []
  const missingBuckets: string[] = []
  let outOfOrderRows = 0
  for (let index = 1; index < points.length; index += 1) if (Date.parse(points[index].timestamp) < Date.parse(points[index - 1].timestamp)) outOfOrderRows += 1
  const sorted = [...points].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
  const bucket = (timestamp: string) => Math.floor(Date.parse(timestamp) / cadence) * cadence
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = bucket(sorted[index - 1].timestamp)
    const current = bucket(sorted[index].timestamp)
    if (current === previous) duplicateTimestamps.push(new Date(current).toISOString())
    for (let missingTime = previous + cadence; missingTime < current; missingTime += cadence) missingBuckets.push(new Date(missingTime).toISOString())
  }
  return { observations: points.length, duplicateTimestamps, missingBuckets, outOfOrderRows, coverageStart: sorted[0].timestamp, coverageEnd: sorted[sorted.length - 1].timestamp }
}

export const summarizeCampaign = (points: MarketSeriesPoint[]): CampaignSummary => {
  if (points.length === 0) throw new Error('Election market data is empty.')
  const probabilities = points.map((point) => point.probability)
  return { firstProbability: probabilities[0], finalProbability: probabilities[probabilities.length - 1], netMovement: probabilities[probabilities.length - 1] - probabilities[0], lowProbability: Math.min(...probabilities), highProbability: Math.max(...probabilities), observations: points.length }
}

function calculateWindow(points: MarketSeriesPoint[], eventTime: number, offset: WindowOffset, profile: MeasurementProfile): CalculatedWindow {
  const hour = 60 * 60 * 1000
  const start = eventTime + offset.startHours * hour
  const end = eventTime + offset.endHours * hour
  const allSamples = samplesBetween(points, start, end)
  const samples = allSamples.filter((point) => !point.stale && point.markType !== 'carried' && Number.isFinite(point.probability))
  const expectedBuckets = Math.max(1, Math.round((end - start) / (profile.cadenceMinutes * 60 * 1000)))
  const tradedBuckets = samples.filter((point) => point.markType === 'trade' || point.markType === 'settlement' || !point.markType).length
  const quoteBuckets = samples.filter((point) => point.markType === 'midpoint').length
  const staleBuckets = allSamples.filter((point) => point.stale || point.markType === 'carried').length
  const distinctUpdates = new Set(samples.map((point) => point.timestamp)).size
  const totalVolume = samples.reduce((total, point) => total + (point.volume ?? 0), 0)
  const spreads = samples.flatMap((point) => point.bid !== undefined && point.ask !== undefined ? [point.ask - point.bid] : [])
  let maximumGapBuckets = 0
  const ordered = samples.map((point) => Date.parse(point.timestamp)).sort((a, b) => a - b)
  const cadenceMs = profile.cadenceMinutes * 60 * 1000
  for (let index = 1; index < ordered.length; index += 1) maximumGapBuckets = Math.max(maximumGapBuckets, Math.max(0, Math.round((ordered[index] - ordered[index - 1]) / cadenceMs) - 1))
  const coverage = samples.length / expectedBuckets
  const medianSpread = spreads.length ? median(spreads) : null
  const reasons: string[] = []
  if (coverage < profile.quality.minimumCoverage) reasons.push(`Only ${Math.round(coverage * 100)}% of expected buckets are usable.`)
  if (maximumGapBuckets > expectedBuckets * profile.quality.maximumGapShare) reasons.push('A stale gap spans more than the allowed share of the window.')
  if (distinctUpdates < profile.quality.minimumDistinctUpdates) reasons.push(`Fewer than ${profile.quality.minimumDistinctUpdates} distinct price updates are available.`)
  if (profile.quality.maximumSpread !== undefined && medianSpread !== null && medianSpread > profile.quality.maximumSpread) reasons.push('The median spread is wider than the study threshold.')
  return { level: samples.length && !reasons.length ? median(samples.map((point) => point.probability)) : null, start: new Date(start).toISOString(), end: new Date(end).toISOString(), quality: { expectedBuckets, validBuckets: samples.length, tradedBuckets, quoteBuckets, staleBuckets, coverage, maximumGapBuckets, medianSpread, totalVolume, distinctUpdates, status: reasons.length ? 'insufficient' : 'usable', reasons } }
}

const subtract = (a: number | null, b: number | null) => a === null || b === null ? null : a - b

export function calculateStudyEventImpact(points: MarketSeriesPoint[], event: StudyEvent, profile: MeasurementProfile, sensitivityShare = 0): StudyEventImpact {
  const eventTime = Date.parse(event.informationKnownAt)
  const windows = { anticipation: calculateWindow(points, eventTime, profile.anticipation, profile), reference: calculateWindow(points, eventTime, profile.reference, profile), immediate: calculateWindow(points, eventTime, profile.immediate, profile), stabilized: calculateWindow(points, eventTime, profile.stabilized, profile), delayed: calculateWindow(points, eventTime, profile.delayed, profile) }
  const shortTermResponse = subtract(windows.stabilized.level, windows.reference.level)
  const share = clamp(sensitivityShare, 0, 100)
  const counterfactualProbability = windows.stabilized.level === null || windows.reference.level === null ? null : sigmoid(logit(windows.stabilized.level) - (logit(windows.stabilized.level) - logit(windows.reference.level)) * share / 100)
  return { eventId: event.id, event, windows, anticipationMove: subtract(windows.reference.level, windows.anticipation.level), immediateResponse: subtract(windows.immediate.level, windows.reference.level), shortTermResponse, delayedIncrement: subtract(windows.delayed.level, windows.stabilized.level), cumulativeDelayedResponse: subtract(windows.delayed.level, windows.reference.level), logOddsResponse: windows.stabilized.level === null || windows.reference.level === null ? null : logit(windows.stabilized.level) - logit(windows.reference.level), sensitivityShare: share, counterfactualProbability, attributedImpact: windows.stabilized.level === null || counterfactualProbability === null ? null : windows.stabilized.level - counterfactualProbability, qualityStatus: Object.values(windows).every((window) => window.quality.status === 'usable') ? 'usable' : 'indeterminate', ordinaryMovement: { classification: 'indeterminate', threshold: null, sampleCount: 0 }, overlaps: [] }
}

export function detectEventOverlaps(events: StudyEvent[], profile: MeasurementProfile) {
  const spanStart = Math.min(profile.anticipation.startHours, profile.reference.startHours, profile.immediate.startHours, profile.stabilized.startHours, profile.delayed.startHours)
  const spanEnd = Math.max(profile.anticipation.endHours, profile.reference.endHours, profile.immediate.endHours, profile.stabilized.endHours, profile.delayed.endHours)
  const hour = 60 * 60 * 1000
  const overlaps = new Map(events.map((event) => [event.id, [] as string[]]))
  for (let left = 0; left < events.length; left += 1) for (let right = left + 1; right < events.length; right += 1) {
    const leftTime = Date.parse(events[left].informationKnownAt)
    const rightTime = Date.parse(events[right].informationKnownAt)
    if (leftTime + spanStart * hour < rightTime + spanEnd * hour && rightTime + spanStart * hour < leftTime + spanEnd * hour) {
      overlaps.get(events[left].id)!.push(events[right].id)
      overlaps.get(events[right].id)!.push(events[left].id)
    }
  }
  return overlaps
}

export function calculateStudyImpacts(points: MarketSeriesPoint[], events: StudyEvent[], profile: MeasurementProfile, shares: Record<string, number> = {}) {
  const overlaps = detectEventOverlaps(events, profile)
  const horizonHours = (profile.stabilized.startHours + profile.stabilized.endHours - profile.reference.startHours - profile.reference.endHours) / 2
  const horizonBuckets = Math.max(1, Math.round(horizonHours * 60 / profile.cadenceMinutes))
  const excluded = events.map((event) => Date.parse(event.informationKnownAt))
  const exclusionRadius = Math.max(Math.abs(profile.anticipation.startHours), profile.delayed.endHours) * 3_600_000
  const ordinaryChanges: number[] = []
  for (let index = 0; index + horizonBuckets < points.length; index += horizonBuckets) {
    const startTime = Date.parse(points[index].timestamp)
    const endPoint = points[index + horizonBuckets]
    if (points[index].stale || endPoint.stale || excluded.some((eventTime) => Math.abs(startTime - eventTime) <= exclusionRadius)) continue
    ordinaryChanges.push(Math.abs(endPoint.probability - points[index].probability))
  }
  const orderedChanges = [...ordinaryChanges].sort((left, right) => left - right)
  const threshold = orderedChanges.length ? orderedChanges[Math.min(orderedChanges.length - 1, Math.floor(orderedChanges.length * 0.9))] : null
  return events.map((event) => {
    const impact = calculateStudyEventImpact(points, event, profile, shares[event.id] ?? 0)
    const classification: StudyEventImpact['ordinaryMovement']['classification'] = impact.shortTermResponse === null || threshold === null ? 'indeterminate' : Math.abs(impact.shortTermResponse) <= profile.tieThreshold ? 'not detectable' : Math.abs(impact.shortTermResponse) > threshold ? 'unusually large' : 'ordinary'
    return { ...impact, ordinaryMovement: { classification, threshold, sampleCount: ordinaryChanges.length }, overlaps: overlaps.get(event.id) ?? [] }
  })
}

export const calculateEventImpact = (points: MarketSeriesPoint[], event: ImpactEventDefinition, attributionShare = event.attributionShare): EventImpact => {
  const eventTime = Date.parse(event.timestamp)
  const hour = 60 * 60 * 1000
  const beforeSamples = samplesBetween(points, eventTime - 12 * hour, eventTime).map((point) => point.probability)
  const immediateSamples = samplesBetween(points, eventTime, eventTime + 6 * hour).map((point) => point.probability)
  const stabilizedSamples = samplesBetween(points, eventTime + 18 * hour, eventTime + 36 * hour).map((point) => point.probability)
  const followThroughSamples = samplesBetween(points, eventTime + 48 * hour, eventTime + 72 * hour).map((point) => point.probability)
  const beforeProbability = median(beforeSamples)
  const immediateProbability = median(immediateSamples)
  const stabilizedProbability = median(stabilizedSamples)
  const followThroughProbability = median(followThroughSamples)
  const share = clamp(attributionShare, 0, 100)
  const attributedLogOdds = (logit(stabilizedProbability) - logit(beforeProbability)) * share / 100
  const counterfactualProbability = sigmoid(logit(stabilizedProbability) - attributedLogOdds)
  return { ...event, attributionShare: share, beforeProbability, immediateProbability, stabilizedProbability, followThroughProbability, immediateMovement: immediateProbability - beforeProbability, observedMovement: stabilizedProbability - beforeProbability, followThroughMovement: followThroughProbability - beforeProbability, attributedImpact: stabilizedProbability - counterfactualProbability, counterfactualProbability, samples: { before: beforeSamples.length, immediate: immediateSamples.length, stabilized: stabilizedSamples.length, followThrough: followThroughSamples.length } }
}

export const calculateEventImpacts = (points: MarketSeriesPoint[], events: ImpactEventDefinition[], attributionShares: Record<string, number> = {}) => events.map((event) => calculateEventImpact(points, event, attributionShares[event.id] ?? event.attributionShare))
export const rankBySignedImpact = (impacts: EventImpact[]) => [...impacts].sort((a, b) => b.observedMovement - a.observedMovement)

export const moveRankedItem = (order: string[], id: string, destinationIndex: number) => {
  const sourceIndex = order.indexOf(id)
  if (sourceIndex < 0) return order
  const next = [...order]
  next.splice(sourceIndex, 1)
  next.splice(clamp(destinationIndex, 0, next.length), 0, id)
  return next
}

export const scoreImpactRanking = (userOrder: string[], marketOrder: string[]) => {
  if (userOrder.length !== marketOrder.length || new Set(userOrder).size !== userOrder.length || marketOrder.some((id) => !userOrder.includes(id))) throw new Error('Impact rankings must contain the same unique events.')
  const marketRanks = new Map(marketOrder.map((id, index) => [id, index]))
  const distance = userOrder.reduce((total, id, index) => total + Math.abs(index - marketRanks.get(id)!), 0)
  const maximumDistance = Math.floor(userOrder.length * userOrder.length / 2)
  return Math.round((1 - distance / maximumDistance) * 100)
}

export function createTieGroups(impacts: StudyEventImpact[], threshold: number, boundaryTolerance = 0) {
  const usable = impacts.filter((impact) => impact.shortTermResponse !== null).sort((a, b) => b.shortTermResponse! - a.shortTermResponse!)
  const groups: string[][] = []
  for (const impact of usable) {
    const last = groups[groups.length - 1]
    const previous = last ? usable.find((candidate) => candidate.eventId === last[0]) : undefined
    if (last && previous && Math.abs(previous.shortTermResponse! - impact.shortTermResponse!) <= threshold + boundaryTolerance) last.push(impact.eventId)
    else groups.push([impact.eventId])
  }
  return groups
}

export function pairwiseAgreement(userOrder: string[], tieGroups: string[][]) {
  const marketGroup = new Map(tieGroups.flatMap((group, groupIndex) => group.map((id) => [id, groupIndex] as const)))
  let agreed = 0
  let comparable = 0
  for (let left = 0; left < userOrder.length; left += 1) for (let right = left + 1; right < userOrder.length; right += 1) {
    const leftGroup = marketGroup.get(userOrder[left])
    const rightGroup = marketGroup.get(userOrder[right])
    if (leftGroup === undefined || rightGroup === undefined || leftGroup === rightGroup) continue
    comparable += 1
    if (leftGroup < rightGroup) agreed += 1
  }
  return { agreed, comparable, percent: comparable ? Math.round(agreed / comparable * 100) : null }
}
