import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { calculateStudyImpacts, createTieGroups, normalizeObservationSeries, parseMarketCsv } from '../domain/eventStudy.ts'
import { getPreRevealCard } from '../domain/dailyGame.ts'
import { validateStudy } from '../domain/study.ts'
import { canada2025Study } from './canada2025.ts'

const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(`Canada playable draft test failed: ${message}`) }
const hash = (value: Buffer | string) => createHash('sha256').update(value).digest('hex')
const publicFile = (path: string) => readFileSync(`public${path}`)

assert(canada2025Study.id === 'canada-liberal-comeback-v2', 'uses the v2 study identity')
assert(canada2025Study.slug === 'canada-liberal-comeback', 'uses a unique playable slug')
assert(canada2025Study.version === 2 && canada2025Study.status === 'editorial-review', 'is a local review draft, not published')
assert(canada2025Study.market.id === '517586', 'uses the exact Canada market')
assert(canada2025Study.contract.selectedPerspective === 'YES', 'uses the exact YES perspective')
assert(validateStudy(canada2025Study).length === 0, 'passes strict Study validation')

const normalized = publicFile(canada2025Study.dataset.path)
const raw = publicFile(canada2025Study.dataset.rawPath)
const metadata = publicFile(canada2025Study.dataset.marketMetadataPath)
assert(hash(normalized) === canada2025Study.dataset.normalizedSha256, 'normalized CSV hash matches the Study')
assert(hash(raw) === canada2025Study.dataset.rawSha256, 'raw history hash matches the Study')
assert(hash(metadata) === canada2025Study.dataset.marketMetadataSha256, 'market metadata hash matches the Study')
const rawBundle = JSON.parse(raw.toString())
assert(rawBundle.history.length === 2723, 'raw bundle retains all 2723 source observations')

const points = normalizeObservationSeries(parseMarketCsv(normalized.toString()), canada2025Study.dataset.cadenceMinutes)
const impacts = calculateStudyImpacts(points, canada2025Study.events, canada2025Study.measurementProfile)
assert(points.length === 2723, 'normalizes to 2723 hourly observations')
assert(impacts.length === 5 && impacts.every((impact) => impact.qualityStatus === 'usable'), 'has five usable event windows')
assert(impacts.every((impact) => impact.windows.anticipation.quality.coverage === 1 && impact.windows.delayed.quality.coverage === 1), 'has full anticipation and delayed coverage')
assert(impacts.every((impact) => impact.overlaps.length === 0), 'has no selected-event full-window overlap')
const ties = createTieGroups(impacts, canada2025Study.measurementProfile.tieThreshold).map((group) => group.join('+')).join(',')
assert(ties === 'auto-tariff-response,tariff-retaliation+carney-leadership-launch+carney-leadership-win,election-call', 'preserves the supported three-card tie')

for (const event of canada2025Study.events) assert(getPreRevealCard(canada2025Study, event.id)?.sources.length, `${event.id} has eligible pre-reveal evidence`)
assert(!getPreRevealCard(canada2025Study, 'election-call')?.sources.some((item) => item.id === 'election-axios'), 'does not use the excluded Axios challenge')
assert(getPreRevealCard(canada2025Study, 'election-call')?.sources.some((item) => item.id === 'election-ap'), 'uses AP as election-call corroboration')
assert(getPreRevealCard(canada2025Study, 'auto-tariff-response')?.sources.map((item) => item.id).join(',') === 'auto-ap', 'does not use the date-only PMO page for the minute cutoff claim')
assert(canada2025Study.conclusion?.sourceId === 'canada-market-resolution' && !canada2025Study.events.some((event) => event.id === 'canada-market-resolution'), 'keeps the ending reveal-only and outside the five cards')

const cutoffBreach = structuredClone(canada2025Study)
cutoffBreach.sources.find((item) => item.id === 'election-ap')!.publishedAt = '2025-03-25T00:00:00Z'
assert(validateStudy(cutoffBreach).some((message) => message.includes('later source')), 'rejects a corroborating source published after its pre-reveal cutoff')

console.log('Canada playable draft tests passed')
