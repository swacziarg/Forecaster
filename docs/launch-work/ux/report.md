# Interface worker report

Date: 2026-09-06
Role: interface

## Completed

- Added route classification in `src/domain/launchRouting.ts` and regression coverage in `src/domain/launchRouting.test.ts`.
- Unknown `/studies/<slug>` paths now show an explicit “Study not found” state instead of opening the legacy election study.
- Known editorial-review studies now show an explicit unavailable state and never masquerade as published content. The public study selector shows “Choose a study” on unavailable routes.
- Kept the daily route and exact `?daily=<id>` archive links on the daily loading/error path, with truthful retry copy that does not expose raw validation or loader errors.
- Removed pre-reveal expected-direction labels from the generalized study ranking and selected-event detail. Direction labels return only after reveal; hidden state uses a neutral, non-directional label.
- Repaired focus behavior for the methodology drawer and daily help/stats dialogs under React strict-mode effects: initial focus enters the dialog, Tab remains contained, Escape closes, and focus returns to the triggering control.
- Kept movement copy explicit as “percentage points” in the legacy study view.

## Browser evidence

Browser: Codex in-app browser, local Vite app.

- `/?daily=2026-09-05-biden-dropout` at 320×760, 390×844, 430×860, and 1280×720: `documentElement.scrollWidth` matched the viewport at every size; all five long headlines stayed within the viewport; the reveal control remained in normal document flow. Measured submit-button bounds were 12–308 at 320px, 12–378 at 390px, 12–418 at 430px, and 485–795 at 1280px.
- At 320px, opening a card’s “Brief & sources” disclosure kept `scrollWidth` at 320px and the disclosure inline with the card.
- Arrow movement announced the new position and retained focus on the moved card’s control.
- Revealing the archive play moved focus to the `30/100` result heading, showed the order comparison, market-implied reaction chart, takeaway, and archive status.
- Copy feedback showed “Result copied.” No external share was sent. Refresh restored the completed result at the exact archive URL.
- `/studies/does-not-exist` showed “Study not found.”
- `/studies/oscars-best-picture-2026` showed “This study is still being reviewed.” and the selector remained on “Choose a study.”
- `/studies/election-2024-v1` no longer exposed “Helps Trump”/“Hurts Trump” before reveal; the selected detail read “Direction hidden until reveal.”
- Methodology dialog: focus entered “Close methodology,” Tab moved within the dialog, Shift+Tab wrapped back, Escape closed, and focus returned to “Methodology.” Daily Help behaved equivalently and returned focus to “Help.”

## Checks

- `npm test` — passed (`eventStudy`, `dailyGame`).
- `node --experimental-strip-types src/domain/launchRouting.test.ts` — passed.
- `npx tsc -b --pretty false` — passed.
- `git diff --check` — passed.
- Full production build — not run by this worker; delegated to operations/lead under the parallel protocol.

## Handoff notes

- No domain/API change request is needed from the interface worker.
- The new routing test is not yet part of the package `test` command. Lead/operations should register `node --experimental-strip-types src/domain/launchRouting.test.ts` (or an equivalent aggregate) during final integration.
- Final candidate headline checks still need a lead pass against the exact selected TikTok/Eagles/Trump edition cards; browser content checks here used the currently released Biden archive because candidate files were not part of this worker’s ownership.
- Real-device touch behavior, first-time-player timing, native share-sheet behavior, and the final integrated production build remain unverified here.
