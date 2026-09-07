# The comeback nobody could call

Status: **hold for independent review; not queueable**  
Prepared: 2026-09-06  
Proposed study: `trump-comeback-2024-v1`, version 1  
Provider: Polymarket, market `253591`  
Selected contract perspective: exact YES token retained in `candidate.json`

This is a strict five-card handoff, not a published study and not a scheduling decision. The five selected fact clusters and the initial card order are frozen from the research brief. This packet does not assert an event-response ranking or publish probability/score values; it records the evidence, timing, dataset identity, and window-quality audit for independent review.

## Frozen selection

The fixed initial card order supplied by the brief is:

`rfk-endorsement`, `conviction`, `iowa-poll`, `butler`, `harris-debate`

The five event IDs are unchanged: `conviction`, `butler`, `rfk-endorsement`, `harris-debate`, and `iowa-poll`. Selection freeze: `frozen-selection-v1.json`, SHA-256 `79ca8b2e025f15e5fe1ff9040ed1c060d874bf188d2b239f39fc647c0ad33593`. Anchor freeze: `anchors-v2.json`, SHA-256 `168609f145c5a992e911c5479b0f2c3fe9e331f72420fdb1f5dd5f86febaffa3`.

## Evidence and temporal checks

### `conviction`

Neutral pre-reveal copy: “A New York jury finds Donald Trump guilty on 34 felony counts.”

The historical occurrence date is May 30, 2024. The retained public-information cutoff is `2024-05-30T21:15:07Z`, the end of the next CNN transcript bracket reporting all 34 verdicts. This is a conservative upper bound, not the exact verdict instant. The New York Courts case page lists the May 30 verdict sheet, and the Manhattan District Attorney’s contemporaneous page records the 34-count conviction. The local CNN transcript is the captured contemporary corroboration. Jury deliberation and public expectation preceded the cutoff; that anticipation remains a disclosed confound.

### `butler`

Neutral pre-reveal copy: “A gunman shoots Trump at a Pennsylvania rally; he survives.”

The historical occurrence date is July 13, 2024. The retained information cutoff is `2024-07-14T00:00:00Z`, the end of the 19:00–20:00 EDT CNN live broadcast carrying the survival report and official response. It is a broadcast bracket, not the instant of the shooting or the earliest public report. The FBI’s Butler investigation page confirms the July 13 incident and the local CNN transcript preserves contemporary coverage. The Biden #001 study already contains a Butler-shooting card: this different contract perspective does not remove answer-recall risk, so an independent editor must review the repetition.

### `rfk-endorsement`

Neutral pre-reveal copy: “Robert F. Kennedy Jr. suspends his campaign and says he will support Trump.”

The historical occurrence and public announcement date is August 23, 2024. The retained cutoff is `2024-08-23T19:30:00Z`, the end of the 15:00–15:30 EDT CNN broadcast carrying Kennedy’s own speech. That is an upper bound for public availability, not a claim of the first public instant. Kennedy’s own dated address is the primary record; the local CNN transcript is contemporary corroboration. The decision was discussed before the speech, so anticipation and the Democratic convention’s end remain confounds. The observed response, including any negative movement in the retained series, must be preserved rather than edited to match the headline’s apparent direction.

### `harris-debate`

Neutral pre-reveal copy: “Harris and Trump meet for their first presidential debate.”

The occurrence date is September 10, 2024. The captured ABC page records `datePublished: 2024-09-11T03:58:00Z` and `dateModified: 2024-09-11T16:24:39Z`. The original-publication timestamp is retained as a page fact; the later modification is not backdated. The current evidence establishes that the debate took place and that the transcript page was first published at 03:58 UTC, but it does not establish the debate’s first-broadcast end or the earliest public availability of the transcript. Therefore the first-broadcast cutoff remains unresolved. The live debate itself, post-debate commentary, and endorsements may all enter the response windows.

### `iowa-poll`

Neutral pre-reveal copy: “The final Iowa Poll reports Harris ahead of Trump, 47% to 44%.”

The poll announcement date is November 2, 2024. The retained cutoff is `2024-11-03T00:00:00Z`, the end of the 19:00–20:00 EDT CNN broadcast discussing the result. The poll was available earlier; the live-program ending is an upper bound. The CNN transcript reports the 47–44 finding and the published margin of error is part of the editorial caveat. The delayed measurement window reaches November 5 election-night information, so it must be disclosed and must not be presented as a clean poll-only response.

## Dataset and unchanged measurement contract

The candidate uses the newly researched single-contract series, not the legacy election fixture:

- 4,549 retained hourly observations; 4,550 raw rows; one revision/duplicate bucket; three missing hourly buckets; no rejected rows.
- Coverage: `2024-05-01T00:00:00Z` through `2024-11-06T15:00:00Z`.
- CSV SHA-256: `7756111859cbca9f2185795608029323fb21e9505f0314d4700cf7d8b9cc579d`.
- Normalized-series SHA-256: `7b75c8dd3b85c151c76bded476ae6e32fa3084781c77cfa176f632e527bdd380`.
- Profile: `months-hourly-v1`, UTC hourly buckets, anticipation `[-84,-12)`, reference `[-12,0)`, immediate `[0,6)`, stabilized `[18,36)`, delayed `[48,72)`; minimum coverage 60%, maximum gap share 50%, minimum three distinct updates, maximum median spread 20 pp, tie threshold 1 pp.
- The unchanged engine reports all five cards as window-quality `usable`; no pair of full event windows overlaps. The Iowa delayed window contains 23 of 24 valid buckets because the preserved dataset has a missing bucket on November 5.

The legacy files remain untouched: `src/data/election2024.ts` SHA-256 `235d331a63ffa88c5bf03dda8337c57f76139d42888ebfa61e609fefacbd16e6`, and `src/data/bidenDropout2024.ts` SHA-256 `72ba34940055d6685134877022cbb63f92421aa25467a1643bb18793dbebd69b`.

## Player copy and reveal separation

Before reveal, show only the five neutral fact cards above, the date range, and the fixed starting order. Do not show the market series, event-window outputs, the election result, or any answer-bearing metadata.

After reveal, explanations may describe each event’s historical context, anticipation, overlap, competing news, and the Iowa poll’s delayed election-night window. They must preserve surprising or negative observations and must not imply a causal claim that the market response was caused solely by one headline.

Reveal-only ending: AP’s documented race call at 05:34 EST on November 6, 2024 is the election-result conclusion. The provider’s settlement rule requires the named resolution sources; the election result and any contract resolution belong only in the ending.

## Editorial disposition

Recommend spacing this edition after TikTok and Eagles to add variety and to avoid immediate repetition of the Butler event. Do not silently replace the frozen Butler card. Independent editorial review is required for the repeated event, the five-card subset, the source cutoffs, and the exact strict-study version. No release date, publication status, registry entry, or approval is assigned here.

## Remaining blockers

1. Establish a defensible first-public/broadcast cutoff for the ABC debate, or explicitly approve the current page-publication cutoff as a conservative bracket with the limitation disclosed.
2. Complete source-level temporal review for the four broadcast-bracket anchors; existing cutoffs are upper bounds, not earliest-public claims.
3. Obtain independent editorial review of the repeated Butler card after Biden #001.
4. A lead/editor must decide how to handle the user-facing event ordering and any event-window calculations under the product’s rules. This worker handoff intentionally leaves those rankings/scores unasserted.
