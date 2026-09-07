"""Build research deliverables only; never writes application files or queue state."""
import csv, datetime, hashlib, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
def read(name): return json.loads((ROOT/name).read_text())
def save(name,obj): (ROOT/name).write_text(json.dumps(obj,indent=2,ensure_ascii=False)+'\n')
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
frozen=read('frozen-selection-v1.json')
anchors=read('anchors-v2.json')
measure=read('measurements-v1.json')
catalogue=read('catalogue.json')
swings=read('pre-ending-swings.json')['candidates']
receipts={}
for file in sorted(ROOT.glob('*-receipts.json')):
    for r in read(file.name):
        if r.get('path'): receipts[r['path'].split('/')[-1]]=r

CONFIG={
 'tiktok':{
  'slot':2,'title':'The app that went dark','category':'Culture / technology','range':'2024-09-18–2025-01-22; scored developments 2024-11-06–2025-01-10',
  'marketUrl':'https://polymarket.com/event/tiktok-banned-in-the-us-before-may-2025',
  'hook':'An everyday app became a Supreme Court cliffhanger, with a returning president offering a possible escape. Players need no knowledge of court doctrine to care whether TikTok disappears from their phones.',
  'fun':'Which mattered more: a president winning, a court rejecting the app, or the justices finally hearing the case? A hearing can sound like a rescue without being a win. The ending has a second twist: temporary darkness and a return to service still left this particular contract settled YES.',
  'tension':'The frozen calculations put the oral argument and appeals defeat in the same top tie group, while the grant of review is only +0.25 pp. Trump’s election measures −11.75 pp. The contrast between dramatic headlines and procedural non-movement makes this the strongest #002.',
  'rules':'YES required a federal law, policy or court-mandated ban on download and/or use affecting most Americans to take effect by April 30, 2025, 11:59 p.m. ET. A sale achieving legal compliance instead meant NO. Federal-government information was primary, with credible reporting allowed. This was not a contract on permanent disappearance or on whether the app was still unavailable in May.',
  'readiness':'needs a specific evidence/data step',
  'decision':'Advance first. All 25 measurement windows pass and both substantial rises and falls survive. Public upper-bound timestamps and primary legal records are retained. Before strict integration, confirm first-public anchors for the three court/brief releases and the original AP call artifact, then obtain independent editorial review. No additional price download is required for the documented anchors.',
  'blockers':['Confirm first-public release times for December 6, December 18 and December 27 against contemporaneous archived court/filing notices; the measured anchors currently use conservatively bounded live broadcasts.','Attach the original AP presidential-call announcement as the pre-reveal source; the retained AP explainer is a retrospective host of that original announcement.','Keep the ending explicit that the provider records two disputes followed by final YES. An on-chain dispute chronology is useful supplementary evidence, but final settlement itself is verified on the provider page and Gamma.','Independent editor must approve timestamps, mechanisms, evidence and wording before queueing.'],
  'ending':'On January 17 the Supreme Court upheld the law. TikTok went dark in the United States around January 19 and then restored service that day. Polymarket records two disputed YES proposals followed by final YES; its metadata closes the contract January 22 at 00:31:19 UTC. The contract concerned a qualifying ban having taken effect, so the return of service did not make its final outcome NO. Do not turn the ruling, blackout, restoration or settlement into a scored sixth card.',
  'endingSources':['tiktok-opinion.pdf','tiktok-ending.html','tiktok-market.html'],
  'intro':'November 2024–January 2025. Rank five headlines from the biggest rise in the odds of a US TikTok ban before May to the biggest fall.',
  'shortContract':'A US TikTok ban before May 2025',
  'confounds':{
   'trump-elected':'An election is a rolling overnight information process. By AP’s 05:34 EST call the outcome was heavily anticipated, and the preceding 12-hour reference includes election returns. Measure the response around that public confirmation, not the full election-night effect. The earlier campaign promise is not a pre-reveal fact in this packet until its contemporary primary artifact is captured.',
   'appeal-lost':'A scheduled legal decision is partly anticipated. Merits, divestiture timing and possible future appeals entered the same information cluster. The broadcast-end anchor follows the actual court release.',
   'supreme-review':'Taking a case is not staying the statute or deciding the merits. The order also set an accelerated schedule. Treat the small signed response as effectively undetectable under the one-point threshold, not evidence that review harmed TikTok.',
   'trump-pause':'The brief is an incoming president’s request, not a judicial order. Holiday participation and political deal expectations are competing explanations; historical spreads and trade-level liquidity are not available in these marks.',
   'supreme-argument':'The 150-minute hearing unfolds publicly; the reference window includes much of the proceeding. Oral questions are not votes or a final judgment. All delayed samples end January 13, before the January 17 resolving ruling.'},
  'supplemental':{'trump-elected':['ap-trump-call.html'],'appeal-lost':['tiktok-docket.html','tiktok-dec6.html'],'supreme-review':['tiktok-docket.html','tiktok-order.pdf','tiktok-dec18.html'],'trump-pause':['tiktok-trump-brief.pdf','tiktok-docket.html'],'supreme-argument':['tiktok-argument-page.html','tiktok-docket.html']}
 },
 'eagles':{
  'slot':3,'title':'Stop the three-peat','category':'Sports','range':'2024-07-09–2025-02-10; scored developments 2024-09-16–2025-01-26',
  'marketUrl':'https://polymarket.com/event/superbowl-champion-2025/will-the-eagles-win-super-bowl-2025',
  'hook':'The Super Bowl, Patrick Mahomes, Jalen Hurts and Saquon Barkley supply household sports recognition. A season of late collapses, a record run, a quarterback scare and a snow escape offers something more varied than five playoff wins.',
  'fun':'Players can debate whether an injury scare outweighed an embarrassing loss, and whether barely surviving in snow mattered more than scoring 55. All five headlines concern the Eagles’ championship probability, not their chance of winning the individual game.',
  'tension':'The snow playoff and NFC title responses are effectively tied (+5.875 versus +6.075 pp); Barkley’s spectacular record night is much smaller (+1.35). The two setbacks are −1.75 and −2.90. Keep those honest modest early moves; do not exaggerate them into double-digit shocks.',
  'rules':'YES if Philadelphia wins Super Bowl LIX; otherwise NO. Elimination under NFL rules allowed immediate NO. This is the season-long championship futures contract, not the later Eagles–Chiefs match-winner contract.',
  'readiness':'needs a specific evidence/data step',
  'decision':'Advance second. All 25 windows are complete and the five cards have both signs and four tie groups. The concrete remaining evidence step is independent confirmation of immutable final-whistle/public completion times; the present calculation uses team recap publication or last-modified cutoffs several hours later.',
  'blockers':['Verify final-whistle times for all five games against official immutable gamebooks or archived broadcasts and decide whether those first-public anchors should supersede the conservative recap cutoffs.','Preserve the injury/loss as one cluster and explicitly disclose other NFL results in the same windows.','Recalculate once if evidence requires corrected anchors; record the version, retain this result and do not substitute headlines to preserve a desired ranking.','Independent editor approval is still required; the existing Eagles draft review has not supplied it.'],
  'ending':'Philadelphia beat Kansas City 40–22 in Super Bowl LIX on February 9, 2025, denying the Chiefs a third consecutive Super Bowl victory. The provider resolved this Eagles championship contract YES. Keep the Super Bowl itself entirely in the ending.',
  'endingSources':['eagles-ending-correct.html'],
  'intro':'September 2024–January 2025. Rank five headlines from the biggest rise in the Eagles’ Super Bowl championship odds to the biggest fall.',
  'shortContract':'Eagles win Super Bowl LIX',
  'confounds':{
   'falcons-collapse':'The lead evaporated during a televised game, before the recap cutoff. The reference includes live play and the immediate aftermath; this is not a clean pre-kickoff-to-final comparison.',
   'barkley-record':'The 255 yards accumulated over the whole game. Team performance, the score, other contenders’ results and health news share the window. The feature article was published hours after viewers saw the record.',
   'hurts-concussion':'The injury, replacement-quarterback performance and 36–33 defeat cannot be disentangled with these windows. Seeding implications and subsequent injury updates also matter.',
   'snow-playoff':'Advancing mechanically improves a championship future. Other divisional results changed the opponent field, and the recap cutoff comes after the final whistle. Do not attribute the response specifically to snow or Barkley alone.',
   'nfc-title':'The conference berth removed a remaining hurdle; the AFC result also determined the Super Bowl opponent during the same evening. The chosen recap cutoff follows both. Treat the observed movement as a mixed playoff-weekend response.'},
  'supplemental':{}
 },
 'trump':{
  'slot':4,'title':'The comeback nobody could call','category':'Politics','range':'2024-05-01–2024-11-06 measured coverage; scored developments 2024-05-30–2024-11-02',
  'marketUrl':'https://polymarket.com/event/presidential-election-winner-2024/will-donald-trump-win-the-2024-us-presidential-election',
  'hook':'A criminal verdict, an assassination attempt, an endorsement, a televised debate and a surprise poll are unusually recognizable and distinct campaign moments. The subject needs almost no introduction.',
  'fun':'A major endorsement sounds helpful, but the retained contract’s stabilized response is negative. The debate and the Iowa poll fall into the same tie group. Players can distinguish the importance of a news story from how much probability was left to move.',
  'tension':'The rally shooting measures +10.00 pp; Kennedy’s endorsement −1.175, conviction −2.00, debate −2.575 and Iowa poll −3.45. The frozen set produces three tie groups, not five clean ranks. This remains compelling but repeats the Trump shooting already present in Biden #001, so put two non-election editions first.',
  'rules':'YES if Donald J. Trump wins the 2024 US presidential election. AP, Fox News and NBC must all call the same winner; if they had not agreed by January 20, 2025, the inauguration determined resolution. Neither national popular vote nor winning Iowa defines this contract.',
  'readiness':'needs a specific evidence/data step',
  'decision':'Advance third, after variety. All 25 windows pass. Exact first-broadcast/public-release confirmation remains necessary, particularly the debate transcript with a later modification time and the source-host versus original-publication distinction for live transcripts.',
  'blockers':['Capture the immutable ABC debate broadcast/transcript as publicly available at the cutoff; current page records original publication 03:58 UTC but modification 16:24:39 UTC.','Verify the first-public release anchors for verdict, shooting, endorsement and poll; the retained live-program endings/brackets are defensible upper bounds, not claims of earliest public access.','Independent editor must review the repeated shooting card after Biden #001 and approve this frozen five-card subset under the strict profile; legacy publication does not waive this.'],
  'ending':'AP called the presidency for Trump at 05:34 EST on November 6, 2024. The single Polymarket Trump winner contract ultimately resolved YES and records closure at 15:17:41 UTC that day. AP’s call alone was not the contract’s full three-outlet resolution rule. The election result belongs only here.',
  'endingSources':['ap-trump-call.html'],
  'intro':'May–November 2024. Rank five headlines from the biggest rise in Trump’s chances of winning the presidency to the biggest fall.',
  'shortContract':'Trump wins the 2024 presidency',
  'confounds':{
   'conviction':'The verdict was anticipated during jury deliberations; the reference therefore includes changing expectations. Legal consequences, fundraising and partisan reactions may pull in different directions.',
   'butler':'The cutoff is the end of a live reporting hour, after the shooting itself. The weekend also involved uncertainty about Biden’s candidacy and the approaching Republican convention. A positive response does not isolate sympathy, turnout or opponent effects.',
   'rfk-endorsement':'His decision was discussed before the speech. The Democratic convention ended the previous night and overlaps the reference/anticipation period. The subsequent Trump rally and other campaign news share the post-event window. Do not rewrite the headline to explain away its negative measurement.',
   'harris-debate':'The debate is a long public broadcast and expectations move during it. Post-debate commentary, endorsements and other campaign activity share the response windows. The current transcript was updated later; no later-added quotation is included in the pre-reveal headline.',
   'iowa-poll':'A state poll is not a national forecast; the 47–44 finding was within its reported 3.4-point margin of error. Other final polls and election positioning coincide. The primary stabilized window ends before election day, but the delayed window reaches 19:00 EST on November 5 and can include early voting information/returns.'},
  'supplemental':{}
 },
 'nyc':{
  'slot':5,'title':'The New York upset','category':'Politics','range':'2025-04-22–2025-11-05; scored developments 2025-06-05–2025-09-28',
  'marketUrl':'https://polymarket.com/event/new-york-city-mayoral-election/will-zohran-mamdani-win-the-2025-nyc-mayoral-election',
  'hook':'New York, Alexandria Ocasio-Cortez, Andrew Cuomo and a young insurgent challenging the establishment make a recognizable political drama, though less universal than TikTok or the Super Bowl.',
  'fun':'An endorsement from AOC, a rival refusing to disappear, the governor coming aboard and the sitting mayor leaving sound like big turning points. Players may overrate them compared with the primary breakthrough.',
  'tension':'The general-election contract moves +33.80 pp around the primary concession, while the other four frozen responses range only from −1.025 to +1.80. The full series has a 20.90-point pre-result drawdown, but the frozen card set does not capture a comparably substantial fall. This fails the strongest-puzzle ambition despite usable data.',
  'rules':'YES if Mamdani wins the November 4, 2025 NYC mayoral general election. AP, Fox News and NBC agreeing determine resolution; otherwise official certification applies. This is not the Democratic primary contract. Cuomo’s primary concession can be scored; the November general-election victory cannot.',
  'readiness':'needs a specific evidence/data step',
  'decision':'Conditional fourth preference, not recommended for queueing in its present five-card form. All 25 windows pass and public statement evidence is retained, but the dramatic arc is largely one scored jump. Keep the failed editorial test visible. Any replacement selection needs a new significance-first proposal and freeze, not a search for large price candles.',
  'blockers':['Independent editorial decision on whether one major jump plus four small responses meets the entertainment requirement; current recommendation is to hold.','Capture immutable original endorsement/concession/withdrawal statements and confirm earliest public access instead of the retained broadcast/reproduction upper bounds.','If the story is re-edited, start a separately documented significance-first selection and freeze before scoring; do not reuse this packet as an approved five.'],
  'ending':'Mamdani won the November 4, 2025 mayoral general election. The provider records final YES and closure November 5 at 05:44:47 UTC. The NYC Board of Elections’ later certification report corroborates the final result; it is retrospective evidence only. Do not confuse the June concession with this November ending.',
  'endingSources':['nyc-ending-official.html','nyc-ending-recap.pdf'],
  'intro':'June–September 2025. Rank five headlines from the biggest rise in Mamdani’s chances of becoming New York City mayor to the biggest fall.',
  'shortContract':'Mamdani wins the 2025 mayoral general election',
  'confounds':{
   'aoc-endorsement':'The public candidate post confirms support but is not proof of the very first announcement. Ranked-choice strategy, polling and other endorsements may already have priced in the alliance.',
   'primary-breakthrough':'Election returns were rolling in before Cuomo conceded. Concession was not the certified ranked-choice tally, and Mamdani still had a general election to win. This window captures the broader primary-night outcome, not the concession’s isolated effect.',
   'cuomo-independent':'The continuation was anticipated and discussed earlier that day. The statement confirmed an existing option rather than introducing a completely new rival.',
   'adams-exit':'Withdrawal was publicly speculated about; the race already had another major anti-Mamdani candidate. Voters need not transfer as a block. The NY1 reproduction cutoff is seven minutes after the original post time cited by the court.',
   'hochul-endorsement':'The governor’s endorsement followed discussions rather than an unexpected nomination change. Endorsement negotiations, coalition expectations and other September campaign information compete with a direct endorsement explanation.'},
  'supplemental':{'primary-breakthrough':['nyc-primary-fox.html'],'adams-exit':['nyc-adams-court.pdf','nyc-adams-archive.html']}
 },
 'anora-kalshi':{
  'slot':6,'title':'Anora: Hollywood’s false finish','category':'Culture','range':'2024-10-24–2025-03-03; proposed developments 2025-01-05–2025-02-23',
  'marketUrl':'https://api.elections.kalshi.com/trade-api/v2/historical/markets/KXOSCARPIC-25-A',
  'hook':'The Oscars provide a familiar competition and a small-film-versus-prestige-rivals story. Anora itself is less universally recognized than the ceremony; the brief should introduce it as a Best Picture contender without requiring knowledge of guild voting.',
  'fun':'A Golden Globes shutout, a huge rival nomination haul, a three-award comeback and two Conclave wins make a genuinely reversible awards narrative. One combined guild-weekend card avoids three versions of the same rebound.',
  'tension':'The same Kalshi contract’s qualifying daily medians fall from 48% to 16%, then recover to 74.5%. That is promising broad volatility, but it cannot substitute for eligible five-card scoring. No publishable ranking is supplied.',
  'rules':'YES if Anora won Best Picture at the 97th Academy Awards. The retained historical record says result=yes, status=finalized, expiration_value=Anora and settlement value $1. The secondary rule dates the expected ceremony March 2, 2025.',
  'readiness':'blocked',
  'decision':'Conditional fifth research preference only. Do not integrate or queue. The full returned Kalshi series has 1,718 missing hourly buckets and a 38-hour maximum gap. For every hourly bucket alignment across the January 5 Los Angeles calendar day, the Golden Globes anticipation window has at most 25% coverage, below the required 60%. A more precise ceremony timestamp cannot repair that dataset.',
  'blockers':['Obtain genuine historical trades/quotes for this exact Kalshi ticker sufficient to repair the early windows without carrying prices; none was obtained in this research.','The alternate Polymarket Anora contract opened January 21, after the Globes and too close to nominations for the full anticipation window. It cannot backfill Kalshi or supply the frozen five.','Capture first-public ceremony/nomination completion times and immutable primary winner/nominee lists. Current official result pages often supply only a day and may have been updated after publication.','Verify a durable public Kalshi consumer-market URL if desired. The linked official historical API is the verified canonical market record; a guessed consumer route was not confirmed.'],
  'ending':'Anora won Best Picture at the March 2, 2025 Oscars. Kalshi records market close March 3 at 03:45:51.498881 UTC and settlement at 04:45:55.063082 UTC, with YES paying $1. The Oscar announcement is exclusively the ending, never a scored card.',
  'endingSources':[],
  'endingExternal':[('Academy official 2025 ceremony record','https://www.oscars.org/oscars/ceremonies/2025')],
  'intro':'January–February 2025. Rank five headlines from the biggest rise in Anora’s Best Picture chances to the biggest fall.',
  'shortContract':'Anora wins Best Picture at the 97th Oscars',
  'confounds':{
   'globes-shutout':'Five categories conclude at different points during a ceremony. The official winners article was published January 7, after the January 5 event. Do not backdate the current article or invent an exact finish time. Early price windows fail even under all plausible hourly alignments.',
   'oscar-nominations':'The scheduled January 23 announcement start is not a verified time at which the whole nomination slate was known. The retained broadcaster announcement lists support six Anora nominations and thirteen for Emilia Pérez. ABC’s official page records publication January 23 at 13:50 UTC, found during final source verification after the day-end eligibility calculation; this is a usable publication upper bound, not verified broadcast completion. No rescoring was performed because the separate Globes data failure is conclusive.',
   'guild-weekend':'Critics Choice on February 7 and PGA/DGA on February 8 overlap by design and must remain one cluster. A late combined cutoff already contains earlier prizes in its reference window. PGA article publication is February 9 07:02:42 UTC and later updated; DGA metadata appears to precede the ceremony and is unsuitable as a winners timestamp.',
   'bafta-conclave':'Conclave’s Best Film victory and Anora’s actress/casting wins are competing signals from one ceremony. Broadcast timing and advance winner reporting must be checked; do not attribute a net response to Best Film alone.',
   'sag-conclave':'The SAG ensemble prize was awarded after Academy final voting had closed, so it could reveal preferences without changing already-cast votes. This is still public information about the outcome, but causal persuasion claims would be especially misleading.'},
  'supplemental':{'oscar-nominations':['anora-nominations-broadcaster.html','anora-nominations-abc.html'],'guild-weekend':['anora-dga.html','anora-critics-winners.html'],'sag-conclave':['anora-sag.html','anora-voting-schedule.html']}
 }
}

