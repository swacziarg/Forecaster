import json,pathlib,datetime,subprocess,concurrent.futures,hashlib
p=pathlib.Path(__file__).parent
market=json.loads((p/'raw-market.json').read_text()); token=json.loads(market['clobTokenIds'])[json.loads(market['outcomes']).index('Yes')]
start=int(datetime.datetime.fromisoformat(market['createdAt'].replace('Z','+00:00')).timestamp()); end=int(datetime.datetime(2025,11,3,tzinfo=datetime.timezone.utc).timestamp())
jobs=[]
for i,s in enumerate(range(start,end,864000)):
 e=min(s+864000,end);url=f'https://clob.polymarket.com/prices-history?market={token}&startTs={s}&endTs={e}&fidelity=60';jobs.append((f'history-{i:03}.json',url))
for card in json.loads((p/'selection-freeze.json').read_text())['cards']:jobs.append((card['id']+'.html',card['sourceUrl']))
jobs.append(('ending.html','https://www.mlb.com/news/dodgers-win-2025-world-series'))
def get(job):
 name,url=job;r=subprocess.run(['curl','-L','--fail','--silent','--show-error','--max-time','35','-A','Mozilla/5.0',url,'-o',str(p/name)],capture_output=True,text=True);return {'path':name,'url':url,'success':r.returncode==0,'error':r.stderr if r.returncode else None,'sha256':hashlib.sha256((p/name).read_bytes()).hexdigest() if r.returncode==0 else None}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: results=list(pool.map(get,jobs))
(p/'retrieval-ledger.json').write_text(json.dumps({'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tokenId':token,'requests':results},indent=2)+'\n')
print(json.dumps({'requests':len(results),'failed':[x for x in results if not x['success']],'histories':[{'path':x['path'],'rows':len(json.loads((p/x['path']).read_text()).get('history',[]))} for x in results if x['success'] and x['path'].startswith('history')]},indent=2))
