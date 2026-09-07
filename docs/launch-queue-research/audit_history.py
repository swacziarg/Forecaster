"""Normalize retained public records and screen broad volatility, without headline windows."""
import collections, datetime, hashlib, json, pathlib, statistics
ROOT=pathlib.Path(__file__).resolve().parent
def iso(t): return datetime.datetime.fromtimestamp(t,datetime.timezone.utc).isoformat().replace('+00:00','Z')
def audit(key,points,raw_count,rejected,revisions,mark_notes):
    points=sorted(points,key=lambda x:x['timestamp'])
    seconds=[int(datetime.datetime.fromisoformat(p['timestamp'].replace('Z','+00:00')).timestamp()) for p in points]
    missing=[]
    for a,b in zip(seconds,seconds[1:]): missing.extend(range(a+3600,b,3600))
    daily=collections.defaultdict(list)
    for p in points:daily[p['timestamp'][:10]].append(p['probability'])
    daily=[{'date':d,'median':statistics.median(v),'observations':len(v),'min':min(v),'max':max(v)} for d,v in sorted(daily.items())]
    # At least 12 marks per day; remove final 3 calendar days from the suitability screen.
    qualified=[x for x in daily[:-3] if x['observations']>=12]
    high=low=None;fall=rise=None
    for d in qualified:
        if high and (fall is None or high['median']-d['median']>fall['pp']/100):fall={'from':high,'to':d,'pp':100*(high['median']-d['median'])}
        if low and (rise is None or d['median']-low['median']>rise['pp']/100):rise={'from':low,'to':d,'pp':100*(d['median']-low['median'])}
        if high is None or d['median']>high['median']:high=d
        if low is None or d['median']<low['median']:low=d
    out=ROOT/'evidence'/f'{key}-normalized.json'
    out.write_text(json.dumps(points,indent=2)+'\n')
    summary={'key':key,'rawObservations':raw_count,'observations':len(points),'coverageStart':points[0]['timestamp'] if points else None,'coverageEnd':points[-1]['timestamp'] if points else None,'frequency':'UTC hourly buckets','missingHours':len(missing),'maximumMissingRunHours':max([0]+[int((b-a)/3600)-1 for a,b in zip(seconds,seconds[1:])]),'rejectedObservations':rejected,'duplicateOrRevisionBuckets':revisions,'markPolicy':mark_notes,'normalizedSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'minQualifyingDailyMedian':low,'maxQualifyingDailyMedian':high,'maximumDailyMedianRise':rise,'maximumDailyMedianDrawdown':fall,'fullMarketLifetime':False}
    (ROOT/'evidence'/f'{key}-audit.json').write_text(json.dumps({'summary':summary,'missingBuckets':[iso(t) for t in missing],'daily':daily},indent=2)+'\n')
    return summary
if __name__=='__main__':
    summaries=[]
    for key in json.loads((ROOT/'catalogue.json').read_text()):
        buckets={};raw=reject=rev=0
        for f in sorted((ROOT/'evidence').glob(key+'-history-*.json')):
            for p in json.loads(f.read_text()).get('history',[]):
                raw+=1;t=int(p['t']);v=float(p['p'])
                if not 0<=v<=1:reject+=1;continue
                b=t//3600*3600
                if b in buckets:rev+=1
                if b not in buckets or t>=buckets[b][0]:buckets[b]=(t,v)
        points=[{'timestamp':iso(b),'probability':p[1],'rawPrice':p[1],'markType':'trade','stale':False} for b,p in buckets.items()]
        summaries.append(audit(key,points,raw,reject,rev,'Project Polymarket importer convention: latest source price per hour, treated as trade; API does not establish actual trade freshness or historical spread/volume. No filling.'))
    for key in ['anora-kalshi','oscars26']:
        d=json.loads((ROOT/'evidence'/f'{key}-history.json').read_text());points=[];reject=0
        for c in d['candlesticks']:
            num=lambda x:None if x is None else float(x)
            close=num(c['price']['close']);bid=num(c['yes_bid']['close']);ask=num(c['yes_ask']['close'])
            mid=(bid+ask)/2 if bid is not None and ask is not None and 0<=ask-bid<=.2 else None
            v=close if close is not None else mid
            if v is None or not 0<=v<=1:reject+=1;continue
            p={'timestamp':iso(c['end_period_ts']),'probability':round(v,4),'markType':'trade' if close is not None else 'midpoint','stale':False,'volume':float(c.get('volume') or 0),'openInterest':float(c.get('open_interest') or 0)}
            for k,n in [('rawPrice',close),('bid',bid),('ask',ask)]:
                if n is not None:p[k]=n
            points.append(p)
        summaries.append(audit(key,points,len(d['candlesticks']),reject,0,'Project Kalshi convention: actual candle trade close; otherwise closing quote midpoint only at <=20pp spread. No previous-close carry or missing-hour fill.'))
    (ROOT/'broad-screen.json').write_text(json.dumps(summaries,indent=2)+'\n')
    for s in summaries:print(s['key'],s['observations'],s['coverageStart'],s['coverageEnd'],'missing',s['missingHours'],'maxgap',s['maximumMissingRunHours'],'reject',s['rejectedObservations'],'rise',round((s['maximumDailyMedianRise'] or {}).get('pp',0),2),'fall',round((s['maximumDailyMedianDrawdown'] or {}).get('pp',0),2))
