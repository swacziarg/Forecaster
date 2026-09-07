# The Canadian comeback — funnel-expansion candidate v2

**Disposition: integration-ready conditional reserve; not registered or queued.** This packet promotes the prior Canada reserve into a complete, strict Study-compatible candidate. It preserves the frozen five, existing exact-contract dataset, anchors, event order, and scores. It replaces the unusable Axios retrieval with a legitimate AP capture and excludes the unknown-time Elections Canada retrospective from all pre-reveal claims.

## Contract and player task

The exact contract is Polymarket market `517586`: **Will the Liberal Party win the most seats in the next Canadian election?** The selected perspective is YES, meaning most House of Commons seats—not a majority and not popular vote.

Players rank these five neutral developments from the biggest rise to the biggest fall in the YES probability:

1. Mark Carney launches his Liberal leadership campaign.
2. Canada announces a response to the U.S. tariff order.
3. Mark Carney wins the Liberal leadership.
4. The Governor General dissolves Parliament and calls the election.
5. Carney announces Canada's response to U.S. auto tariffs.

Do not show probabilities, measured directions, tie groups, the resolved outcome, retrospective reporting, or answer-bearing metadata before reveal.

## Evidence and temporal decisions

The packet has two active source records per card, with one narrow exception in claim use: the April 3 PMO release is the primary factual policy record but is date-only, so the minute-level pre-reveal claim relies on AP's precise contemporary report alone. The PMO page is not used to justify availability before `2025-04-03T16:24:16Z`.

The election-call card now uses the Governor General's official March 23 record plus the AP same-day report published at `2025-03-23T12:56:48Z`. The conservative information cutoff remains `2025-03-24T04:00:00Z`, the end of March 23 in America/Toronto; AP confirms same-day availability but does not establish first public access or a safe signing minute.

The prior Axios file is a Cloudflare challenge page and is excluded. The Elections Canada report is retrospective with unknown publication time and is excluded from pre-reveal evidence. Neither source is used in the candidate's active `study.sources` or claims.

## Frozen selection and scoring

The selection version is `canada-selection-v2`. It is an evidence/schema revision of the original freeze, not a post-score card swap. The five IDs remain:

`carney-leadership-launch`, `tariff-retaliation`, `carney-leadership-win`, `election-call`, `auto-tariff-response`.

The exact YES series contains 2,723 hourly observations from `2025-01-06T19:00:00Z` through `2025-04-30T05:00:00Z`, with zero internal missing buckets. The existing application functions and unchanged `months-hourly-v1` profile produce 25 usable windows, no selected-event overlap, and these responses:

| Card | Stabilized minus reference | Delayed cumulative | Quality |
| --- | ---: | ---: | --- |
| Carney enters race | +0.150 pp | +1.400 pp | usable; not detectable |
| Tariff retaliation | +0.375 pp | +0.050 pp | usable; not detectable |
| Carney wins leadership | −0.425 pp | +2.875 pp | usable; not detectable |
| Election called | −5.550 pp | −0.275 pp | usable; ordinary |
| Auto-tariff response | +3.675 pp | +4.775 pp | usable; ordinary |

The ranking is `auto-tariff-response` > (`tariff-retaliation`, `carney-leadership-launch`, `carney-leadership-win`) > `election-call`. There are seven strictly comparable pairs and three tied pairs under the one-percentage-point threshold. The middle tie is a supported feature of the unchanged data, not a data failure. It leaves three rank levels, but seven of ten pairs remain strictly ordered and the narrative has five distinct developments.

## Ending and approval

Reveal only: the Liberal Party won the most seats in the April 28, 2025 federal election, and the provider resolved the YES contract. The ending is sourced separately from the retained market event and catalogue records and is not a scored card.

The candidate is ready for independent editorial review, not human-approved publication. The lead may place it in the September 10–13 proposal range after comparing the other candidates. No daily number, runtime registration, schedule entry, deployment, or external announcement changed in this worker pass.

Remaining decisions are: approval of this exact v2 content/source hash; acceptance of the three-rank-level tie as entertaining for a reserve; and final date/order selection by the launch lead. Current-byte snapshots do not establish historical immutability or universal first-public access, and that limitation must remain visible in review.
