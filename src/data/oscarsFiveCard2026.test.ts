import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { calculateStudyImpacts, createTieGroups, normalizeObservationSeries, pairwiseAgreement, parseMarketCsv } from '../domain/eventStudy.ts'
import { getPreRevealCard } from '../domain/dailyGame.ts'
import { validateStudy } from '../domain/study.ts'
import { LocalDatasetAdapter } from './localDatasetAdapter.ts'
import { oscarsStudy } from './oscars2026.ts'
import { oscarsFiveCard2026Study } from './oscarsFiveCard2026.ts'

const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(`Test failed: ${message}`) }
const equal = (actual: unknown, expected: unknown, message: string) => assert(actual === expected, `${message}: expected ${String(expected)}, received ${String(actual)}`)
const near = (actual: number | null, expected: number, message: string) => assert(actual !== null && Math.abs(actual - expected) < 1e-9, `${message}: expected ${expected}, received ${String(actual)}`)
const sha256 = (value: Buffer | string) => createHash('sha256').update(value).digest('hex')

const study = oscarsFiveCard2026Study
equal(validateStudy(study).length, 0, 'v2 candidate passes strict Study validation')
equal(study.id, 'oscars-best-picture-2026-v2', 'uses the frozen v2 Study identity')
equal(study.version, 2, 'uses Study version two')
equal(study.slug, 'oscars-best-picture-2026-v2', 'uses a slug distinct from the v1 archive')
equal(study.status, 'editorial-review', 'remains a private editorial-review draft')
equal(study.market.id, 'KXOSCARPIC-26-ONE', 'preserves the exact Kalshi market')
equal(study.contract.id, 'KXOSCARPIC-26-ONE', 'preserves the exact contract identity')
equal(study.contract.selectedPerspective, 'YES', 'preserves the selected YES perspective')
equal(study.events.length, 5, 'contains exactly five cards')
equal(study.dataset.path, '/data/oscars-2026/kalshi-hourly.csv', 'reuses the unchanged current dataset path')
equal(study.dataset.normalizedSha256, '498a7ba35bb74924845de951b1a281ecf70382f4aff74f62f0529537c072eb54', 'preserves the normalized dataset digest')
assert(study.slug !== oscarsStudy.slug, 'does not collide with the v1 archive slug')

for (const event of study.events) {
  const card = getPreRevealCard(study, event.id)
  if (card === null) throw new Error(`Test failed: ${event.id} has no eligible pre-reveal card`)
  assert(card.brief.length > 0, `${event.id} has non-empty neutral source copy`)
  assert(!/[0-9]+(?:\.[0-9]+)?%/.test(card.brief), `${event.id} pre-reveal copy contains no market levels`)
  assert(!/stabilized|reference window|market moved|probability was/i.test(card.brief), `${event.id} pre-reveal copy contains no measured answer`)
  assert(card.sources.every((source) => source.id !== 'oscars-ending'), `${event.id} excludes the reveal-only ending source`)
  equal(event.claims[0].visibility, 'pre-reveal', `${event.id} claim is pre-reveal`)
  equal(event.claims[0].knownAt, event.informationKnownAt, `${event.id} claim cutoff matches its conservative anchor`)
  assert(event.sourceRoles.some((role) => role.role === 'primary'), `${event.id} has a primary source role`)
  assert(event.sourceRoles.some((role) => role.role === 'corroborating'), `${event.id} has independent corroboration`)
}

assert(study.conclusion?.sourceId === 'oscars-ending', 'ending is a separate sourced conclusion')
assert(!study.events.some((event) => event.claims.some((claim) => claim.text.includes('winner'))), 'ending language is excluded from pre-reveal claims')

