# NexusPoint: launch queue research

Research completed September 6, 2026. Scope: research and editorial preparation in this directory only.

## Recommendation

**Make TikTok, “The app that went dark,” the first choice for puzzle #002 once its remaining timestamp/evidence review clears.** It combines universal recognition, a months-long political/legal story, substantial measured rises and falls, a nearly motionless apparent lifeline, and a disputed-but-final ending. The provider explicitly records two disputed YES proposals followed by final YES. [Polymarket market and resolution record](https://polymarket.com/event/tiktok-banned-in-the-us-before-may-2025).

This research does **not** establish five queue-ready editions. It establishes **three strong candidates to advance**, a fourth with usable data but a weak frozen five-card arc, and a fifth blocked by historical gaps. **None can be queued now under the repository’s editorial requirements.** All four populated scoring sets still use some conservative public cutoffs awaiting first-public/immutable-source review; Anora fails a hard data requirement. Those distinctions are not hidden behind a generic “research complete” label.

Exactly five briefs are supplied in this proposed release-preference order. The last two positions are conditional research slots, not reservations or publication instructions. Do not schedule them merely to fill the queue.

| Preference | Edition / brief | Frozen scored range | What makes the ranking interesting | Readiness |
|---|---|---:|---|---|
| #002 | [The app that went dark](briefs/002-tiktok.md) | −11.75 to +12.50 pp | Two legal blows tie; review grant barely moves odds | Needs first-public court/brief/AP source confirmation and independent review |
| #003 | [Stop the three-peat](briefs/003-eagles.md) | −2.90 to +6.075 pp | Snow escape ties the 55-point conference win | Needs immutable final-whistle confirmation and independent review |
| #004 | [The comeback nobody could call](briefs/004-trump.md) | −3.45 to +10.00 pp | Kennedy endorsement measures negative; debate and Iowa poll tie | Needs broadcast/source-cutoff review; avoid immediate repetition after Biden |
| #005, hold | [The New York upset](briefs/005-nyc.md) | −1.025 to +33.80 pp | Big primary breakthrough versus mostly small later news | Data passes; frozen puzzle does not yet meet the strongest-story standard |
| #006, blocked | [Anora: Hollywood’s false finish](briefs/006-anora-kalshi.md) | No valid five-card ranking | Great fall/comeback/rival narrative | Exact ticker’s early history cannot support the required windows |

Ranges are newly calculated signed percentage-point responses using the unchanged project algorithm at the documented cutoffs. They are provisional research results, not causal effects or published answer keys. Ties use the project’s one-point anchor rule.

## What was reviewed first

The research started with the README, generalized Study schema, event-window implementation, source/provenance guidance, provider importers and current editorial records. Specifically: [README](../../README.md), [study schema](../../src/domain/study.ts), [measurement rules](../../src/domain/eventStudy.ts), [daily registry](../../src/data/dailyPuzzles.ts), [data provenance](../data-provenance.md), [generalized-study ADR](../adr/001-generalized-event-studies.md), [portfolio editorial review](../editorial/portfolio-review.md), [Biden review](../editorial/biden-dropout-2024-review.md), [Oscars review](../editorial/oscars-2026-review.md), the five existing topic definitions and the Polymarket/Kalshi importers. The existing daily registry supplied only the Biden edition, puzzle #001. Existing drafts were evidence to inspect, not presumptive winners.

The portfolio review requires an independent editor to confirm first-public timestamps, immutable source captures, event independence and mechanisms, then record reviewer identity and time before publication. This research supplies a reviewable packet; it does not invent an independent approval or ask to change publication state. The legacy election study does not exempt a new strict five-card daily edition from these requirements. [Existing sign-off requirement](../editorial/portfolio-review.md).

## Candidate screen: twelve distinct storylines

Twelve distinct storylines were researched through actual provider records and historical requests. A Chiefs version of the same Super Bowl and a second Anora provider were also tested, making **14 contract series**, without counting those alternates as additional independent stories. The [complete candidate audit](candidate-audit.md) supplies every exact question, ID/token, outcome, rules summary, dates, market link, retrieval path, gap count and numerical broad swing evidence.

