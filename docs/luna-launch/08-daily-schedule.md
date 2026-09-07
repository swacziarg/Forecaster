# 08 — Prepare the actual daily queue and publication gate

Read `docs/luna-launch/README.md`, task 06 approvals/verdicts, task 07 integration table, `src/data/dailyPuzzles.ts`, `src/domain/dailyGame.ts`, and its tests. Produce a concrete dated queue; do not disguise unapproved content as published.

## Ownership

Own `docs/launch-work/schedule/`, focused daily-registry validation/tests, approved additions to `src/data/dailyPuzzles.ts`, and exact approval-backed status changes in new study modules. Preserve all released puzzle records. Write completion `08.md`.

## Execute

1. Inventory the registry as it exists now. Retain #001 and every subsequently released identity/version. Detect any entries added by other work before assigning the next unused number.
2. Prepare TikTok → Eagles → Trump in that preference order when each is eligible. Add Oscars/Canada only if reviewed and explicitly approved. Do not insert Mamdani/Anora or silently reorder blocked topics to fill dates. Record any proposed substitution for editorial review.
3. Use a previously approved launch date/cadence if one is recorded. Otherwise propose the next 05:00 UTC boundary at least 48 hours after execution, then consecutive 24-hour releases, matching #001's UTC hour. Label this a proposed assumption, not an approved deadline. Store explicit ISO timestamps, derived IDs, unique numbers, exact study versions, event IDs, initial order, and unchanged scoring configuration in `proposed-queue.json` plus a readable `schedule.md`. Explain local-time/DST display without changing the UTC basis.
4. Check proposed entries against strict study and daily validation. Use isolated test references to validate structure while preserving real draft statuses; clearly distinguish hypothetical publication from actual eligibility. Record how many consecutive approved days exist, how many are proposed, and the next content deadline.
5. Cover exact release boundaries, queue gaps/exhaustion, future and invalid links, released archive links, study version mismatch, five unique event IDs, permutations, and approval/hash mismatches. Add only cases missing from current tests. Preserve the at-most-24-hour daily window and no invented countdown behavior.
6. Only if real human approval covers the exact content versions AND release dates, apply the corresponding local published statuses and registry entries, then rerun real registry validation, tests, and build. Otherwise leave runtime publication untouched and provide the complete ready-to-apply proposal and precise decision needed. Do not request approval before these artifacts exist.

## Done when

The user can approve an exact queue rather than a vague intention. Any local activation is traceable to actual approval; otherwise it is plainly pending. No backdating, retired-ID reuse, production push, or deployment. Rerun this task after a delayed approval to refresh dates safely before release.
