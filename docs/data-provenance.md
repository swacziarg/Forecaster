# EventLens portfolio data provenance and candidate audit

Retrieved September 4, 2026. Runtime studies use frozen local artifacts; provider APIs are ingestion sources only. SHA-256 digests are asserted in automated tests.

| Study | Exact contract | Provider / native side | Coverage | Raw / normalized SHA-256 | Audit result |
| --- | --- | --- | --- | --- | --- |
| Biden withdrawal | Joe Biden withdraws from the 2024 presidential race | Polymarket YES | Jun 23–Jul 21, 2024; 692 observations | `6396d9b434a2…` / `d04cd03d112e…` | Published launch study; one missing hour at resolution, outside all five selected windows. Partial lifetime. Retrieved Sep 5, 2026. |
| Election | Donald Trump wins the 2024 U.S. presidential election | Polymarket YES | May 29–Nov 5, 2024; 3,863 legacy observations | `7ad5dd028509…` / `d2cff3685d32…` | Published legacy fixture; one duplicate hour and two missing hours retained so calculations remain exact. Partial market lifetime. |
| Oscars | One Battle After Another wins Best Picture | Kalshi YES, `KXOSCARPIC-26-ONE` | Sep 22, 2025–Mar 16, 2026; 4,168 observations | `b1f4bf26a54a…` / `498a7ba35bb7…` | Settled YES; 21 no-candle hours, all selected event windows usable. |
| Fed | September 2024 upper-bound decrease of 50+ bp | Polymarket YES | Jul 25–Sep 18, 2024; 1,323 observations | `be919d763a54…` / `070e10e264ba…` | Settled YES; no normalized hourly gaps, all selected windows usable. |
| Eagles | Philadelphia Eagles win Super Bowl LIX | Polymarket YES | Jul 9, 2024–Feb 10, 2025; 5,167 observations | `73328913c0fe…` / `5bd4270b68f5…` | Settled YES; two missing hours. Five post-resolution values above 1.0 were rejected. Coverage therefore ends before settlement and is labeled partial-lifetime. |
| Bitcoin | Coinbase BTC-USD reaches $100,000 in 2024 | Polymarket YES | Mar 4–Dec 5, 2024; 6,609 observations | `856e5338c22d…` / `5d7aa54719ff…` | Settled YES; three missing hours, all selected windows usable. |

## Candidate checks

The exact requested contracts were available, so no category substitution was made. Polymarket’s official Gamma API supplied contract identity, rules, token IDs, volume, closure, and resolution state. Its official CLOB price-history endpoint supplied hourly history. Kalshi’s official historical market and candlestick endpoints supplied the Oscars rules, native YES side, settled result, trade closes, bid/ask closes, volume, and open interest.

Resolution rules were independently cross-checked against the Federal Reserve’s September 18 statement, the NFL’s Super Bowl record, the Academy’s Best Picture record, and the Coinbase BTC-USD source named in the market. No unresolved dispute or material definition ambiguity was found for a selected contract.

`scripts/import-polymarket-history.mjs` requests ten-day chunks, retains every raw response, rejects invalid probabilities, sorts by timestamp, collapses cadence revisions by keeping the latest observation, and never fills a missing hour. `scripts/import-kalshi-candles.mjs` retains Kalshi trade, quote midpoint, spread, volume, and open-interest fields when available. Each dataset manifest records the exact request, retrieval time, coverage, transform version, hashes, and gap/revision audit.

## Limitations

Polymarket’s price-history response exposes sampled price and time but not historical quote, spread, volume, or open-interest fields; those unavailable fields remain blank rather than being inferred. The Oscars candlestick endpoint supplies those fields. Descriptive event responses are not causal estimates, and overlapping windows, anticipation, market microstructure, and simultaneous news limit attribution.
