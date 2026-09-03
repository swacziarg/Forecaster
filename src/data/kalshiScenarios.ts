import { KALSHI_SOURCE_CATALOG, loadKalshiMarketSeries, type KalshiMarketConfig, type KalshiPricePoint } from './kalshi.ts'
import type { CheckpointBriefing, CheckpointId, FactorDefinition, FactorNarrative, FactorObservation, MarketPoint, ResolutionBriefing, Scenario } from '../domain/types.ts'

const DAY_MS = 24 * 60 * 60 * 1000
const checkpointIds: CheckpointId[] = ['60d', '45d', '30d', '15d']
const checkpointDays = [60, 45, 30, 15]
type FactorSignal = 'recent-move' | 'longer-trend' | 'direction-consistency' | 'range-position' | 'volume-attention'
type FactorEditorial = { id: string; label: string; shortLabel: string; description: string; observation: string; cue: string; narrative: FactorNarrative; signal: FactorSignal }

const resolutionBriefing: ResolutionBriefing = {
  summary: 'Seattle beat New England 29–13 in Super Bowl LX on February 8, 2026, completing the championship market’s YES condition.',
  consequence: 'The title validated Seattle’s defense-led season and gave the franchise its second Super Bowl. The result closed the forecasting question at a binary YES.',
  sources: [
    { label: 'Seahawks · Super Bowl LX champions', url: 'https://www.seahawks.com/news/2025-the-seahawks-are-super-bowl-lx-champions' },
    { label: 'Seahawks · Super Bowl LX game center', url: 'https://www.seahawks.com/super-bowl-lx/' },
  ],
}

const briefings: Record<CheckpointId, CheckpointBriefing> = {
  '60d': {
    status: 'Seattle was 10–3 after consecutive games without allowing a touchdown, firmly in the playoff race but still competing for the NFC West and the conference’s best postseason path.',
    developments: ['A 37–9 win in Atlanta featured three takeaways and pushed Seattle’s point differential to a league-best +161.', 'The defense looked repeatable, but the team still faced divisional and seeding uncertainty before any elimination game began.'],
    yesCase: 'An elite defense, strong point differential, and a 10–3 record provided a championship foundation that could travel through the playoffs.',
    noCase: 'Even an excellent contender had to win the division, secure a favorable seed, stay healthy, and survive several high-variance games against other top teams.',
    stakes: 'A title would require converting regular-season quality into a playoff path and then winning the franchise’s second championship.',
    sources: [{ label: 'Seahawks · Week 14 win, Dec. 7', url: 'https://www.seahawks.com/news/rapid-reactions-seahawks-dominate-in-second-half-on-their-way-to-big-win-over-falcons' }, { label: 'Seahawks · Week 14 numbers', url: 'https://www.seahawks.com/news/12-numbers-of-note-from-the-seahawks-week-14-win-in-atlanta' }],
  },
  '45d': {
    status: 'Seattle was 12–3 after a 38–37 overtime comeback against the Rams, had clinched a playoff berth, and moved into first place in both the NFC West and the conference.',
    developments: ['The Seahawks erased a 16-point fourth-quarter deficit against another 11–3 contender.', 'The win put a first-round bye and home-field advantage within reach, materially shortening the possible championship route.'],
    yesCase: 'Beating a direct rival while taking control of the No. 1 seed strengthened both the team-quality case and the probability of a shorter, home-heavy playoff path.',
    noCase: 'The one-point overtime margin also showed how little separated elite teams, and Seattle still had to finish the seeding race before facing elimination games.',
    stakes: 'The difference between the top seed and a lower seed was enormous: one fewer game, rest, and home field through the NFC playoffs.',
    sources: [{ label: 'Seahawks · Rams comeback, Dec. 18', url: 'https://www.seahawks.com/news/2025-week-16-rapid-reactions-seahawks-take-over-first-place-in-the-nfc-west-with-a-stunning-comeback-win-over-the-rams' }, { label: 'Seahawks · Playoff berth, Dec. 20', url: 'https://www.seahawks.com/news/seahawks-clinch-playoff-berth-but-eying-bigger-prize-we-ve-got-more-work-to-do' }],
  },
  '30d': {
    status: 'Seattle had finished 14–3, won the NFC West, and secured the conference’s No. 1 seed, a first-round bye, and home-field advantage.',
    developments: ['A 13–3 win over San Francisco completed the best regular season in franchise history.', 'The bye removed one elimination game, but Seattle still needed three postseason wins to become champion.'],
    yesCase: 'The league’s best point differential, top seed, and extra rest made Seattle’s route structurally stronger.',
    noCase: 'Every remaining opponent was strong enough to end the season in one game; seeding was helpful, not decisive.',
    stakes: 'Seattle had earned the optimal route, so the question became whether its identity would hold against playoff-level opponents.',
    sources: [{ label: 'Seahawks · Season standings', url: 'https://www.seahawks.com/team/standings/2025/reg' }],
  },
  '15d': {
    status: 'Seattle was one game from the Super Bowl after a 41–6 divisional-round rout of San Francisco and was preparing to host the 12–5 Rams.',
    developments: ['Seattle forced three turnovers and did not allow a touchdown in the divisional round.', 'The Rams had nearly beaten Seattle in December, making the home conference-title game a dangerous rematch.'],
    yesCase: 'A defense that could pressure and create short fields gave Seattle a credible path through the Rams and then one final neutral-site game.',
    noCase: 'Two wins were still required, beginning with a division rival that knew Seattle well; conference-title probability was not championship probability.',
    stakes: 'A win would send Seattle to its first Super Bowl in 11 years, after which the actual championship question would be decided.',
    sources: [{ label: 'Seahawks · NFC Championship preview', url: 'https://www.seahawks.com/news/what-to-watch-in-the-seahawks-nfc-championship-game-matchup-with-the-rams' }],
  },
}

