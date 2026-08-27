import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Check,
  CircleHelp,
  Info,
  LockKeyhole,
  Minus,
  RotateCcw,
  Scale,
} from 'lucide-react'
import {
  calculateForecast,
  modelFromScenario,
  rebalanceImportance,
  scoreForecastPath,
  setDirection,
  totalImportance,
} from './domain/engine.ts'
import type {
  CheckpointId,
  Direction,
  FactorDefinition,
  ForecastDecision,
  ForecastResult,
  ForecastRun,
  HumanMentalModel,
  Scenario,
} from './domain/types.ts'
import { loadKalshiScenarios } from './data/kalshiScenarios.ts'

type View = 'home' | 'play' | 'results' | 'profile'

const directionLabels: Record<Direction, string> = {
  more_likely: 'More likely',
  neutral: 'Neutral',
  less_likely: 'Less likely',
}

const categoryClass: Record<Scenario['categoryTone'], string> = {
  green: 'tone-green',
  blue: 'tone-blue',
  amber: 'tone-amber',
}

const formatProbability = (value: number) => `${Math.round(value * 100)}%`
const formatDelta = (value: number) => `${value >= 0 ? '+' : ''}${Math.round(value * 100)} pts`
const formatScore = (value: number) => value.toFixed(2)
const formatContracts = (value: number) => `${Math.round(value).toLocaleString()} contracts`

function Header({ view, profileEnabled, onHome, onProfile }: { view: View; profileEnabled: boolean; onHome: () => void; onProfile: () => void }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome} aria-label="Back to resolved Kalshi markets">
        <span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span>
        <span>forecast<span className="brand-dot">.</span></span>
      </button>
      <nav className="topnav" aria-label="Primary navigation">
        <button className={view === 'home' ? 'nav-link is-active' : 'nav-link'} onClick={onHome}>Markets</button>
        <button className={view === 'profile' ? 'nav-link is-active' : 'nav-link'} disabled={!profileEnabled} onClick={onProfile}>Your run</button>
      </nav>
      <div className="live-status"><span className="status-dot" /> Kalshi verified history</div>
    </header>
  )
}

function AppFrame({ view, profileEnabled, onHome, onProfile, children }: { view: View; profileEnabled: boolean; onHome: () => void; onProfile: () => void; children: ReactNode }) {
  return (
    <div className="app-shell">
      <Header view={view} profileEnabled={profileEnabled} onHome={onHome} onProfile={onProfile} />
      <main>{children}</main>
      <footer className="site-footer">
        <span>forecast<span className="brand-dot">.</span></span>
        <span>Resolved market replays, one decision at a time.</span>
        <span><span className="status-dot" /> Kalshi only</span>
      </footer>
    </div>
  )
}

function LoadingView() {
  return <div className="page state-page"><div className="state-card"><span className="live-label"><i /> Connecting to Kalshi</span><h1>Loading resolved markets.</h1><p>Verifying settlement, traded volume, and market history for four historical contracts.</p><div className="state-loader" /></div></div>
}

function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="page state-page"><div className="state-card state-card-error"><span className="eyebrow eyebrow-accent"><Info size={14} /> Kalshi connection issue</span><h1>We could not load the markets.</h1><p>{message}</p><button className="primary-button" onClick={onRetry}><RotateCcw size={15} /> Try again</button><small>Nothing is substituted when live data is unavailable.</small></div></div>
}

function HomeView({ scenarios, onStart, onRefresh }: { scenarios: Scenario[]; onStart: (scenario: Scenario) => void; onRefresh: () => void }) {
  const firstScenario = scenarios[0]
  return (
    <div className="page home-page">
      <section className="home-intro">
        <div className="intro-copy">
          <p className="eyebrow eyebrow-accent">A focused forecasting instrument</p>
          <h1>Forecast what happens next.</h1>
          <p>Replay a major settled event from four historical Kalshi snapshots, decide which event-specific hypotheses matter, and lock your read before revealing the result.</p>
          <button className="primary-button primary-button-large" onClick={() => onStart(firstScenario)}>Start forecasting <ArrowRight size={17} /></button>
        </div>
        <div className="intro-facts" aria-label="How forecasting works">
          <div><strong>04</strong><span>settled markets</span></div>
          <div><strong>04</strong><span>checkpoints</span></div>
          <div><strong>100</strong><span>points to allocate</span></div>
        </div>
      </section>

      <section className="market-board" aria-labelledby="market-board-title">
        <div className="section-heading board-heading">
          <div>
            <div className="eyebrow-row"><p className="eyebrow">Historical market board</p><span className="subtle-live"><i /> Verified</span></div>
            <h2 id="market-board-title">Choose a market</h2>
          </div>
          <div className="board-heading-actions"><span className="board-count">{scenarios.length} markets</span><button className="reset-link" onClick={onRefresh}><RotateCcw size={13} /> Refresh</button></div>
        </div>
        <div className="scenario-grid">{scenarios.map((scenario) => <ScenarioCard key={scenario.id} scenario={scenario} onStart={onStart} />)}</div>
        <details className="source-details">
          <summary><Info size={15} /> Verified market sources</summary>
          <p>Settlement, close dates, contract volume, and candlesticks come directly from Kalshi’s historical market API. Every factor is an explicitly labeled scenario lens whose numeric proxy uses only that contract’s Kalshi history.</p>
          <div className="source-market-list">{scenarios.map((scenario) => <div key={scenario.id}><a href={scenario.source.sourceUrl} target="_blank" rel="noreferrer">{scenario.source.ticker}</a><span>{scenario.outcome ? 'YES' : 'NO'} · settled {scenario.resolutionDate} · {formatContracts(scenario.source.volume)}</span></div>)}</div>
        </details>
      </section>
    </div>
  )
}

