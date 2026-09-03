# eventlens handoff

This repository contains a single 2024 election event-attribution study. It
replaces the previous Seattle championship replay and has no Kalshi or live API
runtime dependency.

## Product flow

1. Orient on the full Trump probability series and resolved market metadata.
2. Select one of six annotated campaign events from the chart or event list.
3. Compare the 12-hour pre-event median with immediate and stabilized windows.
4. Adjust the expert-attribution share to separate the named event from
   concurrent or unexplained information.
5. Read the resulting attributed effect and counterfactual probability, then
   inspect the historical source and competing explanation.

## Important constraints

- The event-study output describes prediction-market repricing, not proven
  causality.
- Event windows may overlap and are not additive.
- Expert attribution defaults are editorial assumptions and remain visible and
  adjustable in the interface.
- The local dataset is the reproducible source of truth. Its provenance and
  license are documented in `public/data/README.md`.

## Verification

`npm test` covers the market-series parser and attribution math. `npm run build`
performs the TypeScript and production-bundle checks. The UI has been verified
at 1440x900 and 1366x768, including event selection, counterfactual updates,
and the methodology drawer.
