import type { StudyRegistration } from '../data/studies.ts'

export type StudyRoute =
  | { kind: 'index' }
  | { kind: 'published'; registration: StudyRegistration }
  | { kind: 'draft'; slug: string; registration: StudyRegistration }
  | { kind: 'unknown'; slug: string }
  | { kind: 'other' }

function routeSlug(pathname: string) {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (normalizedPath === '/studies') return null
  if (!normalizedPath.startsWith('/studies/')) return undefined
  const value = normalizedPath.slice('/studies/'.length)
  if (!value || value.includes('/')) return ''
  try { return decodeURIComponent(value) } catch { return value }
}

export function resolveStudyRoute(pathname: string, registrations: readonly StudyRegistration[]): StudyRoute {
  const slug = routeSlug(pathname)
  if (slug === null) return { kind: 'index' }
  if (slug === undefined) return { kind: 'other' }
  const registration = registrations.find((candidate) => candidate.study.slug === slug)
  if (!registration) return { kind: 'unknown', slug }
  return registration.study.status === 'published'
    ? { kind: 'published', registration }
    : { kind: 'draft', slug, registration }
}
