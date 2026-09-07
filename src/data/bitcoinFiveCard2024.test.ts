import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { calculateStudyImpacts, createTieGroups, normalizeObservationPerspective, normalizeObservationSeries, pairwiseAgreement, parseMarketCsv } from '../domain/eventStudy.ts'
import { getPreRevealCard } from '../domain/dailyGame.ts'
import { validateStudy } from '../domain/study.ts'
import { bitcoinFiveCardStudy } from './bitcoinFiveCard2024.ts'

const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(`Bitcoin v2 test failed: ${message}`) }
const equal = (actual: unknown, expected: unknown, message: string) => assert(actual === expected, `${message}: expected ${String(expected)}, received ${String(actual)}`)
const hash = (value: Buffer | string) => createHash('sha256').update(value).digest('hex')
const readPublicText = (path: string) => readFileSync(new URL(`../../public${path}`, import.meta.url), 'utf8')
const readPublicBytes = (path: string): Buffer => readFileSync(new URL(`../../public${path}`, import.meta.url))

equal(validateStudy(bitcoinFiveCardStudy).length, 0, 'strict study validation')
equal(bitcoinFiveCardStudy.id, 'bitcoin-100k-2024-v2', 'distinct versioned ID')
equal(bitcoinFiveCardStudy.slug, 'bitcoin-100k-2024-five-card', 'distinct slug')
equal(bitcoinFiveCardStudy.version, 2, 'version')
equal(bitcoinFiveCardStudy.status, 'published', 'is published for the approved launch schedule')
equal(bitcoinFiveCardStudy.events.length, 5, 'five events')
equal(bitcoinFiveCardStudy.dataset.fullMarketLifetime, false, 'truthful partial-lifetime metadata')
equal(bitcoinFiveCardStudy.dataset.coverageEnd, '2024-12-05T04:00:00Z', 'coverage ends at retained provider byte')
equal(bitcoinFiveCardStudy.events.find((event) => event.id === 'hong-kong-etfs')?.informationKnownAt, '2024-05-01T00:00:00Z', 'HKEX conservative public-by cutoff')
equal(bitcoinFiveCardStudy.events.find((event) => event.id === 'mtgox-repayments')?.informationKnownAt, '2024-07-06T00:00:00Z', 'Mt. Gox conservative public-by cutoff')
equal(bitcoinFiveCardStudy.events.find((event) => event.id === 'microstrategy-purchase')?.informationKnownAt, '2024-11-12T08:01:01Z', 'SEC acceptance cutoff')
assert(bitcoinFiveCardStudy.events.every((event) => getPreRevealCard(bitcoinFiveCardStudy, event.id)?.sources.length === 1), 'all five events have eligible pre-reveal evidence')
assert(bitcoinFiveCardStudy.events.every((event) => event.claims.every((claim) => claim.visibility === 'pre-reveal')), 'all card claims are pre-reveal')

const normalized = readPublicText(bitcoinFiveCardStudy.dataset.path)
const raw = readPublicBytes(bitcoinFiveCardStudy.dataset.rawPath)
const metadata = readPublicBytes(bitcoinFiveCardStudy.dataset.marketMetadataPath)
const manifest = JSON.parse(readPublicText(bitcoinFiveCardStudy.dataset.manifestPath)) as Record<string, unknown>
equal(hash(normalized), bitcoinFiveCardStudy.dataset.normalizedSha256, 'normalized dataset digest')
equal(hash(raw), bitcoinFiveCardStudy.dataset.rawSha256, 'raw dataset digest')
equal(hash(metadata), bitcoinFiveCardStudy.dataset.marketMetadataSha256, 'market metadata digest')
equal(manifest.normalizedSha256, bitcoinFiveCardStudy.dataset.normalizedSha256, 'manifest normalized digest')
equal(manifest.rawSha256, bitcoinFiveCardStudy.dataset.rawSha256, 'manifest raw digest')
equal(manifest.marketMetadataSha256, bitcoinFiveCardStudy.dataset.marketMetadataSha256, 'manifest metadata digest')

const points = normalizeObservationSeries(parseMarketCsv(normalized).map((point) => normalizeObservationPerspective(point, bitcoinFiveCardStudy.contract.selectedPerspective)), bitcoinFiveCardStudy.dataset.cadenceMinutes)
const impacts = calculateStudyImpacts(points, bitcoinFiveCardStudy.events, bitcoinFiveCardStudy.measurementProfile)
equal(points.length, 6609, 'normalized observation count')
equal(impacts.length, 5, 'impact count')
assert(impacts.every((impact) => impact.qualityStatus === 'usable'), 'all 25 windows are usable')
equal(impacts.filter((impact) => impact.overlaps.length).map((impact) => impact.eventId).join(','), 'trump-election,microstrategy-purchase', 'only actual overlap is preserved')
equal(createTieGroups(impacts, bitcoinFiveCardStudy.measurementProfile.tieThreshold).map((group) => group.join('+')).join(','), 'fed-50-cut+mtgox-repayments,hong-kong-etfs,microstrategy-purchase+trump-election', 'corrected anchor tie groups')
equal(pairwiseAgreement(bitcoinFiveCardStudy.events.map((event) => event.id), createTieGroups(impacts, bitcoinFiveCardStudy.measurementProfile.tieThreshold)).comparable, 8, 'comparable pair count')

const cutoffBreach = structuredClone(bitcoinFiveCardStudy)
const hkex = cutoffBreach.sources.find((source) => source.id === 'hkex-spot-etfs')!
hkex.publishedAt = '2024-05-01'
hkex.publishedPrecision = 'day'
assert(validateStudy(cutoffBreach).some((message) => message.includes('date-only source hkex-spot-etfs')), 'source cutoff breach is rejected')

assert(bitcoinFiveCardStudy.conclusion?.sourceId === 'market-resolution', 'resolution is ending-only')
assert(!bitcoinFiveCardStudy.events.some((event) => event.id === 'threshold-crossing'), 'threshold crossing is excluded from scored cards')

console.log('bitcoin five-card playable draft tests passed')
