# 2026 Best Picture market snapshot

`kalshi-hourly.csv` is a normalized, full-lifetime hourly snapshot of Kalshi market `KXOSCARPIC-26-ONE`, “Will One Battle After Another win Best Picture at the Oscars?” The archived market opened September 22, 2025, closed March 16, 2026, and resolved YES.

The source response is retained in `raw-candlesticks.json`; the request and both raw and normalized SHA-256 digests are recorded in `manifest.json`. The deterministic transform lives at `scripts/import-kalshi-candles.mjs`.

Mark policy:

1. Use the hourly candle’s traded close when present.
2. Otherwise use the closing YES bid/ask midpoint only when both sides are present and the spread is at most 20 percentage points.
3. Omit the bucket if neither mark is valid.
4. Preserve bid, ask, volume, open interest and mark type in the normalized CSV.

The checked-in snapshot—not the live API—is the runtime source of truth.
