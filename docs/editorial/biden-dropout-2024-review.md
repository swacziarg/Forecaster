# Biden dropout: launch edition

The user approved the topic and five-episode outline in the current task on September 5, 2026 and requested installation as edition #001. Research, source verification and integration were performed by Codex. This record does not claim an independent human editorial review. The four other draft studies retain their existing publication gates.

## Frozen editorial selection

The June debate, July 8 refusal, July 10 Pelosi/Clooney intervention, July 13 Trump shooting, and July 17 renewed pressure were selected in the accepted outline before importing or calculating the new price series. Every selected episode is retained. The resolving July 21 announcement is excluded from scoring and appears only after reveal as the story’s ending. Welch’s July 10 intervention and later July 17 reporting are context, not extra cards.

## Evidence and timestamps

Times below are UTC. CNN transcript sources record public broadcasts; `publishedAt` in this study is the availability time of the cited broadcast passage, not an asserted original web-upload timestamp. Current copies are frozen by SHA-256 in `docs/evidence/biden-dropout-2024/manifest.json`. For letters, the dated primary document is retained alongside contemporary coverage establishing its availability. These snapshots preserve the retrieved version; they are not represented as independently captured 2024 web archives.

| Episode | Occurrence / start | Evidence cutoff and measurement anchor | Basis |
| --- | --- | --- | --- |
| Debate | Jun 28 01:00 | Jun 28 02:00 | First hour of CNN’s live debate. The claim is limited to Biden’s difficulty finishing an answer in that hour. |
| Refusal | Jul 8 13:00, approximate interval start | Jul 8 13:20 | CNN’s 09:15–09:20 ET segment describes the newly released letter. Biden’s letter is reproduced by the American Presidency Project. |
| Pelosi/Clooney | Jul 10 11:40, Pelosi interview | Jul 10 18:30 | The 14:00–14:30 ET CNN segment contains Pelosi’s recorded words and describes Clooney’s call. The cutoff is deliberately after both developments are confirmed. |
| Trump shooting | Jul 13 22:11 | Jul 14 00:00 | CNN’s 19:00–20:00 ET coverage contains rally footage and the Secret Service statement that Trump is safe. No later FBI report is used. |
| Renewed pressure | Jul 17 17:00, approximate interval start | Jul 17 19:00 | CNN’s 14:30–15:00 ET segment reproduces Schiff’s statement. The later receptiveness report is excluded from pre-reveal claims. |

All five events use interval precision. The game measures from the explicit evidence cutoff, rather than claiming to capture each development’s first tick. Earlier information in a multi-hour episode can therefore already be partly reflected in the reference median. The source and timestamp choices were not tuned to produce larger moves.

## Measurement

Reuse the unchanged `months-hourly-v1` profile: reference −12–0h, immediate 0–6h, stabilized 18–36h, delayed 48–72h, anticipation −84–−12h. The score uses stabilized minus reference, in percentage points, with the existing one-point anchor tie rule.

| Episode | Reference median | Stabilized median | Move |
| --- | ---: | ---: | ---: |
| Debate | 19.50% | 32.00% | +12.50 pp |
| Refusal | 59.00% | 42.00% | −17.00 pp |
| Pelosi/Clooney | 45.75% | 61.50% | +15.75 pp |
| Trump shooting | 48.25% | 36.50% | −11.75 pp |
| Renewed pressure | 34.50% | 82.50% | +48.00 pp |

Every window passes existing quality thresholds; five distinct groups produce ten comparable pairs. The larger July 17 move includes the COVID diagnosis and reporting about senior Democrats in the following day. Both the prominent takeaway and detailed explanation disclose this. No single-person causal effect is claimed. Reported peaks and short news intervals in the earlier topic recommendation were not used as game scores.

The series has 692 observations, no duplicates or rejected prices, and one missing bucket at July 21 18:00 UTC. That gap is outside every selected calculation window. No missing prices are filled. Only the June 23–July 21 interval is retained, with additional pre-debate data for the anticipation window; this is explicitly partial market-lifetime coverage.

## Launch behavior

The new edition uses `2026-09-05-biden-dropout`, number 1, and the normal 05:00 UTC schedule boundary. Study publication records the integration date; the release timestamp is the edition’s scheduled date, not a claim that the new site was already live at 05:00. The previous demo ID is retired instead of being silently rebound to another contract. Previously stored demo submissions cannot populate this puzzle. The original election study and its golden calculations remain unchanged.

## Checks

Tests cover all artifact and evidence digests, strict study validation, all five golden responses and usable windows, the one retained gap, routing, five distinct rank groups, exclusion of the settlement event, rejection of later evidence, the conclusion’s source reference, launch resolution and storage isolation. Existing scoring, persistence and other study tests remain in place.
