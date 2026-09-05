import { completedScoreBands, currentDailyPuzzle, getPreRevealCard, performShare, resolveDailyPuzzle, scoreDailyOrder, validateDailyRegistry, type DailyPuzzle } from './dailyGame.ts'
import { collectDailyStats, dailyAttemptKey, readDailyAttempt, saveDailyDraft, submitDailyAttempt, type StorageLike } from './dailyStorage.ts'
import { dailyPuzzles } from '../data/dailyPuzzles.ts'
import { studyRegistry } from '../data/studies.ts'
import { bidenDropoutStudy } from '../data/bidenDropout2024.ts'
import type { StudyEventImpact } from './eventStudy.ts'

const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(`Test failed: ${message}`) }
const equal = (actual: unknown, expected: unknown, message: string) => assert(actual === expected, `${message}: expected ${String(expected)}, received ${String(actual)}`)

const ids = ['a', 'b', 'c', 'd', 'e'] as const
const makePuzzle = (number: number, releaseTime: string): DailyPuzzle => ({
  id: `puzzle-${number}`, number, releaseTime, releaseTimezone: 'UTC', studyId: 'study', studyVersion: 1,
  topic: 'Topic', question: 'Question', instruction: 'Instruction', eventIds: ids, initialOrder: ids,
  scoring: { version: 'pairwise-anchor-1pt-v1', tieThreshold: 0.01, tieGrouping: 'anchor-window' },
})
const schedule = [makePuzzle(1, '2026-09-04T05:00:00Z'), makePuzzle(2, '2026-09-05T05:00:00Z'), makePuzzle(3, '2026-09-06T05:00:00Z')]

class MemoryStorage implements StorageLike {
  values = new Map<string, string>()
  unavailable = false
  getItem(key: string) { if (this.unavailable) throw new Error('blocked'); return this.values.get(key) ?? null }
  setItem(key: string, value: string) { if (this.unavailable) throw new Error('blocked'); this.values.set(key, value) }
}

equal(currentDailyPuzzle(schedule, new Date('2026-09-04T04:59:59.999Z')), null, 'keeps a puzzle sealed before its exact release boundary')
equal(currentDailyPuzzle(schedule, new Date('2026-09-04T05:00:00.000Z'))?.id, 'puzzle-1', 'opens a puzzle at its exact release boundary')
equal(currentDailyPuzzle([schedule[0]], new Date('2026-09-05T05:00:00.000Z')), null, 'ends an unsuperseded daily window after 24 hours')
const oldResolution = resolveDailyPuzzle(schedule, new Date('2026-09-05T06:00:00Z'), 'puzzle-1')
equal(oldResolution.kind, 'puzzle', 'resolves an old released link')
assert(oldResolution.kind === 'puzzle' && oldResolution.playMode === 'archive', 'labels an old link as archive play')
equal(resolveDailyPuzzle(schedule, new Date('2026-09-04T06:00:00Z'), 'missing').kind, 'unknown', 'rejects an unknown puzzle ID')
equal(resolveDailyPuzzle(schedule, new Date('2026-09-04T06:00:00Z'), 'puzzle-2').kind, 'unreleased', 'keeps a future linked puzzle sealed')
const singleResolution = resolveDailyPuzzle([schedule[0]], new Date('2026-09-04T06:00:00Z'))
assert(singleResolution.kind === 'puzzle' && singleResolution.nextPuzzle === null, 'does not invent a next scheduled puzzle')
equal(resolveDailyPuzzle([schedule[0]], new Date('2026-09-05T06:00:00Z')).kind, 'exhausted', 'reports an exhausted schedule after the release window')

equal(validateDailyRegistry(dailyPuzzles, studyRegistry.map(({ study }) => study)).length, 0, 'validates the published daily registry and pre-reveal evidence')
equal(dailyPuzzles[0].studyId, bidenDropoutStudy.id, 'launches with the Biden dropout contract')
equal(dailyPuzzles[0].number, 1, 'keeps the new edition numbered one')
equal(currentDailyPuzzle(dailyPuzzles, new Date('2026-09-05T17:00:00Z'))?.id, '2026-09-05-biden-dropout', 'makes the new edition playable on launch day')
assert(getPreRevealCard(bidenDropoutStudy, 'trump-shooting')?.sources.length, 'supports the shooting card with contemporary evidence')
assert(!getPreRevealCard(bidenDropoutStudy, 'renewed-pressure')?.sources.some((source) => source.id === 'pressure'), 'keeps the later receptiveness report out of the Schiff card')
const leakedReport = structuredClone(bidenDropoutStudy)
leakedReport.events.find((event) => event.id === 'renewed-pressure')!.claims[0].sourceIds.push('pressure')
assert(validateDailyRegistry(dailyPuzzles, [leakedReport]).some((error) => error.includes('pre-reveal')), 'rejects a later report as evidence for an earlier card')
assert(dailyAttemptKey(dailyPuzzles[0]) !== dailyAttemptKey({ ...dailyPuzzles[0], id: '2026-09-04-election' }), 'isolates new launch attempts from the earlier election demo')
const wrongTimezone = { ...dailyPuzzles[0], releaseTimezone: 'America/Chicago' as never }
assert(validateDailyRegistry([wrongTimezone], studyRegistry.map(({ study }) => study)).some((error) => error.includes('UTC')), 'requires an explicit UTC release timezone')

