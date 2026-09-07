import { currentDailyPuzzle, isPermutation, puzzleWindowEnd, type DailyPuzzle } from './dailyGame.ts'

export const DAILY_ATTEMPT_SCHEMA_VERSION = 2 as const

export type DailySubmission = {
  order: string[]
  submittedAt: string
  score: number | null
  agreed: number
  comparable: number
  playMode: 'daily' | 'archive'
}

export type DailyAttempt = {
  schemaVersion: typeof DAILY_ATTEMPT_SCHEMA_VERSION
  puzzleId: string
  puzzleNumber: number
  releaseTime: string
  studyId: string
  studyVersion: number
  scoringVersion: string
  eventIds: string[]
  order: string[]
  updatedAt: string
  submission?: DailySubmission
}

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export type AttemptRead =
  | { status: 'empty' }
  | { status: 'valid'; attempt: DailyAttempt }
  | { status: 'invalid' }
  | { status: 'unavailable' }

export type DailyStats = {
  played: number
  averageScore: number | null
  currentStreak: number
  persistenceAvailable: boolean
}

const timestampValue = (value: unknown) => typeof value === 'string' ? Date.parse(value) : Number.NaN
const validTimestamp = (value: unknown): value is string => Number.isFinite(timestampValue(value))
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

export function dailyAttemptKey(puzzle: DailyPuzzle) {
  return `eventlens.daily.attempt.v${DAILY_ATTEMPT_SCHEMA_VERSION}.${puzzle.id}.${puzzle.scoring.version}`
}

export function parseDailyAttempt(value: unknown, puzzle: DailyPuzzle): DailyAttempt | null {
  const releaseTime = Date.parse(puzzle.releaseTime)
  if (!isRecord(value)
    || value.schemaVersion !== DAILY_ATTEMPT_SCHEMA_VERSION
    || value.puzzleId !== puzzle.id
    || value.puzzleNumber !== puzzle.number
    || value.releaseTime !== puzzle.releaseTime
    || value.studyId !== puzzle.studyId
    || value.studyVersion !== puzzle.studyVersion
    || value.scoringVersion !== puzzle.scoring.version
    || !isPermutation(value.eventIds, puzzle.eventIds)
    || !isPermutation(value.order, puzzle.eventIds)
    || !validTimestamp(value.updatedAt)
    || timestampValue(value.updatedAt) < releaseTime) return null

  let submission: DailySubmission | undefined
  if (value.submission !== undefined) {
    if (!isRecord(value.submission)
      || !isPermutation(value.submission.order, puzzle.eventIds)
      || !validTimestamp(value.submission.submittedAt)
      || timestampValue(value.submission.submittedAt) < releaseTime
      || timestampValue(value.submission.submittedAt) > timestampValue(value.updatedAt)
      || (value.submission.playMode !== 'daily' && value.submission.playMode !== 'archive')
      || !Number.isInteger(value.submission.agreed)
      || !Number.isInteger(value.submission.comparable)) return null
    const agreed = value.submission.agreed as number
    const comparable = value.submission.comparable as number
    const maximumPairs = puzzle.eventIds.length * (puzzle.eventIds.length - 1) / 2
    if (agreed < 0 || comparable < 0 || agreed > comparable || comparable > maximumPairs) return null
    const expectedScore = comparable === 0 ? null : Math.round(agreed / comparable * 100)
    const score = value.submission.score
    if (score !== expectedScore || (typeof score === 'number' && (!Number.isFinite(score) || score < 0 || score > 100))) return null
    submission = {
      order: [...value.submission.order], submittedAt: value.submission.submittedAt, score: expectedScore,
      agreed, comparable, playMode: value.submission.playMode,
    }
  }

  return {
    schemaVersion: DAILY_ATTEMPT_SCHEMA_VERSION,
    puzzleId: puzzle.id,
    puzzleNumber: puzzle.number,
    releaseTime: puzzle.releaseTime,
    studyId: puzzle.studyId,
    studyVersion: puzzle.studyVersion,
    scoringVersion: puzzle.scoring.version,
    eventIds: [...puzzle.eventIds],
    order: [...value.order],
    updatedAt: value.updatedAt,
    submission,
  }
}

export function readDailyAttempt(storage: StorageLike | null | undefined, puzzle: DailyPuzzle): AttemptRead {
  if (!storage) return { status: 'unavailable' }
  let raw: string | null
  try { raw = storage.getItem(dailyAttemptKey(puzzle)) } catch { return { status: 'unavailable' } }
  if (raw === null) return { status: 'empty' }
  try {
    const attempt = parseDailyAttempt(JSON.parse(raw), puzzle)
    return attempt ? { status: 'valid', attempt } : { status: 'invalid' }
  } catch {
    return { status: 'invalid' }
  }
}

