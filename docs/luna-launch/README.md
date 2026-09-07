# NexusPoint launch execution pack

These are execution instructions for individual Luna tasks, prepared September 6, 2026. Work in `/Users/simonwacziarg/Documents/ChatGPT/Forecast`, or the checkout containing these files. Read this file before executing any numbered task.

## Run order

**Recommended: start all nine prompts in `parallel/README.md` at once.** That pack assigns exclusive file ownership and gives a launch lead responsibility for dependent review, integration, scheduling, and final verification. You do not need to launch later phases yourself. Its coordination and ownership rules override the sequential instructions below when you enter through a parallel prompt.

The original numbered files remain detailed work specifications. For a manual sequential run only, run 01–12 in order, waiting for each task to finish. Use a fresh Luna task for 06 so the reviewer did not author the candidate packets. Tasks 04 and 05 build reserves; a documented hold there does not prevent the three primary candidates from advancing. The numbers on these task files are work order, not puzzle edition numbers. No agents have been started by this pack.

| Task | Result |
| --- | --- |
| 01 | TikTok evidence and five-card candidate |
| 02 | Eagles evidence and five-card candidate |
| 03 | Trump evidence and strict five-card candidate |
| 04 | Oscars culture reserve, or a precise hold |
| 05 | Canadian election reserve and disposition of weaker topics |
| 06 | Independent editorial audit and concrete human sign-off packet |
| 07 | Tested local study integration |
| 08 | Dated daily schedule proposal and publication checks |
| 09 | Player-facing navigation, empty states, and mobile polish |
| 10 | Persistence, sharing, and failure-path fixes |
| 11 | Repeatable content and release operations |
| 12 | Full launch rehearsal, fixes, and release decision |

## Starting facts — verify against the checkout

The repository has six registered studies and only one scheduled daily: #001, `2026-09-05-biden-dropout`, released at `2026-09-05T05:00:00Z`. Its daily window is over at this pack's preparation time; its exact archive link still works. A later task may have changed this by the time you run.

The launch research recommends TikTok, Eagles, then Trump. These are candidates, not approved releases. Mamdani is on editorial hold and Anora has failing historical coverage. The four other old portfolio drafts are not automatically approved. The old UI audit describes many problems that HANDOFF.md says have already been fixed; inspect the current implementation before changing anything.

The research directory is currently untracked. Preserve it and all unrelated work. Cloudflare hosting documentation says pushes to main deploy automatically. This pack authorizes local preparation and verification, not pushing, merging, deploying, changing remote settings, or sending messages externally.

## Working rules

1. Read `README.md`, `HANDOFF.md`, your task's inputs, and any applicable `AGENTS.md`. Inspect current changes before editing. You are not alone in this checkout: never reset, clean, revert, or overwrite another task's work. Do not start additional agents or tasks unless separately requested.
2. Execute the task; do not return just a plan. Keep scope bounded. If part is blocked, finish the independent portions and leave a precise handoff with evidence and the next action. Do not claim launch readiness with unresolved blockers.
3. Preserve all original `docs/launch-queue-research/` evidence, frozen selections, anchors, measurements, and hashes. Write new candidate work to `docs/launch-work/<topic>/`. Do not run research builders that overwrite the original packet. New evidence gets retrieval time, source URL, hash, and a capture-status record; failed downloads are not captured sources.
4. A retrieved page hash proves today's bytes, not historical availability. Separate event occurrence, first public information, broadcast time, page upload/update time, and retrieval time. Use honest precision and timezone. Never fill unresolved schema fields with a made-up time. State explicitly when only a conservative upper bound is known.
5. Preserve the hindsight firewall: before reveal, no measured moves, price endpoints, resolution, retrospective claims, expected-direction hints, or answer-bearing metadata/accessible labels. Source-backed factual cards remain available. This is a player-experience boundary, not a claim that static client assets can prevent determined cheating.
6. Keep the existing measurement profile and `pairwise-anchor-1pt-v1` scoring. No interpolation, carried-price repair, relaxed quality thresholds, cross-contract splicing, or selection of timestamps/headlines to obtain more dramatic moves. After an evidence-based timestamp correction, freeze a new version before recalculation and retain the old results. Do not call descriptive changes causal effects. Percentages and percentage points are different.
7. Preserve published puzzle IDs, numbers, event sets, study versions, initial orders, scores, and saved attempts. The legacy election fixture remains 3,863 observations, one duplicate hourly bucket, two missing hourly buckets, and its existing ten golden responses. Do not give a new daily the legacy validation exception.
8. Editorial approval is a real gate. `docs/adr/001-generalized-event-studies.md` reserves publication and event selection for human editorial decisions; `docs/editorial/portfolio-review.md` requires independent review and named, timestamped sign-off. A Luna audit prepares that decision; it must not impersonate a human approver or silently waive the rule. Build all reviewable artifacts first. Apply publication status/scheduling only when actual approval covering the exact version is recorded. Existing explicit user approval can satisfy the relevant gate; do not ask twice.
9. Use the available skills appropriate to actual work, including Cloudflare/Wrangler skills if working on hosting. Research new factual claims using primary sources and retain citations. No signup, database, live market dependency, analytics service, or framework migration is required by this pack.

## Candidate handoff contract (tasks 01–05)

Each candidate directory must contain `candidate.md`, `candidate.json`, `evidence-manifest.json`, `measurements.json`, and any newly captured evidence. Use topic keys `tiktok`, `eagles`, `trump`, `oscars`, and `canada`. A blocked candidate still gets an explicit status and missing fields; it does not get invented scores.

`candidate.json` must identify readiness (`ready-for-review`, `hold`, or `blocked`), topic, proposed study ID/slug/version, exact market/contract/side, dataset references and hashes, five event IDs and initial order, source records, source roles, claims, event timing and precision, measurement profile, ending, and unresolved gates. Where possible use the actual Study field names. Unknown values stay null in this research artifact, never in a registered Study. Include an approval field initialized as pending, not approved.

`candidate.md` must explain selection, evidence per claim, original-versus-corrected anchors, mechanisms, confounds, overlap, provisional measurements and ties, neutral pre-reveal copy, and reveal-only ending. New selections must be frozen with a timestamp/hash and written reasons before event scoring; disclose any prior exposure to measurements. Measured results must come from the existing application functions, with the invocation retained. A ready candidate has five eligible cards, all 25 required windows usable, and a scored comparison set that is meaningful under existing ties.

## Completion contract (every task)

Write `docs/launch-work/completions/NN.md` with: task and date; files changed; what is complete; checks actually run and their results; remaining blockers with exact evidence; next task inputs. Create parent directories as needed. Mark checks you could not run as unverified, never passed. Finish the conversation with a short result, artifact links, and any required decision.

For application changes, run `npm test`, `npm run build`, and `git diff --check` using the project's Node version. Add focused regression tests for new behavior or defects; do not add tests for prose-only changes. Review untracked outputs as well as tracked diffs. Browser checks must actually use a browser and record viewport, route, and observed result. Do not present a build as proof of mobile usability or human playtesting.
