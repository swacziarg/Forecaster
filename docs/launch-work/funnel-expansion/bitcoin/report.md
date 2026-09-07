# Bitcoin funnel-expansion handoff report

Prepared: 2026-09-06
Role: `bitcoin`
Task ID: `01a07777-0cfb-70b0-93f4-20087e2521d6`

## Result

Produced a concrete five-card mainstream Bitcoin-$100K candidate from the existing eight-event study, with a pre-measurement selection freeze, six retained authoritative web-text captures, a strict candidate JSON, evidence manifest, exact measurement output, neutral card copy, reveal-only ending, and integration notes.

Candidate status is `ready-for-review`, not approved or queueable. The candidate has five eligible pre-reveal claims, 25/25 usable measurement windows, 9 comparable pairs, and four anchor-window tie groups. It is a valid backup candidate for the Sep 10–12 funnel slots if the lead resolves the explicit timing/metadata gates and obtains independent human approval.

## Frozen selection

`selection-freeze.json` at `2026-09-06T20:21:50Z` freezes, in chronological initial order:

`hong-kong-etfs`, `mtgox-repayments`, `fed-50-cut`, `trump-election`, `microstrategy-purchase`.

The selection was based on mainstream accessibility, varied mechanisms, primary evidence, and spacing—not fresh response size. Prior exposure to the original study, screen, retained prices, and earlier measurements is disclosed. The threshold crossing, Ether/IBIT specialist redundancy, and Gensler transition were not selected.

## Measurement and quality

The exact local invocation is recorded in `measurements.json`. It reads the existing normalized YES probability series and applies `months-hourly-v1`; no spot prices, interpolation, carrying, or cross-contract splice is used.

- 6,609 normalized observations.
- Three existing missing hourly buckets retained.
- 25 required windows, 25 usable.
- Responses: Hong Kong −11.75 pp; Mt. Gox −3.00 pp; Fed +2.75 pp; Trump −3.50 pp; MicroStrategy +26.00 pp.
- Anchor groups: MicroStrategy; Fed; Mt. Gox + Trump tie; Hong Kong.
- 9 comparable pairs; 1 agreed pair for the chronological initial order.
- Trump and MicroStrategy windows overlap. Their values are descriptive, not isolated causal estimates.

## Evidence and timing

Primary captures cover HKEX spot ETFs, the Mt. Gox repayment notice, the Federal Reserve statement, the AP election-call chronology, and the SEC MicroStrategy filing. A SEC Exhibit 99.1 capture corroborates the MicroStrategy fact. The web tool confirmed exact Fed and AP times; HKEX, Mt. Gox, and SEC/MicroStrategy pages expose only a date in the retained passages, so their inherited study anchors remain explicit independent-review gates. A restricted-shell DNS failure prevented direct byte downloads; no failed response was kept or used as evidence.

## Integration changes requested

The lead owns all runtime/queue changes. Before integration, resolve the mismatch between `bitcoinStudy.dataset.fullMarketLifetime: true` and the retained audit’s `false` (coverage ends `46` minutes before provider `closedAt`). If the flag changes, use the project’s immutable-version/change-log process. Then independently review the exact five, rerun calculations if anchors change, obtain named human approval for the exact study/version/date, and only then add a dated daily entry. The user’s Sep 7 Biden schedule does not approve Bitcoin or assign its date.

See [`candidate.md`](candidate.md) for narrative rationale, mechanisms/confounds, neutral copy, ending boundary, and remaining gates.

## Artifact hashes

| Artifact | SHA-256 |
| --- | --- |
| `selection-freeze.json` | `433984381fff969e009013ca006339427c8d812ad94e4616285720a3cbf79ad8` |
| `candidate.json` | `8e1bc9d862eebac42f57aa771580eeb4274b9253c2b93109767bfaa41c14bb55` |
| `measurements.json` | `dcf8a0f64031143c444766f270704d5d5eb2acafc8f2ddbafcb16d7cbd00886f` |
| `evidence-manifest.json` | `0f98257f3b03f5cb2114fbda22971afb12e568aaf6ee5fb4397167468bee1557` |
| `checks.mjs` | `b6743fd7d7517225ba75e01cbc59b4dbed25b5f1e54314a9d94a9847d12bb8c8` |
| `candidate.md` | `17d64e5bf7bf9f167637c2b3cb1ad78bf66db5da01130515fdc12605112f95bf` |

Capture hashes are recorded in `evidence-manifest.json` and were rechecked by `checks.mjs`.
