import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowRight, BarChart3, BookOpen, CalendarDays, ChevronDown, Database, ExternalLink, Info, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { electionEvents, electionMarket, loadElectionMarketSeries } from './data/election2024.ts'
import { calculateEventImpacts, largestObservedImpact, summarizeCampaign, type EventImpact, type MarketSeriesPoint } from './domain/eventStudy.ts'

const formatProbability = (value: number) => `${(value * 100).toFixed(value * 100 % 1 === 0 ? 0 : 1)}%`
const formatImpact = (value: number) => `${value >= 0 ? '+' : '−'}${Math.abs(value * 100).toFixed(1)} pts`
const formatVolume = (value: number) => `$${(value / 1_000_000_000).toFixed(2)}B`

function AppFrame({ children }: { children: ReactNode }) {
  return <div className="app-shell"><header className="topbar"><a className="brand" href="#top"><span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span><span>eventlens<span className="brand-dot">.</span></span></a><span className="topbar-note">Market movement, explained</span></header><main id="top">{children}</main></div>
}

function LoadingView() {
  return <div className="state-page"><div className="state-card"><span className="state-kicker"><i /> 2024 election study</span><h1>Loading the campaign market.</h1><p>Preparing 3,791 hourly observations and six event windows.</p><div className="state-loader" /></div></div>
}

function ErrorView({ message }: { message: string }) {
  return <div className="state-page"><div className="state-card state-card-error"><Info size={18} /><h1>The election study could not load.</h1><p>{message}</p><button className="primary-button" onClick={() => window.location.reload()}><RotateCcw size={16} /> Retry</button></div></div>
}

function CampaignChart({ points, impacts, selectedId, onSelect }: { points: MarketSeriesPoint[]; impacts: EventImpact[]; selectedId: string; onSelect: (id: string) => void }) {
  const width = 1080
  const height = 300
  const margin = { left: 44, right: 18, top: 22, bottom: 42 }
  const minTime = Date.parse(points[0].timestamp)
  const maxTime = Date.parse(points[points.length - 1].timestamp)
  const minProbability = 0.4
  const maxProbability = 0.75
  const x = (timestamp: string) => margin.left + (Date.parse(timestamp) - minTime) / (maxTime - minTime) * (width - margin.left - margin.right)
  const y = (probability: number) => margin.top + (maxProbability - probability) / (maxProbability - minProbability) * (height - margin.top - margin.bottom)
  const sampled = points.filter((_, index) => index % 3 === 0 || index === points.length - 1)
  const path = sampled.map((point, index) => `${index === 0 ? 'M' : 'L'}${x(point.timestamp).toFixed(1)},${y(point.probability).toFixed(1)}`).join(' ')
  const nearestPoint = (timestamp: string) => points.reduce((nearest, point) => Math.abs(Date.parse(point.timestamp) - Date.parse(timestamp)) < Math.abs(Date.parse(nearest.timestamp) - Date.parse(timestamp)) ? point : nearest)
  const monthTicks = ['2024-06-01T00:00:00Z', '2024-07-01T00:00:00Z', '2024-08-01T00:00:00Z', '2024-09-01T00:00:00Z', '2024-10-01T00:00:00Z', '2024-11-01T00:00:00Z']

  return <div className="chart-wrap"><svg className="campaign-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Trump election probability from June through November 2024 with six annotated campaign events"><g className="chart-grid">{[0.4, 0.5, 0.6, 0.7].map((tick) => <g key={tick}><line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} /><text x="0" y={y(tick) + 4}>{formatProbability(tick)}</text></g>)}</g><path className="price-area" d={`${path} L${x(points[points.length - 1].timestamp)},${y(minProbability)} L${x(points[0].timestamp)},${y(minProbability)} Z`} /><path className="price-line" d={path} />{monthTicks.map((tick) => <text className="month-label" key={tick} x={x(tick)} y={height - 11} textAnchor="middle">{new Date(tick).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })}</text>)}{impacts.map((impact, index) => { const point = nearestPoint(impact.timestamp); const selected = impact.id === selectedId; return <g className={`event-marker ${selected ? 'is-selected' : ''}`} key={impact.id} role="button" tabIndex={0} aria-label={`${impact.title}, ${formatImpact(impact.observedMovement)}`} onClick={() => onSelect(impact.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(impact.id) }}><line x1={x(impact.timestamp)} x2={x(impact.timestamp)} y1={margin.top} y2={height - margin.bottom} /><circle cx={x(impact.timestamp)} cy={y(point.probability)} r={selected ? 9 : 7} /><text x={x(impact.timestamp)} y={y(point.probability) + 4} textAnchor="middle">{index + 1}</text></g>})}</svg></div>
}

