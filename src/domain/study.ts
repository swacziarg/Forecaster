export type StudyStatus = 'draft' | 'data-verified' | 'editorial-review' | 'approved' | 'published' | 'amended' | 'retired'
export type TimestampPrecision = 'minute' | 'hour' | 'day' | 'interval'
export type PublishedPrecision = 'instant' | 'day' | 'unknown'
export type ExpectedDirection = 'positive' | 'negative' | 'ambiguous'
export type AttributionAssessment = 'likely dominant' | 'mixed' | 'weak' | 'indeterminate'
export type SourceRole = 'primary' | 'corroborating' | 'coverage' | 'competing' | 'retrospective'
export type MarkType = 'trade' | 'midpoint' | 'carried' | 'settlement'

export type Source = {
  id: string
  title: string
  publisher: string
  url: string
  publishedAt: string
  /** Existing ISO timestamps remain exact by default; date-only values are conservative day intervals. */
  publishedPrecision?: PublishedPrecision
  retrievedAt: string
  archivedUrl?: string
  snapshotHash?: string
  updatedAt?: string
  correctionStatus?: 'none' | 'corrected' | 'retracted'
  supersedesSourceId?: string
}

export type EventClaim = {
  id: string
  text: string
  knownAt: string
  sourceIds: string[]
  visibility: 'pre-reveal' | 'retrospective'
}

export type StudyEvent = {
  id: string
  title: string
  shortTitle: string
  occurredAt: string
  scheduledFor?: string
  informationKnownAt: string
  precision: TimestampPrecision
  timezone: string
  dateLabel: string
  category: string
  mechanism: string
  expectedDirection: ExpectedDirection
  claims: EventClaim[]
  sourceRoles: { sourceId: string; role: SourceRole }[]
  retrospectiveInterpretation: string
  competingExplanation: string
  attributionAssessment: AttributionAssessment
  legacy?: { confidence: 'High' | 'Medium' | 'Low'; attributionShare: number }
}

export type WindowOffset = { startHours: number; endHours: number }

export type MeasurementProfile = {
  id: string
  label: string
  cadenceMinutes: number
  anticipation: WindowOffset
  reference: WindowOffset
  immediate: WindowOffset
  stabilized: WindowOffset
  delayed: WindowOffset
  quality: {
    minimumCoverage: number
    maximumGapShare: number
    minimumDistinctUpdates: number
    maximumSpread?: number
  }
  tieThreshold: number
}

export type StudyPresentation = {
  topicLabel: string
  selectedContractShort: string
  selectedContractLong: string
  seriesLabel: string
  positiveLabel: string
  negativeLabel: string
  positiveShortLabel?: string
  negativeShortLabel?: string
  neutralLabel: string
  eventNoun: string
  timezone: string
  accent: string
  zoomChoices: { label: string; hours: number | null }[]
}

export type Market = {
  id: string
  provider: string
  title: string
  rules: string
  openedAt: string
  closedAt: string
  settledAt?: string
  status: 'open' | 'closed' | 'settled'
  resolutionSourceUrl: string
  marketUrl: string
  volume?: number
}

export type Contract = {
  id: string
  proposition: string
  nativeSide: 'YES' | 'NO'
  selectedPerspective: 'YES' | 'NO'
  resolution?: 'YES' | 'NO'
}

export type Dataset = {
  id: string
  provider: string
  path: string
  rawPath: string
  marketMetadataPath: string
  manifestPath: string
  rawSha256: string
  marketMetadataSha256: string
  normalizedSha256: string
  retrievedAt: string
  coverageStart: string
  coverageEnd: string
  fullMarketLifetime: boolean
  cadenceMinutes: number
  transformVersion: string
  provenanceUrl: string
  requestParameters: string
}

export type ContextMarker = {
  id: string
  timestamp: string
  title: string
  explanation: string
  sourceUrl: string
}

export type Study = {
  id: string
  slug: string
  category: 'Politics' | 'Culture' | 'Macroeconomics' | 'Sports' | 'Crypto'
  version: number
  status: StudyStatus
  legacyException?: boolean
  question: string
  orientation: string
  market: Market
  contract: Contract
  dataset: Dataset
  measurementProfile: MeasurementProfile
  measurementNotes?: string[]
  presentation: StudyPresentation
  sources: Source[]
  events: StudyEvent[]
  background?: { title: string; claims: EventClaim[] }
  contextMarkers: ContextMarker[]
  publishedAt?: string
  conclusion?: { title: string; text: string; sourceId: string }
}

const DAY_MS = 24 * 60 * 60 * 1000
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/
const PUBLISHED_PRECISIONS = new Set<PublishedPrecision>(['instant', 'day', 'unknown'])
const parseDate = (value: unknown) => typeof value === 'string' ? Date.parse(value) : Number.NaN
const validDate = (value: unknown) => Number.isFinite(parseDate(value))

export function sourcePublicationPrecision(source: Pick<Source, 'publishedAt' | 'publishedPrecision'>): PublishedPrecision {
  if (source.publishedPrecision === 'unknown') return 'unknown'
  if (source.publishedPrecision === 'day') return 'day'
  if (source.publishedPrecision === 'instant') return typeof source.publishedAt === 'string' && !DATE_ONLY.test(source.publishedAt) && validDate(source.publishedAt) ? 'instant' : 'unknown'
  if (source.publishedPrecision !== undefined) return 'unknown'
  if (typeof source.publishedAt === 'string' && DATE_ONLY.test(source.publishedAt)) return 'day'
  return validDate(source.publishedAt) ? 'instant' : 'unknown'
}