SOURCE_OVERRIDES={
 'anora-voting-schedule.html':('Academy official calendar, verified through web retrieval','https://www.oscars.org/news/academy-and-abc-announce-show-date-97th-oscarsr'),
 'anora-nominations.html':('Academy nominations announcement (download returned 403)','https://press.oscars.org/news/97th-oscarsr-nominations-announced'),
 'anora-bafta.html':('BAFTA official February 16 winners, verified through web retrieval; local download blocked','https://www.bafta.org/media-centre/press-releases/winners-announced-2025-ee-bafta-film-awards/'),
}
def source(file):
    r=receipts.get(file)
    if r: return {'file':f'evidence/{file}','url':r['url'],'retrievedAt':r['retrievedAt'],'snapshotHash':r['sha256'],'snapshotType':'current retrieval, not proof of immutable contemporaneous contents'}
    title,url=SOURCE_OVERRIDES.get(file,(file,None))
    return {'file':None,'url':url,'snapshotHash':None,'limitation':title}
def pp(v): return 'not eligible' if v is None else f'{v*100:+.3f}'.rstrip('0').rstrip('.')
def pct(v): return f'{v*100:.3f}'.rstrip('0').rstrip('.')+'%'
def source_link(file):
    s=source(file)
    return f'[{file}]({s["url"]})' if s['url'] else file+' (unavailable)'

