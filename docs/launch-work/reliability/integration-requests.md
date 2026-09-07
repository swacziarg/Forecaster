# Reliability integration requests

The domain layer now returns `{ status: 'stale', attempt }` from `saveDailyDraft` when the stored draft has an `updatedAt` at or after the proposed write. This prevents an older tab from overwriting a newer draft. The daily UI should handle this result by adopting `attempt.order` and showing the same truthful “newer saved progress was restored” notice used for a completed result. No production UI file was changed by the reliability worker.

The domain layer also exports `createDailySharePayload(puzzle, score, origin)`, which centralizes the exact puzzle number/score, completed 20-point tiles, and exact puzzle link while excluding headlines, order, and movement details. The result screen can use it to construct both native-share and clipboard payloads consistently.

Real-browser two-tab draft reconciliation and native/device share remain lead/interface verification items. The domain tests use deterministic adapters only.
