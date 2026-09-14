import json,hashlib,datetime,pathlib
p=pathlib.Path(__file__).parent;root=p.parents[1];old=root/'politics/nyc-study-draft.json';s=json.loads(old.read_text());now=datetime.datetime.now(datetime.timezone.utc).isoformat()
def sha(f):return hashlib.sha256(pathlib.Path(f).read_bytes()).hexdigest()
def stamp(id):return datetime.datetime.fromtimestamp(((int(id)>>22)+1288834974657)/1000,datetime.timezone.utc).isoformat().replace('+00:00','Z')
old_e=pathlib.Path('docs/launch-queue-research/evidence')
records=[
 ('aoc-endorsement','aoc-confirmation','NY1: campaigns confirm AOC endorsement','Spectrum NY1','https://ny1.com/nyc/All-Boroughs/politics/2025/06/05/mamdani-picks-up-endorsement-from-alexandria-ocasio-cortez-','2025-06-05T11:05:00Z',p/'aoc-ny1.html','Original reporting publication, confirmed directly with both campaigns. Earliest retained supported bound; original NYT interview inaccessible, so exact first-public minute remains uncertain.'),
 ('primary-breakthrough','primary-reporter-post','Reporter at Cuomo concession','Annie McDonough / City & State','https://twitter.com/Annie_McDonough/status/1937698802670146006',stamp('1937698802670146006'),p/'primary-citystate.html','Original eyewitness post ID and text embedded in live blog. Snowflake supplies post time; live blog labels concession 10:25pm. This is reporting of the concession, not certified primary results.'),
 ('cuomo-independent','cuomo-announcement','Cuomo independent campaign video','Andrew Cuomo','https://twitter.com/andrewcuomo/status/1944829573222338765',stamp('1944829573222338765'),old_e/'nyc-cuomo.html','Original candidate video post ID embedded in NY1 report. Post caption and reporting establish independent continuation. Snowflake time is original post creation, not article update.'),
 ('hochul-endorsement','hochul-announcement','Hochul endorses Mamdani','Kathy Hochul','https://twitter.com/KathyHochul/status/1967369861493072135',stamp('1967369861493072135'),old_e/'nyc-hochul.html','Original governor post embedded in NY1 report links her endorsement op-ed. Original op-ed timestamp inaccessible; this is a supported public-by bound, not guaranteed first public instant.'),
 ('adams-exit','adams-announcement','Adams withdrawal announcement','Eric Adams','https://twitter.com/ericadamsfornyc/status/1972348511892262962',stamp('1972348511892262962'),old_e/'nyc-adams-ny1.html','Original candidate video post embedded in contemporaneous NY1 reporting; separately preserved in Perma archive and later court record. Snowflake time is post creation. Court filing publication is not backdated.')]
freeze={'policy':'Evidence-driven corrections before viewing corrected scores; prior draft scores already known. Preserve raw prices, five cards, measurement profile, initial order and ties.','entries':[]}
for eid,sid,title,publisher,url,t,path,meaning in records:
 e=next(e for e in s['events'] if e['id']==eid);freeze['entries'].append({'eventId':eid,'oldCutoff':e['informationKnownAt'],'newCutoff':t,'source':url,'capture':str(path),'sha256':sha(path),'reason':meaning})
 e['occurredAt']=t;e['informationKnownAt']=t;e['precision']='minute'
 e['sourceRoles']=[{'sourceId':sid,'role':'primary'}]
 for c in e['claims']:c['knownAt']=t;c['sourceIds']=[sid]
 s['sources'].append({'id':sid,'title':title,'publisher':publisher,'url':url,'publishedAt':t,'publishedPrecision':'instant','retrievedAt':now,'snapshotHash':sha(path),'capturePath':str(path),'snapshotKind':'original-report' if eid=='aoc-endorsement' else 'embedded-original-post','captureMeaning':meaning})
 if eid=='primary-breakthrough':
  e['mechanism']='A primary-night breakthrough strengthens Mamdani’s position for November; Cuomo could still run independently.'
  e['retrospectiveInterpretation']='The measured window includes rolling primary returns before the concession. It is a primary-night information cluster, not the isolated effect of conceding.'
# Correct source identity and remove fake historical publication dates on retrospective records.
for src in s['sources']:
 if src['id']=='aoc-post':src['title']='Mamdani acknowledges AOC endorsement';src['publisher']='Zohran Mamdani / Bluesky';src['timestampMeaning']='indexedAt is the observed API indexing bound; createdAt belongs to Mamdani’s acknowledgement, not AOC’s original announcement.'
 if src['id'] in ['adams-court','adams-archive','nyc-ending']:
  src['publishedAt']='';src['publishedPrecision']='unknown';src['timestampMeaning']='Historical announcement/election time is not publication time of this retrospective record. Exact publication time unverified.'
 if src['id']=='primary-fox':src['publishedAt']='2025-06-25T02:44:46Z';src['timestampMeaning']='Retained article metadata; final updated content is not used for the tighter pre-reveal cutoff.'
 if src['id']=='primary-cnn':src['timestampMeaning']='End of broadcast bracket, not HTML publication time. Superseded for scoring by earlier eyewitness report.'
s['market'].pop('settledAt',None)
s['id']='nyc-mamdani-2025-v2';s['version']=2
s['measurementNotes']=[n for n in s['measurementNotes'] if '33.80' not in n]+['Version 2 uses original candidate posts or earlier contemporaneous confirmation instead of later coverage. Announcement versus post-publication uncertainty is disclosed in each source.','Primary-night response includes rolling returns; it is not isolated concession causality. Original NYT endorsement timings could not be independently established, so AOC/ Hochul use the earliest retained supported bounds with wider sensitivity checks.','Market closedAt comes from provider closedTime; an exact settlement time is not asserted. Retrospective court/archive/election records have unknown publication times and are excluded from pre-reveal evidence.']
(p/'anchor-freeze.json').write_text(json.dumps(freeze,indent=2,ensure_ascii=False)+'\n');(p/'study-draft-v2.json').write_text(json.dumps(s,indent=2,ensure_ascii=False)+'\n')
