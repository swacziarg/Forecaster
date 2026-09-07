# Bitcoin $100K — five-card mainstream candidate

Status: `ready-for-review` for independent editorial review; `queueableNow: false`; human approval: `pending`.

This is a five-card candidate built from the existing Bitcoin-$100K study and its exact Polymarket YES contract. It is not a new registered Study, a daily queue entry, or an approval. The proposed queue identity remains for the lead to assign only after the final funnel review.

## Selection freeze

The selection was frozen at `2026-09-06T20:21:50Z` in [`selection-freeze.json`](selection-freeze.json), before the fresh event-response calculation. The initial order is chronological:

1. `hong-kong-etfs`
2. `mtgox-repayments`
3. `fed-50-cut`
4. `trump-election`
5. `microstrategy-purchase`

The basis was accessibility, primary-source support, varied mechanisms, and spacing across the year. It deliberately avoids the threshold crossing as a scored card, the specialist-heavy Ether and IBIT pair, and the narrower Gensler transition. The full eight-event draft remains unchanged. Prior exposure is disclosed: the existing study, broad pre-ending screen, retained probability series, and earlier measurements were visible before the freeze, so this is not blinded.

## Contract, data, and scoring

The exact contract is Polymarket market `255229`, YES token `64903093311385616430821497488306433314807585397286521531639186532059591846310`, “Will Bitcoin hit $100k in 2024?” The candidate uses `public/data/bitcoin-2024/polymarket-hourly.csv`, 6,609 hourly observations after the existing normalization, and the exact `months-hourly-v1` profile. The three retained missing buckets are `2024-05-01T19:00:00Z`, `2024-07-21T18:00:00Z`, and `2024-11-05T22:00:00Z`; no gap was filled.

Scoring remains `pairwise-anchor-1pt-v1` with a `0.01` tie threshold and `anchor-window` grouping. No Bitcoin spot prices were used as probabilities, no interpolation/carrying/splicing was used, and the threshold crossing is reserved for the ending.

## Source and temporal evidence

All six compact captures are in [`captures/`](captures/) and are hashed in [`evidence-manifest.json`](evidence-manifest.json). The first five are primary records; the SEC Exhibit 99.1 is a corroborating record for the MicroStrategy fact.

