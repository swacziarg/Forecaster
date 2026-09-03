import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowRight, ArrowUp, Check, ChevronDown, ExternalLink, Info, LockKeyhole, Minus, RotateCcw, X } from 'lucide-react'
import { calculateForecast, modelFromScenario, rebalanceImportance, scoreForecastPath, setDirection, totalImportance } from './domain/engine.ts'
import type { CheckpointId, Direction, FactorDefinition, ForecastDecision, ForecastResult, ForecastRun, HumanMentalModel, Scenario } from './domain/types.ts'
import { loadSeattleScenario } from './data/kalshiScenarios.ts'

type View = 'play' | 'results'

const directionLabels: Record<Direction, string> = { more_likely: 'YES', neutral: 'Neutral', less_likely: 'NO' }
const factorAvailability: Record<string, 'known' | 'unresolved'> = {
  'quarterback-form': 'known',
  'defensive-efficiency': 'known',
  'playoff-path': 'known',
  'roster-shock': 'unresolved',
  'matchup-adaptability': 'unresolved',
}
const formatProbability = (value: number) => `${Math.round(value * 100)}%`
const formatDelta = (value: number) => `${value >= 0 ? '+' : ''}${Math.round(value * 100)} pts`
const formatScore = (value: number) => value.toFixed(2)
const formatContracts = (value: number) => `${Math.round(value).toLocaleString()} contracts`

type SourceSelection = { label: string; url: string; date: string; claim: string }
type SnapshotFact = { label: string; value: string; detail: string }

const snapshotFacts: Record<CheckpointId, SnapshotFact[]> = {
  '60d': [
    { label: 'Record', value: '10–3', detail: 'Through Week 14' },
    { label: 'Division', value: 'NFC West race', detail: 'Contending for first' },
    { label: 'Playoff position', value: 'Firmly in', detail: 'Postseason berth in reach' },
    { label: 'Recent form', value: '3 straight wins', detail: 'Momentum entering Week 15' },
    { label: 'Team strength', value: '+161', detail: 'League-best point differential' },
    { label: 'Defense', value: '2 games', detail: 'No touchdowns allowed' },
  ],
  '45d': [
    { label: 'Record', value: '12–3', detail: 'Three games remaining' },
    { label: 'Division', value: '1st in NFC West', detail: 'After beating the Rams' },
    { label: 'Conference', value: 'No. 1 seed', detail: 'Bye and home field in reach' },
    { label: 'Playoff position', value: 'Berth clinched', detail: 'Postseason guaranteed' },
    { label: 'Recent result', value: '38–37 OT', detail: 'Comeback win vs. Rams' },
  ],
  '30d': [
    { label: 'Record', value: '14–3', detail: 'Best season in team history' },
    { label: 'Division', value: 'NFC West champs', detail: 'Division secured' },
    { label: 'Conference', value: 'No. 1 seed', detail: 'Home field secured' },
    { label: 'Playoff path', value: 'First-round bye', detail: 'Three wins required' },
    { label: 'Team strength', value: 'League best', detail: 'Point differential' },
  ],
  '15d': [
    { label: 'Playoff stage', value: 'NFC title game', detail: 'One win from Super Bowl' },
    { label: 'Last result', value: '41–6', detail: 'Divisional win vs. 49ers' },
    { label: 'Next opponent', value: '12–5 Rams', detail: 'Division rival at home' },
    { label: 'Recent defense', value: '0 touchdowns', detail: 'Allowed in divisional round' },
    { label: 'Wins needed', value: '2', detail: 'To settle the market YES' },
  ],
}

