import { MONTHS_PROFILE } from '../domain/eventStudy.ts'
import type { Source, Study, StudyEvent } from '../domain/study.ts'

const retrievedAt = '2026-09-05T17:20:08.206Z'
// Times identify when the underlying statement/broadcast was public, not when its archive was uploaded.
// The dated snapshots and timestamp rationale are retained in docs/evidence and docs/editorial.
const sources: Source[] = [
  { id: 'debate', title: 'CNN presidential debate — first hour', publisher: 'CNN', url: 'https://transcripts.cnn.com/show/se/date/2024-06-27/segment/06', publishedAt: '2024-06-28T02:00:00Z', retrievedAt: '2026-09-05T17:25:21.601Z', snapshotHash: 'e54bbb4ac25ed4ee434f7db87fe56088a96e3603432a3dd708891a1db7bb5b61' },
  { id: 'letter', title: 'Biden sends congressional Democrats a letter refusing to leave', publisher: 'CNN', url: 'https://transcripts.cnn.com/show/ctw/date/2024-07-08/segment/01', publishedAt: '2024-07-08T13:20:00Z', retrievedAt: '2026-09-05T17:25:21.604Z', snapshotHash: '059f51260069795a68b723ffb6f2a6fd85cdfee5941ace913753938ad3787d5f' },
  { id: 'biden-letter', title: 'Letter to the Democratic Party on accepting the nomination', publisher: 'Joe Biden / American Presidency Project', url: 'https://www.presidency.ucsb.edu/documents/letter-the-democratic-party-intention-accept-the-presidential-nomination', publishedAt: '2024-07-08T13:20:00Z', retrievedAt: '2026-09-05T17:25:21.605Z', snapshotHash: '6cdd9786e4b1894897d69fce2027be49fed7db8e6133e528f94dfac52b60c667' },
  { id: 'pelosi-clooney', title: 'Pelosi interview clips and Clooney’s call for a new nominee', publisher: 'CNN', url: 'https://transcripts.cnn.com/show/cnc/date/2024-07-10/segment/09', publishedAt: '2024-07-10T18:30:00Z', retrievedAt: '2026-09-05T17:25:21.607Z', snapshotHash: 'f7cc4734910aab89af45a20fc79d4d7b65065c499e9308f809cdc1322e4d1457' },
  { id: 'shooting', title: 'Butler rally footage and Secret Service statement', publisher: 'CNN', url: 'https://transcripts.cnn.com/show/cnr/date/2024-07-13/segment/08', publishedAt: '2024-07-14T00:00:00Z', retrievedAt: '2026-09-05T17:25:21.607Z', snapshotHash: '4108d635e69bc8b700d6402210932f9ffe5cea8175974140abff9f51ca852196' },
  { id: 'schiff', title: 'Schiff’s statement urging Biden to pass the torch', publisher: 'CNN', url: 'https://transcripts.cnn.com/show/cnc/date/2024-07-17/segment/10', publishedAt: '2024-07-17T19:00:00Z', retrievedAt: '2026-09-05T17:25:21.605Z', snapshotHash: '62006d7c17baa8dab38284bb3b0e8590580b79365c10050229e56ab5e4a2f695' },
  { id: 'pressure', title: 'CNN reports Biden is more receptive to concerns about his candidacy', publisher: 'CNN', url: 'https://transcripts.cnn.com/show/se/date/2024-07-17/segment/01', publishedAt: '2024-07-18T00:05:08Z', retrievedAt: '2026-09-05T17:25:21.828Z', snapshotHash: '66d2898b81c5df3e799009ca8a2f6c509532d799fd9d5facab8714d1a2e89fc8' },
  { id: 'withdrawal', title: 'Letter to the nation announcing decision not to seek reelection', publisher: 'Joe Biden / American Presidency Project', url: 'https://www.presidency.ucsb.edu/documents/letter-the-nation-announcing-decision-not-seek-reelection', publishedAt: '2024-07-21T17:46:00Z', retrievedAt: '2026-09-05T17:25:21.705Z', snapshotHash: 'bd1a557ae4356a2aba2a404a6b68d2e0abf410ab3b712b9a0600669cfd3df71f' },
]

type Definition = Omit<StudyEvent, 'timezone' | 'claims' | 'sourceRoles'> & { fact: string; sourceIds: string[] }
const event = ({ fact, sourceIds, ...definition }: Definition): StudyEvent => ({
  ...definition,
  timezone: 'America/New_York',
  claims: [{ id: `${definition.id}-fact`, text: fact, knownAt: definition.informationKnownAt, sourceIds, visibility: 'pre-reveal' }],
  sourceRoles: sourceIds.map((sourceId, index) => ({ sourceId, role: index === 0 ? 'primary' : 'corroborating' })),
})