function ScenarioCard({ scenario, onStart }: { scenario: Scenario; onStart: (scenario: Scenario) => void }) {
  const latest = [...scenario.marketHistory].reverse().find((point) => !point.resolution)?.probability ?? scenario.checkpoints[scenario.checkpoints.length - 1].marketProbability
  return (
    <article className="scenario-card">
      <p className={`category-tag ${categoryClass[scenario.categoryTone]}`}>{scenario.category}</p>
      <h3>{scenario.question}</h3>
      <div className="market-card-probability"><strong>{Math.round(latest)}%</strong><span>final pre-settlement Kalshi price</span></div>
      <div className={`scenario-proof ${scenario.outcome ? 'proof-yes' : 'proof-no'}`}><span>Settled {scenario.outcome ? 'YES' : 'NO'}</span><span>{formatContracts(scenario.source.volume)}</span></div>
      <div className="scenario-card-footer"><div><span>Settled</span><strong>{scenario.resolutionDate}</strong></div><button className="card-action" onClick={() => onStart(scenario)}>Forecast this market <ArrowRight size={15} /></button></div>
    </article>
  )
}

function CheckpointNav({ scenario, activeIndex, decisions, onSelect }: { scenario: Scenario; activeIndex: number; decisions: ForecastDecision[]; onSelect: (index: number) => void }) {
  const complete = decisions.length === scenario.checkpoints.length
  return (
    <section className="checkpoint-panel" aria-label="Forecast checkpoints">
      <div className="checkpoint-header"><div><p className="eyebrow">Your checkpoints</p><span>Lock one read to reveal the next snapshot.</span></div><strong>{decisions.length} / {scenario.checkpoints.length} locked</strong></div>
      <ol className="checkpoint-track">
        {scenario.checkpoints.map((checkpoint, index) => {
          const locked = decisions.some((decision) => decision.checkpointId === checkpoint.id)
          const available = index <= decisions.length
          const active = activeIndex === index
          return <li key={checkpoint.id}><button className={`checkpoint ${active ? 'is-active' : ''} ${locked ? 'is-locked' : ''}`} disabled={!available} onClick={() => onSelect(index)} aria-current={active ? 'step' : undefined} aria-label={`${checkpoint.shortLabel}, ${locked ? 'locked' : available ? 'available' : 'unavailable'}`}><span className="checkpoint-dot">{locked ? <Check size={12} /> : <b>{index + 1}</b>}</span><span><strong>{checkpoint.shortLabel}</strong><small>{locked ? 'Locked' : available ? checkpoint.date : 'Unavailable'}</small></span></button></li>
        })}
        <li className={`resolution-node ${complete ? 'is-ready' : ''}`}><span className="checkpoint-dot">{complete ? <Check size={12} /> : <LockKeyhole size={12} />}</span><span><strong>{complete ? 'Review' : 'Settlement'}</strong><small>{complete ? 'Ready' : scenario.resolutionDate}</small></span></li>
      </ol>
    </section>
  )
}

