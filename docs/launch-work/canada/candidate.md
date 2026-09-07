# Proposed Canada reserve — The Canadian comeback

**Readiness: ready-for-review. Queueable now: no.** This is a conditional reserve, not a release approval or a daily registration. All 25 frozen windows are usable under the unchanged application functions. The main editorial weakness is that three cards land inside one one-point tie group.

## Contract and ending

**Exact question:** Will the Liberal Party win the most seats in the next Canadian election?  
**Selected side / resolved outcome:** YES / YES.  
**Provider:** Polymarket; market ID `517586`.  
**Exact YES token:** `97369614101217511684993615789719226906296227283714425485701044468625942166745`.

The market asks which party wins the most House of Commons seats. It is not a majority or popular-vote contract. A tie uses the provider's alphabetical rule. The provider metadata records the contract as resolved YES and closed after the election.

The election result is reveal-only: the Liberal Party won the most seats on April 28, 2025. It is not a card and does not appear in the pre-reveal copy. See the ending field in [candidate.json](candidate.json) and the source references in [evidence-manifest.json](evidence-manifest.json).

## Why this arc

The market opened after Justin Trudeau announced his resignation, so that headline is not eligible: it predates the market and cannot supply the required 84-hour anticipation window. The chosen arc starts with the first major successor development after the opening and follows five different kinds of change:

1. A nationally recognizable outsider enters the leadership race.
2. A U.S. trade shock produces a Canadian retaliation decision.
3. The Liberal Party chooses its new leader.
4. The Governor General turns the open political story into a defined election.
5. The new government answers a concrete auto-sector tariff shock during the campaign.

The five were selected for public significance and narrative variety before the fresh window calculation. The original research had already exposed the raw history and broad daily-median suitability statistics; it had not run these five event windows. That prior exposure is disclosed rather than presented as a blinded preregistration.

The March 14 swearing-in was evaluated and excluded before scoring. It is a real, well-sourced fact, but it formalizes the March 9 leadership result and creates an overlapping full measurement span. It remains in the evidence packet as an explicit editorial decision, not as a replacement chosen after seeing prices.

## Source and timing decisions

The source captures are in [evidence/](evidence/) and their hashes, roles and limitations are in [evidence-manifest.json](evidence-manifest.json). Primary records are paired with contemporary corroboration where available. Current HTML or video-page hashes prove the bytes retrieved on September 6, 2026, not the historical immutability of an editable page.

| Card | Original evidence timing | Frozen measurement anchor | Precision decision |
|---|---|---|---|
| Carney enters race | CityNews reports the Edmonton launch at 6:10 p.m. MST on Jan. 16; AP reports the same-day announcement | `2025-01-17T01:10:00Z` | Minute-level public-time cutoff; not a claim that this is the first public access everywhere |
| Tariff retaliation | Prime Minister's official page is dated Feb. 1 and contains the evening response; AP records the U.S. order | `2025-02-02T05:00:00Z` | End of Feb. 1 in America/Toronto; conservative day anchor, no invented broadcast minute |
| Carney wins leadership | CPAC and Reuters event records are dated Mar. 9 and show the result/victory speech | `2025-03-10T04:00:00Z` | End of Mar. 9 in America/Toronto after the daylight-time change; conservative day anchor |
| Election called | Governor General's official record is dated Mar. 23; Axios reports the same-day call | `2025-03-24T04:00:00Z` | End of Mar. 23 in America/Toronto; no invented signing time |
| Auto-tariff response | Prime Minister's official release is dated Apr. 3; AP gives a contemporary 16:24:16Z report | `2025-04-03T16:24:16Z` | Minute-level contemporary publication cutoff; not a causal timestamp |

The anchor is the earliest defensible public cutoff available from the retained records, or a conservative upper bound when a source supplies only a date. Final integration still needs an independent first-public review. `occurredAt` remains unresolved in the candidate artifact when the record does not establish an exact occurrence instant.

## Frozen card decisions

### 1. Mark Carney launches his Liberal leadership campaign

This is a candidate-change story, not Trudeau's resignation. The source record places the Edmonton launch on January 16. It matters because it gives the governing party a new possible standard-bearer with a different public profile and economic message. The expected direction was positive before measurement, but other leadership candidates, tariff fears and the market's already-open state are competing explanations.

### 2. Canada announces a response to the U.S. tariff order

The Prime Minister's archived February 1 page records the U.S. tariff announcement and Canada's planned 25% response on $155 billion of U.S. goods. This is an ordinary-language crisis-response card: it could help the Liberals by making them look protective of Canadian interests, or hurt them by making economic damage more salient. The expected direction was therefore ambiguous before measurement. U.S. action, Canadian federal messaging, provincial reactions and broader risk sentiment are not separable in a causal claim.

### 3. Mark Carney wins the Liberal leadership

