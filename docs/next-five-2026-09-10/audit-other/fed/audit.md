# Fed five-card independent source and timing audit

Audit date: 2026-09-10. Scope: `docs/next-five-2026-09-10/economy-culture/study-draft.json`. This audit does not change the Study, runtime, or retained market data.

## Finding

All five factual claims are supported by the cited primary issuer pages, and all five public cutoffs are independently recoverable. Four anchors are BLS releases with explicit 8:30 a.m. Eastern embargo times. Powell's Jackson Hole page has only a date and a current “Last Update” label, so the exact timing must come from the Federal Reserve's release-on-delivery PDF: 10:00 a.m. EDT, or 14:00 UTC. The draft's `2024-08-23T14:00:00Z` value is therefore supported.

The one material data-timing caveat is the market record: the retained exact-token series includes observations from July 25, while the provider metadata reports a start date of August 2 at 20:43:54.565 UTC. The August 2 jobs release occurred before that metadata start. The source is still historically valid, but its event window depends on the retained pre-start observations and must be disclosed as such. Do not describe the retained CSV as unambiguously full market lifetime without this caveat.

## Anchor checks

### July jobs — August 2, 2024

The BLS page identifies the release as embargoed until 8:30 a.m. ET on Friday, August 2, 2024, which is `2024-08-02T12:30:00Z`. It directly supports the draft's headline: payroll employment increased 114,000 and unemployment rose to 4.3%. The page also says May and June were revised down by a combined 29,000, a useful additional detail if the card needs context.

The draft's event time and claim cutoff are correct. The measured window starts before the provider metadata `startDate`; retain a visible caveat in the editorial packet.

Primary evidence: [BLS July 2024 Employment Situation](https://www.bls.gov/news.release/archives/empsit_08022024.htm), especially the embargo line and release summary.

### July CPI — August 14, 2024

The BLS page states an 8:30 a.m. ET embargo on Wednesday, August 14, giving `2024-08-14T12:30:00Z`. It reports headline CPI up 0.2% in July, up 2.9% over twelve months, and the all-items-less-food-and-energy index up 0.2% month over month. The draft's wording “core CPI rose 0.2%” is a standard short label for that official all-items-less-food-and-energy measure and is supported by the table.

The draft's timing and claim cutoff are correct. The BLS release schedule independently lists the same date and 08:30 time.

Primary evidence: [BLS July 2024 CPI](https://www.bls.gov/news.release/archives/cpi_08142024.htm). Corroborating official schedule: [BLS August 2024 release calendar](https://www.bls.gov/schedule/2024/08_sched_list.htm).

### Powell Jackson Hole — August 23, 2024

The HTML page is dated August 23 and contains the sentence “The time has come for policy to adjust,” but its footer's “Last Update: August 23, 2024” is not a publication timestamp. The official PDF says “For release on delivery 10:00 a.m. EDT (8:00 a.m. MDT) August 23, 2024.” That is `2024-08-23T14:00:00Z`, matching the draft.

The speech directly supports the claim that Powell said policy should adjust and emphasized increased downside employment risks. It does not specify a 25 versus 50 basis-point move; the draft correctly preserves that as interpretation rather than fact. Use the PDF as the timing authority and the HTML page as the accessible text source.

Primary evidence: [Federal Reserve release-on-delivery PDF](https://www.federalreserve.gov/newsevents/speech/files/powell20240823a.pdf) and [Federal Reserve HTML page](https://www.federalreserve.gov/newsevents/speech/powell20240823a.htm).

### August jobs — September 6, 2024

The BLS page states an 8:30 a.m. ET embargo on Friday, September 6, giving `2024-09-06T12:30:00Z`. It reports payrolls up 142,000 and unemployment at 4.2%. It also records downward revisions to June and July, supporting the draft's “prior months were revised lower” language. The phrase “edged down” is slightly imprecise: the official text says the unemployment rate “changed little at 4.2 percent.” The underlying direction from July's 4.3% is down, but the card should say “unemployment is 4.2%, little changed” to track the primary wording.

Recommended editorial correction: replace “unemployment edged down to 4.2%” with “unemployment was 4.2%, little changed.” This is a wording precision fix, not a timing failure.

Primary evidence: [BLS August 2024 Employment Situation](https://www.bls.gov/news.release/archives/empsit_09062024.htm).

### August CPI — September 11, 2024

The BLS page states an 8:30 a.m. ET embargo on Wednesday, September 11, giving `2024-09-11T12:30:00Z`. It reports headline CPI up 0.2% month over month and the official all-items-less-food-and-energy index up 0.3%. The draft's “core CPI rose 0.3%” is supported as the conventional label for that measure.

The draft's timing and claim cutoff are correct. Keep the term “core CPI” only if the card or source note explains that the release's official table calls it “all items less food and energy.”

Primary evidence: [BLS August 2024 CPI](https://www.bls.gov/news.release/archives/cpi_09112024.htm).

## Hindsight and source-role review

The five event claims are contemporaneous issuer facts and can remain `pre-reveal`. The September 18 FOMC decision is correctly separate as the reveal-only conclusion and is not used as a scored event. None of the five cited sources is later than its event cutoff. The speech's “Last Update” page field must not be used as evidence of first-public timing; the PDF's release-on-delivery line resolves that issue.

The score packet's observed moves are descriptive contract-window changes. They should not be written as causal proof that the cited release alone moved the market. The September jobs and September CPI windows overlap; retain the overlap disclosure.

See the machine-readable timing record in [primary-timing.json](evidence/primary-timing.json).
