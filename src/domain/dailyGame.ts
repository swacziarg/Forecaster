import { createTieGroups, pairwiseAgreement, type StudyEventImpact } from './eventStudy.ts'
import { sourceWasAvailableBy, type Source, type Study, type StudyEvent } from './study.ts'

export const DAILY_RELEASE_TIMEZONE = 'UTC' as const
export const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000

export type DailyScoringRule = {
  version: string
  tieThreshold: number
  tieGrouping: 'anchor-window'
}

export type DailyPuzzle = {
  id: string
  number: number
  releaseTime: string
  releaseTimezone: typeof DAILY_RELEASE_TIMEZONE
  studyId: string
  studyVersion: number
  topic: string
  question: string
  instruction: string
  eventIds: readonly string[]
  initialOrder: readonly string[]
  scoring: DailyScoringRule
}

export type DailyStudyReference = Pick<Study, 'id' | 'version' | 'status' | 'events' | 'sources'>

export type PreRevealCard = {
  event: StudyEvent
  brief: string
  sources: Source[]
}

export type DailyResolution =
  | { kind: 'puzzle'; puzzle: DailyPuzzle; playMode: 'daily' | 'archive'; nextPuzzle: DailyPuzzle | null }
  | { kind: 'unknown'; requestedId: string; currentPuzzle: DailyPuzzle | null }
  | { kind: 'unreleased'; puzzle: DailyPuzzle; currentPuzzle: DailyPuzzle | null }
  | { kind: 'upcoming'; nextPuzzle: DailyPuzzle }
  | { kind: 'gap'; previousPuzzle: DailyPuzzle; nextPuzzle: DailyPuzzle }
  | { kind: 'exhausted'; latestPuzzle: DailyPuzzle | null }

const validDate = (value: string) => Number.isFinite(Date.parse(value))

export function isPermutation(value: unknown, expected: readonly string[]): value is string[] {
  return Array.isArray(value)
    && value.length === expected.length
    && value.every((item): item is string => typeof item === 'string')
    && new Set(value).size === value.length
    && expected.every((id) => value.includes(id))
}

export function getPreRevealCard(study: DailyStudyReference, eventId: string): PreRevealCard | null {
  const event = study.events.find((candidate) => candidate.id === eventId)
  if (!event) return null
  const sourceById = new Map(study.sources.map((source) => [source.id, source]))
  const eligibleClaims = event.claims.filter((claim) => {
    if (claim.visibility !== 'pre-reveal' || !validDate(claim.knownAt) || Date.parse(claim.knownAt) > Date.parse(event.informationKnownAt)) return false
    return claim.sourceIds.length > 0 && claim.sourceIds.every((sourceId) => {
      const source = sourceById.get(sourceId)
      return source !== undefined && sourceWasAvailableBy(source, event.informationKnownAt)
    })
  })
  if (!eligibleClaims.length) return null
  const sourceIds = new Set(eligibleClaims.flatMap((claim) => claim.sourceIds))
  const sources = study.sources.filter((source) => sourceIds.has(source.id))
  if (!sources.length) return null
  return { event, brief: eligibleClaims.map((claim) => claim.text).join(' '), sources }
}

export function getPreRevealBackground(study: Study) {
  const cutoff = Math.min(...study.events.map((event) => Date.parse(event.informationKnownAt)))
  const claims = study.background?.claims.filter((claim) => claim.visibility === 'pre-reveal'
    && validDate(claim.knownAt) && Date.parse(claim.knownAt) <= cutoff && claim.sourceIds.length > 0
    && claim.sourceIds.every((id) => {
      const source = study.sources.find((candidate) => candidate.id === id)
      return source !== undefined && sourceWasAvailableBy(source, claim.knownAt)
    })) ?? []
  const ids = new Set(claims.flatMap((claim) => claim.sourceIds))
  return { title: study.background?.title, claims, sources: study.sources.filter((source) => ids.has(source.id)) }
}

