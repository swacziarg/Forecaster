# Independent review: Thunder repaired packet v3

Reviewed 2026-09-10. Scope was limited to the repaired study, anchor freeze, score packet, and verifier. No study, source, or runtime files were changed.

## Result

The repair is arithmetically coherent and the verifier passes. The reported stabilized-minus-reference responses are:

| Event | Reference | Stabilized | Response |
| --- | ---: | ---: | ---: |
| Denver Game 7 | 42.5% | 61.5% | +19.0 pp |
| Western Conference finals | 77.5% | 82.5% | +5.0 pp |
| NBA Cup final loss | 16.5% | 17.5% | +1.0 pp |
| Chet return announcement | 25.5% | 25.5% | 0.0 pp |
| Chet injury | 16.0% | 15.5% | −0.5 pp |

The verifier confirms strict study validation, five source-backed cards, 25 usable windows, unchanged raw observations, and the expected v2 tie groups:

`denver-game-seven` > `west-finals` > (`cup-loss` = `chet-return`) > `chet-injury`.

The one-point pair tie is correct under the inclusive 1 percentage-point rule. The preserved initial order is `chet-return`, `cup-loss`, `west-finals`, `chet-injury`, `denver-game-seven`. A ±1-hour sensitivity check leaves the tie groups unchanged; only the Game 7 response shifts from +19.0 to +18.5 pp at +1 hour.

## Timestamp and source semantics

The repaired semantics are sound. The game cards use the official scorer finish reconstructed in the venue's local zone, with `informationKnownAt` advanced one minute for minute precision. The anchor freeze clearly says this is a public live-result time and explicitly says it is not a PDF upload timestamp. The scorebook PDFs have unknown publication time, are retrospective source roles, and are correctly excluded from `getPreRevealCard` source lists. The Chet injury uses the original team announcement at `2024-11-11T06:26:15Z`; the return uses the player's own February 6 post timestamp. The NBA Finals result remains conclusion-only.

One metadata issue should be corrected or explicitly carried into the final review: each `*-live-result` source has the same snapshot hash and PDF capture path as its corresponding retrospective scorebook. That does not invalidate the reconstructed event timestamp, but it can make the live-result source look as if the mutable NBA page itself was archived at that time. A final packet should label the hash as shared corroborating capture evidence or retain a distinct capture/hash for the live-result page. Do not backfill a PDF publication time.

One claim is slightly stronger than the retained team wording. The Chet injury claim currently says “a return-to-play update in eight to ten weeks,” while the timing ledger records that a status update would be provided in 8–10 weeks and that he was expected to return during the season. Use the source-faithful wording “the Thunder announced a right iliac wing fracture and said a status update would be provided in 8–10 weeks.” This is a wording correction, not a scoring issue.

The Cup-final fact “The Bucks win 97–81,” the Game 7 advancement claim, and the Western Conference finals score/4–1 claim match the retained official game records. The game title/date labels are consistent with the venue zones: the Cup final is December 17 in Los Angeles while its UTC anchor is December 18.

**Recommendation:** Treat the repaired measurements and ordering as ready for editorial review. Resolve the shared live-result/PDF hash labeling and soften the Chet injury claim before any publication decision. No invented first-public PDF timestamps were used, and no replacement timestamps are needed.
