import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { auditSeries, calculateEventImpact, calculateEventImpacts, calculateStudyEventImpact, calculateStudyImpacts, createTieGroups, LEGACY_ELECTION_PROFILE, MONTHS_PROFILE, moveRankedItem, normalizeContractProbability, normalizeObservationPerspective, normalizeObservationSeries, pairwiseAgreement, parseHourlyMarketCsv, parseMarketCsv, rankBySignedImpact, scoreImpactRanking, summarizeCampaign, type ImpactEventDefinition, type MarketSeriesPoint } from './eventStudy.ts'
import { electionEvents, electionStudy } from '../data/election2024.ts'
import { oscarsStudy } from '../data/oscars2026.ts'
import { fedStudy } from '../data/fed2024.ts'
import { eaglesStudy } from '../data/eagles2025.ts'
import { bitcoinStudy } from '../data/bitcoin2024.ts'
import { bidenDropoutStudy } from '../data/bidenDropout2024.ts'
import { studyFromLocation, studyRegistry } from '../data/studies.ts'
import { validateStudy, type Study, type StudyEvent } from './study.ts'

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(`Test failed: ${message}`)
}

const equal = (actual: unknown, expected: unknown, message: string) => assert(actual === expected, `${message}: expected ${String(expected)}, received ${String(actual)}`)
const close = (actual: number | null, expected: number, message: string) => assert(actual !== null && Math.abs(actual - expected) < 1e-9, `${message}: expected ${expected}, received ${String(actual)}`)

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

const boundaryCsv = 'time,q\n2024-01-01T00:00:00Z,0\n2024-01-01T01:00:00Z,1'
equal(parseMarketCsv(boundaryCsv)[0].probability, 0, 'accepts a zero settlement probability')
equal(parseMarketCsv(boundaryCsv)[1].probability, 1, 'accepts a one settlement probability')
close(normalizeContractProbability(0.7, 'YES'), 0.7, 'normalizes a selected YES contract')
close(normalizeContractProbability(0.7, 'NO'), 0.3, 'normalizes a selected NO contract')
const noObservation = normalizeObservationPerspective({ timestamp: '2024-01-01T00:00:00Z', probability: 0.7, rawPrice: 0.7, bid: 0.68, ask: 0.72 }, 'NO')
close(noObservation.probability, 0.3, 'normalizes a NO observation probability')
close(noObservation.bid ?? null, 0.28, 'turns a YES ask into the selected NO bid')
close(noObservation.ask ?? null, 0.32, 'turns a YES bid into the selected NO ask')

const audit = auditSeries([
  { timestamp: '2024-01-01T00:00:05Z', probability: 0.4 },
  { timestamp: '2024-01-01T00:00:55Z', probability: 0.4 },
  { timestamp: '2024-01-01T02:00:01Z', probability: 0.5 },
])
equal(audit.duplicateTimestamps.join(','), '2024-01-01T00:00:00.000Z', 'detects duplicate cadence buckets')
equal(audit.missingBuckets.join(','), '2024-01-01T01:00:00.000Z', 'detects missing cadence buckets')
const normalizedRevisions = normalizeObservationSeries([
  { timestamp: '2024-01-01T00:00:05Z', probability: 0.4 },
  { timestamp: '2024-01-01T00:00:55Z', probability: 0.45 },
], 60)
equal(normalizedRevisions.length, 1, 'collapses provider revisions in one cadence bucket')
close(normalizedRevisions[0].probability, 0.45, 'keeps the latest provider revision')
equal(normalizedRevisions[0].providerFlags?.[0], 'provider-revision', 'flags a collapsed provider revision')

