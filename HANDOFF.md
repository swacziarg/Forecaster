# NexusPoint launch handoff — September 7, 2026

The core lineup is approved and scheduled: Biden September 7, TikTok September 8, Eagles September 9, Oscars September 10, Bitcoin September 11, Canada September 12. Release time is 05:00 UTC (midnight Chicago for these dates). Public launch editions are #001–#006. September 5 testing is excluded from the public registry; its local storage is untouched. Existing September 7 attempts with the previous #002 number restore as #001 without changing scores.

Canonical runtime schedule: `src/data/dailyPuzzles.ts`. Authorization and exact hashes: `docs/launch-work/schedule/approvals.json`. Final evidence decisions: `docs/launch-work/launch-release-review.md`. Current readiness: `docs/launch-work/launch-readiness.md`. Next unscheduled slot is September 13; preparation plan: `docs/launch-work/next-batch.md`.

Full study pages and index are retired; all `/studies/*` paths return to the daily game. Compact Scoring rules, Study and Stats dialogs remain. DEV-only allowlisted `/__preview/` paths provide isolated practice attempts and Start over controls. Production never enables preview routes.

Before reveal, do not expose measured moves, market history, outcomes or later sources. Both cards and optional study background pass source-cutoff filtering. Preserve exact observations and source timing; do not optimize anchors for scores. All required event windows for the six core editions are usable, with evidence caveats recorded in the release review and Study dialogs.

Upcoming editions use `pairwise-anchor-1pt-v2`: inclusive one-point anchor ties with a 1e-12 floating-point tolerance, no chaining. Historical Biden editions retain v1 and unchanged storage identities. Source measurements are unchanged. Oscars PGA/CCA now tie; Canada has a supported three-card tie; Bitcoin's broader Trump/MicroStrategy windows overlap and the snapshot covers only part of market lifetime.

Daily attempts remain keyed by puzzle and scoring version. The first valid submission stays authoritative across tabs. Archive plays never extend daily streaks. Future daily IDs stay sealed; exact released links support archive play. The UI preserves an open attempt across rollover and offers the newer daily instead of silently switching cards.

Deployment: pushes to `main` trigger Cloudflare Workers Builds for `nexuspoint`, serving `https://nexuspoint.lol`. Build command is `npm run build:cloudflare`; only `dist/` is deployed. Secrets must never enter the repository.

Checks: `npm test`, `npm run build`, `npm run check:launch-readiness`, `npx wrangler deploy --dry-run`, `git diff --check`. The evidence suite preserves the legacy election's 3,863 observations, duplicate/missing buckets and golden response values. All nine suites and packaging checks passed for launch activation. A READY report meets the six-distinct-edition launch requirement; the seven-future-edition operating target remains a warning until the next batch is ready.

Older worker reports and receipts are historical records, not the current approval state.

First-time players automatically see “How to play” with a Let’s play button. Dismissal is remembered on the device under `nexuspoint.daily.intro.v1`; Help can reopen it. Saved completed results and private previews skip automatic onboarding.
