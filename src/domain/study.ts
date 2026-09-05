export type StudyStatus = 'draft' | 'data-verified' | 'editorial-review' | 'approved' | 'published' | 'amended' | 'retired'
export type TimestampPrecision = 'minute' | 'hour' | 'day' | 'interval'
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
  presentation: StudyPresentation
  sources: Source[]
  events: StudyEvent[]
  contextMarkers: ContextMarker[]
  publishedAt?: string
  conclusion?: { title: string; text: string; sourceId: string }
}

const validDate = (value: string) => Number.isFinite(Date.parse(value))

export function validateStudy(study: Study) {
  const errors: string[] = []
  if (!study.legacyException && (study.events.length < 5 || study.events.length > 10)) errors.push('Studies must contain five to ten events.')
  if (new Set(study.events.map((event) => event.id)).size !== study.events.length) errors.push('Event IDs must be unique.')
  if (new Set(study.sources.map((source) => source.id)).size !== study.sources.length) errors.push('Source IDs must be unique.')
  const sources = new Map(study.sources.map((source) => [source.id, source]))
  if (study.conclusion && !sources.has(study.conclusion.sourceId)) errors.push('Study conclusion references a missing source.')

  for (const source of study.sources) {
    if (!validDate(source.publishedAt) || !validDate(source.retrievedAt)) errors.push(`Source ${source.id} must have parseable publication and retrieval timestamps.`)
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
        else if (claim.visibility === 'pre-reveal' && Date.parse(source.publishedAt) > Date.parse(event.informationKnownAt)) errors.push(`Claim ${claim.id} relies on a later source.`)
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
