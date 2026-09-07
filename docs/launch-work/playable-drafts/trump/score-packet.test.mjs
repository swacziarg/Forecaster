import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { calculateStudyImpacts, createTieGroups } from '../../../../src/domain/eventStudy.ts'
import { getPreRevealCard } from '../../../../src/domain/dailyGame.ts'
import { validateStudy } from '../../../../src/domain/study.ts'

const root = resolve(new URL('../../../../', import.meta.url).pathname)
const readJson = (relativePath) => JSON.parse(readFileSync(resolve(root, relativePath), 'utf8'))
const study = readJson('docs/launch-work/playable-drafts/trump/study-draft.json')
const packet = readJson('docs/launch-work/playable-drafts/trump/score-packet.json')
const manifest = readJson('docs/launch-work/playable-drafts/trump/evidence-manifest.json')
const points = readJson('docs/launch-queue-research/evidence/trump-normalized.json')
const sha256 = (relativePath) => createHash('sha256').update(readFileSync(resolve(root, relativePath))).digest('hex')
const near = (left, right, message) => assert.ok(Math.abs(left - right) < 1e-9, `${message}: ${left} !== ${right}`)

assert.deepEqual(validateStudy(study), [], 'strict Study validation passes')
assert.equal(study.id, 'trump-comeback-2024-v1')
assert.equal(study.slug, 'trump-comeback-2024')
assert.equal(study.version, 1)
assert.equal(study.contract.selectedPerspective, 'YES')
assert.equal(study.contract.id, packet.market.tokenId)
assert.equal(study.dataset.rawSha256, packet.dataset.csvSha256)
assert.equal(sha256('docs/launch-queue-research/datasets/trump-hourly.csv'), packet.dataset.csvSha256, 'CSV hash is unchanged')
assert.equal(sha256('docs/launch-queue-research/evidence/trump-normalized.json'), packet.dataset.normalizedSha256, 'normalized hash is unchanged')

for (const event of study.events) {
  const card = getPreRevealCard(study, event.id)
  assert.ok(card, `${event.id} has an eligible pre-reveal card`)
  assert.ok(card.sources.length > 0, `${event.id} card has evidence sources`)
  assert.ok(event.claims.every((claim) => claim.visibility === 'pre-reveal'), `${event.id} claims are pre-reveal`) 
  assert.ok(event.claims.every((claim) => Date.parse(claim.knownAt) <= Date.parse(event.informationKnownAt)), `${event.id} claims are before the cutoff`)
}

const impacts = calculateStudyImpacts(points, study.events, study.measurementProfile)
assert.equal(impacts.length, 5)
assert.equal(impacts.flatMap((impact) => Object.values(impact.windows)).length, 25, 'all 25 windows are present')
assert.ok(impacts.every((impact) => impact.qualityStatus === 'usable'), 'all five event sets are usable')
assert.deepEqual(createTieGroups(impacts, study.measurementProfile.tieThreshold), packet.tieGroupsByShortTermResponse, 'tie groups match the engine')

for (const eventPacket of packet.events) {
  const impact = impacts.find((candidate) => candidate.eventId === eventPacket.eventId)
  assert.ok(impact, `${eventPacket.eventId} has an engine result`)
  for (const [windowName, expected] of Object.entries(eventPacket.windows)) {
    const actual = impact.windows[windowName]
    assert.equal(actual.quality.status, expected.status, `${eventPacket.eventId} ${windowName} quality status`)
    assert.equal(actual.quality.expectedBuckets, expected.expectedBuckets, `${eventPacket.eventId} ${windowName} expected buckets`)
    assert.equal(actual.quality.validBuckets, expected.validBuckets, `${eventPacket.eventId} ${windowName} valid buckets`)
    near(actual.level, expected.level, `${eventPacket.eventId} ${windowName} level`)
  }
  near(impact.immediateResponse, eventPacket.immediateResponse, `${eventPacket.eventId} immediate response`)
  near(impact.shortTermResponse, eventPacket.shortTermResponse, `${eventPacket.eventId} short-term response`)
  near(impact.cumulativeDelayedResponse, eventPacket.cumulativeDelayedResponse, `${eventPacket.eventId} delayed response`)
}

const iowa = packet.events.find((event) => event.eventId === 'iowa-poll')
assert.equal(iowa.windows.delayed.validBuckets, 23, 'Iowa delayed window preserves the one missing bucket')
assert.equal(iowa.windows.delayed.expectedBuckets, 24)
assert.equal(packet.anchors.informationKnownAt['harris-debate'], '2024-09-11T02:45:00Z')
assert.equal(packet.anchors.debateCorrection.noEarlierRounding, true)
assert.ok(!study.events.some((event) => event.id === 'ap-election-call'), 'ending source is not an event card')
assert.equal(study.conclusion.sourceId, 'ap-election-call', 'ending source is reveal-only conclusion')

const hindsightBreach = structuredClone(study)
hindsightBreach.events[0].claims[0].knownAt = '2024-05-31T00:00:00Z'
assert.ok(validateStudy(hindsightBreach).some((message) => message.includes('hindsight firewall')), 'later claim is rejected')

const dateOnlyBreach = structuredClone(study)
dateOnlyBreach.sources.find((source) => source.id === 'cnn-conviction-broadcast').publishedAt = '2024-05-30'
dateOnlyBreach.sources.find((source) => source.id === 'cnn-conviction-broadcast').publishedPrecision = 'day'
assert.ok(validateStudy(dateOnlyBreach).some((message) => message.includes('date-only source')), 'date-only same-day source is rejected at the precise cutoff')

const unknownBreach = structuredClone(study)
unknownBreach.sources.find((source) => source.id === 'cnn-conviction-broadcast').publishedPrecision = 'unknown'
assert.ok(validateStudy(unknownBreach).some((message) => message.includes('unknown publication time')), 'unknown publication time is rejected for a pre-reveal claim')

for (const record of manifest.records) {
  if (!record.localPath || !record.sha256) continue
  assert.ok(existsSync(resolve(root, record.localPath)), `${record.id} local capture exists`)
  assert.equal(sha256(record.localPath), record.sha256, `${record.id} local capture hash is unchanged`)
}

console.log('Trump playable-draft packet checks passed: strict study, five pre-reveal cards, 25 windows, cutoff guards, ties, and local hashes.')
