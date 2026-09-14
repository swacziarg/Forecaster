# Data provenance audit

I audited the four retained datasets other than the separately reviewed Trump packet: Fed, Thunder, Dodgers, and NYC. The full reconstruction is in `data/reconstruction.json`; the live provider check is in `data/provider-rechecks.json`.

For every CSV row I floored each retained raw Unix timestamp to the UTC hour and compared the CSV `q` and `raw_price` with the last raw point in that hour. The reconstruction found zero price mismatches in all four datasets. Every row is `mark_type=trade` and `stale=false`; there are no synthetic or interpolated rows.

Fed has 1,323 raw points and 1,323 CSV hours. Dodgers has 5,959 raw points collapsing to 5,957 hours; two pairs share an hour and have the same price. NYC has 4,713 raw points collapsing to 4,711 hours; two pairs share an hour. Thunder has 6,516 raw points collapsing to 6,515 hours: the duplicate-hour pair at `2024-10-02T14:00Z` has the same `0.12` price, while one raw hour (`2024-10-02T14:00Z`) is absent from the CSV. This is a one-hour coverage omission in the retained Thunder CSV, not a price mismatch; it should remain documented before scheduling.

The metadata confirms the exact contract and selected YES token for all four. Thunder’s nested market `507884` resolves “Will the Oklahoma City Thunder win the 2025 NBA Finals?” and contains the audited token. NYC’s chunk files do not carry a token ID, so its identity is established by `nyc-event.json` market `538932` and independently checked against that token’s public history response.

I re-fetched a 48–96-hour bounded window at the first retained request anchor for each token on 2026-09-10. Exact `(timestamp, price)` matches were Fed 47/47, Thunder 48/48, Dodgers 46/46, and NYC 48/48. The NYC retained-row count includes one point at the inclusive upper-bound edge; the provider response itself matched all returned points. These checks support the retained raw provenance but do not change the hour-floor convention used by the study scoring.

Trump was then checked with the same method. Its 4,550 raw points collapse to 4,549 CSV hours, with one duplicate pair at `2024-10-02T14:00Z` having the same `0.4935` price, zero missing hours, and zero price mismatches. A fresh 48-hour CLOB sample returned 47 points and matched all 47 retained points by original provider timestamp and price. The Trump metadata identifies market `253591`, the same selected YES token used by the study, and resolves the presidential-election contract.
