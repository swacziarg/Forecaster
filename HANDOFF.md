# Handoff

## Current product

The repository is a focused Factor Understanding forecasting game powered by four high-volume, resolved Kalshi markets. It validates the catalog at runtime, shows a clear error when a market is unresolved, future-dated, under the volume threshold, missing history, or unreachable, and has no alternate data source.

The root app includes:

- src/App.tsx: resolved market board → checkpoint play → settlement results → current-run profile.
- src/domain/types.ts: market, factor, mental-model, decision, and scoring contracts.
- src/domain/engine.ts: pure probability translation, exact-budget rebalancing, and settlement scoring.
- src/data/kalshi.ts: public Kalshi market metadata and daily candlestick adapter.
- src/data/kalshiScenarios.ts: catalog qualification, sourced checkpoint briefings, per-market factor configuration, and Kalshi-only numeric proxies.
- src/styles.css: responsive visual system.
- src/domain/engine.test.ts: core invariant and formula tests.

## Selected markets

- KXCANCOALITION-30-L — Canadian Liberal majority: NO; 3,256,198 contracts; settled May 27, 2025.
- KXFEDDECISION-25DEC-C25 — December 2025 25 bp Fed cut: YES; 12,184,561 contracts; settled Dec 10, 2025.
- KXOSCARPIC-26-ONE — One Battle After Another for Best Picture: YES; 5,042,079 contracts; settled Mar 16, 2026.
- KXSB-26-SEA — Seattle as 2026 pro-football champion: YES; 85,214,022 contracts; settled Feb 9, 2026.

## Verification

Run these from the repository root:

    npm run build
    npm test

The app uses the Vite proxy at /api/kalshi and the public Kalshi historical market-data API. Every checkpoint has a date-bounded world briefing with sourced status, observed developments, cases for and against YES, and outcome stakes. Each factor card also carries event context, its own YES/NO argument, and consequence. None of this editorial context enters the engine; factor effects remain transparent transforms of the selected market’s own candlesticks.

Settlement-aware handling remains for robustness, but the featured catalog rejects unresolved contracts. The profile summarizes only the current run and does not invent cross-market history.

## Known limitations

- The current interaction assumes four checkpoints and five factors per market.
- The app does not yet persist decisions across page reloads.
- The trajectory chart is a lightweight inline SVG.
- An active market cannot receive a forecast score until it settles.

## Next steps

1. Revalidate volumes and Kalshi historical availability if the provider changes its retention or schema.
2. Add persistence for locked decisions and cross-market profile aggregation.
3. Add explicit provenance and uncertainty for any future non-price signals.
4. Re-run the build, tests, and live-browser smoke test after provider changes.
