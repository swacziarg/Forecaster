# Bitcoin five-card playable draft handoff

Prepared: 2026-09-07

Task ID: `01a07777-0cfb-70b0-93f4-20087e2521d6`

## Result

Implemented a distinct local version-2 Bitcoin draft without changing the existing eight-event v1 or any shared registry/runtime files.

- Exported symbol: `bitcoinFiveCardStudy`
- ID/version/slug: `bitcoin-100k-2024-v2` / `2` / `bitcoin-100k-2024-five-card`
- Status: `editorial-review`
- Five eligible pre-reveal cards; strict `validateStudy` passes.
- Existing immutable dataset bytes are reused exactly; no new public bundle was needed.
- The new dataset metadata truthfully sets `fullMarketLifetime: false` because retained coverage ends at `2024-12-05T04:00:00Z`, before the provider market close at `2024-12-05T04:46:26Z`.

## Owned deliverables

- `src/data/bitcoinFiveCard2024.ts`
- `src/data/bitcoinFiveCard2024.test.ts`
- `docs/launch-work/playable-drafts/bitcoin/evidence.json`
- `docs/launch-work/playable-drafts/bitcoin/measurements.json`
- `docs/launch-work/playable-drafts/bitcoin/report.md`
- `docs/launch-work/playable-drafts/status/bitcoin.json`

The immutable dataset is reused from `public/data/bitcoin-2024/`; `public/data/bitcoin-100k-2024-v2/` was not created because the bytes are unchanged and the v2 module records the corrected coverage metadata.

## Timing correction log

The v2 study does not grandfather the old minute/hour anchors for date-only evidence.

| Card | v2 public-by cutoff | Basis |
| --- | --- | --- |
| Hong Kong ETFs | `2024-05-01T00:00:00Z` | HKEX’s official page says the listing occurred April 30 but exposes no clock; the source is declared day precision. |
| Mt. Gox repayments | `2024-07-06T00:00:00Z` | The trustee PDF is dated July 5 and exposes no clock; the source is declared day precision. |
| Fed 50 bp cut | `2024-09-18T18:00:00Z` | Federal Reserve statement says release at 2:00 p.m. EDT. |
| Trump election call | `2024-11-06T10:34:00Z` | AP gives 5:34 a.m. ET for the call. |
| MicroStrategy purchase | `2024-11-12T08:01:01Z` | SEC filing detail exposes the exact acceptance time; Exhibit 99.1 corroborates the November 11 announcement and purchase fact. |

The primary passages and hashes are in `evidence.json`, with source captures retained under `docs/launch-work/funnel-expansion/bitcoin/captures/`. The SEC filing detail is [here](https://www.sec.gov/Archives/edgar/data/1050446/000119312524255184/0001193125-24-255184-index.htm), and the corroborating exhibit is [here](https://www.sec.gov/Archives/edgar/data/1050446/000119312524255184/d908568dex991.htm).

## Measurement packet

The test and measurement packet replay the actual domain functions over the retained YES series: parse CSV, normalize perspective, normalize to hourly cadence, calculate impacts, create anchor-window ties, and calculate pairwise agreement.

- 6,609 normalized observations.
- 25 required windows; 25 usable.
- Three retained missing buckets remain documented in the measurement packet.
- Corrected short-term responses: Hong Kong −1.25 pp; Mt. Gox +2.25 pp; Fed +2.75 pp; Trump −3.50 pp; MicroStrategy −3.25 pp.
- Tie groups: Fed + Mt. Gox; Hong Kong alone; MicroStrategy + Trump.
- Pairwise agreement for the frozen chronological initial order: 6 agreed / 8 comparable pairs / 75%.
- Actual overlap is preserved only between Trump and MicroStrategy. The values are descriptive, not causal, and neither overlapping response is isolated.

The ending is reveal-only: the retained Polymarket metadata and Coinbase threshold resolution are not part of the five scored cards. No threshold-crossing card or answer-bearing text appears in pre-reveal copy.

## Proposed initial order

The frozen chronological order is preserved:

`hong-kong-etfs`, `mtgox-repayments`, `fed-50-cut`, `trump-election`, `microstrategy-purchase`.

## Test result

Passed:

`node --experimental-strip-types src/data/bitcoinFiveCard2024.test.ts`

The focused test verifies strict study validation, five eligible pre-reveal cards, all dataset digests and manifest digests, 6,609 observations, 25/25 usable windows, corrected ties, actual overlap, reveal-only resolution, and a deliberately breached date-only source cutoff.

## Hashes

| Artifact | SHA-256 |
| --- | --- |
| `src/data/bitcoinFiveCard2024.ts` | `b92c3ed93f343317201a789d53003e294ff029d2507194c46c183c76946144f8` |
| `src/data/bitcoinFiveCard2024.test.ts` | `216e78c925374f596b5c3641c80964c619e1aadc7d3696001f5c2423d138caf6` |
| `docs/launch-work/playable-drafts/bitcoin/evidence.json` | `30206936cb631a4395445717ea39fe5006be81ca08615ddfe47455163653fa97` |
| `docs/launch-work/playable-drafts/bitcoin/measurements.json` | `7f8edec1e34c3a9477a1be1369272a185db363a859c852e98f51e992b4f60e2f` |
| `public/data/bitcoin-2024/polymarket-hourly.csv` | `5d7aa54719ff32af2892aaba94fa6b33adc714bf558d82691a480c75bfbbab69` |
| `public/data/bitcoin-2024/raw-prices-history.json` | `856e5338c22d56b08c21e7cbdb4da8f00e97cba4055a58be7e6572a4bd13b533` |
| `public/data/bitcoin-2024/raw-market.json` | `f248b962c27c8fda3a51a16710aa2580eca15c3d95a97aa04dda9063699d40f7` |
| `public/data/bitcoin-2024/manifest.json` | `5a829238df3f561d902aa1c00a29068b75be33dfabeb8409bd7cdfac2541c554` |

## Lead integration decisions

The lead must register this module and test in shared files, independently review the five timing choices and neutral copy, preserve the existing v1 registration/archive, and keep the v2 study unpublished until exact human approval. No release date is assigned by this worker; the user’s September 7 Biden date does not authorize or schedule Bitcoin.