export function validateDailyRegistry(puzzles: readonly DailyPuzzle[], studies: readonly DailyStudyReference[]) {
  const errors: string[] = []
  const studyById = new Map(studies.map((study) => [study.id, study]))
  if (new Set(puzzles.map((puzzle) => puzzle.id)).size !== puzzles.length) errors.push('Daily puzzle IDs must be unique.')
  if (new Set(puzzles.map((puzzle) => puzzle.number)).size !== puzzles.length) errors.push('Daily puzzle numbers must be unique.')
  if (new Set(puzzles.map((puzzle) => puzzle.releaseTime)).size !== puzzles.length) errors.push('Daily release timestamps must be unique.')

  let previousRelease = Number.NEGATIVE_INFINITY
  let previousNumber = 0
  for (const puzzle of puzzles) {
    const release = Date.parse(puzzle.releaseTime)
    if (!Number.isFinite(release)) errors.push(`Daily puzzle ${puzzle.id} has an invalid release timestamp.`)
    if (release <= previousRelease) errors.push('Daily puzzles must be ordered by increasing release timestamp.')
    previousRelease = release
    if (puzzle.releaseTimezone !== DAILY_RELEASE_TIMEZONE) errors.push(`Daily puzzle ${puzzle.id} must declare UTC as its release timezone.`)
    if (!Number.isInteger(puzzle.number) || puzzle.number < 1) errors.push(`Daily puzzle ${puzzle.id} has an invalid number.`)
    if (puzzle.number <= previousNumber) errors.push('Daily puzzle numbers must increase with the publication schedule.')
    previousNumber = puzzle.number
    if (puzzle.eventIds.length !== 5 || new Set(puzzle.eventIds).size !== 5) errors.push(`Daily puzzle ${puzzle.id} must contain five unique event IDs.`)
    if (!isPermutation(puzzle.initialOrder, puzzle.eventIds)) errors.push(`Daily puzzle ${puzzle.id} initial order must be a permutation of its event IDs.`)
    if (!puzzle.scoring.version || puzzle.scoring.tieGrouping !== 'anchor-window' || !Number.isFinite(puzzle.scoring.tieThreshold) || puzzle.scoring.tieThreshold < 0) errors.push(`Daily puzzle ${puzzle.id} has an invalid scoring rule.`)
    const study = studyById.get(puzzle.studyId)
    if (!study || study.version !== puzzle.studyVersion) {
      errors.push(`Daily puzzle ${puzzle.id} references an unknown study version.`)
      continue
    }
    if (study.status !== 'published') errors.push(`Daily puzzle ${puzzle.id} references a study that is not published.`)
    for (const eventId of puzzle.eventIds) if (!getPreRevealCard(study, eventId)) errors.push(`Daily puzzle ${puzzle.id} event ${eventId} lacks eligible pre-reveal evidence.`)
  }
  return errors
}

export function assertValidDailyRegistry(puzzles: readonly DailyPuzzle[], studies: readonly DailyStudyReference[]) {
  const errors = validateDailyRegistry(puzzles, studies)
  if (errors.length) throw new Error(errors.join('\n'))
  return puzzles
}

export function puzzleWindowEnd(puzzles: readonly DailyPuzzle[], index: number) {
  const release = Date.parse(puzzles[index].releaseTime)
  const nextRelease = puzzles[index + 1] ? Date.parse(puzzles[index + 1].releaseTime) : Number.POSITIVE_INFINITY
  return Math.min(release + DAILY_WINDOW_MS, nextRelease)
}

export function currentDailyPuzzle(puzzles: readonly DailyPuzzle[], now: Date) {
  const timestamp = now.getTime()
  for (let index = puzzles.length - 1; index >= 0; index -= 1) {
    const release = Date.parse(puzzles[index].releaseTime)
    if (timestamp >= release && timestamp < puzzleWindowEnd(puzzles, index)) return puzzles[index]
  }
  return null
}

