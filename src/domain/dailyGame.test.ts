import { completedScoreBands, createDailySharePayload, currentDailyPuzzle, getPreRevealCard, performShare, resolveDailyPuzzle, scoreDailyOrder, validateDailyRegistry, type DailyPuzzle } from './dailyGame.ts'
import { collectDailyStats, dailyAttemptKey, hasSeenDailyIntro, rememberDailyIntro, readDailyAttempt, saveDailyDraft, submitDailyAttempt, type StorageLike } from './dailyStorage.ts'
import { dailyPuzzles } from '../data/dailyPuzzles.ts'
import { studyRegistry } from '../data/studies.ts'
import { bidenDropoutStudy } from '../data/bidenDropout2024.ts'
import { tiktokStudy } from '../data/tiktok2025.ts'
import { eaglesFiveCardStudy } from '../data/eaglesFiveCard2025.ts'
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
  setUnavailable = false
  getItem(key: string) { if (this.unavailable) throw new Error('blocked'); return this.values.get(key) ?? null }
  setItem(key: string, value: string) { if (this.unavailable || this.setUnavailable) throw new Error('blocked'); this.values.set(key, value) }
}

equal(currentDailyPuzzle(schedule, new Date('2026-09-04T04:59:59.999Z')), null, 'keeps a puzzle sealed before its exact release boundary')
equal(currentDailyPuzzle(schedule, new Date('2026-09-04T05:00:00.000Z'))?.id, 'puzzle-1', 'opens a puzzle at its exact release boundary')
equal(currentDailyPuzzle([schedule[0]], new Date('2026-09-05T05:00:00.000Z')), null, 'ends an unsuperseded daily window after 24 hours')
const releaseBoundaryStorage = new MemoryStorage()
equal(saveDailyDraft(releaseBoundaryStorage, schedule[0], ids, '2026-09-04T04:59:59.999Z').status, 'invalid', 'does not save a draft before the release boundary')
equal(submitDailyAttempt(releaseBoundaryStorage, schedule[0], ids, { agreed: 5, comparable: 10, percent: 50 }, '2026-09-04T05:00:00.000Z', 'daily').status, 'submitted', 'accepts a submission at the exact release boundary')
const windowEndStorage = new MemoryStorage()
submitDailyAttempt(windowEndStorage, schedule[0], ids, { agreed: 5, comparable: 10, percent: 50 }, '2026-09-05T05:00:00.000Z', 'daily')
equal(collectDailyStats(windowEndStorage, schedule, new Date('2026-09-05T05:00:00.000Z')).played, 0, 'excludes a result submitted at the exact window end')
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
equal(currentDailyPuzzle(dailyPuzzles, new Date('2026-09-05T17:00:00Z')), null, 'prelaunch testing is not an official daily edition')
equal(currentDailyPuzzle(dailyPuzzles, new Date('2026-09-07T04:59:59.999Z')), null, 'does not open the September 7 launch early')
equal(currentDailyPuzzle(dailyPuzzles, new Date('2026-09-07T05:00:00Z'))?.id, '2026-09-07-biden-dropout', 'opens the user-approved September 7 launch at midnight Chicago')
equal(currentDailyPuzzle(dailyPuzzles, new Date('2026-09-08T04:59:59.999Z'))?.id, '2026-09-07-biden-dropout', 'keeps the September 7 launch active through its daily window')
equal(resolveDailyPuzzle(dailyPuzzles, new Date('2026-09-07T06:00:00Z'), '2026-09-05-biden-dropout').kind, 'unknown', 'retires the prelaunch test link from the official schedule')
assert(dailyAttemptKey(dailyPuzzles[0]) !== dailyAttemptKey(dailyPuzzles[1]), 'keeps separate edition attempts isolated')
assert(getPreRevealCard(bidenDropoutStudy, 'trump-shooting')?.sources.length, 'supports the shooting card with contemporary evidence')
assert(!getPreRevealCard(bidenDropoutStudy, 'renewed-pressure')?.sources.some((source) => source.id === 'pressure'), 'keeps the later receptiveness report out of the Schiff card')
assert(getPreRevealCard(tiktokStudy, 'appeal-lost')?.sources.some((source) => source.id === 'ap-dec6'), 'uses the precise AP public-by source for the TikTok appeal card')
assert(getPreRevealCard(tiktokStudy, 'trump-elected')?.sources.length, 'keeps an exact-publication TikTok card eligible')
assert(getPreRevealCard(eaglesFiveCardStudy, 'hurts-concussion')?.sources.some((source) => source.id === 'archive-hurts-postgame-20241225065909'), 'uses the precise archived public-by source for the Eagles injury card')
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
const obsoleteAttempt = { ...badOrder, schemaVersion: 1, order: [...ids] }
storage.setItem(dailyAttemptKey(schedule[0]), JSON.stringify(obsoleteAttempt))
equal(readDailyAttempt(storage, schedule[0]).status, 'invalid', 'rejects obsolete attempt schema versions')
const preReleaseAttempt = { ...badOrder, order: [...ids], updatedAt: '2026-09-04T04:00:00Z' }
storage.setItem(dailyAttemptKey(schedule[0]), JSON.stringify(preReleaseAttempt))
equal(readDailyAttempt(storage, schedule[0]).status, 'invalid', 'rejects attempts timestamped before release')
const malformedSubmission = {
  ...preReleaseAttempt,
  updatedAt: '2026-09-04T07:00:00Z',
  submission: { order: [...ids], submittedAt: '2026-09-04T08:00:00Z', score: 80, agreed: 8, comparable: 10, playMode: 'daily' },
}
storage.setItem(dailyAttemptKey(schedule[0]), JSON.stringify(malformedSubmission))
equal(readDailyAttempt(storage, schedule[0]).status, 'invalid', 'rejects a submission newer than its attempt update timestamp')

