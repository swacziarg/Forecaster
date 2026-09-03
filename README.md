# Forecast

A focused historical reasoning exercise built around one resolved Kalshi market: **Will the Seattle win the 2026 Pro Football Championship?** The app replays four pre-settlement snapshots, shows what the market thought at each date, asks you to weigh five Seattle-specific factors, and reveals the verified result and how closely your final weights matched the model.

## Run

```bash
npm install
npm run dev
```

The Vite app uses `/api/kalshi` as a local proxy to Kalshi’s public trade API. No credentials, alternate provider, mock data, or synthetic fallback is used.

## The market

The app fails loudly unless the single configured market loads from Kalshi with:

- a past close and settlement timestamp;
- a verified YES/NO result;
- at least 500,000 traded contracts; and
- enough daily candlesticks for distinct 60d, 45d, 30d, and 15d checkpoints.

The configured historical ticker is `KXSB-26-SEA`. During development it was verified as YES, settled February 9, 2026, with 85,214,022 traded contracts.

## How the replay works

- The question is always the Seattle championship market; there is no market board or second scenario.
- Each checkpoint shows the date, what was known then, the historical market YES price, the argument for and against YES, why the moment mattered, and source links.
- Five factors are specific to the Seattle title path: quarterback health, defensive efficiency, playoff path, major roster shock, and matchup adaptability. The first three are marked as known then; the last two as unresolved then.
- Each factor has a short market-context observation. It describes what traders believed, not independent evidence that the factor occurred.
- You allocate exactly 100 points, choose each factor’s effect on YES, lock four decisions, then see the actual settlement, trajectory, Brier score, and model-match score.

## Architecture

- `src/data/kalshi.ts` is the Kalshi-only adapter and historical candlestick normalizer.
- `src/data/kalshiScenarios.ts` qualifies the Seattle market and builds its checkpoint briefings, factor narratives, and market history.
- `src/domain/engine.ts` contains the probability model, locked-decision snapshots, and scoring logic.
- `src/App.tsx` owns the single-market flow from loading through results.

Kalshi is shown as the historical baseline for comparison. The existing forecast engine still uses the selected contract’s historical prices and the user’s factor weights/directions to produce each locked probability; the final model-match score compares the user’s weights with the reference model.
