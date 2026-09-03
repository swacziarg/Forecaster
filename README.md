# eventlens

An interactive event-ranking study of the 2024 U.S. presidential election. The
app uses 3,863 hourly observations from Polymarket's Trump winner contract to
compare a user's positive-to-negative ordering of ten campaign events with the
market response.

## Run

```bash
npm install
npm run dev
```

The application runs entirely from the versioned dataset in
`public/data/polymarket-2024-hourly.csv`. It does not require credentials or a
live market API.

## Product flow

1. Read the facts and hypothesized electoral mechanism for each event.
2. Drag the ten events from the strongest positive effect on Trump's winning
   chance to the strongest negative effect.
3. Scrub hour by hour across the market chart. Numbered circles are ranked
   events; amber diamonds explain large diffuse or market-structure moves.
4. Reveal the market's signed ordering and compare it with the personal order.
5. Inspect the observed move, adjust expert attribution, and review the
   counterfactual probability, competing explanation, and dated source.

The set deliberately includes high-salience events with little immediate
market response. The Joe Rogan interview, for example, was flat in the
standardized window but had positive follow-through two to three days later.
Showing both keeps public attention and slow repricing visible without changing
the comparison window event by event.

## How impact is measured

For each event, the study compares four robust price windows:

- **Before:** median Trump probability during the 12 hours before the event.
- **Immediate:** median during the first six hours after the event.
- **Stabilized:** median from 18 to 36 hours after the event.
- **Follow-through:** median from 48 to 72 hours after the event.
- **Observed movement:** stabilized probability minus the pre-event median.

The signed observed movement determines the market order, from the largest
increase in Trump's probability to the largest decrease. Follow-through
is displayed separately to reveal slower changes while avoiding a
best-looking-window choice for individual events.

The expert-attribution control estimates how much of the observed repricing
belongs to the named event. It applies that share to the change in log odds,
then reverses it to produce a counterfactual stabilized probability. The
control is deliberately explicit because nearby news, anticipation, and
liquidity can also move a prediction market.

These are market-implied effects, not causal estimates. Event windows can
overlap and their effects should not be added together.

## Data and sources

The core hourly series is the MIT-licensed `polymarket2024` dataset from
Sebastian Stockl's `eventclock` package. Its upstream reconstruction uses
Polymarket's public CLOB price-history endpoint at 60-minute fidelity. A direct
May 29-31 extract from that endpoint adds the full window around Trump's May 30
conviction. Full provenance, checksums, and license text are in
`public/data/README.md`.

Each curated event also links to a dated historical source in
`src/data/election2024.ts`. The market metadata points to Polymarket's resolved
2024 presidential election contract.

## Architecture

- `src/data/election2024.ts` defines the market, event timestamps, expert
  priors, interpretations, competing explanations, and source links.
- `src/domain/eventStudy.ts` parses the series and computes robust windows,
  observed moves, attributed effects, and counterfactual probabilities.
- `src/App.tsx` renders the sortable ranking, hourly chart scrubber, contextual
  move markers, comparison state, attribution panel, and methodology drawer.
- `src/domain/eventStudy.test.ts` covers parsing, summaries, event windows, and
  ranking operations, ranking scores, and full and partial attribution.

Run `npm test` and `npm run build` before handoff.
