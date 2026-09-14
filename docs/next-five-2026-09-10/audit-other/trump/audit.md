**Initial findings; superseded where different by [corrected transcript brackets](tighter-anchors.md) and the parent [final audit](../REVIEW.md).**

# Independent audit: Trump comeback five-card draft

Reviewed 2026-09-10 against the strict draft, the retained evidence manifest and local source captures. No study, runtime, dataset, or source files were changed.

## Overall finding

The draft has a sound hindsight firewall. The five pre-reveal claims point to contemporary or first-party evidence available by the declared cutoffs; later ABC transcript edits, the AP election call, and the failed Des Moines Register retrieval are excluded from pre-reveal use. The declared cutoffs are conservative public-availability upper bounds, not verified first-public minutes. That distinction is recorded in the evidence manifest and should remain visible to the final editor.

The retained series and five event IDs are internally consistent. The main editorial risk is timing contamination from using the end of a broadcast bracket when an event was already known earlier. This is acceptable as a conservative measurement anchor only if the UI and report continue to call it an upper bound.

## Anchor audit

### Conviction — `2024-05-30T21:15:07Z`

The local CNN transcript capture is labeled as a 17:00–18:00 EDT broadcast. It records the jury entering at `[17:05:12]`, the last count and all-34 finding at `[17:10:04]`, and the completed polling/discussion at `[17:15:07]`. The draft uses `21:15:07Z` (17:15:07 EDT), which is a defensible end-of-segment upper bound, but it is about five minutes after CNN has already stated the complete result. The card claim is supported by the CNN transcript; the Manhattan DA page and New York court record are appropriate date/count corroboration, but their date-only publication metadata cannot establish the precise 21:15 cutoff.

**Correction recommendation:** keep the current anchor only if it is explicitly labeled “broadcast bracket upper bound.” If seeking a tighter public-by bound from the retained capture, `2024-05-30T21:10:04Z` is the first timestamp in that capture that states all 34 counts were guilty. Do not call either value the true first public instant without an archived contemporaneous wire/live record.

