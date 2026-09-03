# eventlens handoff

This repository contains a single 2024 election event-ranking and attribution
study. Runtime uses a versioned local dataset and requires no API credentials.

## Product flow

1. Read the facts and electoral mechanism for ten campaign events.
2. Drag event cards or use their ten-position click picker to order events from
   the strongest positive effect on Trump's winning chance to the strongest
   negative effect.
3. Zoom the hourly price chart to 30, 14, or 7 days, scrub the focused range,
   and inspect event or amber context markers.
4. Reveal the market's signed positive-to-negative order and personal spectrum
   match score.
5. Select an event to compare its 12-hour pre-event, immediate six-hour,
   stabilized 18-36-hour, and separate 48-72-hour follow-through windows.
6. Adjust expert attribution, inspect the counterfactual probability, and open
   the dated historical source.

## Important constraints

- The event-study output describes prediction-market repricing, not proven
  causality.
- Event windows may overlap and are not additive.
- Expert attribution defaults are editorial assumptions and remain visible and
  adjustable in the interface.
- The personal order measures expected direction and strength. The market
  comparison orders signed short-window repricing from positive to negative;
  the two can legitimately differ.
- The 48-72-hour follow-through measure exposes delayed movement but does not
  change the consistently applied 18-36-hour market ranking.
- The local dataset is the reproducible source of truth. Its provenance and
  license are documented in `public/data/README.md`.

## Verification

`npm test` covers the market-series parser, attribution math, spectrum movement,
and match score. `npm run build` performs the TypeScript and production-bundle
checks. The UI has been verified at 1440x900 and 1366x768, including ordering,
comparison reveal, chart zoom and scrubbing, event selection, counterfactual
updates, and the methodology drawer.
