import { tiktokStudy } from './tiktok2025.ts'
import { eaglesFiveCardStudy } from './eaglesFiveCard2025.ts'
import { oscarsFiveCard2026Study } from './oscarsFiveCard2026.ts'
import { bitcoinFiveCardStudy } from './bitcoinFiveCard2024.ts'
import { canada2025Study } from './canada2025.ts'
import { bidenDropoutStudy } from './bidenDropout2024.ts'
import { assertValidDailyRegistry, DAILY_RELEASE_TIMEZONE, type DailyPuzzle } from '../domain/dailyGame.ts'
import { studyRegistry } from './studies.ts'

// Public numbering starts on the September 7 launch, excluding prelaunch testing.
const bidenLaunch: DailyPuzzle = {
    id: '2026-09-07-biden-dropout',
    number: 1,
    releaseTime: '2026-09-07T05:00:00Z',
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
  bidenLaunch,
  {
    id: "2026-09-08-tiktok-banned-before-may-2025",
    number: 2,
    releaseTime: "2026-09-08T05:00:00Z",
    releaseTimezone: "UTC",
    studyId: "tiktok-banned-before-may-2025-v1",
    studyVersion: 1,
    topic: "The app that went dark",
    eventIds: ["trump-elected", "appeal-lost", "supreme-review", "trump-pause", "supreme-argument"],
    initialOrder: ["supreme-review", "trump-elected", "supreme-argument", "appeal-lost", "trump-pause"],
    instruction: "November 2024–January 2025. Rank the headlines from the biggest rise in the chance of a US TikTok ban to the biggest fall.",
    scoring: {"version": "pairwise-anchor-1pt-v2", "tieThreshold": 0.01, "tieGrouping": "anchor-window"},
    question: tiktokStudy.question,
  },
  {
    id: "2026-09-09-eagles-stop-threepeat",
    number: 3,
    releaseTime: "2026-09-09T05:00:00Z",
    releaseTimezone: "UTC",
    studyId: "eagles-super-bowl-lix-five-v1",
    studyVersion: 1,
    topic: "Stop the three-peat",
    eventIds: ["falcons-collapse", "barkley-record", "hurts-concussion", "snow-playoff", "nfc-title"],
    initialOrder: ["hurts-concussion", "falcons-collapse", "nfc-title", "barkley-record", "snow-playoff"],
    instruction: "September 2024–January 2025. Rank the headlines from the biggest rise in Philadelphia’s chance of winning Super Bowl LIX to the biggest fall.",
    scoring: {"version": "pairwise-anchor-1pt-v2", "tieThreshold": 0.01, "tieGrouping": "anchor-window"},
    question: eaglesFiveCardStudy.question,
  },
  {
    id: "2026-09-10-oscars-best-picture-2026",
    number: 4,
    releaseTime: "2026-09-10T05:00:00Z",
    releaseTimezone: "UTC",
    studyId: "oscars-best-picture-2026-v2",
    studyVersion: 2,
    topic: "One Battle After Another — Best Picture 2026",
    eventIds: ["nbr-best-film", "critics-choice-best-picture", "golden-globes-picture", "oscar-nominations", "pga-top-prize"],
    initialOrder: ["nbr-best-film", "critics-choice-best-picture", "golden-globes-picture", "oscar-nominations", "pga-top-prize"],
    instruction: "December 2025–February 2026. Rank the headlines from the biggest rise in One Battle After Another’s chance of winning Best Picture to the biggest fall.",
    scoring: {"version": "pairwise-anchor-1pt-v2", "tieThreshold": 0.01, "tieGrouping": "anchor-window"},
    question: oscarsFiveCard2026Study.question,
  },
  {
    id: "2026-09-11-bitcoin-100k-2024",
    number: 5,
    releaseTime: "2026-09-11T05:00:00Z",
    releaseTimezone: "UTC",
    studyId: "bitcoin-100k-2024-v2",
    studyVersion: 2,
    topic: "Bitcoin’s road to $100,000",
    eventIds: ["hong-kong-etfs", "mtgox-repayments", "fed-50-cut", "trump-election", "microstrategy-purchase"],
    initialOrder: ["hong-kong-etfs", "mtgox-repayments", "fed-50-cut", "trump-election", "microstrategy-purchase"],
    instruction: "April–November 2024. Rank the headlines from the biggest rise in Bitcoin’s chance of reaching $100,000 that year to the biggest fall.",
    scoring: {"version": "pairwise-anchor-1pt-v2", "tieThreshold": 0.01, "tieGrouping": "anchor-window"},
    question: bitcoinFiveCardStudy.question,
  },
  {
    id: "2026-09-12-canada-liberal-comeback",
    number: 6,
    releaseTime: "2026-09-12T05:00:00Z",
    releaseTimezone: "UTC",
    studyId: "canada-liberal-comeback-v2",
    studyVersion: 2,
    topic: "The Canadian comeback",
    eventIds: ["carney-leadership-launch", "tariff-retaliation", "carney-leadership-win", "election-call", "auto-tariff-response"],
    initialOrder: ["election-call", "carney-leadership-win", "tariff-retaliation", "auto-tariff-response", "carney-leadership-launch"],
    instruction: "January–April 2025. Rank the headlines from the biggest rise in the Liberals’ chance of winning the most seats to the biggest fall.",
    scoring: {"version": "pairwise-anchor-1pt-v2", "tieThreshold": 0.01, "tieGrouping": "anchor-window"},
    question: canada2025Study.question,
  },
]

assertValidDailyRegistry(dailyPuzzles, studyRegistry.map(({ study }) => study))
