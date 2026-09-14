import {checkBoundary} from '../scoring-change/check-boundary.mjs';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateStudy} from '../../../src/domain/study.ts';
import {getPreRevealCard} from '../../../src/domain/dailyGame.ts';
import {parseMarketCsv,calculateStudyImpacts,createTieGroups} from '../../../src/domain/eventStudy.ts';
const base='docs/next-five-2026-09-10',root=base+'/audit-other';
const json=p=>JSON.parse(readFileSync(p,'utf8'));const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const proposal=json(root+'/original-proposal.json');
const replacements={7:root+'/trump/study-draft-v2.json',9:root+'/fed/study-draft-v2.json',10:root+'/nyc/study-draft-v2.json',11:root+'/dodgers/study-draft-v3.json'};
const out=[];
const canonical=groups=>JSON.stringify(groups.map(g=>[...g].sort()));
for(const spec of proposal.editions.filter(x=>x.number!==8)){
 const path=existsSync(replacements[spec.number])?replacements[spec.number]:spec.study,s=json(path),points=parseMarketCsv(readFileSync(spec.csv,'utf8'));
 assert.deepEqual(validateStudy(s),[],path);assert.equal(s.events.length,5);
 const physical=p=>p.startsWith('/data/')?'public'+p:p;
 assert.equal(hash(physical(s.dataset.path)),s.dataset.normalizedSha256,'CSV hash label');
 assert.equal(hash(physical(s.dataset.rawPath)),s.dataset.rawSha256,'raw file hash label');
 assert.equal(hash(physical(s.dataset.marketMetadataPath)),s.dataset.marketMetadataSha256,'metadata hash label');
 const old=calculateStudyImpacts(points,json(spec.study).events,s.measurementProfile);
 const score=events=>{const impacts=calculateStudyImpacts(points,events,s.measurementProfile);return {impacts,groups:createTieGroups(impacts,.01,1e-12)}};
 const actual=score(s.events);assert.ok(actual.impacts.every(i=>i.qualityStatus==='usable'));
 assert.equal(actual.impacts.flatMap(i=>Object.values(i.windows)).filter(w=>w.quality.status==='usable').length,25);
 for(const e of s.events){const card=getPreRevealCard(s,e.id);assert.ok(card?.sources.length,e.id);assert.ok(!card.sources.some(src=>src.id===s.conclusion.sourceId));}
 const sensitivity=[-1,0,1].map(hours=>{const r=score(s.events.map(e=>({...e,informationKnownAt:new Date(Date.parse(e.informationKnownAt)+hours*3600000).toISOString()})));return {hours,tieGroups:r.groups,moves:r.impacts.map(i=>({id:i.eventId,pp:i.shortTermResponse*100,quality:i.qualityStatus}))}});
 const extra=[];
 const median=a=>{const b=[...a].sort((x,y)=>x-y);return b.length%2?b[(b.length-1)/2]:(b[b.length/2-1]+b[b.length/2])/2};
 if(spec.number===11){
  const feeds=json(root+'/dodgers/timing-ledger.json').officialGameFeeds;
  for(const e of s.events.filter(e=>e.id!=='glasnow-injury')){
   const feed=json(root+'/dodgers/'+feeds[e.id].rawLive),start=Date.parse(feed.liveData.plays.allPlays[0].about.startTime);
   const samples=points.filter(p=>Date.parse(p.timestamp)>=start-6*3600000&&Date.parse(p.timestamp)<start).map(p=>p.probability);
   assert.ok(samples.length>=4);
   const i=actual.impacts.find(i=>i.eventId===e.id);extra.push({eventId:e.id,type:'6h pre-first-play baseline diagnostic only',sampleCount:samples.length,before:median(samples),changePp:(i.windows.stabilized.level-median(samples))*100});
  }
 }
 for(const id of spec.number===10?['aoc-endorsement','hochul-endorsement']:spec.number===11?['glasnow-injury']:[]){
  extra.push({eventId:id,type:'earlier-publication uncertainty diagnostic only',scenarios:[-6,-3,-1,0].map(hours=>{const r=score(s.events.map(e=>e.id===id?{...e,informationKnownAt:new Date(Date.parse(e.informationKnownAt)+hours*3600000).toISOString()}:e));return {hours,movementPp:r.impacts.find(i=>i.eventId===id).shortTermResponse*100,tieGroups:r.groups}})});
 }
 const cards=actual.impacts.map(i=>({id:i.eventId,title:s.events.find(e=>e.id===i.eventId).title,cutoff:s.events.find(e=>e.id===i.eventId).informationKnownAt,oldPp:old.find(o=>o.eventId===i.eventId).shortTermResponse*100,newPp:i.shortTermResponse*100,windows:i.windows}));
 out.push({number:spec.number,topic:spec.topic,study:path,studySha256:hash(path),csvSha256:hash(spec.csv),cards,extraDiagnostics:extra,tieGroups:actual.groups,sensitivity,groupsStable:sensitivity.every(x=>canonical(x.tieGroups)===canonical(actual.groups))});
}
for(const [p,h] of Object.entries(json(base+'/review/schedule-baseline.json').files))checkBoundary(p,h);
writeFileSync(root+'/score-audit.json',JSON.stringify({status:'Draft audit only; schedule unchanged',editions:out},null,2)+'\n');
console.log(JSON.stringify(out.map(x=>({topic:x.topic,groupsStable:x.groupsStable,ties:x.tieGroups,moves:x.cards.map(c=>({id:c.id,old:c.oldPp,new:c.newPp}))})),null,2));
