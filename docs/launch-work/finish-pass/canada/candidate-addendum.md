# Canada finish-pass addendum — The Canadian comeback

**Disposition: conditional-reserve hold.** The narrow evidence defects are remediated, but the Canada packet should remain a reserve rather than be promoted. The finish pass does not change the frozen five, event order, information anchors, measurements, tie groups, runtime status, or schedule.

## Evidence remediation

- The Axios capture was a Cloudflare `Just a moment...` challenge page, not an article. It is explicitly excluded from the active evidence set.
- The unknown-time Elections Canada retrospective is also excluded from active evidence. It remains only as an auditable prior receipt and is not a pre-reveal source.
- The Governor General's official dissolution record remains the primary source.
- A current-byte capture of the Associated Press report [Canada's prime minister and his opponent kick off election saying Trump must respect sovereignty](https://apnews.com/article/canada-election-prime-minister-mark-carney-trump-dd083f4f1cf9622742703eee5be6721a) is the replacement same-day corroboration. Its hash and capture receipt are in [evidence-manifest-addendum.json](evidence-manifest-addendum.json).

The AP page confirms the March 23 election call and the April 28 campaign, but its current page metadata does not prove the first public access time or an exact event minute. The conservative anchor therefore remains `2025-03-24T04:00:00Z`, the end of March 23 in America/Toronto. No score was recomputed from a newly tightened timestamp.

## Three-card tie assessment

The unchanged primary responses are `+0.375 pp`, `+0.150 pp`, and `−0.425 pp`, a `0.800 pp` spread inside the one-point tie threshold. The group is reproducible from the frozen dataset and scoring functions, and it is not caused by the removed Axios or Elections Canada materials. It produces three rank levels across five cards. That is honest and playable as a conditional reserve, but not differentiated enough to outrank the primary candidates.

## Handoff decision

Keep Canada as a **conditional reserve hold** pending the launch lead/editorial decision on whether the three-card tie meets the entertainment bar. This is not a blocker for finishing the primary two editions. No publication, registration, daily number, schedule, deployment, or approval state changed in this pass.