function MovementCell({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return <div className={accent ? 'movement-cell is-accent' : 'movement-cell'}><span>{label}</span><strong>{formatProbability(value)}</strong></div>
}

function ImpactDetail({ impact, onShareChange }: { impact: EventImpact; onShareChange: (value: number) => void }) {
  const positive = impact.observedMovement >= 0
  return <aside className="impact-detail" aria-label="Selected event analysis"><div className="detail-kicker"><span>{impact.category}</span><time dateTime={impact.timestamp}>{impact.dateLabel}, 2024</time></div><h2>{impact.title}</h2><p className="detail-summary">{impact.summary}</p><div className="movement-flow"><MovementCell label="Before" value={impact.beforeProbability} /><ArrowRight size={16} /><MovementCell label="Immediate" value={impact.immediateProbability} /><ArrowRight size={16} /><MovementCell label="Stabilized" value={impact.stabilizedProbability} accent /></div><div className="observed-impact"><div><span>Observed market movement</span><small>Stabilized minus pre-event median</small></div><strong className={positive ? 'positive' : 'negative'}>{formatImpact(impact.observedMovement)}</strong></div><div className="attribution-control"><div className="attribution-heading"><label htmlFor="attribution-share">Expert attribution to this event</label><strong>{impact.attributionShare}%</strong></div><input id="attribution-share" type="range" min="0" max="100" step="5" value={impact.attributionShare} onChange={(event) => onShareChange(Number(event.target.value))} /><div className="range-labels"><span>None</span><span>All of the move</span></div></div><div className="counterfactual-box"><span>Estimated effect attributable to event</span><strong className={impact.attributedImpact >= 0 ? 'positive' : 'negative'}>{formatImpact(impact.attributedImpact)}</strong><p>Without this event, the stabilized estimate is <b>{formatProbability(impact.counterfactualProbability)}</b>, instead of {formatProbability(impact.stabilizedProbability)}.</p></div><div className="confidence-row"><span className={`confidence-dot confidence-${impact.confidence.toLowerCase()}`} /><div><strong>{impact.confidence} confidence</strong><small>{impact.samples.before + impact.samples.immediate + impact.samples.stabilized} hourly observations across the three windows</small></div></div><details className="analysis-notes" open><summary>Expert interpretation <ChevronDown size={16} /></summary><p>{impact.interpretation}</p><strong>Competing explanation</strong><p>{impact.competingExplanation}</p></details><a className="source-link" href={impact.source.url} target="_blank" rel="noreferrer"><span><small>{impact.source.publisher}</small>{impact.source.label}</span><ExternalLink size={16} /></a><p className="causality-note"><Info size={14} />This estimates market-implied impact, not proven causality.</p></aside>
}

function EventList({ impacts, selectedId, onSelect }: { impacts: EventImpact[]; selectedId: string; onSelect: (id: string) => void }) {
  return <section className="event-list-section" aria-labelledby="events-title"><div className="section-heading"><div><span className="eyebrow">Six measured windows</span><h2 id="events-title">The campaign’s defining events</h2></div><p>Ranked chronologically. Impact is the stabilized probability minus the 12-hour pre-event median.</p></div><div className="event-list">{impacts.map((impact, index) => <button key={impact.id} className={`event-row ${impact.id === selectedId ? 'is-selected' : ''}`} onClick={() => onSelect(impact.id)}><span className="event-number">{String(index + 1).padStart(2, '0')}</span><span className="event-row-title"><small>{impact.dateLabel} · {impact.category}</small><strong>{impact.shortTitle}</strong></span><span className="event-price-path">{formatProbability(impact.beforeProbability)} <ArrowRight size={13} /> {formatProbability(impact.stabilizedProbability)}</span><span className={impact.observedMovement >= 0 ? 'event-delta positive' : 'event-delta negative'}>{formatImpact(impact.observedMovement)}</span><span className="event-confidence">{impact.confidence}</span><ArrowRight className="event-arrow" size={16} /></button>)}</div></section>
}

function MethodDrawer({ onClose }: { onClose: () => void }) {
  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="method-drawer" role="dialog" aria-modal="true" aria-labelledby="method-title" onMouseDown={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Close methodology"><X size={20} /></button><span className="eyebrow">Methodology</span><h2 id="method-title">From a price move to an attributed effect</h2><ol><li><strong>Before</strong><p>Median Trump probability during the 12 hours before the event.</p></li><li><strong>Immediate</strong><p>Median probability during the first six hours after the timestamp.</p></li><li><strong>Stabilized</strong><p>Median probability from 18 to 36 hours after the event, reducing the influence of a single volatile trade.</p></li><li><strong>Observed movement</strong><p>Stabilized probability minus the pre-event median.</p></li><li><strong>Attributed impact</strong><p>The expert share is applied to the change in log odds. The remaining movement is treated as concurrent or unexplained information.</p></li></ol><div className="method-warning"><Info size={17} /><p>Event windows can overlap and are not additive. These estimates describe how the market repriced around an event; they do not establish that the event caused the entire move.</p></div><a className="source-link" href={electionMarket.datasetUrl} target="_blank" rel="noreferrer"><span><small>Dataset provenance</small>eventclock hourly Polymarket series</span><ExternalLink size={16} /></a></aside></div>
}

function ElectionStudy({ points }: { points: MarketSeriesPoint[] }) {
  const [selectedId, setSelectedId] = useState('assassination-attempt')
  const [shares, setShares] = useState<Record<string, number>>({})
  const [showMethod, setShowMethod] = useState(false)
  const impacts = useMemo(() => calculateEventImpacts(points, electionEvents, shares), [points, shares])
  const summary = useMemo(() => summarizeCampaign(points), [points])
  const selected = impacts.find((impact) => impact.id === selectedId) ?? impacts[0]
  const largest = largestObservedImpact(impacts)

  return <div className="study-page"><section className="study-header"><div><span className="event-kicker">2024 U.S. presidential election</span><h1>{electionMarket.question}</h1><p>Six high-information events measured against 3,791 hourly prices from Trump’s Polymarket contract.</p></div><div className="header-actions"><button className="method-button" onClick={() => setShowMethod(true)}><BookOpen size={16} /> Methodology</button><a className="market-button" href={electionMarket.marketUrl} target="_blank" rel="noreferrer">Original market <ExternalLink size={15} /></a></div></section><section className="summary-strip" aria-label="Campaign market summary"><div><CalendarDays size={16} /><span>Study period<strong>{electionMarket.period}</strong></span></div><div><Database size={16} /><span>Hourly observations<strong>{summary.observations.toLocaleString()}</strong></span></div><div><BarChart3 size={16} /><span>Campaign range<strong>{formatProbability(summary.lowProbability)}–{formatProbability(summary.highProbability)}</strong></span></div><div><SlidersHorizontal size={16} /><span>Largest measured event<strong>{largest.shortTitle} · {formatImpact(largest.observedMovement)}</strong></span></div><div className="resolution-stat"><span>Resolved<strong>{electionMarket.outcome}</strong></span><small>{formatVolume(electionMarket.volume)} traded</small></div></section><div className="study-grid"><div className="study-main"><section className="chart-panel" aria-labelledby="chart-title"><div className="panel-heading"><div><span className="eyebrow">Market-implied probability</span><h2 id="chart-title">Trump’s path from June to Election Day</h2></div><div className="chart-legend"><span><i />Trump wins</span><span><b />Measured event</span></div></div><CampaignChart points={points} impacts={impacts} selectedId={selectedId} onSelect={setSelectedId} /><div className="chart-caption"><span>Opened study window at <strong>{formatProbability(summary.firstProbability)}</strong></span><span>Election-night endpoint <strong>{formatProbability(summary.finalProbability)}</strong></span><span>Net movement <strong className={summary.netMovement >= 0 ? 'positive' : 'negative'}>{formatImpact(summary.netMovement)}</strong></span></div></section><EventList impacts={impacts} selectedId={selectedId} onSelect={setSelectedId} /></div><ImpactDetail impact={selected} onShareChange={(value) => setShares((current) => ({ ...current, [selected.id]: value }))} /></div>{showMethod && <MethodDrawer onClose={() => setShowMethod(false)} />}</div>
}

export default function App() {
  const [points, setPoints] = useState<MarketSeriesPoint[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadElectionMarketSeries().then(setPoints).catch((caught) => setError(caught instanceof Error ? caught.message : 'The dataset could not be read.'))
  }, [])

  return <AppFrame>{error ? <ErrorView message={error} /> : points ? <ElectionStudy points={points} /> : <LoadingView />}</AppFrame>
}
