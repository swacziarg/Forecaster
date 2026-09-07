import fs from 'node:fs'
import crypto from 'node:crypto'
import { calculateStudyImpacts, createTieGroups, MONTHS_PROFILE } from '../../../src/domain/eventStudy.ts'

const root = new URL('./', import.meta.url)
const project = (path) => new URL(`../../../${path}`, root)
const readJson = (path) => JSON.parse(fs.readFileSync(project(path), 'utf8'))
const hashFile = (path) => crypto.createHash('sha256').update(fs.readFileSync(project(path))).digest('hex')

const selection = readJson('docs/launch-queue-research/frozen-selection-v1.json')
const anchors = readJson('docs/launch-work/tiktok/anchors-v3.json')
const source = selection.finalists.find((finalist) => finalist.key === 'tiktok')
const anchorSet = anchors.finalists.tiktok
const events = source.events.map((event) => {
  const anchor = anchorSet.find((candidate) => candidate.id === event.id)
  return {
    ...event,
    shortTitle: event.title,
    informationKnownAt: anchor.informationKnownAt,
    anchorVerified: anchor.publicCutoffVerified,
    anchorBasis: anchor.publicAvailability.basis,
  }
})
const points = readJson('docs/launch-queue-research/evidence/tiktok-normalized.json')
const impacts = calculateStudyImpacts(points, events, MONTHS_PROFILE)

const output = {
  calculatedAt: new Date().toISOString(),
  replayInvocation: 'node docs/launch-work/tiktok/replay.mjs',
  engine: {
    module: 'src/domain/eventStudy.ts',
    sha256: hashFile('src/domain/eventStudy.ts'),
    functions: ['calculateStudyImpacts', 'createTieGroups', 'MONTHS_PROFILE'],
  },
  selection: {
    path: 'docs/launch-queue-research/frozen-selection-v1.json',
    sha256: hashFile('docs/launch-queue-research/frozen-selection-v1.json'),
    frozenAt: selection.frozenAt,
    eventIds: source.events.map((event) => event.id),
  },
  anchors: {
    path: 'docs/launch-work/tiktok/anchors-v3.json',
    sha256: hashFile('docs/launch-work/tiktok/anchors-v3.json'),
    version: anchors.version,
  },
  dataset: {
    path: 'docs/launch-queue-research/evidence/tiktok-normalized.json',
    sha256: hashFile('docs/launch-queue-research/evidence/tiktok-normalized.json'),
    observations: points.length,
    coverageStart: points[0].timestamp,
    coverageEnd: points[points.length - 1].timestamp,
  },
  profile: MONTHS_PROFILE,
  disclosure: 'These are observed median changes in percentage points, not causal estimates. The source marks are hourly normalized Polymarket observations; no filling or re-ranking was applied.',
  allWindowsPass: impacts.every((impact) => impact.qualityStatus === 'usable'),
  tieGroups: createTieGroups(impacts, MONTHS_PROFILE.tieThreshold),
  impacts,
}

fs.writeFileSync(new URL('./measurements.json', root), JSON.stringify(output, null, 2) + '\n')
console.log(JSON.stringify({ allWindowsPass: output.allWindowsPass, tieGroups: output.tieGroups, responses: impacts.map((impact) => ({ eventId: impact.eventId, shortTermResponse: impact.shortTermResponse, cumulativeDelayedResponse: impact.cumulativeDelayedResponse, qualityStatus: impact.qualityStatus })) }, null, 2))
