import assert from 'node:assert/strict'
import { studyRegistry } from '../data/studies.ts'
import { resolveStudyRoute } from './launchRouting.ts'

const published = resolveStudyRoute('/studies/biden-dropout-24-days', studyRegistry)
assert.equal(published.kind, 'published')
if (published.kind === 'published') assert.equal(published.registration.study.slug, 'biden-dropout-24-days')

const draft = resolveStudyRoute('/studies/oscars-best-picture-2026', studyRegistry)
assert.equal(draft.kind, 'draft')

const unknown = resolveStudyRoute('/studies/not-a-study', studyRegistry)
assert.deepEqual(unknown, { kind: 'unknown', slug: 'not-a-study' })

assert.equal(resolveStudyRoute('/studies', studyRegistry).kind, 'index')
assert.equal(resolveStudyRoute('/studies/', studyRegistry).kind, 'index')
assert.equal(resolveStudyRoute('/other', studyRegistry).kind, 'other')

console.log('launchRouting tests passed')
