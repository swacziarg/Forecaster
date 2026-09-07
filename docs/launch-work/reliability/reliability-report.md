# Reliability report

Task 10 · Game and storage reliability · 2026-09-06

## Completed

- Drafts and attempts are sealed before the puzzle release boundary. Saved records must have a post-release update timestamp; submitted records must also have a submitted-at timestamp no later than their update timestamp.
- Draft writes are monotonic by `updatedAt`: an older or equal write returns `stale` with the newer stored attempt. Submitted attempts remain authoritative on duplicate submissions.
- Stats count only valid on-time daily submissions that are not future-dated relative to the stats read. Archive and late submissions do not count toward played totals, averages, or streaks.
- Storage reads, malformed/obsolete records, denied writes, and quota-like failures remain explicit outcomes instead of throwing through the domain layer.
- Share payload construction is centralized in `createDailySharePayload`; it contains the product, exact puzzle number and score, completed 20-point bands, and exact puzzle URL without headline/order/movement details.
- Share adapter failures are contained. Native-share cancellation recognizes both Error-like and DOM-style `{ name: 'AbortError' }` failures; rejected clipboard adapters become `unavailable` or allow the documented fallback outcome.
- Existing anchor-window tie grouping and pairwise scoring semantics were preserved.

## Scenario matrix

| Scenario | Method | Observed result | Fix/status |
| --- | --- | --- | --- |
| Malformed JSON, duplicate IDs, non-permutation order, obsolete schema | Unit | Passed | Invalid records are ignored and do not contribute stats. |
| Pre-release draft/submission and exact release boundary | Unit | Passed | Pre-release writes are invalid; exact release is accepted. |
| Exact window-end submission | Unit | Passed | Submission at the exclusive end is excluded from official stats. |
| Storage unavailable on read; denied/quota-like write | Unit | Passed | Returns `unavailable`; no exception escapes. |
| Duplicate submission after a completed result | Unit | Passed | First submitted result and order remain authoritative. |
| Older draft after newer draft | Unit | Passed | Older write returns `stale`; newer order remains stored. |
| Archive result, late daily result, and future-dated result | Unit | Passed | None receives official daily credit; future result cannot extend a current streak. |
| Current unfinished puzzle preserving a preceding streak | Unit | Passed | Prior eligible daily streak is preserved until the current puzzle is missed. |
| Score-band share payload | Unit | Passed | Score 56 produces `🟩🟩⬜⬜⬜` and `2/5`; exact puzzle link is present. |
| Native share success/cancel/failure; clipboard success/failure | Unit | Passed | Outcomes are deterministic and failures are contained. |
| Real browser reorder/refresh/resume, reveal/refresh immutability, exact archive link, two-tab draft reconciliation, console/unhandled rejection inspection | Browser | Not run | Explicitly left to the interface worker/lead because the parallel protocol reserves the shared browser for that worker. |
| Native share sheet on a real device; real clipboard permissions | Device/browser | Not run | Unit simulation is not device verification; no result was sent externally. |
| Slow/failed/malformed dataset load and digest mismatch recovery | Integration | Not run | Outside this worker's owned files; lead/interface/operations must verify the recovery state. |

## Checks

- `npm test` — passed: `event study tests passed`; `daily game tests passed` (available host runtime Node `v26.0.0`).
- `npx tsc -b --pretty false` — passed.
- `git diff --check` — passed.
- `npm run build` — not run by this worker; full builds are delegated to operations/lead during the parallel phase.
- Project `.node-version` declares Node 24, but no Node 24 runtime is installed on this host. Node 24 execution remains unverified.

## Cross-owner handoff

See [integration-requests.md](integration-requests.md). The interface worker should handle the new `stale` draft result by adopting the returned order and should use `createDailySharePayload` for native-share and clipboard text. Final browser/device verification remains open.

## Artifact hashes

SHA-256:

- `src/domain/dailyGame.ts` — `90b9e72fb705feb398c94b7be9821981e8b83350e19a9569752d08d2304e90c3`
- `src/domain/dailyStorage.ts` — `8e51dbbb86cbc1780754f7e4f8e97b86069a0be10a34c0586b816a22cba38c3f`
- `src/domain/dailyGame.test.ts` — `00ad5955cdc3b5569c2cdef053d8aecd50f11e28cc5e4a243ca98eea897aee12`
- `docs/launch-work/reliability/integration-requests.md` — `85464f05c2958d6d217c6ffc3ff4c34811ad2896a86abf774c8801bb913d1d86`
