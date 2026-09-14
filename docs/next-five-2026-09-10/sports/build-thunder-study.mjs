// Final draft is frozen in study-draft.json. This command verifies it without reconstructing obsolete source timing.
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {validateStudy} from '../../../src/domain/study.ts'
import {getPreRevealCard} from '../../../src/domain/dailyGame.ts'
const s=JSON.parse(readFileSync('docs/next-five-2026-09-10/sports/study-draft.json','utf8'))
assert.deepEqual(validateStudy(s),[])
assert.ok(s.events.every(e=>getPreRevealCard(s,e.id)?.sources.length))
console.log('Final Thunder draft: schema and five source-backed cards pass.')
