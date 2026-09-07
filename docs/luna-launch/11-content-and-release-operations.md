# 11 — Make content publishing and release verification repeatable

Read `docs/luna-launch/README.md`, the task 08 schedule, current scripts/tests, `docs/cloudflare-hosting.md`, `wrangler.jsonc`, and `index.html`. Build a small local release check and an accurate operating guide; do not add a CMS or external service.

## Ownership

Own `scripts/check-launch-readiness.*`, its package script and focused tests as needed, `docs/launch-work/operations/`, and factual README/HANDOFF/hosting-document updates. Small static metadata/asset-reference corrections are in scope. Write completion `11.md`.

## Execute

1. Add a deterministic local readiness command that reports registered/released/upcoming puzzles, the consecutive approved runway and exhaustion time, duplicate IDs/numbers, missing artifacts, invalid study references/versions, missing eligible card claims, and mismatched approval-to-content hashes. Reuse actual validators. Require recorded human approval for newly published candidates; do not invalidate already approved historical #001 simply because the new packet format did not exist then.
2. Accept an explicit `--now` or equivalent clock input for rehearsal; default to actual UTC time. Report missing queue/approval as a launch blocker. Keep this command separate from ordinary builds so a historical archive does not become unbuildable merely because a daily window ended.
3. Document one repeatable content workflow: source/evidence capture → selection freeze → calculations → independent review → human approval → immutable study version → explicit schedule → checks → separately authorized deployment. Include how to amend a published error without silently replacing a saved answer and when review must be repeated.
4. Set a documented operating target of seven approved upcoming editions, clearly labeled a proposed target rather than existing inventory. Report actual runway and the first uncovered date. Three candidates are three days, not a sustainable backlog. No scheduled automation or analytics signup is authorized here.
5. Verify build output contains all registered dataset files and referenced icons/social image. Check generic spoiler-free canonical/share metadata against the configured production domain, not an invented URL. Do not expose research-only draft answer packets by copying all docs into public assets.
6. Read appropriate Cloudflare/Wrangler skills before hosting work. Run the test-inclusive build and an authorized local Wrangler dry run if available. Inspect configuration for SPA deep-link support and static asset packaging; do not alter DNS, credentials, remote build triggers, or deploy.
7. Update README/HANDOFF with the current actual status, replacing stale claims while retaining historical context. Write a release/rollback guide with exact verification steps: commit/build identity, HTTPS, daily and study deep links, dataset fetches, static metadata, and rollback to a known deployment without overwriting puzzle history. Mark remote facts not checked as unverified.

## Done when

A repeatable command exposes content and publication blockers; the guide matches the code; packaging/metadata checks are evidenced; production remains unchanged. No claims that local success proves a successful deployment.
