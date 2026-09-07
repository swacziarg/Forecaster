import assert from 'node:assert/strict'
import { isRetiredStudyRoute } from './launchRouting.ts'

for (const path of ['/studies', '/studies/', '/studies/biden-dropout-24-days', '/studies/oscars-best-picture-2026', '/studies/not-a-study', '/studies/nested/path']) {
  assert.equal(isRetiredStudyRoute(path), true, `${path} returns to the daily game`)
}
for (const path of ['/', '/__preview/tiktok-banned-before-may-2025', '/other', '/studies-extra']) {
  assert.equal(isRetiredStudyRoute(path), false, `${path} is not a retired study route`)
}
console.log('launchRouting tests passed')
