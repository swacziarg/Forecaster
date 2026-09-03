import { calculateEventImpact, moveRankedItem, parseHourlyMarketCsv, rankBySignedImpact, scoreImpactRanking, summarizeCampaign, type ImpactEventDefinition, type MarketSeriesPoint } from './eventStudy.ts'

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(`Test failed: ${message}`)
}

const equal = (actual: unknown, expected: unknown, message: string) => assert(actual === expected, `${message}: expected ${String(expected)}, received ${String(actual)}`)

const start = Date.parse('2024-01-01T00:00:00Z')
const points: MarketSeriesPoint[] = Array.from({ length: 110 }, (_, index) => ({
  timestamp: new Date(start + index * 60 * 60 * 1000).toISOString(),
  probability: index < 24 ? 0.4 : 0.5,
}))

const event: ImpactEventDefinition = {
  id: 'test', title: 'Test event', shortTitle: 'Test', timestamp: new Date(start + 24 * 60 * 60 * 1000).toISOString(), dateLabel: 'Jan 2', category: 'Campaign', summary: '', mechanism: '', expectedDirection: 'Ambiguous', interpretation: '', competingExplanation: '', confidence: 'High', attributionShare: 100,
  source: { label: 'Source', publisher: 'Publisher', url: 'https://example.com', publishedAt: '2024-01-02T00:00:00Z' },
}

const csvRows = ['time,q', ...Array.from({ length: 3001 }, (_, index) => `${new Date(start + index * 60 * 60 * 1000).toISOString()},0.5`)]
const parsed = parseHourlyMarketCsv(csvRows.join('\n'))
equal(parsed.length, 3001, 'parses every CSV row')
equal(parsed[0].probability, 0.5, 'parses probabilities')

const summary = summarizeCampaign(points)
equal(summary.firstProbability, 0.4, 'summarizes the opening probability')
equal(summary.finalProbability, 0.5, 'summarizes the final probability')
assert(Math.abs(summary.netMovement - 0.1) < 1e-9, 'summarizes the campaign movement')

const fullImpact = calculateEventImpact(points, event)
equal(fullImpact.beforeProbability, 0.4, 'uses the pre-event median')
equal(fullImpact.stabilizedProbability, 0.5, 'uses the stabilized median')
equal(fullImpact.followThroughProbability, 0.5, 'uses the 48-to-72-hour median')
assert(Math.abs(fullImpact.observedMovement - 0.1) < 1e-9, 'calculates observed movement')
assert(Math.abs(fullImpact.followThroughMovement - 0.1) < 1e-9, 'calculates follow-through movement')
assert(Math.abs(fullImpact.attributedImpact - 0.1) < 1e-9, 'attributes the full movement')
assert(Math.abs(fullImpact.counterfactualProbability - 0.4) < 1e-9, 'reverses the full log-odds shock')

const halfImpact = calculateEventImpact(points, event, 50)
assert(halfImpact.attributedImpact > 0, 'partial attribution has a positive effect')
assert(halfImpact.attributedImpact < 0.1, 'partial attribution stays below the observed movement')
assert(halfImpact.counterfactualProbability > 0.4, 'partial counterfactual stays above the starting price')
assert(halfImpact.counterfactualProbability < 0.5, 'partial counterfactual stays below the stabilized price')

equal(moveRankedItem(['a', 'b', 'c'], 'c', 0).join(','), 'c,a,b', 'moves a ranked item upward')
equal(moveRankedItem(['a', 'b', 'c'], 'a', 2).join(','), 'b,c,a', 'moves a ranked item downward')

const ranked = rankBySignedImpact([
  { ...fullImpact, id: 'small', observedMovement: 0.02 },
  { ...fullImpact, id: 'large-negative', observedMovement: -0.08 },
  { ...fullImpact, id: 'medium', observedMovement: 0.04 },
])
equal(ranked.map((item) => item.id).join(','), 'medium,small,large-negative', 'ranks market moves from most positive to most negative')
equal(scoreImpactRanking(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd']), 100, 'scores an exact ranking at 100')
equal(scoreImpactRanking(['d', 'c', 'b', 'a'], ['a', 'b', 'c', 'd']), 0, 'scores a reversed even-length ranking at zero')

console.log('event study tests passed')
