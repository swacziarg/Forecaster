import { useEffect, useMemo, useState, type DragEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Database,
  ExternalLink,
  Eye,
  GripVertical,
  Info,
  RotateCcw,
  Trophy,
  X,
} from 'lucide-react'
import { electionEvents, electionMarket, loadElectionMarketSeries, marketMoveNotes } from './data/election2024.ts'
import {
  calculateEventImpacts,
  moveRankedItem,
  rankByObservedImpact,
  scoreImpactRanking,
  summarizeCampaign,
  type EventImpact,
  type MarketSeriesPoint,
} from './domain/eventStudy.ts'

const formatProbability = (value: number) => `${(value * 100).toFixed(value * 100 % 1 === 0 ? 0 : 1)}%`
const formatImpact = (value: number) => `${value >= 0 ? '+' : '-'}${Math.abs(value * 100).toFixed(1)} pts`
const formatVolume = (value: number) => `$${(value / 1_000_000_000).toFixed(2)}B`
const formatScrubTime = (timestamp: string) => new Date(timestamp).toLocaleString('en-US', {
  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
})

function AppFrame({ children }: { children: ReactNode }) {
  return <div className="app-shell"><header className="topbar"><a className="brand" href="#top"><span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span><span>eventlens<span className="brand-dot">.</span></span></a><span className="topbar-note">Market movement, explained</span></header><main id="top">{children}</main></div>
}

function LoadingView() {
  return <div className="state-page"><div className="state-card"><span className="state-kicker"><i /> 2024 election study</span><h1>Loading the campaign market.</h1><p>Preparing 3,863 hourly observations and ten event windows.</p><div className="state-loader" /></div></div>
}

function ErrorView({ message }: { message: string }) {
  return <div className="state-page"><div className="state-card state-card-error"><Info size={18} /><h1>The election study could not load.</h1><p>{message}</p><button className="primary-button" onClick={() => window.location.reload()}><RotateCcw size={16} /> Retry</button></div></div>
}

function nearestPointIndex(points: MarketSeriesPoint[], timestamp: string) {
  const target = Date.parse(timestamp)
  let nearest = 0
  for (let index = 1; index < points.length; index += 1) {
    if (Math.abs(Date.parse(points[index].timestamp) - target) < Math.abs(Date.parse(points[nearest].timestamp) - target)) nearest = index
  }
  return nearest
}

