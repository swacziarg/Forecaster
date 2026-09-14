# Sports candidate review — 2026-09-10

Two sports storylines are ready for editorial review. They are separate from the already scheduled Eagles Super Bowl LIX edition: the Oklahoma City Thunder's first NBA title and the Los Angeles Dodgers' 2025 World Series defense. Neither candidate has been added to the runtime schedule.

## Recommendation

Advance **Thunder first title 2025** first. Its contract now has an exact event (`12815`), market (`507884`), condition ID and YES token, plus a retained hourly history. It has five dated events with a useful mix of early strength, a major injury, regular-season dominance and playoff progression. The Dodgers candidate is a strong reserve with broader mass appeal, but its packet remains pending the parallel metadata/history pass.

## Contract and resolution checks

The Thunder Gamma event record identifies event `12815`; the selected market is `507884`, question “Will the Oklahoma City Thunder win the 2025 NBA Finals?”, condition `0x6edc6c77c16ef3ba1bcd646159f12f8b8a39528e500dcff95b9220ccfbb75141`, and YES token `83527644927648970835156950007024690327726158617181889316317174894904268227846`. It opened September 24, 2024 and closed/resolved June 23, 2025. The public page shows “Final outcome: Yes.” [Polymarket market page](https://polymarket.com/event/nba-champion-2024-2025/will-the-oklahoma-city-thunder-win-the-2025-nba-finals)

The Dodgers page states that the 2025 World Series Champion market resolves according to the team that wins the 2025 MLB World Series and displays Los Angeles Dodgers as the final leader. MLB's official account confirms the Dodgers won Game 7, 5–4 in 11 innings. [Polymarket market page](https://polymarket.com/event/world-series-champion-2025) · [MLB Game 7 recap](https://www.mlb.com/news/dodgers-win-2025-world-series?sf104662642=1)

## Five-card quality review

Thunder has the cleanest five-card arc: an opening-night road win over Denver, Chet Holmgren's pelvic fracture, the 68–14 finish, a first-round sweep and the Western Conference finals clincher. These are distinct developments and each plausibly changed the championship path. The injury card is the strongest negative counterweight to four positives. The retained Denver, April 13, and Memphis NBA recap pages expose timezone-naive publication strings, so the frozen scoring cutoffs use the next-day 12:00Z bound. The retained Holmgren page exposes a 12:47:34Z update, and the Finals release exposes 03:20:17Z. The replayed months-hourly short-term responses are 0.00 pp, −0.50 pp, 0.00 pp, +0.50 pp and +5.00 pp respectively; all five windows are usable. Under pairwise-anchor-1pt-v2 with 1e-12 tolerance, the tie-aware order is Finals berth, then a tie between Memphis sweep, Denver opener, the 68–14 finish and Holmgren injury.

Dodgers has five distinct developments: Sasaki's signing, his June throwing setback, a multi-player trade deadline, the NL West clinch and the NLCS sweep. The set avoids using the World Series itself as a scored event. The June injury is a meaningful negative card; the deadline card needs an editorial decision about whether multiple same-day transactions are one roster event. Publication times are not all exposed by MLB pages and should be retained as conservative date-level cutoffs unless a contemporaneous timestamp is captured.

## Measurement gaps

The Thunder history is reproducible from [thunder-history-manifest.json](thunder-history-manifest.json), [thunder-hourly.csv](thunder-hourly.csv), and [evaluate-thunder.mjs](evaluate-thunder.mjs). The normalized series contains 6,514 observations, three missing hourly buckets, one rejected out-of-range probability, and no cross-contract splicing. The measured responses are market movements around the selected information cutoffs, not proof that each headline alone caused the change; the event interpretations retain the overlapping playoff and league-news caveats.

The full candidate records, including source publication timestamps and exact unresolved fields, are in [candidates.json](candidates.json).
