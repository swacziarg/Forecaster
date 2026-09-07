# The comeback nobody could call — funnel-expansion remediation

Status: **ready for independent review; not approved, registered, or scheduled**  
Remediation date: 2026-09-06  
Proposed study identity: `trump-comeback-2024-v1`  
Market: Polymarket `253591`  
Perspective: exact YES token retained from the frozen brief

This pass closes concrete evidence gaps in the prior Trump packet. The frozen five-card selection remains unchanged. The packet is an evidence-ready candidate for the launch lead and independent editor; it is not a publication decision.

## What changed

1. The conviction card now has two official records: the Manhattan District Attorney’s same-day notice and the New York court record. They confirm date and substance but do not invent an exact public minute.
2. The RFK card now has Kennedy’s own dated address as the primary record, with the existing CNN segment kept as the conservative public-information bracket.
3. The Iowa Register article remains blocked, but an accessible Reuters copy independently records the poll’s sample, result, margin of error, and Saturday release. The existing CNN broadcast cutoff is retained because the Reuters display timezone is not established.
4. The ABC debate gap is resolved as an interval: ABC’s first-party schedule establishes a 9:00 p.m. EDT broadcast start and 11:00 p.m. post-debate coverage; Nielsen’s contemporary record brackets the live event at approximately 9:00–10:45 p.m. ET; ABC’s full-debate replay independently confirms the event and duration. The corrected cutoff is `2024-09-11T02:45:00Z`, an approximate upper bound. The old ABC page-publication time (`03:58Z`) and later modification (`16:24:39Z`) remain recorded as page metadata and are not backdated.

The correction is frozen in [anchor-correction-v3.json](anchor-correction-v3.json), before the focused engine audit. No market behavior selected or optimized the corrected time.

## Frozen five cards and neutral player copy

Selection freeze: `docs/launch-queue-research/frozen-selection-v1.json`, SHA-256 `79ca8b2e025f15e5fe1ff9040ed1c060d874bf188d2b239f39fc647c0ad33593`. Fixed initial order remains:

`rfk-endorsement`, `conviction`, `iowa-poll`, `butler`, `harris-debate`

Pre-reveal cards:

- `conviction` — “A New York jury finds Donald Trump guilty on 34 felony counts.” Historical date: May 30, 2024. Information cutoff: `2024-05-30T21:15:07Z`, conservative CNN broadcast upper bound.
- `butler` — “A gunman shoots Trump at a Pennsylvania rally; he survives.” Historical date: July 13, 2024. Information cutoff: `2024-07-14T00:00:00Z`, conservative CNN broadcast upper bound.
- `rfk-endorsement` — “Robert F. Kennedy Jr. suspends his campaign and says he will support Trump.” Historical date: August 23, 2024. Information cutoff: `2024-08-23T19:30:00Z`, conservative CNN broadcast upper bound.
- `harris-debate` — “Harris and Trump meet for their first presidential debate.” Historical date: September 10, 2024. Information cutoff: `2024-09-11T02:45:00Z`, approximate end of the live broadcast; the page-publication and later-modification fields remain separate.
- `iowa-poll` — “The final Iowa Poll reports Harris ahead of Trump, 47% to 44%.” Historical date: November 2, 2024. Information cutoff: `2024-11-03T00:00:00Z`, conservative CNN broadcast upper bound.

Do not expose market data, measured responses, resolution, or the ending before reveal. Do not treat a later edited page as evidence that a passage was public earlier than independently established.

## Source-level temporal findings

### Conviction

The Manhattan District Attorney’s dated May 30 notice says the jury found Trump guilty on 34 counts. A New York court record independently states that the verdict was returned on May 30. Neither official page gives a public minute, so the packet keeps the existing CNN 17:00–18:00 EDT bracket as an upper bound. Jury deliberations and surrounding public anticipation remain distinct from the cutoff.

### Butler shooting

