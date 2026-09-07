# Readiness input and hash contract

`check:launch-readiness` reads the current local registry by default. It does not read an unfinished worker packet. Rehearsals can pass `--fixture path/to/input.json`; the fixture follows `readiness-input.schema.json` and must contain the exact `DailyPuzzle` and `Study` shapes used by the application.

The command accepts `--now 2026-09-06T16:00:00Z` for deterministic boundary checks. Without it, the command uses the current UTC clock. `--json` emits the complete report for another local tool; the normal output is intended for an operator.

An approval entry is valid only when it explicitly has `status: "approved"`, `approverType: "human"`, a named `approver`, a parseable `approvedAt`, the exact puzzle identity/study version/release timestamp, and a matching `contentHash`. The hash is SHA-256 over canonical JSON for:

```json
{
  "puzzle": "exact DailyPuzzle object",
  "study": "exact Study object, excluding mutable status and publishedAt"
}
```

Object keys are sorted recursively; arrays retain their order. This makes a changed headline, event list, study version, dataset identity, or scoring rule produce a different approval hash. The historical `2026-09-05-biden-dropout` edition is explicitly accepted under the legacy approval treatment because its approval predates this packet format. That exception does not approve any new candidate.

The report treats missing approval and schedule packets as missing inputs. It reports registered, released, and upcoming puzzles from the live registry; proposed schedule entries remain separate and never count toward the approved runway. The operating target is seven approved upcoming editions, a proposed target rather than current inventory. The first uncovered time is the end of the last verified window or the first unapproved/gapped release, whichever applies.
