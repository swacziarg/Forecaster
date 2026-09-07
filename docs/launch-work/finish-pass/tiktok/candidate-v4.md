# TikTok finish-pass candidate v4

Status: ready for editorial review. This is a versioned candidate handoff, not an approved Study, queue entry, publication, or deployment.

## Decision

The v4 pass closes the concrete pre-reveal eligibility gap without changing the frozen five-card selection, market, retained price series, anchors, measurement profile, or numeric scores.

The affected legal claims now use contemporaneous Associated Press publication instants as conservative public-by bounds. The Jan. 10 argument claim now uses a contemporaneous CNN live transcript passage at 10:26:18 a.m. ET, before the retained 12:38 p.m. ET proceeding-end cutoff. Official court, order, brief, transcript, and audio records remain the primary procedural or chronological evidence; their date-only or current-page timing is not promoted to a historical first-public timestamp.

## Fixed study inputs

- Market: Polymarket `507276`, “TikTok banned in the US before May 2025?”, settled YES.
- Selected YES token: `24635636911615866092589652362670811323984202357282728474473612545495782013438`.
- Dataset: 3,023 retained hourly normalized observations, `2024-09-18T01:00:00Z` through `2025-01-22T00:00:00Z`; no new price research, filling, reranking, or anchor tuning.
- Frozen event IDs: `trump-elected`, `appeal-lost`, `supreme-review`, `trump-pause`, `supreme-argument`.
- Initial playable order: `supreme-review`, `trump-elected`, `supreme-argument`, `appeal-lost`, `trump-pause`.
- Anchors: `docs/launch-work/tiktok/anchors-v3.json`; v4 makes no anchor change.

## Pre-reveal evidence patch

| Card | Measurement anchor | Precise pre-reveal claim source | Source time and semantics | Primary record retained |
| --- | --- | --- | --- | --- |
| Trump wins the presidential election | `2024-11-06T10:34:42Z` | AP Race Call | `2024-11-06T10:34:42Z`; publisher metadata/body public-by bound, not proven first distribution | AP Race Call |
| Appeals court rejects TikTok’s challenge | `2024-12-06T16:00:00Z` | AP Dec. 6 report | `2024-12-06T15:35:16Z`; contemporaneous publisher public-by bound, not proven first distribution | D.C. Circuit opinion |
| Supreme Court agrees to hear the challenge | `2024-12-18T19:00:00Z` | AP Dec. 18 report | `2024-12-18T16:15:44Z`; contemporaneous publisher public-by bound, not proven first distribution | Supreme Court Dec. 18 order |
| Trump asks for a TikTok pause | `2024-12-27T23:00:00Z` | AP Dec. 27 report | `2024-12-27T22:43:57Z`; contemporaneous publisher public-by bound, not proven first distribution | Trump amicus brief and docket |
| Supreme Court questions TikTok and the government | `2025-01-10T17:38:00Z` | CNN live transcript | `2025-01-10T15:26:18Z` / 10:26:18 a.m. ET; broadcast-passage public-by bound before proceeding end | Official transcript and audio |

The finish-pass captures and locators are recorded in [evidence-addendum-v4.json](evidence-addendum-v4.json) and [evidence-manifest-v4.json](evidence-manifest-v4.json). The AP Jan. 10 article is captured for auditability but published at `2025-01-10T17:59:41Z`, after the retained `2025-01-10T17:38:00Z` cutoff, so it is excluded from the pre-reveal claim.

## Exact runtime patch for lead integration

The runtime file was not edited by this role. Apply the following patch to `src/data/tiktok2025.ts`, whose pre-patch SHA-256 is `0aadb09fa826ec809fdf92866f4b3332be40fa8c1509ca5ebef897cff6312111`:

