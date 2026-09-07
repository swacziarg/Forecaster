# Operations handoff

This directory owns the local readiness command, its input contract, release/rollback procedure, and proposed shared-document text for task 11.

Artifacts:

- [`readiness-input.schema.json`](readiness-input.schema.json) — self-contained fixture/packet shape.
- [`readiness-input.md`](readiness-input.md) — approval hash and historical exception contract.
- [`release-operations.md`](release-operations.md) — repeatable content workflow, checks, amendment policy, and rollback guide.
- [`shared-doc-proposals.md`](shared-doc-proposals.md) — drafts for the lead; not applied to shared documents in the parallel phase.

Run the focused tests with `npm run test:launch-readiness`. The production checker is `npm run check:launch-readiness`; it exits non-zero when a blocker is present and does not modify the registry, schedule, approvals, or deployment state.