const factorKnownThen: Record<string, Record<CheckpointId, string>> = {
  'quarterback-form': { '60d': 'Starter healthy and available through Week 14.', '45d': 'Quarterback led a 16-point fourth-quarter comeback.', '30d': 'Continuity held through a 14–3 regular season.', '15d': 'Starter remained available entering the NFC title game.' },
  'defensive-efficiency': { '60d': 'Two consecutive games without allowing a touchdown.', '45d': 'Defense supported a 12–3 record and top conference position.', '30d': 'Seattle finished with the league’s best point differential.', '15d': 'Three takeaways and no touchdowns allowed in a 41–6 win.' },
  'playoff-path': { '60d': 'Division and conference seeding were still unresolved.', '45d': 'Seattle held the No. 1 seed with a bye within reach.', '30d': 'The No. 1 seed, a bye, and home field were secured.', '15d': 'Seattle needed two wins, beginning with the Rams at home.' },
  'roster-shock': { '60d': 'No verified roster-changing event is represented by market volume.', '45d': 'No verified roster-changing event is represented by market volume.', '30d': 'No verified roster-changing event is represented by market volume.', '15d': 'No verified roster-changing event is represented by market volume.' },
  'matchup-adaptability': { '60d': 'Seattle had shown strength across several regular-season game scripts.', '45d': 'A one-point overtime win showed both resilience and thin margins.', '30d': 'The bracket was not yet set despite the secured top seed.', '15d': 'The Rams had nearly beaten Seattle in the December meeting.' },
}

const startingModelFromScenario = (scenario: Scenario): HumanMentalModel => {
  const factorIds = scenario.factors.map((factor) => factor.id)
  const base = Math.floor(100 / Math.max(factorIds.length, 1))
  const remainder = 100 - base * factorIds.length
  const beliefs = Object.fromEntries(factorIds.map((factorId, index) => [factorId, {
    factorId,
    importance: base + (index < remainder ? 1 : 0),
    direction: 'neutral' as Direction,
  }]))
  return { beliefs, totalImportance: totalImportance({ beliefs, totalImportance: 0 }) }
}

const modelMatchScore = (scenario: Scenario, model: HumanMentalModel) => {
  const referenceModel = modelFromScenario(scenario)
  const totalDifference = scenario.factors.reduce((sum, factor) => sum + Math.abs((model.beliefs[factor.id]?.importance ?? 0) - (referenceModel.beliefs[factor.id]?.importance ?? 0)), 0)
  return Math.max(0, Math.round(100 - totalDifference / 2))
}

function AppFrame({ children }: { children: ReactNode }) {
  return <div className="app-shell"><header className="topbar"><span className="brand"><span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span><span>forecast<span className="brand-dot">.</span></span></span><span className="topbar-note">Historical replay</span></header><main>{children}</main><footer className="site-footer"><span>Kalshi provides the historical market context. Source links open the underlying record.</span></footer></div>
}

function LoadingView() { return <div className="page state-page"><div className="state-card"><span className="state-kicker"><i /> Historical replay</span><h1>Loading Seattle’s resolved market.</h1><p>Checking the settled result and the market’s price history.</p><div className="state-loader" /></div></div> }
function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) { return <div className="page state-page"><div className="state-card state-card-error"><span className="eyebrow eyebrow-accent"><Info size={15} /> Kalshi connection issue</span><h1>Seattle’s market could not load.</h1><p>{message}</p><button className="primary-button" onClick={onRetry}><RotateCcw size={16} /> Try again</button><small>Nothing is substituted when live data is unavailable.</small></div></div> }

function CheckpointNav({ scenario, activeIndex, decisions, onSelect }: { scenario: Scenario; activeIndex: number; decisions: ForecastDecision[]; onSelect: (index: number) => void }) {
  const active = scenario.checkpoints[activeIndex]
  return <section className="checkpoint-panel" aria-label="Historical forecast checkpoints"><div className="checkpoint-primary"><span className="replay-badge">Historical replay</span><strong>{active.date} — {active.label}</strong><small>You are forecasting with information available through {active.date}.</small></div><ol className="checkpoint-track">{scenario.checkpoints.map((checkpoint, index) => { const locked = decisions.some((decision) => decision.checkpointId === checkpoint.id); const available = index <= decisions.length; return <li key={checkpoint.id}><button className={`checkpoint ${activeIndex === index ? 'is-active' : ''} ${locked ? 'is-locked' : ''}`} disabled={!available} onClick={() => onSelect(index)} aria-current={activeIndex === index ? 'step' : undefined} title={checkpoint.briefing.status}><span className="checkpoint-dot">{locked ? <Check size={13} /> : index + 1}</span><span><strong>{checkpoint.shortLabel}</strong><small>{Math.round(checkpoint.marketProbability)}%</small></span></button></li> })}</ol></section>
}

