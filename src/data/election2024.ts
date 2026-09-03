import type { ImpactEventDefinition, MarketSeriesPoint } from '../domain/eventStudy.ts'
import { parseHourlyMarketCsv } from '../domain/eventStudy.ts'

export const electionMarket = {
  question: 'What changed Trump’s odds of winning the 2024 presidential election?',
  contract: 'Will Donald Trump win the 2024 US Presidential Election?',
  provider: 'Polymarket',
  period: 'June 1 – November 5, 2024',
  outcome: 'YES',
  volume: 1_531_479_285,
  tokenId: '21742633143463906290569050155826241533067272736897614950488156847949938836455',
  marketUrl: 'https://polymarket.com/event/presidential-election-winner-2024/will-donald-trump-win-the-2024-us-presidential-election',
  datasetUrl: 'https://www.sebastianstoeckl.com/eventclock/reference/polymarket2024.html',
} as const

export const electionEvents: ImpactEventDefinition[] = [
  {
    id: 'first-debate',
    title: 'Biden–Trump debate',
    shortTitle: 'First debate',
    timestamp: '2024-06-28T01:00:00Z',
    dateLabel: 'Jun 27',
    category: 'Debate',
    summary: 'Biden and Trump met for the first general-election debate, triggering a rapid reassessment of the Democratic ticket.',
    interpretation: 'Trump’s price jumped immediately, then surrendered part of the move. The stabilized window suggests a meaningful but smaller durable repricing than the initial reaction.',
    competingExplanation: 'Post-debate discussion focused heavily on whether Biden would remain the nominee, so this movement combines candidate-performance information with replacement risk.',
    confidence: 'High',
    attributionShare: 75,
    source: { label: 'CNN debate transcript', publisher: 'CNN', url: 'https://www.cnn.com/2024/06/27/politics/read-biden-trump-debate-rush-transcript/index.html', publishedAt: '2024-06-28T00:00:00Z' },
  },
  {
    id: 'assassination-attempt',
    title: 'Attempted assassination in Butler',
    shortTitle: 'Butler attack',
    timestamp: '2024-07-13T22:11:00Z',
    dateLabel: 'Jul 13',
    category: 'Campaign',
    summary: 'A gunman fired at Trump during a campaign rally in Butler, Pennsylvania, injuring him and killing an attendee.',
    interpretation: 'This is the cleanest large discontinuity in the series: the market moved sharply within hours and remained near the new level through the stabilization window.',
    competingExplanation: 'The Republican convention began two days later, but most of the movement arrived before the convention opened.',
    confidence: 'High',
    attributionShare: 90,
    source: { label: 'FBI statement on the Butler incident', publisher: 'Federal Bureau of Investigation', url: 'https://www.fbi.gov/news/press-releases/fbi-statement-on-incident-in-butler-pennsylvania', publishedAt: '2024-07-14T00:00:00Z' },
  },
  {
    id: 'biden-withdraws',
    title: 'Biden withdraws from the race',
    shortTitle: 'Biden withdraws',
    timestamp: '2024-07-21T17:46:00Z',
    dateLabel: 'Jul 21',
    category: 'Candidate change',
    summary: 'President Biden ended his reelection campaign and endorsed Vice President Harris for the Democratic nomination.',
    interpretation: 'Trump’s market price moved lower as the known Biden matchup was replaced by a less settled contest against a new likely nominee.',
    competingExplanation: 'The withdrawal had been increasingly anticipated, so part of its effect was already reflected in prices before the announcement.',
    confidence: 'High',
    attributionShare: 85,
    source: { label: 'Biden withdrawal statement', publisher: 'The American Presidency Project', url: 'https://www.presidency.ucsb.edu/documents/letter-the-american-people-announcing-his-decision-not-seek-reelection', publishedAt: '2024-07-21T17:46:00Z' },
  },
  {
    id: 'harris-walz-ticket',
    title: 'Harris–Walz ticket takes shape',
    shortTitle: 'Harris–Walz ticket',
    timestamp: '2024-08-06T13:00:00Z',
    dateLabel: 'Aug 6',
    category: 'Candidate change',
    summary: 'Harris secured the Democratic nomination and selected Minnesota Governor Tim Walz as her running mate.',
    interpretation: 'Trump’s price declined as uncertainty around the replacement ticket resolved and the Democratic campaign consolidated.',
    competingExplanation: 'The nomination and vice-presidential selection unfolded across several days, making this a distributed information event rather than a single clean announcement.',
    confidence: 'Medium',
    attributionShare: 65,
    source: { label: 'Harris selects Tim Walz', publisher: 'Associated Press', url: 'https://apnews.com/article/harris-running-mate-tim-walz-5b4495b8c8b7f9b3a84b07e43e85214b', publishedAt: '2024-08-06T13:00:00Z' },
  },
  {
    id: 'harris-trump-debate',
    title: 'Harris–Trump debate',
    shortTitle: 'Second debate',
    timestamp: '2024-09-11T01:00:00Z',
    dateLabel: 'Sep 10',
    category: 'Debate',
    summary: 'Harris and Trump met for their only presidential debate of the general-election campaign.',
    interpretation: 'Trump’s probability fell during the immediate window and remained lower the following day, indicating a modest durable negative repricing.',
    competingExplanation: 'Polling expectations and endorsements released around the debate may account for a portion of the move.',
    confidence: 'High',
    attributionShare: 80,
    source: { label: 'ABC News debate transcript', publisher: 'ABC News', url: 'https://abcnews.go.com/Politics/harris-trump-presidential-debate-transcript/story?id=113560542', publishedAt: '2024-09-11T01:00:00Z' },
  },
  {
    id: 'iowa-poll',
    title: 'Selzer poll shows Harris ahead in Iowa',
    shortTitle: 'Iowa poll',
    timestamp: '2024-11-03T00:00:00Z',
    dateLabel: 'Nov 2',
    category: 'Polling',
    summary: 'The final Des Moines Register/Mediacom Iowa Poll showed Harris leading Trump in a state he had won comfortably in 2020.',
    interpretation: 'Trump’s market probability fell quickly and stayed below its pre-release level, reflecting concern that the poll might signal a broader regional miss.',
    competingExplanation: 'Other final polls, late positioning, and thin weekend liquidity contributed to unusually volatile prices.',
    confidence: 'Medium',
    attributionShare: 75,
    source: { label: 'Final Iowa Poll', publisher: 'Des Moines Register', url: 'https://www.desmoinesregister.com/story/news/politics/iowa-poll/2024/11/02/iowa-poll-kamala-harris-leads-donald-trump-2024-presidential-race/75641419007/', publishedAt: '2024-11-03T00:00:00Z' },
  },
]

export async function loadElectionMarketSeries(): Promise<MarketSeriesPoint[]> {
  const response = await fetch('/data/polymarket-2024-hourly.csv')
  if (!response.ok) throw new Error(`Election market history could not load (${response.status}).`)
  return parseHourlyMarketCsv(await response.text())
}

