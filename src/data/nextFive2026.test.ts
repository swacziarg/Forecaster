import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {nextFiveStudies,nextFivePuzzles} from './nextFive2026.ts'
import {LocalDatasetAdapter} from './localDatasetAdapter.ts'
import {calculateStudyImpacts} from '../domain/eventStudy.ts'
import {getPreRevealCard,scoreDailyOrder} from '../domain/dailyGame.ts'
const reviewed = JSON.parse(readFileSync('docs/next-five-2026-09-10/review/reviewed-proposal.json','utf8'))
const originalFetch = globalThis.fetch
try {
 globalThis.fetch = async input => new Response(readFileSync(`public${String(input)}`), {status:200})
 for(const puzzle of nextFivePuzzles){
  const study=nextFiveStudies.find(s=>s.id===puzzle.studyId)!
  const approved=reviewed.editions.find((e:{number:number})=>e.number===puzzle.number)
  assert.equal(createHash('sha256').update(readFileSync(`public${study.dataset.path}`)).digest('hex'),approved.csvSha256)
  const bundle=await new LocalDatasetAdapter(study).getSeries({dataset:study.dataset,selectedPerspective:study.contract.selectedPerspective})
  const impacts=calculateStudyImpacts(bundle.observations,study.events,study.measurementProfile)
  assert.deepEqual(scoreDailyOrder(puzzle.initialOrder,impacts,puzzle.scoring).tieGroups,approved.tieGroups)
  for(const e of study.events){
   assert.ok(getPreRevealCard(study,e.id)?.sources.length)
   const expected=approved.cards.find((c:{id:string})=>c.id===e.id)
   assert.ok(Math.abs(impacts.find(i=>i.eventId===e.id)!.shortTermResponse!*100-expected.measuredChangePercentagePoints)<1e-10)
  }
 }
} finally {globalThis.fetch=originalFetch}
console.log('Five approved editions load verified public data and reproduce reviewed scores')
