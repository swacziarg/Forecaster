# Trump playable-draft handoff

Status: ready for editorial review. This is a historical event-study handoff, not a forecast, candidate evaluation, or causal claim.

## Identity

- Exported symbol: `trumpPlayableDraft`
- Study ID: `trump-comeback-2024-v1`
- Version: `1`
- Slug: `trump-comeback-2024`
- Proposed title: “The comeback nobody could call”
- Provider: Polymarket, market `253591`, selected side `YES`
- Contract token: `21742633143463906290569050155826241533067272736897614950488156847949938836455`
- Condition: `0xdd22472e552920b8438158ea7238bfadfa4f736aa4cee91a6b86c39ead110917`

## Owned files

- [candidate.json](/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/launch-work/playable-drafts/trump/candidate.json)
- [study-draft.json](/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/launch-work/playable-drafts/trump/study-draft.json)
- [score-packet.json](/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/launch-work/playable-drafts/trump/score-packet.json)
- [evidence-manifest.json](/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/launch-work/playable-drafts/trump/evidence-manifest.json)
- [anchor-correction-v3.json](/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/launch-work/playable-drafts/trump/anchor-correction-v3.json)
- [score-packet.test.mjs](/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/launch-work/playable-drafts/trump/score-packet.test.mjs)

## Historical engine output

The unchanged `MONTHS_PROFILE` engine was run against the preserved normalized YES series. The packet contains every one of the 25 windows, including start/end timestamps, levels, expected buckets, valid buckets, coverage, gap counts, distinct updates, and status. All five event sets are `usable`; the Iowa delayed window is `23/24` valid buckets with one preserved missing hourly bucket.

The descriptive stabilized-minus-reference changes in the observed contract-price level are:

| Event | Immediate | Stabilized response | Delayed increment | Cumulative delayed response |
| --- | ---: | ---: | ---: | ---: |
| Conviction | −3.000 pp | −2.000 pp | −1.000 pp | −3.000 pp |
| Butler | +10.000 pp | +10.000 pp | +1.000 pp | +11.000 pp |
| RFK Jr. endorsement | −0.800 pp | −1.175 pp | −0.250 pp | −1.425 pp |
| Harris–Trump debate | −2.875 pp | −2.600 pp | −0.200 pp | −2.800 pp |
| Final Iowa Poll | −4.150 pp | −3.450 pp | +5.500 pp | +2.050 pp |

These are descriptive changes in a historical contract series; they are not election probabilities, forecasts, or a score assigned to any politician. The packet preserves the engine's tie grouping at the 1 percentage-point threshold: `butler`; `rfk-endorsement + conviction`; `harris-debate + iowa-poll`. Comparable cross-group pairs are listed explicitly in `score-packet.json`; no aggregate player/candidate score is emitted.

## Evidence and cutoff corrections

- The Manhattan District Attorney's Office records the May 30, 2024 34-count conviction; the local excerpt and source hash are in the evidence manifest. The [official DA release](https://manhattanda.org/d-a-bragg-announces-34-count-felony-trial-conviction-of-donald-j-trump/) is the primary date/count reference.
- Kennedy's dated first-party statement is retained for the August 23 suspension/endorsement fact: [Kennedy statement](https://robertfkennedyjr.substack.com/p/why-i-am-suspending-my-campaign-for).
- The debate cutoff was corrected from ABC transcript page metadata `2024-09-11T03:58:00Z` to the approximate broadcast-end upper bound `2024-09-11T02:45:00Z`. [ABC's schedule](https://abc.com/news/5e38600c-4732-4cd2-a99c-3dedfa81beb0/category/1138628) establishes the 9:00 p.m. EDT start, while [Nielsen's contemporary record](https://www.nielsen.com/news-center/2024/over-67-million-viewers-tune-in-for-abc-news-harris-trump-debate/) describes the approximately 9:00–10:45 p.m. ET broadcast interval. The bound was not rounded earlier, and the later transcript edit was not backdated.
- The final Iowa poll fact is corroborated by [Reuters' contemporary report](https://www.investing.com/news/world-news/harris-tops-trump-in-latest-iowa-poll-marking-turnaround-des-moines-register-survey-3698510); its displayed timezone is not converted to UTC.
- The [AP election call record](https://www.ap.org/the-definitive-source/behind-the-news/calling-the-2024-presidential-race-state-by-state/) remains reveal-only and is excluded from all five pre-reveal cards and claims.

## Hashes and data boundary

- Frozen selection: `docs/launch-queue-research/frozen-selection-v1.json`, SHA-256 `79ca8b2e025f15e5fe1ff9040ed1c060d874bf188d2b239f39fc647c0ad33593`
- Hourly CSV: `docs/launch-queue-research/datasets/trump-hourly.csv`, SHA-256 `7756111859cbca9f2185795608029323fb21e9505f0314d4700cf7d8b9cc579d`
- Normalized series: `docs/launch-queue-research/evidence/trump-normalized.json`, SHA-256 `7b75c8dd3b85c151c76bded476ae6e32fa3084781c77cfa176f632e527bdd380`
- Market metadata: `docs/launch-queue-research/evidence/trump-market.json`, SHA-256 `7c59b9a4930ed53711cdb971d7f0c15e3a403c4f18e711fa0381ac7b8b993636`
- Raw coverage: 2024-05-01 00:00Z through 2024-11-06 15:00Z; 4,550 raw rows, 4,549 normalized observations, one duplicate/revision bucket, three missing hourly buckets, no filling.

## Validation

Passed:

- `node --experimental-strip-types docs/launch-work/playable-drafts/trump/score-packet.test.mjs`
- `node --experimental-strip-types src/domain/eventStudy.test.ts`
- `node --experimental-strip-types src/domain/dailyGame.test.ts`
- `node --experimental-strip-types src/data/integration.test.ts`
- `node --experimental-strip-types src/domain/launchRouting.test.ts`
- `node --experimental-strip-types scripts/check-launch-readiness.test.mjs`

The focused test verifies strict Study validation, all five `getPreRevealCard` results, all 25 windows, unchanged YES normalization, local hashes, ending exclusion, and failure cases for hindsight claims, date-only same-day sources, and unknown publication time.

## Proposed initial order

The frozen order remains unchanged: `rfk-endorsement`, `conviction`, `iowa-poll`, `butler`, `harris-debate`.

## Remaining precise editorial decisions

1. Decide whether the Butler shooting card is acceptable after the earlier Biden daily card.
2. Approve the approximate debate-end wording and retain the interval disclosure in the final UI.
3. Select the release slot without changing the frozen five-card subset or initial order.
4. Integrate `trumpPlayableDraft` into the shared runtime and registry; those files are outside Trump ownership and were not changed here.

No runtime, registry, package, UI, domain, data, schedule, publication, or deployment files were changed by this handoff.
