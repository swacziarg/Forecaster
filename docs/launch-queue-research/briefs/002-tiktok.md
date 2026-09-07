# Proposed #002: The app that went dark

**Readiness: needs a specific evidence/data step. Queueable now: no.** Advance first. All 25 measurement windows pass and both substantial rises and falls survive. Public upper-bound timestamps and primary legal records are retained. Before strict integration, confirm first-public anchors for the three court/brief releases and the original AP call artifact, then obtain independent editorial review. No additional price download is required for the documented anchors.

## Edition and contract

**Exact question:** TikTok banned in the US before May 2025?  
**Selected side / resolved outcome:** YES / YES.  
**Story dates:** 2024-09-18–2025-01-22; scored developments 2024-11-06–2025-01-10.  
**Provider:** Polymarket; market ID `507276`.  
**Exact contract identifier:** `24635636911615866092589652362670811323984202357282728474473612545495782013438`.  
**Market:** [provider record/page](https://polymarket.com/event/tiktok-banned-in-the-us-before-may-2025); [resolution metadata](https://gamma-api.polymarket.com/markets/507276).

YES required a federal law, policy or court-mandated ban on download and/or use affecting most Americans to take effect by April 30, 2025, 11:59 p.m. ET. A sale achieving legal compliance instead meant NO. Federal-government information was primary, with credible reporting allowed. This was not a contract on permanent disappearance or on whether the app was still unavailable in May.

Opened: `2024-09-18T00:05:28.707Z`. Provider close: `2025-01-22 00:31:19+00`. Gamma close is not represented as a separately verified settlement transaction time.

## Why this is worth playing

An everyday app became a Supreme Court cliffhanger, with a returning president offering a possible escape. Players need no knowledge of court doctrine to care whether TikTok disappears from their phones.

Which mattered more: a president winning, a court rejecting the app, or the justices finally hearing the case? A hearing can sound like a rescue without being a win. The ending has a second twist: temporary darkness and a return to service still left this particular contract settled YES.

The frozen calculations put the oral argument and appeals defeat in the same top tie group, while the grant of review is only +0.25 pp. Trump’s election measures −11.75 pp. The contrast between dramatic headlines and procedural non-movement makes this the strongest #002.

## Verified prices and retrieval

The retained single-contract series contains **3,023 usable observations**, from `2024-09-18T01:00:00Z` through `2025-01-22T00:00:00Z`. Raw returned rows: 3,024; rejected rows: 0; duplicate/revision buckets: 1. Frequency: UTC hourly buckets. Missing hours inside that observed span: **1**; longest missing run: **1 hours**. Missing timestamps are enumerated in [the audit](../evidence/tiktok-audit.json). This is verified retrieved coverage, not a claim of the complete lifetime or tick-by-tick trading.

Project Polymarket importer convention: latest source price per hour, treated as trade; API does not establish actual trade freshness or historical spread/volume. No filling.

**Calculated pre-ending broad swings:** daily medians rose from 12.5% on 2024-11-08 to 73% on 2025-01-11 (+60.50 pp). Maximum chronological drawdown: 35% on 2024-10-01 to 12.5% on 2024-11-08 (−22.50 pp). These are computed from retained prediction odds, not press numbers or underlying asset prices. Require at least 12 actual hourly observations per daily median; exclude 2025-01-17 UTC and later. They demonstrate suitability, not headline causation or the scored ranking.

Integration material: [hourly CSV](../datasets/tiktok-hourly.csv), [normalized source points](../evidence/tiktok-normalized.json), [complete packet with hashes and all requests](002-tiktok.json).

Concrete public GET retrieval:

- [Metadata](https://gamma-api.polymarket.com/markets/507276).
- [First retained history request](https://clob.polymarket.com/prices-history?market=24635636911615866092589652362670811323984202357282728474473612545495782013438&startTs=1726617928&endTs=1727481928&fidelity=60); every subsequent interval and response hash is in the packet and [history request ledger](../history-requests.json).
- Polymarket requests use the exact YES token as `market`, Unix-second `startTs`/`endTs`, `fidelity=60`, and bounded intervals. Kalshi uses the exact ticker, Unix-second `start_ts`/`end_ts`, `period_interval=60`, and the historical endpoint. Retained responses prove this path returned data on the research date.

## Frozen five headlines and public evidence

Selection frozen at `2026-09-06T00:24:51.987941+00:00` in [selection v1](../frozen-selection-v1.json), before these fresh event-window calculations. [Anchor v2](../anchors-v2.json) was also recorded before scoring. Public cutoffs below are often later than first access; no timestamp was selected to maximize a move. For Anora, scenario anchors are explicitly not verified public times.

### 1. Trump wins the presidential election

**Historical date:** 2024-11-06. **Public measurement cutoff:** `2024-11-06T10:34:00Z`.

AP’s own documented 05:34 EST presidential call. AP retrospective page preserves its original announcement. Prior save-TikTok pledge is excluded from pre-reveal claim pending contemporary primary source.

**Sources:** [ap-trump-call.html](https://www.ap.org/the-definitive-source/behind-the-news/calling-the-2024-presidential-race-state-by-state/).

**Selection rationale, recorded before scoring:** A new political escape route for a household-name app. Expected direction: negative.

**Measurement risks:** An election is a rolling overnight information process. By AP’s 05:34 EST call the outcome was heavily anticipated, and the preceding 12-hour reference includes election returns. Measure the response around that public confirmation, not the full election-night effect. The earlier campaign promise is not a pre-reveal fact in this packet until its contemporary primary artifact is captured.

### 2. Appeals court rejects TikTok’s challenge to the divest-or-ban law

**Historical date:** 2024-12-06. **Public measurement cutoff:** `2024-12-06T16:00:00Z`.

End of 10:30–11:00 EST live court coverage; ruling date independently recorded on Supreme Court docket.

**Sources:** [tiktok-dec6-correct.html](https://transcripts.cnn.com/show/cnr/date/2024-12-06/segment/26); [tiktok-docket.html](https://www.supremecourt.gov/docket/docketfiles/html/public/24-656.html); [tiktok-dec6.html](https://newsroom.tiktok.com/tiktok-statement-on-dc-circuit-court-of-appeals-decision?lang=en).

**Selection rationale, recorded before scoring:** Major legal defeat. Expected direction: positive.

**Measurement risks:** A scheduled legal decision is partly anticipated. Merits, divestiture timing and possible future appeals entered the same information cluster. The broadcast-end anchor follows the actual court release.

### 3. Supreme Court agrees to hear TikTok’s challenge

**Historical date:** 2024-12-18. **Public measurement cutoff:** `2024-12-18T19:00:00Z`.

End of 13:30–14:00 EST broadcast reporting order; order PDF verifies substance, docket date.

**Sources:** [tiktok-dec18-cnn.html](https://transcripts.cnn.com/show/cnc/date/2024-12-18/segment/08); [tiktok-docket.html](https://www.supremecourt.gov/docket/docketfiles/html/public/24-656.html); [tiktok-order.pdf](https://www.supremecourt.gov/orders/courtorders/121824zr1_p86b.pdf); [tiktok-dec18.html](https://newsroom.tiktok.com/statement-on-supreme-court-order-to-hear-tiktok-ban-case?lang=en).

**Selection rationale, recorded before scoring:** An institutional lifeline, without a stay or merits victory. Expected direction: negative.

**Measurement risks:** Taking a case is not staying the statute or deciding the merits. The order also set an accelerated schedule. Treat the small signed response as effectively undetectable under the one-point threshold, not evidence that review harmed TikTok.

### 4. Trump asks the Supreme Court to pause the TikTok deadline

**Historical date:** 2024-12-27. **Public measurement cutoff:** `2024-12-27T23:00:00Z`.

End of 17:00–18:00 EST broadcast publicly reproducing Trump brief; filing filename alone not treated as public release time.

**Sources:** [tiktok-dec27-cnn.html](https://transcripts.cnn.com/show/sitroom/date/2024-12-27/segment/01); [tiktok-trump-brief.pdf](https://www.supremecourt.gov/DocketPDF/24/24-656/336151/20241227163400981_2024-12-27%20-%20TikTok%20v.%20Garland%20-%20Amicus%20Brief%20of%20President%20Donald%20J.%20Trump.pdf); [tiktok-docket.html](https://www.supremecourt.gov/docket/docketfiles/html/public/24-656.html).

**Selection rationale, recorded before scoring:** The incoming president intervenes directly. Expected direction: negative.

**Measurement risks:** The brief is an incoming president’s request, not a judicial order. Holiday participation and political deal expectations are competing explanations; historical spreads and trade-level liquidity are not available in these marks.

### 5. TikTok and the government face Supreme Court questioning

**Historical date:** 2025-01-10. **Public measurement cutoff:** `2025-01-10T17:38:00Z`.

Official oral-argument transcript ends at 12:38 EST, after 10:08 start. Public live-audio page corroborates public proceeding.

**Sources:** [tiktok-argument.pdf](https://www.supremecourt.gov/oral_arguments/argument_transcripts/2024/24-656_pm02.pdf); [tiktok-argument-page.html](https://www.supremecourt.gov/oral_arguments/audio/2024/24-656); [tiktok-docket.html](https://www.supremecourt.gov/docket/docketfiles/html/public/24-656.html).

**Selection rationale, recorded before scoring:** Public test of the rival free-speech and national-security arguments. Expected direction: ambiguous.

**Measurement risks:** The 150-minute hearing unfolds publicly; the reference window includes much of the proceeding. Oral questions are not votes or a final judgment. All delayed samples end January 13, before the January 17 resolving ruling.

## Measured responses — post-reveal / editor only

Primary score is the median in [18,36) hours minus the median in [−12,0) hours. Anticipation [−84,−12), immediate [0,6), delayed [48,72) are also checked. Thresholds: ≥60% coverage, maximum gap share ≤50%, ≥3 distinct timestamp updates, median spread ≤20 pp where quotes exist. All five windows must pass. A timestamp update does not prove a fresh trade. Signed changes below are **percentage points**, not percent changes.

| Card | Reference | Stabilized | Scored change (pp) | Delayed cumulative (pp) | Window quality |
|---|---:|---:|---:|---:|---|
| trump-elected | 25% | 13.25% | -11.75 | -12.5 | usable |
| appeal-lost | 21.5% | 33.25% | +11.75 | +14 | usable |
| supreme-review | 32.25% | 32.5% | +0.25 | +3.75 | usable |
| trump-pause | 34.5% | 30.5% | -4 | -3.5 | usable |
| supreme-argument | 56.75% | 69.25% | +12.5 | +11.25 | usable |

**Native one-point anchor tie groups, biggest rise to biggest fall:** supreme-argument = appeal-lost > supreme-review > trump-pause > trump-elected.

Do not force an ordering within a tie. The threshold groups scores within 1 pp of the group’s leading score; it is not transitive chaining. These findings are provisional until the first-public timestamp review is complete.

No pair of separately scored events has overlapping full [−84,+72) windows in these frozen sets. That does not exclude unselected news, within-event anticipation, or the multiple developments deliberately combined in a cluster.

## Ending — reveal only

On January 17 the Supreme Court upheld the law. TikTok went dark in the United States around January 19 and then restored service that day. Polymarket records two disputed YES proposals followed by final YES; its metadata closes the contract January 22 at 00:31:19 UTC. The contract concerned a qualifying ban having taken effect, so the return of service did not make its final outcome NO. Do not turn the ruling, blackout, restoration or settlement into a scored sixth card.

**Ending sources:** [tiktok-opinion.pdf](https://www.supremecourt.gov/opinions/24pdf/24-656_ca7d.pdf); [tiktok-ending.html](https://transcripts.cnn.com/show/cnr/date/2025-01-19/segment/04); [tiktok-market.html](https://polymarket.com/event/tiktok-banned-in-the-us-before-may-2025); provider metadata linked above.

## Integration handoff and remaining evidence

**Draft instruction:** November 2024–January 2025. Rank five headlines from the biggest rise in the odds of a US TikTok ban before May to the biggest fall.

**Fixed initial card order:** supreme-review, trump-elected, supreme-argument, appeal-lost, trump-pause. Use the project’s existing `pairwise-anchor-1pt-v1` scoring and YES perspective. No release date is assigned.

The [JSON handoff](002-tiktok.json) carries stable event IDs, contract identity, exact retrieval requests, source hashes, mechanisms, confounds, normalized data and proposed presentation fields. It is deliberately not a drop-in approved Study: `occurredAt`, final source roles/publication records and independent approval need completion. Null means unresolved, not permission to invent a value.

- Confirm first-public release times for December 6, December 18 and December 27 against contemporaneous archived court/filing notices; the measured anchors currently use conservatively bounded live broadcasts.
- Attach the original AP presidential-call announcement as the pre-reveal source; the retained AP explainer is a retrospective host of that original announcement.
- Keep the ending explicit that the provider records two disputes followed by final YES. An on-chain dispute chronology is useful supplementary evidence, but final settlement itself is verified on the provider page and Gamma.
- Independent editor must approve timestamps, mechanisms, evidence and wording before queueing.

Source hashes establish exactly what was retrieved now; they do not certify what an editable page contained at its original publication time. Live-transcript timestamps describe the cited broadcast passage, not the web page’s upload time. Embedded first-person statements are primary evidence for the speaker’s words; surrounding news interpretation is corroboration. The final integrator must preserve that distinction and the schema’s pre-reveal source cutoff.

**Scope:** research files only. No application code, registry, publication status or deployment changed by this research.