function FactorEditor({ factor, index, observation, importance, direction, disabled, onImportanceChange, onDirectionChange }: { factor: FactorDefinition; index: number; observation: FactorDefinition['observations'][CheckpointId]; importance: number; direction: Direction; disabled: boolean; onImportanceChange: (value: number) => void; onDirectionChange: (direction: Direction) => void }) {
  const directionIcon = (option: Direction) => option === 'more_likely' ? <ArrowUp size={14} /> : option === 'less_likely' ? <ArrowDown size={14} /> : <Minus size={14} />
  const inputId = `importance-${factor.id}`
  return (
    <article className={`factor-row ${disabled ? 'is-disabled' : ''}`}>
      <div className="factor-row-top">
        <div className="factor-heading"><span className="factor-number">{String(index + 1).padStart(2, '0')}</span><div><div className="factor-name"><h3>{factor.label}</h3><button className="help-button" title={factor.description} aria-label={`About ${factor.label}`}><CircleHelp size={14} /></button></div><p className="factor-observation"><Activity size={13} /> {observation.reading}</p></div></div>
        <label className="points-input" htmlFor={inputId}><span>Points</span><input id={inputId} type="number" min="0" max="100" step="1" value={importance} disabled={disabled} onChange={(event) => onImportanceChange(Number(event.target.value))} aria-label={`${factor.label} importance points`} /></label>
      </div>
      <p className="factor-lens">{factor.observation}</p>
      <div className="factor-context"><span>Event context</span><p>{factor.narrative.context}</p></div>
      <div className="factor-controls">
        <div className="importance-control"><input className="importance-range" type="range" min="0" max="100" step="1" value={importance} disabled={disabled} onChange={(event) => onImportanceChange(Number(event.target.value))} aria-label={`${factor.label} relative importance`} /><div className="range-caption"><span>0</span><span>100 points</span></div></div>
        <div className="direction-control"><span className="control-label">Direction</span><div className="direction-buttons" role="group" aria-label={`${factor.label} direction`}>{(['more_likely', 'neutral', 'less_likely'] as Direction[]).map((option) => <button key={option} className={`direction-button ${direction === option ? `selected-${option}` : ''}`} disabled={disabled} onClick={() => onDirectionChange(option)} aria-pressed={direction === option}>{directionIcon(option)}<span>{directionLabels[option]}</span></button>)}</div></div>
      </div>
      <details className="factor-details" open><summary>Why this signal matters</summary><p>{factor.description} {observation.context}</p><div className="factor-argument-grid"><p><strong>Argument for YES</strong>{factor.narrative.yesCase}</p><p><strong>Argument against YES</strong>{factor.narrative.noCase}</p></div><p className="factor-consequence"><strong>Consequence</strong>{factor.narrative.consequence}</p><p className="factor-cue"><strong>Your prompt</strong>{factor.cue}</p></details>
    </article>
  )
}

function AllocationSummary({ scenario, model }: { scenario: Scenario; model: HumanMentalModel }) {
  const total = Math.round(totalImportance(model))
  return <div className="allocation-summary"><div className="allocation-heading"><div><span className="eyebrow">Point budget</span><strong>{total}<small> / 100 allocated</small></strong></div><span className="allocation-ok"><Check size={13} /> Exact total</span></div><div className="allocation-bar">{scenario.factors.map((factor) => <span key={factor.id} style={{ width: `${model.beliefs[factor.id]?.importance ?? 0}%` }} title={`${factor.label}: ${model.beliefs[factor.id]?.importance ?? 0} points`} />)}</div><div className="allocation-legend">{scenario.factors.map((factor) => <span key={factor.id}>{factor.shortLabel} <b>{model.beliefs[factor.id]?.importance ?? 0}</b></span>)}</div></div>
}

