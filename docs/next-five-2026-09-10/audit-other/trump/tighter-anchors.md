# Trump timing: tighter transcript anchors

This memo audits the five Trump-study timing anchors against the retained CNN transcript captures. It uses the smallest **supported upper bound**: the first timestamp marker after the transcript text that contains the complete card claim. A marker is a transcript navigation anchor, not proof that the claim was first published at that second. No market prices or study scores were inspected or changed.

## Results

| Card claim | Current bound | Tightest supported upper bound | Recommendation | Evidence |
|---|---:|---:|---|---|
| Trump found guilty on all 34 counts | 2024-05-30 21:15:07Z | 2024-05-30 21:15:07Z | Keep | `trump-conviction.html`: the `[17:10:04]` marker occurs before the transcript completes Count 34 and says “all 34”; the next marker is `[17:15:07]` EDT. |
| Trump survived a shooting at his Pennsylvania rally | 2024-07-14 00:00:00Z | 2024-07-13 23:35:06Z | Tighten to this conservative confirmation bound | `trump-shooting.html`: the later `[19:35:06]` EDT marker follows CNN’s explicit confirmation that gunshots hit Trump; use this conservative bound rather than the earlier analyst assessment. |
| RFK Jr. suspended his campaign and put support behind Trump | 2024-08-23 19:30:00Z | 2024-08-23 19:10:00Z | Tighten to this bound | `trump-rfk.html`: the transcript reports that he was suspending the campaign and describes his support behind Trump before the `[15:10:00]` EDT marker. |
| Des Moines Register Iowa poll showed Harris 47%, Trump 44% | 2024-11-03 00:00:00Z | 2024-11-02 23:05:01Z | Tighten to this bound, with a provenance note | `trump-iowa-cnn.html`: `[19:00:52]` EDT precedes the opening poll text; the next marker after that complete result is `[19:05:01]` EDT. The page is the 7–8p ET Nov. 2 broadcast, so this is Nov. 2 UTC, not Nov. 3. |

## Anchor-by-anchor review

### Conviction

The `[17:10:04]` marker is not itself the completion time. The following text still reads the final counts: “Count 33, guilty. Count 34, guilty,” followed by the statement that Donald Trump was found guilty on all 34 counts. The next timestamp marker is `[17:15:07]`. The existing `21:15:07Z` bound is therefore the correct conservative upper bound. Replacing it with `21:10:04Z` would place the anchor before the transcript states the full claim.

### Butler rally shooting

The opening `[19:00:06]` text says CNN is assessing whether gunshots hit Trump, and the `[19:05:04]` section carries the Secret Service statement that the former president is safe. The `[19:15:06]` section still presents an analyst assessment. CNN’s later `[19:35:06]` section explicitly confirms that gunshots hit Trump, so `2024-07-13T23:35:06Z` is the conservative transcript bound for the complete confirmed claim. The real-world shooting occurred earlier, but using that occurrence time would be hindsight leakage for a news-reveal card.

### RFK Jr.

The CNN capture is the 3–3:30p ET Aug. 23 broadcast. The transcript includes Kennedy’s statement that he is “simply suspending” the campaign and later describes him as throwing his support behind Trump. Those statements occur before the `[15:10:00]` marker; the next later marker is `[15:10:00]` itself. The resulting UTC bound is `2024-08-23T19:10:00Z`, earlier than the current `19:30:00Z` bracket end while preserving the full combined claim.

### Iowa poll

The opening text of the CNN 7–8p ET Nov. 2 capture gives the complete result: the Des Moines Register has Harris at 47% and Trump at 44%, within a 3.4-point margin of error. The `[19:00:52]` marker precedes that opening poll text; the next marker is `[19:05:01]` EDT. That supports `2024-11-02T23:05:01Z` as the upper bound from this capture. The existing `2024-11-03T00:00:00Z` bound is a full-hour bracket end and can be tightened by 54 minutes and 59 seconds, while retaining the transcript’s stated timing limitation.

## Source identity

- `docs/launch-queue-research/evidence/trump-conviction.html`
- `docs/launch-queue-research/evidence/trump-shooting.html`
- `docs/launch-queue-research/evidence/trump-rfk.html`
- `docs/launch-queue-research/evidence/trump-iowa-cnn.html`
