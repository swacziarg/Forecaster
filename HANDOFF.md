# eventlens handoff

This repository contains a single 2024 election event-ranking and attribution
study. Runtime uses a versioned local dataset and requires no API credentials.

## Product flow

1. Read the facts and electoral mechanism for ten campaign events.
2. Drag events into a predicted most-to-least consequential ranking.
3. Scrub the complete hourly price chart and inspect ranked event markers or
   amber contextual markers for large moves without a clean event attribution.
4. Reveal the absolute-movement market ranking and personal rank-match score.
5. Select an event to compare its 12-hour pre-event, immediate six-hour, and
   stabilized 18-36-hour windows.
6. Adjust expert attribution, inspect the counterfactual probability, and open
   the dated historical source.

## Important constraints

- The event-study output describes prediction-market repricing, not proven
  causality.
- Event windows may overlap and are not additive.
- Expert attribution defaults are editorial assumptions and remain visible and
  adjustable in the interface.
- The personal ranking measures total expected electoral consequence. The
  market comparison ranks absolute short-window repricing; those concepts can
  legitimately differ.
- The local dataset is the reproducible source of truth. Its provenance and
  license are documented in `public/data/README.md`.

## Verification

`npm test` covers the market-series parser, attribution math, ranking movement,
and ranking score. `npm run build` performs the TypeScript and production-bundle
checks. The UI has been verified at 1440x900 and 1366x768, including ranking,
comparison reveal, chart scrubbing, event selection, counterfactual updates,
and the methodology drawer.
