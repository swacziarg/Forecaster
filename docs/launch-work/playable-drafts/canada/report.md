# Canada playable draft handoff

The Canada reserve is now a local playable draft, ready for lead registration and private preview. This worker did not edit shared registries, UI, domain modules, schedules, or deployment configuration.

## Study identity

- Export: `canada2025Study` from [src/data/canada2025.ts](/Users/simonwacziarg/Documents/ChatGPT/Forecast/src/data/canada2025.ts)
- ID: `canada-liberal-comeback-v2`
- Version: `2`
- Slug: `canada-liberal-comeback`
- Status: `editorial-review`
- Market: Polymarket `517586`, exact YES token `97369614101217511684993615789719226906296227283714425485701044468625942166745`

## Owned deliverables

- Module: `src/data/canada2025.ts`
- Focused test: `src/data/canada2025.test.ts`
- Public bundle: `public/data/canada-liberal-comeback-v2/`
- Bundle files: normalized CSV, assembled raw history, raw market metadata, manifest, and README
- Evidence/candidate packet: `docs/launch-work/funnel-expansion/canada/`

## Checks and results

Run directly with the project’s type-stripping convention:

```text
node --experimental-strip-types src/data/canada2025.test.ts
```

Result: `Canada playable draft tests passed`.

The focused test verifies strict `Study` validation, exact market/side identity, CSV/raw/metadata hashes, 2,723 observations, 25 usable windows, zero selected-event overlaps, the supported three-card tie, five eligible pre-reveal cards, reveal-only ending exclusion, and rejection of a post-cutoff source.

The public bundle manifest hashes are:

- normalized CSV: `af754817f1f07f5b6eb71a0658a40faeb9f665398a7b660eb579d05f024ae117`
- raw-history assembly: `b21451d3a9456db98caf0043985f09f447345bc23e09fdeb6c663459b9f24f4d`
- market metadata: `b7282159bec1cb934c8a3f6d331454ae276a6ef21283fa2d1cc360461210e03e`

The retained dataset is explicitly `fullMarketLifetime: false`: it covers `2025-01-06T19:00:00Z` through `2025-04-30T05:00:00Z`, with no internal missing buckets. The bundle does not use spot prices or another contract.

## Source and cutoff corrections

- Election call: Axios is excluded because the captured file is a Cloudflare challenge. The eligible corroboration is the AP same-day capture, published `2025-03-23T12:56:48Z`; the conservative information cutoff remains `2025-03-24T04:00:00Z`.
- Elections Canada retrospective: excluded from active sources and all pre-reveal claims because publication time is unknown.
- Auto-tariff response: the PMO release remains the primary factual record but is date-only. The minute-level pre-reveal claim cites AP only at `2025-04-03T16:24:16Z`; no date-only page is treated as available at midnight.
- The other date-only sources use end-of-day local cutoffs where their date precision supports the retained anchor. No anchor was moved to improve a score.

## Game behavior

Neutral pre-reveal card copy:

1. Mark Carney launches his Liberal leadership campaign.
2. Canada announces a response to the U.S. tariff order.
3. Mark Carney wins the Liberal leadership.
4. The Governor General dissolves Parliament and calls the election.
5. Carney announces Canada’s response to U.S. auto tariffs.

The existing measurement functions produce all 25 usable windows and no full-window overlaps. The ranking is `auto-tariff-response` > (`tariff-retaliation`, `carney-leadership-launch`, `carney-leadership-win`) > `election-call`. The middle three-card tie is supported by the data: three tied pairs, seven strict comparable pairs, and three rank levels. It is preserved rather than tuned away.

Proposed initial order for lead integration, carried from the frozen candidate packet:

`election-call`, `carney-leadership-win`, `tariff-retaliation`, `auto-tariff-response`, `carney-leadership-launch`.

The resolved election result is a sourced reveal-only conclusion and is not a sixth event.

## Remaining editorial decisions

- Lead registration and private preview integration.
- Independent editorial approval of this exact v2 content and source hashes.
- Whether the three-rank-level result is sufficiently clear for the September 12 proposal slot.
- Final approval and publication remain separate from this locally playable draft; no schedule, runtime, or deployment state was changed here.