function ForecastPanel({ scenario, checkpointId, forecast, locked, complete, onLock, onReveal }: { scenario: Scenario; checkpointId: CheckpointId; forecast: ForecastResult; locked: boolean; complete: boolean; onLock: () => void; onReveal: () => void }) {
  const checkpointLabel = scenario.checkpoints.find((item) => item.id === checkpointId)?.shortLabel
  return (
    <aside className="forecast-panel" aria-label="Your forecast">
      <div className="forecast-panel-top"><div><p className="eyebrow">Your forecast</p><span className="forecast-state">{locked ? 'Locked' : 'Editing'}</span></div><LockKeyhole size={18} /></div>
      <div className="forecast-big"><strong>{formatProbability(forecast.userProbability)}</strong><span>Your probability</span></div>
      <div className="forecast-comparison"><div><span>You</span><strong>{formatProbability(forecast.userProbability)}</strong></div><div><span>Kalshi</span><strong>{formatProbability(forecast.marketProbability)}</strong></div><div><span>Difference</span><strong className={forecast.probabilityDelta >= 0 ? 'positive-text' : 'negative-text'}>{formatDelta(forecast.probabilityDelta)}</strong></div></div>
      <div className="probability-meter"><div className="meter-track"><span className="meter-fill" style={{ width: `${forecast.userProbability * 100}%` }} /><span className="meter-market" style={{ left: `${forecast.marketProbability * 100}%` }} /><span className="meter-you" style={{ left: `${forecast.userProbability * 100}%` }} /></div><div className="meter-scale"><span>0%</span><span>50%</span><span>100%</span></div></div>
      <details className="impact-details"><summary>See factor impact</summary><div>{forecast.contributions.map((item) => <div className="impact-row" key={item.factorId}><span>{item.label}</span><strong className={item.probabilityDelta >= 0 ? 'positive-text' : 'negative-text'}>{formatDelta(item.probabilityDelta)}</strong></div>)}</div></details>
      <div className="forecast-action-area">
        {!locked && !complete && <><button className="lock-button" onClick={onLock}><LockKeyhole size={16} /> Lock {checkpointLabel} forecast</button><small>Locking seals this checkpoint and reveals the next Kalshi snapshot.</small></>}
        {locked && !complete && <div className="locked-message"><span><Check size={15} /></span><div><strong>{checkpointLabel} is sealed.</strong><small>Select the next available checkpoint above.</small></div></div>}
        {locked && complete && <><div className="locked-message"><span><Check size={15} /></span><div><strong>All four forecasts are locked.</strong><small>{scenario.outcome === null ? 'The contract is still open.' : 'The contract has settled.'}</small></div></div><button className="lock-button" onClick={onReveal}>{scenario.outcome === null ? 'Review your path' : 'Reveal the outcome'} <ArrowRight size={15} /></button></>}
      </div>
    </aside>
  )
}

function WorldBriefing({ checkpoint }: { checkpoint: Scenario['checkpoints'][number] }) {
  const { briefing } = checkpoint
  return (
    <section className="world-briefing" aria-labelledby={`world-briefing-${checkpoint.id}`}>
      <div className="world-briefing-head">
        <div>
          <p className="eyebrow eyebrow-accent">The world at this checkpoint</p>
          <h2 id={`world-briefing-${checkpoint.id}`}>What was known by {checkpoint.date}</h2>
        </div>
        <span className="briefing-cutoff"><LockKeyhole size={13} /> No later knowledge</span>
      </div>
      <p className="briefing-status">{briefing.status}</p>
      <div className="briefing-evidence">
        <div>
          <span className="briefing-label">What had happened</span>
          <ul>{briefing.developments.map((development) => <li key={development}>{development}</li>)}</ul>
        </div>
        <div className="briefing-arguments">
          <article className="argument-card argument-yes"><span>Argument for YES</span><p>{briefing.yesCase}</p></article>
          <article className="argument-card argument-no"><span>Argument against YES</span><p>{briefing.noCase}</p></article>
        </div>
      </div>
      <div className="briefing-stakes"><span className="briefing-label">Why it mattered</span><p>{briefing.stakes}</p></div>
      <div className="briefing-sources"><span>Sources for checkpoint facts</span>{briefing.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} <ArrowRight size={11} /></a>)}</div>
    </section>
  )
}

