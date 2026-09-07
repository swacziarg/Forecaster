# Human editorial approval packet

Review date: September 7, 2026 at 05:40 UTC  
Reviewer: AI launch lead, task `01a07777-1db5-7c70-9773-ddaf12298f46`

This is an exact decision aid, not human sign-off, publication authorization, schedule activation, deployment authorization, or a claim that the full funnel is ready for release.

## Decision summary

The proposed core is six distinct editions: Biden #002, TikTok #003, Eagles #004, Oscars #005, Bitcoin #006, and Canada #007. Trump #008 is an optional buffer. All current-pass worker receipts are complete and every recorded artifact hash matches. The five non-Biden core topics are registered as editorial-review drafts and have local-only previews; only Biden has actual approval, and every other row remains proposal-only.

| Candidate | Study/version | Current verdict | Implementation | Human decision required |
| --- | --- | --- | --- | --- |
| Biden | `biden-dropout-2024-v1` / 1 | Approved unchanged | Registered #002; Sep 5 #001 archive preserved | No further content approval; deployment is separate |
| TikTok | `tiktok-banned-before-may-2025-v1` / 1 | Ready for approval | Registered editorial-review draft | Accept public-by timing, exact five cards/hash, Sep 8 date |
| Eagles | `eagles-super-bowl-lix-five-v1` / 1 | Ready for approval | Registered editorial-review draft | Accept archived-page bounds, strict order, exact five cards/hash, Sep 9 date |
| Oscars | `oscars-best-picture-2026-v2` / 2 | Ready for approval | Registered strict editorial-review draft; private preview `/__preview/oscars-best-picture-2026-v2` | Accept timing bounds, Critics Choice/Globes boundary, precursor distinctness, and Sep 10 date |
| Bitcoin | `bitcoin-100k-2024-v2` / 2 | Ready after identity reconciliation | Registered strict five-card editorial-review draft; private preview `/__preview/bitcoin-100k-2024-five-card`; existing v1 is preserved eight-event study | Review `fullMarketLifetime` and day-level anchors; accept documented overlap and Sep 11 date |
| Canada | `canada-liberal-comeback-v2` / 2 | Conditional reserve | Registered strict editorial-review draft with packaged public bundle; private preview `/__preview/canada-liberal-comeback` | Accept AP replacement, conservative timing, three-card tie, and Sep 12 date |
| Trump | `trump-comeback-2024-v1` / 1 | Changes required | Candidate packet only; not registered | Resolve timing/capture gaps, score packet, and repeated Butler decision; optional Sep 13 buffer |

## Exact approval-backed entry

The user’s September 6 instruction approves the unchanged Biden content for September 7. The exact record is `docs/launch-work/schedule/approvals.json`:

- Puzzle: `2026-09-07-biden-dropout`, #002
- Study: `biden-dropout-2024-v1`, version 1
- Release: `2026-09-07T05:00:00Z`
- Content hash: `c2d729061bf06d52d97dba11169a3e8297e6cae62b13c1615ed57a8a96333df6`
- Approver record: Project owner (user in task `01a07753-5ef2-7321-a64c-60818d9de4eb`)
- Approval time: `2026-09-06T20:14:16.827Z`

This approval is not generalized to another study, another card set, a later date, or deployment.

## Candidate evidence packets

### TikTok — Sep 8 proposal

Finish-pass v4 is integrated in `src/data/tiktok2025.ts` (SHA-256 `aad72d4ed0d881a21dac5953311b4b4cb46949a01656222635567293781dfc8f`). The packet retains 3,023 observations, 25/25 usable windows, no full-window overlaps, and the tie groups `supreme-argument = appeal-lost > supreme-review > trump-pause > trump-elected`. The exact candidate and source addendum are under `docs/launch-work/finish-pass/tiktok/`. The remaining decision is whether conservative AP/CNN public-by bounds and the exact five-card content are acceptable.

### Eagles — Sep 9 proposal

Finish-pass v2 is integrated in `src/data/eaglesFiveCard2025.ts` (SHA-256 `5bbbd96b8dc9fcfe9217474641469a5ff4a50c39ee728f9a372c42c1ec902a1d`). The packet retains 5,167 observations, 25/25 usable windows, no full-window overlaps, and strict order `nfc-title > snow-playoff > barkley-record > falcons-collapse > hurts-concussion`. The archived-page times are conservative public-by bounds, not exact first-public instants. The remaining decision is the exact wording/source semantics, combined Hurts card, hash, and date.