(ROOT/'datasets').mkdir(exist_ok=True)
(ROOT/'briefs').mkdir(exist_ok=True)
packets=[]
for key,c in sorted(CONFIG.items(),key=lambda kv:kv[1]['slot']):
    f=next(f for f in frozen['finalists'] if f['key']==key)
    a=anchors['finalists'][key]
    m=next(m for m in measure['finalists'] if m['key']==key)
    audit=read(f'evidence/{key}-audit.json')['summary']
    points=read(f'evidence/{key}-normalized.json')
    if key=='anora-kalshi':
        market=next(x for x in read('evidence/kalshi25.json')['markets'] if x['ticker']=='KXOSCARPIC-25-A')
        identity={'provider':'Kalshi','marketId':market['ticker'],'contractId':market['ticker'],'question':market['title'],'selectedPerspective':'YES','outcome':'YES','openedAt':market['open_time'],'closedAt':market['close_time'],'settledAt':market['settlement_ts'],'resolutionEvidence':{'status':market['status'],'result':market['result'],'expirationValue':market['expiration_value']},'metadataUrl':c['marketUrl'],'marketUrl':c['marketUrl'],'marketUrlNote':'Verified official market API record; consumer page route unconfirmed.','rulesSummary':c['rules']}
    else:
        market=catalogue[key];tokens=json.loads(market['clobTokenIds'])
        identity={'provider':'Polymarket','marketId':market['id'],'conditionId':market['conditionId'],'contractId':tokens[0],'question':market['question'],'selectedPerspective':'YES','outcome':'YES','openedAt':market['startDate'],'closedAt':market['closedTime'],'settledAt':None,'resolutionEvidence':{'closed':market['closed'],'umaResolutionStatus':market.get('umaResolutionStatus'),'outcomes':json.loads(market['outcomes']),'outcomePrices':json.loads(market['outcomePrices'])},'metadataUrl':f'https://gamma-api.polymarket.com/markets/{market["id"]}','marketUrl':c['marketUrl'],'rulesSummary':c['rules']}
    historyRequests=[{'key':k,'url':u,'receipt':next((r for r in read('history-requests-receipts.json') if r['key']==k),None)} for k,u in read('history-requests.json') if k.startswith(key+'-history')]
    dataset=ROOT/'datasets'/f'{key}-hourly.csv'
    with dataset.open('w',newline='') as out:
        writer=csv.writer(out);writer.writerow(['time','q','raw_price','bid','ask','volume','open_interest','mark_type','stale'])
        for x in points:writer.writerow([x.get(k,'') for k in ['timestamp','probability','rawPrice','bid','ask','volume','openInterest','markType']]+['true' if x.get('stale') else 'false'])
    events=[]
    for event in f['events']:
        anchor=next(x for x in a if x['id']==event['id']);impact=next(x for x in m['impacts'] if x['eventId']==event['id'])
        title=event['title']
        if key=='tiktok' and event['id']=='trump-elected':title='Trump wins the presidential election'
        sources=list(dict.fromkeys([anchor['sourceFile']]+c['supplemental'].get(event['id'],[])))
        events.append({'id':event['id'],'title':title,'frozenTitle':event['title'],'eventDate':event['date'],'occurredAt':None,'occurredAtNote':'Use verified occurrence/completion record at integration; do not invent a midnight instant for a date-only event.','informationKnownAt':anchor['informationKnownAt'],'evaluationAnchor':anchor['evaluationAnchor'],'precision':'interval' if key=='anora-kalshi' or 'End of' in anchor['basis'] else 'minute','timezone':'Europe/London' if event['id']=='bafta-conclave' else 'America/Los_Angeles' if key=='anora-kalshi' else 'America/New_York','anchorBasis':anchor['basis'],'firstPublicTimeVerified':False,'publicCutoffVerified':anchor['timestampVerified'],'selectionReason':event['selectionReason'],'expectedDirectionBeforeMeasurement':event['expectedDirection'],'preRevealClaim':title,'claimsVisibility':'pre-reveal after evidence gates cleared','sources':[source(s) for s in sources],'competingExplanation':c['confounds'][event['id']],'attributionAssessment':'mixed' if key!='anora-kalshi' else 'indeterminate','researchMeasurement':impact})
    packet={'artifactType':'Editorial integration handoff; not a published Study or queue entry','preparedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'key':key,'proposedPuzzleNumber':c['slot'],'proposedReleaseTime':None,'title':c['title'],'category':c['category'],'storyRange':c['range'],'readiness':c['readiness'],'queueableNow':False,'decision':c['decision'],'requiredEvidenceSteps':c['blockers'],'identity':identity,'audienceRationale':c['hook'],'playRationale':c['fun'],'tension':c['tension'],'measurementProfile':measure['profile'],'selectionFreeze':{'file':'frozen-selection-v1.json','sha256':sha(ROOT/'frozen-selection-v1.json'),'frozenAt':frozen['frozenAt'],'disclosure':frozen['policy']},'anchorsFile':'anchors-v2.json','dataset':{'researchCsv':str(dataset.relative_to(ROOT)),'csvSha256':sha(dataset),'normalizedJson':f'evidence/{key}-normalized.json','audit':audit,'historyRequests':historyRequests,'preEndingSwings':swings[key],'normalizationScript':'audit_history.py','measurementScript':'evaluate.mjs','integrationDestination':None},'presentationDraft':{'topic':c['title'],'instruction':c['intro'],'selectedContractShort':c['shortContract'],'positiveLabel':'Probability rose','negativeLabel':'Probability fell','preRevealOdds':False,'releaseTimezone':'America/Chicago','scoring':{'version':'pairwise-anchor-1pt-v1','tieThreshold':0.01,'tieGrouping':'anchor-window'},'eventIds':[e['id'] for e in events],'initialOrder':[events[i]['id'] for i in [2,0,4,1,3]],'initialOrderPolicy':'Fixed positional permutation of frozen list, not price-ranked.'},'events':events,'postRevealOnly':{'ending':c['ending'],'sources':[source(s) for s in c['endingSources']],'externalSources':c.get('endingExternal',[]),'tieGroups':None if key=='anora-kalshi' else m['tieGroups'],'comparisonPolicy':'Observed stabilized minus reference medians; no headline-alone causality or nonzero attribution share.'},'integrationGates':{'sourceAndOccurrenceFinalization':False,'independentEditor':None,'approvalTime':None,'applicationChangesMade':False}}
    filename=f'{c["slot"]:03d}-{key}'
    save(f'briefs/{filename}.json',packet);packets.append(packet)
    b=swings[key];up=b['maximumRise'];dn=b['maximumDrawdown']
    lines=[f'# Proposed #{c["slot"]:03d}: {c["title"]}', '', f'**Readiness: {c["readiness"]}. Queueable now: no.** {c["decision"]}', '', '## Edition and contract', '', f'**Exact question:** {identity["question"]}  ',f'**Selected side / resolved outcome:** YES / YES.  ',f'**Story dates:** {c["range"]}.  ',f'**Provider:** {identity["provider"]}; market ID `{identity["marketId"]}`.  ',f'**Exact contract identifier:** `{identity["contractId"]}`.  ',f'**Market:** [provider record/page]({identity["marketUrl"]}); [resolution metadata]({identity["metadataUrl"]}).', '',c['rules'], '',f'Opened: `{identity["openedAt"]}`. Provider close: `{identity["closedAt"]}`. '+(f'Settled: `{identity["settledAt"]}`.' if identity['settledAt'] else 'Gamma close is not represented as a separately verified settlement transaction time.'),'', '## Why this is worth playing', '', c['hook'],'',c['fun'],'',c['tension'],'','## Verified prices and retrieval','',f'The retained single-contract series contains **{audit["observations"]:,} usable observations**, from `{audit["coverageStart"]}` through `{audit["coverageEnd"]}`. Raw returned rows: {audit["rawObservations"]:,}; rejected rows: {audit["rejectedObservations"]}; duplicate/revision buckets: {audit["duplicateOrRevisionBuckets"]}. Frequency: {audit["frequency"]}. Missing hours inside that observed span: **{audit["missingHours"]:,}**; longest missing run: **{audit["maximumMissingRunHours"]} hours**. Missing timestamps are enumerated in [the audit](../evidence/'+key+'-audit.json). This is verified retrieved coverage, not a claim of the complete lifetime or tick-by-tick trading.', '',audit['markPolicy'],'',f'**Calculated pre-ending broad swings:** daily medians rose from {pct(up["from"]["median"])} on {up["from"]["date"]} to {pct(up["to"]["median"])} on {up["to"]["date"]} ({up["pp"]:+.2f} pp). Maximum chronological drawdown: {pct(dn["from"]["median"])} on {dn["from"]["date"]} to {pct(dn["to"]["median"])} on {dn["to"]["date"]} (−{dn["pp"]:.2f} pp). These are computed from retained prediction odds, not press numbers or underlying asset prices. Require at least 12 actual hourly observations per daily median; exclude {b["exclusiveEndingDateUTC"]} UTC and later. They demonstrate suitability, not headline causation or the scored ranking.','',f'Integration material: [hourly CSV](../datasets/{key}-hourly.csv), [normalized source points](../evidence/{key}-normalized.json), [complete packet with hashes and all requests]({filename}.json).','', 'Concrete public GET retrieval:', '',f'- [Metadata]({identity["metadataUrl"]}).', f'- [First retained history request]({historyRequests[0]["url"]}); every subsequent interval and response hash is in the packet and [history request ledger](../history-requests.json).', '- Polymarket requests use the exact YES token as `market`, Unix-second `startTs`/`endTs`, `fidelity=60`, and bounded intervals. Kalshi uses the exact ticker, Unix-second `start_ts`/`end_ts`, `period_interval=60`, and the historical endpoint. Retained responses prove this path returned data on the research date.', '', '## Frozen five headlines and public evidence', '',f'Selection frozen at `{frozen["frozenAt"]}` in [selection v1](../frozen-selection-v1.json), before these fresh event-window calculations. [Anchor v2](../anchors-v2.json) was also recorded before scoring. Public cutoffs below are often later than first access; no timestamp was selected to maximize a move. For Anora, scenario anchors are explicitly not verified public times.', '']
    for n,e in enumerate(events,1):
        lines += [f'### {n}. {e["title"]}', '',f'**Historical date:** {e["eventDate"]}. **Public measurement cutoff:** '+(f'`{e["informationKnownAt"]}`.' if e['informationKnownAt'] else '**not verified**; date-only evidence, no integration timestamp.'), '',e['anchorBasis'], '', '**Sources:** '+ '; '.join(source_link(s['file'].split('/')[-1]) if s.get('file') else f'[{s.get("limitation","primary source")}]({s["url"]})' for s in e['sources'])+'.', '',f'**Selection rationale, recorded before scoring:** {e["selectionReason"]} Expected direction: {e["expectedDirectionBeforeMeasurement"]}.','',f'**Measurement risks:** {e["competingExplanation"]}','']
        if key=='anora-kalshi':lines += [f'Coverage-only scenario anchor: `{e["evaluationAnchor"]}`. This is not eligible for publishing a headline score.','']
    lines += ['## Measured responses — post-reveal / editor only','','Primary score is the median in [18,36) hours minus the median in [−12,0) hours. Anticipation [−84,−12), immediate [0,6), delayed [48,72) are also checked. Thresholds: ≥60% coverage, maximum gap share ≤50%, ≥3 distinct timestamp updates, median spread ≤20 pp where quotes exist. All five windows must pass. A timestamp update does not prove a fresh trade. Signed changes below are **percentage points**, not percent changes.','']
    if key=='anora-kalshi':
        lines += ['**No valid five-card score or ranking.** The day-end scenarios fail four of five event quality checks; the native helper can still return partial differences when some other windows fail, so those numbers must not be displayed as playable scores. [Coverage-envelope check](../anora-coverage-envelope.json) proves even a better January 5 time cannot get the Globes anticipation window above 25%, versus the required 60%.','', '| Proposed card | Anticipation | Reference | Immediate | Stabilized | Delayed | Eligibility |','|---|---:|---:|---:|---:|---:|---|']
        for e in events:
            i=e['researchMeasurement'];counts=[f'{w["quality"]["validBuckets"]}/{w["quality"]["expectedBuckets"]}' for w in i['windows'].values()];lines.append('| '+e['id']+' | '+' | '.join(counts)+' | '+i['qualityStatus']+' (scenario) |')
    else:
        lines += ['| Card | Reference | Stabilized | Scored change (pp) | Delayed cumulative (pp) | Window quality |','|---|---:|---:|---:|---:|---|']
        for e in events:
            i=e['researchMeasurement'];lines.append(f'| {e["id"]} | {pct(i["windows"]["reference"]["level"])} | {pct(i["windows"]["stabilized"]["level"])} | {pp(i["shortTermResponse"])} | {pp(i["cumulativeDelayedResponse"])} | {i["qualityStatus"]} |')
        lines += ['', '**Native one-point anchor tie groups, biggest rise to biggest fall:** '+ ' > '.join(' = '.join(g) for g in m['tieGroups'])+'.','', 'Do not force an ordering within a tie. The threshold groups scores within 1 pp of the group’s leading score; it is not transitive chaining. These findings are provisional until the first-public timestamp review is complete.']
    lines += ['', 'No pair of separately scored events has overlapping full [−84,+72) windows in these frozen sets. That does not exclude unselected news, within-event anticipation, or the multiple developments deliberately combined in a cluster.','', '## Ending — reveal only', '',c['ending'],'', '**Ending sources:** '+('; '.join(source_link(s) for s in c['endingSources']) or '; '.join(f'[{t}]({u})' for t,u in c.get('endingExternal',[])))+'; provider metadata linked above.', '', '## Integration handoff and remaining evidence', '',f'**Draft instruction:** {c["intro"]}', '',f'**Fixed initial card order:** {", ".join(packet["presentationDraft"]["initialOrder"])}. Use the project’s existing `pairwise-anchor-1pt-v1` scoring and YES perspective. No release date is assigned.', '', 'The [JSON handoff]('+filename+'.json) carries stable event IDs, contract identity, exact retrieval requests, source hashes, mechanisms, confounds, normalized data and proposed presentation fields. It is deliberately not a drop-in approved Study: `occurredAt`, final source roles/publication records and independent approval need completion. Null means unresolved, not permission to invent a value.','']
    lines += [f'- {x}' for x in c['blockers']]
    lines += ['', 'Source hashes establish exactly what was retrieved now; they do not certify what an editable page contained at its original publication time. Live-transcript timestamps describe the cited broadcast passage, not the web page’s upload time. Embedded first-person statements are primary evidence for the speaker’s words; surrounding news interpretation is corroboration. The final integrator must preserve that distinction and the schema’s pre-reveal source cutoff.','', '**Scope:** research files only. No application code, registry, publication status or deployment changed by this research.']
    (ROOT/'briefs'/f'{filename}.md').write_text('\n'.join(lines)+'\n')
save('finalist-index.json',[{'key':p['key'],'proposedPuzzleNumber':p['proposedPuzzleNumber'],'title':p['title'],'readiness':p['readiness'],'queueableNow':False,'brief':f'briefs/{p["proposedPuzzleNumber"]:03d}-{p["key"]}.md'} for p in packets])
print('Wrote five editorial briefs, five structured packets and five research CSVs.')
