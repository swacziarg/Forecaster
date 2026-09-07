# Stop the three-peat — five-card Eagles candidate

Status: **hold for independent review**, with all five cards and all 25 measurement windows complete. This packet is a separate five-card candidate. It does not alter the existing eight-event Eagles study, its route, its study version, its dataset, or the daily registry.

## Contract and selection

The candidate retains the season-long Philadelphia Eagles championship contract: Polymarket market `503322`, with the exact YES token recorded in `candidate.json`. It is not the later Eagles–Chiefs match-winner contract. The rules are YES if Philadelphia wins Super Bowl LIX and NO otherwise; NFL elimination can resolve NO before the Super Bowl.

The five frozen fact clusters, in selection order, are:

1. `falcons-collapse` — Eagles lose 22–21 after Atlanta’s late touchdown.
2. `barkley-record` — Saquon Barkley rushes for an Eagles-record 255 yards.
3. `hurts-concussion` — Hurts leaves with a concussion as Washington ends the winning streak.
4. `snow-playoff` — Eagles survive the Rams in the snow, 28–22.
5. `nfc-title` — Eagles score 55 to reach the Super Bowl.

The fixed player-facing initial order is `hurts-concussion`, `falcons-collapse`, `nfc-title`, `barkley-record`, `snow-playoff`. The freeze was recorded in `docs/launch-queue-research/frozen-selection-v1.json` before the fresh calculation; the freeze hash and disclosure are carried in `candidate.json`.

## Timing review

The new official NFL gamebook captures are in [evidence-manifest.json](evidence-manifest.json), and the frozen timing decisions are in [timing-anchors-v1.json](timing-anchors-v1.json). Each PDF records the local stadium start time, official game duration, final score, and the final play/quarter sequence. Adding the official duration to the local start gives a minute-precision gamebook-derived completion anchor. That is an occurrence/completion anchor, not a claim about the first public report.

| Card | Stadium time and duration | Gamebook-derived completion | Frozen public cutoff | Decision |
|---|---|---|---|---|
| Atlanta collapse | Sep 16, 8:16 PM EDT; 2:57 | Sep 16, 11:13 PM EDT / Sep 17 03:13Z | Sep 17 04:59:45.324Z | Preserve later recap cutoff; first-public instant unresolved |
| Barkley record | Nov 24, 5:23 PM PST; 3:13 | Nov 24, 8:36 PM PST / Nov 25 04:36Z | Nov 25 06:51:48.356Z | Preserve later feature cutoff; first-public instant unresolved |
| Hurts/Washington | Dec 22, 1:02 PM EST; 3:20 | Dec 22, 4:22 PM EST / 21:22Z | Dec 22 23:26:58.564Z | Preserve later live-recap cutoff; first-public injury/completion instant unresolved |
| Snow playoff | Jan 19, 3:02 PM EST; 3:08 | Jan 19, 6:10 PM EST / 23:10Z | Jan 20 01:37:49.106Z | Preserve later live-recap cutoff; first-public instant unresolved |
| NFC title | Jan 26, 3:03 PM EST; 3:24 | Jan 26, 6:27 PM EST / 23:27Z | Jan 27 03:14:55.431Z | Preserve later analysis cutoff; AFC result also arrived that evening |

The dates use the stadium’s actual daylight/standard-time abbreviation: Philadelphia was EDT on September 16 and EST thereafter; Inglewood was PST on November 24. The UTC conversions above are explicit. None of the five event-window anchors was moved to chase a larger price response. Because the gamebooks do not establish the earliest immutable public report, the corrected occurrence times are recorded while the frozen `informationKnownAt` values remain the scoring anchors. No recalculation or new version is warranted from this evidence alone.

## Cards, mechanisms, and confounds

### 1. Atlanta collapse — `falcons-collapse`

The official gamebook records the 22–21 final and the final Atlanta drive ending at 0:00; its 2:57 duration places completion at approximately Sep 17 03:13Z. The retained Eagles recap was modified at 04:59:45.324Z, which remains the conservative public cutoff. The card’s expected direction is negative: a home loss after a late collapse can reduce confidence in close-game execution, defense, and coaching.

The event is not isolated from the rest of Week 2. Other NFC and league results, comparative team strength, and the televised final drive all arrived inside the [−84,+72) hour measurement span. The packet therefore describes a mixed game-week repricing, not a clean causal effect of one dropped pass or one final possession.

### 2. Barkley record — `barkley-record`

The official gamebook records Philadelphia’s 37–20 win, Barkley’s 255 rushing yards, a 3:13 game duration, and the final Eagles kneels. Completion is approximately Nov 25 04:36Z. The team feature’s matching publication/modification cutoff at 06:51:48.356Z remains the scoring anchor because the gamebook does not establish when the record first became public.

