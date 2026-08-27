import { loadKalshiMarketSeries, KALSHI_SOURCE_CATALOG, type KalshiMarket, type KalshiMarketConfig, type KalshiPricePoint } from './kalshi.ts'
import type { Checkpoint, CheckpointBriefing, CheckpointId, FactorDefinition, FactorNarrative, FactorObservation, MarketPoint, ResolutionBriefing, Scenario, ScenarioCategory } from '../domain/types.ts'

const DAY_MS = 24 * 60 * 60 * 1000
const checkpointIds: CheckpointId[] = ['60d', '45d', '30d', '15d']
const checkpointDays = [60, 45, 30, 15]

type ScenarioEditorial = {
  category: ScenarioCategory
  categoryTone: Scenario['categoryTone']
  dek: string
  context: string
  resolutionBriefing: ResolutionBriefing
  briefings: Record<CheckpointId, CheckpointBriefing>
  factors: FactorEditorial[]
}

type FactorSignal = 'recent-move' | 'longer-trend' | 'direction-consistency' | 'range-position' | 'volume-attention'

type FactorEditorial = {
  id: string
  label: string
  shortLabel: string
  description: string
  observation: string
  cue: string
  narrative: FactorNarrative
  signal: FactorSignal
}

const editorial: Record<string, ScenarioEditorial> = {
  'canada-liberal-majority-2025': {
    category: 'Politics',
    categoryTone: 'green',
    dek: 'A national election replay about votes, seats, and the majority threshold.',
    context: 'Replay a settled Canadian government market using only Kalshi observations frozen before the verified settlement.',
    resolutionBriefing: {
      summary: 'The Liberals won the April 28 election with 169 of 343 seats, three short of the 172-seat majority threshold.',
      consequence: 'Mark Carney formed a minority government. Passing budgets and surviving confidence votes required support or abstention from another party.',
      sources: [
        { label: 'Elections Canada · Official seat totals', url: 'https://www.elections.ca/content.aspx?dir=rep%2Foff%2Fsta_ge45&document=p2&lang=e&section=res' },
        { label: 'AP · Election result, Apr. 29', url: 'https://apnews.com/article/05feec017e71410250224fc5c4f0a6b6' },
      ],
    },
    briefings: {
      '60d': {
        status: 'A 37-day federal campaign had just begun. Mark Carney was a newly installed prime minister, and the election was being recast around Canada’s response to U.S. tariffs and threats to its sovereignty.',
        developments: [
          'Carney called the April 28 election on March 23, only days after becoming prime minister.',
          'Tariff uncertainty was already weakening Canadian business investment, hiring intentions, and consumer confidence.',
        ],
        yesCase: 'A leadership reset plus a rally around economic sovereignty could consolidate centre-left voters and turn a national lead into the 172 seats needed for a majority.',
        noCase: 'Carney was untested in a national campaign, and winning the most seats was much easier than converting a short campaign into a majority across 343 ridings.',
        stakes: 'A majority would let the Liberals pass budgets and govern through the trade shock without bargaining for confidence-vote support; a minority would make that program dependent on other parties.',
        sources: [
          { label: 'AP · Election called, Mar. 23', url: 'https://apnews.com/article/b27f8553c73a5c1df7294f114b452963' },
          { label: 'Bank of Canada · Tariff uncertainty, Mar. 20', url: 'https://www.bankofcanada.ca/2025/03/tariffs-and-trade-uncertainty-hurting-canadian-economy/' },
        ],
      },
      '45d': {
        status: 'The campaign had settled into a two-party contest with Carney’s Liberals ahead in national polling, but the contract asked the harder question: whether that support would produce a seat majority.',
        developments: [
          'Trade and the ability to manage relations with the United States remained central campaign tests.',
          'Polling showed a Carney leadership advantage, while regional vote efficiency and third-party strength still controlled the seat conversion.',
        ],
        yesCase: 'If Liberal support stayed concentrated in Ontario, Quebec, and Atlantic battlegrounds, a polling lead could become a disproportionately large seat haul.',
        noCase: 'A national lead could be wasted in already-safe ridings, while Conservative strength and surviving Bloc or NDP pockets could keep the Liberals below 172.',
        stakes: 'The distinction was not cosmetic: a majority meant four years of much firmer control over budgets, tariff responses, and the government’s survival.',
        sources: [
          { label: 'Ipsos · Leadership and vote poll, Mar. 18', url: 'https://www.ipsos.com/sites/default/files/ct/news/documents/2025-03/FEDVOTE_March_Mini_Poll_March%2017%202025.pdf' },
          { label: 'Bank of Canada · Trade uncertainty', url: 'https://www.bankofcanada.ca/2025/03/navigating-tariff-uncertainty/' },
        ],
      },
      '30d': {
        status: 'Election day was imminent. Liberals still led most national estimates, but the race had tightened and the majority line remained a separate, uncertain hurdle.',
        developments: [
          'Late polling put the Liberals ahead nationally while leaving meaningful room for a narrower seat result.',
          'Some seat models projected a majority, making riding-level errors and turnout the decisive uncertainty rather than the identity of the leading party alone.',
        ],
        yesCase: 'A modest national edge could still produce a majority if Liberal votes were efficiently distributed and weaker third parties opened enough close ridings.',
        noCase: 'Tightening late polls made 172 seats fragile: small misses in Ontario, Quebec, or British Columbia could yield a Liberal government but not a Liberal majority.',
        stakes: 'This was a forecast about governing power, not merely who would win: the result would determine whether Carney could execute his agenda alone.',
        sources: [
          { label: 'Ipsos · Final-week leadership poll, Apr. 21', url: 'https://www.ipsos.com/sites/default/files/ct/news/documents/2025-04/Leaders%20Release.pdf' },
          { label: 'Scotiabank · Final seat projections, Apr. 25', url: 'https://www.scotiabank.com/content/dam/scotiabank/sub-brands/scotiabank-economics/english/documents/the-global-week-ahead/globalweekahead20250425.pdf' },
        ],
      },
      '15d': {
        status: 'The election had been counted: the Liberals won government but held 169 of 343 seats—three short of the 172-seat majority threshold. The market had not yet reached its formal Kalshi settlement date.',
        developments: [
          'The central uncertainty had collapsed from “who wins?” to the official seat count and settlement mechanics.',
          'A 169-seat Liberal caucus meant the incoming government would need outside support on confidence matters.',
        ],
        yesCase: 'Only an extraordinary change in certified riding results could rescue YES; ordinary political cooperation after the election would not satisfy a contract asking for a Liberal majority.',
        noCase: 'The observed seat count was below the mathematical threshold, so NO had the direct factual case even before Kalshi completed settlement.',
        stakes: 'The result produced a minority Parliament: the Liberals could form government, but budgets and confidence votes would require support or abstention from another party.',
        sources: [
          { label: 'Elections Canada · Official seat totals', url: 'https://www.elections.ca/content.aspx?dir=rep%2Foff%2Fsta_ge45&document=p2&lang=e&section=res' },
          { label: 'AP · Election result, Apr. 29', url: 'https://apnews.com/article/05feec017e71410250224fc5c4f0a6b6' },
        ],
      },
    },
    factors: [
      { id: 'national-polling-spread', label: 'National polling spread', shortLabel: 'Polling', description: 'A broad shift in national support can change the number of ridings within reach.', observation: 'Scenario lens: watch whether broad support is moving toward majority territory.', cue: 'If national support were strengthening, that would make a Liberal majority…', narrative: { context: 'This was a seat-conversion election: a national vote swing mattered only if it moved competitive ridings.', yesCase: 'A sustained Liberal lead could pull enough close ridings across the line for 172 seats.', noCase: 'A lead concentrated in already-safe areas could produce the most seats without a majority.', consequence: 'The difference was control of the House: majority government versus a minority dependent on another party.' }, signal: 'recent-move' },
      { id: 'vote-efficiency-map', label: 'Vote-efficiency map', shortLabel: 'Seat map', description: 'Majorities depend on where votes are won, not only on the national vote share.', observation: 'Scenario lens: ask whether support is distributed efficiently across decisive ridings.', cue: 'If the riding map were becoming more efficient, that would make a Liberal majority…', narrative: { context: 'Canada elects one MP per riding, so geography can turn a modest vote edge into a large or small seat total.', yesCase: 'Liberal gains in Ontario, Quebec, and Atlantic battlegrounds could compound into a majority.', noCase: 'Efficient Conservative or regional-party support could block Liberal gains even with a national lead.', consequence: 'The map determined whether Carney could pass his program alone or had to bargain riding by riding.' }, signal: 'longer-trend' },
      { id: 'majority-seat-threshold', label: 'Majority-seat threshold', shortLabel: 'Threshold', description: 'A party can lead the election and still fall short of the seats required to govern alone.', observation: 'Scenario lens: distinguish winning the most seats from clearing the majority line.', cue: 'If the majority threshold looked easier to clear, that would make a Liberal majority…', narrative: { context: 'The contract’s YES condition was specific: at least 172 of 343 seats, not simply finishing first.', yesCase: 'A late polling edge plus favorable riding-level turnout could clear the narrow three-seat margin.', noCase: 'A small error in several close ridings could leave the Liberals as the government but below 172.', consequence: 'Missing the threshold meant confidence votes and budgets required outside support.' }, signal: 'range-position' },
      { id: 'bloc-ndp-squeeze', label: 'Bloc and NDP tactical squeeze', shortLabel: 'Third parties', description: 'Regional and third-party strength can decide close contests and deny a majority.', observation: 'Scenario lens: consider whether third-party competition helps or blocks seat gains.', cue: 'If third-party dynamics favored Liberal seat gains, that would make a majority…', narrative: { context: 'Bloc Québécois and NDP pockets could win or split close ridings even as the Liberals led nationally.', yesCase: 'A squeeze on third-party support could transfer marginal seats to the Liberals.', noCase: 'Regional parties holding their vote could cap Liberal gains below the majority line.', consequence: 'Third-party survival changed the governing coalition Canada would need after election night.' }, signal: 'direction-consistency' },
      { id: 'campaign-shock', label: 'Campaign shock or leader slip', shortLabel: 'Campaign shock', description: 'A debate, endorsement, or campaign mistake could rapidly reset expectations.', observation: 'Scenario hypothesis only: unusual market attention may flag a changing campaign narrative.', cue: 'If a campaign shock favored the Liberals, that would make a majority…', narrative: { context: 'Carney entered a short campaign as a new leader, so debates, endorsements, and trade headlines had unusually little time to settle.', yesCase: 'A credible leadership moment could consolidate voters around a majority mandate.', noCase: 'A mistake, scandal, or late shock could compress the race before turnout was locked in.', consequence: 'A late narrative shift could change not just the winner, but the strength of the government that followed.' }, signal: 'volume-attention' },
    ],
  },
  'fed-december-2025-cut': {
    category: 'Economics',
    categoryTone: 'blue',
    dek: 'A consequential rate decision shaped by inflation, jobs, and central-bank guidance.',
    context: 'Replay the December 2025 decision with market-only signals captured before the settled result.',
    resolutionBriefing: {
      summary: 'The FOMC cut the federal-funds target range by 25 basis points on December 10, to 3.50%–3.75%.',
      consequence: 'The move extended the 2025 easing cycle while the Fed continued balancing slower hiring against inflation that remained above its 2% goal.',
      sources: [
        { label: 'Federal Reserve · Dec. 10 statement', url: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20251210a.htm' },
        { label: 'Federal Reserve · Dec. 10 minutes', url: 'https://www.federalreserve.gov/monetarypolicy/fomcminutes20251210.htm' },
      ],
    },
    briefings: {
      '60d': {
        status: 'The Fed had just restarted easing with a quarter-point September cut. Officials described slower job gains and rising downside employment risks, while inflation was still somewhat elevated.',
        developments: [
          'The target range stood at 4.00%–4.25% after the September move.',
          'The dual-mandate tension was explicit: softer labor conditions argued for support, but inflation still argued for caution.',
        ],
        yesCase: 'If labor-market cooling continued, September could be the first step in a sequence that included another quarter-point cut in December.',
        noCase: 'Persistent inflation could make the September cut insurance rather than the start of an automatic every-meeting easing cycle.',
        stakes: 'The choice would change short-term borrowing costs and signal which risk the Fed feared more: weakening employment or inflation remaining above target.',
        sources: [
          { label: 'Federal Reserve · Sept. 17 statement', url: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20250917a.htm' },
        ],
      },
      '45d': {
        status: 'Markets were approaching the October FOMC meeting expecting another cut, but December still depended on the data path and the committee’s interpretation of inflation versus employment risks.',
        developments: [
          'September’s quarter-point cut had established an easing direction without pre-committing the next two meetings.',
          'A disruption to federal data collection was reducing visibility into the labor market just as the Fed needed fresh evidence.',
        ],
        yesCase: 'Slowing job gains and elevated downside employment risks made continued gradual easing internally consistent with the Fed’s September diagnosis.',
        noCase: 'Inflation remained above target, and missing or delayed data gave cautious officials a reason to wait rather than make a December cut on incomplete evidence.',
        stakes: 'A December move would influence mortgages, business financing, the dollar, and expectations for the entire 2026 rate path.',
        sources: [
          { label: 'Federal Reserve · Sept. 17 statement', url: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20250917a.htm' },
          { label: 'BLS · 2025 data-release disruption', url: 'https://www.bls.gov/bls/2025-lapse-revised-release-dates.htm' },
        ],
      },
      '30d': {
        status: 'The Fed had cut again on October 29, but Chair Jerome Powell warned that a December cut was not assured. The vote itself exposed disagreement in both directions.',
        developments: [
          'The target range fell to 3.75%–4.00% as the committee cited higher downside risks to employment.',
          'One dissenter wanted a larger cut and another wanted no cut, demonstrating that the coalition for the October move did not imply agreement about December.',
        ],
        yesCase: 'Two consecutive cuts and the Fed’s concern about employment created a clear runway for one more cautious quarter-point reduction.',
        noCase: 'Inflation had moved up, officials were visibly split, and Powell’s pushback made a pause a live policy choice.',
        stakes: 'The December decision would reveal whether the Fed viewed the autumn cuts as a continuing cycle or a limited recalibration.',
        sources: [
          { label: 'Federal Reserve · Oct. 29 statement', url: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20251029a.htm' },
          { label: 'Federal Reserve · Oct. 29 press conference', url: 'https://www.federalreserve.gov/mediacenter/files/FOMCpresconf20251029.pdf' },
        ],
      },
      '15d': {
        status: 'The committee remained divided, but the market’s cut case had strengthened as investors weighed weak hiring signals and a run of Fed communication against still-sticky inflation.',
        developments: [
          'October minutes confirmed that investors expected a December cut while retaining meaningful uncertainty.',
          'The missing-data problem persisted, forcing policymakers to rely on a thinner and more uneven evidence set than usual.',
        ],
        yesCase: 'The established easing path, labor-market risk, and market repricing gave a quarter-point cut the strongest coherent base case.',
        noCase: 'Resilient activity, elevated inflation, and outspoken resistance from some officials left a pause plausible—especially with incomplete official data.',
        stakes: 'A cut would ease financial conditions before year-end; a pause would signal that inflation control still constrained how quickly the Fed could protect employment.',
        sources: [
          { label: 'Federal Reserve · October meeting minutes', url: 'https://www.federalreserve.gov/monetarypolicy/fomcminutes20251029.htm' },
          { label: 'BLS · Revised release calendar', url: 'https://www.bls.gov/bls/2025-lapse-revised-release-dates.htm' },
        ],
      },
    },
    factors: [
      { id: 'inflation-cooling', label: 'Inflation cooling', shortLabel: 'Inflation', description: 'Softer inflation would give policymakers more room to lower the policy rate.', observation: 'Scenario lens: watch whether traders increasingly price a disinflationary path.', cue: 'If incoming inflation data showed faster cooling, that would make a 25 bp cut…', narrative: { context: 'The Fed’s 2% inflation goal was still above reach, so every cut required confidence that price pressure would keep easing.', yesCase: 'Cleaner disinflation would let officials support growth without reigniting prices.', noCase: 'Sticky services or goods inflation would make another cut look premature.', consequence: 'The inflation read determined how much room the Fed had to protect jobs.' }, signal: 'longer-trend' },
      { id: 'labor-market-weakening', label: 'Labor-market weakening', shortLabel: 'Jobs', description: 'A weaker employment picture can raise the case for monetary support.', observation: 'Scenario lens: ask whether growth and employment risks are overtaking inflation risks.', cue: 'If labor conditions were weakening, that would make a 25 bp cut…', narrative: { context: 'Slower job gains and a higher unemployment rate raised the question of whether the economy needed insurance from policy.', yesCase: 'Evidence of a cooling labor market would argue for a quarter-point cushion.', noCase: 'Resilient hiring would let the committee wait for clearer inflation progress.', consequence: 'The jobs signal shaped the Fed’s maximum-employment side of its dual mandate.' }, signal: 'recent-move' },
      { id: 'fed-guidance-convergence', label: 'Fed guidance convergence', shortLabel: 'Fed guidance', description: 'Speeches and meeting communication can narrow the plausible policy choices.', observation: 'Scenario lens: look for a market that moves repeatedly in the same policy direction.', cue: 'If Fed guidance were converging on easing, that would make a 25 bp cut…', narrative: { context: 'A decision is also a communication event: officials’ words can align markets before the vote or expose internal disagreement.', yesCase: 'Consistent easing language would make a December cut easier to explain and price.', noCase: 'Conflicting guidance could keep a cut live in markets but unlikely in the room.', consequence: 'Guidance moved financial conditions before the policy rate itself changed.' }, signal: 'direction-consistency' },
      { id: 'energy-fiscal-shock', label: 'Energy or fiscal inflation shock', shortLabel: 'Inflation shock', description: 'A renewed inflation impulse could keep policymakers cautious even as growth slows.', observation: 'Scenario hypothesis only: test the risk that a fresh price shock limits room to cut.', cue: 'If a new inflation shock were intensifying, that would make a 25 bp cut…', narrative: { context: 'An oil, tariff, or fiscal shock could lift prices at the same time that growth softens—the difficult version of the Fed’s tradeoff.', yesCase: 'If the shock faded quickly, officials could look through it and keep easing.', noCase: 'If it broadened into expectations and wages, the Fed would have to defend its inflation credibility.', consequence: 'A supply shock could turn a growth-supporting cut into a fresh inflation problem.' }, signal: 'range-position' },
      { id: 'bond-market-repricing', label: 'Bond-market repricing', shortLabel: 'Repricing', description: 'Rapid attention and repricing can signal that traders are absorbing policy-relevant news.', observation: 'Scenario hypothesis only: unusual Kalshi volume may reflect a policy repricing window.', cue: 'If broader rate expectations were repricing toward easing, that would make a 25 bp cut…', narrative: { context: 'Rates markets aggregate thousands of views about the next meeting, but repricing is evidence of expectations—not proof of what the committee will do.', yesCase: 'A sustained move toward lower yields would reinforce the market’s easing narrative.', noCase: 'A sharp reversal would show that traders still feared inflation or a policy pause.', consequence: 'Repricing changes mortgages, credit, and asset valuations before the announcement arrives.' }, signal: 'volume-attention' },
    ],
  },
  'one-battle-best-picture-2026': {
    category: 'Entertainment',
    categoryTone: 'amber',
    dek: 'A long awards campaign filtered through an industry-wide preferential ballot.',
    context: 'Replay the settled 2026 Best Picture race without importing reviews, awards, or box-office data.',
    resolutionBriefing: {
      summary: 'One Battle After Another won Best Picture at the 98th Academy Awards on March 15, 2026.',
      consequence: 'The film’s producers and Paul Thomas Anderson received the industry’s top film honor, capping a campaign that also won directing and adapted screenplay.',
      sources: [
        { label: 'Academy · 98th Oscars winners', url: 'https://www.oscars.org/oscars/ceremonies/2026' },
      ],
    },
    briefings: {
      '60d': {
        status: 'Oscar nominations were still a week away, but One Battle After Another had already won Best Picture at Critics Choice and the Golden Globe for musical or comedy.',
        developments: [
          'The film paired top-picture wins with directing and screenplay recognition, evidence of support beyond a single performance.',
          'The Academy field was not yet official, and Hamnet and Sinners remained credible rivals with different constituencies.',
        ],
        yesCase: 'Repeated wins across picture, directing, and writing suggested broad enthusiasm—the kind of coalition a preferential Best Picture ballot rewards.',
        noCase: 'Critics and Golden Globe voters are not the Academy; the film still had to prove branch-wide strength through nominations and industry guilds.',
        stakes: 'Best Picture would crown the film as the industry’s consensus achievement and confer durable prestige on its filmmakers, cast, and studio campaign.',
        sources: [
          { label: 'Critics Choice · Best Picture, Jan. 4', url: 'https://www.criticschoice.com/one-battle-after-another-wins-best-picture-at-the-31st-annual-critics-choice-awards/' },
          { label: 'Golden Globes · Best Picture, Jan. 11', url: 'https://goldenglobes.com/video/one-battle-after-another-wins-best-picture-musical-or-comedy/' },
        ],
      },
      '45d': {
        status: 'The Academy nominations were now public. One Battle After Another earned 13 nominations across acting, directing, writing, and major craft branches, including Best Picture.',
        developments: [
          'The nomination spread demonstrated support across many Academy constituencies rather than one isolated branch.',
          'Sinners led the field with more nominations, preserving a formidable alternative to the market favorite.',
        ],
        yesCase: 'Thirteen nominations, including four acting mentions and key picture-adjacent categories, gave the film the broad coalition needed for a preferential ballot.',
        noCase: 'Nomination breadth does not guarantee first-place rankings, and Sinners’ leading total showed that the rival coalition could be at least as broad.',
        stakes: 'The race had moved from critics’ enthusiasm to an Academy-wide test of consensus, with the winner defining the season’s final industry narrative.',
        sources: [
          { label: 'Academy · Nominations announcement, Jan. 22', url: 'https://press.oscars.org/news/98th-oscarsr-nominations-announced' },
          { label: 'Academy · Nominations by film', url: 'https://press-files.oscars.org/sites/default/files/2026-01/98th_oscars_nominations_announced.pdf' },
        ],
      },
      '30d': {
        status: 'Paul Thomas Anderson had won the Directors Guild’s top feature-film award, adding a major industry-guild result to the film’s earlier critics and Golden Globe success.',
        developments: [
          'The DGA win confirmed strong support among working directors, an Academy branch with direct overlap and influence.',
          'Best Picture still used a broader electorate and preferential ballot, so a directing victory was highly relevant but not dispositive.',
        ],
        yesCase: 'A DGA win atop 13 Oscar nominations made the film look less like a critics-only favorite and more like the industry’s consensus choice.',
        noCase: 'Picture voters could admire Anderson’s direction while ranking another film first overall; the producers and actors guild signals were not yet complete.',
        stakes: 'The next guild results would determine whether the campaign was a true sweep or a race with separate directing and picture favorites.',
        sources: [
          { label: 'Directors Guild · 2026 winner, Feb. 7', url: 'https://www.dga.org/news/pressreleases/2026/260207_78th_annual-dga-award-winners' },
          { label: 'Academy · 13 nominations', url: 'https://press-files.oscars.org/sites/default/files/2026-01/98th_oscars_nominations_announced.pdf' },
        ],
      },
      '15d': {
        status: 'Final Oscar voting had begun. One Battle After Another entered that window with 13 nominations and a DGA win, while the Producers Guild result was still pending later on February 28.',
        developments: [
          'The film’s case already combined critic wins, 13 Academy nominations, and the directors guild’s top award.',
          'The pending PGA prize was especially important because its top film award has historically correlated closely with the Best Picture winner.',
        ],
        yesCase: 'The DGA win atop broad Academy nominations made the film look like the leading cross-branch consensus as final voting opened.',
        noCase: 'The most informative producer result was not yet known, and a rival could still prove stronger on the Academy’s picture-wide preferential ballot.',
        stakes: 'The race had entered the votes-that-count phase, with one major precursor still capable of reinforcing the favorite or reopening the contest.',
        sources: [
          { label: 'Academy · Final voting calendar', url: 'https://www.oscars.org/oscars/98th-oscars-and-academy-key-dates' },
          { label: 'Producers Guild · Nominees and Feb. 28 schedule', url: 'https://producersguild.org/2026-pga-awards-motion-pictures-and-television-categories-nominees/' },
          { label: 'Directors Guild · 2026 winner', url: 'https://www.dga.org/news/pressreleases/2026/260207_78th_annual-dga-award-winners' },
        ],
      },
    },
    factors: [
      { id: 'precursor-awards', label: 'Guild and precursor sweep', shortLabel: 'Precursors', description: 'Recognition from major voting groups can reveal industry-wide momentum.', observation: 'Scenario lens: consider whether awards-season signals are lining up behind one film.', cue: 'If the film were sweeping meaningful precursors, that would make a Best Picture win…', narrative: { context: 'Critics, Golden Globes, DGA, PGA, and other guilds each sample a different slice of the eventual Academy electorate.', yesCase: 'Wins across distinct groups would suggest the film’s support travels beyond one voting bloc.', noCase: 'A critics-heavy run could fade if Academy branches preferred a different rival.', consequence: 'Precursors shape campaign momentum, media expectations, and the final ballot’s sense of inevitability.' }, signal: 'recent-move' },
      { id: 'ballot-breadth', label: 'Preferential-ballot breadth', shortLabel: 'Ballot breadth', description: 'Best Picture rewards broad acceptability as well as first-place enthusiasm.', observation: 'Scenario lens: ask whether the film can remain acceptable across many Academy branches.', cue: 'If the film had broader preferential-ballot appeal, that would make a win…', narrative: { context: 'Best Picture is decided by a preferential ballot, so a film can win by being many voters’ strong second choice.', yesCase: 'A broadly admired film can accumulate transfers even without dominating every first-place ranking.', noCase: 'A polarizing film may lead an enthusiastic bloc but lose when lower-ranked ballots are redistributed.', consequence: 'Ballot breadth turns “most loved” into “most acceptable,” which is a different kind of consensus.' }, signal: 'longer-trend' },
      { id: 'critics-industry-split', label: 'Critics–industry split', shortLabel: 'Voter split', description: 'Critical acclaim does not always translate into support from industry voters.', observation: 'Scenario lens: test whether enthusiasm appears durable rather than concentrated.', cue: 'If industry voters were matching critical enthusiasm, that would make a win…', narrative: { context: 'Critics reward discovery and craft; Academy voters also weigh colleagues, production scale, and the practical work of making a film.', yesCase: 'Industry recognition would confirm that praise had become a working-voter coalition.', noCase: 'A gap between critics and guilds would warn that the film’s acclaim was not translating to Best Picture votes.', consequence: 'The split tells you whether the campaign has converted cultural buzz into Academy support.' }, signal: 'direction-consistency' },
      { id: 'late-controversy', label: 'Late campaign controversy', shortLabel: 'Controversy', description: 'A late narrative shift can change rankings after months of stable expectations.', observation: 'Scenario hypothesis only: consider a late positive or negative campaign shock.', cue: 'If a late controversy hurt the film, that would make a win…', narrative: { context: 'Final voting compresses months of campaign storytelling into a short window where a new controversy or endorsement can dominate attention.', yesCase: 'A late positive narrative could make the film feel urgent and newly essential.', noCase: 'A negative shock could push undecided voters toward a safer consensus choice.', consequence: 'Late narratives matter because there is little time for voters or markets to fully digest them.' }, signal: 'volume-attention' },
      { id: 'visibility-reach', label: 'Visibility and audience reach', shortLabel: 'Visibility', description: 'A widely seen contender may enter final voting with a broader base of familiarity.', observation: 'Scenario lens: ask whether visibility can sustain support through final voting.', cue: 'If audience reach were helping the campaign, that would make a win…', narrative: { context: 'Academy members must see Best Picture nominees to vote, so availability and cultural reach affect who can form an informed preference.', yesCase: 'High visibility can create more informed supporters and stronger second-choice support.', noCase: 'A less-seen film may depend on a small group of passionate advocates and lose transfers.', consequence: 'Reach changes the size and diversity of the coalition a preferential ballot can assemble.' }, signal: 'range-position' },
    ],
  },
  'seattle-football-champion-2026': {
    category: 'Sports',
    categoryTone: 'green',
    dek: 'A season-long championship forecast shaped by health, seeding, and playoff matchups.',
    context: 'Replay Seattle’s settled 2026 championship market across four pre-result snapshots.',
    resolutionBriefing: {
      summary: 'Seattle beat New England 29–13 in Super Bowl LX on February 8, 2026, for the second championship in franchise history.',
      consequence: 'The title validated a 14–3 regular season, the NFC’s No. 1 seed, and a defense that also carried Seattle through the 49ers and Rams in the playoffs.',
      sources: [
        { label: 'Seahawks · Super Bowl LX champions', url: 'https://www.seahawks.com/news/2025-the-seahawks-are-super-bowl-lx-champions' },
        { label: 'Seahawks · Super Bowl LX game center', url: 'https://www.seahawks.com/super-bowl-lx/' },
      ],
    },
    briefings: {
      '60d': {
        status: 'Seattle was 10–3 after consecutive games without allowing a touchdown, firmly in the playoff race but still competing for the NFC West and the conference’s best postseason path.',
        developments: [
          'A 37–9 win in Atlanta featured three takeaways and pushed Seattle’s point differential to a league-best +161.',
          'The defense looked repeatable, but the team still faced divisional and seeding uncertainty before any elimination game began.',
        ],
        yesCase: 'An elite defense, strong point differential, and a 10–3 record provided a championship foundation that could travel through the playoffs.',
        noCase: 'Even an excellent contender had to win the division, secure a favorable seed, stay healthy, and survive several high-variance games against other top teams.',
        stakes: 'A title would require converting regular-season quality into a playoff path and then winning the franchise’s second championship.',
        sources: [
          { label: 'Seahawks · Week 14 win, Dec. 7', url: 'https://www.seahawks.com/news/rapid-reactions-seahawks-dominate-in-second-half-on-their-way-to-big-win-over-falcons' },
          { label: 'Seahawks · Week 14 numbers', url: 'https://www.seahawks.com/news/12-numbers-of-note-from-the-seahawks-week-14-win-in-atlanta' },
        ],
      },
      '45d': {
        status: 'Seattle was 12–3 after a 38–37 overtime comeback against the Rams, had clinched a playoff berth, and moved into first place in both the NFC West and the conference.',
        developments: [
          'The Seahawks erased a 16-point fourth-quarter deficit against another 11–3 contender.',
          'The win put a first-round bye and home-field advantage within reach, materially shortening the possible championship route.',
        ],
        yesCase: 'Beating a direct rival while taking control of the No. 1 seed strengthened both the team-quality case and the probability of a shorter, home-heavy playoff path.',
        noCase: 'The one-point overtime margin also showed how little separated elite teams, and Seattle still had to finish the seeding race before facing elimination games.',
        stakes: 'The difference between the top seed and a lower seed was enormous: one fewer game, rest, and home field through the NFC playoffs.',
        sources: [
          { label: 'Seahawks · Rams comeback, Dec. 18', url: 'https://www.seahawks.com/news/2025-week-16-rapid-reactions-seahawks-take-over-first-place-in-the-nfc-west-with-a-stunning-comeback-win-over-the-rams' },
          { label: 'Seahawks · Playoff berth, Dec. 20', url: 'https://www.seahawks.com/news/seahawks-clinch-playoff-berth-but-eying-bigger-prize-we-ve-got-more-work-to-do' },
        ],
      },
      '30d': {
        status: 'Seattle had finished 14–3, won the NFC West, and secured the conference’s No. 1 seed, a first-round bye, and home-field advantage.',
        developments: [
          'A 13–3 win over San Francisco completed the best regular season in franchise history.',
          'The bye removed one elimination game, but Seattle still needed three postseason wins to become champion.',
        ],
        yesCase: 'The league’s best point differential, the NFC’s top seed, and an extra week of rest made Seattle’s path structurally stronger than it had been a month earlier.',
        noCase: 'A bye improves odds but does not erase matchup risk; every remaining opponent would be strong enough to end the season in one game.',
        stakes: 'Seattle had earned the optimal route. The forecast now turned on whether dominant defense and home field would survive playoff-level competition.',
        sources: [
          { label: 'Seahawks · No. 1 seed, Jan. 3', url: 'https://www.seahawks.com/news/rapid-reactions-seahawks-clinch-nfc-west-and-no-1-seed-with-13-3-win-over-49ers' },
          { label: 'Seahawks · Season standings', url: 'https://www.seahawks.com/team/standings/2025/reg' },
        ],
      },
      '15d': {
        status: 'Seattle was one game from the Super Bowl after a 41–6 divisional-round rout of San Francisco. The Seahawks were preparing to host the 12–5 Rams for the NFC championship on January 25.',
        developments: [
          'Seattle forced three turnovers and did not allow a touchdown in the divisional round.',
          'The familiar Rams had already pushed Seattle to overtime in December, making the home conference-title game a dangerous divisional rematch.',
        ],
        yesCase: 'A dominant defense, productive run game, and home field gave Seattle a credible route through the Rams and then one final neutral-site game.',
        noCase: 'Two wins were still required, beginning with a division rival that knew Seattle well and had already played it nearly even; championship probability could not be treated like conference-title probability.',
        stakes: 'A win would send Seattle to its first Super Bowl in 11 years. Only after that would the actual championship question be decided.',
        sources: [
          { label: 'Seahawks · Divisional win, Jan. 17', url: 'https://www.seahawks.com/news/2025-nfc-divisional-round-rapid-reactions-seahawks-dominate-49ers-to-advance-to-nfc-championship-game' },
          { label: 'Seahawks · NFC title matchup, Jan. 23', url: 'https://www.seahawks.com/news/what-to-watch-in-the-seahawks-nfc-championship-game-matchup-with-the-rams' },
        ],
      },
    },
    factors: [
      { id: 'quarterback-form', label: 'Quarterback health and form', shortLabel: 'Quarterback', description: 'Quarterback availability and performance can dominate a team’s title probability.', observation: 'Scenario lens: consider whether the most important position is strengthening or weakening.', cue: 'If quarterback health and form were improving, that would make a Seattle title…', narrative: { context: 'Seattle’s title path depended on Sam Darnold staying available and efficient through multiple elimination games—not merely having a good regular-season average.', yesCase: 'Stable quarterback play lets the defense and run game turn close playoff margins into wins.', noCase: 'A setback, slump, or opponent-specific pressure could end the season in one game.', consequence: 'Quarterback continuity changes whether Seattle’s strong roster can survive the full playoff sequence.' }, signal: 'recent-move' },
      { id: 'defensive-efficiency', label: 'Defensive efficiency', shortLabel: 'Defense', description: 'A defense that travels well can keep a team competitive across varied playoff opponents.', observation: 'Scenario lens: ask whether the team has a repeatable defensive edge.', cue: 'If defensive efficiency were improving, that would make a Seattle title…', narrative: { context: 'Seattle’s defense was the repeatable identity of the 2025 team: pressure, takeaways, and the ability to keep opponents out of the end zone.', yesCase: 'A defense that travels can hold up even when the offense or matchup changes.', noCase: 'Turnovers and red-zone stops are volatile; one missed assignment can erase a season’s edge.', consequence: 'Defensive reliability reduces the number of points Seattle must win in every elimination game.' }, signal: 'direction-consistency' },
      { id: 'playoff-path', label: 'Playoff seeding and path', shortLabel: 'Playoff path', description: 'Home field, byes, and opponent strength materially change the route to a championship.', observation: 'Scenario lens: focus on whether the likely postseason route is becoming easier or harder.', cue: 'If Seattle’s playoff path were improving, that would make a title…', narrative: { context: 'The same team can have very different title odds depending on whether it earns a bye, hosts games, and avoids the conference’s strongest opponents early.', yesCase: 'The NFC’s top seed removes one game and keeps home field in the conference bracket.', noCase: 'A lower seed adds an elimination game and more travel against elite opponents.', consequence: 'Seeding changes the number and difficulty of wins required, not just the venue.' }, signal: 'longer-trend' },
      { id: 'roster-shock', label: 'Major injury or roster shock', shortLabel: 'Roster shock', description: 'A single high-impact absence or addition can abruptly change a long-horizon forecast.', observation: 'Scenario hypothesis only: unusual market attention may flag a roster-changing development.', cue: 'If a roster shock hurt Seattle, that would make a title…', narrative: { context: 'This is explicitly a scenario hypothesis: the Kalshi volume spike is not an injury report and does not verify that a roster event occurred.', yesCase: 'A healthy core and a timely addition could preserve depth through the playoff grind.', noCase: 'One absence at quarterback, pass rush, or the secondary could expose a thin matchup margin.', consequence: 'Roster shocks matter because playoff depth is tested immediately and cannot be replenished after elimination.' }, signal: 'volume-attention' },
      { id: 'matchup-adaptability', label: 'Matchup adaptability', shortLabel: 'Matchups', description: 'Champions need viable answers against multiple styles over several elimination games.', observation: 'Scenario lens: ask whether the roster’s strengths remain useful across likely matchups.', cue: 'If Seattle matched up well across the field, that would make a title…', narrative: { context: 'A championship is not one opponent: Seattle had to solve contrasting offenses, fronts, and game scripts across the NFC and Super Bowl.', yesCase: 'A defense that can pressure, stop the run, and force long downs travels across styles.', noCase: 'A scheme that dominates one opponent can be exposed by a different protection or coverage plan.', consequence: 'Adaptability turns regular-season dominance into a viable multi-round championship run.' }, signal: 'range-position' },
    ],
  },
}

const formatDate = (value: string | undefined) => value
  ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  : 'Unknown date'

const formatDelta = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)} pts`
const clampSignal = (value: number) => Math.min(Math.max(Math.abs(value), 0), 1)

const pointAtOrBefore = (points: KalshiPricePoint[], index: number, lookbackDays: number) => {
  const target = Date.parse(points[index].timestamp) - lookbackDays * DAY_MS
  let match = Math.max(0, index - 1)
  for (let cursor = index; cursor >= 0; cursor -= 1) {
    if (Date.parse(points[cursor].timestamp) <= target) {
      match = cursor
      break
    }
  }
  return match
}

const numeric = (value: unknown) => {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const resolvedOutcome = (market: KalshiMarket): boolean | null => {
  const result = market.result?.toLowerCase()
  if (result === 'yes') return true
  if (result === 'no') return false
  return null
}

const checkpointIndexesFor = (points: KalshiPricePoint[], resolutionTimestamp: string) => {
  const resolutionMs = Date.parse(resolutionTimestamp)
  if (!Number.isFinite(resolutionMs)) throw new Error('Kalshi did not return a valid settlement timestamp.')
  const indexes = checkpointDays.map((days) => {
    const target = resolutionMs - days * DAY_MS
    let index = -1
    for (let cursor = points.length - 1; cursor >= 0; cursor -= 1) {
      if (Date.parse(points[cursor].timestamp) <= target) {
        index = cursor
        break
      }
    }
    if (index < 0) throw new Error(`Kalshi returned less than ${days} days of pre-settlement history for this market.`)
    return index
  })
  if (new Set(indexes).size !== checkpointDays.length) throw new Error('Kalshi history could not produce four distinct settlement checkpoints.')
  return indexes
}

type FactorMeasurement = {
  reading: string
  context: string
  signal: number
}

const buildFactor = (
  editorialFactor: FactorEditorial,
  points: KalshiPricePoint[],
  checkpointIndexes: number[],
  measure: (index: number) => FactorMeasurement,
): FactorDefinition => ({
  id: editorialFactor.id,
  label: editorialFactor.label,
  shortLabel: editorialFactor.shortLabel,
  description: editorialFactor.description,
  observation: editorialFactor.observation,
  cue: editorialFactor.cue,
  narrative: editorialFactor.narrative,
  observations: Object.fromEntries(checkpointIds.map((checkpointId, checkpointIndex) => [checkpointId, measure(checkpointIndexes[checkpointIndex])])) as Record<CheckpointId, FactorObservation>,
})

const buildFactors = (points: KalshiPricePoint[], checkpointIndexes: number[], factors: FactorEditorial[]): FactorDefinition[] => {
  const recentMomentum = (index: number): FactorMeasurement => {
    const prior = pointAtOrBefore(points, index, 7)
    const delta = points[index].probability - points[prior].probability
    return {
      reading: `Kalshi proxy: ${formatDelta(delta)} over 7d`,
      context: 'The numeric signal is only the selected contract’s seven-day probability change; the scenario lens is not independently observed.',
      signal: clampSignal(delta / 15),
    }
  }

  const longerTrend = (index: number): FactorMeasurement => {
    const prior = pointAtOrBefore(points, index, 30)
    const delta = points[index].probability - points[prior].probability
    return {
      reading: `Kalshi proxy: ${formatDelta(delta)} over 30d`,
      context: 'The numeric signal is only the selected contract’s thirty-day probability change; the scenario lens is not independently observed.',
      signal: clampSignal(delta / 25),
    }
  }

  const consistency = (index: number): FactorMeasurement => {
    const start = pointAtOrBefore(points, index, 14)
    const window = points.slice(start, index + 1)
    const changes = window.slice(1).map((point, offset) => point.probability - window[offset].probability)
    const upDays = changes.filter((change) => change > 0).length
    const ratio = changes.length ? upDays / changes.length : 0.5
    return {
      reading: `Kalshi proxy: ${upDays}/${changes.length || 1} sessions closed higher`,
      context: 'The numeric signal is only the share of Kalshi sessions closing higher; the scenario lens is not independently observed.',
      signal: clampSignal((ratio - 0.5) * 2),
    }
  }

  const rangePosition = (index: number): FactorMeasurement => {
    const start = pointAtOrBefore(points, index, 30)
    const window = points.slice(start, index + 1).map((point) => point.probability)
    const low = Math.min(...window)
    const high = Math.max(...window)
    const midpoint = (low + high) / 2
    const signal = high === low ? 0 : (points[index].probability - midpoint) / ((high - low) / 2)
    return {
      reading: `Kalshi proxy: ${points[index].probability.toFixed(1)}% in ${low.toFixed(1)}–${high.toFixed(1)}% range`,
      context: 'The numeric signal is only the contract’s position in its trailing thirty-day range; the scenario lens is not independently observed.',
      signal: clampSignal(signal),
    }
  }

  const activity = (index: number): FactorMeasurement => {
    const start = pointAtOrBefore(points, index, 7)
    const currentVolume = points.slice(start, index + 1).reduce((sum, point) => sum + point.volume, 0)
    const priorStart = pointAtOrBefore(points, start, 7)
    const priorVolume = points.slice(priorStart, Math.max(priorStart + 1, start)).reduce((sum, point) => sum + point.volume, 0)
    const change = priorVolume > 0 ? ((currentVolume - priorVolume) / priorVolume) * 100 : 0
    return {
      reading: `Kalshi proxy: ${Math.round(currentVolume).toLocaleString()} contracts over 7d (${change >= 0 ? '+' : ''}${change.toFixed(0)}%)`,
      context: 'The numeric signal is only Kalshi volume versus the prior seven-day window; the scenario lens is not independently observed.',
      signal: clampSignal(change / 100),
    }
  }

  const measurements: Record<FactorSignal, (index: number) => FactorMeasurement> = {
    'recent-move': recentMomentum,
    'longer-trend': longerTrend,
    'direction-consistency': consistency,
    'range-position': rangePosition,
    'volume-attention': activity,
  }
  return factors.map((factor) => buildFactor(factor, points, checkpointIndexes, measurements[factor.signal]))
}

const buildCheckpoints = (points: KalshiPricePoint[], indexes: number[], briefings: Record<CheckpointId, CheckpointBriefing>): Checkpoint[] => checkpointIds.map((id, index) => ({
  id,
  label: `${checkpointDays[index]} days before Kalshi settlement`,
  shortLabel: `${checkpointDays[index]}d`,
  date: formatDate(points[indexes[index]].timestamp),
  cutoffTimestamp: points[indexes[index]].timestamp,
  marketProbability: Math.round(points[indexes[index]].probability * 10) / 10,
  briefing: briefings[id],
}))

const buildMarketHistory = (points: KalshiPricePoint[], indexes: number[], outcome: boolean | null, market: KalshiMarket): MarketPoint[] => {
  const history: MarketPoint[] = indexes.map((index) => ({
    label: points[index].label,
    probability: points[index].probability,
    timestamp: points[index].timestamp,
  }))
  const latest = points[points.length - 1]
  if (latest.timestamp !== history[history.length - 1].timestamp) history.push({ label: 'Latest', probability: latest.probability, timestamp: latest.timestamp })
  if (outcome !== null) history.push({
    label: 'Resolution',
    probability: outcome ? 100 : 0,
    timestamp: market.settlement_ts ?? market.close_time ?? new Date().toISOString(),
    resolution: true,
  })
  return history
}

const buildScenario = async (config: KalshiMarketConfig): Promise<Scenario> => {
  const { market, points, fetchedAt } = await loadKalshiMarketSeries(config)
  if (points.length < 10) throw new Error(`${config.ticker} returned too little usable Kalshi history.`)
  const details = editorial[config.id]
  if (!details) throw new Error(`${config.ticker} is missing its event-specific editorial configuration.`)
  const outcome = resolvedOutcome(market)
  if (outcome === null) throw new Error(`${config.ticker} has no verified YES/NO Kalshi settlement result.`)
  const resolutionTimestamp = market.settlement_ts
  if (!resolutionTimestamp || Date.parse(resolutionTimestamp) >= Date.now()) throw new Error(`${config.ticker} does not have a past Kalshi settlement timestamp.`)
  if (!market.close_time || Date.parse(market.close_time) >= Date.now()) throw new Error(`${config.ticker} does not have a past Kalshi close time.`)
  const volume = numeric(market.volume_fp)
  if (volume < 500_000) throw new Error(`${config.ticker} has only ${volume.toLocaleString()} traded contracts; the catalog requires at least 500,000.`)
  const checkpointIndexes = checkpointIndexesFor(points, resolutionTimestamp)
  return {
    id: config.id,
    title: market.title ?? config.label,
    shortTitle: config.label,
    question: market.title ?? config.label,
    category: details.category,
    categoryTone: details.categoryTone,
    dek: details.dek,
    context: details.context,
    resolutionDate: formatDate(resolutionTimestamp),
    resolutionTimestamp,
    outcome,
    outcomeLabel: `Kalshi settled ${outcome ? 'YES' : 'NO'}.`,
    resolutionBriefing: details.resolutionBriefing,
    checkpoints: buildCheckpoints(points, checkpointIndexes, details.briefings),
    marketHistory: buildMarketHistory(points, checkpointIndexes, outcome, market),
    factors: buildFactors(points, checkpointIndexes, details.factors),
    source: {
      provider: 'Kalshi',
      ticker: config.ticker,
      eventTicker: config.eventTicker,
      seriesTicker: config.seriesTicker,
      fetchedAt,
      sourceUrl: `https://external-api.kalshi.com/trade-api/v2/historical/markets/${encodeURIComponent(config.ticker)}`,
      volume,
      openInterest: numeric(market.open_interest_fp),
    },
    live: true,
  }
}

export async function loadKalshiScenarios(): Promise<Scenario[]> {
  if (KALSHI_SOURCE_CATALOG.length !== 4) throw new Error(`Forecast requires exactly four qualifying Kalshi markets; catalog has ${KALSHI_SOURCE_CATALOG.length}.`)
  const scenarios = await Promise.all(KALSHI_SOURCE_CATALOG.map(buildScenario))
  if (scenarios.length < 4) throw new Error(`Forecast requires four qualifying settled Kalshi markets; only ${scenarios.length} loaded.`)
  return scenarios
}
