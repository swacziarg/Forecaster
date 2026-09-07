# Local playable-draft funnel

Lead integration completed September 7, 2026 at 05:40 UTC. This packet describes local preparation only. The daily registry still contains Biden #001 and #002; all later dates remain proposals pending exact human approval.

| Proposal | Study/version | Local implementation | Private development URL | Evidence state | Approval |
| --- | --- | --- | --- | --- | --- |
| #003 · Sep 8 | `tiktok-banned-before-may-2025-v1` / 1 | Registered `editorial-review` draft; existing finish-pass module/data/tests | `http://127.0.0.1:5178/__preview/tiktok-banned-before-may-2025` | 3,023 observations; 25/25 usable windows; no full-window overlaps | Pending human approval |
| #004 · Sep 9 | `eagles-super-bowl-lix-five-v1` / 1 | Registered `editorial-review` draft; existing finish-pass module/data/tests | `http://127.0.0.1:5178/__preview/eagles-stop-threepeat` | 5,167 observations; 25/25 usable windows; no full-window overlaps | Pending human approval |
| #005 · Sep 10 | `oscars-best-picture-2026-v2` / 2 | Registered strict `editorial-review` draft; fresh five-card module/test; existing dataset reused byte-for-byte | `http://127.0.0.1:5178/__preview/oscars-best-picture-2026-v2` | 4,168 observations; 25/25 usable windows; 7/10 initial-order agreement; ending reveal-only | Pending human approval |
| #006 · Sep 11 | `bitcoin-100k-2024-v2` / 2 | Registered strict five-card `editorial-review` draft/test; v1 eight-event study preserved | `http://127.0.0.1:5178/__preview/bitcoin-100k-2024-five-card` | 6,609 observations; 25/25 usable windows; 6/8 agreement; Trump/MicroStrategy overlap disclosed | Pending human approval |
| #007 · Sep 12 | `canada-liberal-comeback-v2` / 2 | Registered strict `editorial-review` draft/test with packaged public bundle | `http://127.0.0.1:5178/__preview/canada-liberal-comeback` | 2,723 observations; 25/25 usable windows; seven comparable pairs; supported three-card tie | Pending human approval |
| #008 · Sep 13 buffer | `trump-comeback-2024-v1` / 1 | Documentation-only score/rank packet; no runtime registration | — | Five usable windows; corrected debate bound; repeated Butler and remaining source decisions open | Pending / optional buffer |

## Preview contract

The five core preview paths are allowlisted in `src/domain/playablePreview.ts` and enabled only when Vite exposes `import.meta.env.DEV`. The route is path-based and explicit; a query parameter such as `/?preview=...` is ignored. Production builds therefore cannot activate a draft by adding a query string or by visiting the private path.

Each preview uses the real five-card `DailyGame` component, the exact local dataset adapter, pre-reveal source filtering, the same tie-aware scorer, reveal-only ending, result/share UI, and a synthetic puzzle ID beginning `__private-preview.`. The preview passes an empty official puzzle registry and archive mode, so saved practice attempts are isolated from daily attempts, stats, and streaks. The share path points back to the same private preview URL and contains no answer or movement details.

## Editorial gates still open

- TikTok and Eagles need exact human approval of their already integrated finish-pass identities, source timing, wording, hashes, and proposed dates.
- Oscars needs a decision on conservative source-availability bounds, the Critics Choice/Golden Globes boundary, and precursor distinctness.
- Bitcoin needs independent confirmation of the `fullMarketLifetime` boundary and day-level anchors; the v2 identity and overlap disclosure are already represented locally.
- Canada needs acceptance of the AP replacement, conservative timing, and the reproducible three-card tie.
- Trump remains outside the six-edition core until its remaining timing, source, and repeated-Butler decisions are resolved.

No draft was published, no later daily entry was added, and no deployment or external announcement was performed.
