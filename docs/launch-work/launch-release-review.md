# Final launch review — September 7, 2026

## Authorization and scope

The user reviewed the five playable editions, accepted the updated appearance, and instructed “ok go” after the explicit September 7–12 lineup and final editorial/production checks were presented. This authorizes activation and deployment of the six-edition core. It does not imply that the user personally audited source hashes or the generated implementation. The exact final content hashes are in `schedule/approvals.json`.

## Evidence decisions

- **TikTok and Eagles:** retain the integrated contemporary claims, date/time bounds, five-event selections and immutable snapshots. Strict validation and snapshot checks pass. The Trump election card now supplies his already-public TikTok position. All 25 required windows per topic remain usable.
- **Oscars:** accept conservative source-publication bounds instead of inventing first-announcement seconds. The retained NBR, Golden Globes and PGA metadata and Academy timing record support the v2 anchors. Critics Choice remains date-precise under the existing conservative source policy. The two televised awards have different voters and category structures and remain separate news episodes; they are not represented as independent causal experiments.
- **Bitcoin:** retained coverage ends at 04:00 UTC, before the provider closes at 04:46:26 UTC; `fullMarketLifetime: false` is correct. The retained HKEX and trustee records establish announcement dates rather than exact clocks. The Federal Reserve supplies its 2 p.m. EDT release time; AP supplies the election-call time, and the SEC acceptance record supplies the filing bound. Keep these conservative cutoffs. All scoring windows are usable. The wider Trump/MicroStrategy observation windows overlap; disclose this in the result's Study dialog.
- **Canada:** retain the contemporary AP election-call replacement and conservative date-only cutoffs. The middle three responses fall within the anchor-based one-point tie range, so three pairs are excluded and seven pairs remain. The Study dialog explains this explicitly. The party/people introduction passes a separate first-event source cutoff filter.

## Inclusive scoring correction

`pairwise-anchor-1pt-v2` adds a 1e-12 probability tolerance solely for floating-point subtraction noise at the inclusive tie boundary. It does not round observed prices, change event anchors, widen substantive ties, or allow chained ties. The underlying measurement profile is unchanged.

For Oscars, the +5-point PGA and +4-point Critics Choice responses now tie. The +3-point Globes response begins the next group because the prior group is anchored at +5. The initial-order score becomes 7/9 (78%). Other scheduled tie groups remain unchanged. Existing Biden editions retain v1 scoring and their existing storage keys/results. Preview v2 keys also avoid restoring older v1 preview scores.

Tests cover historical v1 behavior, the v2 boundary, no chaining, a difference genuinely above one point, real Oscars observations, all five release boundaries, future links and archive behavior. The result display calls the same versioned scorer as submission.

## Release checks

All nine test suites, production build, source/build artifact checks, content-hash approval checks and Wrangler packaging dry run passed. The readiness result is READY with six distinct approved editions and five consecutive future releases. No missing artifacts or duplicate IDs/numbers were reported.

The next queue gap is September 13 at 05:00 UTC. See `next-batch.md` for the next preparation work. Public deployment verification is recorded in the final task response and release receipt.
