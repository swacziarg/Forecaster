import type { ImpactEventDefinition, MarketSeriesPoint } from '../domain/eventStudy.ts'
import { LEGACY_ELECTION_PROFILE, parseHourlyMarketCsv } from '../domain/eventStudy.ts'
import type { Source, Study, StudyEvent } from '../domain/study.ts'

export const electionMarket = {
  question: 'Which events mattered most in the 2024 presidential election?',
  contract: 'Will Donald Trump win the 2024 US Presidential Election?',
  provider: 'Polymarket',
  period: 'May 29 - November 5, 2024',
  outcome: 'YES',
  volume: 1_531_479_285,
  tokenId: '21742633143463906290569050155826241533067272736897614950488156847949938836455',
  marketUrl: 'https://polymarket.com/event/presidential-election-winner-2024/will-donald-trump-win-the-2024-us-presidential-election',
  datasetUrl: 'https://docs.polymarket.com/api-reference/markets/get-prices-history',
} as const

export const electionEvents: ImpactEventDefinition[] = [
  {
    id: 'trump-conviction', title: 'Trump convicted in New York', shortTitle: 'New York conviction', timestamp: '2024-05-30T21:07:00Z', dateLabel: 'May 30', category: 'Legal',
    summary: 'A New York jury found Trump guilty on all 34 felony counts in the hush-money case, the first criminal conviction of a former U.S. president.',
    mechanism: 'The verdict could repel persuadable voters, while grievance, attention, and an immediate fundraising surge could mobilize Trump supporters.',
    expectedDirection: 'Ambiguous',
    interpretation: 'Trump\'s contract fell immediately and recovered part of the loss by the stabilization window. The market registered the conviction, but not as a campaign-ending event.',
    competingExplanation: 'The post-verdict fundraising response became clear over the following day, so the same window mixes legal risk with evidence of Republican mobilization.',
    confidence: 'High', attributionShare: 65,
    source: { label: 'Trump campaign reports post-verdict fundraising surge', publisher: 'CBS News', url: 'https://www.cbsnews.com/news/trump-fundraising-guilty-verdict-new-york-conviction/', publishedAt: '2024-05-31T00:00:00Z' },
  },
  {
    id: 'first-debate', title: 'Biden\'s disastrous debate against Trump', shortTitle: 'Biden debate', timestamp: '2024-06-28T01:00:00Z', dateLabel: 'Jun 27', category: 'Debate',
    summary: 'Biden appeared hesitant and struggled through several answers, sharply intensifying concern about his age and ability to continue as the nominee.',
    mechanism: 'A weakened opponent raised Trump\'s near-term odds and opened the possibility of a disruptive Democratic candidate replacement.',
    expectedDirection: 'Helps Trump',
    interpretation: 'This produced the second-largest measured discontinuity. Trump\'s price jumped immediately, then retained a smaller but clear gain after the first reaction cooled.',
    competingExplanation: 'The move bundled debate performance with new uncertainty about whether Biden would remain the nominee.',
    confidence: 'High', attributionShare: 85,
    source: { label: 'CNN presidential debate transcript', publisher: 'CNN', url: 'https://www.cnn.com/2024/06/27/politics/read-biden-trump-debate-rush-transcript/index.html', publishedAt: '2024-06-28T00:00:00Z' },
  },
  {
    id: 'assassination-attempt', title: 'Trump survives the Butler assassination attempt', shortTitle: 'Butler attack', timestamp: '2024-07-13T22:11:00Z', dateLabel: 'Jul 13', category: 'Campaign',
    summary: 'A gunman wounded Trump at a Pennsylvania rally. Images of him raising his fist after the shooting immediately dominated the campaign.',
    mechanism: 'The attack could create a sympathy and unity effect, strengthen turnout motivation, and change perceptions of Trump\'s resilience.',
    expectedDirection: 'Helps Trump',
    interpretation: 'This was the largest and cleanest measured jump: the contract moved by roughly ten points within hours and held near the new level through the stabilized window.',
    competingExplanation: 'The Republican convention began two days later, but most of the repricing arrived before it opened.',
    confidence: 'High', attributionShare: 90,
    source: { label: 'FBI statement on the Butler incident', publisher: 'Federal Bureau of Investigation', url: 'https://www.fbi.gov/news/press-releases/fbi-statement-on-incident-in-butler-pennsylvania', publishedAt: '2024-07-14T00:00:00Z' },
  },
  {
    id: 'biden-withdraws', title: 'Biden drops out and endorses Harris', shortTitle: 'Biden drops out', timestamp: '2024-07-21T17:46:00Z', dateLabel: 'Jul 21', category: 'Candidate change',
    summary: 'Biden ended his reelection campaign and endorsed Harris, forcing Democrats to rebuild their general-election campaign with about three months remaining.',
    mechanism: 'Replacing an unpopular incumbent could improve Democratic enthusiasm and reset the matchup, while a compressed campaign created execution risk.',
    expectedDirection: 'Hurts Trump',
    interpretation: 'Trump\'s price moved lower, but much less than the Butler jump. The modest move is consistent with a withdrawal that traders had increasingly anticipated.',
    competingExplanation: 'Replacement risk had been repricing for days as Democratic leaders publicly pressed Biden to leave.',
    confidence: 'High', attributionShare: 85,
    source: { label: 'Biden withdrawal statement', publisher: 'The American Presidency Project', url: 'https://www.presidency.ucsb.edu/documents/letter-the-american-people-announcing-his-decision-not-seek-reelection', publishedAt: '2024-07-21T17:46:00Z' },
  },
  {
    id: 'harris-walz-ticket', title: 'Harris selects Tim Walz', shortTitle: 'Harris-Walz ticket', timestamp: '2024-08-06T13:00:00Z', dateLabel: 'Aug 6', category: 'Candidate change',
    summary: 'Harris secured the Democratic nomination and selected Minnesota Governor Tim Walz as her running mate.',
    mechanism: 'A completed ticket reduced uncertainty, concentrated Democratic media attention, and gave the new campaign a Midwestern surrogate.',
    expectedDirection: 'Hurts Trump',
    interpretation: 'Trump\'s price declined across the stabilization window. The move was meaningful, although the ticket formation unfolded over several days.',
    competingExplanation: 'Harris was already consolidating the nomination and improving in polls, making the vice-presidential selection only one part of a broader reset.',
    confidence: 'Medium', attributionShare: 60,
    source: { label: 'Harris selects Tim Walz', publisher: 'Associated Press', url: 'https://apnews.com/article/harris-running-mate-tim-walz-5b4495b8c8b7f9b3a84b07e43e85214b', publishedAt: '2024-08-06T13:00:00Z' },
  },
  {
    id: 'harris-trump-debate', title: 'Harris and Trump debate', shortTitle: 'Harris debate', timestamp: '2024-09-11T01:00:00Z', dateLabel: 'Sep 10', category: 'Debate',
    summary: 'Harris and Trump met for their only presidential debate of the general-election campaign.',
    mechanism: 'A strong Harris performance could validate the candidate switch, while a strong Trump performance could define his newer opponent before voting began.',
    expectedDirection: 'Hurts Trump',
    interpretation: 'Trump\'s probability fell during the immediate window and remained lower the following day, a modest durable negative repricing.',
    competingExplanation: 'Polling expectations and endorsements released around the debate may account for part of the move.',
    confidence: 'High', attributionShare: 80,
    source: { label: 'ABC News presidential debate transcript', publisher: 'ABC News', url: 'https://abcnews.go.com/Politics/harris-trump-presidential-debate-transcript/story?id=113560542', publishedAt: '2024-09-11T01:00:00Z' },
  },
  {
    id: 'vice-presidential-debate', title: 'Vance and Walz debate', shortTitle: 'VP debate', timestamp: '2024-10-02T01:00:00Z', dateLabel: 'Oct 1', category: 'Debate',
    summary: 'JD Vance and Tim Walz held a civil, policy-heavy vice-presidential debate, the campaign\'s final scheduled debate.',
    mechanism: 'Vance could reassure voters concerned by his rollout and prosecute Trump\'s case more calmly, but vice-presidential debates rarely change vote choice.',
    expectedDirection: 'Helps Trump',
    interpretation: 'The contract barely moved. This is a useful high-attention, low-impact event: viewers reassessed the running mates without materially repricing the top-line race.',
    competingExplanation: 'Any small movement sits within ordinary hourly noise and cannot be cleanly separated from contemporaneous polling.',
    confidence: 'Medium', attributionShare: 35,
    source: { label: 'Vance-Walz debate takeaways', publisher: 'Associated Press', url: 'https://apnews.com/article/5b6f219b555416ff579764048ac238a1', publishedAt: '2024-10-02T02:19:00Z' },
  },
  {
    id: 'joe-rogan-interview', title: 'Trump appears on Joe Rogan', shortTitle: 'Joe Rogan interview', timestamp: '2024-10-26T00:00:00Z', dateLabel: 'Oct 25', category: 'Media',
    summary: 'Trump spent nearly three hours in a friendly, wide-ranging conversation that reached a large younger-male audience but also repeated false 2020-election claims and inflammatory rhetoric about domestic opponents.',
    mechanism: 'The format could humanize Trump and mobilize a target demographic, while the meandering answers, false claims, and "enemy from within" language could reinforce concerns among persuadable voters.',
    expectedDirection: 'Ambiguous',
    interpretation: 'The standardized 18–36 hour response was flat, but the 48–72 hour median rose about 1.4 points above the pre-release baseline. The graph does show a delayed pro-Trump bump; the timing is slower than an immediate interview reaction.',
    competingExplanation: 'The delayed window overlaps the Oct. 27 Madison Square Garden rally, new polling, and late-campaign order flow. Rogan may have contributed, but the full rise cannot be cleanly assigned to the interview.',
    confidence: 'Medium', attributionShare: 30,
    source: { label: 'What Trump did and did not say on Rogan', publisher: 'NPR', url: 'https://www.npr.org/2024/10/26/g-s1-30151/trump-joe-rogan-experience-podcast-traverse-city-michigan-election', publishedAt: '2024-10-26T15:26:00Z' },
  },
  {
    id: 'garbage-controversy', title: 'Biden\'s "garbage" controversy', shortTitle: 'Garbage controversy', timestamp: '2024-10-30T00:00:00Z', dateLabel: 'Oct 29', category: 'Campaign',
    summary: 'Biden made a remark Republicans interpreted as calling Trump supporters "garbage." Trump turned it into a closing campaign visual with a branded garbage truck.',
    mechanism: 'The controversy could reinforce Republican grievance and give Trump a concise mobilization message during the final week.',
    expectedDirection: 'Helps Trump',
    interpretation: 'The contract did not move in the expected direction during the stabilization window. The episode dominated coverage but provides little evidence of a positive immediate market effect.',
    competingExplanation: 'The remark followed backlash to a comedian\'s insult about Puerto Rico at Trump\'s Madison Square Garden rally, so the two narratives competed in the same news cycle.',
    confidence: 'Medium', attributionShare: 45,
    source: { label: 'Trump responds from a garbage truck', publisher: 'Associated Press', url: 'https://apnews.com/article/1b9b2882b59639ba0dc898b0b45e395b', publishedAt: '2024-10-31T00:41:00Z' },
  },
  {
    id: 'iowa-poll', title: 'Selzer poll shows Harris ahead in Iowa', shortTitle: 'Selzer Iowa poll', timestamp: '2024-11-03T00:00:00Z', dateLabel: 'Nov 2', category: 'Polling',
    summary: 'The final Des Moines Register/Mediacom Iowa Poll showed Harris leading in a state Trump had won comfortably in 2020.',
    mechanism: 'If the respected poll exposed a broader Midwestern polling miss, Trump\'s path through nearby battleground states could be weaker than markets assumed.',
    expectedDirection: 'Hurts Trump',
    interpretation: 'Trump\'s probability fell quickly and stayed below its pre-release level. It was the largest negative measured response among the ten events.',
    competingExplanation: 'Other final polls, late position-closing, and thin weekend liquidity contributed to unusually volatile prices.',
    confidence: 'Medium', attributionShare: 80,
    source: { label: 'Final Iowa Poll', publisher: 'Des Moines Register', url: 'https://www.desmoinesregister.com/story/news/politics/iowa-poll/2024/11/02/iowa-poll-kamala-harris-leads-donald-trump-2024-presidential-race/75641419007/', publishedAt: '2024-11-03T00:00:00Z' },
  },
]