function CampaignChart({ points, impacts, order, selectedId, scrubIndex, onScrub, onSelect }: {
  points: MarketSeriesPoint[]
  impacts: EventImpact[]
  order: string[]
  selectedId: string
  scrubIndex: number
  onScrub: (index: number) => void
  onSelect: (id: string) => void
}) {
  const width = 1080
  const height = 288
  const margin = { left: 44, right: 18, top: 24, bottom: 38 }
  const minTime = Date.parse(points[0].timestamp)
  const maxTime = Date.parse(points[points.length - 1].timestamp)
  const minProbability = 0.4
  const maxProbability = 0.75
  const x = (timestamp: string) => margin.left + (Date.parse(timestamp) - minTime) / (maxTime - minTime) * (width - margin.left - margin.right)
  const y = (probability: number) => margin.top + (maxProbability - probability) / (maxProbability - minProbability) * (height - margin.top - margin.bottom)
  const sampled = points.filter((_, index) => index % 3 === 0 || index === points.length - 1)
  const path = sampled.map((point, index) => `${index === 0 ? 'M' : 'L'}${x(point.timestamp).toFixed(1)},${y(point.probability).toFixed(1)}`).join(' ')
  const rank = new Map(order.map((id, index) => [id, index + 1]))
  const scrubPoint = points[scrubIndex]
  const scrubTime = Date.parse(scrubPoint.timestamp)
  const nearbyEvent = impacts
    .map((impact) => ({ impact, distance: Math.abs(Date.parse(impact.timestamp) - scrubTime) }))
    .filter(({ distance }) => distance <= 48 * 60 * 60 * 1000)
    .sort((a, b) => a.distance - b.distance)[0]?.impact
  const nearbyNote = marketMoveNotes
    .map((note) => ({ note, distance: Math.abs(Date.parse(note.timestamp) - scrubTime) }))
    .filter(({ distance }) => distance <= 72 * 60 * 60 * 1000)
    .sort((a, b) => a.distance - b.distance)[0]?.note
  const contextTitle = nearbyEvent?.title ?? nearbyNote?.title ?? 'No single event assigned'
  const contextText = nearbyEvent?.mechanism ?? nearbyNote?.explanation ?? 'This hour is treated as ordinary or diffuse repricing rather than being forced into a headline explanation.'
  const monthTicks = ['2024-06-01T00:00:00Z', '2024-07-01T00:00:00Z', '2024-08-01T00:00:00Z', '2024-09-01T00:00:00Z', '2024-10-01T00:00:00Z', '2024-11-01T00:00:00Z']

  const selectEvent = (impact: EventImpact) => {
    onSelect(impact.id)
    onScrub(nearestPointIndex(points, impact.timestamp))
  }

  const scrubFromPointer = (event: ReactPointerEvent<SVGRectElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const viewX = (event.clientX - bounds.left) / bounds.width * width
    const ratio = Math.min(Math.max((viewX - margin.left) / (width - margin.left - margin.right), 0), 1)
    const targetTime = minTime + ratio * (maxTime - minTime)
    let nearestIndex = 0
    for (let index = 1; index < points.length; index += 1) {
      if (Math.abs(Date.parse(points[index].timestamp) - targetTime) < Math.abs(Date.parse(points[nearestIndex].timestamp) - targetTime)) nearestIndex = index
    }
    onScrub(nearestIndex)
  }

  const startGraphScrub = (event: ReactPointerEvent<SVGRectElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    scrubFromPointer(event)
  }

  return <div className="chart-wrap">
    <svg className="campaign-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Trump election probability with ten ranked events and four contextual market moves">
      <g className="chart-grid">{[0.4, 0.5, 0.6, 0.7].map((tick) => <g key={tick}><line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} /><text x="0" y={y(tick) + 4}>{formatProbability(tick)}</text></g>)}</g>
      <path className="price-area" d={`${path} L${x(points[points.length - 1].timestamp)},${y(minProbability)} L${x(points[0].timestamp)},${y(minProbability)} Z`} />
      <path className="price-line" d={path} />
      <rect className="chart-scrub-surface" x={margin.left} y={margin.top} width={width - margin.left - margin.right} height={height - margin.top - margin.bottom} onPointerDown={startGraphScrub} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) scrubFromPointer(event) }} onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)} />
      {monthTicks.map((tick) => <text className="month-label" key={tick} x={x(tick)} y={height - 9} textAnchor="middle">{new Date(tick).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })}</text>)}
      {marketMoveNotes.map((note) => {
        const point = points[nearestPointIndex(points, note.timestamp)]
        const cx = x(note.timestamp)
        const cy = y(point.probability)
        return <g className="context-marker" key={note.id} role="button" tabIndex={0} aria-label={note.title} onClick={() => onScrub(nearestPointIndex(points, note.timestamp))} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onScrub(nearestPointIndex(points, note.timestamp)) }}><path d={`M${cx},${cy - 6} L${cx + 6},${cy} L${cx},${cy + 6} L${cx - 6},${cy} Z`} /></g>
      })}
      {impacts.map((impact) => {
        const point = points[nearestPointIndex(points, impact.timestamp)]
        const selected = impact.id === selectedId
        return <g className={`event-marker ${selected ? 'is-selected' : ''}`} key={impact.id} role="button" tabIndex={0} aria-label={`${impact.title}, your rank ${rank.get(impact.id)}`} onClick={() => selectEvent(impact)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') selectEvent(impact) }}><line x1={x(impact.timestamp)} x2={x(impact.timestamp)} y1={margin.top} y2={height - margin.bottom} /><circle cx={x(impact.timestamp)} cy={y(point.probability)} r={selected ? 9 : 7} /><text x={x(impact.timestamp)} y={y(point.probability) + 4} textAnchor="middle">{rank.get(impact.id)}</text></g>
      })}
      <g className="scrub-cursor" aria-hidden="true"><line x1={x(scrubPoint.timestamp)} x2={x(scrubPoint.timestamp)} y1={margin.top} y2={height - margin.bottom} /><circle cx={x(scrubPoint.timestamp)} cy={y(scrubPoint.probability)} r="5" /></g>
    </svg>
    <div className="scrubber"><input aria-label="Explore hourly market probability" type="range" min="0" max={points.length - 1} value={scrubIndex} onInput={(event) => onScrub(Number(event.currentTarget.value))} onChange={(event) => onScrub(Number(event.target.value))} /><div className="scrub-readout"><div><span>{formatScrubTime(scrubPoint.timestamp)}</span><strong>{formatProbability(scrubPoint.probability)} Trump</strong></div><div><div className="scrub-context-heading"><strong>{contextTitle}</strong>{nearbyEvent && <button onClick={() => onSelect(nearbyEvent.id)}>Open event</button>}{nearbyNote && !nearbyEvent && <a href={nearbyNote.source.url} target="_blank" rel="noreferrer">Evidence <ExternalLink size={11} /></a>}</div><p>{contextText}</p></div></div></div>
  </div>
}

