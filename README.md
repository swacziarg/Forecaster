# NexusPoint

NexusPoint is a quick daily prediction-market puzzle. A player ranks five sourced historical headlines from the biggest rise in a selected contract's odds to the biggest fall, reveals a tie-aware score, and can share a spoiler-free result. The detailed market study remains available as optional post-game exploration.

Eleven local, reproducible study versions are registered, including five editorial-review draft routes. The launch funnel now has six distinct dated proposals plus an optional buffer, while only the Biden launch date is approval-backed:

- `/` — the five-card NexusPoint daily game, launching with “24 days that ended Biden’s campaign.”
Full study pages and the `/studies` index are retired. All `/studies/*` URLs return to the daily game. Results retain compact Scoring rules, Study, and Stats dialogs; original sources and market data remain accessible there.

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
2. Swipe cards to scroll. Hold a tile for 350 ms, then drag to reorder, or use its keyboard-operable arrow buttons. Moving more than 8 pixels before the hold completes leaves the gesture as normal scrolling. Mouse users can drag cards immediately. Links, detail disclosures, and buttons remain independently clickable.
3. Reveal once. A validated, versioned attempt record is saved by puzzle ID on the device when browser storage is available.
4. See a prominent score out of 100, the two orders, a before/after probability chart, one takeaway, and tie treatment. Market movement is labeled in full as percentage points and kept distinct from the game score.
5. Share through the device share sheet or copy a spoiler-free text result linked to that exact puzzle. Tiles represent completed 20-point score bands; the exact score is separate.
6. Open “Why this order?” or the full archive study for the deeper evidence and methodology.

## Daily publication and local results

Daily puzzles live in a validated registry with stable IDs and numbers, UTC release timestamps, an exact published study version, five unique event IDs, a fixed initial order, and an explicit scoring version. A puzzle is the current daily for 24 hours or until the next scheduled release, whichever comes first. Exact `?daily=<id>` links reopen a released puzzle; unknown IDs and future releases do not fall through to another puzzle. If the queue has a gap or is exhausted, the interface says so and never invents a countdown.

Puzzle #001 is the September 5, 2026 Biden dropout archive (`?daily=2026-09-05-biden-dropout`); its fresh September 7 launch identity is #002 (`?daily=2026-09-07-biden-dropout`) and isolates attempts from the archive. The user approved the unchanged Biden content and date only. TikTok #003, Eagles #004, Oscars #005, Bitcoin #006, and Canada #007 form the six-distinct-edition proposal funnel; Trump #008 is an optional buffer. Those later entries are not in the daily registry, do not open from the root, and do not count as approved runway until exact human approvals cover each study/content identity, hash, and release timestamp. In local development, the five non-Biden topics are privately playable at the explicit `/__preview/<slug>` paths recorded in `docs/launch-work/playable-drafts/funnel.md`; these use isolated practice storage and never affect official streaks. Their candidate packets and current evidence decisions are in `docs/launch-work/funnel-expansion/`. New entries must pass the same evidence and publication-status checks before they can be added to the daily registry.

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
- `src/data/oscars2026.ts`, `fed2024.ts`, `eagles2025.ts`, `bitcoin2024.ts`, `tiktok2025.ts`, `eaglesFiveCard2025.ts`, `oscarsFiveCard2026.ts`, `bitcoinFiveCard2024.ts`, and `canada2025.ts` define the strict generalized studies and retained editorial-review drafts.
- `src/domain/playablePreview.ts` provides the explicitly allowlisted, development-only preview route; production builds cannot activate it with a query parameter.
- `src/App.tsx` renders the shared sealed-ranking workflow.
- `docs/adr/001-generalized-event-studies.md` records publishing constraints and the legacy exception.
- `docs/editorial/oscars-2026-review.md` records the proof study’s outstanding editorial gates; it remains labeled an editorial-review draft in the UI.
- `npm run check:launch-readiness -- --now <ISO-UTC>` checks the live registry, local artifacts, metadata, proposed queue, and exact human-approval inputs. A local pass does not prove remote deployment.

`npm test` includes golden checks in every study (including all ten election responses), artifact digests, coverage declarations, probability bounds, chronological ordering, duplicate/revision handling, gaps, 0/1 prices, YES/NO normalization, quality failures, temporal-evidence rejection, overlap disclosure, tie-aware comparison, routing, registry completeness, and the strict study validator. It also covers daily schedule boundaries and links, registry evidence rules, malformed storage, authoritative result restoration, duplicate and stale-tab writes, streak expiration, archive exclusions, tie chains, zero-comparison scoring, score-band sharing, and share/copy fallbacks.
