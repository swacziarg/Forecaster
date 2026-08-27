import {
  calculateForecast,
  modelFromScenario,
  rebalanceImportance,
  scoreForecastPath,
  scoreProbability,
  setDirection,
  totalImportance,
} from './engine.ts'
import type { FactorDefinition, Scenario } from './types.ts'

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(`Test failed: ${message}`)
}

const approximately = (left: number, right: number, tolerance = 0.000001) => Math.abs(left - right) <= tolerance
const briefing = {
  status: 'A test status.',
  developments: ['A test development.'],
  yesCase: 'A test argument for YES.',
  noCase: 'A test argument against YES.',
  stakes: 'A test consequence.',
  sources: [{ label: 'Test source', url: 'https://example.com' }],
}
const factor = (id: string, index: number): FactorDefinition => ({
  id,
  label: `Factor ${index + 1}`,
  shortLabel: `F${index + 1}`,
  description: 'A test factor.',
  observation: 'A test scenario lens.',
  cue: 'If this factor is informative, it makes the event…',
  narrative: {
    context: 'A test event context.',
    yesCase: 'A test case for YES.',
    noCase: 'A test case against YES.',
    consequence: 'A test consequence.',
  },
  observations: {
    '60d': { reading: '0.2 signal', context: 'Test reading.', signal: 0.2 },
    '45d': { reading: '0.2 signal', context: 'Test reading.', signal: 0.2 },
    '30d': { reading: '0.2 signal', context: 'Test reading.', signal: 0.2 },
    '15d': { reading: '0.2 signal', context: 'Test reading.', signal: 0.2 },
  },
})

const testScenario: Scenario = {
  id: 'test-market',
  title: 'Test market',
  shortTitle: 'Test market',
  question: 'Will the test market resolve yes?',
  category: 'Economics',
  categoryTone: 'blue',
  dek: 'A test market.',
  context: 'A test market for pure engine behavior.',
  resolutionDate: 'Jan 1, 2027',
  resolutionTimestamp: '2027-01-01T00:00:00.000Z',
  outcome: true,
  outcomeLabel: 'Kalshi settled YES.',
  resolutionBriefing: {
    summary: 'A test result.',
    consequence: 'A test consequence.',
    sources: [{ label: 'Test result source', url: 'https://example.com/result' }],
  },
  checkpoints: [
    { id: '60d', label: '60 days before', shortLabel: '60d', date: 'Nov 2, 2026', cutoffTimestamp: '2026-11-02T00:00:00.000Z', marketProbability: 40, briefing },
    { id: '45d', label: '45 days before', shortLabel: '45d', date: 'Nov 17, 2026', cutoffTimestamp: '2026-11-17T00:00:00.000Z', marketProbability: 45, briefing },
    { id: '30d', label: '30 days before', shortLabel: '30d', date: 'Dec 2, 2026', cutoffTimestamp: '2026-12-02T00:00:00.000Z', marketProbability: 50, briefing },
    { id: '15d', label: '15 days before', shortLabel: '15d', date: 'Dec 17, 2026', cutoffTimestamp: '2026-12-17T00:00:00.000Z', marketProbability: 55, briefing },
  ],
  marketHistory: [
    { label: '60d', probability: 40 },
    { label: '45d', probability: 45 },
    { label: '30d', probability: 50 },
    { label: '15d', probability: 55 },
  ],
  factors: Array.from({ length: 5 }, (_, index) => factor(`factor-${index + 1}`, index)),
  source: {
    provider: 'Kalshi',
    ticker: 'TEST-MARKET',
    eventTicker: 'TEST-EVENT',
    seriesTicker: 'TEST-SERIES',
    fetchedAt: '2026-08-26T00:00:00.000Z',
    sourceUrl: 'https://external-api.kalshi.com/trade-api/v2/markets/TEST-MARKET',
    volume: 0,
    openInterest: 0,
  },
  live: true,
}

const factorIds = testScenario.factors.map((item) => item.id)
const initial = modelFromScenario(testScenario)

assert(totalImportance(initial) === 100, 'scenario defaults must allocate exactly 100 points')

const rebalanced = rebalanceImportance(initial, 'factor-2', 55, factorIds)
assert(totalImportance(rebalanced) === 100, 'changing one weight must preserve the 100-point budget')
assert(rebalanced.beliefs['factor-2'].importance === 55, 'the requested factor weight must be applied')
assert(Object.values(rebalanced.beliefs).every((belief) => Number.isInteger(belief.importance)), 'point allocations must remain whole numbers')

const neutralModel = { ...initial, beliefs: Object.fromEntries(Object.entries(initial.beliefs).map(([id, belief]) => [id, { ...belief, direction: 'neutral' as const }])) }
const neutralForecast = calculateForecast(testScenario, '60d', neutralModel)
assert(approximately(neutralForecast.userProbability, neutralForecast.marketProbability), 'neutral directions should leave the market baseline unchanged')

const changedDirection = setDirection(neutralModel, 'factor-2', 'less_likely')
const changedForecast = calculateForecast(testScenario, '60d', changedDirection)
assert(changedForecast.userProbability < neutralForecast.userProbability, 'a less-likely belief should move the forecast downward')

const decision = {
  checkpointId: '60d' as const,
  cutoffDate: 'Jul 8, 2024',
  marketProbability: neutralForecast.marketProbability,
  userProbability: changedForecast.userProbability,
  model: changedDirection,
  contributions: changedForecast.contributions,
}
const path = scoreForecastPath([decision], true)
assert(path.checkpoints === 1, 'path scoring should count locked decisions')
assert(path.user.brier >= 0 && path.market.brier >= 0, 'Brier scores must be non-negative')
assert(approximately(scoreProbability(1, true).brier, 0), 'a certain correct forecast should have zero Brier error')

console.log('forecast engine tests passed')
