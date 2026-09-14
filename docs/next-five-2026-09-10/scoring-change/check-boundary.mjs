import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export function checkBoundary(path, expected) {
 const actual=readFileSync(path,'utf8');
 if(path==='src/data/dailyPuzzles.ts'){
  const before=readFileSync('docs/next-five-2026-09-10/scoring-change/before-dailyPuzzles.ts','utf8');
  assert.equal(createHash('sha256').update(before).digest('hex'),expected);
  const index=before.indexOf('id: "2026-09-11-');assert.ok(index>0);
  const authorized=before.slice(0,index)+before.slice(index).replaceAll('"version": "pairwise-anchor-1pt-v2", "tieThreshold": 0.01','"version": "pairwise-exact-v3", "tieThreshold": 0');
  assert.equal(actual,authorized,'only upcoming scoring changed; dates, event sets, released grades preserved');
 } else assert.equal(createHash('sha256').update(actual).digest('hex'),expected,path);
}