const submittedStorage = new MemoryStorage()
const originalOrder = ['e', 'd', 'c', 'b', 'a']
equal(submitDailyAttempt(submittedStorage, schedule[0], originalOrder, { agreed: 8, comparable: 10, percent: 80 }, '2026-09-04T06:00:00Z', 'daily').status, 'submitted', 'saves one authoritative submission')
equal(submitDailyAttempt(new MemoryStorage(), schedule[0], ids, { agreed: 5, comparable: 10, percent: 50 }, '2026-09-04T06:00:00Z', 'invalid' as never).status, 'invalid', 'rejects an invalid submission mode')
const stored = JSON.parse(submittedStorage.getItem(dailyAttemptKey(schedule[0]))!)
stored.order = [...ids]
submittedStorage.setItem(dailyAttemptKey(schedule[0]), JSON.stringify(stored))
const restored = readDailyAttempt(submittedStorage, schedule[0])
assert(restored.status === 'valid' && restored.attempt.submission?.order.join(',') === originalOrder.join(','), 'restores the submitted order instead of a mutable draft order')
const duplicate = submitDailyAttempt(submittedStorage, schedule[0], ids, { agreed: 10, comparable: 10, percent: 100 }, '2026-09-04T07:00:00Z', 'daily')
assert(duplicate.status === 'duplicate' && duplicate.attempt.submission?.score === 80, 'keeps the first submitted score on duplicate submission')
const staleDraft = saveDailyDraft(submittedStorage, schedule[0], ids, '2026-09-04T08:00:00Z')
assert(staleDraft.status === 'submitted' && staleDraft.attempt.submission?.score === 80, 'prevents a stale tab draft from overwriting a completed attempt')