The March 9 leadership result is an internal party decision that removes succession uncertainty and names the leader who will face the general election. The retained CPAC and Reuters records report an 85.9% first-ballot victory. Because Carney was already the front-runner, the result may confirm rather than surprise the market. The formal March 14 swearing-in is not a second selected answer.

### 4. The Governor General dissolves Parliament and calls the election

The official Governor General record says Mark Carney advised dissolution on March 23 and that election writs were issued. This is the constitutional trigger that turns the story into a defined April 28 campaign. It was expected, so the card is not presented as an isolated causal shock; polls, campaign positioning and tariff news remain competing explanations.

### 5. Carney announces Canada's response to U.S. auto tariffs

The April 3 official release describes countermeasures for the auto sector, including 25% tariffs on non-CUSMA-compliant vehicles and supports for workers and businesses. AP contemporaneously reports that Canada would match the U.S. 25% auto tariff on vehicles. This is a concrete policy test during the campaign, distinct in sector and timing from the February trade shock, though the trade-war story is an unavoidable confound.

## Dataset and reproducibility

The retained series is the exact YES token, not an underlying stock, poll or alternative contract. The original normalized source contains 2,723 hourly observations from `2025-01-06T19:00:00Z` through `2025-04-30T05:00:00Z`, with no internal missing buckets, no rejected rows and no duplicate/revision buckets. The reproducible CSV is [canada-hourly.csv](canada-hourly.csv).

Normalization preserves the project convention: the latest Polymarket price per UTC hour is treated as a trade. No gap filling, interpolation, carried price, cross-contract splice or answer-key optimization was used. Source and output hashes are recorded in [evidence-manifest.json](evidence-manifest.json).

The event set was frozen in [selection-freeze.json](selection-freeze.json) at `2026-09-06T11:11:37-05:00`; its current SHA-256 is `ec687b3d00fecfdfa126a0c9071bbff3169ba740f4b0a7076d4b7c21318e6d02`. The anchor file was corrected before scoring so date-only records use the end of the source date in the Canadian local timezone. [measurements.json](measurements.json) was generated by the existing application functions with:

```text
node --experimental-strip-types docs/launch-work/canada/evaluate-canada.mjs
```

The script asserts the 2,723-observation, zero-gap audit and fails if any frozen event window is unusable.

## Measured responses — editor/reveal only

The primary response is the stabilized median minus the reference median. Anticipation is `[-84,-12)` hours, reference is `[-12,0)`, immediate is `[0,6)`, stabilized is `[18,36)`, and delayed is `[48,72)`.

| Card | Reference | Stabilized | Primary response | Delayed cumulative | Quality |
|---|---:|---:|---:|---:|---|
| Carney enters race | 7.25% | 7.40% | +0.150 pp | +1.400 pp | usable; not detectable vs ordinary threshold |
| Tariff retaliation | 12.90% | 13.275% | +0.375 pp | +0.050 pp | usable; not detectable |
| Carney wins leadership | 34.175% | 33.750% | −0.425 pp | +2.875 pp | usable; not detectable |
| Election called | 54.650% | 49.100% | −5.550 pp | −0.275 pp | usable; ordinary |
| Auto-tariff response | 67.500% | 71.175% | +3.675 pp | +4.775 pp | usable; ordinary |

The unchanged one-point anchor groups the cards as:

`auto-tariff-response` > `tariff-retaliation = carney-leadership-launch = carney-leadership-win` > `election-call`.

All 25 windows have 100% usable coverage, zero maximum gap buckets, and at least the required distinct updates. No pair of selected events has overlapping full measurement spans. The table is not player-facing before reveal and is not a claim that any event caused the observed change.

## Neutral player-facing copy

**Topic:** The Canadian comeback  
**Instruction:** Rank five developments from the biggest rise in the Liberal Party's chances of winning the most seats to the biggest fall.

Before reveal, show only the five factual claims and their source-backed context. Do not expose prices, window levels, measured directions, tie groups, the resolved result, retrospective reporting or answer-bearing metadata. Use the exact YES contract wording in the contract explanation, not a shortened claim that could be read as a majority or popular-vote question.

Suggested factual card labels:

- Mark Carney launches his Liberal leadership campaign.
- Canada announces a response to the U.S. tariff order.
- Mark Carney wins the Liberal leadership.
- The Governor General dissolves Parliament and calls the election.
- Carney announces Canada's response to U.S. auto tariffs.

## Open gates

- An independent editor must review this exact frozen version and record named, timestamped approval before any registration or publication.
- Review first-public access and immutable contemporaneous source captures for every card. Snapshot hashes alone do not prove historical page immutability.
- Decide whether the three-card one-point tie group meets the entertainment bar for a conditional reserve when compared with TikTok, Eagles and Trump.
- No approval, runtime registration, daily number, schedule or publication status was changed here.
