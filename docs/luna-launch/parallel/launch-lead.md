# Parallel launch lead: review, integrate, and finish

Read `docs/luna-launch/parallel/README.md` and the common launch README. Start now alongside the eight workers; you are responsible for consuming their handoffs and completing later phases without asking the user to manually launch another wave.

## Start useful work immediately

1. Own `docs/launch-work/parallel-status/launch-lead.json` and `docs/launch-work/coordination.md`. Discover the actual worker tasks/receipts by the eight exact entrypoint paths. Record task IDs only if verified. Do not launch duplicate workers or assume an old completion report belongs to this run.
2. Inspect current architecture, scientific invariants, registry, publication rules, and existing verification. Draft the release checklist and identify the integration points. Read tasks 06, 07, 08, 11, and 12 now. During worker execution, do not mutate their owned source files, build outputs, package scripts, browser sessions, or candidate packets.
3. Use task completion waits as described in the parallel README, with bounded waits and cursors. Reconcile actual final receipts with files and task results. Keep working on independent review/checklist work as outputs arrive. Do not end with 'waiting for agents' and imply an unscheduled future continuation.

## Consume completed content while others work

Execute `docs/luna-launch/06-independent-editorial-review.md` for each handed-off candidate. You did not author the candidates, so your agent audit can be independent; disclose its AI nature and preserve the human sign-off requirement. Audit each received packet's exact hashes. Do not treat an unfinished/failed reserve as approval. Create an aggregate final review when all content producers have handed off.

If a packet needs substantive new evidence or selection changes, write a precise hold and finish the other candidates. Do not manufacture an independent approval of replacement content you authored yourself. Missing actual human approval should leave publication pending after all useful preparation is complete.

## Integrate after ALL eight workers hand off

1. Confirm the eight current receipts have `handoffComplete: true`, no worker is still writing, and their final artifacts are present. Acquire practical ownership through those handoffs, not through deleting locks or interrupting tasks. A blocked candidate can be excluded with a clear reason; a missing critical implementation requires completion before readiness.
2. Execute task 07 to integrate eligible studies and local datasets without changing published history. Resolve UI/domain integration requests, preserving measurement behavior. Register focused new tests from interface/operations in the existing test command if not already included. Reconcile any shared-file differences carefully; never revert unrelated user work.
3. Execute task 08 for the concrete queue proposal and real approval-backed activation only. Finish task 11's deferred shared documentation and connect the readiness tool to final review/schedule artifacts. Check all tool input schemas agree; fix them locally if needed.
4. Execute task 12 in full: final tests/build/readiness command, production-build browser rehearsal, mobile/layout checks on newly integrated content, persistence/two-tab/share/error cases delegated by workers, deterministic schedule transition, and final release verdict. All full builds and browser sessions now belong to you.
5. Write completions 06, 07, 08, and 12, append your integration verification to completion 11 without misattributing authorship, and update final topic dispositions/status docs. Preserve producer completion records as historical evidence.

## Finish

Deliver `docs/launch-work/launch-readiness.md` and a brief report covering integrated content, actual approvals, proposed/live local schedule, verified runway, checks, and concrete blockers. Keep content approvals and production deployment honest. This pack does not authorize a push, merge, deploy, remote configuration change, or external announcement. Present an exact reviewable release/approval request only after all authorized preparation is done.

If coordination tools or a worker truly become unavailable, record the specific limitation and the safely completed work; do not claim automatic completion. Normally, all nine tasks start together and you handle their dependencies internally through the final handoff.
