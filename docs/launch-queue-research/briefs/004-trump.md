# Proposed #004: The comeback nobody could call

**Readiness: needs a specific evidence/data step. Queueable now: no.** Advance third, after variety. All 25 windows pass. Exact first-broadcast/public-release confirmation remains necessary, particularly the debate transcript with a later modification time and the source-host versus original-publication distinction for live transcripts.

## Edition and contract

**Exact question:** Will Donald Trump win the 2024 US Presidential Election?  
**Selected side / resolved outcome:** YES / YES.  
**Story dates:** 2024-05-01–2024-11-06 measured coverage; scored developments 2024-05-30–2024-11-02.  
**Provider:** Polymarket; market ID `253591`.  
**Exact contract identifier:** `21742633143463906290569050155826241533067272736897614950488156847949938836455`.  
**Market:** [provider record/page](https://polymarket.com/event/presidential-election-winner-2024/will-donald-trump-win-the-2024-us-presidential-election); [resolution metadata](https://gamma-api.polymarket.com/markets/253591).

YES if Donald J. Trump wins the 2024 US presidential election. AP, Fox News and NBC must all call the same winner; if they had not agreed by January 20, 2025, the inauguration determined resolution. Neither national popular vote nor winning Iowa defines this contract.

Opened: `2024-01-04T22:58:00Z`. Provider close: `2024-11-06 15:17:41+00`. Gamma close is not represented as a separately verified settlement transaction time.

## Why this is worth playing

A criminal verdict, an assassination attempt, an endorsement, a televised debate and a surprise poll are unusually recognizable and distinct campaign moments. The subject needs almost no introduction.

A major endorsement sounds helpful, but the retained contract’s stabilized response is negative. The debate and the Iowa poll fall into the same tie group. Players can distinguish the importance of a news story from how much probability was left to move.

The rally shooting measures +10.00 pp; Kennedy’s endorsement −1.175, conviction −2.00, debate −2.575 and Iowa poll −3.45. The frozen set produces three tie groups, not five clean ranks. This remains compelling but repeats the Trump shooting already present in Biden #001, so put two non-election editions first.

## Verified prices and retrieval

The retained single-contract series contains **4,549 usable observations**, from `2024-05-01T00:00:00Z` through `2024-11-06T15:00:00Z`. Raw returned rows: 4,550; rejected rows: 0; duplicate/revision buckets: 1. Frequency: UTC hourly buckets. Missing hours inside that observed span: **3**; longest missing run: **1 hours**. Missing timestamps are enumerated in [the audit](../evidence/trump-audit.json). This is verified retrieved coverage, not a claim of the complete lifetime or tick-by-tick trading.

Project Polymarket importer convention: latest source price per hour, treated as trade; API does not establish actual trade freshness or historical spread/volume. No filling.

**Calculated pre-ending broad swings:** daily medians rose from 44.5% on 2024-05-09 to 70.5% on 2024-07-15 (+26.00 pp). Maximum chronological drawdown: 70.5% on 2024-07-15 to 44.15% on 2024-08-16 (−26.35 pp). These are computed from retained prediction odds, not press numbers or underlying asset prices. Require at least 12 actual hourly observations per daily median; exclude 2024-11-05 UTC and later. They demonstrate suitability, not headline causation or the scored ranking.

Integration material: [hourly CSV](../datasets/trump-hourly.csv), [normalized source points](../evidence/trump-normalized.json), [complete packet with hashes and all requests](004-trump.json).

Concrete public GET retrieval:

- [Metadata](https://gamma-api.polymarket.com/markets/253591).
- [First retained history request](https://clob.polymarket.com/prices-history?market=21742633143463906290569050155826241533067272736897614950488156847949938836455&startTs=1714521600&endTs=1715385600&fidelity=60); every subsequent interval and response hash is in the packet and [history request ledger](../history-requests.json).
- Polymarket requests use the exact YES token as `market`, Unix-second `startTs`/`endTs`, `fidelity=60`, and bounded intervals. Kalshi uses the exact ticker, Unix-second `start_ts`/`end_ts`, `period_interval=60`, and the historical endpoint. Retained responses prove this path returned data on the research date.

## Frozen five headlines and public evidence

Selection frozen at `2026-09-06T00:24:51.987941+00:00` in [selection v1](../frozen-selection-v1.json), before these fresh event-window calculations. [Anchor v2](../anchors-v2.json) was also recorded before scoring. Public cutoffs below are often later than first access; no timestamp was selected to maximize a move. For Anora, scenario anchors are explicitly not verified public times.

### 1. New York jury finds Trump guilty on 34 felony counts

**Historical date:** 2024-05-30. **Public measurement cutoff:** `2024-05-30T21:15:07Z`.

Next bracket after live courthouse reporting of all 34 guilty verdicts; upper bound, not exact verdict instant.

**Sources:** [trump-conviction.html](https://transcripts.cnn.com/show/se/date/2024-05-30/segment/05).

**Selection rationale, recorded before scoring:** Historic legal blow versus political mobilization. Expected direction: ambiguous.

**Measurement risks:** The verdict was anticipated during jury deliberations; the reference therefore includes changing expectations. Legal consequences, fundraising and partisan reactions may pull in different directions.

### 2. Trump survives a shooting at his Pennsylvania rally

**Historical date:** 2024-07-13. **Public measurement cutoff:** `2024-07-14T00:00:00Z`.

End of 19:00–20:00 EDT live broadcast containing the survival report and official response.

**Sources:** [trump-shooting.html](https://transcripts.cnn.com/show/cnr/date/2024-07-13/segment/08).

**Selection rationale, recorded before scoring:** The campaign’s most widely recognized shocking moment. Expected direction: positive.

**Measurement risks:** The cutoff is the end of a live reporting hour, after the shooting itself. The weekend also involved uncertainty about Biden’s candidacy and the approaching Republican convention. A positive response does not isolate sympathy, turnout or opponent effects.

### 3. Robert F. Kennedy Jr. suspends his campaign and endorses Trump

**Historical date:** 2024-08-23. **Public measurement cutoff:** `2024-08-23T19:30:00Z`.

End of 15:00–15:30 EDT broadcast carrying Kennedy’s own speech.

**Sources:** [trump-rfk.html](https://transcripts.cnn.com/show/cnc/date/2024-08-23/segment/11).

**Selection rationale, recorded before scoring:** A rival joins forces rather than another debate or poll. Expected direction: positive.

**Measurement risks:** His decision was discussed before the speech. The Democratic convention ended the previous night and overlaps the reference/anticipation period. The subsequent Trump rally and other campaign news share the post-event window. Do not rewrite the headline to explain away its negative measurement.

### 4. Harris and Trump meet in their first presidential debate

**Historical date:** 2024-09-10. **Public measurement cutoff:** `2024-09-11T03:58:00Z`.

ABC original transcript publication; live debate occurred earlier; page later updated at 16:24:39Z. Narrow claim is only that the debate took place. First-broadcast end/archive still requires confirmation.

**Sources:** [trump-debate.html](https://abcnews.go.com/Politics/harris-trump-presidential-debate-transcript/story?id=113560542).

**Selection rationale, recorded before scoring:** The replacement opponent’s national test. Expected direction: ambiguous.

**Measurement risks:** The debate is a long public broadcast and expectations move during it. Post-debate commentary, endorsements and other campaign activity share the response windows. The current transcript was updated later; no later-added quotation is included in the pre-reveal headline.

### 5. Final Iowa Poll puts Harris ahead of Trump, 47% to 44%

**Historical date:** 2024-11-02. **Public measurement cutoff:** `2024-11-03T00:00:00Z`.

End of 19:00–20:00 EDT broadcast with poll publisher USA Today editor discussing 47–44 finding; actual release earlier.

**Sources:** [trump-iowa-cnn.html](https://transcripts.cnn.com/show/cnr/date/2024-11-02/segment/08).

**Selection rationale, recorded before scoring:** A famous late surprise whose electoral conclusion proved wrong. Expected direction: negative.

**Measurement risks:** A state poll is not a national forecast; the 47–44 finding was within its reported 3.4-point margin of error. Other final polls and election positioning coincide. The primary stabilized window ends before election day, but the delayed window reaches 19:00 EST on November 5 and can include early voting information/returns.

## Measured responses — post-reveal / editor only

Primary score is the median in [18,36) hours minus the median in [−12,0) hours. Anticipation [−84,−12), immediate [0,6), delayed [48,72) are also checked. Thresholds: ≥60% coverage, maximum gap share ≤50%, ≥3 distinct timestamp updates, median spread ≤20 pp where quotes exist. All five windows must pass. A timestamp update does not prove a fresh trade. Signed changes below are **percentage points**, not percent changes.

| Card | Reference | Stabilized | Scored change (pp) | Delayed cumulative (pp) | Window quality |
|---|---:|---:|---:|---:|---|
| conviction | 56.5% | 54.5% | -2 | -3 | usable |
| butler | 59.5% | 69.5% | +10 | +11 | usable |
| rfk-endorsement | 50.975% | 49.8% | -1.175 | -1.425 | usable |
| harris-debate | 51.925% | 49.35% | -2.575 | -2.775 | usable |
| iowa-poll | 58.95% | 55.5% | -3.45 | +2.05 | usable |

**Native one-point anchor tie groups, biggest rise to biggest fall:** butler > rfk-endorsement = conviction > harris-debate = iowa-poll.

Do not force an ordering within a tie. The threshold groups scores within 1 pp of the group’s leading score; it is not transitive chaining. These findings are provisional until the first-public timestamp review is complete.

No pair of separately scored events has overlapping full [−84,+72) windows in these frozen sets. That does not exclude unselected news, within-event anticipation, or the multiple developments deliberately combined in a cluster.

## Ending — reveal only

AP called the presidency for Trump at 05:34 EST on November 6, 2024. The single Polymarket Trump winner contract ultimately resolved YES and records closure at 15:17:41 UTC that day. AP’s call alone was not the contract’s full three-outlet resolution rule. The election result belongs only here.

**Ending sources:** [ap-trump-call.html](https://www.ap.org/the-definitive-source/behind-the-news/calling-the-2024-presidential-race-state-by-state/); provider metadata linked above.

## Integration handoff and remaining evidence

**Draft instruction:** May–November 2024. Rank five headlines from the biggest rise in Trump’s chances of winning the presidency to the biggest fall.

**Fixed initial card order:** rfk-endorsement, conviction, iowa-poll, butler, harris-debate. Use the project’s existing `pairwise-anchor-1pt-v1` scoring and YES perspective. No release date is assigned.

The [JSON handoff](004-trump.json) carries stable event IDs, contract identity, exact retrieval requests, source hashes, mechanisms, confounds, normalized data and proposed presentation fields. It is deliberately not a drop-in approved Study: `occurredAt`, final source roles/publication records and independent approval need completion. Null means unresolved, not permission to invent a value.

- Capture the immutable ABC debate broadcast/transcript as publicly available at the cutoff; current page records original publication 03:58 UTC but modification 16:24:39 UTC.
- Verify the first-public release anchors for verdict, shooting, endorsement and poll; the retained live-program endings/brackets are defensible upper bounds, not claims of earliest public access.
- Independent editor must review the repeated shooting card after Biden #001 and approve this frozen five-card subset under the strict profile; legacy publication does not waive this.

Source hashes establish exactly what was retrieved now; they do not certify what an editable page contained at its original publication time. Live-transcript timestamps describe the cited broadcast passage, not the web page’s upload time. Embedded first-person statements are primary evidence for the speaker’s words; surrounding news interpretation is corroboration. The final integrator must preserve that distinction and the schema’s pre-reveal source cutoff.

**Scope:** research files only. No application code, registry, publication status or deployment changed by this research.
