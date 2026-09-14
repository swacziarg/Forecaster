import json,pathlib,hashlib,datetime
p=pathlib.Path(__file__).parent;base=p.parents[1];s=json.loads((base/'sports-dodgers/study-draft-v2.json').read_text());ledger=json.loads((p/'timing-ledger.json').read_text())['officialGameFeeds'];now=datetime.datetime.now(datetime.timezone.utc).isoformat()
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
freeze=[]
for e in s['events']:
 id=e['id'];g=ledger[id];old=e['informationKnownAt'];sid=id+'-public-event'
 if id=='glasnow-injury':
  t=g['pressReleasePublishedAt'];path=p/g['pressReleaseSnapshot'];url=g['pressRelease'];meaning='Original team roster announcement publication. Official transaction date corroborates April28; no precise earlier social announcement was established. Prior game exit occurred April27.'
 else:
  path=p/g['rawLive'];d=json.loads(path.read_text());plays=d['liveData']['plays']['allPlays'];t=plays[-1]['about']['endTime'];url=g['liveEndpoint'];meaning='Historical public live-game result timestamp recorded in official MLB play-by-play, not retrieval or publication time of this current API snapshot.'
  if id=='ohtani-return':
   replacement=next(a for play in plays for a in play['playEvents'] if a.get('details',{}).get('description')=='Pitching Change: Anthony Banda replaces Shohei Ohtani.')
   t=replacement['endTime'];meaning='Historical pitching replacement makes the one-inning line final; inning top ended02:22:02, Banda replaced Ohtani02:31:59.850UTC. Scored event is the debut, not the June15 announcement or end of the whole game.'
  assert d['gameData']['status']['abstractGameState']=='Final'
 e['occurredAt']=t;e['informationKnownAt']=t;e['precision']='minute'
 e['sourceRoles']=[{'sourceId':sid,'role':'primary'},{'sourceId':id+'-source','role':'retrospective'}]
 for c in e['claims']:c['knownAt']=t;c['sourceIds']=[sid]
 s['sources'].append({'id':sid,'title':'Dodgers roster announcement' if id=='glasnow-injury' else 'MLB public game record: '+e['title'],'publisher':'Los Angeles Dodgers' if id=='glasnow-injury' else 'MLB','url':url,'publishedAt':t,'publishedPrecision':'instant','retrievedAt':now,'snapshotHash':sha(path),'capturePath':str(path),'sourceIdentity':'original-team-announcement' if id=='glasnow-injury' else 'historical-public-live-event','snapshotKind':'original-release' if id=='glasnow-injury' else 'retrospective-official-play-by-play','timestampMeaning':meaning})
 freeze.append({'eventId':id,'oldCutoff':old,'newCutoff':t,'evidence':url,'capturePath':str(path),'sha256':sha(path),'reason':meaning})
 e['retrospectiveInterpretation']='Observed change around the public result or announcement; descriptive association, not isolated causal impact.'
 if id=='ohtani-return':
  e['mechanism']='Ohtani’s first pitching appearance for Los Angeles demonstrates his return to a two-way role.'
  e['claims'][0]['text']='Ohtani completes one inning, allowing one run, in his Dodgers pitching debut.'
  e['competingExplanation']='The Dodgers announced his scheduled return June15 at19:30PDT, before this debut. The game result and other team news also enter the follow-up window.'
 if id=='glasnow-injury':e['claims'][0]['text']='The Dodgers place Tyler Glasnow on the 15-day injured list with right shoulder inflammation.'
 if id=='seven-losses':e['claims'][0]['text']='Los Angeles loses 8–7 to San Francisco, its seventh consecutive defeat.'
 if id=='nlds-escape':
  e['title']='Dodgers advance on an 11th-inning walk-off error';e['shortTitle']='NLDS walk-off escape';e['claims'][0]['text']='Los Angeles beats Philadelphia 2–1 to win the NLDS three games to one.'
 if id=='pennant-sweep':e['claims'][0]['text']='Los Angeles beats Milwaukee 5–1 to complete a four-game sweep and reach the World Series.'
s['id']='dodgers-repeat-2025-v3';s['version']=3;s['market'].pop('settledAt',None)
s['measurementNotes']=['Scores describe observed contract-price changes, not isolated causal effects.','Version3 replaces late article updates with official game-event times; Glasnow uses the original team press release. Raw prices, window profile and one-point tie rule remain unchanged.','MLB feeds are retrieved retrospective records of public live events. Their play endTime fields are not API publication times; later season outcome is not used in any scored claim.','Ohtani card concerns his actual pitching debut. The June15 return announcement predates it; original announcement evidence is retained in the audit folder and not conflated with the debut.','The 12-hour reference can include in-game trading. A separate six-hour pre-start comparison is diagnostic only. Repricing from previous losses/series games and simultaneous league news is not isolated.','The first source-supported Glasnow publication bound may be later than the original roster disclosure. Prior injury exit on April27 already conveyed negative news; wider timing sensitivity is reported.','The original selection remains five cards. No event was substituted to optimize a score; wording has been aligned with contemporaneous game facts.']
(p/'anchor-freeze.json').write_text(json.dumps({'policy':'Evidence-driven timing repair before corrected scoring; prior scores known.','entries':freeze},indent=2,ensure_ascii=False)+'\n');(p/'study-draft-v3.json').write_text(json.dumps(s,indent=2,ensure_ascii=False)+'\n')
