# EventLens daily-game UI/UX audit

Reviewed September 4, 2026. Lens: a quick, once-per-day activity where a player guesses, gets a satisfying result, shares a score, and returns tomorrow.

## Recommendation

Make the daily puzzle the entire primary experience: one topic, five events, one submitted ranking, an immediate result, and a spoiler-free share action. Aim for a two-minute session, then validate that target with first-time players. Keep the market research as optional post-game depth.

The existing cream background, forest green, serif headlines, and compact event cards provide a useful editorial identity. Preserve that character while giving the playable cards and score most of the visual attention.

## Review scope and evidence

I opened the local app in a browser, inspected the election page before and after submission, moved an event with the position picker, refreshed the submitted result, checked the study index, and inspected the election experience at a 390 × 844 phone viewport. I also read the shared components and responsive styles. This is a product/design review with targeted interaction checks, not an exhaustive test of every study or accessibility behavior.

The browser CLI described by the review skills was unavailable, so the walkthrough used the connected in-app browser. No warning or error entries were returned by its console-log check. No application code was changed.

## Prioritized findings

### 1. Put the first move on the first screen

**Observed:** The opening page contains a long question, explanation, archived-interval notice, workflow steps, a Methodology button, market statistics, an event briefing, and a sealed-market panel. At 390px wide, the first ranking card began approximately 1,341px below the top of the document. The full-width Methodology button appears before the game.

**Change:** Use a compact daily header, one clear question, a one-sentence instruction, and the five cards. Remove the empty chart substitute, hourly observation count, repeated lock notices, and research workflow from the pre-game layout. Put rules behind a small help button and methodology after results.

**Proposed hierarchy:**

1. EventLens · Daily #123 · Help · Stats
2. Today's topic
3. “What moved Trump's election odds?”
4. “Arrange five headlines from biggest rise to biggest fall.”
5. Five compact, movable event cards
6. “Reveal my score” with “One submission today” beneath it

The puzzle number above is illustrative. Daily publication needs a real schedule and identifier.

### 2. Reduce the decision burden and make the objective precise

**Observed:** The default study asks players to rank ten events. Its headline asks which events “mattered most,” while scoring compares signed short-term market movements. Those can imply different tasks: historical importance, absolute magnitude, and increase versus decrease.

**Change:** Start with five curated events. Use “biggest rise” and “biggest fall” consistently, explicitly naming whose odds are being ranked. Keep the ranking mechanic; do not initially add multiple rounds, lives, a timer, or extra currencies. Five items imply ten possible pair comparisons rather than forty-five, before excluding ties.

Each card needs a short, factual headline and an optional one-sentence explanation. A new player should be able to participate without remembering every historical event or leaving the page for research.

### 3. Give players facts without steering their guesses

**Observed:** Desktop cards label events “Helps Trump,” “Hurts Trump,” or “Ambiguous” before submission. The mobile briefing also shows these labels. These are editorial expectations, not the measured answer, but they influence the guess. After reveal, the “Garbage controversy” still says “Helps Trump” alongside a negative measured response. The first election briefing also substitutes a notice about withheld reporting for a basic factual summary.

**Change:** Give every daily card an adequate pre-reveal factual summary with an appropriate source. Save directional interpretation for the reveal, clearly distinguishing prior expectations from observed movement. Avoid letting desktop players receive hints that phone players may not notice. Use neutral card styling before submission: a middle position does not establish that the event's actual response was neutral.

### 4. Make ranking comfortable on a phone

**Observed:** The selected-event panel moves above the entire ranking workflow on small screens. Selecting another event updates that offscreen panel without bringing its explanation alongside the selected card. Rank buttons are 32 × 32px. The opened ten-position picker has 28px-wide buttons, expands the document to 411px at a 390px viewport, and puts the last position beyond the screen edge.

**Root cause of overflow:** The picker has an inline ten-column grid in `src/App.tsx`; that wins over the five-column mobile rule in `src/styles.css`.

**Change:** Show an event's brief inline or in a dismissible bottom sheet that returns the player to the same position. Support touch-friendly dragging and obvious move-up/move-down controls, retaining keyboard operation. Target at least 44px controls as a design choice. Use a responsive picker without an overriding column count. Keep submission within easy reach, with room reserved so it never covers a card.

