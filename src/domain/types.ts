export type Direction = 'more_likely' | 'neutral' | 'less_likely'

export type ScenarioCategory = 'Economics' | 'Politics' | 'Technology' | 'Entertainment' | 'Sports'
export type CheckpointId = '60d' | '45d' | '30d' | '15d'

export type Checkpoint = {
  id: CheckpointId
  label: string
  shortLabel: string
  date: string
  cutoffTimestamp: string
  marketProbability: number
}

export type FactorObservation = {
  reading: string
  context: string
  signal: number
}

export type FactorDefinition = {
  id: string
  label: string
  shortLabel: string
  description: string
  cue: string
  observations: Record<CheckpointId, FactorObservation>
}

export type MarketPoint = {
  label: string
  probability: number
  timestamp?: string
  resolution?: boolean
}

export type KalshiSource = {
  provider: 'Kalshi'
  ticker: string
  eventTicker: string
  seriesTicker: string
  fetchedAt: string
  sourceUrl: string
  volume: number
  openInterest: number
}

export type Scenario = {
  id: string
  title: string
  shortTitle: string
  question: string
  category: ScenarioCategory
  categoryTone: 'green' | 'blue' | 'amber'
  dek: string
  context: string
  resolutionDate: string
  resolutionTimestamp: string
  outcome: boolean | null
  outcomeLabel: string
  checkpoints: Checkpoint[]
  marketHistory: MarketPoint[]
  factors: FactorDefinition[]
  source: KalshiSource
  live: true
}

export type HumanFactorBelief = {
  factorId: string
  importance: number
  direction: Direction
}

/** The user's explicit theory of an outcome at one checkpoint. */
export type HumanMentalModel = {
  beliefs: Record<string, HumanFactorBelief>
  totalImportance: number
}

export type ForecastContribution = {
  factorId: string
  label: string
  direction: Direction
  logOddsEffect: number
  probabilityDelta: number
}

export type ForecastResult = {
  marketProbability: number
  userProbability: number
  probabilityDelta: number
  contributions: ForecastContribution[]
}

export type ForecastDecision = {
  checkpointId: CheckpointId
  cutoffDate: string
  marketProbability: number
  userProbability: number
  model: HumanMentalModel
  contributions: ForecastContribution[]
}

export type ForecastRun = {
  scenarioId: string
  decisions: ForecastDecision[]
  startedAt: string
  completedAt?: string
}

export type ProbabilityScore = {
  brier: number
  logLoss: number
}

export type ForecastSkillReport = {
  user: ProbabilityScore
  market: ProbabilityScore
  userBeatMarketCount: number
  checkpoints: number
}