The FBI’s Butler investigation record confirms the July 13 incident; the retained CNN 19:00–20:00 EDT transcript is a contemporary broadcast bracket containing the survival report and official response. The card repeats the Butler event already used in Biden #001. Different contract perspective does not eliminate answer-recall risk, so independent editorial review must decide whether the several-days spacing after Biden is sufficient. This is an editorial issue, not a data exception.

### RFK endorsement

Kennedy’s own Aug. 23 address is the primary record. It distinguishes suspending from terminating the campaign and states that he will support Trump in the relevant battleground context. The exact posting minute is unknown; the CNN 15:00–15:30 EDT segment remains a conservative public cutoff. Prior discussion of the decision and the Democratic convention’s end are disclosed anticipation/context, not silently removed.

### Harris-Trump debate

ABC’s schedule says the live debate began at 9:00 p.m. EDT and that ABC News Live post-debate coverage began at 11:00 p.m. EDT. Nielsen’s Sept. 11 contemporary record says the event aired approximately 9:00–10:45 p.m. ET. ABC’s replay page records the event and says it lasted more than 90 minutes. Together these establish a defensible approximate broadcast-end upper bound without relying on the edited transcript page. The transcript’s original publication at `03:58Z` and later modification at `16:24:39Z` remain metadata; neither is used to backdate content.

### Iowa poll

Reuters’ accessible copy, published on November 2, records an 808-person likely-voter survey, Harris 47% and Trump 44%, within a 3.4-point margin of error, and identifies the Des Moines Register/Mediacom poll as released Saturday. The Register page itself returned HTTP 403 and is marked failed, not treated as a capture. The retained CNN 19:00–20:00 EDT program cutoff is used because Reuters’ displayed clock timezone is not established. The delayed window reaches November 5 election-night information and must be disclosed as overlap, not described as a poll-only response.

## Data and technical audit

Dataset: the new single-contract Trump series at `docs/launch-queue-research/datasets/trump-hourly.csv`, SHA-256 `7756111859cbca9f2185795608029323fb21e9505f0314d4700cf7d8b9cc579d`; normalized series SHA-256 `7b75c8dd3b85c151c76bded476ae6e32fa3084781c77cfa176f632e527bdd380`. It has 4,549 retained hourly observations from May 1 through November 6, 2024, one revision bucket, three missing hourly buckets, and no rejected rows. No interpolation, carried-price repair, cross-contract splice, or legacy exception was used.

The unchanged `months-hourly-v1` engine was audited with the corrected debate cutoff and all five anchors. Each of the five event sets has all five windows marked usable; the Iowa delayed window has 23 of 24 valid buckets because of the preserved November 5 missing bucket. No full event windows overlap. The exact invocation and quality counts are in [measurements.json](measurements.json).

This neutral source packet does not reproduce event-response scores, a ranking, tie groups, or comparable-pair counts. Those are evaluative outputs about a political election contract and are intentionally not assigned here. The lead should treat the candidate as evidence-ready for independent review, not as a scored or approved release.

## Reveal-only ending

After reveal, the ending may state that the Associated Press documented its presidential race call for Trump at 5:34 a.m. ET on November 6, 2024. The provider’s own rule required the named resolution sources; the election result and settlement belong only in the ending. Ending capture remains `docs/launch-queue-research/evidence/ap-trump-call.html` with the prior retained hash.

## Recommended decision and exact integration handoff

Recommend **advance to independent editorial review as an evidence-remediated candidate**, with no schedule assignment yet. The prior concrete evidence gaps now have bounded source records and a frozen correction. The remaining decisions are editorial and product-level:

- review the repeated Butler card after Biden #001 and the several-days spacing;
- accept the interval/upper-bound semantics for all five information cutoffs;
- independently decide whether the five-card narrative is suitable for the funnel;
- if approved, integrate this candidate under `trump-comeback-2024-v1`, preserve the fixed initial order, use the new Trump dataset paths/hashes, and keep the election legacy study and Biden #001 unchanged;
- assign a date only through the lead’s expanded schedule after human approval. This worker did not alter the schedule, registry, runtime, or publication status.
