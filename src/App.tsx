import { useEffect, useMemo, useState, type DragEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { ArrowRight, BarChart3, BookOpen, CalendarDays, ChevronDown, Database, ExternalLink, GripVertical, Info, LockKeyhole, RotateCcw, ShieldCheck, X, ZoomIn } from 'lucide-react'
import { studyById, studyFromLocation, studyRegistry, type StudyRegistration } from './data/studies.ts'
import { dailyPuzzles } from './data/dailyPuzzles.ts'
import { DailyGame, DailyUnavailable } from './DailyGame.tsx'
import { calculateStudyImpacts, createTieGroups, moveRankedItem, pairwiseAgreement, summarizeCampaign, type MarketSeriesPoint, type StudyEventImpact } from './domain/eventStudy.ts'
import { resolveDailyPuzzle } from './domain/dailyGame.ts'
import { assertValidStudy, type Source, type Study } from './domain/study.ts'

const formatProbability = (value: number | null) => value === null ? 'Unavailable' : `${(value * 100).toFixed(value * 100 % 1 === 0 ? 0 : 1)}%`
const formatImpact = (value: number | null) => {
  if (value === null) return 'Indeterminate'
  const roundedPoints = Math.round(Math.abs(value) * 1000 + 1e-9) / 10
  return `${value >= 0 ? '+' : '-'}${roundedPoints.toFixed(1)} pts`
}
const formatVolume = (value?: number) => value === undefined ? 'Not reported' : value >= 1_000_000_000 ? `$${(value / 1_000_000_000).toFixed(2)}B` : `${(value / 1_000_000).toFixed(2)}M contracts`
const formatTime = (timestamp: string, timezone: string) => new Date(timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: timezone, timeZoneName: 'short' })
const formatDate = (timestamp: string, timezone: string) => new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: timezone })

function AppFrame({ children }: { children: ReactNode }) {
  const pathname = window.location.pathname
  const active = studyRegistry.find(({ study }) => pathname.includes(study.slug))?.study ?? (pathname === '/' ? studyRegistry[0].study : null)
  const publicStudies = studyRegistry.filter(({ study }) => study.status === 'published')
  return <div className="app-shell"><header className="topbar"><a className="brand" href="/"><span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span><span>NexusPoint<span className="brand-dot">.</span></span></a><nav className="study-nav" aria-label="Event studies"><a className={pathname === '/studies' || pathname === '/studies/' ? 'is-active' : ''} href="/studies">Archive</a><label className="study-selector"><span>Study</span><select aria-label="Choose an event study" value={active?.slug ?? ''} onChange={(event) => { if (event.target.value) window.location.href = `/studies/${event.target.value}` }}><option value="" disabled>Choose a study</option>{publicStudies.map(({ study }) => <option value={study.slug} key={study.id}>{study.presentation.topicLabel}</option>)}</select><ChevronDown size={14} aria-hidden="true" /></label></nav></header><main id="top">{children}</main></div>
}

function StudiesIndex() {
  const publicStudies = studyRegistry.filter(({ study }) => study.status === 'published')
  return <div className="studies-index"><section className="studies-intro"><span className="event-kicker">NexusPoint archive</span><h1>Explore past market puzzles.</h1><p>Revisit the evidence, measured movements, and source notes behind completed NexusPoint topics.</p></section><section className="study-card-grid" aria-label="Published event studies">{publicStudies.map(({ study }) => <article className="study-card is-primary" key={study.id} style={{ '--topic-accent': study.presentation.accent } as React.CSSProperties}><div className="study-card-meta"><span>{study.category}</span><span className="status-pill status-published">Published</span></div><h2>{study.presentation.topicLabel}</h2><p>{study.contract.proposition}</p><dl><div><dt>Events</dt><dd>{study.events.length}</dd></div><div><dt>Coverage</dt><dd>{formatDate(study.dataset.coverageStart, study.presentation.timezone)}–{formatDate(study.dataset.coverageEnd, study.presentation.timezone)}</dd></div><div><dt>Provider</dt><dd>{study.market.provider}</dd></div></dl><a href={`/studies/${study.slug}`}>Explore the study <ArrowRight size={15} /></a></article>)}</section></div>
}

function LoadingView({ study }: { study: Study }) {
  return <div className="state-page"><div className="state-card"><span className="state-kicker"><i /> {study.presentation.topicLabel}</span><h1>Loading the market study.</h1><p>Verifying the versioned snapshot and its event windows.</p><div className="state-loader" /></div></div>
}

function ErrorView({ message }: { message: string }) {
  return <div className="state-page"><div className="state-card state-card-error"><Info size={18} /><h1>The study could not load.</h1><p>{message}</p><button className="primary-button" onClick={() => window.location.reload()}><RotateCcw size={16} /> Retry</button></div></div>
}