### Oscars — Sep 10 proposal

Current packet: [candidate.json](../funnel-expansion/oscars/candidate.json), [report.md](../funnel-expansion/oscars/report.md), and [selection-freeze-v2.json](../funnel-expansion/oscars/selection-freeze-v2.json). Receipt hash audit: 17/17 matched. Replay has 4,168 observations, 25/25 usable windows, two publishers per card, and 7/10 pairwise agreement. Human review must decide the conservative source bounds, the 1-point Critics Choice/Golden Globes boundary, and whether adjacent televised precursors are distinct enough. The exact strict v2 module is registered for local review at [oscarsFiveCard2026.ts](../../src/data/oscarsFiveCard2026.ts), while the ending remains reveal-only.

### Bitcoin — Sep 11 proposal

Current packet: [candidate.json](../funnel-expansion/bitcoin/candidate.json), [report.md](../funnel-expansion/bitcoin/report.md), and [selection-freeze.json](../funnel-expansion/bitcoin/selection-freeze.json). Receipt hash audit: 13/13 matched. The five-card freeze uses exact Polymarket contract prices, 6,609 observations, 25/25 usable windows, and 6/8 comparable agreement; the threshold crossing remains reveal-only. The existing `bitcoin-100k-2024-v1` eight-event study is preserved, while the immutable v2 module is registered for local review at [bitcoinFiveCard2024.ts](../../src/data/bitcoinFiveCard2024.ts). Human review should confirm the recorded `fullMarketLifetime` boundary and three day-level anchors; the Trump/MicroStrategy overlap is disclosed rather than hidden.

### Canada — Sep 12 proposal

Current packet: [candidate.json](../funnel-expansion/canada/candidate.json), [report.md](../funnel-expansion/canada/report.md), and [selection-freeze.json](../funnel-expansion/canada/selection-freeze.json). Receipt hash audit: 9/9 matched. Replay has 2,723 observations, 25/25 usable windows, seven comparable pairs, and three rank levels including a reproducible three-card tie. The failed Axios challenge is replaced by the AP same-day capture; unknown-time Elections Canada material is excluded from strict pre-reveal claims. The exact strict v2 module and public bundle are ready for review; human review must accept the tie and conservative timing.

### Trump — Sep 13 optional buffer

Current packet: [candidate.json](../funnel-expansion/trump/candidate.json), [report.md](../funnel-expansion/trump/report.md), and [anchor-correction-v3.json](../funnel-expansion/trump/anchor-correction-v3.json). Receipt hash audit: 6/6 matched. The corrected debate bound and five usable windows are documented, but the packet intentionally assigns no response scores/ranks; upper-bound timing, missing primary captures, and the repeated Butler event after Biden remain editorial gates. It is not part of the six-edition core.

## Human sign-off fields

Complete these fields only for an exact approved study/content hash and release timestamp. No fields below are currently signed except the separate Biden record above.

| Candidate | Human approver | Approval time (UTC) | Exact content/runtime hash | Release time | Decision |
| --- | --- | --- | --- | --- | --- |
| TikTok | — | — | — | `2026-09-08T05:00:00Z` | Pending |
| Eagles | — | — | — | `2026-09-09T05:00:00Z` | Pending |
| Oscars | — | — | — | `2026-09-10T05:00:00Z` | Pending |
| Bitcoin | — | — | — | `2026-09-11T05:00:00Z` | Pending |
| Canada | — | — | — | `2026-09-12T05:00:00Z` | Pending |
| Trump buffer | — | — | — | `2026-09-13T05:00:00Z` | Pending / not core |

## Approval and queue rules

The dated proposal is in [proposed-queue.json](../schedule/proposed-queue.json) and the readable schedule is in [schedule.md](../schedule/schedule.md). Proposed entries are not in the daily registry, do not open from the root, and do not count as approved runway. Their draft study modules are registered only for the guarded local preview path, and the public archive continues to filter to `published` studies. The readiness checker now also counts distinct approved content identities, so the two Biden puzzle identities cannot masquerade as two editions and a Biden-only approval cannot make the six-edition funnel report ready.

If a human approves a candidate after its proposed boundary moves, refresh the date and exact hash, record a new approval entry, and rerun the full checks before changing runtime status or the registry. No deployment, push, merge, remote configuration change, or external announcement was performed.
