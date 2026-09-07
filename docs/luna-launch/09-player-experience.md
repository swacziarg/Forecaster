# 09 — Finish the player experience

Read `docs/luna-launch/README.md`, current `HANDOFF.md`, and `docs/ui-ux-daily-game-audit.md`. Inspect the current app in a browser before editing: many old audit findings are already fixed. Fix observed launch defects without redesigning the product.

## Ownership

Own player-facing routing/navigation, `src/App.tsx`, `src/DailyGame.tsx`, related styles, targeted routing tests, and `docs/launch-work/ux/`. Do not change candidate facts, scores, release dates, or persistence semantics. Write completion `09.md`.

## Execute

1. Walk a released daily through first move, card details, reorder, reveal, score, before/after comparison, takeaway, sharing controls, and optional study exploration. Keep the cream/forest-green editorial identity and five-card focus.
2. Inspect 320×760, 390×844, 430×860, and 1280×720. Fix actual overflow, obscured submission controls, wrapping errors, poor focus visibility, or hard-to-use targets. Preserve scrolling versus hold-to-drag behavior and working keyboard arrow controls. Inspect long candidate headlines, not just Biden.
3. Audit public navigation. Published study filtering already exists in the index; verify selectors, direct draft URLs, and unknown slugs too. Unknown study paths must show a clear unavailable/not-found state rather than silently opening the legacy election. Draft content must not masquerade as a published game; retain any necessary deliberate development preview behind an explicit local mechanism.
4. Make pre-release, exhausted, unknown-daily, and archive states helpful and truthful. Offer the latest released puzzle/archive where appropriate, clearly labeled. No invented next release, fake today's puzzle, misleading daily credit, or looping reload prompt. Keep exact share links associated with the original puzzle.
5. Check keyboard and accessible reading order, move announcements, dialog focus containment/Escape/return focus, result focus, reduced motion, and non-color cues. Ensure neutral cards do not leak expected direction or reveal-only information through hidden accessible labels.
6. Audit visible copy for leftover developer wording and confusing score/probability terminology. Keep metadata generic and spoiler-free. Do not remove essential evidence limitations or claim a measured two-minute completion time without real first-time participants.
7. Fix issues found, run tests/build, and save a short route/viewport report with screenshots or tool evidence where available. Record anything needing real-device or first-time-player verification separately.

## Done when

The real browser flow is coherent across target sizes and keyboard operation; public routes and queue states are honest. No broad rewrite or new product features are required merely to complete this task.
