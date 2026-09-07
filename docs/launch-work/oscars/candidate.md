# 2026 Best Picture culture reserve

**Readiness: hold. Queueable now: no.** This is a reviewable reserve packet, not an approved Study, answer key, release number, or publication decision.

## Decision

Retain the existing five-event selection for this packet. The set supports a recognizable awards-season arc around **One Battle After Another**, a Best Picture contender:

1. an early critics-group declaration;
2. a clean televised Best Picture win;
3. a split Golden Globes result that helps the film but also elevates a rival;
4. a broad Academy nomination haul that exposes the strength of the whole field; and
5. a late Producers Guild top-prize signal.

Critics Choice and Golden Globes are adjacent precursor events and belong to the same broad information cluster, but they are not identical claims. Critics Choice is a single Best Picture win; the Globes card is explicitly a split result in which the film wins the musical/comedy picture prize while Hamnet wins the drama picture prize. They occur one week apart and carry different directional information. The frozen set therefore retains both, while disclosing the redundancy risk and the observed tie. No replacement was selected after seeing prices, and no replacement was scored.

The hold is caused by incomplete editorial evidence, not by the market series. The current five primary records have no independent contemporary corroboration packet, no reproducible coverage archive with unique-publisher counts, no immutable source captures, and no independent written rubric review or sign-off. Exact first-public result/completion times also remain to be independently confirmed. Those are publication gates under `docs/editorial/oscars-2026-review.md`.

## Contract and dataset

- **Question:** Will One Battle After Another win Best Picture at the Oscars?
- **Provider / contract:** Kalshi `KXOSCARPIC-26-ONE`, native and selected side YES; resolved YES.
- **Market:** opened `2025-09-22T14:00:00Z`, closed `2026-03-16T02:57:49Z`, settled `2026-03-16T03:58:01Z`.
- **Retained data:** 4,168 normalized hourly observations from `2025-09-22T15:00:00Z` through `2026-03-16T03:00:00Z`; 21 missing hourly buckets, longest missing run one hour, zero rejected probabilities, and zero duplicate cadence buckets.
- **Mark policy:** use the traded candle close; otherwise use a closing YES bid/ask midpoint only when the spread is at most 20 percentage points. There is no carry, interpolation, or cross-contract splice.
- **Hashes:** normalized CSV `498a7ba35bb74924845de951b1a281ecf70382f4aff74f62f0529537c072eb54`; raw candlesticks `b1f4bf26a54a512af052fd91af8272ef820881570b4a6d37db673cf5150f1131`; market metadata `151d9ff463871c5d7c0598a1b30e3d2457899cbf2040b85941afee36ca73292c`.

The runtime snapshot is the checked-in file [public/data/oscars-2026/kalshi-hourly.csv](../../../public/data/oscars-2026/kalshi-hourly.csv). The audit and manifest are preserved in `public/data/oscars-2026/` and `docs/launch-queue-research/evidence/oscars26-audit.json`.

## Frozen cards

The five IDs and their chronological initial order were frozen in `docs/launch-queue-research/frozen-selection-v1.json` before this fresh replay. The selection hash is `79ca8b2e025f15e5fe1ff9040ed1c060d874bf188d2b239f39fc647c0ad33593`. The final anchor file was frozen separately as `docs/launch-queue-research/anchors-v2.json`, hash `168609f145c5a992e911c5479b0f2c3fe9e331f72420fdb1f5dd5f86febaffa3`.

The card copy below introduces the film and states the factual development plainly. The Oscar result is not one of the five cards; it is the reveal-only ending.

| Initial order | Card | What a player is judging | Expected direction | Evidence state |
|---:|---|---|---|---|
| 1 | **NBR Best Film** — National Board of Review names the film its 2025 Best Film | Whether an early major critics prize establishes durable frontrunner status | Positive | Primary record retained; corroboration and immutable capture missing |
| 2 | **Critics Choice win** — the film wins Best Picture at the 31st Critics Choice Awards | Whether a clean televised precursor win broadens confidence before nominations | Positive | Primary record retained; corroboration and immutable capture missing |
| 3 | **Golden Globes split** — the film wins musical/comedy picture while Hamnet wins drama picture | Whether a split top-prize night helps the film or leaves the field divided | Ambiguous | Primary record retained; corroboration and immutable capture missing |
| 4 | **13 Oscar nominations** — the Academy names the film in 13 categories, including Best Picture | Whether breadth across branches outweighs the strength shown by rivals | Ambiguous | Primary record retained; corroboration and immutable capture missing |
| 5 | **Producers Guild win** — the film takes the guild’s top theatrical-picture prize | Whether an overlapping industry electorate supplies a late Best Picture signal | Positive | Primary record retained; corroboration and immutable capture missing |

### Editorial reading of the five cards

The first, second, and fifth cards are not interchangeable in timing or institutional signal: they mark an early critics-group selection, a televised critics win, and a late guild prize. The Golden Globes card must stay split in its wording; it is not a generic “another award win.” The nominations card is a field-strength announcement, not an award win, and its ambiguous direction is intentional. Even so, four of the five cards are award-season institutions, so an independent editor should decide whether the reserve is sufficiently varied for the intended audience after the missing corroboration and archive work is complete.

