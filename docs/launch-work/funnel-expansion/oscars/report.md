# Oscars 2026 funnel-expansion evidence report

Status: complete for independent review; publication and final editorial approval remain pending.

## Decision and exact integration changes

The five-card arc is acceptable on evidence and narrative grounds. The selected IDs are unchanged and were frozen in `selection-freeze-v2.json` before the v2 replay:

1. `nbr-best-film`
2. `critics-choice-best-picture`
3. `golden-globes-picture`
4. `oscar-nominations`
5. `pga-top-prize`

The remediation is packet-only. It does not edit `src/`, `public/`, the shared runtime Study, the prior v1 selection, or any other worker’s files. The exact integration changes for a future approved runtime update are: consume `candidate.json` as Study version 2, consume `anchors-v3.json` for the corrected `informationKnownAt` values, retain the existing dataset hashes and `months-hourly-v1` scoring profile, and keep `ending.json` outside all pre-reveal claims. No Anora data or score substitution was made.

The candidate adds a primary organizer source and one independent contemporary corroborator to every card, stores SHA-256 hashes for every captured response, and records the coverage archive and unique-publisher count in `evidence-manifest.json`. The original v1 packet remains preserved and is explicitly superseded only by this review packet.

## Source availability and immutable captures

The packet contains nine raw HTML response bodies plus the Academy’s official static nominations PDF. Every retained capture is listed with URL, source ID, capture type, and SHA-256 in `evidence-manifest.json`.

The source-backed timing corrections are:

| Card | Conservative information cutoff | Evidence basis |
| --- | --- | --- |
| NBR | 2025-12-03 19:25Z | NBR HTML JSON-LD exposes `datePublished` 19:24:07Z; rounded up one minute. |
| Critics Choice | 2026-01-05 04:30Z | Official page is dated January 4; day-only publication bound is before the retained cutoff. |
| Golden Globes | 2026-01-12 07:05Z | Official HTML exposes `datePublished` 07:04:16Z; rounded up one minute. |
| Oscar nominations | 2026-01-22 13:42Z | Academy release says groups began at 5:30 a.m. PT and remaining categories at 5:41 a.m. PT; the old 13:30Z cutoff was incomplete. |
| PGA | 2026-03-01 08:03Z | PGA HTML exposes `datePublished` 08:02:52Z; rounded up one minute. |

Independent corroboration is contemporary and publisher-distinct for all five cards: Rotten Tomatoes Editorial for NBR, The Week for Critics Choice, AP for Golden Globes, AP for nominations, and AP for PGA. Each card has two unique publishers counting the organizer and the corroborator. Later corroborating reports are not used to backdate any pre-reveal claim; each event claim relies on its captured primary source only.

The Academy press HTML itself returned 403 to the capture client. The official static PDF is retained and hashed, and the official press-page timing extract is recorded here. The official 2026 ceremony-results page was separately checked for the retrospective ending in `ending.json`; it is not part of the pre-reveal evidence set.

## Written rubric / coverage review

This is a worker-prepared review, not independent human approval.

| Dimension | Result | Review note |
| --- | --- | --- |
| Recognizability | Pass | Every card is a named awards result or official Academy milestone with an unambiguous film/contract relationship. |
| Temporal integrity | Pass with disclosed bounds | All pre-reveal claims pass strict Study validation against the conservative cutoffs; four page timestamps are minute/day bounds rather than proof of the first public second. |
| Source quality | Pass for review | Each card has a governing organizer primary source, a contemporaneous independent source, and a hashable local capture. |
| Independence | Pass with caution | Critics Choice and Golden Globes remain separate because their electorates, category structures, and dates differ; their near-term price windows are disclosed as adjacent, not independent causal trials. |
| Direction clarity | Pass | NBR, Critics Choice, and PGA are positive; Golden Globes and nominations are explicitly ambiguous because each reveals competing support or coalition breadth. |
| Measurement quality | Pass | All 25 windows are usable: 100% bucket coverage, zero maximum gaps, at least 12 distinct hourly updates in every 12-hour reference window, and median spreads of 1.0 or 1.5 percentage points. |
| Narrative variety | Pass | The sequence covers critics, a televised split precursor, direct Academy information, and an industry guild result without duplicating a single award body. |
| Outcome firewall | Pass | The separate ending is not referenced by the candidate’s pre-reveal claims or calculations. |

## Window quality and measured responses

The replay uses unchanged normalized market data (`498a7a...072eb54`, 4,168 hourly observations), unchanged `months-hourly-v1` windows, and the corrected v3 cutoffs. All 25 windows are usable. The detailed window records are in `measurements.json`.

