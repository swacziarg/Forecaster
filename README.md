# Forecast — Factor Understanding

A forecasting game built around four live Kalshi markets. Read the current market, inspect transparent signals derived from its Kalshi price history, assign a 100-point mental model, and lock four forecasts at sequential information cutoffs.

## Run it

From the repository root:

    npm run dev

The app opens at http://localhost:5178.

Build and test it with:

    npm run build
    npm test

## The live market board

The board loads exactly four selected Kalshi markets:

- KXFEDDECISION-26SEP-H0 — the Federal Reserve’s September 2026 decision.
- KXUSAIRANAGREEMENT-27-26OCT — a possible US–Iran nuclear agreement.
- KXIPOANTHROPIC-DATE-26OCT01 — whether Anthropic announces an IPO by October.
- KXOSCARPIC-27-ODY — whether The Odyssey wins Best Picture.

Market metadata, prices, volumes, open interest, candlesticks, and settlement status come from Kalshi’s public market-data API. The app uses the Vite proxy in vite.config.ts, and shows a connection error instead of substituting another data source when Kalshi is unavailable. See the [Kalshi market-data guide](https://docs.kalshi.com/getting_started/quick_start_market_data).

## How the game works

- Each market has four cutoffs: 60d, 45d, 30d, and 15d before the latest available Kalshi observation.
- The factor cards are five transparent diagnostics calculated only from the market’s own Kalshi candlesticks: recent momentum, longer trend, direction consistency, position in range, and trading activity.
- At each cutoff, the user allocates exactly 100 whole-number points across those factors and marks each signal as more likely, neutral, or less likely.
- The user’s probability is calculated around the Kalshi probability at that cutoff. Locked decisions cannot be edited, and later observations stay hidden until their checkpoint.
- Active markets remain open on the results screen. Forecast scoring starts only after Kalshi reports a settlement.

## Architecture

- src/data/kalshi.ts is the typed Kalshi API boundary. It fetches market metadata and daily candlesticks through /api/kalshi.
- src/data/kalshiScenarios.ts converts the four live markets into the game’s checkpoint, factor, and history structures.
- src/domain/types.ts defines the live market, factor, mental-model, decision, and scoring contracts.
- src/domain/engine.ts contains pure forecasting, budget-rebalancing, and scoring functions.
- src/App.tsx owns loading, market selection, the checkpoint flow, results, and the run-based profile.
- src/styles.css contains the visual system and responsive layout.

The factor diagnostics describe observable market behavior. They are not outcome-trained causal claims. The profile is intentionally limited to the current run; it does not invent cross-market history.
