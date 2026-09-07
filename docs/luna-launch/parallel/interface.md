# Parallel worker: Player interface

Read `docs/luna-launch/parallel/README.md` and follow its worker protocol as role `interface`.

Execute the player-experience work in `docs/luna-launch/09-player-experience.md` immediately against current released content. Do not wait for new editions. If candidate files are not finalized, use existing long headlines for layout checks; the lead tests final candidates later.

Own only `src/App.tsx`, `src/DailyGame.tsx`, `src/styles.css`, your UX report/completion 09, receipt, and a new `src/domain/launchRouting.ts` with its own test file if a routing helper is necessary. Do not edit existing domain modules/tests, package scripts, datasets, or registries. If a domain change is needed, write the exact requirement and reproduction in `docs/launch-work/ux/integration-requests.md` for the lead.

You alone own interactive browser testing during the parallel worker phase. Also inspect UI portions of `docs/luna-launch/10-reliability-and-sharing.md`: source-load error presentation, safe retry behavior, share/copy feedback, storage notices, accessible dialogs, and loading states. Fix UI-only issues while preserving current imported APIs. Leave semantic/storage changes to the reliability worker and final integration. Do not send real shares externally.

Run focused checks; full builds are delegated to operations and the lead to avoid shared build-output races. List new routing tests that need registration in the package test command. Report browser evidence, remaining domain/API requests, and final-candidate checks still needed, then hand off and stop editing.
