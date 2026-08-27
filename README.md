# Forecast — Factor Understanding

A forecasting game built around four high-volume, resolved Kalshi markets. Replay four pre-settlement snapshots, weigh event-specific hypotheses backed only by transparent Kalshi-history proxies, and reveal the verified result and score after locking the full path.

## Run it

From the repository root:

    npm run dev

The app opens at http://localhost:5178.

Build and test it with:

    npm run build
    npm test

## The resolved market board

The board fails loudly unless exactly four qualifying markets load from Kalshi with a past close, a verified YES/NO result, at least 500,000 traded contracts, and enough candlestick history for distinct 60d, 45d, 30d, and 15d checkpoints:

- KXCANCOALITION-30-L — Liberal majority in Canada’s next government: NO, 3,256,198 contracts, settled May 27, 2025.
- KXFEDDECISION-25DEC-C25 — Federal Reserve cuts 25 bps in December 2025: YES, 12,184,561 contracts, settled Dec 10, 2025.
- KXOSCARPIC-26-ONE — One Battle After Another wins Best Picture: YES, 5,042,079 contracts, settled Mar 16, 2026.
- KXSB-26-SEA — Seattle wins the 2026 pro-football championship: YES, 85,214,022 contracts, settled Feb 9, 2026.

Market metadata, contract volume, candlesticks, and settlement results come from Kalshi’s public historical market-data API. The app uses the existing Vite proxy and shows a connection error instead of substituting another data source when Kalshi is unavailable. See Kalshi’s [historical-data guide](https://docs.kalshi.com/getting_started/historical_data).

## How the game works

- Each market has four cutoffs: 60d, 45d, 30d, and 15d before its Kalshi settlement timestamp.
- Every cutoff opens with a sourced, date-bounded briefing: the state of the event, developments already known, the strongest case for and against YES, and the consequences of the outcome. Later facts are excluded.
- Every market has its own five-factor editorial configuration. Each factor includes an event-specific name, event context, explanation, a scenario-lens observation, a direction prompt, an argument for and against YES, the consequence if it matters, and a numeric proxy calculated only from that contract’s Kalshi candlesticks.
- Scenario lenses are labeled as conditional hypotheses; the app does not claim that an outside event occurred without an outside verified data source.
- At each cutoff, the user allocates exactly 100 whole-number points across those factors and marks each signal as more likely, neutral, or less likely.
- The user’s probability is calculated around the Kalshi probability at that cutoff. Locked decisions cannot be edited, and later observations stay hidden until their checkpoint.
- Settlement-aware behavior remains in place for robustness, while all four featured replays resolve and score immediately.

## Architecture

- src/data/kalshi.ts is the typed Kalshi API boundary. It fetches market metadata and daily candlesticks through /api/kalshi.
- src/data/kalshiScenarios.ts validates the four resolved markets and converts their event-specific configuration into checkpoint, factor, and history structures.
- src/domain/types.ts defines the market, factor, mental-model, decision, and scoring contracts.
- src/domain/engine.ts contains pure forecasting, budget-rebalancing, and scoring functions.
- src/App.tsx owns loading, market selection, the checkpoint flow, results, and the run-based profile.
- src/styles.css contains the visual system and responsive layout.

The historical briefings help the user reason but never enter the numeric forecast engine. Factor diagnostics describe observable market behavior; they are not outcome-trained causal claims. The profile is intentionally limited to the current run and does not invent cross-market history.