Each event has a pre-reveal factual claim and a mechanism in the existing Study definition. The response can have competing explanations: other awards-season results arrive nearby, the nomination announcement reveals all contenders at once, the guild electorate overlaps with but does not equal the Academy, and no observational comparison proves that a single event caused the market movement.

## Fresh measurements after the freeze

The replay was run on `2026-09-06` with the unchanged application functions `parseMarketCsv`, `normalizeObservationSeries`, `calculateStudyImpacts`, `MONTHS_PROFILE`, and `createTieGroups` from `src/domain/eventStudy.ts`. The exact invocation and complete window-level output are in [measurements.json](measurements.json). The measurement source hash is `9fdfcd16d70cdffd5d54469c215f68ecbf83070c6778754c07047b1eaa9a4cc6`.

Profile: `months-hourly-v1`; anticipation `[−84,−12)`, reference `[−12,0)`, immediate `[0,+6)`, stabilized `[+18,+36)`, delayed `[+48,+72)` hours. Quality requires at least 60% coverage, no gap over half the window, three distinct updates, and median spread no wider than 20 percentage points.

| Card | Reference → stabilized | Short-term response | Delayed cumulative response | All five windows |
|---|---:|---:|---:|---|
| NBR Best Film | 59.0% → 72.0% | **+13.0 pp** | +14.0 pp | Pass |
| Producers Guild win | 76.0% → 81.5% | **+5.5 pp** | +3.75 pp | Pass |
| Critics Choice win | 73.25% → 77.25% | **+4.0 pp** | +4.75 pp | Pass |
| Golden Globes split | 78.0% → 81.5% | **+3.5 pp** | +4.75 pp | Pass |
| 13 Oscar nominations | 76.0% → 71.0% | **−5.0 pp** | −6.0 pp | Pass |

All 25 event windows are usable: every required window has 100% retained-bucket coverage, zero maximum missing buckets within the window, at least three distinct updates, and a median spread of 1.0 or 1.5 percentage points. These are signed percentage-point responses, not causal effects and not an approval of the copy or selection.

The tie-aware signed ordering is:

`nbr-best-film` → `pga-top-prize` → (`critics-choice-best-picture` + `golden-globes-picture`) → `oscar-nominations`

The Critics Choice / Golden Globes pair is the only tie under the one-percentage-point anchor rule. It is excluded from pairwise comparison, leaving **9 meaningful comparable pairs**. The measurements are suitable for editorial review; they do not remove the editorial hold.

## Evidence and approval checklist

The source records currently used by the Study are the five first-party URLs listed in [evidence-manifest.json](evidence-manifest.json). The review found the following bounded state:

- primary source records exist for all five factual claims;
- source publication/retrieval metadata is recorded in `src/data/oscars2026.ts`;
- no independent contemporary corroborating source is attached for any of the five events;
- the canonical URLs are not immutable snapshots, and no source-content hash is recorded for the five editorial pages;
- a reproducible licensed/public coverage archive and unique-publisher counts have not been supplied;
- exact first-public result/completion times have not been independently confirmed for all five events;
- no written score for every editorial rubric dimension is recorded;
- no independent reviewer identity or timestamped inclusion sign-off exists; approval remains `pending`.

Until those gates are completed, do not change the runtime study status, daily registry, publication schedule, or any shared launch document.

## Anora remains blocked

Do not substitute Anora for this reserve. The exact Anora Kalshi contract is `KXOSCARPIC-25-A`, not the 2026 contract above. Its retained series has 1,392 usable observations, 1,718 missing hourly buckets, and a 38-hour maximum missing run. The coverage envelope in `docs/launch-queue-research/anora-coverage-envelope.json` (SHA-256 `7dcae8510195119ad835cff68285c53ecf71812959d88d3fed0494eb79088836`) checks every hourly alignment across the January 5 Los Angeles date and finds at most **25%** Golden Globes anticipation coverage, below the required **60%**. More precise ceremony timing cannot repair the missing data.

The alternate Polymarket Anora contract opens January 21, after the Golden Globes, so it cannot backfill the exact Kalshi contract or the frozen five-card set. Do not redownload the failed dataset, carry prices, splice providers, or invent timestamps/approval. Anora remains a precise data hold.

## Reveal-only ending

The Oscar Best Picture result stays outside the scored set. The retained Kalshi metadata records the selected YES contract resolving YES and settling at `2026-03-16T03:58:01Z`; the result should be shown only after the player locks the ranking. No Oscar result or retrospective outcome claim is included in the pre-reveal card copy.

## Handoff

This packet is complete as a bounded culture reserve/hold. The launch lead should independently review the five-event story and the evidence checklist, obtain the missing immutable corroboration/coverage artifacts, and decide whether the adjacent precursor cards remain editorially acceptable. If selection changes, freeze a versioned five-event set with rationale before any new calculation; do not search the chart for a preferred replacement.