function SourceButton({ source, checkpoint, claim, onOpen }: { source: { label: string; url: string }; checkpoint: Scenario['checkpoints'][number]; claim: string; onOpen: (source: SourceSelection) => void }) {
  return <button className="source-button" onClick={() => onOpen({ ...source, date: checkpoint.date, claim })}>{source.label}<ArrowRight size={13} /></button>
}

function WorldBriefing({ checkpoint, onSource }: { checkpoint: Scenario['checkpoints'][number]; onSource: (source: SourceSelection) => void }) {
  const { briefing } = checkpoint
  const [expanded, setExpanded] = useState(false)
  return <section className={`world-briefing ${expanded ? 'is-expanded' : ''}`} aria-labelledby={`world-briefing-${checkpoint.id}`}><div className="briefing-heading"><div><span className="evidence-label">Sourced historical evidence</span><h2 id={`world-briefing-${checkpoint.id}`}>What was known on {checkpoint.date}</h2></div><button className="context-toggle" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>{expanded ? 'Close full context' : 'See full context'}<ChevronDown size={16} /></button></div><p className="briefing-status">{briefing.status}</p><div className="fact-grid">{snapshotFacts[checkpoint.id].map((fact) => <article className="fact-tile" key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong><small>{fact.detail}</small></article>)}</div>{expanded && <div className="full-context"><div className="context-column"><span className="context-title">Standings & playoff path</span><p>{briefing.status}</p><p>{briefing.stakes}</p></div><div className="context-column"><span className="context-title">Schedule & recent performance</span><ul>{briefing.developments.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="context-column"><span className="context-title">Availability & rankings</span><p>No later injury or availability information is included. Rankings and team-strength claims are limited to the record dated below.</p><span className="as-known">As known on {checkpoint.date}</span></div><div className="context-sources"><span className="context-title">Historical sources</span>{briefing.sources.map((source) => <SourceButton key={source.url} source={source} checkpoint={checkpoint} claim={briefing.status} onOpen={onSource} />)}</div></div>}</section>
}

function AllocationSummary({ scenario, model }: { scenario: Scenario; model: HumanMentalModel }) {
  const total = Math.round(totalImportance(model))
  return <div className="allocation-summary"><div className="allocation-heading"><span className="eyebrow">Your 100 points</span><strong>{total}<small> / 100</small></strong></div><div className="allocation-bar" aria-label="Point allocation by factor">{scenario.factors.map((factor) => <span key={factor.id} style={{ width: `${model.beliefs[factor.id]?.importance ?? 0}%` }} title={`${factor.label}: ${model.beliefs[factor.id]?.importance ?? 0} points`} />)}</div><div className="allocation-legend">{scenario.factors.map((factor) => <span key={factor.id}><b>{model.beliefs[factor.id]?.importance ?? 0}</b> {factor.shortLabel}</span>)}</div></div>
}

function FactorEditor({ factor, observation, importance, direction, disabled, onImportanceChange, onDirectionChange }: { factor: FactorDefinition; observation: FactorDefinition['observations'][CheckpointId]; importance: number; direction: Direction; disabled: boolean; onImportanceChange: (value: number) => void; onDirectionChange: (direction: Direction) => void }) {
  const inputId = `importance-${factor.id}`
  const directionIcon = (option: Direction) => option === 'more_likely' ? <ArrowUp size={14} /> : option === 'less_likely' ? <ArrowDown size={14} /> : <Minus size={14} />
  const availability = factorAvailability[factor.id] ?? 'unresolved'
  const marketReading = observation.reading.replace('Kalshi proxy:', 'Market view:')
  return <article className={`factor-card ${disabled ? 'is-disabled' : ''}`}><div className="factor-card-heading"><div><span className={`factor-kind factor-kind-${availability}`}>{availability === 'known' ? 'Known then' : 'Unresolved then'}</span><h3>{factor.label}</h3></div><label className="points-input" htmlFor={inputId}><span>points</span><input id={inputId} type="number" min="0" max="100" step="1" value={importance} disabled={disabled} onChange={(event) => onImportanceChange(Number(event.target.value))} aria-label={`${factor.label} importance points`} /></label></div><p className="factor-description">{factor.description}</p><p className="factor-observation"><span>Market context</span>{marketReading}</p><input className="importance-range" type="range" min="0" max="100" step="1" value={importance} disabled={disabled} onChange={(event) => onImportanceChange(Number(event.target.value))} aria-label={`${factor.label} relative importance`} /><div className="direction-control"><span className="control-label">Effect on YES</span><div className="direction-buttons" role="group" aria-label={`${factor.label} effect on YES`}>{(['more_likely', 'neutral', 'less_likely'] as Direction[]).map((option) => <button key={option} className={`direction-button ${direction === option ? `selected-${option}` : ''}`} disabled={disabled} onClick={() => onDirectionChange(option)} aria-pressed={direction === option}>{directionIcon(option)}<span>{directionLabels[option]}</span></button>)}</div></div><p className="factor-why"><strong>Why it matters</strong>{factor.narrative.consequence}</p><details className="factor-details"><summary>Arguments & prompt</summary><p className="factor-context">{factor.narrative.context}</p><div className="factor-argument-grid"><p><strong>YES argument</strong>{factor.narrative.yesCase}</p><p><strong>NO argument</strong>{factor.narrative.noCase}</p></div><p className="factor-cue"><strong>Your prompt</strong>{factor.cue}</p></details></article>
}

function ForecastPanel({ scenario, checkpointId, forecast, locked, complete, onLock, onReveal }: { scenario: Scenario; checkpointId: CheckpointId; forecast: ForecastResult; locked: boolean; complete: boolean; onLock: () => void; onReveal: () => void }) {
  const checkpointLabel = scenario.checkpoints.find((item) => item.id === checkpointId)?.shortLabel
  return <aside className="forecast-panel" aria-label="Your forecast"><div className="forecast-heading"><div><span className="eyebrow">Your forecast</span><h2>{locked ? 'Locked' : 'Make your call'}</h2></div><LockKeyhole size={20} /></div><p className="forecast-context">Market baseline at this checkpoint: <strong>{formatProbability(forecast.marketProbability)} YES.</strong></p><div className="forecast-big"><strong>{formatProbability(forecast.userProbability)}</strong><span>Your probability</span></div><div className="forecast-comparison"><div><span>You</span><strong>{formatProbability(forecast.userProbability)}</strong></div><div><span>Market</span><strong>{formatProbability(forecast.marketProbability)}</strong></div><div><span>Difference</span><strong className={forecast.probabilityDelta >= 0 ? 'positive-text' : 'negative-text'}>{formatDelta(forecast.probabilityDelta)}</strong></div></div><div className="probability-meter"><div className="meter-track"><span className="meter-fill" style={{ width: `${forecast.userProbability * 100}%` }} /><span className="meter-market" style={{ left: `${forecast.marketProbability * 100}%` }} /><span className="meter-you" style={{ left: `${forecast.userProbability * 100}%` }} /></div><div className="meter-scale"><span>0%</span><span>50%</span><span>100%</span></div></div><div className="impact-section"><span className="eyebrow">How your weights move it</span>{forecast.contributions.map((item) => <div className="impact-row" key={item.factorId}><span>{item.label}</span><strong className={item.probabilityDelta >= 0 ? 'positive-text' : 'negative-text'}>{formatDelta(item.probabilityDelta)}</strong></div>)}</div><div className="forecast-action-area">{!locked && !complete && <button className="lock-button" onClick={onLock}><LockKeyhole size={18} /> Lock {checkpointLabel} forecast</button>}{locked && !complete && <div className="locked-message"><Check size={17} /><span><strong>{checkpointLabel} is locked.</strong><small>Next: open the following checkpoint.</small></span></div>}{locked && complete && <><div className="locked-message"><Check size={17} /><span><strong>All four forecasts are locked.</strong><small>The settled result is ready.</small></span></div><button className="lock-button" onClick={onReveal}>Reveal result <ArrowRight size={17} /></button></>}</div></aside>
}

function TrajectoryChart({ scenario, decisions }: { scenario: Scenario; decisions: ForecastDecision[] }) {
  const width = 760; const height = 270; const left = 42; const right = 20; const top = 18; const bottom = 38; const plotWidth = width - left - right; const plotHeight = height - top - bottom
  const xFor = (index: number) => left + index / Math.max(scenario.marketHistory.length - 1, 1) * plotWidth
  const yFor = (probability: number) => top + (100 - probability) / 100 * plotHeight
  const marketPoints = scenario.marketHistory.map((point, index) => `${xFor(index)},${yFor(point.probability)}`).join(' ')
  const userPoints = decisions.map((decision, index) => `${xFor(index)},${yFor(decision.userProbability * 100)}`).join(' ')
  const checkpointPoints = scenario.marketHistory.slice(0, scenario.checkpoints.length).map((point, index) => ({ x: xFor(index), y: yFor(point.probability), label: scenario.checkpoints[index]?.shortLabel ?? point.label }))
  const userCheckpointPoints = decisions.map((decision, index) => ({ x: xFor(index), y: yFor(decision.userProbability * 100), label: decision.checkpointId }))
  const resolutionIndex = scenario.marketHistory.findIndex((point) => point.resolution)
  const resolutionPoint = resolutionIndex >= 0 ? { x: xFor(resolutionIndex), y: yFor(scenario.marketHistory[resolutionIndex].probability) } : null
  const xLabels = scenario.marketHistory.map((point, index) => ({ point, index })).filter(({ index, point }) => index < scenario.checkpoints.length || index === scenario.marketHistory.length - 1 || point.resolution)
  return <div className="trajectory-wrap"><div className="chart-legend"><span><i className="chart-line market-line" /> Market</span><span><i className="chart-line user-line" /> You</span>{resolutionPoint && <span className="chart-resolution">● Result</span>}</div><svg className="trajectory-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Your forecast compared with the market probability across four checkpoints"><g className="chart-grid">{[0, 25, 50, 75, 100].map((value) => <g key={value}><line x1={left} x2={width - right} y1={yFor(value)} y2={yFor(value)} /><text x="0" y={yFor(value) + 4}>{value}%</text></g>)}</g>{resolutionPoint && <line className="resolution-line" x1={resolutionPoint.x} x2={resolutionPoint.x} y1={top} y2={height - bottom} />}<polyline className="market-polyline" points={marketPoints} /><polyline className="user-polyline" points={userPoints} />{checkpointPoints.map((point) => <circle key={`m-${point.label}`} className="market-point" cx={point.x} cy={point.y} r="4" />)}{userCheckpointPoints.map((point) => <circle key={`u-${point.label}`} className="user-point" cx={point.x} cy={point.y} r="4.5" />)}{resolutionPoint && <g><circle className={`resolution-point ${scenario.outcome ? 'outcome-yes' : 'outcome-no'}`} cx={resolutionPoint.x} cy={resolutionPoint.y} r="7" /><text className="resolution-label" x={resolutionPoint.x - 31} y={Math.max(top + 14, resolutionPoint.y - 14)}>{scenario.outcome ? 'YES' : 'NO'}</text></g>}{xLabels.map(({ point, index }) => <text className="chart-x-label" key={`${point.label}-${index}`} x={xFor(index)} y={height - 9} textAnchor="middle">{index < scenario.checkpoints.length ? scenario.checkpoints[index]?.shortLabel : point.resolution ? 'Result' : 'Latest'}</text>)}</svg></div>
}

function ResultsView({ scenario, run, onReplay }: { scenario: Scenario; run: ForecastRun; onReplay: () => void }) {
  const settled = scenario.outcome !== null
  const forecastReport = settled ? scoreForecastPath(run.decisions, scenario.outcome as boolean) : null
  const lastModel = run.decisions[run.decisions.length - 1].model
  const firstDecision = run.decisions[0]; const finalDecision = run.decisions[run.decisions.length - 1]; const marketMove = finalDecision.marketProbability - firstDecision.marketProbability; const modelMatch = modelMatchScore(scenario, lastModel)
  return <div className="page results-page"><section className="result-header"><div><span className="eyebrow eyebrow-accent">The answer</span><h1>{settled ? scenario.outcome ? 'YES' : 'NO' : 'OPEN'}</h1><p>{settled ? scenario.outcomeLabel : 'The market is not settled, so scoring remains pending.'}</p></div><div className={`result-state ${settled ? scenario.outcome ? 'state-yes' : 'state-no' : 'state-open'}`}><span>Settled</span><strong>{settled ? scenario.outcome ? 'YES' : 'NO' : 'OPEN'}</strong><small>{scenario.resolutionDate}</small></div></section><section className="resolution-briefing" aria-labelledby="resolution-briefing-title"><div><span className="eyebrow eyebrow-accent">What happened</span><h2 id="resolution-briefing-title">The final result</h2></div><div className="resolution-briefing-copy"><p><strong>{scenario.resolutionBriefing.summary}</strong></p><p>{scenario.resolutionBriefing.consequence}</p></div><div className="resolution-briefing-sources">{scenario.resolutionBriefing.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} <ArrowRight size={13} /></a>)}</div></section><section className="result-insights" aria-label="Forecast summary"><div><span>Final forecast</span><strong>{formatProbability(finalDecision.userProbability)}</strong><small>Market {formatProbability(finalDecision.marketProbability)} · {formatDelta(finalDecision.userProbability - finalDecision.marketProbability)}</small></div><div><span>Model match</span><strong>{modelMatch}%</strong><small>How close your final weights were to the model</small></div><div><span>Forecast score</span><strong>{forecastReport ? formatScore(forecastReport.user.brier) : 'Pending'}</strong><small>{forecastReport ? `Lower is better · Market ${formatScore(forecastReport.market.brier)}` : 'Scoring begins after settlement'}</small></div><div><span>Market movement</span><strong>{formatDelta(marketMove)}</strong><small>{formatProbability(firstDecision.marketProbability)} to {formatProbability(finalDecision.marketProbability)}</small></div></section><section className="trajectory-section"><div className="section-heading compact-heading"><div><span className="eyebrow">Forecast path</span><h2>Your read vs the market</h2></div></div><div className="trajectory-card"><TrajectoryChart scenario={scenario} decisions={run.decisions} /></div></section><div className="results-actions"><button className="secondary-button" onClick={onReplay}><RotateCcw size={17} /> Replay Seattle market</button></div></div>
}

