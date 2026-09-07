# TikTok candidate handoff — hold

**Task:** 01 — TikTok launch worker  
**Topic:** tiktok  
**Title:** The app that went dark  
**Status:** `hold` — bounded research and replay are complete, but this is not ready for queueing.

The exact contract and five-card selection are preserved. The retained 3,023-row hourly YES series was replayed against the existing study engine after the anchor revision. All 25 measurement windows are usable and the result is stable. The remaining hold is evidence/editorial: the primary court and filing records expose dates and substance but not historical first-public posting times for the December 6, December 18, and December 27 developments. Contemporary AP and CNN material establishes conservative public-by bounds, which are used as measurement cutoffs and explicitly not represented as exact first-public times.

## Selection and immutable identity

The selected market is Polymarket market `507276`, **“TikTok banned in the US before May 2025?”** The selected perspective is native `YES`, with the exact YES token:

`24635636911615866092589652362670811323984202357282728474473612545495782013438`

The selection was frozen at `2026-09-06T00:24:51.987941+00:00` in `docs/launch-queue-research/frozen-selection-v1.json` (SHA-256 `79ca8b2e025f15e5fe1ff9040ed1c060d874bf188d2b239f39fc647c0ad33593`) before the replay. The five IDs and order are unchanged:

1. `trump-elected`
2. `appeal-lost`
3. `supreme-review`
4. `trump-pause`
5. `supreme-argument`

The fixed initial presentation order remains `supreme-review`, `trump-elected`, `supreme-argument`, `appeal-lost`, `trump-pause`. It is a positional permutation, not a price-ranked result.

The draft player-facing instruction is deliberately neutral:

> November 2024–January 2025. Rank five headlines from the biggest rise in the odds of a US TikTok ban before May to the biggest fall.

No odds, settlement language, or measured answer is exposed in pre-reveal copy.

## Evidence and timing audit

### 1. Trump wins the presidential election

- Historical date: November 6, 2024.
- Measurement cutoff: `2024-11-06T10:34:42Z` (5:34:42 a.m. EST page timestamp; the article body says AP declared Trump the winner at 5:34 a.m. EST).
- Precision: minute for measurement; exact first distribution remains unproven.
- Supporting artifact: `docs/launch-work/tiktok/evidence/ap-race-call.html`, lines 38 and 969. Those locations contain the AP `datePublished`/`dateModified` metadata and the JSON-LD description/body describing the call.
- Source role: contemporary AP race-call artifact. The retained AP retrospective explainer is not used as the sole contemporary source.
- Cutoff rationale: this is a contemporaneous public publisher artifact, not a claim that AP’s page timestamp proves the first channel or first instant at which the result circulated.
- Mechanism recorded before scoring: a Trump victory could create a perceived political route to delay or soften enforcement, lowering the implied ban probability.
- Interpretation after replay: the measured response is negative, but election returns were public throughout the overnight reference window and the call confirmed an already anticipated result. Attribution is mixed.

### 2. Appeals court rejects TikTok’s challenge

- Historical date: December 6, 2024.
- Measurement cutoff: `2024-12-06T16:00:00Z` (the conservative end of retained 10:30–11:00 a.m. EST live court coverage).
- Precision: interval/public-by upper bound; exact first-public court posting is unresolved.
- Supporting artifacts: `docs/launch-work/tiktok/evidence/cadc-dec6-opinion.pdf` (cover/first page and conclusion establish the dated decision and holding); `docs/launch-work/tiktok/evidence/ap-dec6.html`, lines 42, 998, and 18024 (publisher metadata at `2024-12-06T15:35:16Z` and body reporting the unanimous ruling); retained CNN live transcript `docs/launch-queue-research/evidence/tiktok-dec6-correct.html` (10:30–11:00 a.m. EST segment).
- Cutoff rationale: the official opinion and D.C. Circuit index do not expose a historical web-post time. The AP timestamp proves the ruling was publicly reported by `15:35:16Z`; the broadcast-end cutoff is retained as a conservative upper bound for the public information window.
- Mechanism recorded before scoring: a merits defeat leaves the divest-or-ban law on course and raises the chance of a qualifying ban.
- Interpretation after replay: the implied ban probability rose in the stabilized window, but the scheduled decision, divestiture mechanics, and likely appeal were one anticipated information cluster. Attribution is mixed.

### 3. Supreme Court agrees to hear TikTok’s challenge