export function nextScheduledPuzzle(puzzles: readonly DailyPuzzle[], now: Date) {
  return puzzles.find((puzzle) => Date.parse(puzzle.releaseTime) > now.getTime()) ?? null
}

export function resolveDailyPuzzle(puzzles: readonly DailyPuzzle[], now: Date, requestedId?: string | null): DailyResolution {
  const currentPuzzle = currentDailyPuzzle(puzzles, now)
  if (requestedId) {
    const requested = puzzles.find((puzzle) => puzzle.id === requestedId)
    if (!requested) return { kind: 'unknown', requestedId, currentPuzzle }
    if (Date.parse(requested.releaseTime) > now.getTime()) return { kind: 'unreleased', puzzle: requested, currentPuzzle }
    const index = puzzles.indexOf(requested)
    return { kind: 'puzzle', puzzle: requested, playMode: currentPuzzle?.id === requested.id ? 'daily' : 'archive', nextPuzzle: puzzles[index + 1] ?? null }
  }
  if (currentPuzzle) {
    const index = puzzles.indexOf(currentPuzzle)
    return { kind: 'puzzle', puzzle: currentPuzzle, playMode: 'daily', nextPuzzle: puzzles[index + 1] ?? null }
  }
  const nextPuzzle = nextScheduledPuzzle(puzzles, now)
  const released = puzzles.filter((puzzle) => Date.parse(puzzle.releaseTime) <= now.getTime())
  const latestPuzzle = released[released.length - 1] ?? null
  if (!latestPuzzle && nextPuzzle) return { kind: 'upcoming', nextPuzzle }
  if (latestPuzzle && nextPuzzle) return { kind: 'gap', previousPuzzle: latestPuzzle, nextPuzzle }
  return { kind: 'exhausted', latestPuzzle }
}

export function scoreDailyOrder(order: readonly string[], impacts: StudyEventImpact[], scoring: DailyScoringRule) {
  // v2 absorbs floating-point subtraction noise at the inclusive one-point boundary.
  // Historical v1 submissions and their comparison groups retain the original rule.
  const tieGroups = createTieGroups(impacts, scoring.tieThreshold, scoring.version === 'pairwise-anchor-1pt-v2' ? 1e-12 : 0)
  return { tieGroups, agreement: pairwiseAgreement([...order], tieGroups) }
}

export function completedScoreBands(score: number | null) {
  if (score === null) return 0
  return Math.max(0, Math.min(5, Math.floor(score / 20)))
}

export function createDailySharePayload(puzzle: DailyPuzzle, score: number | null, origin: string, path = `/?daily=${encodeURIComponent(puzzle.id)}`): ShareData {
  const filled = completedScoreBands(score)
  const tiles = `${'🟩'.repeat(filled)}${'⬜'.repeat(5 - filled)}`
  const shareUrl = new URL(path, origin).toString()
  return {
    title: `NexusPoint Daily #${puzzle.number}`,
    text: `NexusPoint Daily #${puzzle.number}\n${score === null ? 'Unscored' : `${score}/100`}\n${tiles}\nCompleted 20-point bands: ${filled}/5\n${shareUrl}`,
  }
}

export type ShareOutcome = 'shared' | 'copied' | 'unsupported-copied' | 'canceled' | 'unavailable'

export async function performShare(options: {
  payload: ShareData
  nativeShare?: (payload: ShareData) => Promise<void>
  copy: () => Promise<boolean>
}): Promise<ShareOutcome> {
  const copySafely = async () => {
    try { return await options.copy() }
    catch { return false }
  }
  if (!options.nativeShare) return await copySafely() ? 'unsupported-copied' : 'unavailable'
  try {
    await options.nativeShare(options.payload)
    return 'shared'
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError') return 'canceled'
    return await copySafely() ? 'copied' : 'unavailable'
  }
}
