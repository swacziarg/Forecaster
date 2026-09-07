# NexusPoint launch readiness

Updated September 7, 2026 at 05:40 UTC after the playable-drafts pass. Verdict: **blocked pending exact human approvals**; local draft preparation is complete for the five-topic core.

The requested six-distinct-edition funnel is prepared as a concrete proposal: Biden #002, TikTok #003, Eagles #004, Oscars #005, Bitcoin #006, and Canada #007. Trump #008 is an optional buffer. Only the unchanged Biden content/date is actually approved. The five non-Biden topics are registered as editorial-review drafts and privately playable in local development; no new later daily is registered in the daily schedule, published, deployed, or announced.

## Decision summary

| Gate | State | Evidence |
| --- | --- | --- |
| Preserved archive | Pass | #001 `2026-09-05-biden-dropout` remains intact, archive-playable, and attempt-isolated. |
| User-approved launch | Pass | #002 `2026-09-07-biden-dropout` is in the local registry at `2026-09-07T05:00:00Z`; its exact content hash matches `approvals.json`. |
| Six-edition funnel | Prepared, not approved | Six distinct proposal identities are dated September 7–12; the duplicate Biden content is counted once. |
| TikTok #003 | Ready for human approval | Finish-pass evidence is integrated; 3,023 observations, 25/25 usable windows, no full-window overlaps. |
| Eagles #004 | Ready for human approval | Finish-pass evidence is integrated; 5,167 observations, 25/25 usable windows, no full-window overlaps. |
| Oscars #005 | Ready for independent human decision | Registered strict v2 draft with 4,168 observations, 25/25 usable windows, 7/10 pairwise agreement, and a guarded local preview; conservative timing and precursor distinctness remain editorial decisions. |
| Bitcoin #006 | Ready after identity reconciliation | Registered strict five-card v2 draft with 6,609 observations, 25/25 usable windows, and 6/8 comparable agreement; the existing eight-event v1 remains untouched, with documented overlap and corrected coverage metadata. |
| Canada #007 | Conditional reserve | Registered strict v2 draft with 2,723 observations, 25/25 usable windows, seven comparable pairs, public packaging, and a preserved three-card tie; editorial acceptance remains. |
| Trump #008 | Optional buffer / changes required | Timing and primary-capture decisions remain open, and the current packet intentionally has no response-score/rank handoff. |
| Approved runway | Blocked | Readiness reports 0 consecutive approved upcoming editions, 1 distinct approved content identity, and 6 proposed upcoming editions. |
| Remote release | Not performed | No push, merge, deployment, remote configuration change, or external announcement was authorized or performed. |

## Readiness command result

Command: `npm run check:launch-readiness -- --now 2026-09-07T05:40:00Z --json`  
Result: exit 1, intentionally blocked.

- Registered: 2 (`#001` archive and `#002` launch); released: 2; upcoming: 0.
- Proposed upcoming: 6; distinct proposed funnel: 6.
- Consecutive approved upcoming runway: 0; approved upcoming total: 0; operating target: 7.
- Distinct approved funnel: 1 / target 6.
- First uncovered time: `2026-09-08T05:00:00.000Z` (the Sep 7 launch window ends before the first unapproved proposal).
- Daily and study validators: no errors. Source/build artifact checks: 0 missing across 40 required artifacts. Generic metadata: pass against `https://nexuspoint.lol/`.
- The explicit blocker is `approved funnel has 1 distinct edition(s); target is 6`. The proposals are correctly warnings, not approved runway.

The readiness checker now counts distinct study/version plus event-set identities, so the preserved September 5 Biden archive and fresh September 7 Biden launch cannot be counted as two substantive editions. A Biden-only approval cannot make the requested funnel report ready.

## Verification performed

- `npm test` — passed: event study, daily game, five-study integration, all three worker-focused draft suites, routing, preview routing, and readiness suites.
- `npx tsc -b --pretty false` — passed.
- `npm run build` — passed.
- `npm run build:cloudflare` — passed, including the test-inclusive build.
- `git diff --check` — passed.
- `npx wrangler deploy --dry-run` — passed packaging 52 `dist/` files with no bindings; Wrangler emitted the known local EPERM warning while attempting its preferences log. No deployment occurred.
- Deterministic routing — passed: before Sep 7 resolves to the Sep 5 → Sep 7 gap, exactly at `2026-09-07T05:00:00Z` resolves to #002 daily, after `2026-09-08T05:00:00Z` reports the exhausted local queue, and the Sep 5 link remains archive mode.
- Local development browser rehearsal — passed for the five explicit preview paths in `playable-drafts/funnel.md`: each loaded the real five-card layout, source details, no pre-reveal market data, reveal/result state, tie-aware comparison, isolated archive-mode storage, and spoiler-free preview share path. The current in-app browser verified desktop layout; the shared daily-game mobile matrix from the preceding verification covered 320–430px widths, and the in-app browser did not expose a viewport-override control for a second mobile capture.
- Production-build browser rehearsal — passed for draft shielding: `/studies/<draft-slug>` remains editorial-review, `/__preview/<slug>` does not activate, and `/?preview=<slug>` does not activate the preview path.
- Responsive coverage — the prior finish-pass browser matrix verified 390×844 and 1280×900 layouts and this funnel pass changed no UI code; the production-build route/state checks above were repeated after the current schedule/readiness edits. Native device share, real-device touch, real human playtesting, and remote HTTPS remain unverified.

## Exact remaining actions

1. A human editor must approve each proposed exact study/content identity and release time. The current exact packet is [editorial-review/approval-packet.md](editorial-review/approval-packet.md), and the machine-readable review is [editorial-review/review.json](editorial-review/review.json).
2. Before approving Oscars, decide the conservative timing bounds, Critics Choice/Golden Globes boundary, and precursor distinctness.
3. Before approving Bitcoin, review the `fullMarketLifetime` metadata and day-level anchors; the five-card v2 identity is already separate and the existing eight-event v1 remains untouched.
4. Before approving Canada, accept the AP replacement, conservative timing, and three-card tie.
5. Keep Trump outside the six-edition core unless its remaining source/timing, repeated-Butler, and score-packet decisions are resolved; use it only as the optional buffer.
6. After exact approvals, refresh any moved dates, add only approval-backed entries to `src/data/dailyPuzzles.ts`, rerun all checks and browser rehearsal, and request a separately authorized Cloudflare release. No approval is inferred from this proposal packet.

## Supporting records

- [Six-edition funnel table](funnel-expansion/funnel.md)
- [Proposed schedule](schedule/schedule.md)
- [Machine-readable proposal queue](schedule/proposed-queue.json)
- [Exact approval record](schedule/approvals.json)
- [Operations and rollback guide](operations/release-operations.md)