const draftStorage = new MemoryStorage()
saveDailyDraft(draftStorage, schedule[0], originalOrder, '2026-09-04T08:00:00Z')
const olderDraft = saveDailyDraft(draftStorage, schedule[0], ids, '2026-09-04T07:00:00Z')
assert(olderDraft.status === 'stale' && olderDraft.attempt.order.join(',') === originalOrder.join(','), 'prevents an older draft from overwriting a newer draft')
const currentDraft = readDailyAttempt(draftStorage, schedule[0])
assert(currentDraft.status === 'valid' && currentDraft.attempt.order.join(',') === originalOrder.join(','), 'keeps the newest draft authoritative after a stale write')

const unavailableStorage = new MemoryStorage()
unavailableStorage.unavailable = true
equal(readDailyAttempt(unavailableStorage, schedule[0]).status, 'unavailable', 'distinguishes unavailable persistence from empty storage')
equal(saveDailyDraft(unavailableStorage, schedule[0], ids, '2026-09-04T06:00:00Z').status, 'unavailable', 'reports draft persistence failure')
equal(readDailyAttempt(null, schedule[0]).status, 'unavailable', 'handles storage access that is unavailable before a read')
const quotaStorage = new MemoryStorage()
quotaStorage.setUnavailable = true
equal(saveDailyDraft(quotaStorage, schedule[0], ids, '2026-09-04T06:00:00Z').status, 'unavailable', 'reports a write denied by storage quota or policy')

const streakStorage = new MemoryStorage()
submitDailyAttempt(streakStorage, schedule[0], ids, { agreed: 5, comparable: 10, percent: 50 }, '2026-09-04T06:00:00Z', 'daily')
equal(collectDailyStats(streakStorage, schedule, new Date('2026-09-05T06:00:00Z')).currentStreak, 1, 'keeps yesterday’s streak eligible while today is unfinished')
equal(collectDailyStats(streakStorage, schedule, new Date('2026-09-06T06:00:00Z')).currentStreak, 0, 'expires a streak after a scheduled puzzle is missed')
submitDailyAttempt(streakStorage, schedule[2], ids, { agreed: 5, comparable: 10, percent: 50 }, '2026-09-06T06:00:00Z', 'archive')
equal(collectDailyStats(streakStorage, schedule, new Date('2026-09-06T07:00:00Z')).played, 1, 'excludes archive completions from official play totals')
equal(collectDailyStats(streakStorage, schedule, new Date('2026-09-07T05:00:00Z')).currentStreak, 0, 'expires the current streak when the schedule itself is no longer current')

const archiveStreakStorage = new MemoryStorage()
submitDailyAttempt(archiveStreakStorage, schedule[0], ids, { agreed: 5, comparable: 10, percent: 50 }, '2026-09-04T06:00:00Z', 'daily')
submitDailyAttempt(archiveStreakStorage, schedule[1], ids, { agreed: 5, comparable: 10, percent: 50 }, '2026-09-05T06:00:00Z', 'archive')
equal(collectDailyStats(archiveStreakStorage, schedule, new Date('2026-09-05T07:00:00Z')).currentStreak, 1, 'does not let an archive result extend the daily streak')
submitDailyAttempt(archiveStreakStorage, schedule[1], ids, { agreed: 5, comparable: 10, percent: 50 }, '2026-09-05T08:00:00Z', 'daily')
equal(collectDailyStats(archiveStreakStorage, schedule, new Date('2026-09-05T09:00:00Z')).currentStreak, 1, 'keeps the first archive result authoritative instead of upgrading it')

const futureStorage = new MemoryStorage()
submitDailyAttempt(futureStorage, schedule[0], ids, { agreed: 5, comparable: 10, percent: 50 }, '2026-09-04T06:00:00Z', 'daily')
submitDailyAttempt(futureStorage, schedule[1], ids, { agreed: 5, comparable: 10, percent: 50 }, '2026-09-06T00:00:00Z', 'daily')
equal(collectDailyStats(futureStorage, schedule, new Date('2026-09-05T06:00:00Z')).played, 1, 'ignores a future-dated submission in current stats')
equal(collectDailyStats(futureStorage, schedule, new Date('2026-09-05T06:00:00Z')).currentStreak, 1, 'does not let a future-dated submission extend the current streak')