| Event | Primary evidence | Public-time treatment |
| --- | --- | --- |
| Hong Kong spot ETFs | [HKEX release](https://www.hkex.com.hk/News/News-Release/2024/240430news?sc_lang=en), lines 618–630 | Page proves Apr 30 listing/day, not an intraday clock. Existing `01:30Z` minute anchor remains provisional. |
| Mt. Gox repayments | [Mt. Gox notice](https://www.mtgox.com/img/pdf/20240705_01_announcement_en.pdf), page 1 | Notice proves July 5 repayments, not an intraday clock. Existing `01:00Z` hour anchor remains provisional. |
| Fed 50 bp cut | [Federal Reserve statement](https://www.federalreserve.gov/newsevents/pressreleases/monetary20240918a.htm), lines 8–15 | Exact: the statement says release at 2:00 p.m. EDT = `18:00Z`. |
| Trump election | [AP election-call chronology](https://www.ap.org/the-definitive-source/behind-the-news/calling-the-2024-presidential-race-state-by-state/), lines 79–92, 175–195 | Exact: AP gives 5:34 a.m. ET = `10:34Z`. |
| MicroStrategy purchase | [SEC Form 8-K](https://www.sec.gov/Archives/edgar/data/1050446/000119312524255184/d908568d8k.htm), lines 28, 86–90; [Exhibit 99.1](https://www.sec.gov/Archives/edgar/data/1050446/000119312524255184/d908568dex991.htm), lines 4–12 | Both prove Nov 11 and the 27,200-BTC announcement. Neither exposes a publication clock; existing `13:00Z` minute anchor remains provisional. |

The restricted shell could not resolve external DNS for direct downloads, so no failed download is presented as evidence. The source records preserve the web-retrieved passage, retrieval time `2026-09-06T20:21:50Z`, page location, and SHA-256 hash. Independent review must confirm whether the inherited intraday anchors are supported by contemporaneous publisher or exchange records; unknown time is not silently filled.

## Card rationale and mechanisms

The cards are intentionally mixed: regulated access, forced supply, macro easing, political-policy repricing, and corporate treasury demand. The player-facing copy in `candidate.json` is neutral and factual. Mechanisms below are review/reveal fields only:

- Hong Kong ETFs: a new regulated access channel could broaden institutional demand; competing explanation is broader risk-asset and post-halving positioning.
- Mt. Gox repayments: creditor distribution could create near-term supply pressure; German government sales and wider risk-off conditions overlap.
- Fed 50 bp cut: easier financial conditions can support scarce risk assets, while the large cut can also signal economic weakness and was partly anticipated.
- Trump election: a new administration could shift enforcement and crypto policy; the result coincides with a broad post-election risk rally and dollar/rate repricing.
- MicroStrategy purchase: a large disclosed treasury purchase can validate corporate adoption; the purchases occurred over Oct 31–Nov 10 and the announcement overlaps the post-election rally.

## Measurement result

The exact invocation and complete window values/quality fields are in [`measurements.json`](measurements.json). It produced 25/25 usable windows and 9 comparable pairs:

| Event | Reference → stabilized | Short-term response | Classification | Quality |
| --- | ---: | ---: | --- | --- |
| Hong Kong ETFs | 41.75% → 30.00% | −11.75 pp | unusually large | 5/5 windows usable |
| Mt. Gox repayments | 28.00% → 25.00% | −3.00 pp | ordinary | 5/5 usable |
| Fed 50 bp cut | 12.50% → 15.25% | +2.75 pp | ordinary | 5/5 usable |
| Trump election | 23.00% → 19.50% | −3.50 pp | ordinary | 5/5 usable; anticipation 71/72 |
| MicroStrategy purchase | 33.50% → 59.50% | +26.00 pp | unusually large | 5/5 usable |

Anchor-window groups descending are `[microstrategy-purchase]`, `[fed-50-cut]`, `[mtgox-repayments, trump-election]`, `[hong-kong-etfs]`. The Mt. Gox/election pair ties under the unchanged 1-point rule; the comparison set is still meaningful at 9 non-tied pairs. The election and MicroStrategy windows overlap. Their responses cannot be narrated as isolated causal effects; the candidate explicitly treats this as overlapping post-election/corporate information.

## Neutral player copy

The pre-reveal card headlines and briefs are stored separately in `candidate.json`. They say only what the source-backed event is, without direction, measured values, resolution, or retrospective interpretation. No threshold crossing, outcome, answer-bearing metadata, or market endpoint belongs in the pre-reveal view.

## Reveal-only ending

After submission, the ending may disclose that the Polymarket contract settled YES under its Coinbase BTC-USD rule, using the retained market metadata and `https://www.coinbase.com/advanced-trade/spot/BTC-USD` as resolution context. The BTC spot threshold crossing is not one of the five events and must not appear before reveal.

## Exact integration changes for the lead

No runtime or shared files were edited. If this candidate survives independent review and human approval, the lead should:

1. retain the existing `bitcoin-100k-2024-v1` study and dataset bytes unless a substantive evidence correction requires a new immutable version;
2. reconcile the current `fullMarketLifetime` metadata discrepancy: `src/data/bitcoin2024.ts` says `true`, while the retained audit says `false` because coverage ends 46 minutes before `closedAt`. Resolve this before integration without silently mutating the existing study;
3. register a new daily identity with five event IDs in the frozen initial order and the unchanged scoring rule, assigning a date only after the final Sep 7 onward funnel is reviewed;
4. preserve neutral pre-reveal fields and put the contract-resolution conclusion behind reveal;
5. require independent editorial review and a named, timestamped human approval covering the exact content hash, study version, and release date before queueing.

## Remaining decisions

- Independent reviewer confirms the day-level HKEX, Mt. Gox, and MicroStrategy anchors or replaces them with evidence-backed timestamps, then reruns calculations from a new freeze if an anchor changes.
- Lead resolves the `fullMarketLifetime` metadata inconsistency without changing published history.
- Human editor decides whether the five-card narrative is sufficiently mainstream and approves the exact version; current approval fields are intentionally empty.
- Lead decides whether Bitcoin fills a Sep 10–12 slot or remains the buffer after comparing the completed Oscars/Trump/Canada packets. No date is assigned here.