const storage = new MemoryStorage()
storage.setItem(dailyAttemptKey(schedule[0]), JSON.stringify({ order: 'not-an-array' }))
equal(readDailyAttempt(storage, schedule[0]).status, 'invalid', 'rejects malformed saved JSON shapes')
equal(collectDailyStats(storage, schedule, new Date('2026-09-04T06:00:00Z')).played, 0, 'ignores malformed records while calculating stats')
const badOrder = { schemaVersion: 2, puzzleId: schedule[0].id, puzzleNumber: 1, releaseTime: schedule[0].releaseTime, studyId: 'study', studyVersion: 1, scoringVersion: schedule[0].scoring.version, eventIds: [...ids], order: ['a', 'a', 'b', 'c', 'd'], updatedAt: '2026-09-04T06:00:00Z' }
storage.setItem(dailyAttemptKey(schedule[0]), JSON.stringify(badOrder))
equal(readDailyAttempt(storage, schedule[0]).status, 'invalid', 'rejects duplicate event IDs and non-permutation orders')

const submittedStorage = new MemoryStorage()
const originalOrder = ['e', 'd', 'c', 'b', 'a']
equal(submitDailyAttempt(submittedStorage, schedule[0], originalOrder, { agreed: 8, comparable: 10, percent: 80 }, '2026-09-04T06:00:00Z', 'daily').status, 'submitted', 'saves one authoritative submission')
const stored = JSON.parse(submittedStorage.getItem(dailyAttemptKey(schedule[0]))!)
stored.order = [...ids]
submittedStorage.setItem(dailyAttemptKey(schedule[0]), JSON.stringify(stored))
const restored = readDailyAttempt(submittedStorage, schedule[0])
assert(restored.status === 'valid' && restored.attempt.submission?.order.join(',') === originalOrder.join(','), 'restores the submitted order instead of a mutable draft order')
const duplicate = submitDailyAttempt(submittedStorage, schedule[0], ids, { agreed: 10, comparable: 10, percent: 100 }, '2026-09-04T07:00:00Z', 'daily')
assert(duplicate.status === 'duplicate' && duplicate.attempt.submission?.score === 80, 'keeps the first submitted score on duplicate submission')
const staleDraft = saveDailyDraft(submittedStorage, schedule[0], ids, '2026-09-04T08:00:00Z')
assert(staleDraft.status === 'submitted' && staleDraft.attempt.submission?.score === 80, 'prevents a stale tab draft from overwriting a completed attempt')

const unavailableStorage = new MemoryStorage()
unavailableStorage.unavailable = true
equal(readDailyAttempt(unavailableStorage, schedule[0]).status, 'unavailable', 'distinguishes unavailable persistence from empty storage')
equal(saveDailyDraft(unavailableStorage, schedule[0], ids, '2026-09-04T06:00:00Z').status, 'unavailable', 'reports draft persistence failure')
equal(readDailyAttempt(null, schedule[0]).status, 'unavailable', 'handles storage access that is unavailable before a read')

const streakStorage = new MemoryStorage()
submitDailyAttempt(streakStorage, schedule[0], ids, { agreed: 5, comparable: 10, percent: 50 }, '2026-09-04T06:00:00Z', 'daily')
equal(collectDailyStats(streakStorage, schedule, new Date('2026-09-05T06:00:00Z')).currentStreak, 1, 'keeps yesterday’s streak eligible while today is unfinished')
equal(collectDailyStats(streakStorage, schedule, new Date('2026-09-06T06:00:00Z')).currentStreak, 0, 'expires a streak after a scheduled puzzle is missed')
submitDailyAttempt(streakStorage, schedule[2], ids, { agreed: 5, comparable: 10, percent: 50 }, '2026-09-06T06:00:00Z', 'archive')
equal(collectDailyStats(streakStorage, schedule, new Date('2026-09-06T07:00:00Z')).played, 1, 'excludes archive completions from official play totals')
equal(collectDailyStats(streakStorage, schedule, new Date('2026-09-07T05:00:00Z')).currentStreak, 0, 'expires the current streak when the schedule itself is no longer current')

const impact = (eventId: string, shortTermResponse: number | null) => ({ eventId, shortTermResponse } as StudyEventImpact)
const chain = scoreDailyOrder(ids, [impact('a', 0.04), impact('b', 0.035), impact('c', 0.027), impact('d', -0.02), impact('e', null)], schedule[0].scoring)
equal(chain.tieGroups.map((group) => group.join('+')).join(','), 'a+b,c,d', 'anchors tie groups so a nearby-value chain cannot merge distant endpoints')
const zeroComparison = scoreDailyOrder(ids, ids.map((id) => impact(id, 0.04)), schedule[0].scoring)
equal(zeroComparison.agreement.comparable, 0, 'reports zero comparable pairs when all usable responses tie')
equal(zeroComparison.agreement.percent, null, 'does not force a score with zero comparable pairs')
equal(completedScoreBands(56), 2, 'fills only completed 20-point bands in the share graphic')
equal(completedScoreBands(100), 5, 'fills all score bands only at 100')

equal(await performShare({ payload: {}, copy: async () => true }), 'unsupported-copied', 'copies when native sharing is unsupported')
equal(await performShare({ payload: {}, copy: async () => false }), 'unavailable', 'reports unavailable sharing and clipboard access')
const canceled = new Error('canceled'); canceled.name = 'AbortError'
equal(await performShare({ payload: {}, nativeShare: async () => { throw canceled }, copy: async () => { throw new Error('copy must not run') } }), 'canceled', 'treats native-share cancellation as cancellation without copying')
equal(await performShare({ payload: {}, nativeShare: async () => { throw new Error('share failed') }, copy: async () => true }), 'copied', 'falls back to copy after a native-share failure')

console.log('daily game tests passed')
