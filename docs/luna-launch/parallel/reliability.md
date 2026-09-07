# Parallel worker: Game and storage reliability

Read `docs/luna-launch/parallel/README.md` and follow its worker protocol as role `reliability`.

Execute domain-level work from `docs/luna-launch/10-reliability-and-sharing.md` immediately. This overrides that file's 'run after task 09' instruction: you have exclusive domain ownership and do not edit its UI files.

Own only `src/domain/dailyGame.ts`, `src/domain/dailyStorage.ts`, `src/domain/dailyGame.test.ts`, your reliability report/completion 10, and receipt. Preserve exported signatures and scoring semantics. Do not edit App, DailyGame, CSS, package scripts, study validators, registries, or content. Put any unavoidable interface/API proposal in `docs/launch-work/reliability/integration-requests.md` for the lead to apply after handoff.

Use deterministic tests for storage corruption/unavailability, duplicate and stale writes, release boundaries, archive/stat eligibility, score-band payloads, and native-share/clipboard adapter outcomes. Reuse existing tests and fix observed gaps rather than mirroring implementation. Do not operate the shared browser while the interface worker is using it; explicitly leave real-browser two-tab/device scenarios to the lead.

Run the domain test command using the project's Node version. Full builds and final UI integration are delegated. Report exactly what passed, which browser cases remain, and any cross-owner fixes, then hand off and stop editing.
