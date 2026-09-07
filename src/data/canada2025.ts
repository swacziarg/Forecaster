import { MONTHS_PROFILE } from '../domain/eventStudy.ts'
import type { Source, Study, StudyEvent } from '../domain/study.ts'

const retrievedAt = '2026-09-06T16:14:05Z'
const source = (id: string, title: string, publisher: string, url: string, publishedAt: string, snapshotHash: string, publishedPrecision?: Source['publishedPrecision'], retrieved = retrievedAt): Source => ({
  id, title, publisher, url, publishedAt, publishedPrecision, retrievedAt: retrieved, snapshotHash, correctionStatus: 'none',
})

const sources: Source[] = [
  {"id": "canada-policy-background", "title": "Government of Canada releases 2024 Fall Economic Statement", "publisher": "Department of Finance Canada", "url": "https://www.canada.ca/en/department-finance/news/2024/12/government-of-canada-releases-2024-fall-economic-statement.html", "publishedAt": "2024-12-16", "publishedPrecision": "day", "retrievedAt": "2026-09-07T15:46:25Z", "snapshotHash": "9b643978d4880dcf25d8a3e427edd627d75c3adea366ecebfafb6b380a4cb7da", "correctionStatus": "none"},
  source('carney-launch-citynews', 'Mark Carney launches federal Liberal leadership bid in Edmonton', 'CityNews Edmonton', 'https://edmonton.citynews.ca/video/2025/01/16/mark-carney-launches-federal-liberal-leadership-bid-in-edmonton/', '2025-01-17T01:10:00Z', 'f80ce3fa8c2e89299a31f2fe88f9201e9074ffd2865b38916880d2ea008c3366', 'instant'),
  source('carney-launch-ap', "Former Bank of England governor Mark Carney enters race to be Canada's next prime minister", 'Associated Press', 'https://apnews.com/article/84b89e724e1673b23d60508de9b45ac4', '2025-01-16T22:43:36Z', '490a5704a38301d5530de8cfbc7a9220564f3a82bf45a86b833a3d4c6f3580f1', 'instant'),
  source('tariffs-pmo', 'Announcement in response to U.S. tariffs on Canada', 'Prime Minister of Canada', 'https://www.pm.gc.ca/en/videos/2025/02/01/announcement-response-us-tariffs-canada', '2025-02-01', '3dee818bf817e66fc4e73eaef0e9481dc61e4f265d43aab7046a79720b278eb8', 'day'),
  source('tariffs-ap', 'Trump puts tariffs on Canada, Mexico and China, spurring trade war', 'Associated Press', 'https://apnews.com/article/753a09d56cd318f2eb1d2efe3c43b7d4', '2025-02-01T14:14:28Z', '15f7747b8e80619c6e2584dcb78c381f1729ea5cdc2edade4d9f744284a30557', 'instant'),
  source('leadership-cpac', 'Mark Carney delivers victory speech', 'CPAC', 'https://www.youtube.com/watch?v=tJZ0Ib3f6jw', '2025-03-09', '5ff2aa8f0927b3b742ec2a124d4974daedd8f541a5d4a291f036f0373a54186c', 'day'),
  source('leadership-reuters', "Mark Carney wins race to replace Canada's Trudeau", 'Reuters', 'https://www.youtube.com/watch?v=E-6hzLw0_1g', '2025-03-09', '6c0232d582a2ab67fbab0accba2e1e1199eeebd36c9a2a9ad95591c9512a7d5d', 'day'),
  source('election-gg', 'Dissolution of Parliament', 'Governor General of Canada', 'https://www.gg.ca/en/node/15738', '2025-03-23', 'e460b923e92590c2db760a98288efe87b9ffa228e8cc58821e009d79491488d1', 'day'),
  source('election-ap', "Canada's prime minister and his opponent kick off election saying Trump must respect sovereignty", 'Associated Press', 'https://apnews.com/article/canada-election-prime-minister-mark-carney-trump-dd083f4f1cf9622742703eee5be6721a', '2025-03-23T12:56:48Z', 'ba3b4d5a4a35939ce00001d64c1afa65fb82eeae98029d6b9ac8a6c75a7bd119', 'instant', '2026-09-06T18:09:49Z'),
  source('auto-pmo', 'Canada announces new countermeasures in response to tariffs from the United States of America', 'Prime Minister of Canada', 'https://www.pm.gc.ca/en/news/news-releases/2025/04/03/canada-announces-new-countermeasures-response-tariffs-from-united-states', '2025-04-03', 'dbb3df02453a846bb2b11eb0a6f63ed8f54fe4d9268c445fb01b401da7bf80ba', 'day'),
  source('auto-ap', 'Canadian prime minister says Canada will match US auto tariffs', 'Associated Press', 'https://apnews.com/article/d15ae5b0bab873450b86ca524afda3ca', '2025-04-03T16:24:16Z', 'd97f8c57dad318cac76c6022467a4ea4c0f58e845fcdc5279e6c0a8bb55eb872', 'instant'),
  source('canada-market-resolution', 'Polymarket market metadata for the resolved Liberal Party contract', 'Polymarket Gamma API', 'https://gamma-api.polymarket.com/markets/517586', '2025-04-30T05:38:37Z', 'b7282159bec1cb934c8a3f6d331454ae276a6ef21283fa2d1cc360461210e03e', 'instant'),
]

