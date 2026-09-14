# Final independent review

Reviewed the revised Trump v2, Fed v2, NYC v2, Dodgers v3 studies and `score-audit.json`. The review checked source IDs, pre-reveal claim eligibility, conclusion-source exclusion, event-study arithmetic, and tie-group behavior. No study JSON was modified.

## Eligibility and source identity

All 20 event claims use source IDs present in their study, are marked `pre-reveal`, and do not use the reveal-only conclusion source. Each event has at least one primary or public-event source role and the five cards in each study have retrievable evidence through the study’s pre-reveal card path.

The corrected identities are coherent:

- Trump uses CNN’s verdict, Butler, RFK, debate, and Iowa captures for the five card claims. The RFK claim says “suspending” and “supporting,” which matches the retained claim text even though the display title uses “endorses.”
- Fed uses the five official BLS/Federal Reserve releases, with the revised unemployment wording (“4.2%, little changed”) and exact Powell timing.
- NYC uses the corrected NY1, reporter, campaign, and announcement sources; the election result remains conclusion-only.
- Dodgers uses the official roster/public game feeds for the event timestamps, with retrospective MLB articles separated into retrospective source roles. The title and claim for the NLDS card agree: the claim states the 2–1, 3–1 series result, while the title adds the walk-off-error context supported by its source.

No concrete claim-source eligibility error remains.

## Arithmetic and ties

`verify-audit.mjs` recomputes the old impacts from the original study events and the new impacts from each revised study, then records `shortTermResponse * 100` as `oldPp` and `newPp`. It requires all five cards and all 25 windows per edition to be usable. The recorded tie threshold is 0.01 probability points with a `1e-12` boundary tolerance. Fed and Dodgers groups are stable under -1, 0, and +1 hour shifts. Trump’s debate/Iowa tie splits at -1 hour; NYC’s endorsement tie splits at +1 hour. Those are correctly represented as sensitivity caveats rather than arithmetic failures.

When comparing tie groups across sensitivity rows, group member order must be canonicalized before comparison. The audit script does this with `groups.map(g => [...g].sort())`, so order-only changes such as `['ohtani-return','glasnow-injury']` versus `['glasnow-injury','ohtani-return']` do not count as ranking changes. The human-readable JSON preserves engine order inside tied groups; readers should treat tied members as unordered.

The score audit is therefore substantively consistent with the revised studies. The only remaining presentation caveat is the RFK title’s stronger “endorses” wording; if editorial wording must match the claim literally, change the title to “suspends his campaign and supports Trump.” This is not a source-eligibility or scoring blocker.