export type MarketMoveNote = {
  id: string
  timestamp: string
  title: string
  explanation: string
  source: { label: string; url: string }
}

export const marketMoveNotes: MarketMoveNote[] = [
  { id: 'biden-exit-pressure', timestamp: '2024-07-18T12:00:00Z', title: 'Biden exit risk repriced before he withdrew', explanation: 'Democratic pressure and reporting about a narrowing path moved replacement risk before the formal July 21 announcement. It overlaps that event, so it is not ranked twice.', source: { label: 'Reuters reporting on pressure inside the campaign', url: 'https://www.marketscreener.com/news/latest/Under-pressure-Biden-camp-charts-narrowing-path-to-reelection-47411064/' } },
  { id: 'harris-reset', timestamp: '2024-08-01T00:00:00Z', title: 'The Harris reset unfolded across days', explanation: 'A Reuters/Ipsos poll showed Harris erasing Trump\'s earlier edge while the new ticket was still forming. This was diffuse information, not a clean single-hour event.', source: { label: 'Reuters/Ipsos polling report', url: 'https://www.investing.com/news/world-news/harris-trump-locked-in-tight-us-presidential-race-reutersipsos-poll-finds-3544376' } },
  { id: 'october-market-rally', timestamp: '2024-10-18T00:00:00Z', title: 'October\'s Trump rally was not one campaign event', explanation: 'Trump rose above 60% while several linked accounts placed unusually large bets. Polling and order flow both mattered, so the move is labeled market structure rather than assigned to one headline.', source: { label: 'Reuters report on concentrated pro-Trump bets', url: 'https://www.investing.com/news/stock-market-news/mystery-overseas-account-increases-its-trump-bids-on-polymarket-betting-site-3673736' } },
  { id: 'late-october-pullback', timestamp: '2024-10-24T04:00:00Z', title: 'Late-October prices were unusually volatile', explanation: 'The contract reversed several points during scrutiny of concentrated positions. No discrete campaign event is strong enough to claim this spike.', source: { label: 'Reuters report on Polymarket account activity', url: 'https://www.investing.com/news/stock-market-news/mystery-overseas-account-increases-its-trump-bids-on-polymarket-betting-site-3673736' } },
]

