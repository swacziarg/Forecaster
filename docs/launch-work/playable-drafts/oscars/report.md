# Oscars v2 playable draft handoff

Status: complete local playable draft; publication and schedule approval remain lead/editorial decisions.

## Implementation

- Exported symbol: `oscarsFiveCard2026Study`
- Study ID/version: `oscars-best-picture-2026-v2` / `2`
- Unique private slug: `oscars-best-picture-2026-v2`
- Study status: `editorial-review`
- Module: `src/data/oscarsFiveCard2026.ts`
- Focused test: `src/data/oscarsFiveCard2026.test.ts`
- Existing dataset reused byte-for-byte; no new data bundle was needed.
- Shared registries, UI, package scripts, domain modules, schedule files, and the v1 archive were not modified.

The module is a strict Study-shaped v2 derived from the frozen candidate at `docs/launch-work/funnel-expansion/oscars/candidate.json`. It adds the separate Academy ceremony conclusion as a reveal-only source. No conclusion text, result language, or market measurement is included in any pre-reveal claim.

## Pre-reveal firewall

`getPreRevealCard` returns an eligible card for all five events. Each card has a source-backed fact claim, primary and corroborating source roles, and no measured market level. The pre-reveal briefs contain no percentage, stabilized/reference wording, or answer signal. The reveal-only source `oscars-ending` is excluded from every card’s source list.

The five neutral claim briefs are:

- NBR: “The National Board of Review selected One Battle After Another as its Best Film of 2025.”
- Critics Choice: “One Battle After Another won Best Picture at the 31st Critics Choice Awards.”
- Golden Globes: “One Battle After Another won Best Motion Picture—Musical or Comedy while Hamnet took the drama picture prize.”
- Nominations: “The Academy announced 13 nominations for One Battle After Another, including Best Picture.”
- PGA: “The Producers Guild awarded One Battle After Another the Darryl F. Zanuck Award for Outstanding Producer of Theatrical Motion Pictures.”

## Source and cutoff correction log

The module uses the source captures and hashes in `docs/launch-work/funnel-expansion/oscars/evidence-manifest.json` and retains the exact current Kalshi market/side.

| Event | v1 cutoff | v2 cutoff | Correction |
| --- | --- | --- | --- |
| NBR Best Film | 2025-12-03 17:00Z | 2025-12-03 19:25Z | Official NBR HTML exposes `datePublished` 19:24:07Z; rounded up. |
| Critics Choice | 2026-01-05 04:30Z | 2026-01-05 04:30Z | Retained; primary page is day-precise January 4, so the conservative day bound is before cutoff. |
| Golden Globes split | 2026-01-12 04:45Z | 2026-01-12 07:05Z | Official Golden Globes HTML exposes `datePublished` 07:04:16Z; rounded up. |
| Oscar nominations | 2026-01-22 13:30Z | 2026-01-22 13:42Z | The Academy says remaining nomination categories began at 5:41 a.m. PT; 5:30 a.m. PT was not a complete-slate cutoff. |
| PGA top prize | 2026-03-01 05:00Z | 2026-03-01 08:03Z | Official PGA HTML exposes `datePublished` 08:02:52Z; rounded up. |

Each pre-reveal claim uses only its primary source ID. Later AP/The Week corroboration is retained for contemporary support and source availability review, but is not used to backdate a claim. The CCA source remains explicitly day-precise. The Academy source is the hashed official static PDF plus the captured official timing extract; its 13:42Z cutoff is a conservative complete-slate bound, not an invented first-public second.

## Dataset, calculations, and scoring

The draft reuses the exact current dataset:

- Market: `KXOSCARPIC-26-ONE`, Kalshi, selected perspective `YES`
- Normalized path: `/data/oscars-2026/kalshi-hourly.csv`
- Raw SHA-256: `b1f4bf26a54a512af052fd91af8272ef820881570b4a6d37db673cf5150f1131`
- Market metadata SHA-256: `151d9ff463871c5d7c0598a1b30e3d2457899cbf2040b85941afee36ca73292c`
- Normalized SHA-256: `498a7ba35bb74924845de951b1a281ecf70382f4aff74f62f0529537c072eb54`
- Normalized observations: 4,168 hourly points

The existing `months-hourly-v1` profile, 1.0 percentage-point tie threshold, normalization, and scoring functions are unchanged. The local adapter correctly reports the retained 21 missing cadence buckets, while every required event window remains usable: 25/25 windows, full coverage, zero maximum gap, and at least three distinct updates per window.

Recalculated stabilized responses:

| Event | Stabilized response | Delayed increment | Quality |
| --- | ---: | ---: | --- |
| NBR Best Film | +13.0 pp | +1.0 pp | usable |
| PGA top prize | +5.0 pp | −2.5 pp | usable |
| Critics Choice | +4.0 pp | +0.75 pp | usable |
| Golden Globes split | +3.0 pp | +1.0 pp | usable |
| Oscar nominations | −5.0 pp | −1.0 pp | usable |

The existing comparator returns singleton groups in measured order: NBR, PGA, Critics Choice, Golden Globes, nominations. The proposed initial puzzle order remains the frozen narrative/chronological order: NBR, Critics Choice, Golden Globes, nominations, PGA. That order agrees with 7 of 10 comparable pairs (70%). The comparable-pair count is 10; it is not the same quantity as the number of tie groups. No tie or threshold tuning was applied.

All `overlaps` arrays are empty under the existing profile. The exact 1.0-point Critics Choice/Golden Globes boundary remains a disclosed reviewer decision because the comparator’s raw floating-point difference falls fractionally above the threshold.

## Reveal-only ending

The module’s `conclusion` points to `oscars-ending`, sourced separately from the Academy’s 2026 ceremony results page. It is not referenced by any event claim, pre-reveal card, or calculation. The full ending record remains in `docs/launch-work/funnel-expansion/oscars/ending.json`.

## Focused verification

Run with the project’s Node type-stripping convention:

```text
node --experimental-strip-types src/data/oscarsFiveCard2026.test.ts
```

Result: `Oscars v2 playable draft tests passed`.

The focused test verifies strict Study validation, unique ID/slug/version, exact market and YES side, all source cutoffs, all five `getPreRevealCard` results, ending exclusion, primary/corroborating roles, normalized/raw/metadata hashes, 4,168-point normalization, 25 usable windows, no calculated overlaps, tie groups, 7/10 comparable-pair agreement, LocalDatasetAdapter market/contract/series behavior, the retained missing-bucket warning, and a deliberate later-source failure case. `npx tsc --noEmit` also passes.

## Remaining editorial decisions

1. Independently confirm whether first-public seconds can replace the conservative page-availability bounds.
2. Decide whether the exact Critics Choice/Golden Globes 1.0-point boundary should be treated as a tie without changing the current comparator in this worker.
3. Confirm that the two televised precursors are narratively distinct enough for the final dated puzzle.
4. Lead registration, private preview routing, browser QA, and final human approval remain outside this worker’s ownership.