function PlayView({ scenario, model, activeIndex, run, onReset, onSelectCheckpoint, onImportanceChange, onDirectionChange, onLock, onReveal }: { scenario: Scenario; model: HumanMentalModel; activeIndex: number; run: ForecastRun; onReset: () => void; onSelectCheckpoint: (index: number) => void; onImportanceChange: (id: string, value: number) => void; onDirectionChange: (id: string, direction: Direction) => void; onLock: () => void; onReveal: () => void }) {
  const checkpoint = scenario.checkpoints[activeIndex]
  const activeDecision = run.decisions.find((decision) => decision.checkpointId === checkpoint.id)
  const isCurrent = activeIndex === run.decisions.length && run.decisions.length < scenario.checkpoints.length
  const displayModel = activeDecision?.model ?? model
  const forecast = useMemo(() => calculateForecast(scenario, checkpoint.id, displayModel), [scenario, checkpoint.id, displayModel])
  const complete = run.decisions.length === scenario.checkpoints.length
  return <div className="page play-page"><section className="event-header"><div><h1>{scenario.question}</h1><p>Historical Kalshi replay: weigh what was known then.</p></div><div className="event-meta"><div><span>Ticker</span><strong>{scenario.source.ticker}</strong></div><div><span>Settled</span><strong>{scenario.resolutionDate}</strong></div><div><span>Result</span><strong className={scenario.outcome ? 'positive-text' : 'negative-text'}>{scenario.outcome ? 'YES' : 'NO'}</strong></div><div><span>Verified volume</span><strong>{formatContracts(scenario.source.volume)}</strong></div></div></section><CheckpointNav scenario={scenario} activeIndex={activeIndex} decisions={run.decisions} onSelect={onSelectCheckpoint} />{complete && <div className="ready-banner"><span><Check size={17} /> Four checkpoints complete. The settled result is ready.</span><button onClick={onReveal}>Reveal result <ArrowRight size={16} /></button></div>}<div className="workspace-grid"><div className="decision-column"><WorldBriefing checkpoint={checkpoint} /><section className="model-panel" aria-labelledby="decision-title"><div className="model-panel-head"><div><span className="eyebrow">Your model</span><h2 id="decision-title">What drove a title?</h2></div><button className="reset-link" onClick={onReset}><RotateCcw size={15} /> Restart</button></div><AllocationSummary scenario={scenario} model={displayModel} /><div className="factor-grid">{scenario.factors.map((factor) => <FactorEditor key={factor.id} factor={factor} observation={factor.observations[checkpoint.id]} importance={displayModel.beliefs[factor.id]?.importance ?? 0} direction={displayModel.beliefs[factor.id]?.direction ?? 'neutral'} disabled={!isCurrent} onImportanceChange={(value) => onImportanceChange(factor.id, value)} onDirectionChange={(direction) => onDirectionChange(factor.id, direction)} />)}</div></section></div><ForecastPanel scenario={scenario} checkpointId={checkpoint.id} forecast={forecast} locked={!isCurrent} complete={complete} onLock={onLock} onReveal={onReveal} /></div></div>
}