const impact = (eventId: string, shortTermResponse: number | null) => ({ eventId, shortTermResponse } as StudyEventImpact)
const chain = scoreDailyOrder(ids, [impact('a', 0.04), impact('b', 0.035), impact('c', 0.027), impact('d', -0.02), impact('e', null)], schedule[0].scoring)
equal(chain.tieGroups.map((group) => group.join('+')).join(','), 'a+b,c,d', 'anchors tie groups so a nearby-value chain cannot merge distant endpoints')
const zeroComparison = scoreDailyOrder(ids, ids.map((id) => impact(id, 0.04)), schedule[0].scoring)
equal(zeroComparison.agreement.comparable, 0, 'reports zero comparable pairs when all usable responses tie')
equal(zeroComparison.agreement.percent, null, 'does not force a score with zero comparable pairs')
equal(completedScoreBands(56), 2, 'fills only completed 20-point bands in the share graphic')
equal(completedScoreBands(100), 5, 'fills all score bands only at 100')
const sharePayload = createDailySharePayload(schedule[0], 56, 'https://nexuspoint.example')
equal(sharePayload.title, 'NexusPoint Daily #1', 'share payload identifies the product and exact puzzle number')
equal(sharePayload.text, 'NexusPoint Daily #1\n56/100\n🟩🟩⬜⬜⬜\nCompleted 20-point bands: 2/5\nhttps://nexuspoint.example/?daily=puzzle-1', 'share payload includes the exact score bands and puzzle link without spoilers')
assert(!sharePayload.text!.includes('Headline') && !sharePayload.text!.includes('movement') && !sharePayload.text!.includes('a,b,c'), 'share payload does not expose headline, order, or movement details')

equal(await performShare({ payload: {}, copy: async () => true }), 'unsupported-copied', 'copies when native sharing is unsupported')
equal(await performShare({ payload: {}, copy: async () => false }), 'unavailable', 'reports unavailable sharing and clipboard access')
equal(await performShare({ payload: {}, copy: async () => { throw new Error('clipboard failed') } }), 'unavailable', 'converts a rejected clipboard adapter into an unavailable outcome')
const canceled = new Error('canceled'); canceled.name = 'AbortError'
equal(await performShare({ payload: {}, nativeShare: async () => { throw canceled }, copy: async () => { throw new Error('copy must not run') } }), 'canceled', 'treats native-share cancellation as cancellation without copying')
equal(await performShare({ payload: {}, nativeShare: async () => { throw { name: 'AbortError' } }, copy: async () => { throw new Error('copy must not run') } }), 'canceled', 'treats a DOM-style native-share cancellation as cancellation')
equal(await performShare({ payload: {}, nativeShare: async () => { throw new Error('share failed') }, copy: async () => true }), 'copied', 'falls back to copy after a native-share failure')
equal(await performShare({ payload: {}, nativeShare: async () => { throw new Error('share failed') }, copy: async () => { throw new Error('clipboard failed') } }), 'unavailable', 'reports unavailable when both native share and clipboard fail')

console.log('daily game tests passed')