const factors: FactorEditorial[] = [
  { id: 'quarterback-form', label: 'Quarterback health', shortLabel: 'Quarterback', description: 'Quarterback availability can dominate a title run.', observation: 'Scenario lens: consider whether the most important position is strengthening or weakening.', cue: 'If quarterback health and form were improving, that would make a Seattle title…', narrative: { context: 'Seattle’s title path depended on Sam Darnold staying available and efficient through multiple elimination games.', yesCase: 'Stable quarterback play lets the defense and run game turn close playoff margins into wins.', noCase: 'A setback, slump, or pressure-specific weakness could end the season in one game.', consequence: 'Quarterback continuity changes whether the roster can survive the full playoff sequence.' }, signal: 'recent-move' },
  { id: 'defensive-efficiency', label: 'Defensive efficiency', shortLabel: 'Defense', description: 'A defense that travels keeps playoff games close.', observation: 'Scenario lens: ask whether the team has a repeatable defensive edge.', cue: 'If defensive efficiency were improving, that would make a Seattle title…', narrative: { context: 'Seattle’s defense was the repeatable identity of the 2025 team: pressure, takeaways, and red-zone stops.', yesCase: 'A defense that travels can hold up when the offense or matchup changes.', noCase: 'Turnovers and stops are volatile; one missed assignment can erase a season’s edge.', consequence: 'Defensive reliability reduces the points Seattle must win in every elimination game.' }, signal: 'direction-consistency' },
  { id: 'playoff-path', label: 'Playoff path', shortLabel: 'Playoff path', description: 'Byes, home field, and opponents change the route.', observation: 'Scenario lens: focus on whether the likely postseason route is becoming easier or harder.', cue: 'If Seattle’s playoff path were improving, that would make a title…', narrative: { context: 'The same team can have very different title odds depending on byes, venues, and opponent order.', yesCase: 'The NFC’s top seed removes one game and keeps home field in the conference bracket.', noCase: 'A lower seed adds an elimination game and more travel against elite opponents.', consequence: 'Seeding changes the number and difficulty of wins required, not just the venue.' }, signal: 'longer-trend' },
  { id: 'roster-shock', label: 'Major roster shock', shortLabel: 'Roster shock', description: 'One injury or addition can swing a long-range forecast.', observation: 'Scenario hypothesis only: unusual market attention may flag a roster-changing development.', cue: 'If a roster shock hurt Seattle, that would make a title…', narrative: { context: 'This is explicitly a scenario hypothesis: the Kalshi volume signal is not an injury report and does not verify that a roster event occurred.', yesCase: 'A healthy core and timely depth could preserve Seattle through the playoff grind.', noCase: 'One absence at quarterback, pass rush, or the secondary could expose a thin matchup margin.', consequence: 'Roster shocks matter because playoff depth is tested immediately and cannot be replenished after elimination.' }, signal: 'volume-attention' },
  { id: 'matchup-adaptability', label: 'Matchup adaptability', shortLabel: 'Matchups', description: 'Champions need answers for several styles.', observation: 'Scenario lens: ask whether the roster’s strengths remain useful across likely matchups.', cue: 'If Seattle matched up well across the field, that would make a title…', narrative: { context: 'A championship is not one opponent: Seattle had to solve contrasting offenses, fronts, and game scripts.', yesCase: 'A defense that can pressure, stop the run, and force long downs travels across styles.', noCase: 'A scheme that dominates one opponent can be exposed by a different protection or coverage plan.', consequence: 'Adaptability turns regular-season dominance into a viable multi-round championship run.' }, signal: 'range-position' },
]

