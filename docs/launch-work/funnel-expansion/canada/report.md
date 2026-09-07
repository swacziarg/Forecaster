# Canada funnel-expansion report

Task `01a07776-ca0c-75c1-8e08-0d046c9ff706` completed the Canada role for the six-edition funnel pass on 2026-09-06.

## Recommendation

Recommend Canada as an integration-ready **conditional reserve**, eligible for the lead's September 10–13 proposal range after independent review. The three-card one-point tie is not an automatic blocker: the game has five distinct, understandable developments and seven strictly comparable pairs out of ten. It should not be promoted as approved until a named editor accepts the tie and the source/timing limitations for this exact v2 packet.

## Concrete remediation

- Created a complete v2 packet with `candidate.md`, strict Study-compatible `candidate.json`, `evidence-manifest.json`, `measurements.json`, `selection-freeze.json`, source captures, and this report.
- Replaced the former Axios challenge page with the AP same-day election-call capture `evidence/election-call-ap.html`.
- Removed the unknown-time Elections Canada retrospective from active sources and pre-reveal claims.
- Updated the election-call claim source IDs from Axios to AP without changing the conservative `2025-03-24T04:00:00Z` cutoff.
- Resolved the April 3 source-precision gap: the PMO date-only page remains the primary factual record but the minute-level pre-reveal claim uses only AP, whose `2025-04-03T16:24:16Z` publication is precise enough for the retained anchor.
- Preserved the prior five-card selection, event order, exact YES token, dataset, measurement functions, and scores. No score-driven swap or post-score event replacement occurred.

## Reproducibility and checks

- `node --experimental-strip-types docs/launch-work/funnel-expansion/canada/evaluate-canada.mjs` passed: 2,723 observations, zero missing buckets, 25 usable windows, no overlap, unchanged ranking and tie groups.
- `validateStudy(candidate.study)` passed against the application's strict Study validator.
- JSON parsing passed for the candidate, manifest, freeze, measurements, and status receipt.
- `git diff --check` passed for all owned paths.
- AP replacement capture hash: `ba3b4d5a4a35939ce00001d64c1afa65fb82eeae98029d6b9ac8a6c75a7bd119`.
- Dataset CSV hash: `af754817f1f07f5b6eb71a0658a40faeb9f665398a7b660eb579d05f024ae117`.
- Measurement hash: `0ba4d1bb1c35bc2fb00c6f4ec2496703014272342291e9173c6c02700791da2b`.
- Selection-freeze hash: `ee1f07f6049425be41bc0a0bc3e5b13e66562e4caf5b3f5cffe179fac9f71d4b`.

## Integration changes for the lead

Copy or review the packet as a candidate only. If selected, integrate the exact study ID `canada-liberal-comeback-v2`, slug `canada-liberal-comeback`, version `2`, the exact `study` object, the dataset path and measurement artifact, and the reveal-only ending. Do not edit this worker packet in place after handoff; create any lead integration receipt separately. Do not register or publish without named approval for this exact version/content hash and the normal final browser/readiness checks.

## Remaining gates

1. Independent editor approval of the exact content, source hashes, conservative anchors, and v2 selection freeze.
2. Editorial decision that three rank levels and seven strict pairwise comparisons are sufficiently clear for a reserve edition.
3. Lead-owned final ordering and dated proposal; no date is approved by this packet.
4. No runtime, schedule, registration, deployment, or external announcement was changed here.
