import {checkBoundary} from '../scoring-change/check-boundary.mjs';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateStudy} from '../../../src/domain/study.ts';
import {EXACT_MOVE_SCORING, NUMERICAL_TIE_TOLERANCE, scoreDailyOrder, getPreRevealCard} from '../../../src/domain/dailyGame.ts';
import {parseMarketCsv,calculateStudyImpacts,createTieGroups,auditSeries} from '../../../src/domain/eventStudy.ts';
const base='docs/next-five-2026-09-10';
const json=p=>JSON.parse(readFileSync(p,'utf8'));
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const specs=[
 {date:'2026-09-13',number:7,topic:'Trump’s 2024 comeback',study:`${base}/audit-other/trump/study-draft-v2.json`,csv:'docs/launch-queue-research/datasets/trump-hourly.csv',initialOrder:['rfk-endorsement','conviction','iowa-poll','butler','harris-debate'],verdict:'Audited and tightened broadcast bounds; five scores unchanged. Butler is the clear leader. Debate/Iowa tie separates in the minus-one-hour diagnostic. Butler repeats an earlier Biden-edition event; Iowa delayed window overlaps election night.'},
 {date:'2026-09-14',number:8,topic:'Thunder’s first title',study:`${base}/sports-repair/study-draft-v3.json`,csv:`${base}/sports/thunder-hourly.csv`,initialOrder:['chet-return','cup-loss','west-finals','chet-injury','denver-game-seven'],verdict:'Recommend repaired v3. Official public-result and original announcement cutoffs recover the Game 7 move: +19 pp. Four ranking groups, one tied pair. All 25 windows usable and groups stable under ±1 hour shifts. Price changes are descriptive, not isolated causal effects. The NBA Cup is separate from the championship contract.'},
 {date:'2026-09-15',number:9,topic:'The Fed’s half-point decision',study:`${base}/audit-other/fed/study-draft-v2.json`,csv:'public/data/fed-2024/polymarket-hourly.csv',initialOrder:json(`${base}/economy-culture/score-packet.json`).initialOrder,verdict:'Timing audit passes all five official issuer release times. Scores unchanged and all five ranks stable under one-hour shifts. Minor wording/source clarifications applied. Exact-token early prices re-fetched; provider creation/start discrepancy remains disclosed.'},
 {date:'2026-09-16',number:10,topic:'Mamdani’s New York upset',study:`${base}/audit-other/nyc/study-draft-v2.json`,csv:'docs/launch-queue-research/datasets/nyc-hourly.csv',initialOrder:json(`${base}/politics/nyc-score-packet.json`).initialOrder,verdict:'Repaired original announcement times and retrospective source dates. Primary jump remains +33.8 pp; remaining moves are small and endorsement tie is window-sensitive. Exact first NYT endorsement publication times remain unverified; wider uncertainty changes small-card ranking. Needs explicit editorial acceptance of this limit.'},
 {date:'2026-09-17',number:11,topic:'Dodgers’ title defense',study:`${base}/audit-other/dodgers/study-draft-v3.json`,csv:`${base}/sports-dodgers/hourly.csv`,initialOrder:json(`${base}/sports-dodgers/selection-freeze-v2.json`).initialOrder,verdict:'Repaired all five cutoffs using official game events and team release. NLDS +11 pp, pennant +2, Ohtani debut 0, Glasnow 0, seven losses -1. Three groups including a three-card tie, stable under one-hour shifts. Wider Glasnow publication uncertainty can split the low group. Needs explicit acceptance of the tied small-response cards.'}
];
const output=[];
for(const spec of specs){
 const s=json(spec.study),points=parseMarketCsv(readFileSync(spec.csv,'utf8'));
 assert.deepEqual(validateStudy(s),[],`${spec.topic}: strict schema`);
 assert.equal(s.events.length,5);assert.equal(new Set(spec.initialOrder).size,5);
 assert.deepEqual([...spec.initialOrder].sort(),s.events.map(e=>e.id).sort());
 assert.equal(s.contract.resolution,'YES');
 const impacts=calculateStudyImpacts(points,s.events,s.measurementProfile);
 assert.ok(impacts.every(i=>i.qualityStatus==='usable'),`${spec.topic}: all five window sets usable`);
 assert.equal(impacts.flatMap(i=>Object.values(i.windows)).filter(w=>w.quality.status==='usable').length,25);
 const cards=s.events.map(e=>{const c=getPreRevealCard(s,e.id);assert.ok(c?.sources.length,`${spec.topic}/${e.id} evidence`);assert.ok(!e.claims.some(c=>c.sourceIds.includes(s.conclusion?.sourceId)),`${spec.topic} ending exclusion`);const i=impacts.find(i=>i.eventId===e.id);return {id:e.id,title:e.title,dateLabel:e.dateLabel,informationKnownAt:e.informationKnownAt,claims:e.claims.map(c=>c.text),sources:c.sources,mechanism:e.mechanism,measuredChangePercentagePoints:i.shortTermResponse*100,referenceProbability:i.windows.reference.level,stabilizedProbability:i.windows.stabilized.level,windows:i.windows};});
 output.push({...spec,releaseTime:spec.date+'T05:00:00Z',timezone:'America/Chicago',status:'proposed-awaiting-owner-approval',studyId:s.id,studyVersion:s.version,studySha256:hash(spec.study),csvSha256:hash(spec.csv),observations:points.length,audit:auditSeries(points,60),contract:s.contract,market:s.market,scoring:{...EXACT_MOVE_SCORING,boundaryTolerance:NUMERICAL_TIE_TOLERANCE},tieGroups:scoreDailyOrder(spec.initialOrder,impacts,EXACT_MOVE_SCORING).tieGroups,cards,ending:s.conclusion,measurementNotes:s.measurementNotes??[]});
}
const baseline=json(`${base}/review/schedule-baseline.json`);
for(const [path,expected]of Object.entries(baseline.files))checkBoundary(path,expected);
for(const e of output) e.verdict = `Audited sources and unrounded moves; ${e.tieGroups.length} ranking groups under exact-move scoring. Only numerically equal calculated responses tie. See scoring-change/REVIEW.md for the updated ordering; previous one-point grouping is superseded.`;
const report={preparedAt:new Date().toISOString(),status:'PROPOSAL ONLY — no schedule approval recorded',scope:'Five reviewed content drafts. Runtime integration, packaging and dated schedule activation follow owner approval.',checks:{strictStudies:5,eligibleCards:25,usableWindows:125,distinctContracts:5,releaseScheduleUnchanged:true,upcomingScoringChangeAuthorized:true},editions:output};
writeFileSync(`${base}/review/reviewed-proposal.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({checks:report.checks,editions:output.map(x=>({date:x.date,topic:x.topic,observations:x.observations,moves:x.cards.map(c=>({id:c.id,pp:c.measuredChangePercentagePoints})),ties:x.tieGroups}))},null,2));
