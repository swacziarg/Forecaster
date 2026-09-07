# Stop the three-peat — five-card Eagles candidate, finish-pass v2

Status: **hold for independent review**. This is a versioned addendum to the prior five-card packet. It does not register a Study, alter the route, alter the existing eight-event Eagles study, or change the five-card selection.

## What changed

Targeted Internet Archive captures were added to test whether the prior editable-page modification cutoffs were unnecessarily late. Three scoring information boundaries now have a supported earlier public-by timestamp. Falcons and Barkley remain unchanged. The new boundaries are conservative public-by bounds, not exact first-public instants.

| Card | Prior scoring cutoff | Finish-pass v2 cutoff | Decision |
|---|---|---|---|
| Atlanta collapse | 2024-09-17 04:59:45.324Z | unchanged | Archive contains the final, but its publication metadata precedes the gamebook-derived final; no safe correction |
| Barkley record | 2024-11-25 06:51:48.356Z | unchanged | Archive confirms the final and 255 yards but does not improve the retained boundary |
| Hurts concussion + Washington loss | 2024-12-22 23:26:58.564Z | **2024-12-22 22:25:00Z** | Postgame capture contains both the concussion claim and 36–33 final; injury-only capture at 20:44Z is not substituted |
| Snow playoff win | 2025-01-20 01:37:49.106Z | **2025-01-19 23:10:00Z** | Postgame capture contains 28–22 final and NFC Championship advancement |
| NFC title | 2025-01-27 03:14:55.431Z | **2025-01-27 00:22:04.795Z** | Contemporary analysis capture contains 55–23 final and Super Bowl advancement |

The evidence and exact local hashes are in [capture-manifest-v2.json](capture-manifest-v2.json). The frozen timing decisions are in [timing-anchors-v2.json](timing-anchors-v2.json).

## Frozen candidate

The candidate remains the season-long Polymarket market `503322`, YES side, Philadelphia Eagles win Super Bowl LIX. The five cards and player-facing initial order remain:

1. `hurts-concussion` — Hurts leaves with a concussion as Washington ends the winning streak.
2. `falcons-collapse` — Eagles lose 22–21 after Atlanta’s late touchdown.
3. `nfc-title` — Eagles score 55 to reach the Super Bowl.
4. `barkley-record` — Saquon Barkley rushes for an Eagles-record 255 yards.
5. `snow-playoff` — Eagles survive the Rams in the snow, 28–22.

The combined Hurts injury/loss card is intentionally not split. The earlier archived page proves that the injury was public before the final, but the selected card is the combined information cluster. The Super Bowl remains an ending-only resolution and is not a scored card.

## Recalculation

The unchanged `months-hourly-v1` profile was rerun against the same normalized single-contract YES series: 5,167 usable hourly observations, five prices above 1.0 rejected, two missing UTC buckets preserved, no interpolation, no clipping, no cross-contract splicing, and no full-market-lifetime claim. All 25 windows are usable and no full windows overlap.

| Card | Reference | Stabilized | Change | Delayed cumulative |
|---|---:|---:|---:|---:|
| NFC title | 32.55% | 46.55% | +14.00 pp | +14.35 pp |
| Snow playoff | 25.075% | 31.05% | +5.975 pp | +7.65 pp |
| Barkley record | 9.625% | 10.975% | +1.35 pp | +1.825 pp |
| Atlanta collapse | 7.70% | 5.95% | −1.75 pp | −1.75 pp |
| Hurts/Washington | 15.475% | 12.55% | −2.925 pp | −3.30 pp |

At the 0.01 tie threshold, the recalculated groups are now strict: `nfc-title` > `snow-playoff` > `barkley-record` > `falcons-collapse` > `hurts-concussion`. This is a consequence of moving the three event windows to better-supported public-by boundaries; it is not evidence of causal identification. Full review output is in [measurements-v2.json](measurements-v2.json).

## Exact handoff to lead

After independent review accepts the public-by semantics, apply the following to `src/data/eaglesFiveCard2025.ts`:

- Update `informationKnownAt` and the matching claim `knownAt` for `hurts-concussion` to `2024-12-22T22:25:00Z`.
- Update both fields for `snow-playoff` to `2025-01-19T23:10:00Z`.
- Update both fields for `nfc-title` to `2025-01-27T00:22:04.795Z`.
- Add the three archived postgame/analysis source records and attach them as corroborating sources; retain the NFL gamebooks as primary occurrence sources.
- Leave selection, `occurredAt`, contract, dataset, measurement profile, route, ending, status, and existing eight-event artifacts unchanged.
- Recalculate from [measurements-v2.json](measurements-v2.json), then perform the lead-owned build and browser QA.

The exact source records, source roles, and field patch are machine-readable in [evidence-addendum-v2.json](evidence-addendum-v2.json). No runtime or application files were changed in this worker pass.

## Remaining hold

The packet is improved but not publishable. The archive and page metadata establish supported public-by bounds, not exact first-public instants. An independent editor must approve that boundary convention, review the combined Hurts cluster and playoff confounds, and provide human approval before the lead registers or queues the candidate. There was no manual launch, publish, or deploy in this pass.
