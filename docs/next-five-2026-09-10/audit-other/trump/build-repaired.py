import json,pathlib
p=pathlib.Path(__file__).parent;s=json.loads(pathlib.Path('docs/launch-work/playable-drafts/trump/study-draft.json').read_text())
changes={'butler':('2024-07-13T23:35:06Z','cnn-butler-broadcast'),'rfk-endorsement':('2024-08-23T19:10:00Z','cnn-rfk-broadcast'),'iowa-poll':('2024-11-02T23:05:01Z','cnn-iowa-broadcast')}
freeze=[]
for e in s['events']:
 if e['id'] in changes:
  t,sid=changes[e['id']];freeze.append({'eventId':e['id'],'oldCutoff':e['informationKnownAt'],'newCutoff':t,'reason':'Next retained CNN transcript marker after full supported claim. Marker is an upper bound, not an exact first-public second.'});e['informationKnownAt']=t;e['precision']='interval'
  for c in e['claims']:c['knownAt']=t
  for src in s['sources']:
   if src['id']==sid:src['publishedAt']=t
 if e['id']=='conviction':
  e['claims'][0]['text']='A New York jury finds Trump guilty on 34 felony counts of falsifying business records in the first degree.'
  e['sourceRoles']=[{'sourceId':'cnn-conviction-broadcast','role':'primary'},{'sourceId':'nyc-da-conviction','role':'retrospective'},{'sourceId':'nyc-court-verdict','role':'retrospective'}]
 if e['id']=='rfk-endorsement':e['claims'][0]['text']='Kennedy says he is suspending his presidential campaign and supporting Donald Trump.'
 if e['id']=='iowa-poll':e['claims'][0]['text']='The Des Moines Register/Mediacom Iowa poll shows Harris at 47% and Trump at 44%, within its 3.4-point margin of error.'
 if e['id']=='harris-debate':
  e['claims'][0]['text']='ABC hosts the first presidential debate between Harris and Trump on September 10.'
  e['claims'][0]['knownAt']=e['informationKnownAt'];e['claims'][0]['sourceIds']=['debate-live-event'];e['sourceRoles'].append({'sourceId':'debate-live-event','role':'primary'})
  replay=next(x for x in s['sources'] if x['id']=='abc-replay')
  src={**replay,'id':'debate-live-event','title':'ABC Harris–Trump debate broadcast','publishedAt':e['informationKnownAt'],'publishedPrecision':'instant','sourceIdentity':'historical-public-broadcast','snapshotKind':'retrospective-broadcast-record','snapshotSourceId':'abc-replay','timestampMeaning':'Approximate live broadcast end per Nielsen 9:00–10:45pm EDT interval, not publication of the replay page. Full replay is retrospective corroboration of a publicly observable event.'};src.pop('updatedAt',None);s['sources'].append(src)
for src in s['sources']:
 if src['id'].startswith('cnn-'):
  src['sourceIdentity']='historical-public-broadcast';src['snapshotKind']='retrospective-transcript';src['timestampMeaning']='Historical broadcast upper bound based on transcript markers, not HTML upload time. Transcript retained later and may contain corrections.'
  if src['id']=='cnn-conviction-broadcast':src['publishedAt']='2024-05-30T21:15:07Z'
 if src['id']=='nyc-court-verdict':src['publishedAt']='';src['publishedPrecision']='unknown';src['timestampMeaning']='Later judicial record; May30 is verdict occurrence, not verified publication of this court page.'
s['version']=2;s['id']='trump-comeback-2024-v2';s['market'].pop('settledAt',None)
s['measurementNotes']=s.get('measurementNotes',[])+['Audit tightens Butler, RFK and Iowa to complete-claim broadcast bounds. Conviction and debate unchanged. Price series and tie threshold unchanged.','Iowa sample size removed because the retained CNN segment does not state 808. Conviction claim describes the verdict rather than claiming a timestamped DA release. Debate historical live-event evidence is separate from retrospective replay publication.','Butler is anchored to confirmed contemporary coverage, later than actual shots; earlier rally footage and other campaign news can affect the reference window. Marginal ties must be treated as window-dependent.']
(p/'anchor-freeze.json').write_text(json.dumps({'policy':'Evidence corrections chosen without corrected-score consultation; previous scores known.','changes':freeze},indent=2)+'\n');(p/'study-draft-v2.json').write_text(json.dumps(s,indent=2,ensure_ascii=False)+'\n')