export async function loadElectionMarketSeries(): Promise<MarketSeriesPoint[]> {
  const response = await fetch('/data/polymarket-2024-hourly.csv')
  if (!response.ok) throw new Error(`Election market history could not load (${response.status}).`)
  return parseHourlyMarketCsv(await response.text())
}

const electionSources: Source[] = electionEvents.map((event) => ({
  id: `${event.id}-source`, title: event.source.label, publisher: event.source.publisher, url: event.source.url,
  publishedAt: event.source.publishedAt, retrievedAt: '2026-09-03T00:00:00Z', snapshotHash: `legacy-source-${event.id}`, correctionStatus: 'none',
}))

const directionMap = { 'Helps Trump': 'positive', 'Hurts Trump': 'negative', Ambiguous: 'ambiguous' } as const

const generalizedElectionEvents: StudyEvent[] = electionEvents.map((event) => {
  const contemporaneous = Date.parse(event.source.publishedAt) <= Date.parse(event.timestamp)
  return {
    id: event.id, title: event.title, shortTitle: event.shortTitle, occurredAt: event.timestamp, informationKnownAt: event.timestamp,
    precision: 'hour', timezone: 'UTC', dateLabel: event.dateLabel, category: event.category, mechanism: event.mechanism,
    expectedDirection: directionMap[event.expectedDirection],
    claims: [{ id: `${event.id}-summary`, text: event.summary, knownAt: contemporaneous ? event.timestamp : event.source.publishedAt, sourceIds: [`${event.id}-source`], visibility: contemporaneous ? 'pre-reveal' : 'retrospective' }],
    sourceRoles: [{ sourceId: `${event.id}-source`, role: contemporaneous ? 'primary' : 'retrospective' }],
    retrospectiveInterpretation: event.interpretation, competingExplanation: event.competingExplanation,
    attributionAssessment: event.confidence === 'High' ? 'likely dominant' : event.confidence === 'Medium' ? 'mixed' : 'weak',
    legacy: { confidence: event.confidence, attributionShare: event.attributionShare },
  }
})