/** Returns a conservative upper bound, not an invented publication instant. */
export function sourcePublicationUpperBound(source: Pick<Source, 'publishedAt' | 'publishedPrecision'>): number | null {
  const precision = sourcePublicationPrecision(source)
  if (precision === 'unknown') return null
  if (precision === 'instant') {
    const timestamp = parseDate(source.publishedAt)
    return Number.isFinite(timestamp) ? timestamp : null
  }
  const datePart = typeof source.publishedAt === 'string' ? source.publishedAt.slice(0, 10) : ''
  const dayStart = parseDate(`${datePart}T00:00:00.000Z`)
  return Number.isFinite(dayStart) ? dayStart + DAY_MS : null
}

export function sourceWasAvailableBy(source: Pick<Source, 'publishedAt' | 'publishedPrecision'>, cutoff: string) {
  const upperBound = sourcePublicationUpperBound(source)
  const cutoffTimestamp = parseDate(cutoff)
  return upperBound !== null && Number.isFinite(cutoffTimestamp) && upperBound <= cutoffTimestamp
}

export function validateStudy(study: Study) {
  const errors: string[] = []
  if (!study.legacyException && (study.events.length < 5 || study.events.length > 10)) errors.push('Studies must contain five to ten events.')
  if (new Set(study.events.map((event) => event.id)).size !== study.events.length) errors.push('Event IDs must be unique.')
  if (new Set(study.sources.map((source) => source.id)).size !== study.sources.length) errors.push('Source IDs must be unique.')
  const sources = new Map(study.sources.map((source) => [source.id, source]))
  if (study.conclusion && !sources.has(study.conclusion.sourceId)) errors.push('Study conclusion references a missing source.')

  if (study.background) {
    const cutoff = Math.min(...study.events.map((event) => Date.parse(event.informationKnownAt)))
    for (const claim of study.background.claims) {
      if (claim.visibility !== 'pre-reveal' || !validDate(claim.knownAt) || Date.parse(claim.knownAt) > cutoff) errors.push(`Background claim ${claim.id} breaches the hindsight firewall.`)
      if (!claim.sourceIds.length) errors.push(`Background claim ${claim.id} requires a source.`)
      for (const id of claim.sourceIds) {
        const source = sources.get(id)
        if (!source || !sourceWasAvailableBy(source, claim.knownAt)) errors.push(`Background claim ${claim.id} references a missing or later source.`)
      }
    }
  }

  for (const source of study.sources) {
    const declaredPrecision = source.publishedPrecision
    if (declaredPrecision !== undefined && !PUBLISHED_PRECISIONS.has(declaredPrecision)) errors.push(`Source ${source.id} has an invalid publication precision.`)
    if (declaredPrecision === 'instant' && typeof source.publishedAt === 'string' && DATE_ONLY.test(source.publishedAt)) errors.push(`Source ${source.id} declares instant publication precision for a date-only value.`)
    if ((declaredPrecision !== 'unknown' && sourcePublicationPrecision(source) === 'unknown') || !validDate(source.retrievedAt)) errors.push(`Source ${source.id} must have a parseable publication timestamp or an explicit unknown publication precision, plus a parseable retrieval timestamp.`)
    if (!source.archivedUrl && !source.snapshotHash) errors.push(`Source ${source.id} must have an archive URL or snapshot hash.`)
  }

  for (const event of study.events) {
    if (!validDate(event.occurredAt) || !validDate(event.informationKnownAt)) errors.push(`Event ${event.id} has an invalid timestamp.`)
    if (Date.parse(event.occurredAt) > Date.parse(event.informationKnownAt)) errors.push(`Event ${event.id} is known before it occurred.`)
    if (!event.timezone) errors.push(`Event ${event.id} requires a timezone.`)
    if (!study.legacyException && !event.sourceRoles.some((relationship) => relationship.role === 'primary')) errors.push(`Event ${event.id} requires a primary source.`)
    for (const relationship of event.sourceRoles) if (!sources.has(relationship.sourceId)) errors.push(`Event ${event.id} references missing source ${relationship.sourceId}.`)
    for (const claim of event.claims) {
      if (!validDate(claim.knownAt)) errors.push(`Claim ${claim.id} has an invalid known-at timestamp.`)
      if (claim.visibility === 'pre-reveal' && Date.parse(claim.knownAt) > Date.parse(event.informationKnownAt)) errors.push(`Claim ${claim.id} breaches the hindsight firewall.`)
      for (const sourceId of claim.sourceIds) {
        const source = sources.get(sourceId)
        if (!source) errors.push(`Claim ${claim.id} references missing source ${sourceId}.`)
        else if (claim.visibility === 'pre-reveal' && !sourceWasAvailableBy(source, event.informationKnownAt)) {
          const precision = sourcePublicationPrecision(source)
          if (precision === 'unknown') errors.push(`Claim ${claim.id} cannot rely on source ${sourceId} with unknown publication time.`)
          else if (precision === 'day') errors.push(`Claim ${claim.id} relies on a date-only source ${sourceId} whose publication day does not establish the precise pre-reveal cutoff.`)
          else errors.push(`Claim ${claim.id} relies on a later source.`)
        }
      }
    }
  }

  return errors
}

export function assertValidStudy(study: Study) {
  const errors = validateStudy(study)
  if (errors.length) throw new Error(errors.join('\n'))
  return study
}