export default function App() {
  const [view, setView] = useState<View>('play'); const [scenario, setScenario] = useState<Scenario | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [model, setModel] = useState<HumanMentalModel | null>(null); const [activeIndex, setActiveIndex] = useState(0); const [run, setRun] = useState<ForecastRun | null>(null)
  const loadRequestRef = useRef(0)
  const loadScenario = async () => { const requestId = ++loadRequestRef.current; setLoading(true); setError(null); try { const next = await loadSeattleScenario(); if (requestId !== loadRequestRef.current) return; setScenario(next); setModel(startingModelFromScenario(next)); setActiveIndex(0); setRun({ scenarioId: next.id, decisions: [], startedAt: new Date().toISOString() }); setView('play') } catch (caught) { if (requestId === loadRequestRef.current) setError(caught instanceof Error ? caught.message : 'The Kalshi data request failed.') } finally { if (requestId === loadRequestRef.current) setLoading(false) } }
  useEffect(() => { void loadScenario() }, [])
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const restart = () => { if (!scenario) return; setModel(startingModelFromScenario(scenario)); setActiveIndex(0); setRun({ scenarioId: scenario.id, decisions: [], startedAt: new Date().toISOString() }); setView('play'); scrollTop() }
  const isCurrent = Boolean(scenario && model && run && activeIndex === run.decisions.length && run.decisions.length < scenario.checkpoints.length)
  const updateImportance = (factorId: string, value: number) => { if (!isCurrent || !scenario || !model) return; setModel((current) => current ? rebalanceImportance(current, factorId, value, scenario.factors.map((factor) => factor.id)) : current) }
  const updateDirection = (factorId: string, direction: Direction) => { if (!isCurrent) return; setModel((current) => current ? setDirection(current, factorId, direction) : current) }
  const lock = () => { if (!isCurrent || !scenario || !model || !run) return; const checkpoint = scenario.checkpoints[activeIndex]; const forecast = calculateForecast(scenario, checkpoint.id, model); const snapshot: HumanMentalModel = { beliefs: Object.fromEntries(Object.entries(model.beliefs).map(([id, belief]) => [id, { ...belief }])), totalImportance: totalImportance(model) }; const decision: ForecastDecision = { checkpointId: checkpoint.id, cutoffDate: checkpoint.date, marketProbability: forecast.marketProbability, userProbability: forecast.userProbability, model: snapshot, contributions: forecast.contributions.map((item) => ({ ...item })) }; const nextDecisions = [...run.decisions, decision]; setRun((current) => current ? ({ ...current, decisions: nextDecisions, completedAt: nextDecisions.length === scenario.checkpoints.length ? new Date().toISOString() : undefined }) : current); if (activeIndex < scenario.checkpoints.length - 1) setActiveIndex(activeIndex + 1) }
  const reviewPath = () => { if (!scenario || !run || run.decisions.length !== scenario.checkpoints.length) return; setView('results'); scrollTop() }
  const content = loading ? <LoadingView /> : error ? <ErrorView message={error} onRetry={() => void loadScenario()} /> : !scenario || !model || !run ? <ErrorView message="Seattle’s Kalshi market is unavailable." onRetry={() => void loadScenario()} /> : view === 'play' ? <PlayView scenario={scenario} model={model} activeIndex={activeIndex} run={run} onReset={restart} onSelectCheckpoint={setActiveIndex} onImportanceChange={updateImportance} onDirectionChange={updateDirection} onLock={lock} onReveal={reviewPath} /> : <ResultsView scenario={scenario} run={run} onReplay={restart} />
  return <AppFrame>{content}</AppFrame>
}