export const electionStudy: Study = {
  id: 'election-2024-v1', slug: 'election-2024-v1', category: 'Politics', version: 1, status: 'published', legacyException: true,
  question: electionMarket.question,
  orientation: 'Order ten pivotal campaign moments by how you expected each one to change Donald Trump’s chance of winning—before seeing what the market did.',
  market: {
    id: 'polymarket-presidential-election-winner-2024-trump', provider: electionMarket.provider, title: electionMarket.contract,
    rules: 'Resolves YES if Donald Trump wins the 2024 U.S. presidential election.', openedAt: '2024-01-04T00:00:00Z', closedAt: '2024-11-05T23:00:00Z', settledAt: '2024-11-06T00:00:00Z', status: 'settled',
    resolutionSourceUrl: electionMarket.marketUrl, marketUrl: electionMarket.marketUrl, volume: electionMarket.volume,
  },
  contract: { id: electionMarket.tokenId, proposition: 'Donald Trump wins the 2024 U.S. presidential election', nativeSide: 'YES', selectedPerspective: 'YES', resolution: 'YES' },
  dataset: {
    id: 'polymarket-2024-hourly-v1', provider: electionMarket.provider, path: '/data/polymarket-2024-hourly.csv',
    rawPath: '/data/election-2024/raw-prices-history.json', marketMetadataPath: '/data/election-2024/raw-market.json', manifestPath: '/data/election-2024/manifest.json',
    rawSha256: '7ad5dd028509d5b58617d24cf3f594053f4b70cc76c5d681a1130d10afafff0d', marketMetadataSha256: '7c59b9a4930ed53711cdb971d7f0c15e3a403c4f18e711fa0381ac7b8b993636', normalizedSha256: 'd2cff3685d3201dc572000484a41fe0f4460d7b41e8a4b0acf654827e01ce320',
    retrievedAt: '2026-09-04T03:44:58.746Z', coverageStart: '2024-05-29T00:00:04Z', coverageEnd: '2024-11-05T23:00:02Z', fullMarketLifetime: false, cadenceMinutes: 60, transformVersion: 'legacy-csv-v1', provenanceUrl: electionMarket.datasetUrl,
    requestParameters: 'token_id=21742633143463906290569050155826241533067272736897614950488156847949938836455; fidelity=60; 10-day chunks; start=2024-05-29T00:00:00Z; end=2024-11-06T00:00:00Z',
  },
  measurementProfile: LEGACY_ELECTION_PROFILE,
  presentation: {
    topicLabel: '2024 U.S. presidential election', selectedContractShort: 'Trump wins', selectedContractLong: electionMarket.contract,
    seriesLabel: 'Trump win probability', positiveLabel: 'Helps Trump', negativeLabel: 'Hurts Trump', neutralLabel: 'Ambiguous', eventNoun: 'campaign moment', timezone: 'UTC', accent: '#0d6847',
    zoomChoices: [{ label: 'All', hours: null }, { label: '30d', hours: 720 }, { label: '14d', hours: 336 }, { label: '7d', hours: 168 }],
  },
  sources: electionSources, events: generalizedElectionEvents,
  contextMarkers: marketMoveNotes.map((note) => ({ id: note.id, timestamp: note.timestamp, title: note.title, explanation: note.explanation, sourceUrl: note.source.url })),
  publishedAt: '2026-09-03T00:00:00Z',
}
