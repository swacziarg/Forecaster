import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { auditSeries, calculateStudyImpacts, createTieGroups, MONTHS_PROFILE } from '../../../../src/domain/eventStudy.ts'

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
const points = readJson('docs/launch-queue-research/evidence/canada-normalized.json')
const freeze = readJson('docs/launch-work/funnel-expansion/canada/selection-freeze.json')
const sourceHash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex')

const common = {
  timezone: 'America/Toronto',
  occurredAt: null,
  claims: [],
  sourceRoles: [],
  retrospectiveInterpretation: '',
  attributionAssessment: 'indeterminate',
}

const events = [
  {
    ...common,
    id: 'carney-leadership-launch',
    title: 'Mark Carney launches his Liberal leadership campaign',
    shortTitle: 'Carney enters race',
    informationKnownAt: '2025-01-17T01:10:00Z',
    precision: 'minute',
    dateLabel: 'Jan 16',
    category: 'Candidate change',
    mechanism: 'A nationally recognizable new contender changes who can carry the governing Liberals into the election and offers a break from the outgoing prime minister.',
    expectedDirection: 'positive',
    competingExplanation: 'The market had already opened after Trudeau announced his resignation, and tariff anxiety and other leadership candidates were already in view.',
  },
  {
    ...common,
    id: 'tariff-retaliation',
    title: 'Canada announces a response to the U.S. tariff order',
    shortTitle: 'Tariff retaliation',
    informationKnownAt: '2025-02-02T05:00:00Z',
    precision: 'day',
    dateLabel: 'Feb 1',
    category: 'Campaign',
    mechanism: 'The trade shock gives the Liberal government a crisis-response test: it can make the party look like a defender of Canadian interests, while the economic harm can also damage the incumbent.',
    expectedDirection: 'ambiguous',
    competingExplanation: 'The U.S. order, Trudeau’s response, provincial reactions and general risk sentiment arrived together; no single announcement owns the market reaction.',
  },
  {
    ...common,
    id: 'carney-leadership-win',
    title: 'Mark Carney wins the Liberal leadership',
    shortTitle: 'Carney wins leadership',
    informationKnownAt: '2025-03-10T04:00:00Z',
    precision: 'day',
    dateLabel: 'Mar 9',
    category: 'Candidate change',
    mechanism: 'The party’s first-ballot choice makes Carney the person who will lead the Liberals into the general election and removes internal succession uncertainty.',
    expectedDirection: 'positive',
    competingExplanation: 'Carney was the front-runner before the vote, so the result may confirm information already priced in; the trade war and the coming election also overlap.',
  },
  {
    ...common,
    id: 'election-call',
    title: 'The Governor General dissolves Parliament and calls the election',
    shortTitle: 'Election called',
    informationKnownAt: '2025-03-24T04:00:00Z',
    precision: 'day',
    dateLabel: 'Mar 23',
    category: 'Campaign',
    mechanism: 'The formal election call changes an open-ended leadership story into a defined campaign with a known April 28 endpoint and forces voters to compare the new leader with the Conservatives.',
    expectedDirection: 'ambiguous',
    competingExplanation: 'The call was expected and campaign positioning, polls, tariff news and leader impressions were moving at the same time.',
  },
  {
    ...common,
    id: 'auto-tariff-response',
    title: 'Carney announces Canada’s response to U.S. auto tariffs',
    shortTitle: 'Auto tariff response',
    informationKnownAt: '2025-04-03T16:24:16Z',
    precision: 'minute',
    dateLabel: 'Apr 3',
    category: 'Campaign',
    mechanism: 'A concrete response to a sector-specific trade shock tests whether the new Liberal government can protect workers while limiting damage to an integrated economy.',
    expectedDirection: 'ambiguous',
    competingExplanation: 'The U.S. tariff itself, the election campaign, market-wide trade news and the government’s broader support measures are inseparable from the announcement.',
  },
]

const normalized = points.map((point) => ({ ...point }))
const audit = auditSeries(normalized, MONTHS_PROFILE.cadenceMinutes)
const impacts = calculateStudyImpacts(normalized, events, MONTHS_PROFILE)
const tieGroups = createTieGroups(impacts, MONTHS_PROFILE.tieThreshold)
const byResponse = [...impacts].sort((left, right) => (right.shortTermResponse ?? -Infinity) - (left.shortTermResponse ?? -Infinity))
const selectedEventIds = freeze.selectedEvents.map((event) => event.id)
if (JSON.stringify(selectedEventIds) !== JSON.stringify(events.map((event) => event.id))) throw new Error('Selection freeze and measurement events differ.')
if (audit.observations !== 2723 || audit.missingBuckets.length !== 0) throw new Error('Canada normalized audit changed unexpectedly.')
if (impacts.some((impact) => impact.qualityStatus !== 'usable')) throw new Error('At least one frozen Canada event has an unusable window.')

const output = {
  artifactType: 'Canada event-window measurement handoff; generated by existing application functions',
  generatedAt: null,
  reproducibilityNote: 'Wall-clock generation time is intentionally omitted so identical inputs and application functions produce identical measurements.json bytes.',
  invocation: 'node --experimental-strip-types docs/launch-work/funnel-expansion/canada/evaluate-canada.mjs',
  contract: {
    provider: 'Polymarket',
    marketId: '517586',
    yesToken: '97369614101217511684993615789719226906296227283714425485701044468625942166745',
    selectedPerspective: 'YES',
  },
  freeze: {
    path: 'docs/launch-work/funnel-expansion/canada/selection-freeze.json',
    sha256: sourceHash('docs/launch-work/funnel-expansion/canada/selection-freeze.json'),
    frozenAt: freeze.frozenAt,
  },
  dataset: {
    sourceNormalizedPath: 'docs/launch-queue-research/evidence/canada-normalized.json',
    sourceNormalizedSha256: sourceHash('docs/launch-queue-research/evidence/canada-normalized.json'),
    outputCsvPath: 'docs/launch-work/funnel-expansion/canada/canada-hourly.csv',
    outputCsvSha256: sourceHash('docs/launch-work/funnel-expansion/canada/canada-hourly.csv'),
    audit,
    markPolicy: 'Project Polymarket convention: latest source price per UTC hour, treated as trade; no filling, interpolation, carried prices, or cross-contract splicing.',
  },
  measurementProfile: MONTHS_PROFILE,
  scoring: {
    version: 'pairwise-anchor-1pt-v1',
    tieThreshold: MONTHS_PROFILE.tieThreshold,
    primaryResponse: 'stabilized median minus reference median',
    rankedEventIds: byResponse.map((impact) => impact.eventId),
    tieGroups,
  },
  impacts,
}

writeFileSync('docs/launch-work/funnel-expansion/canada/measurements.json', `${JSON.stringify(output, null, 2)}\n`)
console.log(JSON.stringify({
  observations: audit.observations,
  missingBuckets: audit.missingBuckets.length,
  rankedEventIds: output.scoring.rankedEventIds,
  tieGroups,
  responses: impacts.map((impact) => ({ eventId: impact.eventId, shortTermResponse: impact.shortTermResponse, delayed: impact.cumulativeDelayedResponse, qualityStatus: impact.qualityStatus, ordinary: impact.ordinaryMovement.classification, overlaps: impact.overlaps })),
}, null, 2))