function baseAttempt(puzzle: DailyPuzzle, order: readonly string[], timestamp: string): DailyAttempt {
  return {
    schemaVersion: DAILY_ATTEMPT_SCHEMA_VERSION,
    puzzleId: puzzle.id,
    puzzleNumber: puzzle.number,
    releaseTime: puzzle.releaseTime,
    studyId: puzzle.studyId,
    studyVersion: puzzle.studyVersion,
    scoringVersion: puzzle.scoring.version,
    eventIds: [...puzzle.eventIds],
    order: [...order],
    updatedAt: timestamp,
  }
}

function writeAttempt(storage: StorageLike | null | undefined, puzzle: DailyPuzzle, attempt: DailyAttempt) {
  if (!storage) return false
  try {
    storage.setItem(dailyAttemptKey(puzzle), JSON.stringify(attempt))
    return true
  } catch {
    return false
  }
}

export function saveDailyDraft(storage: StorageLike | null | undefined, puzzle: DailyPuzzle, order: readonly string[], timestamp: string) {
  const timestampMs = timestampValue(timestamp)
  if (!isPermutation(order, puzzle.eventIds) || !validTimestamp(timestamp) || timestampMs < Date.parse(puzzle.releaseTime)) return { status: 'invalid' as const }
  const existing = readDailyAttempt(storage, puzzle)
  if (existing.status === 'unavailable') return { status: 'unavailable' as const }
  if (existing.status === 'valid' && existing.attempt.submission) return { status: 'submitted' as const, attempt: existing.attempt }
  if (existing.status === 'valid' && timestampValue(existing.attempt.updatedAt) >= timestampMs) return { status: 'stale' as const, attempt: existing.attempt }
  const attempt = baseAttempt(puzzle, order, timestamp)
  return writeAttempt(storage, puzzle, attempt) ? { status: 'saved' as const, attempt } : { status: 'unavailable' as const }
}

export function submitDailyAttempt(storage: StorageLike | null | undefined, puzzle: DailyPuzzle, order: readonly string[], agreement: { agreed: number; comparable: number; percent: number | null }, timestamp: string, playMode: 'daily' | 'archive') {
  if (!isPermutation(order, puzzle.eventIds)
    || !validTimestamp(timestamp)
    || timestampValue(timestamp) < Date.parse(puzzle.releaseTime)
    || (playMode !== 'daily' && playMode !== 'archive')) return { status: 'invalid' as const }
  const maximumPairs = puzzle.eventIds.length * (puzzle.eventIds.length - 1) / 2
  const expectedScore = agreement.comparable === 0 ? null : Math.round(agreement.agreed / agreement.comparable * 100)
  if (!Number.isInteger(agreement.agreed) || !Number.isInteger(agreement.comparable) || agreement.agreed < 0 || agreement.comparable < 0 || agreement.agreed > agreement.comparable || agreement.comparable > maximumPairs || agreement.percent !== expectedScore) return { status: 'invalid' as const }
  const existing = readDailyAttempt(storage, puzzle)
  if (existing.status === 'unavailable') return { status: 'unavailable' as const }
  if (existing.status === 'valid' && existing.attempt.submission) return { status: 'duplicate' as const, attempt: existing.attempt }
  const attempt = baseAttempt(puzzle, order, timestamp)
  attempt.submission = { order: [...order], submittedAt: timestamp, score: agreement.percent, agreed: agreement.agreed, comparable: agreement.comparable, playMode }
  return writeAttempt(storage, puzzle, attempt) ? { status: 'submitted' as const, attempt } : { status: 'unavailable' as const }
}

export function collectDailyStats(storage: StorageLike | null | undefined, puzzles: readonly DailyPuzzle[], now: Date): DailyStats {
  const official = new Map<string, DailyAttempt>()
  let persistenceAvailable = true
  const nowTimestamp = now.getTime()
  for (const [index, puzzle] of puzzles.entries()) {
    const read = readDailyAttempt(storage, puzzle)
    if (read.status === 'unavailable') persistenceAvailable = false
    if (read.status !== 'valid') continue
    const submission = read.attempt.submission
    const submittedAt = submission ? timestampValue(submission.submittedAt) : Number.NaN
    if (submission?.playMode === 'daily'
      && submittedAt >= Date.parse(puzzle.releaseTime)
      && submittedAt < puzzleWindowEnd(puzzles, index)
      && submittedAt <= nowTimestamp) official.set(puzzle.id, read.attempt)
  }
  const scores = [...official.values()].flatMap((attempt) => attempt.submission?.score === null || attempt.submission?.score === undefined ? [] : [attempt.submission.score])
  const current = currentDailyPuzzle(puzzles, now)
  let currentStreak = 0
  if (current) {
    const currentIndex = puzzles.indexOf(current)
    let cursor = official.has(current.id) ? currentIndex : currentIndex - 1
    if (cursor >= 0 && currentIndex - cursor <= 1 && official.has(puzzles[cursor].id)) {
      while (cursor >= 0 && official.has(puzzles[cursor].id)) { currentStreak += 1; cursor -= 1 }
    }
  }
  return {
    played: official.size,
    averageScore: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null,
    currentStreak,
    persistenceAvailable,
  }
}
