import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowRight, ArrowUp, BarChart3, BookOpen, Check, ChevronDown, Clock3, Copy, ExternalLink, Flame, GripVertical, HelpCircle, LockKeyhole, Share2, Trophy, X } from 'lucide-react'
import type { StudyRegistration } from './data/studies.ts'
import { calculateStudyImpacts, createTieGroups, moveRankedItem, type MarketSeriesPoint, type StudyEventImpact } from './domain/eventStudy.ts'
import { completedScoreBands, currentDailyPuzzle, getPreRevealCard, performShare, puzzleWindowEnd, scoreDailyOrder, type DailyPuzzle, type DailyResolution, type PreRevealCard } from './domain/dailyGame.ts'
import { collectDailyStats, dailyAttemptKey, readDailyAttempt, saveDailyDraft, submitDailyAttempt, type DailySubmission, type StorageLike } from './domain/dailyStorage.ts'
import type { Study } from './domain/study.ts'

const formatImpact = (value: number | null) => {
  if (value === null) return 'Indeterminate'
  const roundedPoints = Math.round(Math.abs(value) * 1000 + 1e-9) / 10
  return `${value >= 0 ? '+' : '−'}${roundedPoints.toFixed(1)} percentage points`
}

const formatProbability = (value: number | null) => value === null ? 'Unavailable' : `${(value * 100).toFixed(1)}%`

const formatThreshold = (value: number) => `${(value * 100).toFixed(value * 100 % 1 === 0 ? 0 : 1)} percentage point${value * 100 === 1 ? '' : 's'}`
const formatRelease = (puzzle: DailyPuzzle) => new Date(puzzle.releaseTime).toLocaleString(undefined, { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })
const browserStorage = (): StorageLike | null => { try { return window.localStorage } catch { return null } }

function releaseCountdown(target: Date, now: Date) {
  const totalMinutes = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 60_000))
  return `${Math.floor(totalMinutes / 60)}h ${(totalMinutes % 60).toString().padStart(2, '0')}m`
}

async function copyText(value: string) {
  try {
    if (!window.navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable')
    await window.navigator.clipboard.writeText(value)
    return true
  } catch {
    try {
      const field = document.createElement('textarea')
      field.value = value
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      const copied = document.execCommand('copy')
      field.remove()
      return copied
    } catch {
      return false
    }
  }
}

function Modal({ title, children, returnFocus, onClose }: { title: string; children: ReactNode; returnFocus: HTMLElement | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const previousFocus = returnFocus ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
    const background = document.querySelector<HTMLElement>('[data-daily-background]')
    const previousAriaHidden = background ? background.getAttribute('aria-hidden') : null
    const previousInert = background?.hasAttribute('inert') ?? false
    if (background) { background.setAttribute('inert', ''); background.setAttribute('aria-hidden', 'true') }
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onCloseRef.current(); return }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hidden && element.getClientRects().length > 0)
      if (!focusable.length) { event.preventDefault(); dialogRef.current.focus(); return }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (background) {
        if (!previousInert) background.removeAttribute('inert')
        if (previousAriaHidden === null) background.removeAttribute('aria-hidden')
        else background.setAttribute('aria-hidden', previousAriaHidden)
      }
      window.setTimeout(() => previousFocus?.focus(), 0)
    }
  }, [])

  return <div className="daily-modal-backdrop" onMouseDown={onClose}><section className="daily-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="daily-modal-title" tabIndex={-1} onMouseDown={(event) => event.stopPropagation()}><button ref={closeRef} className="daily-icon-button daily-modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button><h2 id="daily-modal-title">{title}</h2>{children}</section></div>
}

function Stats({ puzzles, returnFocus, onClose }: { puzzles: readonly DailyPuzzle[]; returnFocus: HTMLElement | null; onClose: () => void }) {
  const stats = collectDailyStats(browserStorage(), puzzles, new Date())
  return <Modal title="Your daily stats" returnFocus={returnFocus} onClose={onClose}><div className="daily-stats-grid"><div><Trophy size={20} /><strong>{stats.played}</strong><span>Played</span></div><div><BarChart3 size={20} /><strong>{stats.averageScore ?? '—'}</strong><span>Average score</span></div><div><Flame size={20} /><strong>{stats.currentStreak}</strong><span>Current streak</span></div></div><p className="daily-modal-note">Only on-time daily completions count. Archive plays never extend a streak. {stats.persistenceAvailable ? 'Results are saved on this device.' : 'Storage is unavailable in this browser.'}</p></Modal>
}