1. For `appeal-lost`, set the pre-reveal claim’s `sourceIds` to `['ap-dec6']` and `knownAt` to `2024-12-06T15:35:16Z`. Preserve event `informationKnownAt` `2024-12-06T16:00:00Z` and `cadc-dec6-opinion` as primary.
2. For `supreme-review`, set the claim’s `sourceIds` to `['ap-dec18']` and `knownAt` to `2024-12-18T16:15:44Z`. Preserve event `informationKnownAt` `2024-12-18T19:00:00Z` and `scotus-dec18-order` as primary.
3. For `trump-pause`, set the claim’s `sourceIds` to `['ap-dec27']` and `knownAt` to `2024-12-27T22:43:57Z`. Preserve event `informationKnownAt` `2024-12-27T23:00:00Z` and `tiktok-trump-brief` as primary.
4. Add `cnn-jan10-live` with `publishedAt` `2025-01-10T15:26:18Z`, `publishedPrecision: 'instant'`, retrieval time `2026-09-06T18:12:54Z`, and snapshot hash `0befb468ac0f65a5f4603d72646e796c07896c909264c3719369970c8c074c79`. Set the Jan. 10 claim’s `sourceIds` to `['cnn-jan10-live']` and `knownAt` to `2025-01-10T15:26:18Z`; preserve event `informationKnownAt` `2025-01-10T17:38:00Z` and both official proceeding source roles.
5. Mark official date-only court/opinion/order/brief records with publication precision `day`, and official Jan. 10 transcript/audio-detail records with publication precision `unknown` unless an independent historical page-publication instant is established. These records remain primary/corroborating event evidence but are not sole precise eligibility sources.
6. Do not change event selection, anchors, normalized data, scoring profile, ending text, or price-research history.

The exact machine-readable patch is in the `runtimePatchSpec` field of [candidate-v4.json](candidate-v4.json). The lead should independently review and integrate it before changing the candidate or runtime.

## Measurement replay

The finish-pass replay used the unchanged `calculateStudyImpacts`, `createTieGroups`, and `MONTHS_PROFILE` functions, frozen selection, v3 anchors, and normalized dataset:

```text
node docs/launch-work/finish-pass/tiktok/replay-v4.mjs
```

All 25 event windows are usable. The unchanged responses are:

| Card | Short-term response | Cumulative delayed response |
| --- | ---: | ---: |
| Trump wins the presidential election | -0.1175 | -0.1250 |
| Appeals court rejects TikTok’s challenge | +0.1175 | +0.1400 |
| Supreme Court agrees to hear the challenge | +0.0025 | +0.0375 |
| Trump asks for a TikTok pause | -0.0400 | -0.0350 |
| Supreme Court questions TikTok and the government | +0.1250 | +0.1125 |

Tie groups remain:

- `supreme-argument` and `appeal-lost`
- `supreme-review`
- `trump-pause`
- `trump-elected`

These are observed percentage-point movements, not causal estimates. The replay output is [measurements-v4.json](measurements-v4.json); the reproducible runner is [replay-v4.mjs](replay-v4.mjs).

## Player copy and ending

Pre-reveal instruction:

> November 2024–January 2025. Rank five headlines from the biggest rise in the odds of a US TikTok ban before May to the biggest fall.

Keep odds, price history, score labels, and final resolution hidden until the player locks the ranking. The reveal remains reveal-only:

> The Supreme Court upheld the law on January 17. TikTok went dark in the United States around January 19, then restored service that day. Polymarket records two disputed YES proposals followed by a final YES, with provider metadata closing the contract on January 22 at 00:31:19 UTC. Because this contract resolved on a qualifying ban taking effect, the restoration did not change the final YES. None of these ending developments is a sixth card.

Do not equate this contract with a permanent ban or treat the ending as a sixth event.

## Remaining review gates

- Exact first-public web posting instants for the Dec. 6 opinion, Dec. 18 order, and Dec. 27 brief remain unavailable. v4 uses explicitly labeled conservative public-by semantics and makes no exact-first-public claim.
- The AP and CNN historical timestamps prove dated public artifacts/passages, not necessarily the first distribution channel. Current page upload times, archive times, PDF filenames, and local capture mtimes are not substituted for historical publication.
- Human editorial approval is pending for the exact source/claim/runtime patch, wording, study content hash, and release timestamp.
- The launch lead must integrate the patch and run the full tests, build, readiness checks, and browser QA. No registration, queueing, scheduling, publication, or deployment is authorized by this handoff.

