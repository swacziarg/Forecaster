# Biden withdrawal market snapshot

Market: Polymarket `252294`, “Biden drops out of presidential race?”

YES token: `80466862227762400456474037114326989569691448086113369690204721936360568404468`.

The official Gamma event response contains the selected market under `markets`; the direct market-slug query returned an empty array. `raw-market.json` retains that market object. The metadata request is recorded in `manifest.json`.

Three official CLOB requests retain June 23–July 21, 2024 hourly prices. `polymarket-hourly.csv` has 692 observations; July 21 at 18:00 UTC is absent. All selected event windows are complete. The result is YES, confirmed by the retained metadata and Biden’s July 21 letter. No settlement time is inferred from the market’s administrative close time.

Reproduce the price import from the project root:

```sh
node scripts/import-polymarket-history.mjs 80466862227762400456474037114326989569691448086113369690204721936360568404468 2024-06-23T00:00:00Z 2024-07-22T00:00:00Z public/data/biden-dropout-2024/polymarket-hourly.csv public/data/biden-dropout-2024/raw-prices-history.json public/data/biden-dropout-2024/manifest.json will-biden-drop-out-of-presidential-race
```

Reimporting replaces the import manifest; retain or regenerate its separately recorded `marketMetadataSha256` and `marketMetadataRequest`. Changes to a frozen artifact require an intentional study revision and matching digest/golden updates.

Source passages, timing decisions and the signed measurements are documented in `docs/editorial/biden-dropout-2024-review.md`. Full source snapshots are in the repository’s `docs/evidence` directory, outside the public site output.
