"""Read-only public GET research; writes only within this research directory."""
import concurrent.futures, datetime, hashlib, json, pathlib, sys, urllib.request, urllib.parse
ROOT = pathlib.Path(__file__).resolve().parent
def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'NexusPoint historical editorial research'})
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.read()
def retrieve(item):
    key, url = item
    path = ROOT / 'evidence' / (key if key.endswith(('.html','.pdf','.txt')) else key + '.json')
    try:
        body = get(url)
        path.write_bytes(body)
        return {'key':key,'url':url,'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'bytes':len(body),'sha256':hashlib.sha256(body).hexdigest(),'path':str(path.relative_to(ROOT))}
    except Exception as e:
        return {'key':key,'url':url,'error':str(e),'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
if __name__ == '__main__':
    jobs = json.loads((ROOT / sys.argv[1]).read_text())
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        results = list(pool.map(retrieve, jobs))
    (ROOT / (sys.argv[1].removesuffix('.json') + '-receipts.json')).write_text(json.dumps(results,indent=2)+'\n')
    for r in results: print(json.dumps(r))