| Card | Reference → stabilized | Immediate | Delayed increment | Cumulative delayed | Quality |
| --- | ---: | ---: | ---: | ---: | --- |
| NBR Best Film | 59.0% → 72.0% | +12.0 pp | +1.0 pp | +14.0 pp | usable |
| Critics Choice win | 73.25% → 77.25% | +4.75 pp | +0.75 pp | +4.75 pp | usable |
| Golden Globes split | 78.0% → 81.0% | +5.0 pp | +1.0 pp | +4.0 pp | usable |
| 13 Oscar nominations | 76.0% → 71.0% | −4.0 pp | −1.0 pp | −6.0 pp | usable |
| Producers Guild win | 76.0% → 81.0% | +12.0 pp | −2.5 pp | +2.5 pp | usable |

The ranking by signed stabilized response is NBR (+13.0 pp), PGA (+5.0 pp), Critics Choice (+4.0 pp), Golden Globes (+3.0 pp), and nominations (−5.0 pp). The earlier packet’s conclusion that the nominations card is negative is unchanged; the corrected timestamp does not alter its measured levels.

## Ties, comparable pairs, and precursor independence

With the unchanged 1.0 percentage-point tie threshold, the runtime comparator emits five singleton groups in v2: NBR, PGA, Critics Choice, Golden Globes, nominations. There are 10 comparable pairs; the frozen chronological card order agrees with 7 of them (70%). Critics Choice (+4.0 pp) and Golden Globes (+3.0 pp) sit exactly at the 1.0-point boundary. The current comparator’s floating-point value is fractionally above the threshold, so it emits separate groups; an independent reviewer must decide whether the product should round before tie comparison or retain the current strict behavior. No silent scoring change was made.

The two televised precursors are retained as distinct cards because they differ in electorate, category structure, and public signal. The packet labels the relationship as corroborative/adjacent rather than independent causal attribution and keeps both overlap fields empty under the existing 84-hour-to-72-hour profile span. A reviewer may collapse them for a shorter funnel, but that would be a new selection decision and is not applied here.

## Neutral card copy

- **NBR Best Film:** “On Dec. 3, the National Board of Review named *One Battle After Another* its Best Film of 2025. The market’s stabilized level was 72%, versus 59% in the reference window.”
- **Critics Choice win:** “On Jan. 4, the Critics Choice Association named *One Battle After Another* Best Picture. The market’s stabilized level was 77.25%, versus 73.25% in the reference window.”
- **Golden Globes split:** “At the Jan. 11 Golden Globes, *One Battle After Another* won the musical/comedy picture prize while *Hamnet* won the drama picture prize. The market’s stabilized level was 81%, versus 78% in the reference window.”
- **13 Oscar nominations:** “The Academy’s Jan. 22 release named 13 nominations for *One Battle After Another*, including Best Picture; the complete list followed the 5:41 a.m. PT group. The market’s stabilized level was 71%, versus 76% in the reference window.”
- **Producers Guild win:** “On Mar. 1, the Producers Guild listed *One Battle After Another* as winner of its Darryl F. Zanuck Award for Outstanding Producer of Theatrical Motion Pictures. The market’s stabilized level was 81%, versus 76% in the reference window.”

## Separate sourced ending

`ending.json` records the retrospective resolution separately: the Academy’s official 2026 ceremony page lists *One Battle after Another* as the Best Picture winner, and the Kalshi historical-market endpoint resolves `KXOSCARPIC-26-ONE` YES. Neither source is used in the five event claims or any measurement window.

## Reproducibility and remaining decisions

Checks run for this packet:

- JSON parse of `candidate.json`, `selection-freeze-v2.json`, `anchors-v3.json`, `evidence-manifest.json`, `measurements.json`, and `ending.json`.
- `validateStudy(candidate)` returned zero errors.
- Replayed `parseMarketCsv` → `normalizeObservationSeries` → `calculateStudyImpacts` on `public/data/oscars-2026/kalshi-hourly.csv`; output matches `measurements.json` event IDs, window levels, quality, responses, tie groups, and 7/10 pairwise agreement.
- Recomputed SHA-256 for all captured source files; values match `evidence-manifest.json` and the source records in `candidate.json`.
- Existing project tests remain the check on the unchanged runtime; this packet does not mutate runtime files.

Remaining gates for an independent human reviewer:

1. Confirm whether the exact first-public timestamp for NBR, Critics Choice, Golden Globes, PGA, and the full Academy nomination slate can be established from an archived broadcast/social record rather than the conservative source-availability bounds.
2. Decide whether the 1.0-point Critics Choice/Golden Globes boundary should be rounded into a tie or retained as two singleton groups under the existing comparator.
3. Decide whether the adjacent televised precursors are narratively distinct enough for the final funnel.
4. Record the independent reviewer identity, timestamp, and approval decision before changing the runtime Study from editorial review.