const genericEvent: StudyEvent = {
  id: 'generic', title: 'Generic event', shortTitle: 'Generic', occurredAt: event.timestamp, informationKnownAt: event.timestamp, precision: 'hour', timezone: 'UTC', dateLabel: 'Jan 2', category: 'Official release', mechanism: 'A mechanism', expectedDirection: 'positive', claims: [], sourceRoles: [], retrospectiveInterpretation: '', competingExplanation: '', attributionAssessment: 'mixed',
}
const genericImpact = calculateStudyEventImpact(points, genericEvent, LEGACY_ELECTION_PROFILE, 50)
close(genericImpact.shortTermResponse, 0.1, 'calculates configurable short-term response')
close(genericImpact.delayedIncrement, 0, 'reports delayed movement incrementally')
assert(genericImpact.counterfactualProbability !== null && genericImpact.counterfactualProbability > 0.4 && genericImpact.counterfactualProbability < 0.5, 'keeps sensitivity explicitly hypothetical')

const thinPoints = points.map((point, index) => ({ ...point, stale: index % 2 === 0, markType: index % 2 === 0 ? 'carried' as const : 'midpoint' as const }))
equal(calculateStudyEventImpact(thinPoints, genericEvent, MONTHS_PROFILE).qualityStatus, 'indeterminate', 'marks failed data windows indeterminate')

const tied = [
  { ...genericImpact, eventId: 'a', shortTermResponse: 0.04 },
  { ...genericImpact, eventId: 'b', shortTermResponse: 0.035 },
  { ...genericImpact, eventId: 'c', shortTermResponse: -0.02 },
]
const tieGroups = createTieGroups(tied, 0.01)
equal(tieGroups[0].join(','), 'a,b', 'groups indistinguishable responses')
equal(pairwiseAgreement(['a', 'b', 'c'], tieGroups).comparable, 2, 'excludes tied pairs from comparison')

equal(validateStudy(oscarsStudy).length, 0, 'validates the strict five-event Oscars study')
equal(validateStudy(electionStudy).length, 0, 'validates the documented legacy election exception')
for (const study of [fedStudy, eaglesStudy, bitcoinStudy, bidenDropoutStudy]) equal(validateStudy(study).length, 0, `validates ${study.slug}`)
equal(studyRegistry.length, 6, 'registers all six studies')
equal(studyRegistry[0].study.id, electionStudy.id, 'keeps the election first and default')
equal(studyFromLocation('/').study.id, electionStudy.id, 'routes the root to the election')
equal(studyFromLocation('/studies/bitcoin-100k-2024').study.id, bitcoinStudy.id, 'routes a named study')
equal(studyFromLocation('/studies/biden-dropout-24-days').study.id, bidenDropoutStudy.id, 'routes the new launch study')
const hindsightBreach = structuredClone(oscarsStudy)
hindsightBreach.events[0].claims[0].knownAt = '2026-01-01T00:00:00Z'
assert(validateStudy(hindsightBreach).some((message) => message.includes('hindsight firewall')), 'rejects claims learned after the event cutoff')

const electionPoints = parseHourlyMarketCsv(readFileSync(new URL('../../public/data/polymarket-2024-hourly.csv', import.meta.url), 'utf8'))
const electionAudit = auditSeries(electionPoints)
equal(electionAudit.observations, 3863, 'characterizes election observation count')
equal(electionAudit.duplicateTimestamps.join(','), '2024-10-02T14:00:00.000Z', 'characterizes the election duplicate bucket')
equal(electionAudit.missingBuckets.join(','), '2024-07-21T18:00:00.000Z,2024-11-05T22:00:00.000Z', 'characterizes the election missing buckets')
const electionImpacts = calculateEventImpacts(electionPoints, electionEvents)
const expectedElectionMoves: Record<string, number> = { 'trump-conviction': -0.02, 'first-debate': 0.03, 'assassination-attempt': 0.1, 'biden-withdraws': -0.02, 'harris-walz-ticket': -0.03, 'harris-trump-debate': -0.02925, 'vice-presidential-debate': 0.011, 'joe-rogan-interview': 0.0005, 'garbage-controversy': -0.018, 'iowa-poll': -0.0345 }
for (const impact of electionImpacts) close(impact.observedMovement, expectedElectionMoves[impact.id], `preserves ${impact.id} legacy output`)