| Storyline | Recognition / entertainment judgment | Data result | Editorial decision |
|---|---|---|---|
| TikTok US ban | Very high; app, president, courts, blackout | 3,023 hourly points; 1 gap | Strongest advance |
| Eagles Super Bowl season | Very high; star players, injury, snow, rivalry | 5,167 points; 2 gaps | Advance; two playoff cards tie |
| Trump wins 2024 presidency | Exceptional; five very different national moments | 4,549 points; 3 gaps | Advance after two varied editions |
| Mamdani NYC general election | High US political recognition | 4,711 points; 6 gaps | Hold frozen five: one dominant move |
| Anora Best Picture 2025 | Familiar ceremony; less familiar film; excellent reversal | Kalshi 1,392 points, 1,718 gaps | Blocked; alternate Polymarket opens too late |
| Canadian Liberal comeback 2025 | Strong Canada / Trump conflict story; less universal | 2,723 points; no gaps | Closest fresh political alternative; five-source freeze unfinished |
| Bitcoin reaches $100k in 2024 | Famous milestone; some specialist mechanisms | 6,609 prediction-odds points; 3 gaps | Strong alternative data; avoid specialist-heavy five |
| One Battle After Another Best Picture 2026 | Oscars + DiCaprio; more recent | 4,168 points; 21 gaps | Closest accessible culture fallback; precursor redundancy unresolved |
| GTA VI released in 2025 | Huge gaming recognition | 8,088 points; 8 gaps | Main delay is ending; five prior factual developments not established |
| Taylor Swift / Travis Kelce engagement 2025 | Exceptional celebrity recognition | 5,714 points; 1 gap | Five non-gossip developments not established |
| Musk–Twitter acquisition agreement 2022 | Exceptional business drama | Contract verified; zero returned prices | Wrong horizon for full saga; data blocked |
| September 2024 Fed 50+bp cut | Real suspense; dry for this audience | 1,129 points; no gaps | Reject launch priority on entertainment |

Chiefs alternate: 5,173 points, 2 gaps; title loss must remain in the ending and the prior wins are repetitive. Anora Polymarket alternate: 971 points, no gaps, but starts January 21 and cannot cover the January 5 Globes. These totals count actual retained UTC hourly buckets; gaps are internal to the observed span, not a blanket statement about full lifetime completeness. [Audits and exact source requests](candidate-audit.md).

The screen favors recognition, emotional stakes, variety of developments, a narrative that lasts weeks/months, and clear reversals. Data suitability is a pass/fail prerequisite for readiness. It does not award a dry contract a launch slot for having easy data, or a famous subject a ready label because a price chart appears in an article.

## Historical data: what is actually verified

**208 historical GET requests** were saved with exact URLs, returned bodies, retrieval times and SHA-256 hashes. They include successful empty results for the old Twitter contract. Provider metadata was retrieved independently of price history. [Request ledger](history-requests.json), [retrieval receipts](history-requests-receipts.json), [Gamma metadata catalogue](catalogue.json), [Kalshi Anora metadata](evidence/anora-kalshi-market.json), [Kalshi 2026 metadata](evidence/kalshi26.json).