const formatDate = (value: string | undefined) => value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'Unknown date'
const formatDelta = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)} pts`
const clampSignal = (value: number) => Math.min(Math.max(Math.abs(value), 0), 1)
const numeric = (value: unknown) => { const parsed = typeof value === 'number' ? value : Number(value); return Number.isFinite(parsed) ? parsed : 0 }
const pointAtOrBefore = (points: KalshiPricePoint[], index: number, lookbackDays: number) => {
  const target = Date.parse(points[index].timestamp) - lookbackDays * DAY_MS
  let match = Math.max(0, index - 1)
  for (let cursor = index; cursor >= 0; cursor -= 1) if (Date.parse(points[cursor].timestamp) <= target) { match = cursor; break }
  return match
}

const checkpointIndexesFor = (points: KalshiPricePoint[], resolutionTimestamp: string) => {
  const resolutionMs = Date.parse(resolutionTimestamp)
  if (!Number.isFinite(resolutionMs)) throw new Error('Kalshi did not return a valid settlement timestamp.')
  const indexes = checkpointDays.map((days) => {
    const target = resolutionMs - days * DAY_MS
    const index = points.reduce((found, point, pointIndex) => Date.parse(point.timestamp) <= target ? pointIndex : found, -1)
    if (index < 0) throw new Error(`Kalshi returned less than ${days} days of pre-settlement history.`)
    return index
  })
  if (new Set(indexes).size !== checkpointDays.length) throw new Error('Kalshi history could not produce four distinct settlement checkpoints.')
  return indexes
}

type FactorMeasurement = { reading: string; context: string; signal: number }
const buildFactors = (points: KalshiPricePoint[], indexes: number[]) => {
  const recent = (index: number): FactorMeasurement => { const prior = pointAtOrBefore(points, index, 7); const delta = points[index].probability - points[prior].probability; return { reading: `Market moved ${formatDelta(delta)} over 7d`, context: 'This is market context only: the contract’s seven-day probability change, not independent evidence about the factor.', signal: clampSignal(delta / 15) } }
  const trend = (index: number): FactorMeasurement => { const prior = pointAtOrBefore(points, index, 30); const delta = points[index].probability - points[prior].probability; return { reading: `Market moved ${formatDelta(delta)} over 30d`, context: 'This is market context only: the contract’s thirty-day probability change, not independent evidence about the factor.', signal: clampSignal(delta / 25) } }
  const consistency = (index: number): FactorMeasurement => { const start = pointAtOrBefore(points, index, 14); const window = points.slice(start, index + 1); const changes = window.slice(1).map((point, offset) => point.probability - window[offset].probability); const upDays = changes.filter((change) => change > 0).length; const ratio = changes.length ? upDays / changes.length : 0.5; return { reading: `Market rose in ${upDays}/${changes.length || 1} sessions`, context: 'This is market context only: the share of Kalshi sessions closing higher, not independent evidence about the factor.', signal: clampSignal((ratio - 0.5) * 2) } }
  const range = (index: number): FactorMeasurement => { const start = pointAtOrBefore(points, index, 30); const window = points.slice(start, index + 1).map((point) => point.probability); const low = Math.min(...window); const high = Math.max(...window); const midpoint = (low + high) / 2; const signal = high === low ? 0 : (points[index].probability - midpoint) / ((high - low) / 2); return { reading: `Market at ${points[index].probability.toFixed(1)}% in ${low.toFixed(1)}–${high.toFixed(1)}%`, context: 'This is market context only: the contract’s trailing thirty-day range position, not independent evidence about the factor.', signal: clampSignal(signal) } }
  const activity = (index: number): FactorMeasurement => { const start = pointAtOrBefore(points, index, 7); const current = points.slice(start, index + 1).reduce((sum, point) => sum + point.volume, 0); const priorStart = pointAtOrBefore(points, start, 7); const prior = points.slice(priorStart, Math.max(priorStart + 1, start)).reduce((sum, point) => sum + point.volume, 0); const change = prior > 0 ? ((current - prior) / prior) * 100 : 0; return { reading: `Market traded ${Math.round(current).toLocaleString()} contracts (${change >= 0 ? '+' : ''}${change.toFixed(0)}%)`, context: 'This is market context only: Kalshi volume versus the prior seven-day window, not independent evidence about the factor.', signal: clampSignal(change / 100) } }
  const measurements: Record<FactorSignal, (index: number) => FactorMeasurement> = { 'recent-move': recent, 'longer-trend': trend, 'direction-consistency': consistency, 'range-position': range, 'volume-attention': activity }
  return factors.map((factor) => ({ id: factor.id, label: factor.label, shortLabel: factor.shortLabel, description: factor.description, observation: factor.observation, cue: factor.cue, narrative: factor.narrative, observations: Object.fromEntries(checkpointIds.map((id, index) => [id, measurements[factor.signal](indexes[index])])) as Record<CheckpointId, FactorObservation> })) as FactorDefinition[]
}

const buildMarketHistory = (points: KalshiPricePoint[], indexes: number[], outcome: boolean, resolutionTimestamp: string): MarketPoint[] => {
  const history: MarketPoint[] = indexes.map((index) => ({ label: points[index].label, probability: points[index].probability, timestamp: points[index].timestamp }))
  const latest = points[points.length - 1]
  if (latest.timestamp !== history[history.length - 1].timestamp) history.push({ label: 'Latest', probability: latest.probability, timestamp: latest.timestamp })
  history.push({ label: 'Resolution', probability: outcome ? 100 : 0, timestamp: resolutionTimestamp, resolution: true })
  return history
}

const buildScenario = async (config: KalshiMarketConfig): Promise<Scenario> => {
  const { market, points, fetchedAt } = await loadKalshiMarketSeries(config)
  if (points.length < 10) throw new Error(`${config.ticker} returned too little usable Kalshi history.`)
  const outcome = market.result?.toLowerCase() === 'yes' ? true : market.result?.toLowerCase() === 'no' ? false : null
  if (outcome === null) throw new Error(`${config.ticker} has no verified YES/NO Kalshi settlement result.`)
  const resolutionTimestamp = market.settlement_ts
  if (!resolutionTimestamp || Date.parse(resolutionTimestamp) >= Date.now()) throw new Error(`${config.ticker} does not have a past Kalshi settlement timestamp.`)
  if (!market.close_time || Date.parse(market.close_time) >= Date.now()) throw new Error(`${config.ticker} does not have a past Kalshi close time.`)
  const volume = numeric(market.volume_fp)
  if (volume < 500_000) throw new Error(`${config.ticker} has only ${volume.toLocaleString()} traded contracts; Seattle requires at least 500,000.`)
  const indexes = checkpointIndexesFor(points, resolutionTimestamp)
  return {
    id: config.id, title: 'Seattle championship replay', shortTitle: 'Seattle championship', question: 'Will the Seattle win the 2026 Pro Football Championship?', category: 'Sports', categoryTone: 'green',
    dek: 'A resolved championship market replayed through the four moments when the title path changed.', context: 'Use only the Kalshi contract history available at each checkpoint. Scenario lenses are arguments, not claims that an unverified event happened.', resolutionDate: formatDate(resolutionTimestamp), resolutionTimestamp, outcome, outcomeLabel: `Kalshi settled ${outcome ? 'YES' : 'NO'}.`, resolutionBriefing,
    checkpoints: checkpointIds.map((id, index) => ({ id, label: `${checkpointDays[index]} days before Kalshi settlement`, shortLabel: `${checkpointDays[index]}d`, date: formatDate(points[indexes[index]].timestamp), cutoffTimestamp: points[indexes[index]].timestamp, marketProbability: Math.round(points[indexes[index]].probability * 10) / 10, briefing: briefings[id] })),
    marketHistory: buildMarketHistory(points, indexes, outcome, resolutionTimestamp),
    factors: buildFactors(points, indexes), source: { provider: 'Kalshi', ticker: config.ticker, eventTicker: config.eventTicker, seriesTicker: config.seriesTicker, fetchedAt, sourceUrl: `https://external-api.kalshi.com/trade-api/v2/historical/markets/${encodeURIComponent(config.ticker)}`, volume, openInterest: numeric(market.open_interest_fp) }, live: true,
  }
}

export async function loadSeattleScenario(): Promise<Scenario> {
  if (KALSHI_SOURCE_CATALOG.length !== 1) throw new Error(`Seattle replay requires exactly one Kalshi market; catalog has ${KALSHI_SOURCE_CATALOG.length}.`)
  return buildScenario(KALSHI_SOURCE_CATALOG[0])
}