function nearestPointIndex(points: MarketSeriesPoint[], timestamp: string) {
  const target = Date.parse(timestamp)
  let low = 0
  let high = points.length - 1
  while (low < high) {
    const middle = Math.floor((low + high) / 2)
    if (Date.parse(points[middle].timestamp) < target) low = middle + 1
    else high = middle
  }
  if (low > 0 && Math.abs(Date.parse(points[low - 1].timestamp) - target) <= Math.abs(Date.parse(points[low].timestamp) - target)) return low - 1
  return low
}

function MarketChart({ study, points, impacts, order, selectedId, scrubIndex, onScrub, onSelect }: {
  study: Study; points: MarketSeriesPoint[]; impacts: StudyEventImpact[]; order: string[]; selectedId: string; scrubIndex: number; onScrub: (index: number) => void; onSelect: (id: string) => void
}) {
  const width = 1080
  const height = 288
  const margin = { left: 44, right: 18, top: 24, bottom: 38 }
  const totalStartTime = Date.parse(points[0].timestamp)
  const totalEndTime = Date.parse(points[points.length - 1].timestamp)
  const totalHours = Math.ceil((totalEndTime - totalStartTime) / 3_600_000)
  const [zoomHours, setZoomHours] = useState<number | null>(null)
  const [zoomAnchorIndex, setZoomAnchorIndex] = useState(scrubIndex)
  const selectedImpact = impacts.find((impact) => impact.eventId === selectedId)

  useEffect(() => {
    if (selectedImpact) setZoomAnchorIndex(nearestPointIndex(points, selectedImpact.event.informationKnownAt))
  }, [points, selectedImpact])

  const requestedSpan = Math.min(zoomHours ?? totalHours, totalHours) * 3_600_000
  const anchorTime = Date.parse(points[zoomAnchorIndex].timestamp)
  const windowStartTime = zoomHours === null ? totalStartTime : Math.min(Math.max(anchorTime - requestedSpan / 2, totalStartTime), totalEndTime - requestedSpan)
  const windowEndTime = zoomHours === null ? totalEndTime : Math.min(windowStartTime + requestedSpan, totalEndTime)
  const visibleStartIndex = Math.max(0, points.findIndex((point) => Date.parse(point.timestamp) >= windowStartTime))
  let visibleEndIndex = points.length - 1
  while (visibleEndIndex > visibleStartIndex && Date.parse(points[visibleEndIndex].timestamp) > windowEndTime) visibleEndIndex -= 1
  const visiblePoints = points.slice(visibleStartIndex, visibleEndIndex + 1)
  const minTime = Date.parse(visiblePoints[0].timestamp)
  const maxTime = Date.parse(visiblePoints[visiblePoints.length - 1].timestamp)
  const probabilities = visiblePoints.map((point) => point.probability)
  const observedMin = Math.min(...probabilities)
  const observedMax = Math.max(...probabilities)
  const paddedRange = Math.max(0.08, observedMax - observedMin + 0.03)
  const center = (observedMin + observedMax) / 2
  const minProbability = Math.max(0, center - paddedRange / 2)
  const maxProbability = Math.min(1, center + paddedRange / 2)
  const timeRange = Math.max(1, maxTime - minTime)
  const probabilityRange = Math.max(0.01, maxProbability - minProbability)
  const x = (timestamp: string) => margin.left + (Date.parse(timestamp) - minTime) / timeRange * (width - margin.left - margin.right)
  const y = (probability: number) => margin.top + (maxProbability - probability) / probabilityRange * (height - margin.top - margin.bottom)
  const sampleEvery = zoomHours === null ? 3 : 1
  const sampled = visiblePoints.filter((_, index) => index % sampleEvery === 0 || index === visiblePoints.length - 1)
  const path = sampled.map((point, index) => `${index === 0 ? 'M' : 'L'}${x(point.timestamp).toFixed(1)},${y(point.probability).toFixed(1)}`).join(' ')
  const rank = new Map(order.map((id, index) => [id, index + 1]))
  const scrubPoint = points[scrubIndex]
  const scrubTime = Date.parse(scrubPoint.timestamp)
  const nearbyEvent = impacts.map((impact) => ({ impact, distance: Math.abs(Date.parse(impact.event.informationKnownAt) - scrubTime) })).filter(({ distance }) => distance <= 48 * 3_600_000).sort((a, b) => a.distance - b.distance)[0]?.impact
  const nearbyNote = study.contextMarkers.map((note) => ({ note, distance: Math.abs(Date.parse(note.timestamp) - scrubTime) })).filter(({ distance }) => distance <= 72 * 3_600_000).sort((a, b) => a.distance - b.distance)[0]?.note
  const timeTicks = Array.from({ length: 6 }, (_, index) => minTime + timeRange * index / 5)
  const probabilityTicks = Array.from({ length: 4 }, (_, index) => minProbability + probabilityRange * index / 3)
  const formatAxis = (timestamp: number) => new Date(timestamp).toLocaleDateString('en-US', zoomHours === null ? { month: 'short', timeZone: study.presentation.timezone } : { month: 'short', day: 'numeric', timeZone: study.presentation.timezone })
  const selectedWindows = selectedImpact ? Object.entries(selectedImpact.windows) : []
  const windowClass: Record<string, string> = { anticipation: 'window-anticipation', reference: 'window-reference', immediate: 'window-immediate', stabilized: 'window-stabilized', delayed: 'window-delayed' }

  const scrubFromPointer = (event: ReactPointerEvent<SVGRectElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(Math.max(((event.clientX - bounds.left) / bounds.width * width - margin.left) / (width - margin.left - margin.right), 0), 1)
    onScrub(nearestPointIndex(points, new Date(minTime + ratio * timeRange).toISOString()))
  }

  return <div className="chart-wrap">
    <div className="chart-zoom" role="group" aria-label="Chart zoom"><span><ZoomIn size={14} /> Zoom</span>{study.presentation.zoomChoices.map((option) => <button className={zoomHours === option.hours ? 'is-active' : ''} key={option.label} onClick={() => { setZoomAnchorIndex(scrubIndex); setZoomHours(option.hours) }}>{option.label}</button>)}<small>{formatAxis(minTime)} – {formatAxis(maxTime)}</small></div>
    <svg className="campaign-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${study.presentation.seriesLabel} with ${impacts.length} ranked events`}>
      <g className="chart-grid">{probabilityTicks.map((tick) => <g key={tick}><line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} /><text x="0" y={y(tick) + 4}>{formatProbability(tick)}</text></g>)}</g>
      <g className="event-windows" aria-hidden="true">{selectedWindows.map(([name, window]) => {
        const start = Math.max(minTime, Date.parse(window.start)); const end = Math.min(maxTime, Date.parse(window.end));
        return start < end ? <rect key={name} className={windowClass[name]} x={x(new Date(start).toISOString())} y={margin.top} width={Math.max(1, x(new Date(end).toISOString()) - x(new Date(start).toISOString()))} height={height - margin.top - margin.bottom} /> : null
      })}</g>
      <path className="price-area" d={`${path} L${x(visiblePoints[visiblePoints.length - 1].timestamp)},${y(minProbability)} L${x(visiblePoints[0].timestamp)},${y(minProbability)} Z`} />
      <path className="price-line" d={path} />
      {sampled.filter((point) => point.markType === 'midpoint').map((point) => <circle className="quote-mark" key={point.timestamp} cx={x(point.timestamp)} cy={y(point.probability)} r="1.7" />)}
      <rect className="chart-scrub-surface" x={margin.left} y={margin.top} width={width - margin.left - margin.right} height={height - margin.top - margin.bottom} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); scrubFromPointer(event) }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) scrubFromPointer(event) }} onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)} />
      {timeTicks.map((tick) => <text className="month-label" key={tick} x={margin.left + (tick - minTime) / timeRange * (width - margin.left - margin.right)} y={height - 9} textAnchor="middle">{formatAxis(tick)}</text>)}
      {study.contextMarkers.filter((note) => Date.parse(note.timestamp) >= minTime && Date.parse(note.timestamp) <= maxTime).map((note) => { const point = points[nearestPointIndex(points, note.timestamp)]; const cx = x(note.timestamp); const cy = y(point.probability); const selectNote = () => onScrub(nearestPointIndex(points, note.timestamp)); return <g className="context-marker" key={note.id} role="button" tabIndex={0} aria-label={note.title} onClick={selectNote} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') selectNote() }}><path d={`M${cx},${cy - 6} L${cx + 6},${cy} L${cx},${cy + 6} L${cx - 6},${cy} Z`} /></g> })}
      {impacts.filter((impact) => Date.parse(impact.event.informationKnownAt) >= minTime && Date.parse(impact.event.informationKnownAt) <= maxTime).map((impact) => { const point = points[nearestPointIndex(points, impact.event.informationKnownAt)]; const selected = impact.eventId === selectedId; const selectEvent = () => { onSelect(impact.eventId); onScrub(nearestPointIndex(points, impact.event.informationKnownAt)) }; return <g className={`event-marker ${selected ? 'is-selected' : ''}`} key={impact.eventId} role="button" tabIndex={0} aria-label={`${impact.event.title}, your position ${rank.get(impact.eventId)}`} onClick={selectEvent} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') selectEvent() }}><line x1={x(impact.event.informationKnownAt)} x2={x(impact.event.informationKnownAt)} y1={margin.top} y2={height - margin.bottom} /><circle cx={x(impact.event.informationKnownAt)} cy={y(point.probability)} r={selected ? 9 : 7} /><text x={x(impact.event.informationKnownAt)} y={y(point.probability) + 4} textAnchor="middle">{rank.get(impact.eventId)}</text></g> })}
      <g className="scrub-cursor" aria-hidden="true"><line x1={x(scrubPoint.timestamp)} x2={x(scrubPoint.timestamp)} y1={margin.top} y2={height - margin.bottom} /><circle cx={x(scrubPoint.timestamp)} cy={y(scrubPoint.probability)} r="5" /></g>
    </svg>
    <div className="scrubber"><input aria-label="Explore hourly market probability" type="range" min={visibleStartIndex} max={visibleEndIndex} value={Math.min(Math.max(scrubIndex, visibleStartIndex), visibleEndIndex)} onChange={(event) => onScrub(Number(event.target.value))} /><div className="scrub-readout"><div><span>{formatTime(scrubPoint.timestamp, study.presentation.timezone)}</span><strong>{formatProbability(scrubPoint.probability)} {study.presentation.selectedContractShort}</strong><small className={`mark-badge mark-${scrubPoint.markType ?? 'trade'}`}>{scrubPoint.markType === 'midpoint' ? 'Quote midpoint' : 'Traded mark'}</small></div><div><div className="scrub-context-heading"><strong>{nearbyEvent?.event.title ?? nearbyNote?.title ?? 'No single event assigned'}</strong>{nearbyEvent && <button onClick={() => onSelect(nearbyEvent.eventId)}>Open event</button>}{nearbyNote && !nearbyEvent && <a href={nearbyNote.sourceUrl} target="_blank" rel="noreferrer">Evidence <ExternalLink size={11} /></a>}</div><p>{nearbyEvent?.event.mechanism ?? nearbyNote?.explanation ?? 'This point is treated as ordinary or diffuse repricing rather than forced into a headline explanation.'}</p></div></div></div>
    <details className="accessible-data"><summary>Accessible window table</summary><table><thead><tr><th>Window</th><th>Level</th><th>Usable buckets</th><th>Mark mix</th></tr></thead><tbody>{selectedWindows.map(([name, window]) => <tr key={name}><th>{name}</th><td>{formatProbability(window.level)}</td><td>{window.quality.validBuckets}/{window.quality.expectedBuckets}</td><td>{window.quality.tradedBuckets} trade · {window.quality.quoteBuckets} quote</td></tr>)}</tbody></table></details>
  </div>
}

function MovementCell({ label, value, accent }: { label: string; value: number | null; accent?: boolean }) {
  return <div className={accent ? 'movement-cell is-accent' : 'movement-cell'}><span>{label}</span><strong>{formatProbability(value)}</strong></div>
}

function EvidenceLinks({ sources }: { sources: Source[] }) {
  if (!sources.length) return null
  return <div className="source-stack">{sources.map((source) => <a className="source-link" href={source.url} target="_blank" rel="noreferrer" key={source.id}><span><small>{source.publisher} · published {new Date(source.publishedAt).toLocaleDateString()}</small>{source.title}</span><ExternalLink size={16} /></a>)}</div>
}

function SealedChartPanel({ eventCount }: { eventCount: number }) {
  return <section className="chart-panel pre-reveal-panel" aria-labelledby="sealed-chart-title">
    <div className="sealed-copy"><span className="eyebrow"><LockKeyhole size={12} /> Hindsight firewall active</span><h2 id="sealed-chart-title">Rank first. Inspect the market second.</h2><p>Use the event briefings to order all {eventCount} moments. Your ranking freezes when you reveal the market record.</p></div>
    <div className="sealed-ledger" aria-label="Information hidden until reveal"><div className="sealed-ledger-title"><span>Market record</span><strong><LockKeyhole size={13} /> Sealed</strong></div><div><span>Probability history</span><b>After lock</b></div><div><span>Measured responses</span><b>After lock</b></div><div><span>Resolution &amp; analysis</span><b>After lock</b></div></div>
  </section>
}

function ImpactDetail({ study, impact, revealed, onShareChange }: { study: Study; impact: StudyEventImpact; revealed: boolean; onShareChange: (value: number) => void }) {
  const event = impact.event
  const sourceById = new Map(study.sources.map((source) => [source.id, source]))
  const visibleClaims = event.claims.filter((claim) => revealed || claim.visibility === 'pre-reveal')
  const visibleSourceIds = new Set(visibleClaims.flatMap((claim) => claim.sourceIds))
  const visibleSources = study.sources.filter((source) => visibleSourceIds.has(source.id))
  const directionLabel = event.expectedDirection === 'positive' ? study.presentation.positiveLabel : event.expectedDirection === 'negative' ? study.presentation.negativeLabel : study.presentation.neutralLabel
  const quality = impact.windows.stabilized.quality
  return <aside className="impact-detail" aria-label="Selected event analysis">
    <div className="detail-kicker"><span>{event.category}</span><time dateTime={event.informationKnownAt}>{event.dateLabel}</time></div>
    <h2>{event.title}</h2>
    <p className="evidence-cutoff"><ShieldCheck size={13} /> Known by {formatTime(event.informationKnownAt, study.presentation.timezone)}</p>
    {visibleClaims.map((claim) => <p className="detail-summary" key={claim.id}>{claim.text}</p>)}
    {!visibleClaims.length && <p className="detail-summary evidence-withheld"><LockKeyhole size={12} /> Later reporting is withheld until reveal. Rank from the event identity and the preregistered mechanism below.</p>}
    <div className={`direction-tag direction-${event.expectedDirection}`}>{directionLabel}</div>
    <section className="mechanism"><span>Why it could change the contract</span><p>{event.mechanism}</p></section>
    {!revealed ? <><div className="market-hidden"><LockKeyhole size={17} /><div><strong>Market response hidden</strong><p>Rank from the time-safe evidence. The graph, resolution, retrospective sources, and calculated response appear only after you lock your order.</p></div></div><EvidenceLinks sources={visibleSources} /></> : <>
      <div className="movement-flow"><MovementCell label="Reference" value={impact.windows.reference.level} /><ArrowRight size={16} /><MovementCell label="Immediate" value={impact.windows.immediate.level} /><ArrowRight size={16} /><MovementCell label="Stabilized" value={impact.windows.stabilized.level} accent /></div>
      <div className="observed-impact"><div><span>Short-term response</span><small>Stabilized minus reference median</small></div><strong className={(impact.shortTermResponse ?? 0) >= 0 ? 'positive' : 'negative'}>{formatImpact(impact.shortTermResponse)}</strong></div>
      <div className="follow-through"><div><span>Delayed increment</span><small>Delayed minus stabilized—not cumulative</small></div><div><strong>{formatProbability(impact.windows.delayed.level)}</strong><b className={(impact.delayedIncrement ?? 0) >= 0 ? 'positive' : 'negative'}>{formatImpact(impact.delayedIncrement)}</b></div></div>
      <div className="response-grid"><div><span>Anticipation drift</span><strong>{formatImpact(impact.anticipationMove)}</strong></div><div><span>Log-odds change</span><strong>{impact.logOddsResponse === null ? 'Indeterminate' : `${impact.logOddsResponse >= 0 ? '+' : ''}${impact.logOddsResponse.toFixed(3)}`}</strong></div><div><span>Ordinary-movement check</span><strong>{impact.ordinaryMovement.classification}</strong><small>{impact.ordinaryMovement.threshold === null ? 'No baseline' : `${formatImpact(impact.ordinaryMovement.threshold)} 90th percentile · ${impact.ordinaryMovement.sampleCount} anchors`}</small></div></div>
      <div className="attribution-control"><div className="attribution-heading"><label htmlFor="attribution-share">What if this event explains this share?</label><strong>{impact.sensitivityShare}%</strong></div><input id="attribution-share" type="range" min="0" max="100" step="5" value={impact.sensitivityShare} onChange={(event) => onShareChange(Number(event.target.value))} /><div className="range-labels"><span>None</span><span>All of the move</span></div></div>
      <div className="counterfactual-box"><span>Hypothetical attributable effect</span><strong className={(impact.attributedImpact ?? 0) >= 0 ? 'positive' : 'negative'}>{formatImpact(impact.attributedImpact)}</strong><p>This is a sensitivity exercise, not an expert estimate. The hypothetical no-event level is <b>{formatProbability(impact.counterfactualProbability)}</b>.</p></div>
      <div className="confidence-row"><span className={`confidence-dot confidence-${quality.status === 'usable' ? 'high' : 'low'}`} /><div><strong>{quality.status === 'usable' ? 'Window passes data checks' : 'Insufficient market data'}</strong><small>{quality.validBuckets}/{quality.expectedBuckets} usable · {quality.tradedBuckets} traded · {quality.quoteBuckets} quote · median spread {quality.medianSpread === null ? 'not available' : formatImpact(quality.medianSpread)}</small></div></div>
      {impact.overlaps.length > 0 && <div className="overlap-warning"><Info size={15} /><span>Measurement windows overlap {impact.overlaps.map((id) => study.events.find((candidate) => candidate.id === id)?.shortTitle ?? id).join(', ')}.</span></div>}
      <details className="analysis-notes" open><summary>After reveal <ChevronDown size={16} /></summary><p>{event.retrospectiveInterpretation}</p><strong>Competing explanation</strong><p>{event.competingExplanation}</p><strong>Editorial attribution</strong><p>{event.attributionAssessment}</p></details>
      <EvidenceLinks sources={visibleSources} />
    </>}
    <p className="causality-note"><Info size={14} />Market-implied response, not proven real-world causality.</p>
  </aside>
}

function RankingBoard({ study, impacts, order, selectedId, revealed, onMove, onSelect, onReveal, onReset }: { study: Study; impacts: StudyEventImpact[]; order: string[]; selectedId: string; revealed: boolean; onMove: (id: string, index: number) => void; onSelect: (id: string) => void; onReveal: () => void; onReset: () => void }) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [positionPickerId, setPositionPickerId] = useState<string | null>(null)
  const byId = new Map(impacts.map((impact) => [impact.eventId, impact]))
  const tieGroups = createTieGroups(impacts, study.measurementProfile.tieThreshold)
  const marketGroup = new Map(tieGroups.flatMap((group, index) => group.map((id) => [id, index + 1] as const)))
  const agreement = pairwiseAgreement(order, tieGroups)
  const drop = (event: DragEvent, index: number) => { event.preventDefault(); if (!revealed && draggedId) onMove(draggedId, index); setDraggedId(null) }

  return <section className="ranking-section" aria-labelledby="ranking-title">
    <div className="section-heading"><div><span className="eyebrow">Your signed forecast</span><h2 id="ranking-title">Most positive to most negative</h2></div><div className="ranking-actions">{revealed && <span className="ranking-score"><b>{agreement.agreed}/{agreement.comparable}</b> comparable pairs agree</span>}<button className="reset-button" onClick={onReset} title="Start a fresh attempt" aria-label="Start a fresh attempt"><RotateCcw size={16} /></button>{!revealed && <button className="reveal-button" onClick={onReveal}><LockKeyhole size={16} /> Lock & reveal market</button>}</div></div>
    <p className="ranking-instruction">Drag a card or click its numbered box to place it. Top means the event helped the selected outcome most; bottom means it hurt most. The order freezes when you reveal.</p>
    <div className="ranking-workspace"><div className="spectrum-axis" aria-hidden="true"><span>Most positive</span><i /><span>Neutral</span><i /><span>Most negative</span></div><div className="ranking-list">{order.map((id, index) => {
      const impact = byId.get(id)!
      const event = impact.event
      const ratio = order.length === 1 ? 0.5 : index / (order.length - 1)
      const band = ratio < 0.4 ? 'rank-positive' : ratio > 0.6 ? 'rank-negative' : 'rank-neutral'
      const directionLabel = event.expectedDirection === 'positive' ? study.presentation.positiveLabel : event.expectedDirection === 'negative' ? study.presentation.negativeLabel : study.presentation.neutralLabel
      return <article className={`ranking-row ${band} ${id === selectedId ? 'is-selected' : ''} ${id === draggedId ? 'is-dragging' : ''} ${revealed ? 'is-locked' : ''}`} key={id} draggable={!revealed} onDragStart={() => { if (!revealed) { setDraggedId(id); setPositionPickerId(null) } }} onDragEnd={() => setDraggedId(null)} onDragOver={(event) => { if (!revealed) event.preventDefault() }} onDrop={(event) => drop(event, index)}>
        <button className="ranking-number" disabled={revealed} aria-label={`Choose a position for ${event.shortTitle}`} aria-expanded={positionPickerId === id} onClick={() => setPositionPickerId((current) => current === id ? null : id)} onKeyDown={(keyEvent) => { if (revealed) return; if (keyEvent.key === 'ArrowUp') { keyEvent.preventDefault(); onMove(id, index - 1) } if (keyEvent.key === 'ArrowDown') { keyEvent.preventDefault(); onMove(id, index + 1) } }}>{index + 1}</button><GripVertical className="drag-handle" size={19} aria-hidden="true" />
        <button className="ranking-title" onClick={() => onSelect(id)}><small>{event.dateLabel} · {event.category}</small><strong>{event.shortTitle}</strong><span>{event.mechanism}</span></button>
        <span className={`direction-tag direction-${event.expectedDirection}`}>{directionLabel}</span>
        {revealed ? <div className="market-rank"><small>{impact.shortTermResponse === null ? 'Indeterminate' : `Market group ${marketGroup.get(id)}`}</small><strong className={(impact.shortTermResponse ?? 0) >= 0 ? 'positive' : 'negative'}>{formatImpact(impact.shortTermResponse)}</strong><span>Delayed {formatImpact(impact.delayedIncrement)}</span></div> : <span className="impact-sealed"><LockKeyhole size={11} /> Hidden</span>}
        {positionPickerId === id && !revealed && <div className="position-picker" role="group" aria-label={`Place ${event.shortTitle}`}><div><strong>Choose a position</strong><span>Most positive <i /> Most negative</span></div><div>{order.map((_, destinationIndex) => <button className={destinationIndex === index ? 'is-current' : ''} key={destinationIndex} onClick={() => { onMove(id, destinationIndex); setPositionPickerId(null) }}>{destinationIndex + 1}</button>)}</div></div>}
      </article>
    })}</div></div>
  </section>
}

function MethodDrawer({ study, onClose }: { study: Study; onClose: () => void }) {
  const profile = study.measurementProfile
  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="method-drawer" role="dialog" aria-modal="true" aria-labelledby="method-title" onMouseDown={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Close methodology"><X size={20} /></button><span className="eyebrow">Methodology · {profile.label}</span><h2 id="method-title">Separate judgment from measurable movement</h2><ol><li><strong>Time-safe evidence first</strong><p>Before submission, every visible claim must have been known by the event cutoff. Later analysis and the resolved outcome stay sealed.</p></li><li><strong>One study-wide profile</strong><p>Reference {profile.reference.startHours}h to event; immediate 0–{profile.immediate.endHours}h; stabilized {profile.stabilized.startHours}–{profile.stabilized.endHours}h; delayed {profile.delayed.startHours}–{profile.delayed.endHours}h.</p></li><li><strong>Fresh marks only</strong><p>A trade close is preferred. A quote midpoint is used only with both sides and a spread within the declared threshold. Carried marks are not calculation samples.</p></li><li><strong>Ties and insufficiency are real results</strong><p>Responses within {formatImpact(profile.tieThreshold)} form a tie group. Failed windows show “indeterminate” instead of a forced rank.</p></li><li><strong>Attribution is hypothetical</strong><p>The sensitivity slider starts at zero and applies a chosen share in log odds. It is not an expert attribution estimate.</p></li></ol><div className="method-warning"><Info size={17} /><p>Overlapping news, anticipation, liquidity, and participant behavior limit causal interpretation. Event impacts must not be added together.</p></div><a className="source-link" href={study.dataset.provenanceUrl} target="_blank" rel="noreferrer"><span><small>Dataset provenance</small>{study.dataset.id} · {study.dataset.normalizedSha256.slice(0, 12)}…</span><ExternalLink size={16} /></a></aside></div>
}

function StudyPage({ registration, points }: { registration: StudyRegistration; points: MarketSeriesPoint[] }) {
  const study = registration.study
  const initialOrder = useMemo(() => study.events.map((event) => event.id), [study])
  const [order, setOrder] = useState(initialOrder)
  const [selectedId, setSelectedId] = useState(initialOrder[0])
  const [scrubIndex, setScrubIndex] = useState(() => nearestPointIndex(points, study.events[0].informationKnownAt))
  const [shares, setShares] = useState<Record<string, number>>({})
  const [revealed, setRevealed] = useState(false)
  const [submittedAt, setSubmittedAt] = useState<string | null>(null)
  const [showMethod, setShowMethod] = useState(false)
  const impacts = useMemo(() => calculateStudyImpacts(points, study.events, study.measurementProfile, shares), [points, shares, study])
  const summary = useMemo(() => summarizeCampaign(points), [points])
  const selected = impacts.find((impact) => impact.eventId === selectedId) ?? impacts[0]
  const reset = () => { setOrder(initialOrder); setSelectedId(initialOrder[0]); setShares({}); setRevealed(false); setSubmittedAt(null); setScrubIndex(nearestPointIndex(points, study.events[0].informationKnownAt)) }

  return <div className={`study-page study-${study.slug}`} style={{ '--topic-accent': study.presentation.accent } as React.CSSProperties}>
    <section className="study-header"><div className="study-title"><span className="event-kicker">{study.presentation.topicLabel}{study.status !== 'published' ? ' · Editorial review draft' : ''}</span><h1>{study.question}</h1><p>{study.orientation}</p>{!study.dataset.fullMarketLifetime && <span className="coverage-warning"><Info size={13} /> Archived market interval: {formatDate(study.dataset.coverageStart, study.presentation.timezone)}–{formatDate(study.dataset.coverageEnd, study.presentation.timezone)}</span>}</div><div className="header-side"><div className="study-steps" aria-label="Study workflow"><span className="is-current"><b>01</b> Rank the events</span><i /><span className={revealed ? 'is-current' : ''}><b>02</b> Lock your order</span><i /><span className={revealed ? 'is-current' : ''}><b>03</b> Explore the market</span></div><div className="header-actions"><button className="method-button" onClick={() => setShowMethod(true)}><BookOpen size={16} /> Methodology</button>{revealed && <a className="market-button" href={study.market.marketUrl} target="_blank" rel="noreferrer">Original market <ExternalLink size={15} /></a>}</div></div></section>
    <section className="summary-strip" aria-label="Market summary"><div><CalendarDays size={16} /><span>Study interval<strong>{formatDate(study.dataset.coverageStart, study.presentation.timezone)}–{formatDate(study.dataset.coverageEnd, study.presentation.timezone)}</strong></span></div><div><Database size={16} /><span>Observations<strong>{summary.observations.toLocaleString()} hourly marks</strong></span></div><div><GripVertical size={16} /><span>Events to order<strong>{impacts.length} {study.presentation.eventNoun}s</strong></span></div>{revealed ? <><div><BarChart3 size={16} /><span>Market range<strong>{formatProbability(summary.lowProbability)}–{formatProbability(summary.highProbability)}</strong></span></div><div className="resolution-stat"><span>Resolved<strong>{study.contract.resolution}</strong></span><small>{formatVolume(study.market.volume)}</small></div></> : <div className="resolution-stat sealed-stat"><LockKeyhole size={15} /><span>Outcome & graph<strong>Sealed until ranking</strong></span></div>}</section>
    <div className="study-grid"><div className="study-main">{revealed ? <section className="chart-panel" aria-labelledby="chart-title"><div className="panel-heading"><div><span className="eyebrow">Your ranking is locked · now inspect the record</span><h2 id="chart-title">{study.presentation.seriesLabel}</h2></div><div className="chart-legend"><span><i />Traded / normalized line</span><span><b />Ranked event</span><span><em />Quote midpoint</span></div></div><MarketChart study={study} points={points} impacts={impacts} order={order} selectedId={selectedId} scrubIndex={scrubIndex} onScrub={setScrubIndex} onSelect={setSelectedId} /><div className="chart-caption"><span>Opened at <strong>{formatProbability(summary.firstProbability)}</strong></span><span>Snapshot endpoint <strong>{formatProbability(summary.finalProbability)}</strong></span><span>Net movement <strong className={summary.netMovement >= 0 ? 'positive' : 'negative'}>{formatImpact(summary.netMovement)}</strong></span></div>{submittedAt && <p className="locked-at"><LockKeyhole size={12} /> Ranking locked {formatTime(submittedAt, study.presentation.timezone)}</p>}</section> : <SealedChartPanel eventCount={impacts.length} />}<RankingBoard study={study} impacts={impacts} order={order} selectedId={selectedId} revealed={revealed} onMove={(id, index) => { if (!revealed) setOrder((current) => moveRankedItem(current, id, index)) }} onSelect={setSelectedId} onReveal={() => { setSubmittedAt(new Date().toISOString()); setRevealed(true) }} onReset={reset} /></div><ImpactDetail study={study} impact={selected} revealed={revealed} onShareChange={(value) => setShares((current) => ({ ...current, [selected.eventId]: value }))} /></div>
    {showMethod && <MethodDrawer study={study} onClose={() => setShowMethod(false)} />}
  </div>
}

export default function App() {
  const isIndex = window.location.pathname === '/studies' || window.location.pathname === '/studies/'
  const isDaily = window.location.pathname === '/'
  const [dailyResolution] = useState(() => isDaily ? resolveDailyPuzzle(dailyPuzzles, new Date(), new URLSearchParams(window.location.search).get('daily')) : null)
  const [registration] = useState(() => dailyResolution?.kind === 'puzzle' ? studyById(dailyResolution.puzzle.studyId) ?? studyFromLocation() : studyFromLocation())
  const [points, setPoints] = useState<MarketSeriesPoint[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (isIndex || (isDaily && dailyResolution?.kind !== 'puzzle')) return
    try { assertValidStudy(registration.study) } catch (caught) { setError(caught instanceof Error ? caught.message : 'The study manifest is invalid.'); return }
    registration.loadSeries().then(setPoints).catch((caught) => setError(caught instanceof Error ? caught.message : 'The dataset could not be read.'))
  }, [dailyResolution, isDaily, isIndex, registration])
  if (isDaily) {
    if (dailyResolution?.kind !== 'puzzle') return <DailyUnavailable resolution={dailyResolution!} />
    return error ? <AppFrame><ErrorView message={error} /></AppFrame> : points ? <DailyGame registration={registration} points={points} puzzle={dailyResolution.puzzle} playMode={dailyResolution.playMode} nextPuzzle={dailyResolution.nextPuzzle} puzzles={dailyPuzzles} /> : <AppFrame><LoadingView study={registration.study} /></AppFrame>
  }
  return <AppFrame>{isIndex ? <StudiesIndex /> : error ? <ErrorView message={error} /> : points ? <StudyPage registration={registration} points={points} /> : <LoadingView study={registration.study} />}</AppFrame>
}