function Help({ puzzle, study, returnFocus, onClose }: { puzzle: DailyPuzzle; study: Study; returnFocus: HTMLElement | null; onClose: () => void }) {
  return <Modal title="How to play" returnFocus={returnFocus} onClose={onClose}><ol className="daily-rules"><li><span>1</span><p><strong>Read the five headlines.</strong> Open Brief &amp; sources for more context and the original reporting or statement.</p></li><li><span>2</span><p><strong>Rank the market reaction.</strong> Drag from anywhere on a card, or use its arrow buttons. Top: {study.presentation.positiveLabel}. Bottom: {study.presentation.negativeLabel}. Rank the largest shifts toward each end.</p></li><li><span>3</span><p><strong>Reveal once.</strong> Your score is the share of comparable pairs that match the market order. Responses within {formatThreshold(puzzle.scoring.tieThreshold)} of the strongest response in a group are tied.</p></li></ol><p className="daily-modal-note">This is a historical market puzzle. Measured movements are associations, not proof that a headline caused a price change.</p></Modal>
}

function Topbar({ puzzle, onHelp, onStats }: { puzzle: DailyPuzzle; onHelp: (trigger: HTMLElement) => void; onStats: (trigger: HTMLElement) => void }) {
  return <header className="daily-topbar"><a className="daily-brand" href="/"><span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span><span>NexusPoint</span></a><div className="daily-number">Daily <b>#{String(puzzle.number).padStart(3, '0')}</b></div><nav aria-label="Daily game"><button aria-label="Help" onClick={(event) => onHelp(event.currentTarget)}><HelpCircle size={17} /> <span>Help</span></button><button aria-label="Stats" onClick={(event) => onStats(event.currentTarget)}><BarChart3 size={17} /> <span>Stats</span></button></nav></header>
}

type DragPosition = { id: string; clientY: number; left: number; offsetY: number; width: number; height: number }

function DragPreview({ card, index, position }: { card: PreRevealCard; index: number; position: DragPosition }) {
  const top = Math.max(8, Math.min(position.clientY - position.offsetY, window.innerHeight - position.height - 8))
  return <div className="daily-card daily-drag-preview" style={{ transform: `translate3d(${position.left}px, ${top}px, 0) scale(1.008)`, width: position.width }} aria-hidden="true">
    <div className="daily-card-rank">{index + 1}</div>
    <div className="daily-card-copy"><div className="daily-card-meta"><time>{card.event.dateLabel}</time><span>{card.event.category}</span></div><h3>{card.event.title}</h3><div className="daily-preview-detail">Brief &amp; sources <ChevronDown size={14} /></div></div>
    <div className="daily-move-controls daily-preview-controls"><span><ArrowUp size={19} /></span><span className="daily-preview-grip"><GripVertical size={20} /></span><span><ArrowDown size={19} /></span></div>
  </div>
}

