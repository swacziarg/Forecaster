# Playable-drafts lead report

Lead task: `01a07777-1db5-7c70-9773-ddaf12298f46`  
Completed: September 7, 2026 at 05:40 UTC  
Verdict: local draft preparation complete; publication remains blocked on exact human approval.

## Outcome

The four current worker handoffs were audited and integrated. The registry now contains eleven local study versions: two published versions, six established editorial-review versions, and three newly integrated strict v2/five-card drafts. The five-topic core is privately playable through the explicit URLs in [funnel.md](funnel.md). The daily registry remains unchanged at Biden #001 and the user-approved Biden #002; no proposal was promoted into the official daily sequence.

## Worker handoffs

| Worker | Task | Receipt | Lead audit |
| --- | --- | --- | --- |
| Oscars | `01a07776-b625-7fc3-ae9b-b76a9e6b60b8` | Complete; strict v2 module/test; 25/25 usable windows | Registered without changing Oscars v1; unique slug `oscars-best-picture-2026-v2`; ending remains reveal-only |
| Bitcoin | `01a07777-0cfb-70b0-93f4-20087e2521d6` | Complete; strict v2 module/test; 25/25 usable windows | Registered without changing eight-event Bitcoin v1; overlap and partial lifetime are disclosed |
| Canada | `01a07776-ca0c-75c1-8e08-0d046c9ff706` | Complete; strict v2 module/test/public bundle; 25/25 usable windows | Registered exact YES contract and packaged hashes; supported three-card tie preserved |
| Trump | `01a07776-a544-7d53-89fa-4c56b8a878ca` | Documentation-only score/rank packet; optional buffer | Kept outside runtime and six-edition core as required; no unreviewed score was invented |

The worker-owned receipts and reports remain the source of truth for their artifact hashes. The lead independently reran the focused tests and the full project suite after integration.

## Shared implementation

- `src/data/studies.ts` registers `oscarsFiveCard2026Study`, `bitcoinFiveCardStudy`, and `canada2025Study` as `editorial-review` drafts.
- `src/domain/playablePreview.ts` defines the five-topic allowlist, `__preview/<slug>` resolver, and synthetic isolated puzzle identity.
- `src/App.tsx` loads the preview only when `import.meta.env.DEV` is true. Draft study routes remain shielded by the existing public `editorial-review` state, and the archive index remains published-only.
- `src/DailyGame.tsx` labels preview mode, uses archive semantics, shows the no-streak notice, isolates storage by preview ID, and returns preview results to the exact private path when shared.
- `src/domain/dailyGame.ts` accepts an optional share path without changing the official daily-link format.
- `src/data/integration.test.ts`, `src/domain/eventStudy.test.ts`, `src/domain/playablePreview.test.ts`, and `package.json` cover registration, bundle digests, strict validation, overlap/tie behavior, preview routing, and focused worker suites.

The registered v2 studies and public artifacts passed the existing local adapter digest check. Bitcoin keeps the documented Trump/MicroStrategy full-window overlap; Canada keeps the measured three-card tie; Oscars keeps the conservative source cutoffs and reveal-only ceremony result.

## Verification

- `npm test` — passed, including event-study, daily-game, five-study integration, all three worker-focused draft suites, routing, preview routing, and readiness tests.
- `npx tsc -b --pretty false` — passed.
- `npm run build` — passed.
- `git diff --check` — passed.
- `npm run check:launch-readiness -- --now 2026-09-07T05:40:00Z` — intentionally blocked only by the one approved distinct edition versus the six-edition funnel target; daily/study validators and all 40 required source/build artifacts passed.
- Local browser QA covered all five preview paths, the real five-card pre-reveal/reveal flow, source details, tie-aware results, isolated practice storage, preview share paths, the existing Biden archive, unknown/future daily links, published-only archive behavior, and draft shielding. The current preview pass verified the desktop layout; the shared daily-game mobile matrix from the preceding verification covered 320–430px widths, and this pass added only responsive-safe labels/banners. The in-app browser did not expose a viewport-override control for a second mobile capture. Browser console warning/error logs were empty.
- Production build QA confirmed that draft study routes stay shielded, `/?preview=...` does not activate a preview, and `__preview/<slug>` is not active in the production build.

## Remaining decision

The next authorized step is human editorial approval of an exact study/content identity plus release time for each proposed entry. After approval, the runtime daily registry, approval packet, readiness report, and any deployment must be updated in a separate approval-backed pass. No commit, push, deployment, publication, or external announcement was performed.