function PlayView({ scenario, scenarioIndex, scenarioCount, model, activeIndex, run, onBack, onReset, onSelectCheckpoint, onImportanceChange, onDirectionChange, onLock, onReveal }: { scenario: Scenario; scenarioIndex: number; scenarioCount: number; model: HumanMentalModel; activeIndex: number; run: ForecastRun; onBack: () => void; onReset: () => void; onSelectCheckpoint: (index: number) => void; onImportanceChange: (id: string, value: number) => void; onDirectionChange: (id: string, direction: Direction) => void; onLock: () => void; onReveal: () => void }) {
  const checkpoint = scenario.checkpoints[activeIndex]
  const activeDecision = run.decisions.find((decision) => decision.checkpointId === checkpoint.id)
  const isCurrent = activeIndex === run.decisions.length && run.decisions.length < scenario.checkpoints.length
  const displayModel = activeDecision?.model ?? model
  const forecast = useMemo(() => calculateForecast(scenario, checkpoint.id, displayModel), [scenario, checkpoint.id, displayModel])
  const complete = run.decisions.length === scenario.checkpoints.length
  const total = totalImportance(displayModel)
  return (
    <div className="page play-page">
      <div className="page-topline"><button className="back-link" onClick={onBack}><ArrowLeft size={14} /> Resolved markets</button><span className="ticker-label">{scenario.source.ticker}</span></div>
      <section className="play-header"><div><div className="play-kicker"><span className={`category-tag ${categoryClass[scenario.categoryTone]}`}>{scenario.category}</span><span>Market {scenarioIndex + 1} of {scenarioCount}</span></div><h1>{scenario.question}</h1></div><div className="market-snapshot"><div><span>Kalshi at checkpoint</span><strong>{Math.round(checkpoint.marketProbability)}%</strong></div><div><span>Checkpoint date</span><strong>{checkpoint.date}</strong></div></div></section>
      <div className="progress-summary"><span>Checkpoint {activeIndex + 1} of {scenario.checkpoints.length}</span><strong>{run.decisions.length} locked</strong></div>
      <CheckpointNav scenario={scenario} activeIndex={activeIndex} decisions={run.decisions} onSelect={onSelectCheckpoint} />
      {complete && <div className="ready-banner"><div><span className="ready-icon"><Check size={16} /></span><span><strong>Four checkpoints complete.</strong> {scenario.outcome === null ? 'The contract is OPEN and awaiting settlement.' : 'The settled outcome is ready to reveal.'}</span></div><button onClick={onReveal}>{scenario.outcome === null ? 'Review path' : 'Reveal outcome'} <ArrowRight size={15} /></button></div>}
      <WorldBriefing checkpoint={checkpoint} />
      <details className="data-details"><summary><LockKeyhole size={14} /> How this briefing affects the model</summary><p>The sourced briefing helps you reason, but it does not enter the numeric forecast engine. Factor signals still use only this contract’s Kalshi history available by {checkpoint.date}; scenario hypotheses are clearly separated from observed events.</p></details>
      <div className="play-grid">
        <section className="model-panel"><div className="model-panel-head"><div><p className="eyebrow">{isCurrent ? 'Build your model' : 'Locked decision'}</p><h2>What matters here?</h2><p>Weight each event-specific hypothesis, then decide how its market-only proxy should move your forecast.</p></div><button className="reset-link" onClick={onReset}><RotateCcw size={13} /> Restart</button></div><AllocationSummary scenario={scenario} model={displayModel} /><div className="factor-list">{scenario.factors.map((factor, index) => <FactorEditor key={factor.id} factor={factor} index={index} observation={factor.observations[checkpoint.id]} importance={displayModel.beliefs[factor.id]?.importance ?? 0} direction={displayModel.beliefs[factor.id]?.direction ?? 'neutral'} disabled={!isCurrent} onImportanceChange={(value) => onImportanceChange(factor.id, value)} onDirectionChange={(direction) => onDirectionChange(factor.id, direction)} />)}</div><div className={`budget-footer ${Math.round(total) === 100 ? 'budget-good' : 'budget-bad'}`}><span>{Math.round(total) === 100 ? <Check size={14} /> : <Info size={14} />}</span><strong>{Math.round(total) === 100 ? 'Your 100-point model is ready.' : `${Math.round(total)} points allocated — adjust to 100.`}</strong></div></section>
        <ForecastPanel scenario={scenario} checkpointId={checkpoint.id} forecast={forecast} locked={!isCurrent} complete={complete} onLock={onLock} onReveal={onReveal} />
      </div>
    </div>
  )
}