Sources: [CNN transcript](https://transcripts.cnn.com/show/se/date/2024-05-30/segment/05), [Manhattan DA release](https://manhattanda.org/d-a-bragg-announces-34-count-felony-trial-conviction-of-donald-j-trump/), [New York court record](https://www.nycourts.gov/reporter/3dseries/2024/2024_24328.htm).

### Butler shooting — `2024-07-14T00:00:00Z`

The local CNN capture is labeled as a 19:00–20:00 EDT broadcast. At `[19:05:04]`, the Secret Service statement says an incident occurred and Trump was safe; the segment then reports the protective response and shooting investigation. The actual shots occurred around 18:11 EDT according to contemporaneous public reporting, so the selected `00:00Z` cutoff is a conservative end-of-hour bound rather than first public availability. The claim “Trump survived a shooting at his Pennsylvania rally” is supportable by the segment's Secret Service and campaign statements, though the earliest wording in the segment initially says the nature of the incident was still being confirmed.

**Correction recommendation:** no required score correction. Keep the wording “contemporary coverage reported that Trump survived a shooting” and retain the end-of-hour caveat. Do not silently replace it with the shooting minute unless a source capture proving first public availability is added.

Sources: [CNN transcript](https://transcripts.cnn.com/show/cnr/date/2024-07-13/segment/08), [CBS contemporary report](https://www.cbsnews.com/news/possible-shots-fired-at-trump-rally-in-butler-pennsylvania/), [DOJ statement](https://www.justice.gov/archives/opa/pr/attorney-general-merrick-b-garland-statement-shooting-former-president-donald-j-trumps-rally).

### RFK Jr. endorsement — `2024-08-23T19:30:00Z`

The local CNN capture is labeled as a 15:00–15:30 EDT broadcast and contains the endorsement/suspension discussion during that bracket. The first-party Kennedy statement is dated August 23 but has no verified minute. The draft correctly uses the CNN bracket for the pre-reveal claim and does not treat the date-only Substack page as an exact timestamp. The statement itself says Kennedy was suspending rather than terminating and supported Trump, so the claim text is supported. A Reuters report displayed 3:24 p.m. EDT publication, but it is corroboration rather than proof of the first public instant.

**Correction recommendation:** keep `19:30Z` as a conservative broadcast upper bound. Do not replace it with the Substack page's date or a later article update. The “expectedDirection: positive” field is editorial expectation only; the observed negative response is correctly preserved without causal reinterpretation.

Sources: [Kennedy first-party statement](https://robertfkennedyjr.substack.com/p/why-i-am-suspending-my-campaign-for), [CNN transcript](https://transcripts.cnn.com/show/cnc/date/2024-08-23/segment/11), [Reuters corroboration](https://www.investing.com/news/world-news/rfk-jr-suspends-us-presidential-campaign-endorses-trump-3585738).

### Harris–Trump debate — `2024-09-11T02:45:00Z`

This is the best-corrected anchor in the packet. ABC's pre-event page establishes a 9:00 p.m. EDT start, and Nielsen's contemporary report states the debate aired approximately 9:00–10:45 p.m. ET. `02:45Z` is therefore an approximate broadcast-end upper bound. The draft's claim is limited to the debate occurring; it does not use the ABC transcript page's later modification time or later-added transcript text as pre-reveal evidence. The source role split is correct: ABC schedule is primary for the scheduled event, while Nielsen and the replay are retrospective confirmation.

**Correction recommendation:** retain the current anchor and interval wording. Do not restore the old ABC `datePublished` value of `03:58Z`, and do not backdate the page's later modification time.

Sources: [ABC schedule](https://abc.com/news/6abdd5ab-5cdc-48c2-8184-8be2f1a532c1/category/1138628), [Nielsen broadcast interval](https://www.nielsen.com/news-center/2024/over-67-million-viewers-tune-in-for-abc-news-harris-trump-debate/), [ABC transcript page](https://abcnews.go.com/Politics/harris-trump-presidential-debate-transcript/story?id=113560542).

### Iowa poll — `2024-11-03T00:00:00Z`

The local CNN capture is labeled as a 19:00–20:00 EDT broadcast. It discusses the Des Moines Register poll as Harris 47%, Trump 44%, with 808 likely voters and a 3.4-point margin of error. The retained `00:00Z` cutoff is the end-of-hour upper bound, not the first article publication. Reuters corroborates the numbers and margin of error, but its displayed timezone/publication timing is not used to manufacture a UTC minute. The failed Des Moines Register retrieval is correctly excluded. The claim is date-safe and the margin-of-error caveat is carried in the study's competing explanation.

**Correction recommendation:** keep the current upper bound and explicitly retain the state-poll and delayed-window contamination caveats. Do not use the election result or the AP call in the card or its evidence.

Sources: [CNN transcript](https://transcripts.cnn.com/show/cnr/date/2024-11-02/segment/08), [Reuters reproduction](https://www.investing.com/news/world-news/harris-tops-trump-in-latest-iowa-poll-marking-turnaround-des-moines-register-survey-3698510).

## Hindsight and identity checks

- The AP election call is conclusion-only and is not referenced by any card claim.
- The ABC transcript page's later edit is retained as metadata only; no later quotation is used in the debate claim.
- The failed Des Moines Register request is not treated as evidence.
- The RFK first-party page and the Manhattan DA/court pages are not used to invent exact minute precision where only a date is available.
- The market question, YES token, resolved YES outcome, and retained Polymarket series identity match the draft and score packet.

**Recommendation:** approve the five-card evidence boundary for editorial review with the current conservative bounds. The only concrete tightening available from the retained captures is the conviction bracket's 21:10:04Z complete-result timestamp; changing it would be a measurement revision, not a schema fix. No material hindsight leak or unsupported card fact was found.
