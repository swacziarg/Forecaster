# NexusPoint

NexusPoint is a quick daily prediction-market puzzle. A player ranks five sourced historical headlines from the biggest rise in a selected contract's odds to the biggest fall, reveals a tie-aware score, and can share a spoiler-free result. The detailed market study remains available as optional post-game exploration.

Six local, reproducible studies are registered:

- `/` — the five-card NexusPoint daily game, launching with “24 days that ended Biden’s campaign.”
- `/studies/biden-dropout-24-days` — Biden’s 2024 withdrawal, five events, published.
- `/studies/election-2024-v1` — the full 2024 U.S. election study, published.
- `/studies/oscars-best-picture-2026` — 2026 Best Picture, five events, editorial review.
- `/studies/fed-september-2024` — September 2024 Fed decision, five events, editorial review.
- `/studies/eagles-super-bowl-lix` — Philadelphia Eagles win Super Bowl LIX, eight events, editorial review.
- `/studies/bitcoin-100k-2024` — Bitcoin reaches $100,000 in 2024, eight events, editorial review.
- `/studies` — portfolio index with contract, coverage, event count, category, and status.

No live market API or credentials are required at runtime.

## Hosting

Cloudflare deployment settings live in `wrangler.jsonc`. The connected GitHub integration publishes `swacziarg/Forecaster` from `main`, using `npm run build:cloudflare` to test and build before `npm run deploy`. Other branches upload preview versions. See [Cloudflare hosting](docs/cloudflare-hosting.md) for connection settings and deployment verification.

## Run and verify

```bash
npm install
npm test
npx tsc -b --pretty false
npm run build
git diff --check
npm run dev
```

## Product flow

1. Read five neutral, factual headlines and their sources.
2. Rank them with the grip or, on mobile, tap a rank number to choose any position. Swipe the card body to scroll. Mouse users can also drag anywhere on the card or use its keyboard-operable arrow buttons. Links, detail disclosures, and buttons remain independently clickable.
3. Reveal once. A validated, versioned attempt record is saved by puzzle ID on the device when browser storage is available.
4. See a prominent score out of 100, the two orders, a before/after probability chart, one takeaway, and tie treatment. Market movement is labeled in full as percentage points and kept distinct from the game score.
5. Share through the device share sheet or copy a spoiler-free text result linked to that exact puzzle. Tiles represent completed 20-point score bands; the exact score is separate.
6. Open “Why this order?” or the full archive study for the deeper evidence and methodology.

## Daily publication and local results

Daily puzzles live in a validated registry with stable IDs and numbers, UTC release timestamps, an exact published study version, five unique event IDs, a fixed initial order, and an explicit scoring version. A puzzle is the current daily for 24 hours or until the next scheduled release, whichever comes first. Exact `?daily=<id>` links reopen a released puzzle; unknown IDs and future releases do not fall through to another puzzle. If the queue has a gap or is exhausted, the interface says so and never invents a countdown.

Puzzle #001 is the September 5, 2026 Biden dropout edition (`?daily=2026-09-05-biden-dropout`). Its fresh ID isolates attempts from the retired September 4 election demo. Only #001 is currently published. No future puzzle is scheduled because the other studies remain in editorial review. Its cards are rendered solely from pre-reveal claims whose evidence timestamps pass the study cutoff. New entries must pass the same evidence and publication-status checks before they can be added to the daily registry.

Each puzzle has one authoritative local submission. Draft saves re-check for an existing completion, storage events reconcile ordinary multi-tab use, and malformed or obsolete records are ignored safely. Stats are derived from valid on-time submissions rather than a separate stats write. An unfinished current puzzle keeps the preceding streak eligible; missing a scheduled puzzle breaks it. Archive completions never change official totals or streaks. The UI explicitly warns when persistence is unavailable.

## Measurement

Each study declares one versioned measurement profile. The months/hourly default uses anticipation −84h to −12h, reference −12h to the event, immediate 0–6h, stabilized 18–36h, and delayed 48–72h.

The primary comparison is signed percentage-point `stabilized − reference`. Delayed movement is reported both incrementally (`delayed − stabilized`) and cumulatively (`delayed − reference`). The engine also calculates log-odds movement, overlap intervals and per-window coverage, mark mix, maximum gap, spread, volume and fresh-update counts.

These are descriptive market responses, not causal estimates. Event impacts are neither independent nor additive.

## Data and reproducibility

- Portfolio provenance and candidate audit: `docs/data-provenance.md`
- Dataset manifests and retained raw responses: `public/data/*/manifest.json` and `public/data/*/raw-*.json`
- Deterministic importers: `scripts/import-polymarket-history.mjs` and `scripts/import-kalshi-candles.mjs`

Published studies load versioned local snapshots. Live provider endpoints are ingestion sources only.

## Architecture

- `src/domain/study.ts` defines versioned study, market, contract, dataset, source, claim, event, presentation and validation schemas.
- `src/domain/eventStudy.ts` contains provider-neutral parsing, audits, quality-aware window calculations, overlap detection, tie grouping and sensitivity math. Legacy exports remain for election characterization.
- `src/data/studies.ts` is the small study registry.
- `src/data/bidenDropout2024.ts` defines the launch edition, contemporary evidence cutoffs, frozen prices and post-reveal ending.
- `src/data/election2024.ts` adapts the original study into the versioned manifest without changing its calculated outputs.
- `src/data/oscars2026.ts`, `fed2024.ts`, `eagles2025.ts`, and `bitcoin2024.ts` define the four strict generalized studies.
- `src/App.tsx` renders the shared sealed-ranking workflow.
- `docs/adr/001-generalized-event-studies.md` records publishing constraints and the legacy exception.
- `docs/editorial/oscars-2026-review.md` records the proof study’s outstanding editorial gates; it remains labeled an editorial-review draft in the UI.

`npm test` includes golden checks in every study (including all ten election responses), artifact digests, coverage declarations, probability bounds, chronological ordering, duplicate/revision handling, gaps, 0/1 prices, YES/NO normalization, quality failures, temporal-evidence rejection, overlap disclosure, tie-aware comparison, routing, registry completeness, and the strict study validator. It also covers daily schedule boundaries and links, registry evidence rules, malformed storage, authoritative result restoration, duplicate and stale-tab writes, streak expiration, archive exclusions, tie chains, zero-comparison scoring, score-band sharing, and share/copy fallbacks.