const events: StudyEvent[] = [
  event({
    id: 'debate', title: 'Biden loses his train of thought in the presidential debate', shortTitle: 'Biden falters in the Trump debate',
    occurredAt: '2024-06-28T01:00:00Z', informationKnownAt: '2024-06-28T02:00:00Z', precision: 'interval', dateLabel: 'Jun 27', category: 'Debate',
    fact: 'Facing Donald Trump in their first televised debate of 2024, Biden pauses and struggles to finish an answer about spending and health care. Trump challenges his ability to lead.', sourceIds: ['debate'],
    expectedDirection: 'positive', mechanism: 'A difficult unscripted performance can intensify pressure to replace the nominee.',
    retrospectiveInterpretation: 'Withdrawal odds rose after the debate. The following day’s calls for Biden to leave also fall inside the measurement period, so the move represents the debate and its immediate fallout.',
    competingExplanation: 'Post-debate commentary, campaign responses and the next day’s New York Times editorial arrived before the stabilized window ended.', attributionAssessment: 'mixed',
  }),
  event({
    id: 'stay-in-race', title: 'Biden tells Democrats he won’t leave the presidential race', shortTitle: 'Biden vows to stay in the race',
    occurredAt: '2024-07-08T13:00:00Z', informationKnownAt: '2024-07-08T13:20:00Z', precision: 'interval', dateLabel: 'Jul 8', category: 'Campaign statement',
    fact: 'Responding to calls to step aside, Biden writes to congressional Democrats that he will keep running against Trump. He argues that Democratic primary voters chose him and the party should unite behind him.', sourceIds: ['biden-letter', 'letter'],
    expectedDirection: 'negative', mechanism: 'A direct refusal makes a voluntary withdrawal seem less imminent and challenges party officials to oppose their nominee openly.',
    retrospectiveInterpretation: 'The refusal was followed by a substantial fall in withdrawal odds. Biden’s television appearance and expressions of support were part of the same effort to hold the party together.',
    competingExplanation: 'His Morning Joe call and public support from Democratic leaders overlapped this window; the letter’s effect cannot be isolated.', attributionAssessment: 'mixed',
  }),
  event({
    id: 'pelosi-clooney', title: 'Pelosi leaves Biden’s candidacy in question; Clooney calls for a new nominee', shortTitle: 'Pelosi questions the decision; Clooney urges exit',
    occurredAt: '2024-07-10T11:40:00Z', informationKnownAt: '2024-07-10T18:30:00Z', precision: 'interval', dateLabel: 'Jul 10', category: 'Party and donor pressure',
    fact: 'Despite Biden’s pledge to stay, former House Speaker Nancy Pelosi says he still needs to decide whether to run. Actor and Democratic fundraiser George Clooney publicly urges the party to choose someone else.', sourceIds: ['pelosi-clooney'],
    expectedDirection: 'positive', mechanism: 'Public doubts from an influential party leader and a prominent fundraiser can reopen a decision the campaign says is settled.',
    retrospectiveInterpretation: 'The market repriced toward withdrawal after the combined intervention. This is one news episode: its movement cannot be split into separate Pelosi and Clooney scores.',
    competingExplanation: 'Senator Peter Welch called for withdrawal that evening. The NATO press conference and further Democratic reactions followed during the next-day window.', attributionAssessment: 'mixed',
  }),
  event({
    id: 'trump-shooting', title: 'Trump survives a shooting at his Pennsylvania campaign rally', shortTitle: 'Trump survives a rally shooting',
    occurredAt: '2024-07-13T22:11:00Z', informationKnownAt: '2024-07-14T00:00:00Z', precision: 'interval', dateLabel: 'Jul 13', category: 'Campaign shock',
    fact: 'Gunfire interrupts Trump’s rally in Butler, Pennsylvania. Secret Service agents evacuate him, and the agency says he is safe.', sourceIds: ['shooting'],
    expectedDirection: 'ambiguous', mechanism: 'The attack can interrupt pressure on Biden by changing the news agenda, while also changing Democrats’ assessment of the election.',
    retrospectiveInterpretation: 'Biden’s withdrawal odds fell in the measured window. The shift is consistent with a temporary pause in pressure as attention moved to Trump, but the prices alone do not establish why traders changed their views.',
    competingExplanation: 'Democratic discussions continued privately, and preparations for the Republican convention also shaped the news cycle.', attributionAssessment: 'mixed',
  }),
  event({
    id: 'renewed-pressure', title: 'Democratic congressman Adam Schiff calls on Biden to end his campaign', shortTitle: 'Schiff urges Biden to end his campaign',
    occurredAt: '2024-07-17T17:00:00Z', informationKnownAt: '2024-07-17T19:00:00Z', precision: 'interval', dateLabel: 'Jul 17', category: 'Party pressure',
    fact: 'Congressman Adam Schiff publicly urges Biden to leave the race, saying he doubts Biden can defeat Trump and believes another Democrat should take over.', sourceIds: ['schiff'],
    expectedDirection: 'positive', mechanism: 'A prominent Democrat renewing the public call for withdrawal can signal that the party’s pressure campaign is resuming.',
    retrospectiveInterpretation: 'This window contains the largest move. After Schiff’s statement, Biden’s COVID diagnosis and reporting about pressure from senior Democrats arrived; CNN also reported that Biden was becoming more receptive. The score belongs to this broader episode, not Schiff alone.',
    competingExplanation: 'The COVID announcement and reports concerning Pelosi, Schumer and Biden’s receptiveness are substantial overlapping developments.', attributionAssessment: 'mixed',
  }),
]