- Historical date: December 18, 2024.
- Measurement cutoff: `2024-12-18T19:00:00Z` (the conservative end of retained 1:30–2:00 p.m. EST reporting).
- Precision: interval/public-by upper bound; exact first-public order posting is unresolved.
- Supporting artifacts: `docs/launch-work/tiktok/evidence/scotus-dec18-order.pdf`, first page — “ORDER LIST, WEDNESDAY, DECEMBER 18, 2024” and “CERTIORARI GRANTED”; `docs/launch-work/tiktok/evidence/ap-dec18.html`, lines 42, 984, and 16890 — publisher metadata at `2024-12-18T16:15:44Z` and body reporting that the Court would hear arguments; retained CNN transcript `docs/launch-queue-research/evidence/tiktok-dec18-cnn.html` for contemporaneous reporting.
- Cutoff rationale: the official order and docket establish the dated certiorari grant, consolidation, and argument setting, but not a historical posting time. The AP timestamp proves public reporting by `16:15:44Z`; the `19:00Z` cutoff remains a conservative public-by bound.
- Mechanism recorded before scoring: Supreme Court review creates an institutional path for relief, even though the order did not stay the statute or decide the merits.
- Interpretation after replay: the stabilized response is only +0.25 percentage points, within the one-point tie threshold. This is treated as effectively undetectable under the chosen profile, not as evidence that review harmed TikTok.

### 4. Trump asks the Supreme Court to pause the deadline

- Historical date: December 27, 2024.
- Measurement cutoff: `2024-12-27T23:00:00Z` (the conservative end of retained 5:00–6:00 p.m. EST reporting).
- Precision: interval/public-by upper bound; exact first-public filing post is unresolved.
- Supporting artifacts: retained primary brief `docs/launch-queue-research/evidence/tiktok-trump-brief.pdf` and Supreme Court docket `docs/launch-queue-research/evidence/tiktok-docket.html`; `docs/launch-work/tiktok/evidence/ap-dec27.html`, lines 44, 988, and 15764 — publisher metadata at `2024-12-27T22:43:57Z` and body reporting Trump’s request; retained CNN transcript `docs/launch-queue-research/evidence/tiktok-dec27-cnn.html`, whose first report is at 5:17:12 p.m. EST.
- Cutoff rationale: the brief and docket establish the December 27 filing. The PDF filename and filing-date metadata are not treated as proof of public release. AP and CNN establish public-by evidence; the `23:00Z` cutoff preserves the original conservative bound.
- Mechanism recorded before scoring: an incoming president’s request for time to pursue a political resolution could lower the near-term chance of the law taking effect.
- Interpretation after replay: the implied ban probability fell four percentage points in the stabilized window, a modest repricing rather than a court-ordered delay. Holiday liquidity and political-deal expectations are competing explanations.

### 5. Supreme Court questions TikTok and the government

- Historical date: January 10, 2025.
- Measurement cutoff: `2025-01-10T17:38:00Z` (12:38 p.m. EST, the official transcript end after a 10:08 a.m. EST start).
- Precision: minute for the proceeding end; the cutoff is an upper bound for a continuous public hearing, not a ruling time.
- Supporting artifacts: retained official transcript `docs/launch-queue-research/evidence/tiktok-argument.pdf` text extraction, lines 185, 469, and 19780, recording the 10:08 start and 12:38 end; official audio-detail page `docs/launch-queue-research/evidence/tiktok-argument-page.html`, identifying TikTok v. Garland, No. 24-656, argued January 10, 2025.
- Cutoff rationale: the hearing unfolded publicly over 150 minutes. Questions are not votes or a judgment, so the end-of-proceeding anchor is kept separate from the January 17 ruling.
- Mechanism recorded before scoring: the argument tests rival speech and national-security positions and can alter expectations about the approaching deadline without being a judgment.
- Interpretation after replay: the implied ban probability rose 12.5 percentage points by the stabilized window, while argument content and the approaching deadline both remained relevant. Attribution is mixed.

## Original versus corrected anchors

`anchors-v3.json` supersedes `docs/launch-queue-research/anchors-v2.json` and was created before replay. The only numerical cutoff change is the election anchor, from `2024-11-06T10:34:00Z` to `2024-11-06T10:34:42Z`, after capturing the contemporary AP Race Call page. The legal anchors remain unchanged at `16:00Z`, `19:00Z`, and `23:00Z`; the January 10 anchor remains `17:38Z`.

