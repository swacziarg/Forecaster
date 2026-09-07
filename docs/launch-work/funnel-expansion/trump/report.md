# Trump funnel-expansion report

Date: 2026-09-06  
Pass task ID: `01a07776-a544-7d53-89fa-4c56b8a878ca`  
Disposition: **evidence-remediated; ready for independent review; not approved or scheduled**

## Exact integration changes

No runtime, registry, schedule, shared-document, legacy-fixture, branch, deployment, or publication changes were made.

If the lead and independent editor accept this packet, integrate the proposed Study identity `trump-comeback-2024-v1` with:

- the unchanged five event IDs: `conviction`, `butler`, `rfk-endorsement`, `harris-debate`, `iowa-poll`;
- the fixed initial order `rfk-endorsement`, `conviction`, `iowa-poll`, `butler`, `harris-debate`;
- market `253591`, the exact YES token, and the dataset paths/hashes in `candidate.json`;
- the corrected debate information cutoff `2024-09-11T02:45:00Z` from `anchor-correction-v3.json`;
- interval/upper-bound precision for the other four cutoffs, rather than invented exact first-public times;
- neutral card copy before reveal and the AP race-call record only in the reveal ending;
- a separate editorial note for the repeated Butler card after Biden #001.

The lead must assign any funnel date only after the relevant independent editorial decision. This pass did not change the September 7 onward schedule.

## Evidence remediation completed

- Conviction: added official Manhattan DA and New York court records, each preserving date/count facts without pretending to supply a public minute.
- RFK: added Kennedy’s own Aug. 23 address as the first-party record; retained the CNN 15:00–15:30 EDT broadcast as a conservative information bracket.
- Iowa: added an accessible Reuters copy with the poll sample, result, margin of error, and Saturday release. The Register page’s HTTP 403 remains recorded as a failed capture; no error page was used as evidence.
- ABC debate: added ABC’s first-party schedule, ABC’s replay page, and Nielsen’s contemporary broadcast-window record. The corrected cutoff is approximately 10:45 p.m. EDT (`2024-09-11T02:45:00Z`), with approximate/upper-bound precision. The old transcript `datePublished` and later `dateModified` values are preserved as metadata only.
- Frozen selection: no event ID, initial order, or card rationale changed. The only evidence correction is the debate cutoff, frozen before the technical audit.

## Dataset and window quality

The new single-contract series has 4,549 retained hourly observations, 4,550 raw rows, one revision bucket, three missing hourly buckets, and zero rejected rows. CSV SHA-256 is `7756111859cbca9f2185795608029323fb21e9505f0314d4700cf7d8b9cc579d`; normalized SHA-256 is `7b75c8dd3b85c151c76bded476ae6e32fa3084781c77cfa176f632e527bdd380`.

The unchanged `months-hourly-v1` engine audit with the corrected anchor found all five event sets usable in anticipation, reference, immediate, stabilized, and delayed windows, with no full-window overlap. The Iowa delayed window has 23/24 valid buckets because the preserved dataset is missing `2024-11-05T22:00:00Z`. Full counts and invocation are in `measurements.json`.

No interpolation, carried-price repair, cross-contract splicing, timestamp optimization, or legacy exception was used. The legacy election fixture remains outside this candidate and untouched.

## Ties and comparable pairs

This neutral worker packet does not assign election probabilities or evaluative event scores/rankings, so it does not publish event-response tie groups or comparable-pair counts. `measurements.json` records these fields as null with the reason. This is a deliberate scope boundary, not a claim that the data are unusable; the packet hands off source and window evidence for independent editorial/product review.

## Neutral copy and editorial disclosures

The five pre-reveal card texts are in `candidate.md` and `candidate.json`. They state only source-backed historical facts. The event cutoffs distinguish occurrence from information-known time and preserve uncertainty. The Butler repetition is explicitly disclosed as answer-recall risk. The Iowa delayed window reaches election-night information. The ending remains reveal-only.

## Remaining decisions

1. Independent editor reviews the five-card subset and repeated Butler card after Biden #001.
2. Independent editor accepts or rejects the conservative interval/upper-bound timing semantics.
3. Launch lead decides whether the evidence-remediated candidate belongs in the six-edition funnel and, only after approval, assigns its date.
4. No publication status, registry entry, score, schedule, or deployment is authorized by this worker handoff.

## Checks

- JSON parse validation for candidate, manifest, measurements, and anchor correction: passed.
- Focused engine audit with corrected debate cutoff: passed; all five event sets usable; no full-window overlap.
- Source excerpt hashes and preserved prior-capture hashes: recorded in `evidence-manifest.json`.
- Legacy fixture/runtime checks: not modified by this worker; full build/test remains with the lead/operations owner.

## Artifact hashes

- `candidate.md`: `ed955d4dff26ccb002cdf1dd3f9e5db802faea6480df3fe2c34885d1266b902e`
- `candidate.json`: `bfa97140210afed4c499b658d1941bb826d64611f427160c289ad2c683715753`
- `evidence-manifest.json`: `31622b73f8a66bffbc4a2bb0a3c67dbb4504101a3545e1fd84a3fff1319879e1`
- `measurements.json`: `c898c9f69b4a629632afa6ce9a354f77341927e8c73315aa7c12a9988a9d3ee5`
- `anchor-correction-v3.json`: `2781e19487328fead55e14556899c5305340c142a93d23a61423b131e9ec3e5d`