// Launch uses v2 inclusive boundaries without rewriting historical v1 results.
const v2Scoring = { ...schedule[0].scoring, version: 'pairwise-anchor-1pt-v2' }
const boundaryImpacts = [impact('a', 0.05), impact('b', 0.04), impact('c', 0.03), impact('d', 0.019999), impact('e', null)]
equal(scoreDailyOrder(ids, boundaryImpacts, schedule[0].scoring).tieGroups[0].join('+'), 'a', 'preserves historical v1 floating-point behavior')
equal(scoreDailyOrder(ids, boundaryImpacts, v2Scoring).tieGroups.map((group) => group.join('+')).join(','), 'a+b,c,d', 'v2 includes the exact boundary without chaining or admitting larger differences')
equal(dailyPuzzles.length, 6, 'has six official launch editions')
equal(dailyPuzzles.map(puzzle => puzzle.number).join(','), '1,2,3,4,5,6', 'numbers official editions consecutively from launch day')
for (let i = 1; i < dailyPuzzles.length; i++) {
  const puzzle = dailyPuzzles[i]
  const start = Date.parse(puzzle.releaseTime)
  equal(currentDailyPuzzle(dailyPuzzles, new Date(start - 1))?.id, dailyPuzzles[i - 1].id, 'previous edition remains current until the boundary')
  equal(currentDailyPuzzle(dailyPuzzles, new Date(start))?.id, puzzle.id, 'next launch edition opens at its exact boundary')
  equal(resolveDailyPuzzle(dailyPuzzles, new Date(start - 1), puzzle.id).kind, 'unreleased', 'future launch link remains sealed')
  const archived = resolveDailyPuzzle(dailyPuzzles, new Date(start + 86400000), puzzle.id)
  assert(archived.kind === 'puzzle' && archived.playMode === 'archive', 'shared edition link remains playable after its daily window')
  equal(puzzle.scoring.version, 'pairwise-anchor-1pt-v2', 'future launch editions use inclusive v2 scoring')
}
equal(resolveDailyPuzzle(dailyPuzzles, new Date('2026-09-13T05:00:00Z')).kind, 'exhausted', 'reports the next real queue gap after Canada')

// Renumbering must not discard drafts, change scores, or allow a second submission.
const launchStorage = new MemoryStorage()
const launch = dailyPuzzles[0]
const previousLaunch = { ...launch, number: 2 }
submitDailyAttempt(launchStorage, previousLaunch, launch.initialOrder, { agreed: 3, comparable: 10, percent: 30 }, '2026-09-07T06:00:00Z', 'daily')
const migrated = readDailyAttempt(launchStorage, launch)
assert(migrated.status === 'valid' && migrated.attempt.puzzleNumber === 1 && migrated.attempt.submission?.score === 30, 'restores the launch score under corrected edition number')
equal(submitDailyAttempt(launchStorage, launch, launch.initialOrder, { agreed: 10, comparable: 10, percent: 100 }, '2026-09-07T07:00:00Z', 'daily').status, 'duplicate', 'renumbering cannot unlock a second submission')
equal(collectDailyStats(launchStorage, dailyPuzzles, new Date('2026-09-07T07:00:00Z')).played, 1, 'renumbered launch submission remains in stats')
equal(createDailySharePayload(launch, 30, 'https://nexuspoint.lol').title, 'NexusPoint Daily #1', 'sharing uses corrected launch number')
const launchDrafts = new MemoryStorage()
saveDailyDraft(launchDrafts, previousLaunch, [...launch.initialOrder].reverse(), '2026-09-07T06:00:00Z')
const migratedDraft = readDailyAttempt(launchDrafts, launch)
assert(migratedDraft.status === 'valid' && migratedDraft.attempt.order.join(',') === [...launch.initialOrder].reverse().join(','), 'renumbering preserves an unfinished order')
const corruptNumber = JSON.parse(launchDrafts.getItem(dailyAttemptKey(launch))!)
corruptNumber.puzzleNumber = 999
launchDrafts.setItem(dailyAttemptKey(launch), JSON.stringify(corruptNumber))
equal(readDailyAttempt(launchDrafts, launch).status, 'invalid', 'unrelated puzzle number mismatches remain invalid')

const introStorage = new MemoryStorage()
equal(hasSeenDailyIntro(introStorage), false, 'new players have not seen the intro')
rememberDailyIntro(introStorage)
equal(hasSeenDailyIntro(introStorage), true, 'dismissed intro is remembered on this device')
equal(introStorage.values.size, 1, 'onboarding creates no attempt or score')
rememberDailyIntro(unavailableStorage)
rememberDailyIntro(quotaStorage)
rememberDailyIntro(null)
equal(hasSeenDailyIntro(unavailableStorage), false, 'blocked storage does not crash the introduction')
