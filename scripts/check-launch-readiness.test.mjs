import { strict as assert } from 'node:assert'

import { bidenDropoutStudy } from '../src/data/bidenDropout2024.ts'
import { dailyPuzzles } from '../src/data/dailyPuzzles.ts'
import {
  buildReadinessReport,
  contentHashForPuzzle,
  formatReadinessReport,
  STATIC_ARTIFACTS,
} from './check-launch-readiness.mjs'

const historicalPuzzle = dailyPuzzles[0]
const datasetArtifacts = [
  bidenDropoutStudy.dataset.path,
  bidenDropoutStudy.dataset.rawPath,
  bidenDropoutStudy.dataset.marketMetadataPath,
  bidenDropoutStudy.dataset.manifestPath,
].map((path) => path.replace(/^\/+/, ''))
const files = [...STATIC_ARTIFACTS, ...datasetArtifacts]
const metadata = {
  canonical: 'https://nexuspoint.lol/',
  ogUrl: 'https://nexuspoint.lol/',
  ogImage: 'https://nexuspoint.lol/og-image-v1.png',
  ogImageType: 'image/png',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://nexuspoint.lol/og-image-v1.png',
  containsDailyQuery: false,
}

const baseInput = {
  now: '2026-09-06T16:00:00Z',
  puzzles: [historicalPuzzle],
  studies: [bidenDropoutStudy],
  files,
  distFiles: files,
  metadata,
  productionDomain: 'https://nexuspoint.lol',
  approvals: null,
  schedule: null,
}

const historical = buildReadinessReport(baseInput)
assert.equal(historical.counts.registered, 1)
assert.equal(historical.counts.released, 1)
assert.equal(historical.counts.upcoming, 0)
assert.equal(historical.registered[0].approval.status, 'historical-approved')
assert.equal(historical.runway.consecutiveApprovedUpcoming, 0)
assert.equal(historical.runway.firstUncoveredAt, '2026-09-06T05:00:00.000Z')
assert.equal(historical.artifacts.source.missing.length, 0)
assert.equal(historical.artifacts.buildOutput.missing.length, 0)
assert.ok(historical.blockers.some((blocker) => blocker.includes('schedule packet input is missing')))
assert.ok(historical.blockers.some((blocker) => blocker.includes('approval packet input is missing')))

const futurePuzzle = {
  ...historicalPuzzle,
  id: '2026-09-07-biden-dropout-copy',
  number: 2,
  releaseTime: '2026-09-07T05:00:00Z',
}
const mismatched = buildReadinessReport({
  ...baseInput,
  now: '2026-09-06T16:00:00Z',
  puzzles: [futurePuzzle],
  approvals: {
    entries: [{
      puzzleId: futurePuzzle.id,
      studyId: futurePuzzle.studyId,
      studyVersion: futurePuzzle.studyVersion,
      releaseTime: futurePuzzle.releaseTime,
      status: 'approved',
      approverType: 'human',
      approver: 'Editorial approver',
      approvedAt: '2026-09-06T15:00:00Z',
      contentHash: 'not-the-current-content',
    }],
  },
  schedule: { proposed: [], approved: [] },
})
assert.equal(mismatched.counts.upcoming, 1)
assert.equal(mismatched.runway.consecutiveApprovedUpcoming, 0)
assert.ok(mismatched.blockers.some((blocker) => blocker.includes('approval content hash')))

const approved = buildReadinessReport({
  ...baseInput,
  puzzles: [futurePuzzle],
  approvals: {
    entries: [{
      puzzleId: futurePuzzle.id,
      studyId: futurePuzzle.studyId,
      studyVersion: futurePuzzle.studyVersion,
      releaseTime: futurePuzzle.releaseTime,
      status: 'approved',
      approverType: 'human',
      approver: 'Editorial approver',
      approvedAt: '2026-09-06T15:00:00Z',
      contentHash: contentHashForPuzzle(futurePuzzle, bidenDropoutStudy),
    }],
  },
  schedule: { proposed: [{ ...futurePuzzle, id: 'proposed-copy', number: 3, releaseTime: '2026-09-08T05:00:00Z' }], approved: [futurePuzzle.id] },
})
assert.equal(approved.blockers.length, 0)
assert.equal(approved.ready, true)
assert.equal(approved.runway.consecutiveApprovedUpcoming, 1)
assert.equal(approved.runway.proposedUpcoming, 1)
assert.ok(formatReadinessReport(approved).includes('approved upcoming runway: 1 consecutive edition(s)'))

const underfilledFunnel = buildReadinessReport({
  ...baseInput,
  puzzles: [historicalPuzzle, futurePuzzle],
  approvals: {
    entries: [{
      puzzleId: futurePuzzle.id,
      studyId: futurePuzzle.studyId,
      studyVersion: futurePuzzle.studyVersion,
      releaseTime: futurePuzzle.releaseTime,
      status: 'approved',
      approverType: 'human',
      approver: 'Editorial approver',
      approvedAt: '2026-09-06T15:00:00Z',
      contentHash: contentHashForPuzzle(futurePuzzle, bidenDropoutStudy),
    }],
  },
  schedule: {
    proposed: [{ ...futurePuzzle, id: 'proposed-copy', number: 3, releaseTime: '2026-09-08T05:00:00Z' }],
    approved: [futurePuzzle.id],
    funnelTarget: { minimumDistinctEditions: 6, includesBiden: true },
  },
})
assert.equal(underfilledFunnel.funnel.approvedDistinctEditions, 1)
assert.equal(underfilledFunnel.funnel.proposedDistinctEditions, 1)
assert.equal(underfilledFunnel.funnel.targetMet, false)
assert.ok(underfilledFunnel.blockers.some((blocker) => blocker.includes('approved funnel has 1 distinct edition(s); target is 6')))

const malformed = buildReadinessReport({
  ...baseInput,
  puzzles: [
    { ...futurePuzzle, id: 'duplicate', number: 2, eventIds: ['missing-event', ...futurePuzzle.eventIds.slice(1)] },
    { ...futurePuzzle, id: 'duplicate', number: 2 },
  ],
  approvals: { entries: [] },
  schedule: { proposed: [], approved: [] },
})
assert.deepEqual(malformed.duplicateIds, ['duplicate'])
assert.deepEqual(malformed.duplicateNumbers, [2])
assert.ok(malformed.blockers.some((blocker) => blocker.includes('missing eligible pre-reveal card claims')))

console.log('launch readiness tests passed')
