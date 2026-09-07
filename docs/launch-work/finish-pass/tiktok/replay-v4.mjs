import fs from 'node:fs'
import crypto from 'node:crypto'
import { calculateStudyImpacts, createTieGroups, MONTHS_PROFILE } from '../../../../src/domain/eventStudy.ts'

const root = new URL('./', import.meta.url)
const project = (path) => new URL(`../../../../${path}`, root)
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
  artifactType: 'TikTok finish-pass replay',
  version: 4,
  calculatedAt: new Date().toISOString(),
  replayInvocation: 'node docs/launch-work/finish-pass/tiktok/replay-v4.mjs',
  baseMeasurements: {
    path: 'docs/launch-work/tiktok/measurements.json',
    sha256: hashFile('docs/launch-work/tiktok/measurements.json'),
  },
  evidenceAddendum: {
    path: 'docs/launch-work/finish-pass/tiktok/evidence-addendum-v4.json',
    sha256: hashFile('docs/launch-work/finish-pass/tiktok/evidence-addendum-v4.json'),
  },
  anchorDecision: {
    change: 'none',
    path: 'docs/launch-work/tiktok/anchors-v3.json',
    sha256: hashFile('docs/launch-work/tiktok/anchors-v3.json'),
    reason: 'Source eligibility support was improved without changing the frozen numeric anchors or the measurement profile.',
  },
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
  dataset: {
    path: 'docs/launch-queue-research/evidence/tiktok-normalized.json',
    sha256: hashFile('docs/launch-queue-research/evidence/tiktok-normalized.json'),
    observations: points.length,
    coverageStart: points[0].timestamp,
    coverageEnd: points[points.length - 1].timestamp,
  },
  profile: MONTHS_PROFILE,
  disclosure: 'Existing hourly normalized observations were replayed without new price retrieval, filling, re-ranking, or anchor tuning. These signed changes are observed percentage-point movements, not causal estimates. Anchor-based ties are unchanged.',
  allWindowsPass: impacts.every((impact) => impact.qualityStatus === 'usable'),
  tieGroups: createTieGroups(impacts, MONTHS_PROFILE.tieThreshold),
  impacts,
}

fs.writeFileSync(new URL('./measurements-v4.json', root), JSON.stringify(output, null, 2) + '\n')
console.log(JSON.stringify({
  allWindowsPass: output.allWindowsPass,
  tieGroups: output.tieGroups,
  responses: impacts.map((impact) => ({
    eventId: impact.eventId,
    shortTermResponse: impact.shortTermResponse,
    cumulativeDelayedResponse: impact.cumulativeDelayedResponse,
    qualityStatus: impact.qualityStatus,
  })),
}, null, 2))
