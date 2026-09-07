import type { StudyRegistration } from '../data/studies.ts'
import type { DailyPuzzle } from './dailyGame.ts'

export const PRIVATE_PREVIEW_PREFIX = '/__preview/'

// This allowlist is intentionally narrower than the draft registry. A future draft
// must be explicitly promoted into the local preview surface by the launch lead.
export const PRIVATE_PREVIEW_SLUGS = [
  'tiktok-banned-before-may-2025',
  'eagles-stop-threepeat',
  'oscars-best-picture-2026-v2',
  'bitcoin-100k-2024-five-card',
  'canada-liberal-comeback',
] as const

export type PrivatePreviewRoute =
  | { kind: 'preview'; slug: string; registration: StudyRegistration }
  | { kind: 'unknown'; slug: string }

function previewSlug(pathname: string) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (!normalized.startsWith(PRIVATE_PREVIEW_PREFIX)) return null
  const value = normalized.slice(PRIVATE_PREVIEW_PREFIX.length)
  if (!value || value.includes('/')) return ''
  try { return decodeURIComponent(value) } catch { return value }
}

export function resolvePrivatePreview(pathname: string, registrations: readonly StudyRegistration[], enabled: boolean): PrivatePreviewRoute | null {
  if (!enabled) return null
  const slug = previewSlug(pathname)
  if (slug === null) return null
  const registration = registrations.find((candidate) => candidate.study.slug === slug && PRIVATE_PREVIEW_SLUGS.includes(slug as typeof PRIVATE_PREVIEW_SLUGS[number]))
  return registration ? { kind: 'preview', slug, registration } : { kind: 'unknown', slug }
}

export function createPrivatePreviewPuzzle(registration: StudyRegistration): DailyPuzzle {
  const { study } = registration
  const eventIds = study.events.map((event) => event.id)
  return {
    id: `__private-preview.${study.slug}.v${study.version}`,
    number: 901,
    releaseTime: '2000-01-01T00:00:00Z',
    releaseTimezone: 'UTC',
    studyId: study.id,
    studyVersion: study.version,
    topic: study.presentation.topicLabel,
    question: study.question,
    instruction: 'Private preview: rank the five developments by their effect on the selected contract. The market record and resolution remain sealed until you reveal.',
    eventIds,
    initialOrder: eventIds,
    scoring: { version: 'pairwise-anchor-1pt-v1', tieThreshold: study.measurementProfile.tieThreshold, tieGrouping: 'anchor-window' },
  }
}