The expected direction is positive: a dominant road win and elite rushing performance can strengthen seeding and matchup expectations. The 255 yards accumulated throughout the game, so the result, opponent quality, other Week 12 and Thanksgiving results, health news, and changing NFC standings are competing explanations. The measured move is intentionally presented as modest, not as proof that Barkley alone caused the repricing.

### 3. Hurts concussion and Washington loss — `hurts-concussion`

This remains one information cluster. The official gamebook records the Hurts injury sequence, the 36–33 Washington final, the 3:20 duration, the final 0:10 touchdown/conversion, and the return fumble at the end of the game. Completion is approximately Dec 22 21:22Z. The live recap cutoff at 23:26:58.564Z remains the scoring anchor because the gamebook cannot prove the first public confirmation of the concussion or the public completion time.

The expected direction is negative because quarterback health and the loss both affect playoff readiness and the NFC top-seed path. Do not split the injury from the loss, and do not imply the backup-quarterback performance was independently measured. Other Week 16 results inside the window changed the NFC seeding race and playoff field; subsequent injury reports also competed with the game result.

### 4. Snow divisional win — `snow-playoff`

The official gamebook records snow conditions, the 28–22 final, a 3:08 duration, and Philadelphia’s final kneel. Completion is approximately Jan 19 23:10Z. The later live-recap cutoff at 01:37:49.106Z on Jan 20 remains the scoring anchor because no immutable first-public record is captured.

The expected direction is positive, mostly through tournament mechanics: one fewer elimination branch and a home NFC Championship game. The same weekend’s other divisional results—Chiefs–Texans, Lions–Commanders, and Bills–Ravens—changed the remaining field and opponent tree. Weather, late turnovers, and the broader playoff slate mean the measured movement should not be attributed specifically to snow or Barkley.

### 5. NFC title — `nfc-title`

The official gamebook records the 55–23 final, a 3:24 duration, and the final Eagles kneels. Completion is approximately Jan 26 23:27Z. The team analysis cutoff at 03:14:55.431Z on Jan 27 remains the scoring anchor. The AFC Championship result was also available during the same evening and is part of the competing explanation, so the chosen cutoff intentionally represents a mixed playoff-weekend public boundary.

The expected direction is positive because winning the conference removes every remaining tournament branch except the Super Bowl matchup. The Super Bowl itself is not a scored card and is not used as an explanatory event.

## Measurement packet

The candidate uses the existing `months-hourly-v1` profile and `pairwise-anchor-1pt-v1` scoring. The invocation is retained in [measurements.json](measurements.json) and calls the unchanged `calculateStudyImpacts` and `createTieGroups` functions from `src/domain/eventStudy.ts`.

The source is the retained single-contract YES series: 5,167 usable hourly observations from 5,173 raw rows, with five prices above 1.0 rejected, two missing UTC hours preserved, one duplicate/revision bucket recorded, and no interpolation, clipping, carry-forward repair, or cross-contract splicing. The coverage is explicitly partial-lifetime. The two missing buckets are `2024-07-21T18:00:00Z` and `2024-11-05T22:00:00Z`.

All 25 windows pass the existing quality checks. The observed stabilized-minus-reference changes are:

| Card | Reference | Stabilized | Change |
|---|---:|---:|---:|
| NFC title | 40.50% | 46.575% | +6.075 pp |
| Snow playoff | 25.35% | 31.225% | +5.875 pp |
| Barkley record | 9.625% | 10.975% | +1.35 pp |
| Atlanta collapse | 7.70% | 5.95% | −1.75 pp |
| Hurts/Washington | 15.45% | 12.55% | −2.90 pp |

The one-point anchor produces four groups: `nfc-title = snow-playoff` > `barkley-record` > `falcons-collapse` > `hurts-concussion`. The first group is a tie, not an ordered pair. The values are percentage points, not percent changes, and they are descriptive market movements rather than causal estimates.

## Neutral player copy and reveal-only ending

Pre-reveal copy should ask players to rank the five headlines by how much they changed the Eagles’ championship probability, without exposing endpoints, movement signs, tie groups, resolution, later sources, or retrospectively optimized language. Source-backed facts may remain available through a neutral detail disclosure.

Reveal-only ending:

> Philadelphia beat Kansas City 40–22 in Super Bowl LIX on February 9, 2025, denying the Chiefs a third consecutive Super Bowl victory. The provider resolved the Eagles championship contract YES.

The ending source is the retained Philadelphia Eagles post-game page recorded in `candidate.json`; the Super Bowl is deliberately excluded from the scored five.

## Hold and handoff

The packet is ready for independent review but is not queueable or publishable yet. The precise hold is that the official gamebooks establish completion and occurrence, while the editable team recaps establish only later public cutoffs. An independent editor must either supply immutable contemporaneous first-public evidence for each card or explicitly approve the conservative later cutoffs as the measurement boundary. The editor must also review the combined Hurts injury/loss cluster, the same-window competing NFL results, the playoff-field changes, and the modest interpretation of the measured moves.

No application files, registry entries, study routes, or existing eight-event artifacts were changed.
