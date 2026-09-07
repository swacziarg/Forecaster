import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { calculateStudyImpacts, createTieGroups, normalizeObservationSeries, parseMarketCsv } from '../domain/eventStudy.ts'
import { getPreRevealBackground, getPreRevealCard } from '../domain/dailyGame.ts'
import { validateStudy } from '../domain/study.ts'
import { studyRegistry } from './studies.ts'
import { tiktokStudy } from './tiktok2025.ts'
import { eaglesFiveCardStudy } from './eaglesFiveCard2025.ts'
import { oscarsFiveCard2026Study } from './oscarsFiveCard2026.ts'
import { bitcoinFiveCardStudy } from './bitcoinFiveCard2024.ts'
import { canada2025Study } from './canada2025.ts'

const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(`Test failed: ${message}`) }
const equal = (actual: unknown, expected: unknown, message: string) => assert(actual === expected, `${message}: expected ${String(expected)}, received ${String(actual)}`)
const hash = (value: Buffer | string) => createHash('sha256').update(value).digest('hex')

const studies = [tiktokStudy, eaglesFiveCardStudy, oscarsFiveCard2026Study, bitcoinFiveCardStudy, canada2025Study]
for (const study of studies) {
  equal(validateStudy(study).length, 0, `${study.slug} passes strict validation`)
  equal(study.status, 'editorial-review', `${study.slug} remains unpublished pending human approval`)
  equal(studyRegistry.find(({ study: registered }) => registered.id === study.id)?.study.version, study.version, `${study.slug} is registered at its declared version`)
  const normalized = readFileSync(new URL(`../../public${study.dataset.path}`, import.meta.url))
  const raw = readFileSync(new URL(`../../public${study.dataset.rawPath}`, import.meta.url))
  const metadata = readFileSync(new URL(`../../public${study.dataset.marketMetadataPath}`, import.meta.url))
  const manifest = JSON.parse(readFileSync(new URL(`../../public${study.dataset.manifestPath}`, import.meta.url), 'utf8'))
  equal(hash(normalized), study.dataset.normalizedSha256, `${study.slug} normalized artifact digest`)
  equal(hash(raw), study.dataset.rawSha256, `${study.slug} retained raw artifact digest`)
  equal(hash(metadata), study.dataset.marketMetadataSha256, `${study.slug} market metadata artifact digest`)
  equal(manifest.normalizedSha256, study.dataset.normalizedSha256, `${study.slug} manifest normalized digest`)
  equal(manifest.rawSha256, study.dataset.rawSha256, `${study.slug} manifest raw digest`)
  equal(manifest.marketMetadataSha256, study.dataset.marketMetadataSha256, `${study.slug} manifest metadata digest`)
  const points = normalizeObservationSeries(parseMarketCsv(normalized.toString()), study.dataset.cadenceMinutes)
  const impacts = calculateStudyImpacts(points, study.events, study.measurementProfile)
  assert(impacts.every((impact) => impact.qualityStatus === 'usable'), `${study.slug} has five usable windows per card`)
  if (study.id === bitcoinFiveCardStudy.id) assert(impacts.some((impact) => impact.overlaps.length > 0), `${study.slug} reports the documented overlap`)
  else assert(impacts.every((impact) => impact.overlaps.length === 0), `${study.slug} has no full-window overlap`)
  assert(study.events.every((event) => getPreRevealCard(study, event.id)?.sources.length), `${study.slug} has eligible pre-reveal evidence for every card`)
}

equal(createTieGroups(calculateStudyImpacts(normalizeObservationSeries(parseMarketCsv(readFileSync(new URL('../../public/data/tiktok-banned-before-may-2025-v1/polymarket-hourly.csv', import.meta.url), 'utf8')), 60), tiktokStudy.events, tiktokStudy.measurementProfile), 0.01).map((group) => group.join('+')).join(','), 'supreme-argument+appeal-lost,supreme-review,trump-pause,trump-elected', 'TikTok golden tie groups')
equal(createTieGroups(calculateStudyImpacts(normalizeObservationSeries(parseMarketCsv(readFileSync(new URL('../../public/data/eagles-super-bowl-lix-five-v1/polymarket-hourly.csv', import.meta.url), 'utf8')), 60), eaglesFiveCardStudy.events, eaglesFiveCardStudy.measurementProfile), 0.01).map((group) => group.join('+')).join(','), 'nfc-title,snow-playoff,barkley-record,falcons-collapse,hurts-concussion', 'Eagles golden tie groups')

const cutoffBreach = structuredClone(tiktokStudy)
cutoffBreach.sources.find((source) => source.id === 'ap-dec6')!.publishedAt = '2025-01-01T00:00:00Z'
assert(validateStudy(cutoffBreach).some((message) => message.includes('later source')), 'rejects a source published after its pre-reveal cutoff')

const background = getPreRevealBackground(canada2025Study)
equal(background.claims.length, 2, 'Canada introduction has two sourced pre-reveal paragraphs')
assert(background.sources.some((source) => source.id === 'canada-policy-background'), 'policy background exposes its government source')
const futureBackground = structuredClone(canada2025Study)
futureBackground.background!.claims[0].knownAt = '2025-04-29T00:00:00Z'
assert(validateStudy(futureBackground).some((message) => message.includes('Background claim') && message.includes('hindsight')), 'rejects background learned after the first card')
equal(getPreRevealBackground(futureBackground).claims.length, 1, 'future context is hidden at render time')
const laterBackgroundSource = structuredClone(canada2025Study)
laterBackgroundSource.sources.find((source) => source.id === 'canada-policy-background')!.publishedAt = '2025-04-29'
equal(getPreRevealBackground(laterBackgroundSource).claims.length, 1, 'later background sources cannot bypass the cutoff')
assert(validateStudy(laterBackgroundSource).some((message) => message.includes('Background claim') && message.includes('later source')), 'validation catches a later context source')
const trumpCard = getPreRevealCard(tiktokStudy, 'trump-elected')!
assert(trumpCard.sources.some((source) => source.id === 'ap-trump-tiktok-position'), 'TikTok campaign context has its own eligible contemporary source')

console.log('editorial integration tests passed')