const event = (definition: Omit<StudyEvent, 'claims' | 'sourceRoles' | 'timezone'> & { sourceIds: string[]; claimSourceIds?: string[]; fact: string }): StudyEvent => {
  const { sourceIds, claimSourceIds, fact, ...eventDefinition } = definition
  return {
    ...eventDefinition,
    timezone: 'America/Toronto',
    claims: [{ id: `${eventDefinition.id}-fact`, text: fact, knownAt: eventDefinition.informationKnownAt, sourceIds: claimSourceIds ?? sourceIds, visibility: 'pre-reveal' }],
    sourceRoles: sourceIds.map((sourceId) => ({ sourceId, role: sourceId === sourceIds[0] ? 'primary' as const : 'corroborating' as const })),
  }
}

const events: StudyEvent[] = [
  event({
    id: 'carney-leadership-launch', title: 'Mark Carney launches his Liberal leadership campaign', shortTitle: 'Carney enters race', occurredAt: '2025-01-16', informationKnownAt: '2025-01-17T01:10:00Z', precision: 'day', dateLabel: 'Jan 16', category: 'Candidate change', expectedDirection: 'positive', sourceIds: ['carney-launch-citynews', 'carney-launch-ap'],
    mechanism: 'A new nationally recognizable contender changes who can carry the governing Liberals into the election.',
    fact: 'Mark Carney launched his bid to replace Justin Trudeau as Liberal leader and prime minister. The former central banker emphasized his experience managing economic crises; the party leadership contest was separate from the coming general election against Pierre Poilievre’s Conservatives.',
    retrospectiveInterpretation: 'The launch was a candidate-change development, not a claim that it alone caused the market move.',
    competingExplanation: 'The market had already opened after Trudeau’s resignation, and tariff anxiety plus other leadership candidates were already in view.',
    attributionAssessment: 'mixed',
  }),
  event({
    id: 'tariff-retaliation', title: 'Canada announces a response to the U.S. tariff order', shortTitle: 'Tariff retaliation', occurredAt: '2025-02-01', informationKnownAt: '2025-02-02T05:00:00Z', precision: 'day', dateLabel: 'Feb 1', category: 'Campaign', expectedDirection: 'ambiguous', sourceIds: ['tariffs-pmo', 'tariffs-ap'],
    mechanism: 'The trade shock creates a crisis-response test that can make the Liberals look protective of Canadian interests or responsible for economic harm.',
    fact: 'Trudeau’s Liberal government announced 25% counter-tariffs on $155 billion of U.S. goods after Trump ordered tariffs on Canadian exports. Tariffs are taxes on imports: this was Canada’s retaliatory trade policy, with costs for businesses and consumers on both sides of the border.',
    retrospectiveInterpretation: 'The response was an ordinary-language trade and sovereignty test with an unavoidable economic confound.',
    competingExplanation: 'The U.S. order, Canadian federal messaging, provincial reactions and broader risk sentiment arrived together.',
    attributionAssessment: 'mixed',
  }),
  event({
    id: 'carney-leadership-win', title: 'Mark Carney wins the Liberal leadership', shortTitle: 'Carney wins leadership', occurredAt: '2025-03-09', informationKnownAt: '2025-03-10T04:00:00Z', precision: 'day', dateLabel: 'Mar 9', category: 'Candidate change', expectedDirection: 'positive', sourceIds: ['leadership-cpac', 'leadership-reuters'],
    mechanism: 'The party chooses the person who will lead the Liberals into the general election and removes succession uncertainty.',
    fact: 'Mark Carney won 85.9% of the Liberal leadership vote, defeating former finance minister Chrystia Freeland and the other contenders. The result chose Trudeau’s successor as party leader; Canadians had not yet voted in the general election.',
    retrospectiveInterpretation: 'The internal party result removed succession uncertainty; the later swearing-in is excluded from the five.',
    competingExplanation: 'Carney was already the front-runner, so the result may confirm information already priced in; the trade war and election timing also overlap.',
    attributionAssessment: 'mixed',
  }),
  event({
    id: 'election-call', title: 'The Governor General dissolves Parliament and calls the election', shortTitle: 'Election called', occurredAt: '2025-03-23', informationKnownAt: '2025-03-24T04:00:00Z', precision: 'day', dateLabel: 'Mar 23', category: 'Campaign', expectedDirection: 'ambiguous', sourceIds: ['election-gg', 'election-ap'],
    mechanism: 'The constitutional trigger turns an open-ended leadership story into a defined campaign with an April 28 endpoint.',
    fact: 'At Prime Minister Carney’s request, the Governor General dissolved Parliament for an April 28 election. Carney led the Liberals against Pierre Poilievre’s Conservatives; voters would elect local members of Parliament, and this contract concerned which party won the most seats.',
    retrospectiveInterpretation: 'The election call fixed the campaign timetable, alongside polling, tariff news and the leaders’ opening messages.',
    competingExplanation: 'The election call was expected; campaign positioning, polls, tariff news and leader impressions were moving at the same time.',
    attributionAssessment: 'mixed',
  }),
  event({
    id: 'auto-tariff-response', title: 'Carney announces Canada’s response to U.S. auto tariffs', shortTitle: 'Auto tariff response', occurredAt: '2025-04-03', informationKnownAt: '2025-04-03T16:24:16Z', precision: 'day', dateLabel: 'Apr 3', category: 'Campaign', expectedDirection: 'ambiguous', sourceIds: ['auto-pmo', 'auto-ap'], claimSourceIds: ['auto-ap'],
    mechanism: 'A concrete response to a sector-specific trade shock tests whether the new Liberal government can protect workers while limiting damage to an integrated economy.',
    fact: 'Carney announced that Canada would match the U.S. 25% auto tariff on vehicles.',
    retrospectiveInterpretation: 'This is a concrete campaign-period policy test, distinct in sector from the February trade shock but not causally isolated from it.',
    competingExplanation: 'The U.S. tariff itself, the election campaign, market-wide trade news and the government’s broader support measures are inseparable from the announcement.',
    attributionAssessment: 'mixed',
  }),
]

