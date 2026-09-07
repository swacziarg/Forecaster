import assert from 'node:assert/strict'
import { bitcoinFiveCardStudy } from '../data/bitcoinFiveCard2024.ts'
import { studyRegistry } from '../data/studies.ts'
import { createPrivatePreviewPuzzle, resolvePrivatePreview } from './playablePreview.ts'

const registration = studyRegistry.find(({ study }) => study.id === bitcoinFiveCardStudy.id)
assert.ok(registration)
assert.equal(resolvePrivatePreview('/__preview/bitcoin-100k-2024-five-card', studyRegistry, true)?.kind, 'preview')
assert.equal(resolvePrivatePreview('/__preview/bitcoin-100k-2024-five-card/', studyRegistry, true)?.kind, 'preview')
assert.equal(resolvePrivatePreview('/__preview/not-registered', studyRegistry, true)?.kind, 'unknown')
assert.equal(resolvePrivatePreview('/__preview/bitcoin-100k-2024-five-card', studyRegistry, false), null)
assert.equal(resolvePrivatePreview('/?preview=bitcoin-100k-2024-five-card', studyRegistry, true), null)

const puzzle = createPrivatePreviewPuzzle(registration)
assert.equal(puzzle.id, '__private-preview.bitcoin-100k-2024-five-card.v2')
assert.equal(puzzle.eventIds.length, 5)
assert.deepEqual(puzzle.initialOrder, puzzle.eventIds)
assert.equal(puzzle.releaseTimezone, 'UTC')
console.log('playable preview tests passed')
