# Proposed #003: Stop the three-peat

**Readiness: needs a specific evidence/data step. Queueable now: no.** Advance second. All 25 windows are complete and the five cards have both signs and four tie groups. The concrete remaining evidence step is independent confirmation of immutable final-whistle/public completion times; the present calculation uses team recap publication or last-modified cutoffs several hours later.

## Edition and contract

**Exact question:** Will the Eagles win Super Bowl 2025?  
**Selected side / resolved outcome:** YES / YES.  
**Story dates:** 2024-07-09–2025-02-10; scored developments 2024-09-16–2025-01-26.  
**Provider:** Polymarket; market ID `503322`.  
**Exact contract identifier:** `110222417228270638383974743746762302792556220380554556504458115620557107501861`.  
**Market:** [provider record/page](https://polymarket.com/event/superbowl-champion-2025/will-the-eagles-win-super-bowl-2025); [resolution metadata](https://gamma-api.polymarket.com/markets/503322).

YES if Philadelphia wins Super Bowl LIX; otherwise NO. Elimination under NFL rules allowed immediate NO. This is the season-long championship futures contract, not the later Eagles–Chiefs match-winner contract.

Opened: `2024-07-09T15:37:44.526Z`. Provider close: `2025-02-10 07:15:05+00`. Gamma close is not represented as a separately verified settlement transaction time.

## Why this is worth playing

The Super Bowl, Patrick Mahomes, Jalen Hurts and Saquon Barkley supply household sports recognition. A season of late collapses, a record run, a quarterback scare and a snow escape offers something more varied than five playoff wins.

Players can debate whether an injury scare outweighed an embarrassing loss, and whether barely surviving in snow mattered more than scoring 55. All five headlines concern the Eagles’ championship probability, not their chance of winning the individual game.

The snow playoff and NFC title responses are effectively tied (+5.875 versus +6.075 pp); Barkley’s spectacular record night is much smaller (+1.35). The two setbacks are −1.75 and −2.90. Keep those honest modest early moves; do not exaggerate them into double-digit shocks.

## Verified prices and retrieval

The retained single-contract series contains **5,167 usable observations**, from `2024-07-09T18:00:00Z` through `2025-02-10T02:00:00Z`. Raw returned rows: 5,173; rejected rows: 5; duplicate/revision buckets: 1. Frequency: UTC hourly buckets. Missing hours inside that observed span: **2**; longest missing run: **1 hours**. Missing timestamps are enumerated in [the audit](../evidence/eagles-audit.json). This is verified retrieved coverage, not a claim of the complete lifetime or tick-by-tick trading.

Project Polymarket importer convention: latest source price per hour, treated as trade; API does not establish actual trade freshness or historical spread/volume. No filling.

**Calculated pre-ending broad swings:** daily medians rose from 4.35% on 2024-10-19 to 47.65% on 2025-02-08 (+43.30 pp). Maximum chronological drawdown: 16.725% on 2024-12-16 to 10.65% on 2025-01-10 (−6.08 pp). These are computed from retained prediction odds, not press numbers or underlying asset prices. Require at least 12 actual hourly observations per daily median; exclude 2025-02-09 UTC and later. They demonstrate suitability, not headline causation or the scored ranking.

Integration material: [hourly CSV](../datasets/eagles-hourly.csv), [normalized source points](../evidence/eagles-normalized.json), [complete packet with hashes and all requests](003-eagles.json).

Concrete public GET retrieval:

- [Metadata](https://gamma-api.polymarket.com/markets/503322).
- [First retained history request](https://clob.polymarket.com/prices-history?market=110222417228270638383974743746762302792556220380554556504458115620557107501861&startTs=1720539464&endTs=1721403464&fidelity=60); every subsequent interval and response hash is in the packet and [history request ledger](../history-requests.json).
- Polymarket requests use the exact YES token as `market`, Unix-second `startTs`/`endTs`, `fidelity=60`, and bounded intervals. Kalshi uses the exact ticker, Unix-second `start_ts`/`end_ts`, `period_interval=60`, and the historical endpoint. Retained responses prove this path returned data on the research date.

## Frozen five headlines and public evidence

Selection frozen at `2026-09-06T00:24:51.987941+00:00` in [selection v1](../frozen-selection-v1.json), before these fresh event-window calculations. [Anchor v2](../anchors-v2.json) was also recorded before scoring. Public cutoffs below are often later than first access; no timestamp was selected to maximize a move. For Anora, scenario anchors are explicitly not verified public times.

### 1. Eagles lose 22–21 after Atlanta’s late touchdown

**Historical date:** 2024-09-16. **Public measurement cutoff:** `2024-09-17T04:59:45.324Z`.

Team recap last-modified time; original publication 03:09Z may precede the final score. Conservative public cutoff, not final whistle.

**Sources:** [eagles-falcons.html](https://www.philadelphiaeagles.com/news/game-recap-falcons-vs-eagles-week-2-2024).

**Selection rationale, recorded before scoring:** Early contender doubt and a notorious dropped pass. Expected direction: negative.

**Measurement risks:** The lead evaporated during a televised game, before the recap cutoff. The reference includes live play and the immediate aftermath; this is not a clean pre-kickoff-to-final comparison.

### 2. Saquon Barkley rushes for an Eagles-record 255 yards

**Historical date:** 2024-11-24. **Public measurement cutoff:** `2024-11-25T06:51:48.356Z`.

Team article publication and modification agree. Several hours after the game; record developed during play.

**Sources:** [eagles-rams-record.html](https://www.philadelphiaeagles.com/news/saquon-barkley-eagles-rams-historic-255-yard-performance-i-cant-do-it-alone).

**Selection rationale, recorded before scoring:** Famous new signing becomes the season’s star. Expected direction: positive.

**Measurement risks:** The 255 yards accumulated over the whole game. Team performance, the score, other contenders’ results and health news share the window. The feature article was published hours after viewers saw the record.

### 3. Hurts leaves with a concussion as Washington ends the Eagles’ winning streak

**Historical date:** 2024-12-22. **Public measurement cutoff:** `2024-12-22T23:26:58.564Z`.

Team live recap last-modified cutoff; injury and loss are one cluster.

**Sources:** [eagles-concussion.html](https://www.philadelphiaeagles.com/news/eagles-vs-commanders-live-updates-december-22-2024-nfl-week-16).

**Selection rationale, recorded before scoring:** Quarterback health and seeding danger in one inseparable episode. Expected direction: negative.

**Measurement risks:** The injury, replacement-quarterback performance and 36–33 defeat cannot be disentangled with these windows. Seeding implications and subsequent injury updates also matter.

### 4. Eagles survive the Rams in the snow, 28–22

**Historical date:** 2025-01-19. **Public measurement cutoff:** `2025-01-20T01:37:49.106Z`.

Team live recap last-modified cutoff, later than final whistle.

**Sources:** [eagles-snow.html](https://www.philadelphiaeagles.com/news/rams-vs-eagles-live-updates-january-19-2025-nfl-divisional-round).

**Selection rationale, recorded before scoring:** Memorable snow game, explosive runs and a late defensive escape. Expected direction: positive.

**Measurement risks:** Advancing mechanically improves a championship future. Other divisional results changed the opponent field, and the recap cutoff comes after the final whistle. Do not attribute the response specifically to snow or Barkley alone.

### 5. Eagles score 55 to reach the Super Bowl

**Historical date:** 2025-01-26. **Public measurement cutoff:** `2025-01-27T03:14:55.431Z`.

Team analysis last-modified cutoff; also after AFC outcome.

**Sources:** [eagles-nfc.html](https://www.philadelphiaeagles.com/news/spadaro-6-takeaways-from-a-dominant-nfc-championship-victory-over-the-commanders).

**Selection rationale, recorded before scoring:** Conference breakthrough, leaving the ultimate championship unresolved. Expected direction: positive.

**Measurement risks:** The conference berth removed a remaining hurdle; the AFC result also determined the Super Bowl opponent during the same evening. The chosen recap cutoff follows both. Treat the observed movement as a mixed playoff-weekend response.

## Measured responses — post-reveal / editor only

Primary score is the median in [18,36) hours minus the median in [−12,0) hours. Anticipation [−84,−12), immediate [0,6), delayed [48,72) are also checked. Thresholds: ≥60% coverage, maximum gap share ≤50%, ≥3 distinct timestamp updates, median spread ≤20 pp where quotes exist. All five windows must pass. A timestamp update does not prove a fresh trade. Signed changes below are **percentage points**, not percent changes.

| Card | Reference | Stabilized | Scored change (pp) | Delayed cumulative (pp) | Window quality |
|---|---:|---:|---:|---:|---|
| falcons-collapse | 7.7% | 5.95% | -1.75 | -1.75 | usable |
| barkley-record | 9.625% | 10.975% | +1.35 | +1.825 | usable |
| hurts-concussion | 15.45% | 12.55% | -2.9 | -3.275 | usable |
| snow-playoff | 25.35% | 31.225% | +5.875 | +7.375 | usable |
| nfc-title | 40.5% | 46.575% | +6.075 | +6.4 | usable |

**Native one-point anchor tie groups, biggest rise to biggest fall:** nfc-title = snow-playoff > barkley-record > falcons-collapse > hurts-concussion.

Do not force an ordering within a tie. The threshold groups scores within 1 pp of the group’s leading score; it is not transitive chaining. These findings are provisional until the first-public timestamp review is complete.

No pair of separately scored events has overlapping full [−84,+72) windows in these frozen sets. That does not exclude unselected news, within-event anticipation, or the multiple developments deliberately combined in a cluster.

## Ending — reveal only

Philadelphia beat Kansas City 40–22 in Super Bowl LIX on February 9, 2025, denying the Chiefs a third consecutive Super Bowl victory. The provider resolved this Eagles championship contract YES. Keep the Super Bowl itself entirely in the ending.

**Ending sources:** [eagles-ending-correct.html](https://www.philadelphiaeagles.com/game-day/2024/post/chiefs-at-eagles/); provider metadata linked above.

## Integration handoff and remaining evidence

**Draft instruction:** September 2024–January 2025. Rank five headlines from the biggest rise in the Eagles’ Super Bowl championship odds to the biggest fall.

**Fixed initial card order:** hurts-concussion, falcons-collapse, nfc-title, barkley-record, snow-playoff. Use the project’s existing `pairwise-anchor-1pt-v1` scoring and YES perspective. No release date is assigned.

The [JSON handoff](003-eagles.json) carries stable event IDs, contract identity, exact retrieval requests, source hashes, mechanisms, confounds, normalized data and proposed presentation fields. It is deliberately not a drop-in approved Study: `occurredAt`, final source roles/publication records and independent approval need completion. Null means unresolved, not permission to invent a value.

- Verify final-whistle times for all five games against official immutable gamebooks or archived broadcasts and decide whether those first-public anchors should supersede the conservative recap cutoffs.
- Preserve the injury/loss as one cluster and explicitly disclose other NFL results in the same windows.
- Recalculate once if evidence requires corrected anchors; record the version, retain this result and do not substitute headlines to preserve a desired ranking.
- Independent editor approval is still required; the existing Eagles draft review has not supplied it.

Source hashes establish exactly what was retrieved now; they do not certify what an editable page contained at its original publication time. Live-transcript timestamps describe the cited broadcast passage, not the web page’s upload time. Embedded first-person statements are primary evidence for the speaker’s words; surrounding news interpretation is corroboration. The final integrator must preserve that distinction and the schema’s pre-reveal source cutoff.

**Scope:** research files only. No application code, registry, publication status or deployment changed by this research.
