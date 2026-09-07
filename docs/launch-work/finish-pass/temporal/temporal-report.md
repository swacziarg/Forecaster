# Temporal finishing-pass report

Role: temporal  
Task ID: `01a07776-f319-7060-b607-f1c73856841b`  
Date: 2026-09-06

## Finding and implementation

The previous validator treated a date-only value such as `2024-12-06` as the exact instant `2024-12-06T00:00:00Z`. That allowed a same-day precise cutoff such as `2024-12-06T16:00:00Z` to pass even though the source could have been published at any point during the date. It also provided no explicit representation for an unknown publication time.

The domain now adds the optional, backward-compatible `Source.publishedPrecision` field:

- `instant`: a timestamp with a time component; existing timestamped sources default to this when the field is omitted.
- `day`: a date-level value. Eligibility uses the following UTC date boundary as a conservative upper bound; it never claims publication occurred at midnight.
- `unknown`: no publication instant is inferred and the source cannot support a pre-reveal claim.

`sourcePublicationPrecision`, `sourcePublicationUpperBound`, and `sourceWasAvailableBy` centralize these rules. Study validation reports date-only and unknown pre-reveal evidence explicitly. Daily-card eligibility uses the same rule, so a card cannot bypass strict study validation through the daily path. Explicitly declaring a date-only value as `instant` is also rejected. Existing scoring, storage, and published data are unchanged.

## Exact draft impact

The unchanged runtime draft modules contain these same-day date-only claim blockers:

| Study | Claim/event | Source(s) | Current cutoff | Required migration |
| --- | --- | --- | --- | --- |
| TikTok | `appeal-lost-fact` | `cadc-dec6-opinion` | `2024-12-06T16:00:00Z` | Add an evidence-backed publication instant, or remove this source from pre-reveal use and reassess the card. |
| TikTok | `supreme-review-fact` | `scotus-dec18-order` | `2024-12-18T19:00:00Z` | Add an evidence-backed publication instant, or keep the card on hold. |
| TikTok | `trump-pause-fact` | `tiktok-trump-brief` | `2024-12-27T23:00:00Z` | Add an evidence-backed publication instant, or keep the card on hold. |
| TikTok | `supreme-argument-fact` | `tiktok-argument`, `tiktok-argument-audio` | `2025-01-10T17:38:00Z` | Establish precise public availability for both cited sources, or remove the unresolved source(s) from the pre-reveal claim. |
| Eagles | `hurts-concussion-fact` | `gamebook-hurts`, `recap-hurts` | `2024-12-22T23:26:58.564Z` | Establish precise public availability for both cited sources, or remove unresolved source(s) from the pre-reveal claim. |

The other date-only Eagles sources are conservatively eligible because their event cutoffs are after the following UTC date boundary. They should still be explicitly marked `publishedPrecision: 'day'` in any migrated runtime module for auditability. No date-only value should be changed to `instant`, and no midnight publication time should be invented.

The current runtime source type keeps `publishedAt: string` to preserve existing consumers. An explicit unknown runtime source can use `publishedPrecision: 'unknown'`, but it must not appear in a pre-reveal claim; if surfaced in a result/source UI, the lead should render an “publication time unknown” label rather than formatting it as a date. Candidate JSON may continue to use its existing `publishedAt: null`/`publishedPrecision: 'unknown'` representation until a separate runtime schema migration is approved.

## Checks

- `node --experimental-strip-types src/domain/eventStudy.test.ts` — passed.
- `node --experimental-strip-types src/domain/dailyGame.test.ts` — passed.
- `npx tsc -b --pretty false` — passed.
- `git diff --check` — passed.
- `npm test` — expected failure at `src/data/integration.test.ts:16`: the stale integration assertion still requires TikTok to pass strict validation; the new validator correctly reports 5 date-only cutoff errors. Direct validation reports 2 equivalent Eagles errors. This pass did not edit the unowned integration test or any study data module.
- `npm run build` and browser QA — not run; owned by the launch lead in this finishing pass.
- Commands ran with the available Node `v26.0.0`; the checkout declares Node 24, which is unavailable on this host.

## Files changed in this pass

- `src/domain/study.ts`
- `src/domain/dailyGame.ts`
- `src/domain/eventStudy.test.ts`
- `src/domain/dailyGame.test.ts`
- `docs/launch-work/finish-pass/temporal/temporal-report.md`
- `docs/launch-work/finish-pass/status/temporal.json`

No `src/data/*.ts` file was edited. The lead must apply exact source-field migrations in a new study-data revision, update integration expectations, rerun all hashes/measurements, and obtain editorial review for the revised version before any publication or schedule change.

## Remaining blockers

- TikTok and Eagles draft runtime studies are not strict-validator clean until the exact source-publication migrations above are evidenced. This is an intentional blocker, not a test exemption.
- The lead still owns full test/build/readiness integration, real-browser rehearsal, and final human approval/scheduling gates.

## Artifact hashes

- `src/domain/study.ts`: `35fa8684cd587a7d827afa857b62c45251cd4af2491ee58cfadf1f63a564702a`
- `src/domain/dailyGame.ts`: `dc8fd4241092f451efe39c6ad1c05537fe9036063167ff4b51285208142a9b54`
- `src/domain/eventStudy.test.ts`: `c274e4a62065ecba5bcf8656189f9e6c7dfea165706d73e05436c26c6ed4db0b`
- `src/domain/dailyGame.test.ts`: `f815df386d11ad37e1164b756b49563107c5942390e7ee76f195027a2658c3d3`
- `docs/launch-work/finish-pass/temporal/temporal-report.md`: `69adbe01d7530947aa1718b0d868381bf526a5304f99427445375858ca23ecbd`