function MovementCell({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return <div className={accent ? 'movement-cell is-accent' : 'movement-cell'}><span>{label}</span><strong>{formatProbability(value)}</strong></div>
}

function ImpactDetail({ impact, revealed, onShareChange }: { impact: EventImpact; revealed: boolean; onShareChange: (value: number) => void }) {
  return <aside className="impact-detail" aria-label="Selected event analysis">
    <div className="detail-kicker"><span>{impact.category}</span><time dateTime={impact.timestamp}>{impact.dateLabel}, 2024</time></div>
    <h2>{impact.title}</h2>
    <p className="detail-summary">{impact.summary}</p>
    <div className={`direction-tag direction-${impact.expectedDirection.toLowerCase().replace(' ', '-')}`}>{impact.expectedDirection}</div>
    <section className="mechanism"><span>Why it could change the race</span><p>{impact.mechanism}</p></section>
    {!revealed ? <div className="market-hidden"><Eye size={17} /><div><strong>Market response hidden</strong><p>Use this evidence to place the event in your ranking. Compare when your order is ready.</p></div></div> : <>
      <div className="movement-flow"><MovementCell label="Before" value={impact.beforeProbability} /><ArrowRight size={16} /><MovementCell label="Immediate" value={impact.immediateProbability} /><ArrowRight size={16} /><MovementCell label="Stabilized" value={impact.stabilizedProbability} accent /></div>
      <div className="observed-impact"><div><span>Observed market movement</span><small>Stabilized minus pre-event median</small></div><strong className={impact.observedMovement >= 0 ? 'positive' : 'negative'}>{formatImpact(impact.observedMovement)}</strong></div>
      <div className="follow-through"><div><span>48–72h follow-through</span><small>Shown separately from the standardized ranking</small></div><div><strong>{formatProbability(impact.followThroughProbability)}</strong><b className={impact.followThroughMovement >= 0 ? 'positive' : 'negative'}>{formatImpact(impact.followThroughMovement)}</b></div></div>
      <div className="attribution-control"><div className="attribution-heading"><label htmlFor="attribution-share">Expert attribution to this event</label><strong>{impact.attributionShare}%</strong></div><input id="attribution-share" type="range" min="0" max="100" step="5" value={impact.attributionShare} onChange={(event) => onShareChange(Number(event.target.value))} /><div className="range-labels"><span>None</span><span>All of the move</span></div></div>
      <div className="counterfactual-box"><span>Estimated effect attributable to event</span><strong className={impact.attributedImpact >= 0 ? 'positive' : 'negative'}>{formatImpact(impact.attributedImpact)}</strong><p>Without this event, the stabilized estimate is <b>{formatProbability(impact.counterfactualProbability)}</b>, instead of {formatProbability(impact.stabilizedProbability)}.</p></div>
      <div className="confidence-row"><span className={`confidence-dot confidence-${impact.confidence.toLowerCase()}`} /><div><strong>{impact.confidence} confidence</strong><small>{impact.samples.before + impact.samples.immediate + impact.samples.stabilized + impact.samples.followThrough} hourly observations across four windows</small></div></div>
      <details className="analysis-notes" open><summary>What the market suggests <ChevronDown size={16} /></summary><p>{impact.interpretation}</p><strong>Competing explanation</strong><p>{impact.competingExplanation}</p></details>
    </>}
    <a className="source-link" href={impact.source.url} target="_blank" rel="noreferrer"><span><small>{impact.source.publisher}</small>{impact.source.label}</span><ExternalLink size={16} /></a>
    <p className="causality-note"><Info size={14} />Market-implied response, not proven electoral causality.</p>
  </aside>
}

function RankingBoard({ impacts, order, selectedId, revealed, onMove, onSelect, onReveal, onReset }: {
  impacts: EventImpact[]
  order: string[]
  selectedId: string
  revealed: boolean
  onMove: (id: string, index: number) => void
  onSelect: (id: string) => void
  onReveal: () => void
  onReset: () => void
}) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const byId = new Map(impacts.map((impact) => [impact.id, impact]))
  const marketOrder = rankByObservedImpact(impacts).map((impact) => impact.id)
  const marketRank = new Map(marketOrder.map((id, index) => [id, index + 1]))
  const score = scoreImpactRanking(order, marketOrder)

  const drop = (event: DragEvent, index: number) => {
    event.preventDefault()
    if (draggedId) onMove(draggedId, index)
    setDraggedId(null)
  }

  return <section className="ranking-section" aria-labelledby="ranking-title">
    <div className="section-heading"><div><span className="eyebrow">Your impact ranking</span><h2 id="ranking-title">Most consequential to least</h2></div><div className="ranking-actions">{revealed && <span className="ranking-score"><Trophy size={15} /><b>{score}%</b> rank match</span>}<button className="reset-button" onClick={onReset} title="Reset ranking" aria-label="Reset ranking"><RotateCcw size={16} /></button>{!revealed && <button className="reveal-button" onClick={onReveal}><Eye size={16} /> Compare with market</button>}</div></div>
    <p className="ranking-instruction">Drag the ten events into your predicted order. Rank total electoral consequence, not just the size of the headline.</p>
    <div className="ranking-list">{order.map((id, index) => {
      const impact = byId.get(id)!
      return <article className={`ranking-row ${id === selectedId ? 'is-selected' : ''} ${id === draggedId ? 'is-dragging' : ''}`} key={id} draggable onDragStart={() => setDraggedId(id)} onDragEnd={() => setDraggedId(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, index)}>
        <span className="ranking-number">{index + 1}</span><GripVertical className="drag-handle" size={17} aria-hidden="true" />
        <button className="ranking-title" onClick={() => onSelect(id)}><small>{impact.dateLabel} · {impact.category}</small><strong>{impact.shortTitle}</strong><span>{impact.mechanism}</span></button>
        <span className={`direction-tag direction-${impact.expectedDirection.toLowerCase().replace(' ', '-')}`}>{impact.expectedDirection}</span>
        {revealed ? <div className="market-rank"><small>Market #{marketRank.get(id)}</small><strong className={impact.observedMovement >= 0 ? 'positive' : 'negative'}>{formatImpact(impact.observedMovement)}</strong><span>72h {formatImpact(impact.followThroughMovement)}</span></div> : <span className="impact-sealed">Impact hidden</span>}
        <div className="rank-controls"><button disabled={index === 0} onClick={() => onMove(id, index - 1)} aria-label={`Move ${impact.shortTitle} up`} title="Move up"><ArrowUp size={14} /></button><button disabled={index === order.length - 1} onClick={() => onMove(id, index + 1)} aria-label={`Move ${impact.shortTitle} down`} title="Move down"><ArrowDown size={14} /></button></div>
      </article>
    })}</div>
  </section>
}

function MethodDrawer({ onClose }: { onClose: () => void }) {
  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="method-drawer" role="dialog" aria-modal="true" aria-labelledby="method-title" onMouseDown={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Close methodology"><X size={20} /></button><span className="eyebrow">Methodology</span><h2 id="method-title">Separate salience from measurable movement</h2><ol><li><strong>Rank first</strong><p>Order the events by the total electoral consequence you expect, from most to least.</p></li><li><strong>Scrub the market</strong><p>Move hour by hour across the contract. Numbered circles are ranked events; diamonds explain large diffuse or market-structure moves.</p></li><li><strong>Compare windows</strong><p>Before is the prior 12-hour median, immediate is the first six hours, and stabilized is the median from 18 to 36 hours after. A separate 48–72 hour measure exposes slower follow-through without quietly changing the ranking window.</p></li><li><strong>Attribute carefully</strong><p>The expert share applies to the change in log odds. The rest remains concurrent or unexplained information.</p></li><li><strong>Do not add the rows</strong><p>Windows overlap and market response is not the same as eventual persuasion or turnout impact.</p></li></ol><div className="method-warning"><Info size={17} /><p>A market can miss a real slow-moving effect and react to trading flow with no campaign event. The interface preserves both possibilities.</p></div><a className="source-link" href={electionMarket.datasetUrl} target="_blank" rel="noreferrer"><span><small>Official API documentation</small>Polymarket CLOB price history</span><ExternalLink size={16} /></a></aside></div>
}

function ElectionStudy({ points }: { points: MarketSeriesPoint[] }) {
  const initialOrder = useMemo(() => electionEvents.map((event) => event.id), [])
  const [order, setOrder] = useState(initialOrder)
  const [selectedId, setSelectedId] = useState(initialOrder[0])
  const [scrubIndex, setScrubIndex] = useState(() => nearestPointIndex(points, electionEvents[0].timestamp))
  const [shares, setShares] = useState<Record<string, number>>({})
  const [revealed, setRevealed] = useState(false)
  const [showMethod, setShowMethod] = useState(false)
  const impacts = useMemo(() => calculateEventImpacts(points, electionEvents, shares), [points, shares])
  const summary = useMemo(() => summarizeCampaign(points), [points])
  const selected = impacts.find((impact) => impact.id === selectedId) ?? impacts[0]

  const selectEvent = (id: string) => {
    setSelectedId(id)
    const event = impacts.find((impact) => impact.id === id)
    if (event) setScrubIndex(nearestPointIndex(points, event.timestamp))
  }
  const resetRanking = () => { setOrder(initialOrder); setRevealed(false) }

  return <div className="study-page">
    <section className="study-header"><div><span className="event-kicker">2024 U.S. presidential election</span><h1>{electionMarket.question}</h1><p>Rank ten pivotal moments, inspect every hourly move, then compare your judgment with Trump's Polymarket contract.</p></div><div className="header-actions"><button className="method-button" onClick={() => setShowMethod(true)}><BookOpen size={16} /> Methodology</button><a className="market-button" href={electionMarket.marketUrl} target="_blank" rel="noreferrer">Original market <ExternalLink size={15} /></a></div></section>
    <section className="summary-strip" aria-label="Campaign market summary"><div><CalendarDays size={16} /><span>Study period<strong>{electionMarket.period}</strong></span></div><div><Database size={16} /><span>Hourly observations<strong>{summary.observations.toLocaleString()}</strong></span></div><div><BarChart3 size={16} /><span>Campaign range<strong>{formatProbability(summary.lowProbability)}-{formatProbability(summary.highProbability)}</strong></span></div><div><GripVertical size={16} /><span>Events to rank<strong>{impacts.length} campaign moments</strong></span></div><div className="resolution-stat"><span>Resolved<strong>{electionMarket.outcome}</strong></span><small>{formatVolume(electionMarket.volume)} traded</small></div></section>
    <div className="study-grid"><div className="study-main"><section className="chart-panel" aria-labelledby="chart-title"><div className="panel-heading"><div><span className="eyebrow">Explore the evidence</span><h2 id="chart-title">Slide through Trump's market probability</h2></div><div className="chart-legend"><span><i />Trump wins</span><span><b />Ranked event</span><span><em />Context move</span></div></div><CampaignChart points={points} impacts={impacts} order={order} selectedId={selectedId} scrubIndex={scrubIndex} onScrub={setScrubIndex} onSelect={selectEvent} /><div className="chart-caption"><span>Opened at <strong>{formatProbability(summary.firstProbability)}</strong></span><span>Election-night endpoint <strong>{formatProbability(summary.finalProbability)}</strong></span><span>Net movement <strong className={summary.netMovement >= 0 ? 'positive' : 'negative'}>{formatImpact(summary.netMovement)}</strong></span></div></section><RankingBoard impacts={impacts} order={order} selectedId={selectedId} revealed={revealed} onMove={(id, index) => setOrder((current) => moveRankedItem(current, id, index))} onSelect={selectEvent} onReveal={() => setRevealed(true)} onReset={resetRanking} /></div><ImpactDetail impact={selected} revealed={revealed} onShareChange={(value) => setShares((current) => ({ ...current, [selected.id]: value }))} /></div>
    {showMethod && <MethodDrawer onClose={() => setShowMethod(false)} />}
  </div>
}

export default function App() {
  const [points, setPoints] = useState<MarketSeriesPoint[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { loadElectionMarketSeries().then(setPoints).catch((caught) => setError(caught instanceof Error ? caught.message : 'The dataset could not be read.')) }, [])
  return <AppFrame>{error ? <ErrorView message={error} /> : points ? <ElectionStudy points={points} /> : <LoadingView />}</AppFrame>
}