function TrajectoryChart({ scenario, decisions }: { scenario: Scenario; decisions: ForecastDecision[] }) {
  const width = 760
  const height = 270
  const left = 42
  const right = 20
  const top = 18
  const bottom = 38
  const plotWidth = width - left - right
  const plotHeight = height - top - bottom
  const xFor = (index: number) => left + index / Math.max(scenario.marketHistory.length - 1, 1) * plotWidth
  const yFor = (probability: number) => top + (100 - probability) / 100 * plotHeight
  const marketPoints = scenario.marketHistory.map((point, index) => `${xFor(index)},${yFor(point.probability)}`).join(' ')
  const userPoints = decisions.map((decision, index) => `${xFor(index)},${yFor(decision.userProbability * 100)}`).join(' ')
  const checkpointPoints = scenario.marketHistory.slice(0, scenario.checkpoints.length).map((point, index) => ({ x: xFor(index), y: yFor(point.probability), label: scenario.checkpoints[index]?.shortLabel ?? point.label }))
  const userCheckpointPoints = decisions.map((decision, index) => ({ x: xFor(index), y: yFor(decision.userProbability * 100), label: decision.checkpointId }))
  const resolutionIndex = scenario.marketHistory.findIndex((point) => point.resolution)
  const resolutionPoint = resolutionIndex >= 0 ? { x: xFor(resolutionIndex), y: yFor(scenario.marketHistory[resolutionIndex].probability) } : null
  const xLabels = scenario.marketHistory.map((point, index) => ({ point, index })).filter(({ index, point }) => index < scenario.checkpoints.length || index === scenario.marketHistory.length - 1 || point.resolution)
  return <div className="trajectory-wrap"><div className="chart-legend"><span><i className="chart-line market-line" /> Kalshi</span><span><i className="chart-line user-line" /> You</span>{resolutionPoint && <span className="chart-resolution">● Resolution</span>}</div><svg className="trajectory-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Your forecast compared with the Kalshi probability across four checkpoints"><g className="chart-grid">{[0, 25, 50, 75, 100].map((value) => <g key={value}><line x1={left} x2={width - right} y1={yFor(value)} y2={yFor(value)} /><text x="0" y={yFor(value) + 4}>{value}%</text></g>)}</g>{resolutionPoint && <line className="resolution-line" x1={resolutionPoint.x} x2={resolutionPoint.x} y1={top} y2={height - bottom} />}<polyline className="market-polyline" points={marketPoints} /><polyline className="user-polyline" points={userPoints} />{checkpointPoints.map((point) => <circle key={`m-${point.label}`} className="market-point" cx={point.x} cy={point.y} r="4" />)}{userCheckpointPoints.map((point) => <circle key={`u-${point.label}`} className="user-point" cx={point.x} cy={point.y} r="4.5" />)}{resolutionPoint && <g><circle className={`resolution-point ${scenario.outcome ? 'outcome-yes' : 'outcome-no'}`} cx={resolutionPoint.x} cy={resolutionPoint.y} r="7" /><text className="resolution-label" x={resolutionPoint.x - 31} y={Math.max(top + 14, resolutionPoint.y - 14)}>{scenario.outcome ? 'YES' : 'NO'}</text></g>}{xLabels.map(({ point, index }) => <text className="chart-x-label" key={`${point.label}-${index}`} x={xFor(index)} y={height - 9} textAnchor="middle">{index < scenario.checkpoints.length ? scenario.checkpoints[index]?.shortLabel : point.resolution ? 'Result' : 'Latest'}</text>)}</svg></div>
}

function ResultsView({ scenario, run, onReplay, onChooseAnother, onProfile }: { scenario: Scenario; run: ForecastRun; onReplay: () => void; onChooseAnother: () => void; onProfile: () => void }) {
  const settled = scenario.outcome !== null
  const forecastReport = settled ? scoreForecastPath(run.decisions, scenario.outcome as boolean) : null
  const lastModel = run.decisions[run.decisions.length - 1].model
  const rankedFactors = scenario.factors.map((factor) => ({ factor, belief: lastModel.beliefs[factor.id] })).sort((a, b) => (b.belief?.importance ?? 0) - (a.belief?.importance ?? 0))
  const strongest = rankedFactors[0]
  const firstDecision = run.decisions[0]
  const finalDecision = run.decisions[run.decisions.length - 1]
  const marketMove = finalDecision.marketProbability - firstDecision.marketProbability
  return (
    <div className="page results-page">
      <div className="page-topline"><button className="back-link" onClick={onChooseAnother}><ArrowLeft size={14} /> Resolved markets</button><span className="ticker-label">{scenario.source.ticker}</span></div>
      <section className="result-header"><div><p className="eyebrow eyebrow-accent">{settled ? 'Settled market' : 'Open market'}</p><h1>{settled ? 'The market settled.' : 'OPEN — awaiting settlement.'}</h1><p>{settled ? scenario.outcomeLabel : 'Your four forecasts are locked. Kalshi has not reported an outcome yet, so scoring remains pending.'}</p></div><div className={`result-state ${settled ? scenario.outcome ? 'state-yes' : 'state-no' : 'state-open'}`}><span>{settled ? 'Outcome' : 'Status'}</span><strong>{settled ? scenario.outcome ? 'YES' : 'NO' : 'OPEN'}</strong><small>{scenario.resolutionDate}</small></div></section>
      <section className="resolution-briefing" aria-labelledby="resolution-briefing-title"><div><p className="eyebrow eyebrow-accent">The event in context</p><h2 id="resolution-briefing-title">What actually happened</h2></div><div className="resolution-briefing-copy"><p><strong>{scenario.resolutionBriefing.summary}</strong></p><p>{scenario.resolutionBriefing.consequence}</p></div><div className="resolution-briefing-sources">{scenario.resolutionBriefing.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} <ArrowRight size={11} /></a>)}</div></section>
      <section className="result-insights" aria-label="Forecast summary"><div><span>Final forecast</span><strong>{formatProbability(finalDecision.userProbability)}</strong><small>Kalshi {formatProbability(finalDecision.marketProbability)} · {formatDelta(finalDecision.userProbability - finalDecision.marketProbability)}</small></div><div><span>Market movement</span><strong>{formatDelta(marketMove)}</strong><small>{formatProbability(firstDecision.marketProbability)} to {formatProbability(finalDecision.marketProbability)}</small></div><div><span>Strongest factor</span><strong>{strongest?.belief?.importance ?? 0} pts</strong><small>{strongest?.factor.label ?? 'No factor selected'}</small></div><div><span>{settled ? 'Forecast score' : 'Settlement score'}</span><strong>{forecastReport ? formatScore(forecastReport.user.brier) : 'Pending'}</strong><small>{forecastReport ? `Kalshi ${formatScore(forecastReport.market.brier)} · ${forecastReport.userBeatMarketCount}/${forecastReport.checkpoints} beats` : 'Scoring begins after Kalshi settles'}</small></div></section>
      <section className="trajectory-section"><div className="section-heading compact-heading"><div><p className="eyebrow">The path</p><h2>Your forecast vs Kalshi</h2></div><span>One clear question: how did your read move?</span></div><div className="trajectory-card"><TrajectoryChart scenario={scenario} decisions={run.decisions} /></div></section>
      <div className="results-note"><Info size={15} /><span>{settled ? 'Lower Brier scores are better. Your score uses the same settled outcome as the Kalshi baseline.' : 'OPEN means the contract is still active. Your locked forecasts stay on record until the live market settles.'}</span></div>
      <div className="results-actions"><button className="secondary-button" onClick={onReplay}><RotateCcw size={15} /> Replay market</button><button className="secondary-button" onClick={onChooseAnother}><ArrowLeft size={15} /> Choose another</button><button className="primary-button" onClick={onProfile}>See your run <ArrowRight size={15} /></button></div>
    </div>
  )
}

