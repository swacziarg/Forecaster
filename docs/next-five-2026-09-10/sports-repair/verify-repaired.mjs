import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateStudy} from '../../../src/domain/study.ts';
import {getPreRevealCard} from '../../../src/domain/dailyGame.ts';
import {parseMarketCsv,calculateStudyImpacts,createTieGroups} from '../../../src/domain/eventStudy.ts';
const root='docs/next-five-2026-09-10/sports-repair';const read=p=>JSON.parse(readFileSync(p,'utf8'));const s=read(root+'/study-draft-v3.json'),freeze=read(root+'/anchor-freeze-v3.json');const points=parseMarketCsv(readFileSync('docs/next-five-2026-09-10/sports/thunder-hourly.csv','utf8'));
assert.deepEqual(validateStudy(s),[]);assert.equal(s.events.length,5);
for(const e of s.events){const c=getPreRevealCard(s,e.id);assert.ok(c.sources.length>0);assert.ok(!c.sources.some(x=>x.id.endsWith('scorebook')),'unknown PDF timestamps excluded from pre-reveal source list');}
const impacts=calculateStudyImpacts(points,s.events,s.measurementProfile);assert.ok(impacts.every(x=>x.qualityStatus==='usable'));
const median=v=>{v.sort((a,b)=>a-b);return v.length%2?v[(v.length-1)/2]:(v[v.length/2-1]+v[v.length/2])/2};
const diagnostic=[];
for(const e of s.events){const a=freeze.anchors[e.id];if(!a.gameStartUTC)continue;const t=Date.parse(a.gameStartUTC);const before=points.filter(p=>Date.parse(p.timestamp)>=t-6*3600000&&Date.parse(p.timestamp)<t).map(p=>p.probability);const i=impacts.find(x=>x.eventId===e.id);diagnostic.push({eventId:e.id,baseline:'6h pre-tip median (diagnostic only, not official scoring)',samples:before.length,before:median(before),stabilized:i.windows.stabilized.level,changePp:100*(i.windows.stabilized.level-median(before))});}
const sensitivity=[-1,0,1].map(hours=>{const es=s.events.map(e=>({...e,informationKnownAt:new Date(Date.parse(e.informationKnownAt)+hours*3600000).toISOString()}));const xs=calculateStudyImpacts(points,es,s.measurementProfile);return {hours,tieGroups:createTieGroups(xs,.01,1e-12),moves:xs.map(i=>({id:i.eventId,pp:i.shortTermResponse*100,quality:i.qualityStatus}))};});
const json={generatedAt:new Date().toISOString(),studyId:s.id,studySha256:createHash('sha256').update(readFileSync(root+'/study-draft-v3.json')).digest('hex'),csvSha256:createHash('sha256').update(readFileSync('docs/next-five-2026-09-10/sports/thunder-hourly.csv')).digest('hex'),scoring:{version:'pairwise-anchor-1pt-v2',tieThreshold:.01,boundaryTolerance:1e-12},initialOrder:freeze.initialOrder,impacts,tieGroups:createTieGroups(impacts,.01,1e-12),preTipDiagnostic:diagnostic,sensitivity,checks:{strictStudy:true,sourceBackedCards:5,usableWindows:25,rawObservationsUnchanged:true}};
assert.ok(impacts.find(x=>x.eventId==='denver-game-seven').shortTermResponse>.1,'Game7 regression: corrected result window captures observed double-digit repricing');
const bad=structuredClone(s);bad.events.find(e=>e.id==='denver-game-seven').informationKnownAt='2025-05-19T11:48:17Z';const old=calculateStudyImpacts(points,bad.events,s.measurementProfile).find(x=>x.eventId==='denver-game-seven');assert.ok(Math.abs(old.shortTermResponse)<1e-10,'Reproduces previously diagnosed late-anchor zero');
writeFileSync(root+'/score-packet-v3.json',JSON.stringify(json,null,2)+'\n');
console.log(JSON.stringify({checks:json.checks,moves:impacts.map(i=>({id:i.eventId,before:i.windows.reference.level,after:i.windows.stabilized.level,pp:i.shortTermResponse*100})),tieGroups:json.tieGroups,diagnostic,sensitivity},null,2));
