import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { auditSeries, calculateStudyImpacts, createTieGroups, normalizeObservationSeries, parseMarketCsv, MONTHS_PROFILE } from '../../../src/domain/eventStudy.ts'

const root = 'docs/next-five-2026-09-10/sports'
const csvPath = `${root}/thunder-hourly.csv`
const points = normalizeObservationSeries(parseMarketCsv(readFileSync(csvPath, 'utf8')), 60)
const study = JSON.parse(readFileSync(`${root}/study-draft.json`, 'utf8'))
const events = study.events
const audit = auditSeries(points, 60)
const impacts = calculateStudyImpacts(points, events, MONTHS_PROFILE)
const tieGroups = createTieGroups(impacts, MONTHS_PROFILE.tieThreshold, 1e-12)
const sha256 = path => createHash('sha256').update(readFileSync(path)).digest('hex')
const output = { artifactType: 'Thunder five-card measurements; generated with existing event-study functions', invocation: 'node --experimental-strip-types docs/next-five-2026-09-10/sports/evaluate-thunder.mjs', contract: { provider: 'Polymarket', eventId: '12815', marketId: '507884', conditionId: '0x6edc6c77c16ef3ba1bcd646159f12f8b8a39528e500dcff95b9220ccfbb75141', yesToken: '83527644927648970835156950007024690327726158617181889316317174894904268227846', selectedPerspective: 'YES', question: 'Will the Oklahoma City Thunder win the 2025 NBA Finals?', outcome: 'YES' }, dataset: { csvPath, csvSha256: sha256(csvPath), rawPath: `${root}/thunder-history-raw.json`, rawSha256: sha256(`${root}/thunder-history-raw.json`), manifestPath: `${root}/thunder-history-manifest.json`, manifestSha256: sha256(`${root}/thunder-history-manifest.json`), audit, profile: MONTHS_PROFILE, markPolicy: 'Latest Polymarket history observation per UTC hour treated as trade; no interpolation or cross-contract splicing.' }, events, impacts, tieGroups }
writeFileSync(`${root}/thunder-measurements.json`, `${JSON.stringify(output, null, 2)}\n`)
console.log(JSON.stringify({ audit, tieGroups, impacts: impacts.map(x => ({ id: x.eventId, shortTermResponse: x.shortTermResponse, cumulativeDelayedResponse: x.cumulativeDelayedResponse, qualityStatus: x.qualityStatus, quality: Object.fromEntries(Object.entries(x.windows).map(([k, v]) => [k, v.quality.status])) })) }, null, 2))