This revision is evidence-driven, not price-driven. It does not claim that AP metadata or any legal broadcast identifies an exact first-public instant. The legal records were checked against official opinion/order/brief/docket records, contemporaneous AP pages, and retained CNN transcripts. No additional price download was made or needed.

## Measurements — post-reveal/editor-only

Replay invocation: `node docs/launch-work/tiktok/replay.mjs`. The replay imports the unchanged application functions `calculateStudyImpacts`, `createTieGroups`, and `MONTHS_PROFILE` from `src/domain/eventStudy.ts` and uses the frozen normalized dataset. The dataset has 3,023 usable hourly observations, one missing hour, one duplicate/revision bucket, and no rejected observations.

Profile: hourly cadence; anticipation [−84,−12), reference [−12,0), immediate [0,6), stabilized [18,36), delayed [48,72); minimum coverage 60%, maximum gap share 50%, minimum three distinct updates, maximum median spread 20 pp, tie threshold 1 pp.

| Card | Reference | Stabilized | Scored change | Delayed cumulative | Quality |
|---|---:|---:|---:|---:|---|
| `trump-elected` | 25.00% | 13.25% | −11.75 pp | −12.50 pp | usable |
| `appeal-lost` | 21.50% | 33.25% | +11.75 pp | +14.00 pp | usable |
| `supreme-review` | 32.25% | 32.50% | +0.25 pp | +3.75 pp | usable |
| `trump-pause` | 34.50% | 30.50% | −4.00 pp | −3.50 pp | usable |
| `supreme-argument` | 56.75% | 69.25% | +12.50 pp | +11.25 pp | usable |

All 25 windows pass. Native one-point anchor tie groups, from biggest rise to biggest fall, are:

`supreme-argument = appeal-lost` > `supreme-review` > `trump-pause` > `trump-elected`

Do not force an order within the first tie. No pair of separately scored events has overlapping full [−84,+72) windows. These are measured associations around selected public cutoffs, not causal estimates. The broad pre-ending daily-median rise from 12.5% on November 8 to 73% on January 11 (+60.50 pp), and drawdown from 35% on October 1 to 12.5% on November 8 (−22.50 pp), establish dataset suitability but do not establish headline causation.

## Editorial and interpretation guardrails

- Keep expected directions in the candidate JSON as directional hypotheses: negative for `trump-elected`, positive for `appeal-lost`, negative for `supreme-review`, negative for `trump-pause`, and ambiguous for `supreme-argument`.
- Keep mechanisms directional and non-causal. The legal developments are partly scheduled and anticipated; the election is a rolling overnight process; the January hearing is a continuous information flow.
- Keep each event’s retrospective interpretation out of pre-reveal copy. Show measured response only after reveal.
- Preserve the distinction between an event’s historical date, the time information became publicly available, the measurement cutoff, and the time the page was retrieved.
- Do not turn the Supreme Court questions into a ruling or imply that the oral argument itself decided the case.

## Ending — reveal only

The ending is not a sixth card. On January 17, the Supreme Court upheld the law. TikTok went dark in the United States around January 19 and restored service that day. Polymarket’s retained page and Gamma metadata record two disputed YES proposals followed by a final YES and a provider close at `2025-01-22T00:31:19Z`. Because the contract required a qualifying ban to take effect, restoration did not change the final YES. Do not equate the contract with permanent disappearance or a permanent ban.

Ending evidence is retained in `docs/launch-queue-research/evidence/tiktok-opinion.pdf`, `tiktok-ending.html`, `tiktok-market.html`, and `tiktok-event.json`. It belongs in reveal-only copy.

## Remaining gates

1. Exact first-public posting times for the December 6 opinion, December 18 order, and December 27 amicus filing remain unverified. The packet records AP public-by timestamps and conservative broadcast-end cutoffs without upgrading them to exact first-public times.
2. The AP Race Call is now captured as a contemporary artifact at `2024-11-06T10:34:42Z`, but its publisher timestamp does not prove first distribution.
3. Date-only `occurredAt` values remain null for the election and legal developments. Final editorial normalization must choose whether to represent them as date-level facts or intervals; null is intentional, not permission to invent midnight instants.
4. Independent editorial review with a named, timestamped approval is required before registering a Study or adding the candidate to the daily queue. Approval remains `pending`.

No application code, study registry, queue entry, publication status, schedule, or deployment was changed by this worker.

See `candidate.json` for machine-readable handoff, `evidence-manifest.json` for source paths and hashes, `anchors-v3.json` for timing decisions, and `measurements.json` for the complete replay output.
