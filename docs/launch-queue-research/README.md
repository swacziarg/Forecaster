# Launch queue research

Start with the [research report](research-report.md). The recommendation is TikTok for #002, followed by Eagles and Trump after their evidence review. Mamdani is an editorial hold; Anora is data-blocked. No edition was queued or published.

- [Candidate audit](candidate-audit.md): twelve distinct storylines, fourteen separate contract series including alternatives.
- [#002 TikTok brief](briefs/002-tiktok.md)
- [#003 Eagles brief](briefs/003-eagles.md)
- [#004 Trump brief](briefs/004-trump.md)
- [#005 Mamdani hold brief](briefs/005-nyc.md)
- [#006 Anora blocked brief](briefs/006-anora-kalshi.md)
- [Frozen selection](frozen-selection-v1.json), [final pre-scoring anchors](anchors-v2.json), [measurements](measurements-v1.json), [validation](validation.json).

Each brief has a matching JSON handoff; research-only hourly CSVs are in `datasets/`. Raw provider responses, source snapshots and per-series gap audits are in `evidence/`. Request ledgers and receipts preserve URLs, parameters, retrieval times and hashes, including failed or empty requests. A failed request is not represented as a captured source.

The handoffs identify unresolved source/occurrence fields rather than inventing values. They are not five approved Study objects. Read each readiness section before integration.

## Reproducibility

From the repository root with Node 24 or another runtime supporting TypeScript type stripping:

```sh
node docs/launch-queue-research/verify_research.mjs
```

This checks the retained hashes, five-card selections, CSV compatibility and exact replay against the unchanged application measurement functions. It writes only this directory's `validation.json`. The check does not confer editorial approval.

`audit_history.py` documents normalization from retained provider responses. `evaluate.mjs` documents the original measurement run. `prepare_briefs.py` and `prepare_report.py` build the handoff documents. Running those builders overwrites generated research outputs in this directory, so preserve a version before incorporating new evidence. The frozen selection and anchor files are never rewritten by the builders.

`retrieve.py` performs public GETs for a named request ledger and writes only local research evidence/receipts. Redownloading an editable source may return different bytes; retain the current evidence before refreshing it. No credentials or trading endpoints are used.

The original broad screen uses a mechanical last-three-days exclusion. The report and briefs use the stricter [pre-ending swing calculation](pre-ending-swings.json), which excludes resolving announcements and results. Never use partial Anora scenario differences as a publishable answer key.

## Scope

Only `docs/launch-queue-research/` was written by this research. Application code, publication statuses, the daily registry and deployments were not changed. Other work observed outside this directory was left untouched.