const normalizedFile = readFileSync(new URL(`../../public${study.dataset.path}`, import.meta.url))
const rawFile = readFileSync(new URL(`../../public${study.dataset.rawPath}`, import.meta.url))
const metadataFile = readFileSync(new URL(`../../public${study.dataset.marketMetadataPath}`, import.meta.url))
equal(sha256(normalizedFile), study.dataset.normalizedSha256, 'normalized data digest matches the Study')
equal(sha256(rawFile), study.dataset.rawSha256, 'raw data digest matches the Study')
equal(sha256(metadataFile), study.dataset.marketMetadataSha256, 'market metadata digest matches the Study')

const points = normalizeObservationSeries(parseMarketCsv(normalizedFile.toString()), study.dataset.cadenceMinutes)
equal(points.length, 4168, 'reuses all 4,168 normalized observations')
const impacts = calculateStudyImpacts(points, study.events, study.measurementProfile)
assert(impacts.every((impact) => impact.qualityStatus === 'usable'), 'all five cards have five usable windows')
assert(impacts.every((impact) => Object.values(impact.windows).every((window) => window.quality.coverage === 1 && window.quality.maximumGapBuckets === 0)), 'all 25 windows have full coverage and no gaps')
assert(impacts.every((impact) => impact.overlaps.length === 0), 'the existing comparator reports no full-window overlap')
for (const impact of impacts) near(impact.shortTermResponse, ({ 'nbr-best-film': 0.13, 'critics-choice-best-picture': 0.04, 'golden-globes-picture': 0.03, 'oscar-nominations': -0.05, 'pga-top-prize': 0.05 } as Record<string, number>)[impact.eventId], `${impact.eventId} stabilized response`)

const tieGroups = createTieGroups(impacts, study.measurementProfile.tieThreshold)
equal(tieGroups.map((group) => group.join('+')).join(','), 'nbr-best-film,pga-top-prize,critics-choice-best-picture,golden-globes-picture,oscar-nominations', 'returns comparator tie groups without tuning the threshold')
const agreement = pairwiseAgreement(study.events.map((event) => event.id), tieGroups)
equal(`${agreement.agreed}/${agreement.comparable}`, '7/10', 'distinguishes seven agreed from ten comparable chronological pairs')

const marketAdapter = new LocalDatasetAdapter(study)
equal(marketAdapter.provider, 'Kalshi', 'adapter preserves the provider')
equal((await marketAdapter.getMarket({ marketId: study.market.id })).id, study.market.id, 'adapter returns the exact market')
equal((await marketAdapter.getContracts({ marketId: study.market.id }))[0].id, study.contract.id, 'adapter returns the exact contract')
const originalFetch = globalThis.fetch
globalThis.fetch = async (input) => {
  const requestedPath = String(input)
  if (requestedPath !== study.dataset.path) return new Response('', { status: 404 })
  return new Response(normalizedFile, { status: 200, headers: { 'content-type': 'text/csv' } })
}
try {
  const bundle = await marketAdapter.getSeries({ dataset: study.dataset, selectedPerspective: study.contract.selectedPerspective })
  equal(bundle.calculatedSha256, study.dataset.normalizedSha256, 'LocalDatasetAdapter verifies the normalized digest')
  equal(bundle.observations.length, points.length, 'LocalDatasetAdapter preserves normalization')
  equal(bundle.warnings.length, 1, 'adapter surfaces the retained missing-bucket warning')
  assert(bundle.warnings[0].includes('missing cadence bucket'), 'adapter warning names the actual data gap')
} finally {
  globalThis.fetch = originalFetch
}

const cutoffBreach = structuredClone(study)
cutoffBreach.sources.find((source) => source.id === 'nbr-2025')!.publishedAt = '2025-12-03T19:26:00Z'
assert(validateStudy(cutoffBreach).some((message) => message.includes('later source')), 'rejects a primary source published after its pre-reveal cutoff')
assert(getPreRevealCard(cutoffBreach, 'nbr-best-film') === null, 'hindsight-cutoff breach removes the affected pre-reveal card')

console.log('Oscars v2 playable draft tests passed')
