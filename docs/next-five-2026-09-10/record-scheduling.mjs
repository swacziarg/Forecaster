import {readFileSync,writeFileSync} from 'node:fs';
import {nextFiveStudies,nextFivePuzzles} from '../../src/data/nextFive2026.ts';
import {contentHashForPuzzle} from '../../scripts/check-launch-readiness.mjs';
const path='docs/launch-work/schedule/approvals.json';const packet=JSON.parse(readFileSync(path,'utf8'));
for(const puzzle of nextFivePuzzles){
 const study=nextFiveStudies.find(s=>s.id===puzzle.studyId);
 if(packet.entries.some(e=>e.puzzleId===puzzle.id))throw Error('Already recorded '+puzzle.id);
 packet.entries.push({puzzleId:puzzle.id,studyId:study.id,studyVersion:study.version,releaseTime:puzzle.releaseTime,contentHash:contentHashForPuzzle(puzzle,study),status:'approved',approverType:'human',approver:'Project owner in task 01a08c07-cb79-7c70-b8ec-fc8f20155e46',approvedAt:new Date().toISOString(),approvalBasis:'User approved the repaired five-edition September13–17 lineup with exact-move scoring: “ok send them in. commit and push.” Public dataset paths were packaged without changing original prices or scored headlines. Earlier user “go” authorized exact-move scoring. September11–12 retain their released rules because activation now occurs September13.',sourceTaskId:'01a08c07-cb79-7c70-b8ec-fc8f20155e46'});
}
writeFileSync(path,JSON.stringify(packet,null,2)+'\n');
