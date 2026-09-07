# NexusPoint content and release operations

This guide is the local operating procedure for repeatable content preparation and release verification. It does not add a CMS, analytics, scheduled automation, external market dependency, or deployment authorization.

## Readiness command

Run from the repository root:

```sh
npm run check:launch-readiness -- --now 2026-09-06T16:00:00Z
```

Use the explicit clock for a rehearsal at a release boundary; omit it for a live local check. Use `--json` when retaining the complete report. Use `--fixture path/to/readiness-input.json` only with a self-contained fixture following [`readiness-input.schema.json`](readiness-input.schema.json). A fixture is for rehearsal and validation, not a substitute for registering content.

The command uses the actual `validateStudy`, `validateDailyRegistry`, and `getPreRevealCard` validators. It reports:

- registered, released, and upcoming puzzles, including each release window and approval treatment;
- duplicate IDs/numbers, invalid study IDs/versions, five-card/permutation errors, and missing eligible pre-reveal claims;
- source and build artifacts for every registered study dataset plus favicon, Apple touch, and social-preview assets;
- canonical, Open Graph, and Twitter metadata against the configured custom domain in `wrangler.jsonc`;
- approval-to-content hash mismatches and missing exact human approval;
- distinct approved funnel identities against any configured minimum target (duplicate archive/launch content is counted once);
- the consecutive approved upcoming runway, exhaustion time, first uncovered time, and separate proposed count.

Missing approval or schedule input is a blocker. Historical #001 is accepted through the documented legacy exception; no new candidate receives that treatment. A successful local report does not prove a remote deployment.

## Repeatable content workflow

1. Capture source evidence with the retrieval time, URL, archive/snapshot hash, publication/update time, and a status for failed retrievals. Do not treat a retrieval hash as proof of historical availability.
2. Freeze the five-card selection with an ISO timestamp, content hash, inclusion decisions, event timing precision, and any prior exposure to measurements. Keep neutral pre-reveal copy separate from reveal-only interpretation.
3. Calculate with the existing measurement profile and `pairwise-anchor-1pt-v1`. Preserve the raw and normalized dataset identities, all quality checks, ties, and the calculation invocation. Do not interpolate, splice contracts, carry prices, or select headlines for a larger move.
4. Have an independent reviewer check source cutoffs, claims, timing, confounds, overlap, card eligibility, neutral copy, measurements, and exact artifact hashes. The reviewer records a verdict; an AI review is not a human approval.
5. Obtain a named human approval for the exact puzzle, study ID/version, release timestamp, and content hash. Store the approval entry in the input packet. A candidate may remain implemented or proposed while this gate is absent.
6. Freeze and register the immutable study version. Do not mutate a published study or overwrite a dataset in place. A changed fact, source, anchor, card, score, or study field requires a new version and a new approval decision.
7. Add an explicit schedule entry only after the exact content approval and release decision exist. Keep the proposed queue visibly separate from the live registry. Use UTC `05:00` boundaries and preserve at-most-24-hour windows; explain Chicago local-time/DST display without changing UTC timestamps.
8. Run the readiness command, focused tests, the full test-inclusive build, and the local Wrangler dry run. Record the commit/build identity and any unverified remote facts.
9. Deploy only through a separately authorized release action. This runbook does not authorize pushing, merging, remote configuration changes, or deployment.

## Amending a published error

Do not silently replace the saved answer, event set, study version, dataset bytes, puzzle ID, number, release timestamp, or completed attempt. Preserve the original record and publish an amendment record that names the error, affected version, evidence, discovery time, and user-visible consequence. Create a new immutable study version/dataset when the correction changes a source, event timing, card wording, measurement input, or answer. Recalculate from the corrected frozen inputs, retain the prior results for audit, repeat independent review, obtain fresh human approval for the corrected exact artifacts, and schedule the amended edition under a new identity when appropriate. A purely typographical correction can still require review if it changes the player-facing claim or interpretation; the reviewer should record why a full recalculation is or is not necessary.

## Release verification and rollback

Before requesting deployment, retain evidence for:

1. the source commit and build identity, including the output of `npm test`, `npm run build`, `npm run check:launch-readiness`, and `npx wrangler deploy --dry-run`;
2. the exact production HTTPS homepage and configured custom domain, with remote status marked **unverified** unless actually checked;
3. the root daily route, the exact `?daily=<id>` route for the released edition, and `/studies` plus every registered study route;
4. successful fetches for each registered dataset CSV/JSON/manifest path, the favicon assets, and `og-image-v1.png` from the built output;
5. canonical, `og:url`, `og:image`, Twitter card, image dimensions, and spoiler-free generic metadata from the built `index.html`;
6. the verified approved runway and first uncovered time. Proposed entries are not evidence of a live runway.

If a deployment must be rolled back, select a known successful Worker deployment by commit/build identity using the authorized Cloudflare release process. Verify the restored HTTPS routes, metadata, dataset fetches, and daily/archive behavior. Rollback restores code and static assets only; it does not overwrite puzzle history, saved attempts, immutable study versions, or source evidence. Do not use a rollback to erase a published answer or to make a later schedule appear approved. Remote deployment and rollback facts are **unverified** until an authorized operator records them.

## Current parallel-phase boundary

The current local registry contains the preserved September 5 archive #001 and the user-approved September 7 Biden launch #002. The configured six-distinct-edition funnel target is proposal inventory, not approved runway: the readiness command must remain blocked while only one distinct content identity is approved. TikTok, Eagles, Oscars, Bitcoin, and Canada are dated proposals through September 12; Trump is an optional September 13 buffer. The seven-edition approved-runway operating target remains proposed planning guidance, not existing inventory.