**Acceptance:** No horizontal page scroll at 320, 390, or 430px, including open controls; all positions reachable; briefings viewable without losing ranking context; screen-reader feedback announces successful moves.

### 5. Make the result the reward

**Observed:** Submission expands a chart and detailed analysis. The score is a small “30/45 comparable pairs agree” beside the ranking heading. The main content emphasizes probability history, stabilized responses, log-odds movement, and attribution controls. There is no prominent finish or sharing action.

**Change:** Lead immediately with a large score, a short reaction, a clear comparison of the player's order with the market order, and one interesting takeaway. Then show “Share result.” Put the full chart, sources, and measurement explanation behind “Why this order?” or “Explore the data.” Move focus to the result heading on submission and respect reduced-motion settings for any reveal animation.

**Scoring recommendation:** Keep the existing tie-aware pairwise method, display `round(100 × agreed / comparable)` as a score out of 100, and explain it in plain language on demand. Describe the score as agreement with the market's ordering, not a percentile or prediction accuracy. An attempt with no comparable pairs needs an explicit unscored state. Curate daily sets to avoid that outcome and avoid presenting near-ties as decisive mistakes.

The observed 30/45 attempt would therefore display 67/100. This example describes that test attempt; it is not a proposed benchmark for good performance.

### 6. Build sharing and the daily return into the result

**Observed:** There is no visible daily number, daily release countdown, streak, saved result, or share button. Refreshing a submitted result restores the initial unsubmitted order. The reset control allows a fresh attempt immediately after seeing the answer. Navigation is organized around choosing studies.

**Change:** Publish one shared puzzle per day with a stable ID, fixed event set, scoring version, and initial shuffle. Store draft order, submitted order, and result by puzzle ID so refresh and return visits resume correctly. Define a single release timezone; show the next release in the player's local time. The completed daily opens directly to its result. Move replay into separately labeled practice or archive play that does not replace the daily score or add to its streak.

**Share payload:** Product name, puzzle number, score, a compact visual result with explicitly defined meaning, and a link to that puzzle. Omit event identities, correct order, and market movements. Offer the device share sheet when supported, plus a reliable Copy result fallback and success feedback. Shared links should remain associated with the original puzzle after the next daily release.

Do not require signup to play. Local persistence is appropriate for an initial casual game; it does not guarantee cross-device continuity or prevent deliberate score manipulation.

### 7. Plan the daily content supply

**Observed:** The index contains five studies, and four are labeled editorial review. “Default study · legacy calculations preserved” appears in the public-facing card. The current library is not yet a sustainable daily publishing schedule.

**Change:** Prepare a queue of reviewed, versioned daily sets with short briefs, reliable comparison windows, and clear post-game explanations. Keep review status in editorial tooling until approved content is ready for players. Reuse the existing measurement engine and source discipline. Retain the old study views as optional exploration, with developer-oriented wording removed from the player experience.

Use historical events for immediate scoring: today's release can concern an old market. The daily cadence comes from publishing a new puzzle, not from asking players to wait for a live market to resolve. Avoid repeatedly recycling revealed events in a way that turns later puzzles into answer recall.

## Suggested build order

1. Create the compact five-card game and first-time instructions; fix responsive ranking controls and event-detail placement.
2. Add the result screen, plain-language score, order comparison, and share/copy behavior.
3. Add puzzle IDs, saved drafts/results, one daily submission, release timing, and streak rules.
4. Prepare reviewed daily content and put the current detailed study interface behind optional post-game exploration.
5. Refine motion, sound if desired and opt-in, stats, and archives after validating the core loop.

## Validate with first-time players

Treat these as proposed targets, not measured outcomes:

- A player can explain the objective and make the first move within 10 seconds.
- A typical session takes about two minutes.
- A player can complete the entire puzzle on a phone without horizontal scrolling or needing external research.
- After submission, the player immediately knows their score, why they received it, and how to share.
- Refresh and returning later preserve both an unfinished puzzle and a finished result.
- The same puzzle produces comparable scores for different players, and ties do not produce arbitrary penalties.

Track completion, time to first move, time to finish, share use, and next-day return before optimizing secondary features.
