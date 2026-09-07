// Research-only evaluation using the application's unchanged measurement implementation.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { calculateStudyImpacts, createTieGroups, MONTHS_PROFILE } from '../../src/domain/eventStudy.ts';
const root = new URL('./', import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(name, root), 'utf8'));
const frozen = read('frozen-selection-v1.json');
const anchors = read('anchors-v2.json');
const hash = name => crypto.createHash('sha256').update(fs.readFileSync(new URL(name, root))).digest('hex');
const result = { calculatedAt: new Date().toISOString(), selectionSha256: hash('frozen-selection-v1.json'), anchorsSha256: hash('anchors-v2.json'), measurementSourceSha256: hash('../../src/domain/eventStudy.ts'), profile: MONTHS_PROFILE, warning: 'Anora contains day-end eligibility scenarios only. Other anchors are public evidence cutoffs, frequently later than first market access. No causal attribution. Quality checks cannot establish CLOB trade freshness when the API omits it.', finalists: [] };
for (const f of frozen.finalists) {
  const points = read(`evidence/${f.key}-normalized.json`);
  const events = f.events.map(e => {
    const a = anchors.finalists[f.key].find(a => a.id === e.id);
    return { ...e, informationKnownAt: a.evaluationAnchor, anchorVerified: a.timestampVerified, anchorBasis: a.basis };
  });
  const impacts = calculateStudyImpacts(points, events, MONTHS_PROFILE);
  const groups = createTieGroups(impacts, MONTHS_PROFILE.tieThreshold);
  result.finalists.push({ key: f.key, datasetSha256: hash(`evidence/${f.key}-normalized.json`), impacts, tieGroups: groups, allWindowsPass: impacts.every(x => x.qualityStatus === 'usable') });
}
fs.writeFileSync(new URL('measurements-v1.json', root), JSON.stringify(result, null, 2) + '\n');
for (const f of result.finalists) {
  console.log(f.key, 'all windows pass:', f.allWindowsPass, 'ties:', JSON.stringify(f.tieGroups));
  for (const i of f.impacts) console.log(i.eventId, 'pp:', i.shortTermResponse === null ? null : +(i.shortTermResponse * 100).toFixed(3), i.qualityStatus, Object.fromEntries(Object.entries(i.windows).map(([k,w]) => [k, `${w.quality.validBuckets}/${w.quality.expectedBuckets}`])));
}