Polymarket uses one precise YES outcome token per series and its public CLOB `prices-history` endpoint with Unix-second bounds and `fidelity=60`. Bounded requests cover each stated research range; overlapping boundary observations are resolved to the latest observation per UTC hour, matching the project convention. Prices outside [0,1] are rejected rather than clipped. Eagles, for example, has five invalid late rows; even its current consumer page shows a nonsensical 100.4% display, so the display is not used as a probability datum or settlement proof. Provider resolved status and outcome fields supply settlement evidence. [Eagles market](https://polymarket.com/event/superbowl-champion-2025/will-the-eagles-win-super-bowl-2025), [Eagles audit](evidence/eagles-audit.json).

CLOB price marks do not expose historical bid/ask spreads, depth, transaction-level volume or trade freshness. The importer calls them `trade` marks for compatibility; that does **not** establish that a trade occurred in every hour. Repeated timestamps counted as updates by the quality implementation must not be described as independent traders or price-changing trades. Lifetime market volume is not event-window liquidity. No provider’s promotional claim about market accuracy was accepted as research evidence.

Kalshi historical 60-minute candles use actual closing trades, or a closing bid/ask midpoint only within the project’s 20-point spread limit when no trade close exists. There is no previous-price carry, interpolation or cross-provider repair. Seven Anora candles lacked acceptable marks. Missing overnight/early intervals remain missing. The [Anora coverage envelope](anora-coverage-envelope.json) checks every hourly bucket alignment across the January 5 Los Angeles date: maximum anticipation coverage is **25%**, versus **60% required**. This is a coverage-only falsification, not a search for the best scoring timestamp.

All broad volatility numbers are **calculated from retained prediction probabilities**. [Pre-ending swings](pre-ending-swings.json) uses UTC daily medians with at least 12 actual hourly samples and excludes the whole resolving-announcement/result date onward. This corrects a common trap: GTA’s May delay cannot inflate its suitability as a scored headline just because formal settlement happened in January 2026. TikTok’s broad swing screen stops before the January 17 ruling. No scattered press odds are presented as continuous data. BTC spot price appears only in the Bitcoin contract’s resolution definition, never in its probability series.

The original [broad screen](broad-screen.json) is preserved as part of the audit trail; its mechanical last-three-days exclusion was an initial screen, not the final ending-aware measure. Prefer `pre-ending-swings.json` for reported suitability numbers. No new event scores were used to select the five facts per finalist.

## Selection integrity and measured findings

The [frozen selection](frozen-selection-v1.json) records the 25 event clusters, their significance and expected direction at **2026-09-06 00:24:51.987941 UTC**, before fresh event calculations. It candidly discloses that the required repository review exposed earlier measurements for some reused Trump/Eagles events and that broad prices had already been examined. This is a prospective frozen selection, not a claim of a blinded experiment.

[Anchor v1](anchors-v1.json) and [anchor v2](anchors-v2.json) were written before scoring. The only v2 change replaced a provisional Adams-post time with a directly retained contemporary NY1 reproduction cutoff, seven minutes later. No price response motivated the correction. The TikTok election card’s wording was narrowed to the election result because the earlier save-TikTok pledge lacked a retained contemporary primary source; the underlying frozen event cluster did not change. No weak card was exchanged after its score became visible.

The evaluation imports the project’s unchanged `calculateStudyImpacts`, `MONTHS_PROFILE` and `createTieGroups` directly. Primary score: stabilized median [18,36) hours minus reference median [−12,0), with separate anticipation [−84,−12), immediate [0,6), and delayed [48,72) quality checks. Every window must pass. Tie groups use a 1 pp distance from the group’s leading score. No causal attribution percentage is assigned. [Full reproducible results, profile and implementation hash](measurements-v1.json).

TikTok, Eagles, Trump and Mamdani each pass all 25 window checks at their documented cutoffs. The freeze nevertheless exposes editorial weaknesses: RFK’s seemingly helpful endorsement measures a fall; Mamdani’s other four cards barely move; Anora’s partial native calculations must not be treated as a valid five-card answer. The briefs preserve these outcomes. Anora’s day-end scenarios are explicitly hypothetical eligibility checks, with no asserted public minute or published ranking.

## Timing, hindsight and confounds

A headline’s importance is not identical to its first appearance, and a page’s original publication timestamp is not proof that its current full text existed then. Eagles live recaps were modified after publication; the DGA winner-page metadata appears earlier than the ceremony; the Golden Globes winners page was published January 7 although the event was January 5; the ABC debate transcript was updated after its original publication. These are material limitations recorded beside the affected cards, not silently corrected to convenient round hours.

The first four briefs use public upper bounds from live broadcast brackets/program endings, official oral-argument completion, indexed first-person posts, or retained publication/modification metadata. These support provisional measurement, while first-public access and immutable content still require editorial confirmation. Anora has day-only event evidence and no integration-ready exact times. Retained hashes prove the bytes retrieved now, not what an editable page showed in 2024/2025. Every packet leaves unresolved integration fields null instead of fabricating them.

No pair of separately scored events has overlapping full windows in these five frozen sets. There are still important within-event and unselected-news overlaps: games unfold before recap cutoffs; Eagles playoff weekends include other teams’ outcomes; the TikTok hearing is a long public process; election-night returns precede AP’s call; Kennedy’s endorsement follows the Democratic convention; the Iowa poll’s delayed window reaches early election-night information. The Anora guild weekend deliberately combines three linked awards into one card. Detailed anticipation and competing explanations accompany each of the 25 headlines.

Final results are never scored: the Super Bowl result, November presidential call for Trump, November NYC general result, TikTok January ruling/blackout/settlement and Anora’s Oscar are separate endings. The TikTok election result is allowable because it does not resolve the TikTok contract; similarly, the NYC primary concession does not resolve the general-election contract. This distinction follows the exact contract, not the emotional climax of an unrelated story.

## Closest alternatives and precise blockers

**Canadian Liberal comeback:** the best next fresh research lead if Mamdani stays on hold. The verified single Liberal-most-seats series rises from a 3.975% daily median on January 7 to 86% on April 24 and has a 10-point drawdown before the result. The price prerequisite is satisfied. The remaining work is a separately frozen five-event timeline with primary public times and balanced developments. Trudeau’s resignation cannot be used with this market’s opening. Carney’s actual March14 swearing-in is independently documented. [Provider contract](https://gamma-api.polymarket.com/markets/517586), [Canadian government record](https://www.pm.gc.ca/en/news/news-releases/2025/03/14/swearing-30th-canadian-ministry).

**One Battle After Another, Oscars 2026:** the best accessible cultural fallback for Anora. Its verified Kalshi ticker has 4,168 retained hourly marks and only 21 isolated missing buckets. The issue is five distinct, entertaining pre-result developments instead of a procession of precursor wins, plus the remaining source/timestamp requirements already identified in the repository review. No new five-card selection has been frozen or scored here, so it is not falsely labeled ready. [Provider contract](https://api.elections.kalshi.com/trade-api/v2/historical/markets/KXOSCARPIC-26-ONE), [existing editorial record](../editorial/oscars-2026-review.md).

**Bitcoin $100k:** strong actual odds and huge two-way movement make it a viable reserve if the audience is comfortable with business/technology. The blocker is a fresh mainstream five with clean timing/overlap review; the existing draft contains specialist material and does not get automatic priority. **Swift/Kelce** and **GTA** have verified resolved contracts and prices but do not yet have five sufficiently independent, factual, pre-ending developments. **Musk/Twitter** needs an entirely different, demonstrably retrievable completion contract to tell the full takeover saga. [All exact contracts and evidence](candidate-audit.md).

## Verification

All 277 retained download receipts match their source-file hashes. Each of the five briefs has exactly five frozen event IDs. All five research CSVs replay the stored window levels, quality decisions and tie groups exactly through the current unchanged application implementation. Relative document links were checked. These checks establish numerical/file integrity, not first-public timestamp certainty or independent editorial approval. [Validation results](validation.json).

## Deliverables and handoff

Each of the five briefs includes a punchy title, exact contract and outcome, story dates, audience/game rationale, full price retrieval path and coverage, five frozen headlines with public evidence, measured or explicitly ineligible windows, confounds, a separate ending and precise readiness gates. Beside each Markdown brief is a structured JSON handoff with stable event IDs, YES orientation, source hashes, request intervals, presentation draft, fixed initial card order and research-only dataset references. Five native-format hourly CSVs are under `datasets/`.

The packets are ready to hand to an integrator/editor; they are **not five approved, drop-in Study objects**. Final occurrence timestamps and source roles/publication records require the identified evidence work, and no independent reviewer identity or approval time is invented. No release date is assigned. No application code, publication status, daily registry or deployment was changed by this research. Concurrent changes outside this directory were left untouched.

**Queue now: zero. Advance next: TikTok, Eagles, Trump. Hold: Mamdani. Blocked: Anora.** Do not lower the bar to fill the last two slots.
