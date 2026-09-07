# Eagles finish-pass report

Task: `01a07776-96d4-79b0-bd23-e5497d37fbc6`  
Role: `eagles`  
Finished: 2026-09-06 18:14:40Z  
Bounded result: **complete**  
Candidate result: **hold for independent review**

## Outcome

The prior packet established game occurrence and completion but used later editable-page modification cutoffs for `informationKnownAt`. This pass retained the frozen five-card selection, contract, dataset, profile, occurrence anchors, combined Hurts injury/loss card, playoff confounds, and ending-only Super Bowl treatment.

Targeted contemporary captures support three earlier public-by boundaries:

- Hurts/Washington: `2024-12-22T22:25:00Z`
- Snow playoff: `2025-01-19T23:10:00Z`
- NFC title: `2025-01-27T00:22:04.795Z`

Falcons and Barkley remain unchanged. The corrected timestamps are conservative supported public-by bounds, not exact first-public instants. The earlier Hurts capture is injury-only and therefore does not replace the combined card boundary.

## Recalculated result

Using the unchanged `calculateStudyImpacts` and `createTieGroups` implementation with the same normalized single-contract series:

- 5,167 usable hourly observations; five above-one prices rejected.
- All 25 windows usable; no full-window overlap.
- New strict 0.01 tie ordering: `nfc-title` > `snow-playoff` > `barkley-record` > `falcons-collapse` > `hurts-concussion`.
- No source/runtime/application files were edited by this worker.

## New owned artifacts

- [candidate-v2.md](candidate-v2.md) — reviewable candidate and handoff narrative.
- [candidate-v2.json](candidate-v2.json) — machine-readable candidate packet.
- [evidence-addendum-v2.json](evidence-addendum-v2.json) — evidence conclusion and exact lead-owned runtime patch.
- [timing-anchors-v2.json](timing-anchors-v2.json) — frozen timing decisions.
- [measurements-v2.json](measurements-v2.json) — recalculated compact measurement output.
- [capture-manifest-v2.json](capture-manifest-v2.json) — capture URLs, archive digests, local hashes, and extracts.
- `captures/` — retained CDX indexes and reviewable HTML/WARC-response derivatives.

## Verification

Passed:

- Parsed every new JSON artifact and the running status receipt.
- Recomputed the five events from the unchanged source functions and dataset.
- Confirmed 25/25 windows are usable, no overlaps exist, and tie groups match `measurements-v2.json`.
- Confirmed no trailing whitespace in owned report/artifact/status files.

Not run by this worker because the finish-pass instructions assign them to the lead:

- Full project test suite.
- Production build.
- Browser/fresh-player QA.
- Registration, queueing, publishing, deployment, or manual launch.

## Exact blockers and handoff

The candidate remains held because exact first-public instants are unresolved, the public-by semantics require independent editorial approval, and human approval is absent. The lead should apply the runtime field/source patch in [evidence-addendum-v2.json](evidence-addendum-v2.json), rerun the measurement/build/browser checks, and preserve the hold until editorial approval is recorded. No further Eagles-owned work is required for this bounded pass.
