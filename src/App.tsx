import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { studyById, studyRegistry } from './data/studies.ts'
import { dailyPuzzles } from './data/dailyPuzzles.ts'
import { DailyGame, DailyUnavailable } from './DailyGame.tsx'
import type { MarketSeriesPoint } from './domain/eventStudy.ts'
import { resolveDailyPuzzle } from './domain/dailyGame.ts'
import { isRetiredStudyRoute } from './domain/launchRouting.ts'
import { createPrivatePreviewPuzzle, resolvePrivatePreview } from './domain/playablePreview.ts'
import { assertValidStudy } from './domain/study.ts'

function StatusPage({ title, children }: { title: string; children: ReactNode }) {
  return <div className="daily-shell"><header className="daily-topbar daily-topbar-simple"><a className="daily-brand" href="/"><span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span><span>NexusPoint</span></a></header><main className="daily-state-page"><h1>{title}</h1>{children}</main></div>
}

export default function App() {
  const pathname = window.location.pathname
  const retired = isRetiredStudyRoute(pathname)
  const isDaily = pathname === '/'
  const privatePreview = resolvePrivatePreview(pathname, studyRegistry, import.meta.env.DEV)
  const [dailyResolution] = useState(() => isDaily ? resolveDailyPuzzle(dailyPuzzles, new Date(), new URLSearchParams(window.location.search).get('daily')) : null)
  const registration = dailyResolution?.kind === 'puzzle' ? studyById(dailyResolution.puzzle.studyId) : privatePreview?.kind === 'preview' ? privatePreview.registration : null
  const previewPuzzle = useMemo(() => privatePreview?.kind === 'preview' && registration ? createPrivatePreviewPuzzle(registration) : null, [privatePreview?.kind, registration])
  const [points, setPoints] = useState<MarketSeriesPoint[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (retired) { window.location.replace('/'); return }
    if (!registration) return
    let canceled = false
    try { assertValidStudy(registration.study) } catch { setError(true); return }
    registration.loadSeries().then((series) => { if (!canceled) setPoints(series) }).catch(() => { if (!canceled) setError(true) })
    return () => { canceled = true }
  }, [registration, retired])

  if (retired) return <StatusPage title="Opening the daily game"><p><a className="daily-text-link" href="/">Continue to NexusPoint</a></p></StatusPage>
  if (isDaily && dailyResolution?.kind !== 'puzzle') return <DailyUnavailable resolution={dailyResolution!} />
  if (!registration) return <StatusPage title="This page is unavailable"><p><a className="daily-text-link" href="/">Open the daily game</a></p></StatusPage>
  if (error) return <StatusPage title="We couldn’t open this puzzle"><p>The market record could not be loaded. Your saved progress is still here.</p><div><button className="daily-primary-button" onClick={() => window.location.reload()}><RotateCcw size={16} /> Try again</button></div></StatusPage>
  if (!points) return <StatusPage title="Preparing the puzzle"><p aria-live="polite">Loading the market record for {registration.study.presentation.topicLabel}.</p></StatusPage>
  if (previewPuzzle) return <DailyGame registration={registration} points={points} puzzle={previewPuzzle} playMode="archive" nextPuzzle={null} puzzles={[]} preview />
  if (dailyResolution?.kind === 'puzzle') return <DailyGame registration={registration} points={points} puzzle={dailyResolution.puzzle} playMode={dailyResolution.playMode} nextPuzzle={dailyResolution.nextPuzzle} puzzles={dailyPuzzles} />
  return null
}
