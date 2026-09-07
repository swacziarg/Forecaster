# Proposed shared-document updates for the launch lead

These are drafts only. The operations worker does not edit the shared README, HANDOFF, or hosting documentation during the parallel phase.

## Proposed README addition

Add the following to the verification section:

> Local release readiness is checked with `npm run check:launch-readiness -- --now <ISO-UTC>`. It reuses the study/daily validators, checks dataset and static assets, validates generic metadata against the configured production domain, and distinguishes registered, approved, and proposed runway. The historical #001 approval is a documented compatibility exception; new editions require a named human approval for the exact content hash, study version, and release timestamp. A passing local check does not establish remote deployment success.

## Proposed HANDOFF replacement for stale queue language

After the final schedule review, replace the queue paragraph with the verified values from the readiness JSON report. Keep the distinction explicit:

> The live registry contains [N] released and [N] upcoming editions. [N] upcoming editions have exact human approval and form a consecutive runway through [ISO timestamp]. The first uncovered time is [ISO timestamp]. The seven-edition operating target is proposed planning guidance, not existing inventory; [N] additional entries remain proposed/unapproved.

Do not fill the placeholders until the lead has integrated the final schedule and approvals.

## Proposed hosting-document addition

Add the following to the local verification section:

> Before any separately authorized deployment, run `npm test`, `npm run build`, `npm run check:launch-readiness`, and `npx wrangler deploy --dry-run`. Confirm that `dist/` contains every registered dataset path and the favicon/social assets, and record commit/build identity. Remote HTTPS, Workers Build status, and production deployment remain unverified unless checked directly; local success is not deployment proof.