const oscarsPoints = normalizeObservationSeries(parseMarketCsv(readFileSync(new URL('../../public/data/oscars-2026/kalshi-hourly.csv', import.meta.url), 'utf8')), 60)
equal(oscarsPoints.length, 4168, 'loads the complete normalized Oscars snapshot')
const oscarsImpacts = calculateStudyImpacts(oscarsPoints, oscarsStudy.events, oscarsStudy.measurementProfile)
const expectedOscarsMoves: Record<string, number> = { 'nbr-best-film': 0.13, 'critics-choice-best-picture': 0.04, 'golden-globes-picture': 0.035, 'oscar-nominations': -0.05, 'pga-top-prize': 0.055 }
for (const impact of oscarsImpacts) {
  close(impact.shortTermResponse, expectedOscarsMoves[impact.eventId], `preserves ${impact.eventId} generalized output`)
  assert(impact.ordinaryMovement.sampleCount > 0, `calculates an empirical baseline for ${impact.eventId}`)
}
equal(createTieGroups(oscarsImpacts, oscarsStudy.measurementProfile.tieThreshold).map((group) => group.join('+')).join(','), 'nbr-best-film,pga-top-prize,critics-choice-best-picture+golden-globes-picture,oscar-nominations', 'preserves the Oscars tie-aware ordering')

const hash = (value: Buffer | string) => createHash('sha256').update(value).digest('hex')
const allStudies = [electionStudy, oscarsStudy, fedStudy, eaglesStudy, bitcoinStudy, bidenDropoutStudy]
for (const study of allStudies) {
  const normalized = readFileSync(new URL(`../../public${study.dataset.path}`, import.meta.url))
  const raw = readFileSync(new URL(`../../public${study.dataset.rawPath}`, import.meta.url))
  const marketMetadata = readFileSync(new URL(`../../public${study.dataset.marketMetadataPath}`, import.meta.url))
  const manifest = JSON.parse(readFileSync(new URL(`../../public${study.dataset.manifestPath}`, import.meta.url), 'utf8'))
  equal(hash(normalized), study.dataset.normalizedSha256, `${study.slug} normalized hash matches`)
  equal(hash(raw), study.dataset.rawSha256, `${study.slug} raw hash matches`)
  equal(hash(marketMetadata), study.dataset.marketMetadataSha256, `${study.slug} market metadata hash matches`)
  equal(manifest.normalizedSha256, study.dataset.normalizedSha256, `${study.slug} manifest normalized hash matches`)
  equal(manifest.rawSha256, study.dataset.rawSha256, `${study.slug} manifest raw hash matches`)
  equal(manifest.marketMetadataSha256, study.dataset.marketMetadataSha256, `${study.slug} manifest market metadata hash matches`)
  const observations = parseMarketCsv(normalized.toString())
  assert(observations.every((point) => point.probability >= 0 && point.probability <= 1), `${study.slug} probabilities stay bounded`)
  assert(observations.every((point, index) => index === 0 || Date.parse(point.timestamp) >= Date.parse(observations[index - 1].timestamp)), `${study.slug} observations are chronological`)
  equal(Date.parse(observations[0].timestamp), Date.parse(study.dataset.coverageStart), `${study.slug} coverage starts as declared`)
  equal(Date.parse(observations[observations.length - 1].timestamp), Date.parse(study.dataset.coverageEnd), `${study.slug} coverage ends as declared`)
}

