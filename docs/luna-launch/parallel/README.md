# Start all nine Luna tasks together

The user wants simultaneous starts with no manual sequencing. Start each entrypoint in its own Luna task using the same local Forecast project directory: `/Users/simonwacziarg/Documents/ChatGPT/Forecast`. These prompts coordinate through shared files. They are not designed for independent worktrees with isolated output directories. If the task started elsewhere, explicitly use the named shared project for this work; do not mistakenly write receipts into another checkout.

Read `docs/luna-launch/README.md` for evidence, editorial, immutable-data, and completion rules. This parallel pack overrides only execution order, ownership, and the stated phase boundaries. All scientific and approval gates still apply.

## Entrypoints and exclusive ownership

| Start immediately | Owns during parallel phase |
| --- | --- |
| `tiktok.md` | `docs/launch-work/tiktok/`, completion 01 |
| `eagles.md` | `docs/launch-work/eagles/`, completion 02 |
| `trump.md` | `docs/launch-work/trump/`, completion 03 |
| `culture.md` | `docs/launch-work/oscars/`, completion 04 |
| `canada.md` | `docs/launch-work/canada/`, topic-disposition.md, completion 05 |
| `interface.md` | `src/App.tsx`, `src/DailyGame.tsx`, `src/styles.css`, new `src/domain/launchRouting.ts` and `launchRouting.test.ts` if needed, UX report, completion 09 |
| `reliability.md` | `src/domain/dailyGame.ts`, `src/domain/dailyStorage.ts`, `src/domain/dailyGame.test.ts`, reliability report, completion 10 |
| `operations.md` | new readiness script and its own tests, package.json script additions, operations guide, static metadata/assets, completion 11 |
| `launch-lead.md` | coordination ledger; then review/integration/schedule/final QA after relevant workers hand off |

Each worker also owns only its own `docs/launch-work/parallel-status/<role>.json`. Role is the entrypoint filename without `.md`. No worker edits the central ledger or another worker's receipt. Shared README, HANDOFF, study registries, dataset modules, and published status changes belong to the lead after worker handoff. Do not edit this prompt pack while executing it.

## Worker protocol

1. Start useful work immediately. Do not wait for earlier-numbered original tasks. Inspect current changes; preserve other work. Do not change Git branches, reset files, stage/commit/push, or spawn additional tasks. Keep existing public function signatures and measurement semantics stable; leave a requested cross-owner change in your report for the lead instead of editing another owner's file.
2. At start write your receipt with `role`, `status: running`, `startedAt`, `updatedAt`, `workspace`, `taskId` if actually available, owned paths, and report path. If a receipt from an earlier run exists, retain it with a dated name before writing the current one. Do not invent task IDs.
3. Work only in owned paths. Source-content workers may research concurrently. The interface worker owns interactive browser checks during this phase; other workers use unit/file checks and leave browser scenarios for final integration. Do not manipulate another worker's browser tabs or shared browser storage.
4. Avoid overlapping production builds: operations owns full builds during the parallel phase, and the lead owns final builds afterward. Other workers run focused tests and report that the final build is delegated. If an unrelated transient edit causes failure, report it accurately rather than modifying unowned code to silence it.
5. Write the original numbered completion report plus exact artifact paths/hashes, tests, cross-owner fixes requested, and unresolved blockers. Then write your receipt LAST with `status: complete` or `blocked`, `finishedAt`, the report path, artifact hashes, and `handoffComplete: true`. A blocked receipt means bounded work is finished and the evidence explains the blocker; it is not approval to publish.
6. Once handed off, stop writing those files. If the user later restarts the task, change the receipt to running before edits so the lead knows the earlier handoff is no longer stable. Do not assume a stale receipt is the current run.

## Launch lead protocol

The lead starts concurrently and does useful read-only baseline inspection and a release-checklist draft. It discovers the eight worker tasks using exact entrypoint paths in prompts/status plus task IDs when available; titles alone are insufficient. Use the app's list/read/wait task tools if available. Wait in batches of up to eight with cursors and at most 60-second waits, checking receipts only after a completion/change. If tools are unavailable, use bounded waits and receipt checks, not a tight polling loop. Do not create automations, duplicate workers, or claim you will resume after ending your turn without a real mechanism.

Review each content packet after its producer's final handoff, while other workers continue. Defer edits to source packets, integrated code, registry, package scripts, global docs, and final browser runs until all eight workers have handed off. Missing/running work is pending, not blocked merely because it takes time. If a task truly fails or was not launched, report it precisely; do not pretend its output exists. Complete independent work and request the missing input only if coordination cannot proceed.

After handoffs the lead owns integration, cross-owner fixes, final full tests/builds, and browser QA. Ready content can advance while a reserve has an explicit hold. Do not author a replacement candidate and claim you independently approved your own work. The lead's audit is independent AI review; required human publication approval remains a separate real decision.

All nine tasks can be started together. Some work necessarily consumes other work's results; the lead manages that dependency inside its task, so the user does not have to run a second wave.

For Codex environment background, see [official worktree documentation](https://learn.chatgpt.com/docs/environments/git-worktrees). This particular pack deliberately uses disjoint ownership in one shared local checkout.