function ProfileView({ scenario, run, onPlay }: { scenario: Scenario; run: ForecastRun; onPlay: () => void }) {
  const lastModel = run.decisions[run.decisions.length - 1].model
  const finalDecision = run.decisions[run.decisions.length - 1]
  const finalDelta = finalDecision.userProbability - finalDecision.marketProbability
  const rankedFactors = scenario.factors.map((factor) => ({ factor, belief: lastModel.beliefs[factor.id] })).sort((a, b) => (b.belief?.importance ?? 0) - (a.belief?.importance ?? 0))
  return (
    <div className="page profile-page">
      <div className="page-topline"><button className="back-link" onClick={onPlay}><ArrowLeft size={14} /> Live markets</button><span className="ticker-label"><BarChart3 size={13} /> Current run</span></div>
      <section className="profile-header"><div><p className="eyebrow eyebrow-accent">Reflection, not a history</p><h1>What did your model prioritize?</h1><p>This view is built only from your locked decisions for {scenario.shortTitle}. Nothing here implies a saved cross-market profile.</p></div><div className="lock-count"><strong>{run.decisions.length}/4</strong><span>checkpoints locked</span></div></section>
      <section className="profile-summary"><div><span>Final deviation</span><strong className={finalDelta >= 0 ? 'positive-text' : 'negative-text'}>{formatDelta(finalDelta)}</strong><small>Your last forecast vs Kalshi</small></div><div><span>Final forecast</span><strong>{formatProbability(finalDecision.userProbability)}</strong><small>Kalshi {formatProbability(finalDecision.marketProbability)}</small></div><div><span>Market state</span><strong>{scenario.outcome === null ? 'OPEN' : scenario.outcome ? 'YES' : 'NO'}</strong><small>{scenario.outcome === null ? 'Awaiting settlement' : 'Settled by Kalshi'}</small></div></section>
      <section className="profile-factors"><div className="section-heading compact-heading"><div><p className="eyebrow">Your strongest factors</p><h2>Final weights and directions</h2></div><Scale size={18} /></div><div className="factor-summary-list">{rankedFactors.map(({ factor, belief }, index) => <div key={factor.id}><span className="factor-summary-number">{String(index + 1).padStart(2, '0')}</span><strong>{factor.label}</strong><span className="factor-summary-direction">{directionLabels[belief?.direction ?? 'neutral']}</span><b>{belief?.importance ?? 0} pts</b></div>)}</div><p className="profile-small-note"><Info size={13} /> The factors are derived from Kalshi candlesticks; the weights and directions are yours.</p></section>
      <div className="profile-market-line"><div><span>Market in focus</span><strong>{scenario.question}</strong></div><span>{scenario.category} · settled {scenario.resolutionDate}</span></div>
      <div className="profile-actions"><button className="primary-button primary-button-large" onClick={onPlay}>Forecast another market <ArrowRight size={16} /></button></div>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>('home')
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null)
  const [model, setModel] = useState<HumanMentalModel | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [run, setRun] = useState<ForecastRun | null>(null)
  const [revealed, setRevealed] = useState(false)

  const loadMarkets = async () => {
    setLoading(true)
    setError(null)
    try {
      const nextScenarios = await loadKalshiScenarios()
      setScenarios(nextScenarios)
      setSelectedScenarioId((current) => current ?? nextScenarios[0]?.id ?? null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The Kalshi data request failed.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadMarkets() }, [])

  const selectedScenario = scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0]
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const startScenario = (scenario: Scenario) => { setSelectedScenarioId(scenario.id); setModel(modelFromScenario(scenario)); setActiveIndex(0); setRun({ scenarioId: scenario.id, decisions: [], startedAt: new Date().toISOString() }); setRevealed(false); setView('play'); scrollTop() }
  const goHome = () => { setView('home'); scrollTop() }
  const restart = () => { if (!selectedScenario) return; setModel(modelFromScenario(selectedScenario)); setActiveIndex(0); setRun({ scenarioId: selectedScenario.id, decisions: [], startedAt: new Date().toISOString() }); setRevealed(false); setView('play'); scrollTop() }
  const isCurrent = Boolean(selectedScenario && model && run && activeIndex === run.decisions.length && run.decisions.length < selectedScenario.checkpoints.length)
  const updateImportance = (factorId: string, value: number) => { if (!isCurrent || !selectedScenario || !model) return; setModel((current) => current ? rebalanceImportance(current, factorId, value, selectedScenario.factors.map((factor) => factor.id)) : current) }
  const updateDirection = (factorId: string, direction: Direction) => { if (!isCurrent) return; setModel((current) => current ? setDirection(current, factorId, direction) : current) }
  const lock = () => {
    if (!isCurrent || !selectedScenario || !model || !run) return
    const checkpoint = selectedScenario.checkpoints[activeIndex]
    const forecast = calculateForecast(selectedScenario, checkpoint.id, model)
    const snapshot: HumanMentalModel = { beliefs: Object.fromEntries(Object.entries(model.beliefs).map(([id, belief]) => [id, { ...belief }])), totalImportance: totalImportance(model) }
    const decision: ForecastDecision = { checkpointId: checkpoint.id, cutoffDate: checkpoint.date, marketProbability: forecast.marketProbability, userProbability: forecast.userProbability, model: snapshot, contributions: forecast.contributions.map((item) => ({ ...item })) }
    const nextDecisions = [...run.decisions, decision]
    setRun((current) => current ? ({ ...current, decisions: nextDecisions, completedAt: nextDecisions.length === selectedScenario.checkpoints.length ? new Date().toISOString() : undefined }) : current)
    if (activeIndex < selectedScenario.checkpoints.length - 1) setActiveIndex(activeIndex + 1)
  }
  const reviewPath = () => { if (!selectedScenario || !run || run.decisions.length !== selectedScenario.checkpoints.length) return; setRevealed(true); setView('results'); scrollTop() }

  const profileEnabled = revealed && Boolean(run && selectedScenario)
  const content = loading ? <LoadingView /> : error ? <ErrorView message={error} onRetry={() => void loadMarkets()} /> : !selectedScenario ? <ErrorView message="No Kalshi markets were returned." onRetry={() => void loadMarkets()} /> : view === 'home' ? <HomeView scenarios={scenarios} onStart={startScenario} onRefresh={() => void loadMarkets()} /> : !model || !run ? <ErrorView message="Start a market to begin forecasting." onRetry={goHome} /> : view === 'play' ? <PlayView scenario={selectedScenario} scenarioIndex={scenarios.findIndex((scenario) => scenario.id === selectedScenario.id)} scenarioCount={scenarios.length} model={model} activeIndex={activeIndex} run={run} onBack={goHome} onReset={restart} onSelectCheckpoint={setActiveIndex} onImportanceChange={updateImportance} onDirectionChange={updateDirection} onLock={lock} onReveal={reviewPath} /> : view === 'results' ? <ResultsView scenario={selectedScenario} run={run} onReplay={restart} onChooseAnother={goHome} onProfile={() => { setView('profile'); scrollTop() }} /> : <ProfileView scenario={selectedScenario} run={run} onPlay={goHome} />

  return <AppFrame view={view} profileEnabled={profileEnabled} onHome={goHome} onProfile={() => { if (profileEnabled) { setView('profile'); scrollTop() } }}>{content}</AppFrame>
}
