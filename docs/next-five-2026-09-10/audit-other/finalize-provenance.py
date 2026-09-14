import json,pathlib,hashlib
p=pathlib.Path(__file__).parent
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
records=[]
for name,file in [('trump','study-draft-v2.json'),('fed','study-draft-v2.json'),('nyc','study-draft-v2.json'),('dodgers','study-draft-v3.json')]:
 path=p/name/file;s=json.loads(path.read_text());d=s['dataset'];old=dict(d)
 if name in ['trump','nyc']:
  rawfiles=sorted(pathlib.Path('docs/launch-queue-research/evidence').glob(name+'-history-[0-9][0-9][0-9].json'))
  bundle=p/'data'/(name+'-raw-bundle.json')
  bundle.write_text(json.dumps({'format':'original-provider-response-bundle-v1','note':'Original provider response objects and source file byte hashes; no changes to timestamp/price observations.','chunks':[{'originalPath':str(f),'originalSha256':sha(f),'response':json.loads(f.read_text())} for f in rawfiles]},separators=(',',':'))+'\n')
  d['rawPath']=str(bundle);d['rawSha256']=sha(bundle);d['rawHashMeaning']='SHA-256 of rawPath bundle; individual original response file byte hashes are also retained inside it.'
  d['normalizedSha256']=sha(pathlib.Path(d['path']));d['normalizedHashMeaning']='SHA-256 of the exact CSV at dataset.path. Previous draft put the CSV hash in rawSha256 and the separately normalized JSON hash in normalizedSha256.'
  d['manifestPath']=str(p/'data/audited-file-hashes.json')
  s['measurementNotes'].append('Audit corrected raw versus normalized file-hash labels. Original provider responses and CSV bytes remain unchanged.') if not any('file-hash labels' in x for x in s['measurementNotes']) else None
 def physical(f):return pathlib.Path('public'+f if f.startswith('/data/') else f)
 checks={field:{'path':d[field],'sha256':sha(physical(d[field]))} for field in ['path','rawPath','marketMetadataPath']}
 assert checks['path']['sha256']==d['normalizedSha256'];assert checks['rawPath']['sha256']==d['rawSha256'];assert checks['marketMetadataPath']['sha256']==d['marketMetadataSha256']
 records.append({'edition':name,'files':checks,'originalHashLabels':{k:old.get(k) for k in ['rawSha256','normalizedSha256']},'note':'Only provenance labels/bundle packaging corrected. Original data untouched.'})
 path.write_text(json.dumps(s,indent=2,ensure_ascii=False)+'\n')
(p/'data/audited-file-hashes.json').write_text(json.dumps(records,indent=2)+'\n')