export const bidenDropoutStudy: Study = {
  id: 'biden-dropout-2024-v1', slug: 'biden-dropout-24-days', category: 'Politics', version: 1, status: 'published', publishedAt: '2026-09-05T17:30:00Z',
  question: 'What moved the odds that Biden would drop out?',
  orientation: 'June 27–July 21, 2024: the 24 days that ended Biden’s campaign. Rank five headlines by the change in his withdrawal odds, then explore the evidence.',
  market: { id: '252294', provider: 'Polymarket', title: 'Biden drops out of presidential race?', rules: 'Resolves YES if Joe Biden announces his withdrawal, is confirmed to have withdrawn, or is prevented from continuing the 2024 presidential race before 12:01 a.m. ET on November 5, 2024; otherwise NO. Official information from Biden or his representatives, or a consensus of credible reporting, determines resolution.', openedAt: '2023-09-21T16:18:35.358Z', closedAt: '2024-07-21T20:20:56Z', status: 'settled', resolutionSourceUrl: 'https://www.presidency.ucsb.edu/documents/letter-the-nation-announcing-decision-not-seek-reelection', marketUrl: 'https://polymarket.com/event/will-biden-drop-out-of-presidential-race', volume: 21_122_389.820576 },
  contract: { id: '80466862227762400456474037114326989569691448086113369690204721936360568404468', proposition: 'Joe Biden withdraws from the 2024 presidential race', nativeSide: 'YES', selectedPerspective: 'YES', resolution: 'YES' },
  dataset: { id: 'polymarket-biden-dropout-2024-hourly-v1', provider: 'Polymarket', path: '/data/biden-dropout-2024/polymarket-hourly.csv', rawPath: '/data/biden-dropout-2024/raw-prices-history.json', marketMetadataPath: '/data/biden-dropout-2024/raw-market.json', manifestPath: '/data/biden-dropout-2024/manifest.json', rawSha256: '6396d9b434a2be58274b87eca54ea58e17c3780418baafba708f24b6e0379742', marketMetadataSha256: 'cdda7d0ea5750729c77870539c75ccd2379102d308a3356be155c97e3bc5276e', normalizedSha256: 'd04cd03d112e168ba79881d9588edce07dbe6a77f5dc96539492571e179f6fdd', retrievedAt, coverageStart: '2024-06-23T00:00:00.000Z', coverageEnd: '2024-07-21T20:00:00.000Z', fullMarketLifetime: false, cadenceMinutes: 60, transformVersion: 'polymarket-hourly-v1', provenanceUrl: 'https://docs.polymarket.com/api-reference/markets/get-prices-history', requestParameters: 'token_id=80466862227762400456474037114326989569691448086113369690204721936360568404468; fidelity=60; start=2024-06-23T00:00:00Z; end=2024-07-22T00:00:00Z; 10-day chunks' },
  measurementProfile: MONTHS_PROFILE,
  presentation: { topicLabel: '24 days that ended Biden’s campaign', selectedContractShort: 'Biden drops out', selectedContractLong: 'Biden withdraws from the 2024 presidential race', seriesLabel: 'Biden withdrawal probability', positiveLabel: 'More likely to drop out', negativeLabel: 'More likely to stay in', positiveShortLabel: 'Drop out', negativeShortLabel: 'Stay in', neutralLabel: 'Ambiguous', eventNoun: 'campaign headline', timezone: 'America/New_York', accent: '#3d5bd8', zoomChoices: [{ label: 'All', hours: null }, { label: '14d', hours: 336 }, { label: '7d', hours: 168 }, { label: '3d', hours: 72 }] },
  sources, events,
  conclusion: { title: 'July 21: Biden withdraws', text: 'Twenty-four days after the debate, Biden announced that he would end his reelection campaign. The withdrawal market resolved YES. His final announcement is the ending of this story, rather than one of the five ranked headlines.', sourceId: 'withdrawal' },
  contextMarkers: [
    { id: 'receptive-report', timestamp: '2024-07-18T00:05:08Z', title: 'CNN reports Biden is more receptive', explanation: 'This report and Biden’s COVID diagnosis overlap the reaction after Schiff’s statement.', sourceUrl: 'https://transcripts.cnn.com/show/se/date/2024-07-17/segment/01' },
    { id: 'withdrawal-announcement', timestamp: '2024-07-21T17:46:00Z', title: 'Biden ends his campaign', explanation: 'Biden announces his withdrawal. The resolving announcement is excluded from the ranking.', sourceUrl: 'https://www.presidency.ucsb.edu/documents/letter-the-nation-announcing-decision-not-seek-reelection' },
  ],
}
