import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'

import { bitcoinStudy } from '../../../../src/data/bitcoin2024.ts'
import { getPreRevealCard } from '../../../../src/domain/dailyGame.ts'
import { calculateStudyImpacts, createTieGroups, normalizeObservationPerspective, normalizeObservationSeries, pairwiseAgreement, parseMarketCsv } from '../../../../src/domain/eventStudy.ts'
import { validateStudy } from '../../../../src/domain/study.ts'

const root = new URL('../../../../', import.meta.url).pathname
const packetRoot = new URL('./', import.meta.url).pathname
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const assert = (condition, message) => { if (!condition) throw new Error(`Bitcoin candidate check failed: ${message}`) }

const candidate = readJson(new URL('./candidate.json', import.meta.url))
const measurements = readJson(new URL('./measurements.json', import.meta.url))
const manifest = readJson(new URL('./evidence-manifest.json', import.meta.url))
const freeze = readJson(new URL('./selection-freeze.json', import.meta.url))

assert(validateStudy(bitcoinStudy).length === 0, 'existing Bitcoin Study fails validateStudy')
assert(freeze.eventIds.length === 5 && new Set(freeze.eventIds).size === 5, 'freeze does not contain five unique event IDs')
assert(JSON.stringify(freeze.eventIds) === JSON.stringify(candidate.events.map((event) => event.id)), 'candidate order differs from selection freeze')
assert(sha256(readFileSync(new URL('./selection-freeze.json', import.meta.url))) === candidate.selectionFreeze.sha256, 'selection freeze hash mismatch')

for (const event of candidate.events) {
  assert(getPreRevealCard(bitcoinStudy, event.id), `${event.id} has no eligible pre-reveal card in the existing Study`)
  assert(event.claims.length > 0 && event.claims.every((claim) => claim.visibility === 'pre-reveal'), `${event.id} has an invalid claim visibility`)
  assert(event.claims.every((claim) => claim.sourceIds.every((sourceId) => candidate.sources.some((source) => source.id === sourceId))), `${event.id} references a missing source`)
}

for (const capture of manifest.sourceCaptures) {
  const capturePath = new URL(`./${capture.path}`, import.meta.url)
  assert(existsSync(capturePath), `missing source capture ${capture.path}`)
  const record = readJson(capturePath)
  assert(sha256(record.passage) === record.passageSha256, `passage hash mismatch in ${capture.path}`)
  assert(record.passageSha256 === capture.passageSha256, `manifest hash mismatch in ${capture.path}`)
}

for (const artifact of manifest.datasetArtifacts) {
  const artifactPath = artifact.path.startsWith('public/') ? new URL(`../../../../${artifact.path}`, import.meta.url) : new URL(`../../../../${artifact.path}`, import.meta.url)
  assert(existsSync(artifactPath), `missing dataset artifact ${artifact.path}`)
  assert(sha256(readFileSync(artifactPath)) === artifact.sha256, `dataset hash mismatch for ${artifact.path}`)
}

const csv = readFileSync(new URL('../../../../public/data/bitcoin-2024/polymarket-hourly.csv', import.meta.url), 'utf8')
const points = normalizeObservationSeries(parseMarketCsv(csv).map((point) => normalizeObservationPerspective(point, bitcoinStudy.contract.selectedPerspective)), bitcoinStudy.dataset.cadenceMinutes)
const selectedEvents = bitcoinStudy.events.filter((event) => freeze.eventIds.includes(event.id))
const impacts = calculateStudyImpacts(points, selectedEvents, bitcoinStudy.measurementProfile)
assert(impacts.length === 5, 'calculation did not produce five impacts')
for (const impact of impacts) {
  const expected = measurements.events.find((event) => event.eventId === impact.eventId)
  assert(expected, `measurement is missing for ${impact.eventId}`)
  assert(Math.abs(expected.shortTermResponse - impact.shortTermResponse) < 1e-12, `short-term response mismatch for ${impact.eventId}`)
  assert(Object.values(expected.windows).every((window) => window.status === 'usable'), `${impact.eventId} has a non-usable recorded window`)
}
const groups = createTieGroups(impacts, bitcoinStudy.measurementProfile.tieThreshold)
assert(JSON.stringify(groups) === JSON.stringify(measurements.tieGroupsDescending), 'tie groups differ from recorded measurements')
assert(JSON.stringify(pairwiseAgreement(freeze.initialOrder, groups)) === JSON.stringify(measurements.comparablePairs), 'pairwise agreement differs from recorded measurements')
assert(measurements.qualitySummary.windowsRequired === 25 && measurements.qualitySummary.windowsUsable === 25, 'not all 25 windows are recorded usable')

console.log('bitcoin candidate checks passed: source passage hashes, dataset hashes, five eligible claims, 25 usable windows, 9 comparable pairs')
