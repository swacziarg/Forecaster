# Handoff

## Current product

The repository is a focused Factor Understanding forecasting game powered by four live Kalshi markets. It loads the market board at runtime, shows a clear error when Kalshi cannot be reached, and has no alternate data source.

The root app includes:

- src/App.tsx: live market board → checkpoint play → path review or settlement results → current-run profile.
- src/domain/types.ts: live market, factor, mental-model, decision, and scoring contracts.
- src/domain/engine.ts: pure probability translation, exact-budget rebalancing, and settlement scoring.
- src/data/kalshi.ts: public Kalshi market metadata and daily candlestick adapter.
- src/data/kalshiScenarios.ts: conversion of the selected markets into four checkpoints and market-derived diagnostics.
- src/styles.css: responsive visual system.
- src/domain/engine.test.ts: core invariant and formula tests.

## Selected markets

- KXFEDDECISION-26SEP-H0 — Federal Reserve September 2026 decision.
- KXUSAIRANAGREEMENT-27-26OCT — US–Iran nuclear agreement.
- KXIPOANTHROPIC-DATE-26OCT01 — Anthropic IPO timing.
- KXOSCARPIC-27-ODY — The Odyssey Best Picture.

## Verification

Run these from the repository root:

    npm run build
    npm test

The app uses the Vite proxy at /api/kalshi and the public Kalshi market-data API. The four factors are computed from each market’s own candlesticks: recent momentum, longer trend, direction consistency, position in range, and trading activity. They are descriptive market diagnostics, not causal or outcome-trained claims.

Active contracts show OPEN on the review screen and are not scored until Kalshi reports a result. The profile summarizes only the current run and does not invent cross-market history.

## Known limitations

- The current interaction assumes four checkpoints and five factors per market.
- The app does not yet persist decisions across page reloads.
- The trajectory chart is a lightweight inline SVG.
- An active market cannot receive a forecast score until it settles.

## Next steps

1. Revalidate the four selected markets as the cultural moment changes.
2. Add persistence for locked decisions and cross-market profile aggregation.
3. Add explicit provenance and uncertainty for any future non-price signals.
4. Re-run the build, tests, and live-browser smoke test after provider changes.
