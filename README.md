# eventlens

An interactive event study of the 2024 U.S. presidential election. The app
uses 3,791 hourly observations from Polymarket's Trump winner contract to show
how the market repriced around six major campaign events.

## Run

```bash
npm install
npm run dev
```

The application runs entirely from the versioned dataset in
`public/data/polymarket-2024-hourly.csv`. It does not require credentials or a
live market API.

## How impact is measured

For each event, the study compares three robust price windows:

- **Before:** median Trump probability during the 12 hours before the event.
- **Immediate:** median during the first six hours after the event.
- **Stabilized:** median from 18 to 36 hours after the event.
- **Observed movement:** stabilized probability minus the pre-event median.

The expert-attribution control estimates how much of the observed repricing
belongs to the named event. It applies that share to the change in log odds,
then reverses it to produce a counterfactual stabilized probability. The
control is deliberately explicit because nearby news, anticipation, and
liquidity can also move a prediction market.

These are market-implied effects, not causal estimates. Event windows can
overlap and their effects should not be added together.

## Data and sources

The hourly series is the MIT-licensed `polymarket2024` dataset from Sebastian
Stockl's `eventclock` package. Its upstream reconstruction uses Polymarket's
public CLOB price-history endpoint at 60-minute fidelity. Full provenance,
checksums, and license text are in `public/data/README.md`.

Each curated event also links to a dated historical source in
`src/data/election2024.ts`. The market metadata points to Polymarket's resolved
2024 presidential election contract.

## Architecture

- `src/data/election2024.ts` defines the market, event timestamps, expert
  priors, interpretations, competing explanations, and source links.
- `src/domain/eventStudy.ts` parses the series and computes robust windows,
  observed moves, attributed effects, and counterfactual probabilities.
- `src/App.tsx` renders the campaign chart, event selector, attribution panel,
  and methodology drawer.
- `src/domain/eventStudy.test.ts` covers parsing, summaries, event windows, and
  full and partial attribution.

Run `npm test` and `npm run build` before handoff.
