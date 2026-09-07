# 12 — Rehearse launch, fix remaining defects, and deliver the decision

Read `docs/luna-launch/README.md` and all available completion reports 01–11. Inspect actual artifacts and current code; prior reports are evidence to verify, not permission to mark missing work done.

## Ownership

Own `docs/launch-work/launch-readiness.md`, a concrete release checklist, completion `12.md`, and narrowly scoped fixes needed to clear launch defects. Preserve unrelated changes and all frozen/public identities. Substantive evidence/content/scoring changes require updated review and approval instead of silently carrying old sign-off forward.

## Execute

1. Inventory the final content: candidate readiness, independent verdict, actual human approval, integrated study/dataset versions and hashes, dated queue, approved runway, and reserves/holds. Distinguish 'implemented', 'editorially approved', 'scheduled', and 'deployed'. Check dates against execution time; a proposed launch date may now be stale.
2. Run `npm test`, `npm run build:cloudflare`, `git diff --check`, and the new readiness command. Inspect untracked deliverables and broken local references. Record the exact commands, timestamps, revision if available, and failures. Do not upgrade dependencies just for freshness.
3. Serve the production build locally and complete a fresh-player session in the browser: instructions, all five cards, movement, reveal, score/ties, share-copy payload, refresh, archive reopening, and study navigation. Exercise narrow mobile and desktop layouts. Test the scheduled next-edition boundary with a deterministic clock/fixture, preserving live registry and user attempts; confirm an open attempt does not silently switch.
4. Recheck invalid/future daily links, invalid study path, draft visibility, queue exhaustion, storage-disabled notice, and dataset-load failure. Confirm console errors and blocked/missing assets are absent. Document native device/share and real participant checks that remain unavailable.
5. Fix concrete P0/P1 defects (crashes, wrong answers, spoilers, lost results, unusable mobile controls, invalid publication). Add regression coverage where appropriate and rerun affected checks plus the final build. Leave cosmetic preferences as non-blocking follow-ups instead of undertaking another redesign.
6. Produce `launch-readiness.md` with one verdict: `ready-for-release`, `ready-pending-approval`, or `blocked`. List exact remaining decisions/actions with artifact links, not generic warnings. State the verified approved runway and first content gap. A short queue may support a limited launch but is not a week of ready content.
7. Prepare the exact deployment/release steps for the current Cloudflare setup, using current official guidance if technical details need checking. Include rollback verification and checks of the eventual live build. This task does not authorize pushing main, merging, deploying, changing remote configuration, or sending external announcements. If those are the only remaining actions, present the concrete reviewed release for approval at the end; do not claim it is live.

## Done when

The user gets a candid release decision, working local artifacts, verified test/browser evidence, and a short actionable list of anything still preventing launch. No invented editorial approval, human usability results, production verification, or 'all done' while a required step remains unhandled.
