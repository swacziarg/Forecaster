# 10 — Verify and repair persistence, sharing, and failure states

Read `docs/luna-launch/README.md`, `src/domain/dailyStorage.ts`, `src/domain/dailyGame.ts`, their existing tests, and `src/DailyGame.tsx`. Start from existing coverage and reproduce gaps before changing behavior.

## Ownership

Own storage/game reliability fixes, necessary UI error/share handling, focused regression tests, `docs/launch-work/reliability/`, and completion `10.md`. Run after task 09 because both may touch DailyGame. Do not change the scoring specification, historical results, editorial statuses, or release schedule.

## Execute

1. In a real browser verify draft reorder → refresh → resume; reveal → refresh → immutable result; exact shared archive link restoration; and ordinary two-tab stale-draft reconciliation. Use isolated test storage, preserving real user attempts. Never clear all browser storage as a shortcut.
2. Exercise damaged records, obsolete versions, storage-denied/quota errors, and late completion across a release boundary. Confirm notices are truthful and stats count only valid on-time results. A current unfinished puzzle can preserve an eligible preceding streak; archive results cannot extend it.
3. Check share payloads contain product, exact puzzle number/score, correct score-band tiles, and exact puzzle link without headline/order/movement spoilers. Test native-share success/cancel/failure and clipboard success/failure with deterministic adapters when platform behavior is unavailable. An automated native-share simulation is not a real-device share test; label it accordingly. Do not send any actual result to another person.
4. Verify slow/failed/malformed local dataset loads and digest mismatch produce a readable recovery state without exposing raw stack traces or crashing. Retry, if added, must preserve the puzzle identity and current attempt. Do not require live provider access at runtime.
5. Inspect console errors and unhandled promise rejections during these flows. Fix reproducible defects with focused regression tests. Keep best-effort local multi-tab behavior honest; do not claim tamper-proof scores, atomic distributed storage, or cross-device sync.
6. Run full tests/build and write a concise matrix of scenario, method (browser/unit), observed result, fix, and remaining platform verification.

## Done when

Results survive supported return flows, failures degrade clearly, sharing is spoiler-free, and no known launch-blocking crash/data-loss regression remains. Explicitly list any unavailable real-browser/device cases instead of claiming them passed.