function Card({ card, index, total, isDragging, onMove, onDragStart }: {
  card: PreRevealCard; index: number; total: number;
  isDragging: boolean; onMove: (id: string, index: number) => void;
  onDragStart: (id: string, pointerEvent: ReactPointerEvent<HTMLElement>) => void
}) {
  const cardRef = useRef<HTMLElement>(null)
  const previousTop = useRef<number | null>(null)
  const movementAnimation = useRef<Animation | null>(null)
  const focusAfterMove = useRef<'up' | 'down' | null>(null)
  const upRef = useRef<HTMLButtonElement>(null)
  const downRef = useRef<HTMLButtonElement>(null)
  const { event } = card
  useLayoutEffect(() => {
    const element = cardRef.current
    if (!element) return
    movementAnimation.current?.cancel()
    const nextTop = element.getBoundingClientRect().top
    if (!isDragging && previousTop.current !== null && Math.abs(previousTop.current - nextTop) > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      movementAnimation.current = element.animate([{ transform: `translateY(${previousTop.current - nextTop}px)` }, { transform: 'translateY(0)' }], { duration: 180, easing: 'cubic-bezier(.2,.8,.2,1)' })
    }
    previousTop.current = nextTop
  }, [index, isDragging])
  useEffect(() => {
    if (focusAfterMove.current === 'up') upRef.current?.focus()
    if (focusAfterMove.current === 'down') downRef.current?.focus()
    focusAfterMove.current = null
  }, [index])
  const moveAndRestoreFocus = (destination: number, control: 'up' | 'down') => {
    focusAfterMove.current = control
    onMove(event.id, destination)
  }
  return <article ref={cardRef} className={`daily-card ${isDragging ? 'is-drag-placeholder' : ''}`} data-daily-id={event.id} onPointerDown={(pointerEvent) => {
    if (!pointerEvent.isPrimary || pointerEvent.button !== 0) return
    const target = pointerEvent.target as HTMLElement
    if (target.closest('a, summary, button:not(.daily-drag-handle)')) return
    pointerEvent.preventDefault()
    onDragStart(event.id, pointerEvent)
  }}>
    <div className="daily-card-rank" aria-hidden="true">{index + 1}</div>
    <div className="daily-card-copy"><div className="daily-card-meta"><time dateTime={event.occurredAt}>{event.dateLabel}</time><span>{event.category}</span></div><h3>{event.title}</h3><details className="daily-card-details"><summary>Brief &amp; sources <ChevronDown size={14} /></summary><p>{card.brief}</p><div>{card.sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" onClick={(clickEvent) => clickEvent.stopPropagation()}>{source.publisher} <ExternalLink size={13} /></a>)}</div></details></div>
    <div className="daily-move-controls" aria-label={`Move ${event.shortTitle}`}><button ref={upRef} data-move-control="up" onClick={() => moveAndRestoreFocus(index - 1, 'up')} disabled={index === 0} aria-label={`Move ${event.shortTitle} up`}><ArrowUp size={19} /></button><button className="daily-drag-handle" aria-label={`Drag ${event.shortTitle}`} aria-pressed={isDragging}><GripVertical size={20} /></button><button ref={downRef} data-move-control="down" onClick={() => moveAndRestoreFocus(index + 1, 'down')} disabled={index === total - 1} aria-label={`Move ${event.shortTitle} down`}><ArrowDown size={19} /></button></div>
  </article>
}

function Footer({ puzzle, nextPuzzle, puzzles, now, submitted }: { puzzle: DailyPuzzle; nextPuzzle: DailyPuzzle | null; puzzles: readonly DailyPuzzle[]; now: Date; submitted: boolean }) {
  const active = currentDailyPuzzle(puzzles, now)
  if (active && active.id !== puzzle.id) return <footer className="daily-footer"><Clock3 size={17} /><div><strong>A newer daily puzzle is available.</strong><a href={`/?daily=${active.id}`}>{submitted ? 'Open today’s puzzle' : 'Finish this archive, or open today’s puzzle'}</a></div></footer>
  if (nextPuzzle && Date.parse(nextPuzzle.releaseTime) > now.getTime()) return <footer className="daily-footer"><Clock3 size={17} /><div><strong>Next puzzle in {releaseCountdown(new Date(nextPuzzle.releaseTime), now)}</strong><span>{formatRelease(nextPuzzle)} in your time zone · releases at 05:00 UTC</span></div></footer>
  const puzzleIndex = puzzles.findIndex((candidate) => candidate.id === puzzle.id)
  const windowEnded = puzzleIndex >= 0 && now.getTime() >= puzzleWindowEnd(puzzles, puzzleIndex)
  return <footer className="daily-footer"><Clock3 size={17} /><div><strong>{windowEnded ? 'This daily window has ended.' : 'No next puzzle is scheduled yet.'}</strong><span>{windowEnded && !submitted ? 'Your unfinished order remains available as archive play. ' : ''}The next release will appear only after an editor schedules it.</span></div></footer>
}

function ReactionChart({ impacts }: { impacts: StudyEventImpact[] }) {
  const ordered = [...impacts].sort((left, right) => (right.shortTermResponse ?? Number.NEGATIVE_INFINITY) - (left.shortTermResponse ?? Number.NEGATIVE_INFINITY))
  const maximum = Math.max(...ordered.map((impact) => Math.abs(impact.shortTermResponse ?? 0)), 0.01)
  return <section className="daily-reaction" aria-labelledby="reaction-chart-title">
    <div className="daily-section-title"><span>What “percentage points” means</span><h2 id="reaction-chart-title">How the market-implied probability changed</h2></div>
    <p className="daily-reaction-intro">This is not your game score. A move from 47% to 50% is a rise of <strong>3 percentage points</strong>. Each bar compares the pre-headline reference median with the stabilized median 18–36 hours later.</p>
    <div className="daily-reaction-axis" aria-hidden="true"><span>Odds fell</span><span>No change</span><span>Odds rose</span></div>
    <div className="daily-reaction-rows">
      {ordered.map((impact) => {
        const value = impact.shortTermResponse
        const width = value === null ? 0 : Math.max(Math.abs(value) / maximum * 48, 1)
        return <div className="daily-reaction-row" key={impact.eventId}>
          <div className="daily-reaction-label"><strong>{impact.event.shortTitle}</strong><small>{formatProbability(impact.windows.reference.level)} → {formatProbability(impact.windows.stabilized.level)}</small></div>
          <div className="daily-reaction-track" role="img" aria-label={`${impact.event.shortTitle}: ${value === null ? 'indeterminate' : formatImpact(value)}, from ${formatProbability(impact.windows.reference.level)} to ${formatProbability(impact.windows.stabilized.level)}`}>
            <i />
            {value !== null && <span className={value >= 0 ? 'is-positive' : 'is-negative'} style={{ width: `${width}%`, [value >= 0 ? 'left' : 'right']: '50%' }} />}
          </div>
          <b className={value === null ? '' : value >= 0 ? 'positive' : 'negative'}>{formatImpact(value)}</b>
        </div>
      })}
    </div>
  </section>
}

function Result({ study, puzzle, puzzles, nextPuzzle, impacts, submission, now, onHelp, onStats }: {
  study: Study; puzzle: DailyPuzzle; puzzles: readonly DailyPuzzle[]; nextPuzzle: DailyPuzzle | null; impacts: StudyEventImpact[]; submission: DailySubmission; now: Date; onHelp: (trigger: HTMLElement) => void; onStats: (trigger: HTMLElement) => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [shareFeedback, setShareFeedback] = useState('')
  const tieGroups = createTieGroups(impacts, puzzle.scoring.tieThreshold)
  const marketGroup = new Map(tieGroups.flatMap((group, index) => group.map((id) => [id, index + 1] as const)))
  const byId = new Map(impacts.map((impact) => [impact.eventId, impact]))
  const usable = impacts.filter((impact) => impact.shortTermResponse !== null)
  const strongest = [...usable].sort((left, right) => Math.abs(right.shortTermResponse!) - Math.abs(left.shortTermResponse!))[0]
  const conclusionSource = study.conclusion ? study.sources.find((source) => source.id === study.conclusion!.sourceId) : undefined
  const score = submission.score
  const reaction = score === null ? 'No score this time' : score >= 90 ? 'Market mind reader' : score >= 70 ? 'Sharp read' : score >= 50 ? 'A mixed market signal' : 'The market surprised you'
  const filled = completedScoreBands(score)
  const tiles = `${'🟩'.repeat(filled)}${'⬜'.repeat(5 - filled)}`
  const shareUrl = `${window.location.origin}/?daily=${encodeURIComponent(puzzle.id)}`
  const shareText = `NexusPoint Daily #${puzzle.number}\n${score === null ? 'Unscored' : `${score}/100`}\n${tiles}\nCompleted 20-point bands: ${filled}/5\n${shareUrl}`
  const indeterminateCount = impacts.length - usable.length
  const scoreExplanation = submission.comparable === 0
    ? indeterminateCount === 0
      ? 'Every event fell into one tie group, so no comparable pairs remained and no score was calculated.'
      : `${indeterminateCount} event${indeterminateCount === 1 ? ' was' : 's were'} indeterminate and every remaining pair was tied, so no score was calculated.`
    : `${submission.agreed} of ${submission.comparable} comparable event pairs match the market’s order.${indeterminateCount ? ` ${indeterminateCount} indeterminate event${indeterminateCount === 1 ? ' was' : 's were'} excluded.` : ''}`

  useEffect(() => { headingRef.current?.focus() }, [])
  const copy = async () => setShareFeedback(await copyText(shareText) ? 'Result copied' : 'Copy is unavailable in this browser')
  const share = async () => {
    const nativeShare = typeof window.navigator.share === 'function' ? window.navigator.share.bind(window.navigator) : undefined
    const outcome = await performShare({ payload: { title: `NexusPoint Daily #${puzzle.number}`, text: shareText }, nativeShare, copy: () => copyText(shareText) })
    setShareFeedback(outcome === 'shared' ? 'Share sheet opened' : outcome === 'canceled' ? 'Sharing canceled' : outcome === 'unsupported-copied' ? 'Sharing is not supported here, so the result was copied' : outcome === 'copied' ? 'Sharing failed, so the result was copied' : 'Sharing and copy are unavailable in this browser')
  }
  const marketRows = [...tieGroups.flatMap((group, groupIndex) => group.map((id) => ({ id, group: groupIndex + 1, tied: group.length > 1 }))), ...impacts.filter((impact) => impact.shortTermResponse === null).map((impact) => ({ id: impact.eventId, group: null, tied: false }))]

  return <main className="daily-result" id="daily-result"><header className="daily-result-hero"><span className="daily-result-kicker"><Check size={15} /> {submission.playMode === 'daily' ? 'Daily complete' : 'Archive complete'}</span><h1 ref={headingRef} tabIndex={-1}>{score === null ? '—' : score}<small>{score === null ? '' : '/100'}</small></h1><h2>{reaction}</h2><p>{scoreExplanation}</p>{submission.playMode === 'archive' && <p className="daily-archive-note">Archive results are saved separately from your current daily streak.</p>}<div className="daily-result-actions"><button className="daily-primary-button" onClick={share}><Share2 size={18} /> Share result</button><button className="daily-secondary-button" onClick={copy}><Copy size={18} /> Copy</button></div><div className="daily-share-preview" aria-label={`${filled} of 5 complete score bands`}><span>{tiles}</span><small>Each filled tile marks one complete 20-point band. The exact score is shared separately; answers are not.</small></div><p className="daily-share-feedback" role="status">{shareFeedback}</p></header>
    <section className="daily-comparison" aria-labelledby="comparison-title"><div className="daily-section-title"><span>The reveal</span><h2 id="comparison-title">Your order, meet the market.</h2></div><div className="daily-order-columns"><div><h3>Your order</h3><ol>{submission.order.map((id, index) => <li key={id}><b>{index + 1}</b><span>{byId.get(id)?.event.shortTitle ?? id}</span><small>Market {marketGroup.has(id) ? `#${marketGroup.get(id)}` : 'indeterminate'}</small></li>)}</ol></div><div><h3>Market order</h3><ol>{marketRows.map(({ id, group, tied }) => { const impact = byId.get(id)!; return <li key={id}><b>{group ?? '—'}</b><span>{impact.event.shortTitle}</span>{impact.shortTermResponse === null ? <small>Indeterminate</small> : tied ? <small>Tie · {formatImpact(impact.shortTermResponse)}</small> : <strong className={impact.shortTermResponse >= 0 ? 'positive' : 'negative'}>{formatImpact(impact.shortTermResponse)}</strong>}</li> })}</ol></div></div></section>
    <ReactionChart impacts={impacts} />
    {strongest && <section className="daily-takeaway"><span>One thing to know</span><h2>{strongest.event.shortTitle} had the largest measured move.</h2><p>The market moved <strong>{formatImpact(strongest.shortTermResponse)}</strong> between the pre-event reference window and the stabilized {study.measurementProfile.stabilized.startHours}–{study.measurementProfile.stabilized.endHours} hour window. {strongest.event.retrospectiveInterpretation}</p></section>}
    {study.conclusion && conclusionSource && <section className="daily-takeaway"><span>How it ended</span><h2>{study.conclusion.title}</h2><p>{study.conclusion.text}</p><a href={conclusionSource.url} target="_blank" rel="noreferrer">Read the original announcement <ExternalLink size={13} /></a></section>}
    <details className="daily-explainer"><summary>Why this order?<ChevronDown size={18} /></summary><div><p>Your score is the percentage of comparable event pairs that you placed in the same order as the market. Starting with the strongest remaining response, events within {formatThreshold(puzzle.scoring.tieThreshold)} of that group’s anchor are tied. The next group starts with the first response outside that range, so a chain of nearby values cannot merge endpoints farther apart than the threshold. Tied pairs and indeterminate events are excluded and disclosed above.</p>{marketRows.map(({ id }) => { const impact = byId.get(id)!; const sourceIds = new Set(impact.event.claims.flatMap((claim) => claim.sourceIds)); const sources = study.sources.filter((source) => sourceIds.has(source.id)); return <article key={id}><div><strong>{impact.event.shortTitle}</strong><span>{formatImpact(impact.shortTermResponse)}</span></div><p>{impact.event.retrospectiveInterpretation}</p>{sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.publisher} source <ExternalLink size={13} /></a>)}</article> })}<div className="daily-explore-links"><button onClick={(event) => onHelp(event.currentTarget)}><HelpCircle size={17} /> Scoring rules</button><button onClick={(event) => onStats(event.currentTarget)}><BarChart3 size={17} /> Your stats</button><a href={`/studies/${study.slug}`}><BookOpen size={17} /> Explore the full market study</a></div></div></details>
    <Footer puzzle={puzzle} nextPuzzle={nextPuzzle} puzzles={puzzles} now={now} submitted />
  </main>
}