export const canada2025Study: Study = {
  id: 'canada-liberal-comeback-v2',
  slug: 'canada-liberal-comeback',
  category: 'Politics',
  version: 2,
  status: 'published', publishedAt: '2026-09-07T16:06:21Z',
  question: 'Will the Liberal Party win the most seats in the next Canadian election?',
  orientation: 'Rank five developments by the change in the exact YES-contract probability that the Liberal Party wins the most House of Commons seats. The resolved outcome and market record stay hidden until reveal.',
  market: {
    id: '517586', provider: 'Polymarket', title: 'Will the Liberal Party win the most seats in the next Canadian election?',
    rules: 'YES if the Liberal Party wins the most House of Commons seats in the next Canadian general election. This is not a majority or popular-vote contract; a tie uses the provider’s alphabetical rule, and an election not held by December 31, 2025 resolves NO.',
    openedAt: '2025-01-06T18:01:28.657Z', closedAt: '2025-04-30T05:38:37Z', settledAt: '2025-04-30T05:38:37Z', status: 'settled',
    resolutionSourceUrl: 'https://www.elections.ca/home.aspx', marketUrl: 'https://polymarket.com/event/which-party-wins-most-seats-in-canadian-election/will-the-liberal-party-win-the-most-seats-in-the-next-canadian-election',
  },
  contract: {
    id: '97369614101217511684993615789719226906296227283714425485701044468625942166745',
    proposition: 'The Liberal Party will win the most seats in the next Canadian election.', nativeSide: 'YES', selectedPerspective: 'YES', resolution: 'YES',
  },
  dataset: {
    id: 'polymarket-canada-liberal-comeback-v2-hourly', provider: 'Polymarket', path: '/data/canada-liberal-comeback-v2/polymarket-hourly.csv', rawPath: '/data/canada-liberal-comeback-v2/raw-prices-history.json', marketMetadataPath: '/data/canada-liberal-comeback-v2/raw-market.json', manifestPath: '/data/canada-liberal-comeback-v2/manifest.json', rawSha256: 'b21451d3a9456db98caf0043985f09f447345bc23e09fdeb6c663459b9f24f4d', marketMetadataSha256: 'b7282159bec1cb934c8a3f6d331454ae276a6ef21283fa2d1cc360461210e03e', normalizedSha256: 'af754817f1f07f5b6eb71a0658a40faeb9f665398a7b660eb579d05f024ae117', retrievedAt: '2026-09-06T16:14:05Z', coverageStart: '2025-01-06T19:00:00Z', coverageEnd: '2025-04-30T05:00:00Z', fullMarketLifetime: false, cadenceMinutes: 60, transformVersion: 'latest-source-per-UTC-hour-v1', provenanceUrl: 'https://gamma-api.polymarket.com/markets/517586', requestParameters: 'Exact YES token; twelve retained 60-minute history parts; latest source price per UTC hour; no filling, interpolation, carried prices, or cross-contract splicing.',
  },
  measurementProfile: MONTHS_PROFILE,
  presentation: {
    topicLabel: 'The Canadian comeback', selectedContractShort: 'The Liberal Party wins the most seats', selectedContractLong: 'Will the Liberal Party win the most seats in the next Canadian election?', seriesLabel: 'Liberal Party YES probability', positiveLabel: 'Probability rose', negativeLabel: 'Probability fell', neutralLabel: 'Little detectable movement', eventNoun: 'development', timezone: 'America/Toronto', accent: '#C95858', zoomChoices: [{ label: 'All', hours: null }, { label: '5 days', hours: 120 }, { label: '48 hours', hours: 48 }],
  },
  measurementNotes: ["The tariff retaliation, Carney campaign launch and Liberal leadership result form a three-event tie. Their differences are within one percentage point of the strongest response in that group. Those three pairs are excluded, leaving seven comparable pairs.", "Several sources give dates without precise publication times. Conservative cutoffs and contemporary AP reporting are used; changes can also reflect other campaign or trade news."],
  sources,
  events,
  background: {"title": "The parties and people to know", "claims": [{"id": "canada-policy", "text": "The governing Liberals under Justin Trudeau backed public spending on child care, dental coverage and housing, alongside a carbon tax on fuels. Pierre Poilievre led the opposition Conservatives, campaigning to scrap that tax.", "knownAt": "2025-01-17T01:10:00Z", "sourceIds": ["canada-policy-background", "carney-launch-ap"], "visibility": "pre-reveal"}, {"id": "canada-players", "text": "As this story begins in January 2025, Trudeau has announced he will step down. Mark Carney, a former governor of both Canada’s and Britain’s central banks, and Chrystia Freeland, Trudeau’s former finance minister, are leading contenders to replace him. Carney says any replacement for the carbon tax should still reduce emissions.", "knownAt": "2025-01-17T01:10:00Z", "sourceIds": ["carney-launch-ap"], "visibility": "pre-reveal"}]},
  contextMarkers: [],
  conclusion: {
    title: 'The Liberal Party wins the most seats',
    text: 'The Liberal Party won the most seats in the April 28, 2025 federal election. The provider records the YES contract as resolved and closed.',
    sourceId: 'canada-market-resolution',
  },
}
