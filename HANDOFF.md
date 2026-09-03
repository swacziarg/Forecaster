# Forecast handoff

This repository is now a single-market forecasting replay for **Will the Seattle win the 2026 Pro Football Championship?** It is Kalshi-only: live public market metadata and historical candlesticks are fetched through the Vite proxy, and the app has no alternate, fixture, mock, or synthetic data path.

## Current flow

- `src/App.tsx`: loading → Seattle checkpoint play → settlement results.
- `src/data/kalshi.ts`: Kalshi API adapter, historical-market lookup, and candlestick normalization.
- `src/data/kalshiScenarios.ts`: one-market qualification plus the Seattle world briefings and five event-specific factors.
- `src/domain/engine.ts`: four-checkpoint model, exact 100-point allocation, locked decisions, and Brier/log-loss scoring.

## Verified market

- Ticker: `KXSB-26-SEA`
- Result: YES
- Settled: February 9, 2026
- Traded volume: 85,214,022 contracts

Runtime validation rejects the market if Kalshi does not report a past close, a past settlement, a YES/NO result, at least 500,000 contracts, or enough history for four distinct checkpoints.

## Seattle factor model

The five factors are quarterback health, defensive efficiency, playoff path, major roster shock, and matchup adaptability. The interface separates factors known at the checkpoint from factors still unresolved, while Kalshi is presented as historical context for what traders believed. Each factor includes an event-specific explanation, one-line market observation, direction prompt, argument for and against YES, consequence, and the existing numeric signal used by the forecast engine. The roster-shock factor is explicitly marked as a scenario hypothesis; it never claims an injury or transaction without verified input.

## Verification

`npm run build` and `npm test` should pass before handoff. The live smoke path should load the Seattle market, lock 60d/45d/30d/15d, reveal the settled YES result, and show the score and event context.