export function DailyUnavailable({ resolution }: { resolution: Exclude<DailyResolution, { kind: 'puzzle' }> }) {
  const activeLink = resolution.kind === 'unknown' || resolution.kind === 'unreleased' ? resolution.currentPuzzle : null
  const title = resolution.kind === 'unknown' ? 'That puzzle link is unknown.'
    : resolution.kind === 'unreleased' ? 'That puzzle has not been released.'
      : resolution.kind === 'upcoming' ? 'The first daily puzzle is not live yet.'
        : resolution.kind === 'gap' ? 'There is no daily puzzle in this release window.'
          : 'The published daily schedule has ended.'
  const detail = resolution.kind === 'unknown' ? `No published puzzle uses the ID “${resolution.requestedId}”.`
    : resolution.kind === 'unreleased' ? `Puzzle #${String(resolution.puzzle.number).padStart(3, '0')} releases ${formatRelease(resolution.puzzle)} (05:00 UTC).`
      : resolution.kind === 'upcoming' ? `Puzzle #${String(resolution.nextPuzzle.number).padStart(3, '0')} releases ${formatRelease(resolution.nextPuzzle)} (05:00 UTC).`
        : resolution.kind === 'gap' ? `The next scheduled puzzle releases ${formatRelease(resolution.nextPuzzle)} (05:00 UTC).`
          : 'No future puzzle has completed editorial review and been scheduled. Past puzzles remain available from their exact links.'
  const archive = resolution.kind === 'gap' ? resolution.previousPuzzle : resolution.kind === 'exhausted' ? resolution.latestPuzzle : null
  return <div className="daily-shell"><header className="daily-topbar daily-topbar-simple"><a className="daily-brand" href="/"><span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span><span>NexusPoint</span></a><div className="daily-number">Daily · 05:00 UTC</div></header><main className="daily-state-page"><span>Publication schedule</span><h1>{title}</h1><p>{detail}</p><div>{activeLink && <a className="daily-primary-button" href={`/?daily=${activeLink.id}`}>Open today’s puzzle</a>}{archive && <a className="daily-secondary-button" href={`/?daily=${archive.id}`}>Open puzzle #{String(archive.number).padStart(3, '0')} as archive</a>}<a className="daily-text-link" href="/studies">Explore published studies</a></div></main></div>
}

export function DailyGame({ registration, points, puzzle, playMode, nextPuzzle, puzzles }: { registration: StudyRegistration; points: MarketSeriesPoint[]; puzzle: DailyPuzzle; playMode: 'daily' | 'archive'; nextPuzzle: DailyPuzzle | null; puzzles: readonly DailyPuzzle[] }) {
  const study = registration.study
  const cards = useMemo(() => puzzle.eventIds.map((id) => getPreRevealCard(study, id)).filter((card): card is PreRevealCard => card !== null), [puzzle, study])
  const dailyEvents = useMemo(() => cards.map((card) => card.event), [cards])
  const impacts = useMemo(() => calculateStudyImpacts(points, dailyEvents, study.measurementProfile), [dailyEvents, points, study])
  const initialRead = useMemo(() => readDailyAttempt(browserStorage(), puzzle), [puzzle])
  const initialAttempt = initialRead.status === 'valid' ? initialRead.attempt : null
  const [order, setOrder] = useState<string[]>(() => [...(initialAttempt?.submission?.order ?? initialAttempt?.order ?? puzzle.initialOrder)])
  const [submission, setSubmission] = useState<DailySubmission | null>(() => initialAttempt?.submission ?? null)
  const [dragPosition, setDragPosition] = useState<DragPosition | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [persistenceMessage, setPersistenceMessage] = useState(() => initialRead.status === 'invalid' ? 'Saved progress was outdated or damaged, so this puzzle started fresh.' : initialRead.status === 'unavailable' ? 'Progress cannot be saved in this browser. Keep this tab open until you finish.' : '')
  const [modal, setModal] = useState<'help' | 'stats' | null>(null)
  const [modalTrigger, setModalTrigger] = useState<HTMLElement | null>(null)
  const [now, setNow] = useState(() => new Date())
  const listRef = useRef<HTMLElement>(null)
  const orderRef = useRef(order)
  const dragPositionRef = useRef<DragPosition | null>(null)
  const dragStartOrder = useRef<string[]>([])
  const activePointerId = useRef<number | null>(null)
  const cleanupDragListeners = useRef<(() => void) | null>(null)
  orderRef.current = order
  const byId = useMemo(() => new Map(cards.map((card) => [card.event.id, card])), [cards])
  const scored = useMemo(() => scoreDailyOrder(order, impacts, puzzle.scoring), [impacts, order, puzzle.scoring])

  useEffect(() => { const interval = window.setInterval(() => setNow(new Date()), 30_000); return () => window.clearInterval(interval) }, [])
  useEffect(() => {
    if (submission) return
    const result = saveDailyDraft(browserStorage(), puzzle, order, new Date().toISOString())
    if (result.status === 'unavailable') setPersistenceMessage('Progress cannot be saved in this browser. Keep this tab open until you finish.')
    if (result.status === 'submitted') {
      setOrder([...result.attempt.submission!.order])
      setSubmission(result.attempt.submission!)
      setPersistenceMessage('A completed result from another tab was restored.')
    }
  }, [order, puzzle, submission])
  useEffect(() => {
    const syncAttempt = (event: StorageEvent) => {
      if (event.key !== dailyAttemptKey(puzzle)) return
      const saved = readDailyAttempt(browserStorage(), puzzle)
      if (saved.status === 'valid' && saved.attempt.submission) {
        cleanupDragListeners.current?.()
        cleanupDragListeners.current = null
        activePointerId.current = null
        document.body.classList.remove('daily-is-sorting')
        dragPositionRef.current = null
        setDragPosition(null)
        setOrder([...saved.attempt.submission.order])
        setSubmission(saved.attempt.submission)
        setPersistenceMessage('A completed result from another tab was restored.')
      }
    }
    window.addEventListener('storage', syncAttempt)
    return () => window.removeEventListener('storage', syncAttempt)
  }, [puzzle])

  const move = (id: string, destination: number) => {
    if (submission) return
    const next = moveRankedItem(orderRef.current, id, destination)
    orderRef.current = next
    setOrder(next)
    setAnnouncement(`${byId.get(id)?.event.shortTitle ?? 'Headline'} moved to position ${next.indexOf(id) + 1}.`)
  }
  const moveDrag = (id: string, clientY: number) => {
    const active = dragPositionRef.current
    if (!active || active.id !== id || submission) return
    const nextPosition = { ...active, clientY }
    dragPositionRef.current = nextPosition
    setDragPosition(nextPosition)

    const edge = 72
    const scrollDelta = clientY < edge ? -Math.ceil((edge - clientY) / 7) : clientY > window.innerHeight - edge ? Math.ceil((clientY - window.innerHeight + edge) / 7) : 0
    if (scrollDelta) window.scrollBy(0, scrollDelta)

    const list = listRef.current
    if (!list) return
    const remaining = orderRef.current.filter((eventId) => eventId !== id)
    const elements = [...list.querySelectorAll<HTMLElement>('[data-daily-id]')]
    let insertionIndex = remaining.length
    for (let index = 0; index < remaining.length; index += 1) {
      const element = elements.find((candidate) => candidate.dataset.dailyId === remaining[index])
      if (element && clientY < element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2) { insertionIndex = index; break }
    }
    const nextOrder = [...remaining]
    nextOrder.splice(insertionIndex, 0, id)
    if (nextOrder.every((eventId, index) => eventId === orderRef.current[index])) return
    orderRef.current = nextOrder
    setOrder(nextOrder)
  }
  const endDrag = (id: string, canceled: boolean) => {
    const active = dragPositionRef.current
    if (!active || active.id !== id) return
    cleanupDragListeners.current?.()
    cleanupDragListeners.current = null
    activePointerId.current = null
    document.body.classList.remove('daily-is-sorting')
    if (canceled) {
      const restored = [...dragStartOrder.current]
      orderRef.current = restored
      setOrder(restored)
      setAnnouncement(`Reordering canceled. ${byId.get(id)?.event.shortTitle ?? 'Headline'} returned to position ${restored.indexOf(id) + 1}.`)
    } else {
      setAnnouncement(`${byId.get(id)?.event.shortTitle ?? 'Headline'} moved to position ${orderRef.current.indexOf(id) + 1}.`)
    }
    dragPositionRef.current = null
    setDragPosition(null)
  }
  const startDrag = (id: string, pointerEvent: ReactPointerEvent<HTMLElement>) => {
    if (submission || dragPositionRef.current) return
    const cardElement = pointerEvent.currentTarget.closest<HTMLElement>('[data-daily-id]')
    if (!cardElement) return
    cleanupDragListeners.current?.()
    const rect = cardElement.getBoundingClientRect()
    const nextPosition = { id, clientY: pointerEvent.clientY, left: rect.left, offsetY: pointerEvent.clientY - rect.top, width: rect.width, height: Math.min(rect.height, 140) }
    dragStartOrder.current = [...orderRef.current]
    activePointerId.current = pointerEvent.pointerId
    dragPositionRef.current = nextPosition
    setDragPosition(nextPosition)
    document.body.classList.add('daily-is-sorting')
    document.getSelection()?.removeAllRanges()

    const pointerMatches = (event: PointerEvent) => event.pointerId === activePointerId.current
    const onPointerMove = (event: PointerEvent) => {
      if (!pointerMatches(event)) return
      if (event.pointerType === 'mouse' && event.buttons === 0) { endDrag(id, false); return }
      event.preventDefault()
      moveDrag(id, event.clientY)
    }
    const onPointerUp = (event: PointerEvent) => { if (pointerMatches(event)) endDrag(id, false) }
    const onPointerCancel = (event: PointerEvent) => { if (pointerMatches(event)) endDrag(id, true) }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); endDrag(id, true) } }
    const onWindowBlur = () => endDrag(id, true)
    const onVisibilityChange = () => { if (document.visibilityState === 'hidden') endDrag(id, true) }
    const cleanup = () => {
      document.removeEventListener('pointermove', onPointerMove, true)
      document.removeEventListener('pointerup', onPointerUp, true)
      document.removeEventListener('pointercancel', onPointerCancel, true)
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('blur', onWindowBlur)
    }
    cleanupDragListeners.current = cleanup
    document.addEventListener('pointermove', onPointerMove, { capture: true, passive: false })
    document.addEventListener('pointerup', onPointerUp, true)
    document.addEventListener('pointercancel', onPointerCancel, true)
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('blur', onWindowBlur)
  }
  useEffect(() => () => {
    cleanupDragListeners.current?.()
    document.body.classList.remove('daily-is-sorting')
  }, [])
  const submit = () => {
    if (submission) return
    const timestamp = new Date().toISOString()
    const currentMode = currentDailyPuzzle(puzzles, new Date(timestamp))?.id === puzzle.id ? 'daily' : 'archive'
    const candidate: DailySubmission = { order: [...order], submittedAt: timestamp, score: scored.agreement.percent, agreed: scored.agreement.agreed, comparable: scored.agreement.comparable, playMode: currentMode }
    const result = submitDailyAttempt(browserStorage(), puzzle, order, scored.agreement, timestamp, currentMode)
    if (result.status === 'duplicate') {
      setOrder([...result.attempt.submission!.order])
      setSubmission(result.attempt.submission!)
      setPersistenceMessage('Your existing submitted result was restored.')
    } else if (result.status === 'invalid') {
      setPersistenceMessage('This attempt could not be validated, so no result was recorded.')
    } else {
      setSubmission(candidate)
      if (result.status === 'unavailable') setPersistenceMessage('This result is visible now but cannot be saved in this browser.')
    }
  }
  const openModal = (name: 'help' | 'stats', trigger: HTMLElement) => { setModalTrigger(trigger); setModal(name) }
  const overlays = <>{modal === 'help' && <Help puzzle={puzzle} study={study} returnFocus={modalTrigger} onClose={() => setModal(null)} />}{modal === 'stats' && <Stats puzzles={puzzles} returnFocus={modalTrigger} onClose={() => setModal(null)} />}</>
  const page = submission
    ? <><Topbar puzzle={puzzle} onHelp={(trigger) => openModal('help', trigger)} onStats={(trigger) => openModal('stats', trigger)} /><Result study={study} puzzle={puzzle} puzzles={puzzles} nextPuzzle={nextPuzzle} impacts={impacts} submission={submission} now={now} onHelp={(trigger) => openModal('help', trigger)} onStats={(trigger) => openModal('stats', trigger)} /></>
    : <><Topbar puzzle={puzzle} onHelp={(trigger) => openModal('help', trigger)} onStats={(trigger) => openModal('stats', trigger)} /><main className="daily-game"><header className="daily-game-heading"><span>{puzzle.topic} · Daily #{String(puzzle.number).padStart(3, '0')}</span><h1>{puzzle.question}</h1><p>{puzzle.instruction}</p>{playMode === 'archive' && <p className="daily-archive-note">Archive play does not count toward the current daily streak.</p>}</header><div className="daily-ranking-layout"><div className="daily-spectrum" aria-hidden="true"><span>{study.presentation.positiveShortLabel ?? study.presentation.positiveLabel}</span><i /><span>{study.presentation.negativeShortLabel ?? study.presentation.negativeLabel}</span></div><section ref={listRef} className={`daily-card-list ${dragPosition ? 'is-sorting' : ''}`} aria-label={`Rank the five headlines. Top: ${study.presentation.positiveLabel}. Bottom: ${study.presentation.negativeLabel}.`}>{order.map((id, index) => <Card key={id} card={byId.get(id)!} index={index} total={order.length} isDragging={dragPosition?.id === id} onMove={move} onDragStart={startDrag} />)}</section></div><div className="daily-submit-dock"><button className="daily-primary-button" onClick={submit}>Reveal my score <ArrowRight size={19} /></button><span><LockKeyhole size={12} /> {playMode === 'daily' ? 'One official submission' : 'Archive result only'}</span></div><Footer puzzle={puzzle} nextPuzzle={nextPuzzle} puzzles={puzzles} now={now} submitted={false} /><p className="sr-status" aria-live="polite">{announcement}</p></main>{dragPosition && <DragPreview card={byId.get(dragPosition.id)!} index={order.indexOf(dragPosition.id)} position={dragPosition} />}</>
  return <div className="daily-shell"><div data-daily-background>{page}{persistenceMessage && <p className="daily-persistence-note" role="status">{persistenceMessage}</p>}</div>{overlays}</div>
}
