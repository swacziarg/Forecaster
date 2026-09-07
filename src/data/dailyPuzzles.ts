import { bidenDropoutStudy } from './bidenDropout2024.ts'
import { assertValidDailyRegistry, DAILY_RELEASE_TIMEZONE, type DailyPuzzle } from '../domain/dailyGame.ts'
import { studyRegistry } from './studies.ts'

// Keep the original archive identity and saved attempts intact when relaunching.
const bidenPreview: DailyPuzzle = {
    id: '2026-09-05-biden-dropout',
    number: 1,
    releaseTime: '2026-09-05T05:00:00Z',
    releaseTimezone: DAILY_RELEASE_TIMEZONE,
    studyId: bidenDropoutStudy.id,
    studyVersion: bidenDropoutStudy.version,
    topic: '24 days that ended Biden’s campaign',
    question: 'What pushed Biden toward the exit?',
    instruction: 'June 27–July 21, 2024. Rank five headlines from the biggest rise in the odds of Biden ending his presidential campaign to the biggest fall.',
    eventIds: ['debate', 'stay-in-race', 'pelosi-clooney', 'trump-shooting', 'renewed-pressure'],
    initialOrder: ['stay-in-race', 'trump-shooting', 'renewed-pressure', 'debate', 'pelosi-clooney'],
    scoring: { version: 'pairwise-anchor-1pt-v1', tieThreshold: 0.01, tieGrouping: 'anchor-window' },
  }

export const dailyPuzzles: readonly DailyPuzzle[] = [
  bidenPreview,
  {
    ...bidenPreview,
    id: '2026-09-07-biden-dropout',
    number: 2,
    releaseTime: '2026-09-07T05:00:00Z',
  },
]

assertValidDailyRegistry(dailyPuzzles, studyRegistry.map(({ study }) => study))