const generalizedGolden: Array<[Study, Record<string, number>]> = [
  [bidenDropoutStudy, { debate: 0.125, 'stay-in-race': -0.17, 'pelosi-clooney': 0.1575, 'trump-shooting': -0.1175, 'renewed-pressure': 0.48 }],
  [fedStudy, { 'july-jobs': 0.2775, 'july-cpi': -0.19, 'powell-jackson-hole': 0.04, 'august-jobs': -0.065, 'august-cpi': -0.1625 }],
  [eaglesStudy, { 'week1-packers': 0.0075, 'week2-falcons': -0.0195, 'week12-rams': 0.0135, 'week16-hurts-concussion': -0.0285, 'week17-division': -0.005, 'wild-card-packers': 0.036, 'divisional-rams': 0.05975, 'nfc-championship': 0.13975 }],
  [bitcoinStudy, { 'hong-kong-etfs': -0.1175, 'ether-etf-approval': 0.0025, 'mtgox-repayments': -0.03, 'fed-50-cut': 0.0275, 'ibit-options': -0.015, 'trump-election': -0.035, 'microstrategy-purchase': 0.26, 'gensler-departure': 0.0475 }],
]
for (const [study, golden] of generalizedGolden) {
  const observations = normalizeObservationSeries(parseMarketCsv(readFileSync(new URL(`../../public${study.dataset.path}`, import.meta.url), 'utf8')), study.dataset.cadenceMinutes)
  const impacts = calculateStudyImpacts(observations, study.events, study.measurementProfile)
  for (const impact of impacts) {
    close(impact.shortTermResponse, golden[impact.eventId], `${study.slug} preserves ${impact.eventId}`)
    equal(impact.qualityStatus, 'usable', `${study.slug} has usable windows for ${impact.eventId}`)
  }
}

const bidenPoints = normalizeObservationSeries(parseMarketCsv(readFileSync(new URL(`../../public${bidenDropoutStudy.dataset.path}`, import.meta.url), 'utf8')), 60)
equal(bidenPoints.length, 692, 'retains all Biden hourly observations')
equal(auditSeries(bidenPoints).missingBuckets.join(','), '2024-07-21T18:00:00.000Z', 'records the Biden settlement-hour gap without filling it')
const bidenImpacts = calculateStudyImpacts(bidenPoints, bidenDropoutStudy.events, bidenDropoutStudy.measurementProfile)
equal(createTieGroups(bidenImpacts, 0.01).map((group) => group.join('+')).join(','), 'renewed-pressure,pelosi-clooney,debate,trump-shooting,stay-in-race', 'freezes five distinct launch responses')
assert(bidenDropoutStudy.events.every((event) => Date.parse(event.informationKnownAt) < Date.parse('2024-07-21T17:46:00Z')), 'keeps the resolving announcement out of the five-card ranking')
const evidenceManifest = JSON.parse(readFileSync(new URL('../../docs/evidence/biden-dropout-2024/manifest.json', import.meta.url), 'utf8')) as Array<{ id: string; path: string; snapshotHash: string }>
for (const source of bidenDropoutStudy.sources) {
  const evidence = evidenceManifest.find((entry) => entry.id === source.id)
  assert(evidence, `retains a source snapshot for ${source.id}`)
  equal(hash(readFileSync(new URL(`../../${evidence!.path}`, import.meta.url))), source.snapshotHash, `verifies ${source.id} source snapshot`)
  equal(evidence!.snapshotHash, source.snapshotHash, `matches the ${source.id} evidence manifest`)
}
const badConclusion = structuredClone(bidenDropoutStudy)
badConclusion.conclusion!.sourceId = 'missing'
assert(validateStudy(badConclusion).some((error) => error.includes('conclusion')), 'rejects a conclusion without its original source')

equal(auditSeries(parseMarketCsv(readFileSync(new URL('../../public/data/eagles-2025/polymarket-hourly.csv', import.meta.url), 'utf8'))).missingBuckets.length, 2, 'records the Eagles provider gaps')
equal(auditSeries(parseMarketCsv(readFileSync(new URL('../../public/data/bitcoin-2024/polymarket-hourly.csv', import.meta.url), 'utf8'))).missingBuckets.length, 3, 'records the Bitcoin provider gaps')
assert(calculateStudyImpacts(normalizeObservationSeries(parseMarketCsv(readFileSync(new URL('../../public/data/bitcoin-2024/polymarket-hourly.csv', import.meta.url), 'utf8')), 60), bitcoinStudy.events, bitcoinStudy.measurementProfile).some((impact) => impact.overlaps.length > 0), 'discloses overlapping Bitcoin windows')

console.log('event study tests passed')
