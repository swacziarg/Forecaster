**Historical timing audit: one-point tie groups below are superseded by the owner-approved [exact-move scoring review](../APPROVAL-REVIEW.md). Source repairs remain valid.**

# Thunder repaired: five cards, four ranking groups

**Status: repaired content draft, ready for editorial review. Not scheduled.** This version supersedes the withdrawn v2. The user asked to keep Thunder if its scoring could be made sound.

The old Game 7 zero was a timing failure. It measured from a next-day article update, after the odds had jumped. Version 3 measures the public result or announcement, using official game records, the team's original injury release and the player's return announcement. The market data and one-point tie rule are unchanged.

| Card | Historical date | Before | After | Measured change |
|---|---|---:|---:|---:|
| Thunder eliminate Denver in Game 7 | May 18, 2025 | 42.5% | 61.5% | **+19.0 pp** |
| Thunder reach the NBA Finals | May 28, 2025 | 77.5% | 82.5% | **+5.0 pp** |
| Thunder lose the NBA Cup final | December 17, 2024 | 16.5% | 17.5% | **+1.0 pp** |
| Holmgren announces his return | February 6, 2025 | 25.5% | 25.5% | **0.0 pp** |
| Thunder announce Holmgren's fracture | November 11, 2024 | 16.0% | 15.5% | **−0.5 pp** |

The Cup loss and return announcement tie under the unchanged inclusive one-point rule. That leaves **four ranking groups**. The positive response after a Cup loss is retained as measured, not rewritten into an assumed negative effect. These are descriptive changes around the news, not isolated causal estimates.

## What was repaired

- Denver Game 7: the official scorer records a 5:01 p.m. finish in Oklahoma City. The public-result cutoff is 22:02 UTC, covering the stated minute, rather than the next morning's article update.
- The Cup final and Western Conference clincher also use official game finish records and arena timezones. These timestamps mean the result was publicly observable; they do **not** claim the PDF or webpage was uploaded at that moment. The scorer reports are retained as retrospective evidence for the live event.
- The fracture card uses the team's original November 11 diagnosis release at 06:26:15 UTC. The earlier article began with the fall and cannot establish that the later diagnosis was already public.
- The return card uses Holmgren's own February 6 announcement at 14:42:10.195 UTC, reconstructed from the embedded original post ID. It does not claim he had already played the February 7 game.

## Verification and limits

Five valid sourced cards; all 25 measurement windows usable. Shifting every cutoff by −1 or +1 hour preserves all four ranking groups. Game 7 is +18.5 to +19.0 pp across that sensitivity check. A separately reported six-hour pre-tip baseline also yields +18.5 pp, confirming that the recovered jump is not dependent on one cutoff minute.

Scoring remains the median in the 12 hours before the result/announcement versus the median 18–36 hours afterward. The reference can include in-game trading; the separate pre-tip comparison checks that concern. Other league news and anticipation may affect the windows. Missing observations and the rejected out-of-range row remain preserved.

## Evidence and exact draft

- [Game 7 official scorer record](games/denver-book.pdf)
- [Cup final official scorer record](games/cup-book.pdf)
- [Western Conference clincher official scorer record](games/finals-berth-book.pdf)
- [Thunder's original injury statement](https://www.nba.com/thunder/news/holmgren-241111)
- [Holmgren's return announcement](https://twitter.com/ChetHolmgren/status/1887512110986633513)
- [Exact repaired study](study-draft-v3.json), [frozen anchors](anchor-freeze-v3.json), [reproducible scoring and sensitivity](score-packet-v3.json)

Initial play order is unchanged: return announcement → Cup loss → Finals berth → fracture → Denver Game 7. The June title result remains reveal-only. No runtime schedule entry, approval record or deployment was changed.
