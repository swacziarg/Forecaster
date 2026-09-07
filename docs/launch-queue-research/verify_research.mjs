// Verify the research handoff against retained evidence and unchanged application math.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { parseMarketCsv, calculateStudyImpacts, createTieGroups, MONTHS_PROFILE } from '../../src/domain/eventStudy.ts';
const root = new URL('./', import.meta.url);
const raw = name => fs.readFileSync(new URL(name, root));
const read = name => JSON.parse(raw(name));
const hash = name => crypto.createHash('sha256').update(raw(name)).digest('hex');
const frozen = read('frozen-selection-v1.json');
const result = read('measurements-v1.json');
assert.equal(result.selectionSha256, hash('frozen-selection-v1.json'));
assert.equal(result.anchorsSha256, hash('anchors-v2.json'));
assert.equal(result.measurementSourceSha256, hash('../../src/domain/eventStudy.ts'));
assert.deepEqual(result.profile, MONTHS_PROFILE);
assert.equal(frozen.finalists.length, 5);
const index = read('finalist-index.json');
assert.equal(index.length, 5);
const checks = [];
for (const item of index) {
  const packet = read(item.brief.replace(/\.md$/, '.json'));
  const selection = frozen.finalists.find(f => f.key === item.key);
  assert.equal(packet.events.length, 5);
  assert.deepEqual(packet.events.map(e => e.id), selection.events.map(e => e.id));
  assert.equal(new Set(packet.presentationDraft.initialOrder).size, 5);
  assert.deepEqual([...packet.presentationDraft.initialOrder].sort(), packet.events.map(e => e.id).sort());
  assert.equal(packet.queueableNow, false);
  assert.equal(packet.proposedReleaseTime, null);
  assert.equal(packet.selectionFreeze.sha256, hash('frozen-selection-v1.json'));
  assert.equal(packet.dataset.csvSha256, hash(packet.dataset.researchCsv));
  for (const event of packet.events) {
    for (const source of event.sources) if (source.file) assert.equal(source.snapshotHash, hash(source.file));
  }
  const stored = result.finalists.find(f => f.key === item.key);
  const csv = parseMarketCsv(raw(packet.dataset.researchCsv).toString());
  assert.equal(csv.length, packet.dataset.audit.observations);
  assert(csv.every(x => x.probability >= 0 && x.probability <= 1));
  const replay = calculateStudyImpacts(csv, stored.impacts.map(x => x.event), MONTHS_PROFILE);
  for (let i = 0; i < replay.length; i++) {
    assert.equal(replay[i].shortTermResponse, stored.impacts[i].shortTermResponse);
    assert.equal(replay[i].qualityStatus, stored.impacts[i].qualityStatus);
    assert.deepEqual(replay[i].windows, stored.impacts[i].windows);
    assert.deepEqual(replay[i].overlaps, []);
  }
  assert.deepEqual(createTieGroups(replay, MONTHS_PROFILE.tieThreshold), stored.tieGroups);
  checks.push({key:item.key,headlines:5,csvRows:csv.length,exactNativeReplay:true,allWindowsPass:stored.allWindowsPass,queueableNow:false});
}
let receiptCount = 0;
for (const name of fs.readdirSync(root).filter(n => n.endsWith('-receipts.json'))) {
  for (const receipt of read(name)) if (receipt.path) {
    assert.equal(hash(receipt.path), receipt.sha256, receipt.path);
    receiptCount++;
  }
}
const validation = {checkedAt:new Date().toISOString(),result:'pass',receiptCount,checks,limitations:'This verifies file integrity, frozen selection, CSV compatibility and numerical replay. It does not supply independent editorial approval, establish first-public source times, prove CLOB trade freshness or make Anora eligible.'};
fs.writeFileSync(new URL('validation.json',root),JSON.stringify(validation,null,2)+'\n');
console.log(JSON.stringify(validation,null,2));
