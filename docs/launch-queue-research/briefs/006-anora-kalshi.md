# Proposed #006: Anora: Hollywood’s false finish

**Readiness: blocked. Queueable now: no.** Conditional fifth research preference only. Do not integrate or queue. The full returned Kalshi series has 1,718 missing hourly buckets and a 38-hour maximum gap. For every hourly bucket alignment across the January 5 Los Angeles calendar day, the Golden Globes anticipation window has at most 25% coverage, below the required 60%. A more precise ceremony timestamp cannot repair that dataset.

## Edition and contract

**Exact question:** Will Anora win Best Picture at the Oscars?  
**Selected side / resolved outcome:** YES / YES.  
**Story dates:** 2024-10-24–2025-03-03; proposed developments 2025-01-05–2025-02-23.  
**Provider:** Kalshi; market ID `KXOSCARPIC-25-A`.  
**Exact contract identifier:** `KXOSCARPIC-25-A`.  
**Market:** [provider record/page](https://api.elections.kalshi.com/trade-api/v2/historical/markets/KXOSCARPIC-25-A); [resolution metadata](https://api.elections.kalshi.com/trade-api/v2/historical/markets/KXOSCARPIC-25-A).

YES if Anora won Best Picture at the 97th Academy Awards. The retained historical record says result=yes, status=finalized, expiration_value=Anora and settlement value $1. The secondary rule dates the expected ceremony March 2, 2025.

Opened: `2024-10-24T14:00:00Z`. Provider close: `2025-03-03T03:45:51.498881Z`. Settled: `2025-03-03T04:45:55.063082Z`.

## Why this is worth playing

The Oscars provide a familiar competition and a small-film-versus-prestige-rivals story. Anora itself is less universally recognized than the ceremony; the brief should introduce it as a Best Picture contender without requiring knowledge of guild voting.

A Golden Globes shutout, a huge rival nomination haul, a three-award comeback and two Conclave wins make a genuinely reversible awards narrative. One combined guild-weekend card avoids three versions of the same rebound.

The same Kalshi contract’s qualifying daily medians fall from 48% to 16%, then recover to 74.5%. That is promising broad volatility, but it cannot substitute for eligible five-card scoring. No publishable ranking is supplied.

## Verified prices and retrieval

The retained single-contract series contains **1,392 usable observations**, from `2024-10-24T15:00:00Z` through `2025-03-03T04:00:00Z`. Raw returned rows: 1,399; rejected rows: 7; duplicate/revision buckets: 0. Frequency: UTC hourly buckets. Missing hours inside that observed span: **1,718**; longest missing run: **38 hours**. Missing timestamps are enumerated in [the audit](../evidence/anora-kalshi-audit.json). This is verified retrieved coverage, not a claim of the complete lifetime or tick-by-tick trading.

Project Kalshi convention: actual candle trade close; otherwise closing quote midpoint only at <=20pp spread. No previous-close carry or missing-hour fill.

**Calculated pre-ending broad swings:** daily medians rose from 16% on 2025-01-30 to 74.5% on 2025-02-22 (+58.50 pp). Maximum chronological drawdown: 48% on 2024-11-10 to 16% on 2025-01-30 (−32.00 pp). These are computed from retained prediction odds, not press numbers or underlying asset prices. Require at least 12 actual hourly observations per daily median; exclude 2025-03-02 UTC and later. They demonstrate suitability, not headline causation or the scored ranking.

Integration material: [hourly CSV](../datasets/anora-kalshi-hourly.csv), [normalized source points](../evidence/anora-kalshi-normalized.json), [complete packet with hashes and all requests](006-anora-kalshi.json).

Concrete public GET retrieval:

- [Metadata](https://api.elections.kalshi.com/trade-api/v2/historical/markets/KXOSCARPIC-25-A).
- [First retained history request](https://api.elections.kalshi.com/trade-api/v2/historical/markets/KXOSCARPIC-25-A/candlesticks?start_ts=1729778400&end_ts=1740974400&period_interval=60); every subsequent interval and response hash is in the packet and [history request ledger](../history-requests.json).
- Polymarket requests use the exact YES token as `market`, Unix-second `startTs`/`endTs`, `fidelity=60`, and bounded intervals. Kalshi uses the exact ticker, Unix-second `start_ts`/`end_ts`, `period_interval=60`, and the historical endpoint. Retained responses prove this path returned data on the research date.

## Frozen five headlines and public evidence

Selection frozen at `2026-09-06T00:24:51.987941+00:00` in [selection v1](../frozen-selection-v1.json), before these fresh event-window calculations. [Anchor v2](../anchors-v2.json) was also recorded before scoring. Public cutoffs below are often later than first access; no timestamp was selected to maximize a move. For Anora, scenario anchors are explicitly not verified public times.

### 1. Anora leaves the Golden Globes empty-handed

**Historical date:** 2025-01-05. **Public measurement cutoff:** **not verified**; date-only evidence, no integration timestamp.

Eligibility scenario only: end of local ceremony date in America/Los_Angeles. Actual first-public completion unverified; official results page published Jan7.

**Sources:** [anora-globes.html](https://goldenglobes.com/articles/the-82nd-golden-globe-awards-winners/).

**Selection rationale, recorded before scoring:** The presumed contender misses all five prizes. Expected direction: negative.

**Measurement risks:** Five categories conclude at different points during a ceremony. The official winners article was published January 7, after the January 5 event. Do not backdate the current article or invent an exact finish time. Early price windows fail even under all plausible hourly alignments.

Coverage-only scenario anchor: `2025-01-06T08:00:00Z`. This is not eligible for publishing a headline score.

### 2. Anora earns six Oscar nominations; Emilia Pérez leads with 13

**Historical date:** 2025-01-23. **Public measurement cutoff:** **not verified**; date-only evidence, no integration timestamp.

Eligibility scenario only: end of local nomination date. Official Jan23 05:30 PST schedule is not proof of completion. Download blocked.

**Sources:** [Academy nominations announcement (download returned 403)](https://press.oscars.org/news/97th-oscarsr-nominations-announced); [anora-nominations-broadcaster.html](https://www.bellmedia.ca/the-lede/press/97th-oscars-nominations-announced/); [anora-nominations-abc.html](https://abc.com/news/2e100609-67b5-4a02-bcb3-f1b2ed134da0/category/3590739).

**Selection rationale, recorded before scoring:** Nomination strength against a formidable rival. Expected direction: ambiguous.

**Measurement risks:** The scheduled January 23 announcement start is not a verified time at which the whole nomination slate was known. The retained broadcaster announcement lists support six Anora nominations and thirteen for Emilia Pérez. ABC’s official page records publication January 23 at 13:50 UTC, found during final source verification after the day-end eligibility calculation; this is a usable publication upper bound, not verified broadcast completion. No rescoring was performed because the separate Globes data failure is conclusive.

Coverage-only scenario anchor: `2025-01-24T08:00:00Z`. This is not eligible for publishing a headline score.

### 3. Anora wins Critics Choice, Directors Guild and Producers Guild prizes in one weekend

**Historical date:** 2025-02-09. **Public measurement cutoff:** **not verified**; date-only evidence, no integration timestamp.

Eligibility scenario only: end of final cluster date. Actual weekend completion cutoff needs DGA/PGA/CCA archive; PGA publication Feb9 07:02:42Z, later modified.

**Sources:** [anora-pga.html](https://producersguild.org/2025-pga-awards-winners/); [anora-dga.html](https://www.dga.org/news/pressreleases/2025/250208_77thannualdgaawardswinners); [anora-critics-winners.html](https://www.criticschoice.com/30th-annual-critics-choice-awards-list-of-nominees-and-winners-2025/).

**Selection rationale, recorded before scoring:** One clustered comeback, not three cards measuring the same news. Expected direction: positive.

**Measurement risks:** Critics Choice on February 7 and PGA/DGA on February 8 overlap by design and must remain one cluster. A late combined cutoff already contains earlier prizes in its reference window. PGA article publication is February 9 07:02:42 UTC and later updated; DGA metadata appears to precede the ceremony and is unsuitable as a winners timestamp.

Coverage-only scenario anchor: `2025-02-10T08:00:00Z`. This is not eligible for publishing a headline score.

### 4. Conclave wins BAFTA’s Best Film prize; Anora wins actress and casting

**Historical date:** 2025-02-16. **Public measurement cutoff:** **not verified**; date-only evidence, no integration timestamp.

Eligibility scenario only: end of Feb16 London date; official results verified via web, download blocked.

**Sources:** [BAFTA official February 16 winners, verified through web retrieval; local download blocked](https://www.bafta.org/media-centre/press-releases/winners-announced-2025-ee-bafta-film-awards/).

**Selection rationale, recorded before scoring:** A rival’s breakthrough partly offset by Anora’s own wins. Expected direction: ambiguous.

**Measurement risks:** Conclave’s Best Film victory and Anora’s actress/casting wins are competing signals from one ceremony. Broadcast timing and advance winner reporting must be checked; do not attribute a net response to Best Film alone.

Coverage-only scenario anchor: `2025-02-17T00:00:00Z`. This is not eligible for publishing a headline score.

### 5. Conclave wins the Screen Actors Guild ensemble prize

**Historical date:** 2025-02-23. **Public measurement cutoff:** **not verified**; date-only evidence, no integration timestamp.

Eligibility scenario only: end of Feb23 Los Angeles date; official results day established, exact completion time missing.

**Sources:** [anora-sag.html](https://www.actorawards.org/media/news/releases/outstanding-film-and-television-performances-honored-31st-annual-screen-actors); [Academy official calendar, verified through web retrieval](https://www.oscars.org/news/academy-and-abc-announce-show-date-97th-oscarsr).

**Selection rationale, recorded before scoring:** Late rival signal after Academy voting has already closed. Expected direction: negative.

**Measurement risks:** The SAG ensemble prize was awarded after Academy final voting had closed, so it could reveal preferences without changing already-cast votes. This is still public information about the outcome, but causal persuasion claims would be especially misleading.

Coverage-only scenario anchor: `2025-02-24T08:00:00Z`. This is not eligible for publishing a headline score.

## Measured responses — post-reveal / editor only

Primary score is the median in [18,36) hours minus the median in [−12,0) hours. Anticipation [−84,−12), immediate [0,6), delayed [48,72) are also checked. Thresholds: ≥60% coverage, maximum gap share ≤50%, ≥3 distinct timestamp updates, median spread ≤20 pp where quotes exist. All five windows must pass. A timestamp update does not prove a fresh trade. Signed changes below are **percentage points**, not percent changes.

**No valid five-card score or ranking.** The day-end scenarios fail four of five event quality checks; the native helper can still return partial differences when some other windows fail, so those numbers must not be displayed as playable scores. [Coverage-envelope check](../anora-coverage-envelope.json) proves even a better January 5 time cannot get the Globes anticipation window above 25%, versus the required 60%.

| Proposed card | Anticipation | Reference | Immediate | Stabilized | Delayed | Eligibility |
|---|---:|---:|---:|---:|---:|---|
| globes-shutout | 17/72 | 9/12 | 0/6 | 6/18 | 12/24 | indeterminate (scenario) |
| oscar-nominations | 43/72 | 11/12 | 0/6 | 7/18 | 12/24 | indeterminate (scenario) |
| guild-weekend | 43/72 | 12/12 | 1/6 | 13/18 | 18/24 | indeterminate (scenario) |
| bafta-conclave | 56/72 | 10/12 | 6/6 | 15/18 | 19/24 | usable (scenario) |
| sag-conclave | 52/72 | 11/12 | 1/6 | 12/18 | 18/24 | indeterminate (scenario) |

No pair of separately scored events has overlapping full [−84,+72) windows in these frozen sets. That does not exclude unselected news, within-event anticipation, or the multiple developments deliberately combined in a cluster.

## Ending — reveal only

Anora won Best Picture at the March 2, 2025 Oscars. Kalshi records market close March 3 at 03:45:51.498881 UTC and settlement at 04:45:55.063082 UTC, with YES paying $1. The Oscar announcement is exclusively the ending, never a scored card.

**Ending sources:** [Academy official 2025 ceremony record](https://www.oscars.org/oscars/ceremonies/2025); provider metadata linked above.

## Integration handoff and remaining evidence

**Draft instruction:** January–February 2025. Rank five headlines from the biggest rise in Anora’s Best Picture chances to the biggest fall.

**Fixed initial card order:** guild-weekend, globes-shutout, sag-conclave, oscar-nominations, bafta-conclave. Use the project’s existing `pairwise-anchor-1pt-v1` scoring and YES perspective. No release date is assigned.

The [JSON handoff](006-anora-kalshi.json) carries stable event IDs, contract identity, exact retrieval requests, source hashes, mechanisms, confounds, normalized data and proposed presentation fields. It is deliberately not a drop-in approved Study: `occurredAt`, final source roles/publication records and independent approval need completion. Null means unresolved, not permission to invent a value.

- Obtain genuine historical trades/quotes for this exact Kalshi ticker sufficient to repair the early windows without carrying prices; none was obtained in this research.
- The alternate Polymarket Anora contract opened January 21, after the Globes and too close to nominations for the full anticipation window. It cannot backfill Kalshi or supply the frozen five.
- Capture first-public ceremony/nomination completion times and immutable primary winner/nominee lists. Current official result pages often supply only a day and may have been updated after publication.
- Verify a durable public Kalshi consumer-market URL if desired. The linked official historical API is the verified canonical market record; a guessed consumer route was not confirmed.

Source hashes establish exactly what was retrieved now; they do not certify what an editable page contained at its original publication time. Live-transcript timestamps describe the cited broadcast passage, not the web page’s upload time. Embedded first-person statements are primary evidence for the speaker’s words; surrounding news interpretation is corroboration. The final integrator must preserve that distinction and the schema’s pre-reveal source cutoff.

**Scope:** research files only. No application code, registry, publication status or deployment changed by this research.
