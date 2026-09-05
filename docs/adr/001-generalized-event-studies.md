# ADR 001: Generalized, auditable EventLens studies

Status: accepted, 2026-09-03

## Decision

EventLens publishes one selected contract and one fixed measurement profile per study. New studies must contain five to ten editorially approved events; the portfolio does not pad a study to ten. The existing `election-2024-v1` study remains a documented legacy calculation exception so migration does not silently rewrite the original work.

Published studies run only from versioned local market snapshots. Provider APIs are ingestion tools, not runtime dependencies. A study revision freezes its market and contract identity, normalized dataset and hashes, events, sources, measurement profile, presentation terminology and calculated behavior.

Editorial event definitions remain separate from calculated outputs. Claims are individually timestamped and classified as pre-reveal or retrospective. Validation rejects a pre-reveal claim learned after the event information cutoff or supported only by a later source.

The interface applies a hindsight firewall: the graph, response markers, market link, resolution, endpoints, retrospective interpretation and calculations remain sealed until the participant locks a ranking. A revealed ranking is immutable; reset begins a fresh attempt.

The primary comparison is signed short-term percentage-point response. The app groups responses within the profile’s declared threshold, excludes market ties from pairwise agreement, and reports failed windows as indeterminate. It does not present a point-valued expert attribution. The optional sensitivity control starts at zero and is explicitly hypothetical.

## Consequences

The Oscars, Fed, Eagles, and Bitcoin markets exercise non-election labels, five- and eight-event rendering, trade and quote marks, quality diagnostics, gaps, overlap warnings, and complete or explicitly partial market-lifetime snapshots. The election study continues to reproduce every original 12h/0–6h/18–36h/48–72h median exactly while the shared UI applies the pre-reveal firewall consistently.

Event selection, clustering, mechanisms, source sufficiency, expected direction and publication remain human editorial decisions. Import, normalization, checksums, window math, gap/duplicate detection, overlap detection and cutoff validation are safe to automate.
