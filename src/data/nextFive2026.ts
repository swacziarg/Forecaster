import type { Study } from '../domain/study.ts'
import type { DailyPuzzle } from '../domain/dailyGame.ts'

export const nextFiveStudies = [
  {
    "id": "trump-comeback-2024-v2",
    "slug": "trump-comeback-2024",
    "category": "Politics",
    "version": 2,
    "status": "published",
    "question": "Will Donald Trump win the 2024 US Presidential Election?",
    "orientation": "Historical YES-contract series study. Contract prices are reported as observed market data, not as an election forecast or an assessment of any candidate.",
    "market": {
      "id": "253591",
      "provider": "Polymarket",
      "title": "Will Donald Trump win the 2024 US Presidential Election?",
      "rules": "YES if Donald J. Trump wins the 2024 US presidential election. AP, Fox News and NBC must all call the same winner; if they had not agreed by January 20, 2025, the inauguration determined resolution.",
      "openedAt": "2024-01-04T22:58:00Z",
      "closedAt": "2024-11-06T15:17:41Z",
      "status": "settled",
      "resolutionSourceUrl": "https://www.ap.org/the-definitive-source/behind-the-news/calling-the-2024-presidential-race-state-by-state/",
      "marketUrl": "https://polymarket.com/event/presidential-election-winner-2024/will-donald-trump-win-the-2024-us-presidential-election"
    },
    "contract": {
      "id": "21742633143463906290569050155826241533067272736897614950488156847949938836455",
      "proposition": "Donald Trump wins the 2024 US presidential election",
      "nativeSide": "YES",
      "selectedPerspective": "YES",
      "resolution": "YES"
    },
    "dataset": {
      "id": "polymarket-trump-2024-hourly-v2",
      "provider": "Polymarket",
      "path": "/data/next-five/trump-comeback-2024-v2/hourly.csv",
      "rawPath": "/data/next-five/trump-comeback-2024-v2/raw-history.json",
      "marketMetadataPath": "/data/next-five/trump-comeback-2024-v2/market.json",
      "manifestPath": "/data/next-five/trump-comeback-2024-v2/manifest.json",
      "rawSha256": "c001a6215404757baa1b2a0efab0e23aa9ed90d571abdd5cb1ed2b89f6321673",
      "marketMetadataSha256": "7c59b9a4930ed53711cdb971d7f0c15e3a403c4f18e711fa0381ac7b8b993636",
      "normalizedSha256": "7756111859cbca9f2185795608029323fb21e9505f0314d4700cf7d8b9cc579d",
      "retrievedAt": "2026-09-06T00:21:49Z",
      "coverageStart": "2024-05-01T00:00:00Z",
      "coverageEnd": "2024-11-06T15:00:00Z",
      "fullMarketLifetime": false,
      "cadenceMinutes": 60,
      "transformVersion": "polymarket-hourly-v1",
      "provenanceUrl": "https://docs.polymarket.com/api-reference/markets/get-prices-history",
      "requestParameters": "token_id=21742633143463906290569050155826241533067272736897614950488156847949938836455; fidelity=60; bounded hourly chunks; latest source price per UTC hour; no filling",
      "rawHashMeaning": "SHA-256 of rawPath bundle; individual original response file byte hashes are also retained inside it.",
      "normalizedHashMeaning": "SHA-256 of the exact CSV at dataset.path. Previous draft put the CSV hash in rawSha256 and the separately normalized JSON hash in normalizedSha256."
    },
    "measurementProfile": {
      "id": "months-hourly-v1",
      "label": "Months / hourly",
      "cadenceMinutes": 60,
      "anticipation": {
        "startHours": -84,
        "endHours": -12
      },
      "reference": {
        "startHours": -12,
        "endHours": 0
      },
      "immediate": {
        "startHours": 0,
        "endHours": 6
      },
      "stabilized": {
        "startHours": 18,
        "endHours": 36
      },
      "delayed": {
        "startHours": 48,
        "endHours": 72
      },
      "quality": {
        "minimumCoverage": 0.6,
        "maximumGapShare": 0.5,
        "minimumDistinctUpdates": 3,
        "maximumSpread": 0.2
      },
      "tieThreshold": 0.01
    },
    "presentation": {
      "topicLabel": "Trump 2024 election contract",
      "selectedContractShort": "YES",
      "selectedContractLong": "Observed YES-contract price",
      "seriesLabel": "Polymarket YES contract price",
      "positiveLabel": "Higher observed contract price",
      "negativeLabel": "Lower observed contract price",
      "positiveShortLabel": "Higher",
      "negativeShortLabel": "Lower",
      "neutralLabel": "No detectable change",
      "eventNoun": "development",
      "timezone": "UTC",
      "accent": "#D97706",
      "zoomChoices": [
        {
          "label": "All",
          "hours": null
        },
        {
          "label": "30 days",
          "hours": 720
        },
        {
          "label": "7 days",
          "hours": 168
        }
      ]
    },
    "sources": [
      {
        "id": "nyc-da-conviction",
        "title": "D.A. Bragg Announces 34-Count Felony Trial Conviction of Donald J. Trump",
        "publisher": "Manhattan District Attorney's Office",
        "url": "https://manhattanda.org/d-a-bragg-announces-34-count-felony-trial-conviction-of-donald-j-trump/",
        "publishedAt": "2024-05-30",
        "publishedPrecision": "day",
        "retrievedAt": "2026-09-06T20:18:05Z",
        "snapshotHash": "86453ede63e5a161e086c6a15d6ed2b5f2e138efefd52a255d7a45eb19b23366"
      },
      {
        "id": "cnn-conviction-broadcast",
        "title": "CNN contemporary verdict coverage",
        "publisher": "CNN",
        "url": "https://transcripts.cnn.com/show/se/date/2024-05-30/segment/05",
        "publishedAt": "2024-05-30T21:15:07Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-06T05:12:35.552586Z",
        "snapshotHash": "f54b40c115dce68ee8e5aec94164807c530b122271e73f14821f9bcad9c356d3",
        "sourceIdentity": "historical-public-broadcast",
        "snapshotKind": "retrospective-transcript",
        "timestampMeaning": "Historical broadcast upper bound based on transcript markers, not HTML upload time. Transcript retained later and may contain corrections."
      },
      {
        "id": "nyc-court-verdict",
        "title": "New York court record",
        "publisher": "New York State Law Reporting Bureau",
        "url": "https://www.nycourts.gov/reporter/3dseries/2024/2024_24328.htm",
        "publishedAt": "",
        "publishedPrecision": "unknown",
        "retrievedAt": "2026-09-06T20:18:05Z",
        "snapshotHash": "cb7055e15d2f3c6977725b26009a19dc660f6bee4237651ca0271f26bffe2638",
        "timestampMeaning": "Later judicial record; May30 is verdict occurrence, not verified publication of this court page."
      },
      {
        "id": "cnn-butler-broadcast",
        "title": "CNN contemporary Butler coverage",
        "publisher": "CNN",
        "url": "https://transcripts.cnn.com/show/cnr/date/2024-07-13/segment/08",
        "publishedAt": "2024-07-13T23:35:06Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-06T00:26:48.413330Z",
        "snapshotHash": "4108d635e69bc8b700d6402210932f9ffe5cea8175974140abff9f51ca852196",
        "sourceIdentity": "historical-public-broadcast",
        "snapshotKind": "retrospective-transcript",
        "timestampMeaning": "Historical broadcast upper bound based on transcript markers, not HTML upload time. Transcript retained later and may contain corrections."
      },
      {
        "id": "rfk-address",
        "title": "Why I am suspending my campaign for President",
        "publisher": "Robert F. Kennedy Jr.",
        "url": "https://robertfkennedyjr.substack.com/p/why-i-am-suspending-my-campaign-for",
        "publishedAt": "2024-08-23",
        "publishedPrecision": "day",
        "retrievedAt": "2026-09-06T20:18:05Z",
        "snapshotHash": "2c6ef031036e5f9d11ffebcf631cce09cf8689aaceadf189599c95eb45f7499e"
      },
      {
        "id": "cnn-rfk-broadcast",
        "title": "CNN contemporary RFK Jr. coverage",
        "publisher": "CNN",
        "url": "https://transcripts.cnn.com/show/cnc/date/2024-08-23/segment/11",
        "publishedAt": "2024-08-23T19:10:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-06T05:12:35.427398Z",
        "snapshotHash": "c8e8bdf6a92f95738c6cf6b367e259c42f559853bd22d2bb587b66e33f526125",
        "sourceIdentity": "historical-public-broadcast",
        "snapshotKind": "retrospective-transcript",
        "timestampMeaning": "Historical broadcast upper bound based on transcript markers, not HTML upload time. Transcript retained later and may contain corrections."
      },
      {
        "id": "abc-schedule",
        "title": "ABC News presidential debate schedule and rules",
        "publisher": "ABC",
        "url": "https://abc.com/news/6abdd5ab-5cdc-48c2-8184-8be2f1a532c1/category/1138628",
        "publishedAt": "2024-09-07",
        "publishedPrecision": "day",
        "retrievedAt": "2026-09-06T20:18:05Z",
        "snapshotHash": "89f0136ea9489a322e4c02ce3604072ba24644304c22533a3bc53c5ad41b84a7"
      },
      {
        "id": "nielsen-debate-window",
        "title": "Over 67 Million Viewers Tune In for ABC News Harris-Trump Debate",
        "publisher": "Nielsen",
        "url": "https://www.nielsen.com/news-center/2024/over-67-million-viewers-tune-in-for-abc-news-harris-trump-debate/",
        "publishedAt": "2024-09-11",
        "publishedPrecision": "day",
        "retrievedAt": "2026-09-06T20:18:05Z",
        "snapshotHash": "554b3e45d355bc29f4f462998bd9c1cb3261d3690d984417a18e3470c5f593b4"
      },
      {
        "id": "abc-replay",
        "title": "Watch the full ABC News presidential debate",
        "publisher": "ABC News",
        "url": "https://abcnews.com/Politics/watch-full-abc-news-presidential-debate/story?id=113470583",
        "publishedAt": "2024-09-11",
        "publishedPrecision": "day",
        "retrievedAt": "2026-09-06T20:18:05Z",
        "snapshotHash": "f61999a59e32ad6d3e0e588ae2144dc97a84e790fde652b892688dde705506f2"
      },
      {
        "id": "cnn-iowa-broadcast",
        "title": "CNN contemporary Iowa poll coverage",
        "publisher": "CNN",
        "url": "https://transcripts.cnn.com/show/cnr/date/2024-11-02/segment/08",
        "publishedAt": "2024-11-02T23:05:01Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-06T05:44:52.283926Z",
        "snapshotHash": "1ad80d8fe3c5fcdf853458e504dab6556557c387356d50a4941319fdb0e11152",
        "sourceIdentity": "historical-public-broadcast",
        "snapshotKind": "retrospective-transcript",
        "timestampMeaning": "Historical broadcast upper bound based on transcript markers, not HTML upload time. Transcript retained later and may contain corrections."
      },
      {
        "id": "reuters-iowa",
        "title": "Harris tops Trump in latest Iowa poll",
        "publisher": "Reuters / Investing.com",
        "url": "https://www.investing.com/news/world-news/harris-tops-trump-in-latest-iowa-poll-marking-turnaround-des-moines-register-survey-3698510",
        "publishedAt": "2024-11-02",
        "publishedPrecision": "day",
        "retrievedAt": "2026-09-06T20:18:05Z",
        "snapshotHash": "7e7dd3bcf6a5bea3c2fe139527e06084ca4848d0197ee2e1160c2ac1a6c3c70b"
      },
      {
        "id": "ap-election-call",
        "title": "Calling the 2024 presidential race state by state",
        "publisher": "Associated Press",
        "url": "https://www.ap.org/the-definitive-source/behind-the-news/calling-the-2024-presidential-race-state-by-state/",
        "publishedAt": "2024-11-06",
        "publishedPrecision": "day",
        "retrievedAt": "2026-09-06T05:12:36.157709Z",
        "snapshotHash": "59859fe7e8ae949bf791dc2eb98b246fd8de0fc6d4527350d36eec4f66209a76"
      },
      {
        "id": "debate-live-event",
        "title": "ABC Harris–Trump debate broadcast",
        "publisher": "ABC News",
        "url": "https://abcnews.com/Politics/watch-full-abc-news-presidential-debate/story?id=113470583",
        "publishedAt": "2024-09-11T02:45:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-06T20:18:05Z",
        "snapshotHash": "f61999a59e32ad6d3e0e588ae2144dc97a84e790fde652b892688dde705506f2",
        "sourceIdentity": "historical-public-broadcast",
        "snapshotKind": "retrospective-broadcast-record",
        "snapshotSourceId": "abc-replay",
        "timestampMeaning": "Approximate live broadcast end per Nielsen 9:00–10:45pm EDT interval, not publication of the replay page. Full replay is retrospective corroboration of a publicly observable event."
      }
    ],
    "events": [
      {
        "id": "conviction",
        "title": "New York jury finds Trump guilty on 34 felony counts",
        "shortTitle": "Conviction",
        "occurredAt": "2024-05-30",
        "informationKnownAt": "2024-05-30T21:15:07Z",
        "precision": "minute",
        "timezone": "America/New_York",
        "dateLabel": "May 30",
        "category": "Legal",
        "mechanism": "Historic legal verdict versus campaign mobilization.",
        "expectedDirection": "ambiguous",
        "claims": [
          {
            "id": "conviction-fact",
            "text": "A New York jury finds Trump guilty on 34 felony counts of falsifying business records in the first degree.",
            "knownAt": "2024-05-30T21:15:07Z",
            "sourceIds": [
              "cnn-conviction-broadcast"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "cnn-conviction-broadcast",
            "role": "primary"
          },
          {
            "sourceId": "nyc-da-conviction",
            "role": "retrospective"
          },
          {
            "sourceId": "nyc-court-verdict",
            "role": "retrospective"
          }
        ],
        "retrospectiveInterpretation": "The observed contract series moved lower in the stabilized window; this is a descriptive association, not a causal attribution.",
        "competingExplanation": "Other campaign, legal, and market information overlapped the broad windows.",
        "attributionAssessment": "indeterminate"
      },
      {
        "id": "butler",
        "title": "Trump survives a shooting at his Pennsylvania rally",
        "shortTitle": "Butler shooting",
        "occurredAt": "2024-07-13",
        "informationKnownAt": "2024-07-13T23:35:06Z",
        "precision": "interval",
        "timezone": "America/New_York",
        "dateLabel": "Jul 13",
        "category": "Campaign",
        "mechanism": "A major campaign shock may change attention and coalition narratives.",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "butler-fact",
            "text": "Contemporary coverage reported that Trump survived a shooting at his Pennsylvania rally on July 13, 2024.",
            "knownAt": "2024-07-13T23:35:06Z",
            "sourceIds": [
              "cnn-butler-broadcast"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "cnn-butler-broadcast",
            "role": "primary"
          }
        ],
        "retrospectiveInterpretation": "The observed contract series moved higher in the stabilized window; this is a descriptive association, not a causal attribution.",
        "competingExplanation": "The retained broadcast bracket and surrounding campaign information leave attribution uncertain.",
        "attributionAssessment": "indeterminate"
      },
      {
        "id": "rfk-endorsement",
        "title": "Robert F. Kennedy Jr. suspends his campaign and endorses Trump",
        "shortTitle": "RFK Jr. endorsement",
        "occurredAt": "2024-08-23",
        "informationKnownAt": "2024-08-23T19:10:00Z",
        "precision": "interval",
        "timezone": "America/New_York",
        "dateLabel": "Aug 23",
        "category": "Candidate change",
        "mechanism": "A rival campaign suspension and endorsement may change coalition narratives.",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "rfk-fact",
            "text": "Kennedy says he is suspending his presidential campaign and supporting Donald Trump.",
            "knownAt": "2024-08-23T19:10:00Z",
            "sourceIds": [
              "cnn-rfk-broadcast"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "rfk-address",
            "role": "primary"
          },
          {
            "sourceId": "cnn-rfk-broadcast",
            "role": "coverage"
          }
        ],
        "retrospectiveInterpretation": "The observed contract series moved lower in the stabilized window; this is a descriptive association, not a causal attribution.",
        "competingExplanation": "The endorsement followed other campaign developments and the public-release minute is bracketed rather than exact.",
        "attributionAssessment": "indeterminate"
      },
      {
        "id": "harris-debate",
        "title": "Harris and Trump meet in their first presidential debate",
        "shortTitle": "Harris–Trump debate",
        "occurredAt": "2024-09-10T21:00:00-04:00",
        "informationKnownAt": "2024-09-11T02:45:00Z",
        "precision": "interval",
        "timezone": "America/New_York",
        "dateLabel": "Sep 10",
        "category": "Debate",
        "mechanism": "A nationally televised debate may change campaign narratives.",
        "expectedDirection": "ambiguous",
        "claims": [
          {
            "id": "debate-schedule",
            "text": "ABC hosts the first presidential debate between Harris and Trump on September 10.",
            "knownAt": "2024-09-11T02:45:00Z",
            "sourceIds": [
              "debate-live-event"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "abc-schedule",
            "role": "primary"
          },
          {
            "sourceId": "nielsen-debate-window",
            "role": "retrospective"
          },
          {
            "sourceId": "abc-replay",
            "role": "retrospective"
          },
          {
            "sourceId": "debate-live-event",
            "role": "primary"
          }
        ],
        "retrospectiveInterpretation": "The observed contract series moved lower in the stabilized window; this is a descriptive association, not a causal attribution.",
        "competingExplanation": "The debate cutoff is approximate and the broad windows include other campaign information.",
        "attributionAssessment": "indeterminate"
      },
      {
        "id": "iowa-poll",
        "title": "Final Iowa Poll puts Harris ahead of Trump, 47% to 44%",
        "shortTitle": "Final Iowa Poll",
        "occurredAt": "2024-11-02",
        "informationKnownAt": "2024-11-02T23:05:01Z",
        "precision": "interval",
        "timezone": "America/New_York",
        "dateLabel": "Nov 2",
        "category": "Polling",
        "mechanism": "A late state poll may change campaign narratives.",
        "expectedDirection": "negative",
        "claims": [
          {
            "id": "iowa-fact",
            "text": "The Des Moines Register/Mediacom Iowa poll shows Harris at 47% and Trump at 44%, within its 3.4-point margin of error.",
            "knownAt": "2024-11-02T23:05:01Z",
            "sourceIds": [
              "cnn-iowa-broadcast"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "cnn-iowa-broadcast",
            "role": "primary"
          },
          {
            "sourceId": "reuters-iowa",
            "role": "corroborating"
          }
        ],
        "retrospectiveInterpretation": "The observed contract series moved lower in the stabilized window and higher by the delayed window; this is a descriptive association, not a causal attribution.",
        "competingExplanation": "The poll was within its margin of error and the delayed window reaches election-night information.",
        "attributionAssessment": "indeterminate"
      }
    ],
    "contextMarkers": [],
    "conclusion": {
      "title": "Reveal-only resolution",
      "text": "The AP documented its 2024 presidential race call for Trump on November 6, 2024. This conclusion is reveal-only and is excluded from pre-reveal claims and the five event cards.",
      "sourceId": "ap-election-call"
    },
    "measurementNotes": [
      "Audit tightens Butler, RFK and Iowa to complete-claim broadcast bounds. Conviction and debate unchanged. Price series and tie threshold unchanged.",
      "Iowa sample size removed because the retained CNN segment does not state 808. Conviction claim describes the verdict rather than claiming a timestamped DA release. Debate historical live-event evidence is separate from retrospective replay publication.",
      "Butler is anchored to confirmed contemporary coverage, later than actual shots; earlier rally footage and other campaign news can affect the reference window. Marginal ties must be treated as window-dependent.",
      "Audit corrected raw versus normalized file-hash labels. Original provider responses and CSV bytes remain unchanged."
    ]
  },
  {
    "id": "thunder-first-title-2025-v3",
    "slug": "thunder-first-title-2025",
    "category": "Sports",
    "version": 3,
    "status": "published",
    "question": "What changed the Thunder’s chance of winning their first title?",
    "orientation": "November 2024–May 2025. Rank five headlines from the biggest rise in Oklahoma City’s chance of winning the NBA championship to the biggest fall.",
    "measurementNotes": [
      "Preserve MONTHS_PROFILE and one-point v2 tie rule. Compare median [-12,0) vs [18,36) hours relative to public result/announcement cutoff. Game reference includes live play, so explicitly compare with a separately reported pre-tip baseline diagnostic.",
      "Game timestamps describe publicly observable results, not website/PDF upload times. The official scorer PDFs have unknown publication times and are retrospective corroboration only.",
      "Fracture uses the original team diagnosis release, not the earlier fall report. Return uses the player’s announcement, not a later recap of his first game back.",
      "Historical price changes are descriptive; no isolated causality is claimed. In-game repricing and other league news can enter event windows.",
      "The NBA Cup is separate from the June NBA championship contract. Its result does not settle the selected contract.",
      "All raw observations, gaps, and rejected rows are preserved. No rounding or tie-threshold change was made to improve the puzzle."
    ],
    "market": {
      "id": "507884",
      "provider": "Polymarket",
      "title": "Will the Oklahoma City Thunder win the 2025 NBA Finals?",
      "rules": "YES if Oklahoma City wins the 2024–25 NBA Championship; otherwise NO. The contract can resolve NO when the outcome becomes impossible under NBA rules. Resolution source: NBA information.",
      "openedAt": "2024-09-24T17:04:06.478Z",
      "closedAt": "2025-06-23T07:32:33Z",
      "status": "settled",
      "resolutionSourceUrl": "https://www.nba.com/game/IND-vs-OKC-0042400407",
      "marketUrl": "https://polymarket.com/event/nba-champion-2024-2025/will-the-oklahoma-city-thunder-win-the-2025-nba-finals",
      "volume": 17203993.307106
    },
    "contract": {
      "id": "83527644927648970835156950007024690327726158617181889316317174894904268227846",
      "proposition": "Oklahoma City Thunder win the 2025 NBA Finals",
      "nativeSide": "YES",
      "selectedPerspective": "YES",
      "resolution": "YES"
    },
    "dataset": {
      "id": "polymarket-thunder-2025-hourly-v1",
      "provider": "Polymarket",
      "path": "/data/next-five/thunder-first-title-2025-v3/hourly.csv",
      "rawPath": "/data/next-five/thunder-first-title-2025-v3/raw-history.json",
      "marketMetadataPath": "/data/next-five/thunder-first-title-2025-v3/market.json",
      "manifestPath": "/data/next-five/thunder-first-title-2025-v3/manifest.json",
      "rawSha256": "e2a215cb995e4fcaf52e923e9809df1dcf78680d91f004cdfb33f328bd523130",
      "marketMetadataSha256": "15a94415c2be5b93830986e23b76cdae77e5bbaa4e8f68f105c860ec4df6b768",
      "normalizedSha256": "558a508d02ddf5ef25a91a5a56d95b3e35220e2e82c6bc880626e604ae892664",
      "retrievedAt": "2026-09-10T16:01:01.306Z",
      "coverageStart": "2024-09-24T19:00:00Z",
      "coverageEnd": "2025-06-23T07:00:00Z",
      "fullMarketLifetime": false,
      "cadenceMinutes": 60,
      "transformVersion": "polymarket-hourly-v1",
      "provenanceUrl": "https://docs.polymarket.com/api-reference/markets/get-prices-history",
      "requestParameters": "token_id=83527644927648970835156950007024690327726158617181889316317174894904268227846; fidelity=60; 28 ten-day chunks"
    },
    "measurementProfile": {
      "id": "months-hourly-v1",
      "label": "Months / hourly",
      "cadenceMinutes": 60,
      "anticipation": {
        "startHours": -84,
        "endHours": -12
      },
      "reference": {
        "startHours": -12,
        "endHours": 0
      },
      "immediate": {
        "startHours": 0,
        "endHours": 6
      },
      "stabilized": {
        "startHours": 18,
        "endHours": 36
      },
      "delayed": {
        "startHours": 48,
        "endHours": 72
      },
      "quality": {
        "minimumCoverage": 0.6,
        "maximumGapShare": 0.5,
        "minimumDistinctUpdates": 3,
        "maximumSpread": 0.2
      },
      "tieThreshold": 0.01
    },
    "presentation": {
      "topicLabel": "Thunder first title",
      "selectedContractShort": "Thunder win",
      "selectedContractLong": "Oklahoma City Thunder win the 2025 NBA Finals",
      "seriesLabel": "Thunder championship probability",
      "positiveLabel": "Probability rose",
      "negativeLabel": "Probability fell",
      "neutralLabel": "Ambiguous",
      "eventNoun": "basketball moment",
      "timezone": "America/Chicago",
      "accent": "#d44b2f",
      "zoomChoices": [
        {
          "label": "All",
          "hours": null
        },
        {
          "label": "30d",
          "hours": 720
        },
        {
          "label": "14d",
          "hours": 336
        },
        {
          "label": "7d",
          "hours": 168
        }
      ]
    },
    "sources": [
      {
        "id": "cup-loss-live-result",
        "title": "NBA live game result: cup-loss",
        "publisher": "NBA (public live game)",
        "url": "https://www.nba.com/game/0062400001",
        "publishedAt": "2024-12-18T04:02:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T16:48:40.949872+00:00",
        "snapshotHash": "b14142fb0c3a5d257162359fe8a998d2d5edccfa4bc0fe1bb1bfd5768ade81b4",
        "capturePath": "/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/next-five-2026-09-10/sports-repair/games/cup-book.pdf",
        "sourceIdentity": "public-live-event",
        "snapshotKind": "retrospective-evidence",
        "snapshotSourceId": "cup-loss-scorebook",
        "captureMeaning": "Retrospective official record of the live event, not an archived webpage or a recording of the broadcast.",
        "timestampMeaning": "Historical public game result, not publication time of this mutable page or the subsequently retrieved PDF. Reconstructed from official scorer record and arena timezone."
      },
      {
        "id": "cup-loss-scorebook",
        "title": "Official NBA scorer report: cup-loss",
        "publisher": "NBA official scorer",
        "url": "https://statsdmz.nba.com/pdfs/20241217/20241217_MILOKC_book.pdf",
        "publishedAt": "",
        "publishedPrecision": "unknown",
        "retrievedAt": "2026-09-10T16:48:40.949872+00:00",
        "snapshotHash": "b14142fb0c3a5d257162359fe8a998d2d5edccfa4bc0fe1bb1bfd5768ade81b4",
        "timestampMeaning": "PDF publication time is unknown. Retrospective corroboration of game date, venue, score and finish only."
      },
      {
        "id": "denver-game-seven-live-result",
        "title": "NBA live game result: denver-game-seven",
        "publisher": "NBA (public live game)",
        "url": "https://www.nba.com/game/0042400227",
        "publishedAt": "2025-05-18T22:02:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T16:48:40.949872+00:00",
        "snapshotHash": "9e14132473c953430ed64216c1e4d2b41e66e0695c8b2f84065ce442301640a4",
        "capturePath": "/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/next-five-2026-09-10/sports-repair/games/denver-book.pdf",
        "sourceIdentity": "public-live-event",
        "snapshotKind": "retrospective-evidence",
        "snapshotSourceId": "denver-game-seven-scorebook",
        "captureMeaning": "Retrospective official record of the live event, not an archived webpage or a recording of the broadcast.",
        "timestampMeaning": "Historical public game result, not publication time of this mutable page or the subsequently retrieved PDF. Reconstructed from official scorer record and arena timezone."
      },
      {
        "id": "denver-game-seven-scorebook",
        "title": "Official NBA scorer report: denver-game-seven",
        "publisher": "NBA official scorer",
        "url": "https://statsdmz.nba.com/pdfs/20250518/20250518_DENOKC_book.pdf",
        "publishedAt": "",
        "publishedPrecision": "unknown",
        "retrievedAt": "2026-09-10T16:48:40.949872+00:00",
        "snapshotHash": "9e14132473c953430ed64216c1e4d2b41e66e0695c8b2f84065ce442301640a4",
        "timestampMeaning": "PDF publication time is unknown. Retrospective corroboration of game date, venue, score and finish only."
      },
      {
        "id": "west-finals-live-result",
        "title": "NBA live game result: west-finals",
        "publisher": "NBA (public live game)",
        "url": "https://www.nba.com/game/0042400315",
        "publishedAt": "2025-05-29T02:58:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T16:48:40.949872+00:00",
        "snapshotHash": "49df067d7d4b1a3ac1d90960a39f4fa7516d41b7cf7886dee31eff21bbe43235",
        "capturePath": "/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/next-five-2026-09-10/sports-repair/games/finals-berth-book.pdf",
        "sourceIdentity": "public-live-event",
        "snapshotKind": "retrospective-evidence",
        "snapshotSourceId": "west-finals-scorebook",
        "captureMeaning": "Retrospective official record of the live event, not an archived webpage or a recording of the broadcast.",
        "timestampMeaning": "Historical public game result, not publication time of this mutable page or the subsequently retrieved PDF. Reconstructed from official scorer record and arena timezone."
      },
      {
        "id": "west-finals-scorebook",
        "title": "Official NBA scorer report: west-finals",
        "publisher": "NBA official scorer",
        "url": "https://statsdmz.nba.com/pdfs/20250528/20250528_MINOKC_book.pdf",
        "publishedAt": "",
        "publishedPrecision": "unknown",
        "retrievedAt": "2026-09-10T16:48:40.949872+00:00",
        "snapshotHash": "49df067d7d4b1a3ac1d90960a39f4fa7516d41b7cf7886dee31eff21bbe43235",
        "timestampMeaning": "PDF publication time is unknown. Retrospective corroboration of game date, venue, score and finish only."
      },
      {
        "id": "fracture-official",
        "title": "Chet Holmgren Injury Update",
        "publisher": "Oklahoma City Thunder",
        "url": "https://www.nba.com/thunder/news/holmgren-241111",
        "publishedAt": "2024-11-11T06:26:15Z",
        "updatedAt": "2024-11-11T06:26:15Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T16:48:40.949872+00:00",
        "snapshotHash": "d70d087e781f8151037927d185da034537eb830f1fbb59db0ba637466989d7f2"
      },
      {
        "id": "return-player-announcement",
        "title": "Chet Holmgren announces his return",
        "publisher": "Chet Holmgren",
        "url": "https://twitter.com/ChetHolmgren/status/1887512110986633513",
        "publishedAt": "2025-02-06T14:42:10.195000Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T16:48:40.949872+00:00",
        "snapshotHash": "2418d7cd8b58e976921a9f25564fa98a236a32816d5c5a03d95f3f617c4c6ad0",
        "capturePath": "/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/next-five-2026-09-10/sports/evidence/chet-return.html",
        "captureMeaning": "Article HTML embeds the original player post text and ID. Later article game recap is excluded from the pre-reveal claim."
      },
      {
        "id": "thunder-ending",
        "title": "Game 7: Thunder beat Pacers 103–91 for NBA title",
        "publisher": "NBA.com",
        "url": "https://www.nba.com/game/IND-vs-OKC-0042400407",
        "publishedAt": "2025-06-23",
        "publishedPrecision": "day",
        "retrievedAt": "2026-09-10T16:06:51.219828+00:00",
        "archivedUrl": "https://www.nba.com/game/IND-vs-OKC-0042400407",
        "snapshotHash": "212822549afd69236e017eb4215087d33fbe89265dc71a0362b2be57c652192d",
        "correctionStatus": "none"
      }
    ],
    "events": [
      {
        "id": "chet-injury",
        "title": "Chet Holmgren suffers a pelvic fracture",
        "shortTitle": "Holmgren injury",
        "occurredAt": "2024-11-11T06:26:15Z",
        "informationKnownAt": "2024-11-11T06:26:15Z",
        "precision": "minute",
        "timezone": "America/Chicago",
        "dateLabel": "Nov 11",
        "category": "Injury",
        "mechanism": "A core two-way starter’s injury changes the Thunder’s playoff ceiling and frontcourt depth, even with a return expected during the season.",
        "expectedDirection": "negative",
        "claims": [
          {
            "id": "chet-injury-fact",
            "text": "The Thunder announced Holmgren’s right iliac wing fracture, with an update on his return-to-play protocol to follow in eight to ten weeks.",
            "knownAt": "2024-11-11T06:26:15Z",
            "sourceIds": [
              "fracture-official"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "fracture-official",
            "role": "primary"
          }
        ],
        "retrospectiveInterpretation": "Observed response around the corrected public-result or announcement cutoff; not a causal estimate.",
        "competingExplanation": "The injury announcement followed the Golden State loss and coincided with other early-season information.",
        "attributionAssessment": "likely dominant"
      },
      {
        "id": "cup-loss",
        "title": "Thunder lose the NBA Cup final to Milwaukee",
        "shortTitle": "Thunder lose the NBA Cup final to Milwaukee",
        "occurredAt": "2024-12-18T04:01:00Z",
        "informationKnownAt": "2024-12-18T04:02:00Z",
        "precision": "minute",
        "timezone": "America/Los_Angeles",
        "dateLabel": "2024-12-17",
        "category": "Team development",
        "mechanism": "A high-profile loss to an experienced contender tests whether the young team is ready for postseason pressure. The Cup is separate from the NBA championship and does not resolve this contract.",
        "expectedDirection": "negative",
        "claims": [
          {
            "id": "cup-loss-fact",
            "text": "The Bucks win 97–81.",
            "knownAt": "2024-12-18T04:02:00Z",
            "sourceIds": [
              "cup-loss-live-result"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "cup-loss-live-result",
            "role": "primary"
          },
          {
            "sourceId": "cup-loss-scorebook",
            "role": "retrospective"
          }
        ],
        "retrospectiveInterpretation": "Observed response around the corrected public-result or announcement cutoff; not a causal estimate.",
        "competingExplanation": "A high-profile loss to an experienced contender tests whether the young team is ready for postseason pressure. The Cup is separate from the NBA championship and does not resolve this contract.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "chet-return",
        "title": "Chet Holmgren announces his return",
        "shortTitle": "Holmgren’s return announcement",
        "occurredAt": "2025-02-06T14:42:10.195000Z",
        "informationKnownAt": "2025-02-06T14:42:10.195000Z",
        "precision": "minute",
        "timezone": "America/Chicago",
        "dateLabel": "Feb 6",
        "category": "Team development",
        "mechanism": "Restoring a key two-way starter improves depth and lineup options. An announced return may already be anticipated.",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "chet-return-fact",
            "text": "Holmgren publicly announces that he is returning.",
            "knownAt": "2025-02-06T14:42:10.195000Z",
            "sourceIds": [
              "return-player-announcement"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "return-player-announcement",
            "role": "primary"
          }
        ],
        "retrospectiveInterpretation": "Observed response around the corrected public-result or announcement cutoff; not a causal estimate.",
        "competingExplanation": "The return was anticipated; the Feb7 Toronto game also falls inside the broad follow-up interval.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "denver-game-seven",
        "title": "Thunder eliminate Denver in Game 7",
        "shortTitle": "Thunder eliminate Denver in Game 7",
        "occurredAt": "2025-05-18T22:01:00Z",
        "informationKnownAt": "2025-05-18T22:02:00Z",
        "precision": "minute",
        "timezone": "America/Chicago",
        "dateLabel": "2025-05-18",
        "category": "Team development",
        "mechanism": "Surviving an elimination game against a recent champion removes a major title obstacle. Other playoff results share the window.",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "denver-game-seven-fact",
            "text": "Oklahoma City reaches the Western Conference finals.",
            "knownAt": "2025-05-18T22:02:00Z",
            "sourceIds": [
              "denver-game-seven-live-result"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "denver-game-seven-live-result",
            "role": "primary"
          },
          {
            "sourceId": "denver-game-seven-scorebook",
            "role": "retrospective"
          }
        ],
        "retrospectiveInterpretation": "Observed response around the corrected public-result or announcement cutoff; not a causal estimate.",
        "competingExplanation": "Surviving an elimination game against a recent champion removes a major title obstacle. Other playoff results share the window.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "west-finals",
        "title": "Thunder reach the NBA Finals",
        "shortTitle": "Finals berth",
        "occurredAt": "2025-05-29T02:57:00Z",
        "informationKnownAt": "2025-05-29T02:58:00Z",
        "precision": "minute",
        "timezone": "America/Chicago",
        "dateLabel": "May 28",
        "category": "Playoffs",
        "mechanism": "Only one best-of-seven series remains, sharply reducing uncertainty in the championship contract.",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "west-finals-fact",
            "text": "Oklahoma City beat Minnesota 124–94 to win the Western Conference finals 4–1 and advance to the NBA Finals.",
            "knownAt": "2025-05-29T02:58:00Z",
            "sourceIds": [
              "west-finals-live-result"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "west-finals-live-result",
            "role": "primary"
          },
          {
            "sourceId": "west-finals-scorebook",
            "role": "retrospective"
          }
        ],
        "retrospectiveInterpretation": "Observed response around the corrected public-result or announcement cutoff; not a causal estimate.",
        "competingExplanation": "The Eastern Conference finals and award information arrived in the same broad window.",
        "attributionAssessment": "likely dominant"
      }
    ],
    "contextMarkers": [],
    "conclusion": {
      "title": "2025 NBA Finals: Thunder win first title",
      "text": "Oklahoma City defeated Indiana 4–3 in the 2025 NBA Finals, winning Game 7 103–91 on June 22, 2025. The Polymarket Thunder YES contract resolved YES.",
      "sourceId": "thunder-ending"
    }
  },
  {
    "id": "fed-september-2024-v2",
    "slug": "fed-september-2024-five-card",
    "category": "Macroeconomics",
    "version": 2,
    "status": "published",
    "question": "What changed the chance of a half-point Fed rate cut?",
    "orientation": "August–September 2024. Rank five headlines from the biggest rise in the chance of a cut of at least half a percentage point to the biggest fall.",
    "market": {
      "id": "504069",
      "provider": "Polymarket",
      "title": "Fed decreases interest rates by 50+ bps after September 2024 meeting?",
      "rules": "YES if the upper bound of the federal-funds target range falls by at least 50 basis points after the September 2024 meeting.",
      "openedAt": "2024-07-25T14:47:42.952096Z",
      "providerStartDate": "2024-08-02T20:43:54.565Z",
      "closedAt": "2024-09-18T21:09:08Z",
      "status": "settled",
      "resolutionSourceUrl": "https://www.federalreserve.gov/newsevents/pressreleases/monetary20240918a.htm",
      "marketUrl": "https://polymarket.com/event/fed-interest-rates-september-2024/fed-decreases-interest-rates-by-50-bps-after-september-2024-meeting"
    },
    "contract": {
      "id": "106191328358576540351439267765925450329859429577455659884974413809922495874408",
      "proposition": "The Fed decreases rates by at least 50 basis points after its September 2024 meeting",
      "nativeSide": "YES",
      "selectedPerspective": "YES",
      "resolution": "YES"
    },
    "dataset": {
      "id": "polymarket-fed-september-2024-hourly-v2",
      "provider": "Polymarket",
      "path": "/data/next-five/fed-september-2024-v2/hourly.csv",
      "rawPath": "/data/next-five/fed-september-2024-v2/raw-history.json",
      "marketMetadataPath": "/data/next-five/fed-september-2024-v2/market.json",
      "manifestPath": "/data/next-five/fed-september-2024-v2/manifest.json",
      "rawSha256": "be919d763a5464a2d6198c7cb0ebb7f7ec8d99c1243f50e4bf4f0e2b0a5f67dd",
      "marketMetadataSha256": "efaad084b9ff1cfdbdb481fd9c00450aa23c38ddf8cec55912ff2664eb9ae72e",
      "normalizedSha256": "070e10e264ba2f78b4dff984b6fb22d6f2a45305375a71de24c458dfc0dd0d26",
      "retrievedAt": "2026-09-04T03:44:31.385Z",
      "coverageStart": "2024-07-25T19:00:00Z",
      "coverageEnd": "2024-09-18T21:00:00Z",
      "fullMarketLifetime": false,
      "cadenceMinutes": 60,
      "transformVersion": "polymarket-hourly-v1",
      "provenanceUrl": "https://docs.polymarket.com/api-reference/markets/get-prices-history",
      "requestParameters": "token_id=106191328358576540351439267765925450329859429577455659884974413809922495874408; fidelity=60; start=2024-07-25T18:00:00Z; end=2024-09-19T22:00:00Z; 10-day chunks"
    },
    "measurementProfile": {
      "id": "months-hourly-v1",
      "label": "Months / hourly",
      "cadenceMinutes": 60,
      "anticipation": {
        "startHours": -84,
        "endHours": -12
      },
      "reference": {
        "startHours": -12,
        "endHours": 0
      },
      "immediate": {
        "startHours": 0,
        "endHours": 6
      },
      "stabilized": {
        "startHours": 18,
        "endHours": 36
      },
      "delayed": {
        "startHours": 48,
        "endHours": 72
      },
      "quality": {
        "minimumCoverage": 0.6,
        "maximumGapShare": 0.5,
        "minimumDistinctUpdates": 3,
        "maximumSpread": 0.2
      },
      "tieThreshold": 0.01
    },
    "presentation": {
      "topicLabel": "September 2024 Fed decision",
      "selectedContractShort": "50+ bp cut",
      "selectedContractLong": "Fed cuts 50+ basis points in September 2024",
      "seriesLabel": "50+ bp cut probability",
      "positiveLabel": "Raises 50+ bp chance",
      "negativeLabel": "Lowers 50+ bp chance",
      "neutralLabel": "Ambiguous",
      "eventNoun": "macro event",
      "timezone": "America/New_York",
      "accent": "#315e78",
      "zoomChoices": [
        {
          "label": "All",
          "hours": null
        },
        {
          "label": "30d",
          "hours": 720
        },
        {
          "label": "14d",
          "hours": 336
        },
        {
          "label": "7d",
          "hours": 168
        }
      ]
    },
    "sources": [
      {
        "id": "bls-jobs-aug",
        "title": "The Employment Situation — July 2024",
        "publisher": "U.S. Bureau of Labor Statistics",
        "url": "https://www.bls.gov/news.release/archives/empsit_08022024.htm",
        "publishedAt": "2024-08-02T12:30:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-04T03:44:31.385Z",
        "archivedUrl": "https://www.bls.gov/news.release/archives/empsit_08022024.htm",
        "correctionStatus": "none"
      },
      {
        "id": "bls-cpi-aug",
        "title": "Consumer Price Index — July 2024",
        "publisher": "U.S. Bureau of Labor Statistics",
        "url": "https://www.bls.gov/news.release/archives/cpi_08142024.htm",
        "publishedAt": "2024-08-14T12:30:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-04T03:44:31.385Z",
        "archivedUrl": "https://www.bls.gov/news.release/archives/cpi_08142024.htm",
        "correctionStatus": "none"
      },
      {
        "id": "fed-jackson-hole",
        "title": "Review and Outlook",
        "publisher": "Federal Reserve Board",
        "url": "https://www.federalreserve.gov/newsevents/speech/powell20240823a.htm",
        "publishedAt": "2024-08-23T14:00:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-04T03:44:31.385Z",
        "archivedUrl": "https://www.federalreserve.gov/newsevents/speech/powell20240823a.htm",
        "correctionStatus": "none",
        "timestampMeaning": "Release-on-delivery time of 10:00 a.m. EDT in the official speech PDF, not the HTML footer Last Update date.",
        "timingEvidenceUrl": "https://www.federalreserve.gov/newsevents/speech/files/powell20240823a.pdf"
      },
      {
        "id": "bls-jobs-sep",
        "title": "The Employment Situation — August 2024",
        "publisher": "U.S. Bureau of Labor Statistics",
        "url": "https://www.bls.gov/news.release/archives/empsit_09062024.htm",
        "publishedAt": "2024-09-06T12:30:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-04T03:44:31.385Z",
        "archivedUrl": "https://www.bls.gov/news.release/archives/empsit_09062024.htm",
        "correctionStatus": "none"
      },
      {
        "id": "bls-cpi-sep",
        "title": "Consumer Price Index — August 2024",
        "publisher": "U.S. Bureau of Labor Statistics",
        "url": "https://www.bls.gov/news.release/archives/cpi_09112024.htm",
        "publishedAt": "2024-09-11T12:30:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-04T03:44:31.385Z",
        "archivedUrl": "https://www.bls.gov/news.release/archives/cpi_09112024.htm",
        "correctionStatus": "none"
      },
      {
        "id": "fed-decision",
        "title": "Federal Reserve issues FOMC statement, September 18 2024",
        "publisher": "Federal Reserve Board",
        "url": "https://www.federalreserve.gov/newsevents/pressreleases/monetary20240918a.htm",
        "publishedAt": "2024-09-18T18:00:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-04T03:44:31.385Z",
        "archivedUrl": "https://www.federalreserve.gov/newsevents/pressreleases/monetary20240918a.htm",
        "correctionStatus": "none"
      }
    ],
    "events": [
      {
        "id": "july-jobs",
        "title": "July jobs report shows a sharp hiring slowdown",
        "shortTitle": "Weak July jobs",
        "occurredAt": "2024-08-02T12:30:00Z",
        "informationKnownAt": "2024-08-02T12:30:00Z",
        "precision": "minute",
        "timezone": "America/New_York",
        "dateLabel": "Aug 2",
        "category": "Employment",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "july-jobs-fact",
            "text": "Payroll employment rose by 114,000 in July and unemployment increased to 4.3%.",
            "knownAt": "2024-08-02T12:30:00Z",
            "sourceIds": [
              "bls-jobs-aug"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "bls-jobs-aug",
            "role": "primary"
          }
        ],
        "mechanism": "A weaker labor market increases the case for front-loading rate cuts, including a half-point move.",
        "retrospectiveInterpretation": "The report opened a materially weaker growth scenario and increased expectations of a larger September cut.",
        "competingExplanation": "Risk-off trading and the Sahm-rule discussion arrived with the same report.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "july-cpi",
        "title": "July CPI confirms further disinflation",
        "shortTitle": "July CPI",
        "occurredAt": "2024-08-14T12:30:00Z",
        "informationKnownAt": "2024-08-14T12:30:00Z",
        "precision": "minute",
        "timezone": "America/New_York",
        "dateLabel": "Aug 14",
        "category": "Inflation",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "july-cpi-fact",
            "text": "Headline CPI rose 0.2% in July and 2.9% over twelve months; core CPI rose 0.2%.",
            "knownAt": "2024-08-14T12:30:00Z",
            "sourceIds": [
              "bls-cpi-aug"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "bls-cpi-aug",
            "role": "primary"
          }
        ],
        "mechanism": "Continued disinflation gives the FOMC more room to respond forcefully to labor-market weakness.",
        "retrospectiveInterpretation": "The release supported easing but did not itself require a 50-basis-point first cut.",
        "competingExplanation": "The market was still digesting the early-August growth scare and subsequent stabilization.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "powell-jackson-hole",
        "title": "Powell says the time has come to adjust policy",
        "shortTitle": "Jackson Hole pivot",
        "occurredAt": "2024-08-23T14:00:00Z",
        "informationKnownAt": "2024-08-23T14:00:00Z",
        "precision": "minute",
        "timezone": "America/New_York",
        "dateLabel": "Aug 23",
        "category": "FOMC communication",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "powell-jackson-hole-fact",
            "text": "Powell said the time had come for policy to adjust and emphasized downside employment risks.",
            "knownAt": "2024-08-23T14:00:00Z",
            "sourceIds": [
              "fed-jackson-hole"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "fed-jackson-hole",
            "role": "primary"
          }
        ],
        "mechanism": "An explicit pivot confirms a September cut and leaves the opening move’s size responsive to incoming labor data.",
        "retrospectiveInterpretation": "The speech removed uncertainty about whether easing would start, while preserving ambiguity about 25 versus 50 basis points.",
        "competingExplanation": "The cut itself was already heavily anticipated before the speech.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "august-jobs",
        "title": "August adds 142,000 jobs; earlier months revised lower",
        "shortTitle": "August jobs",
        "occurredAt": "2024-09-06T12:30:00Z",
        "informationKnownAt": "2024-09-06T12:30:00Z",
        "precision": "minute",
        "timezone": "America/New_York",
        "dateLabel": "Sep 6",
        "category": "Employment",
        "expectedDirection": "ambiguous",
        "claims": [
          {
            "id": "august-jobs-fact",
            "text": "Payrolls rose by 142,000 in August, prior months were revised lower, and unemployment was 4.2%, little changed.",
            "knownAt": "2024-09-06T12:30:00Z",
            "sourceIds": [
              "bls-jobs-sep"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "bls-jobs-sep",
            "role": "primary"
          }
        ],
        "mechanism": "Weak revisions support a larger cut, while the unemployment decline reduces the urgency for an emergency-sized move.",
        "retrospectiveInterpretation": "The mixed report kept both 25- and 50-basis-point outcomes plausible.",
        "competingExplanation": "Positioning before the final CPI release could dominate the immediate response.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "august-cpi",
        "title": "August core inflation rises 0.3%",
        "shortTitle": "August core CPI",
        "occurredAt": "2024-09-11T12:30:00Z",
        "informationKnownAt": "2024-09-11T12:30:00Z",
        "precision": "minute",
        "timezone": "America/New_York",
        "dateLabel": "Sep 11",
        "category": "Inflation",
        "expectedDirection": "negative",
        "claims": [
          {
            "id": "august-cpi-fact",
            "text": "Headline CPI rose 0.2% in August while core CPI rose 0.3%.",
            "knownAt": "2024-09-11T12:30:00Z",
            "sourceIds": [
              "bls-cpi-sep"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "bls-cpi-sep",
            "role": "primary"
          }
        ],
        "mechanism": "A firmer core reading weakens the case for a half-point cut at the immediately following meeting.",
        "retrospectiveInterpretation": "The last major inflation release pointed toward a more cautious first step.",
        "competingExplanation": "Labor-market risk and subsequent policy reporting remained important before the decision.",
        "attributionAssessment": "mixed"
      }
    ],
    "contextMarkers": [],
    "conclusion": {
      "title": "The FOMC cuts by 50 basis points",
      "text": "The September 18, 2024 FOMC statement records a 50-basis-point reduction; the exact contract resolved YES. This is reveal-only and is not a scored card.",
      "sourceId": "fed-decision"
    },
    "ending": {
      "title": "The FOMC cuts by 50 basis points",
      "occurredAt": "2024-09-18T18:00:00Z",
      "source": "https://www.federalreserve.gov/newsevents/pressreleases/monetary20240918a.htm",
      "revealOnly": true
    },
    "approval": "pending",
    "measurementNotes": [
      "The provider metadata createdAt is July 25 at 14:47:42.952096Z; openedAt uses that creation bound, not a separately verified first-trade timestamp. Provider startDate is August 2, a different field.",
      "On September 10, the lead fetched the original July 25–August 4 public prices-history request with the exact YES token. All 239 observations match the retained first response exactly, including the pre-August-2 baseline. See review/fed-early-history-check.json.",
      "Provider closedTime is not represented as a separately verified settlement transaction time. Full market lifetime is not asserted.",
      "Independent timing audit: all five scheduled issuer release times confirmed. The official Powell PDF supplies the 10:00 a.m. EDT embargo. No scored timestamp or raw price changed. Changes describe contract prices, not isolated causality; core CPI means all items less food and energy."
    ]
  },
  {
    "id": "nyc-mamdani-2025-v2",
    "slug": "nyc-mamdani-2025",
    "category": "Politics",
    "version": 2,
    "status": "published",
    "question": "Will Zohran Mamdani win the 2025 NYC mayoral election?",
    "orientation": "Historical YES-contract series study. Contract prices are observed market data, not a forecast or causal assessment.",
    "market": {
      "id": "538932",
      "provider": "Polymarket",
      "title": "Will Zohran Mamdani win the 2025 NYC mayoral election?",
      "rules": "YES if Mamdani wins the November 4, 2025 NYC general election; AP, Fox News and NBC agreement or official certification determines resolution.",
      "openedAt": "2025-04-22T16:10:05.987Z",
      "closedAt": "2025-11-05T05:44:47Z",
      "status": "settled",
      "resolutionSourceUrl": "https://vote.nyc/page/election-results-summary-2025",
      "marketUrl": "https://polymarket.com/event/new-york-city-mayoral-election/will-zohran-mamdani-win-the-2025-nyc-mayoral-election"
    },
    "contract": {
      "id": "33945469250963963541781051637999677727672635213493648594066577298999471399137",
      "proposition": "Zohran Mamdani wins the 2025 NYC mayoral election",
      "nativeSide": "YES",
      "selectedPerspective": "YES",
      "resolution": "YES"
    },
    "dataset": {
      "id": "polymarket-nyc-mamdani-2025-hourly-v1",
      "provider": "Polymarket",
      "path": "/data/next-five/nyc-mamdani-2025-v2/hourly.csv",
      "rawPath": "/data/next-five/nyc-mamdani-2025-v2/raw-history.json",
      "marketMetadataPath": "/data/next-five/nyc-mamdani-2025-v2/market.json",
      "manifestPath": "/data/next-five/nyc-mamdani-2025-v2/manifest.json",
      "rawSha256": "9723bf56433b040c8c1e31e244b5ae326c52454d32c302369b118c6e635028bc",
      "marketMetadataSha256": "0fc388ea6ee570076fea0cb6be694c02138f19d57b39ce167381a08db8e06b01",
      "normalizedSha256": "a2bf3f12c21289f5718135859fe0018819a595a958503a2b096a7bd474560b13",
      "retrievedAt": "2026-09-06T05:12:35Z",
      "coverageStart": "2025-04-22T17:00:00Z",
      "coverageEnd": "2025-11-05T05:00:00Z",
      "fullMarketLifetime": false,
      "cadenceMinutes": 60,
      "transformVersion": "polymarket-hourly-v1",
      "provenanceUrl": "https://docs.polymarket.com/api-reference/markets/get-prices-history",
      "requestParameters": "token_id=33945469250963963541781051637999677727672635213493648594066577298999471399137; fidelity=60; bounded hourly chunks; latest source price per UTC hour; no filling",
      "rawHashMeaning": "SHA-256 of rawPath bundle; individual original response file byte hashes are also retained inside it.",
      "normalizedHashMeaning": "SHA-256 of the exact CSV at dataset.path. Previous draft put the CSV hash in rawSha256 and the separately normalized JSON hash in normalizedSha256."
    },
    "measurementProfile": {
      "id": "months-hourly-v1",
      "label": "Months / hourly",
      "cadenceMinutes": 60,
      "anticipation": {
        "startHours": -84,
        "endHours": -12
      },
      "reference": {
        "startHours": -12,
        "endHours": 0
      },
      "immediate": {
        "startHours": 0,
        "endHours": 6
      },
      "stabilized": {
        "startHours": 18,
        "endHours": 36
      },
      "delayed": {
        "startHours": 48,
        "endHours": 72
      },
      "quality": {
        "minimumCoverage": 0.6,
        "maximumGapShare": 0.5,
        "minimumDistinctUpdates": 3,
        "maximumSpread": 0.2
      },
      "tieThreshold": 0.01
    },
    "measurementNotes": [
      "The six missing hourly buckets are preserved and not filled.",
      "Source timestamps are conservative public by bounds. They do not claim the first public minute unless the retained source supports it.",
      "Version 2 uses original candidate posts or earlier contemporaneous confirmation instead of later coverage. Announcement versus post-publication uncertainty is disclosed in each source.",
      "Primary-night response includes rolling returns; it is not isolated concession causality. Original NYT endorsement timings could not be independently established, so AOC/ Hochul use the earliest retained supported bounds with wider sensitivity checks.",
      "Market closedAt comes from provider closedTime; an exact settlement time is not asserted. Retrospective court/archive/election records have unknown publication times and are excluded from pre-reveal evidence.",
      "Audit corrected raw versus normalized file-hash labels. Original provider responses and CSV bytes remain unchanged."
    ],
    "presentation": {
      "topicLabel": "NYC mayoral contract",
      "selectedContractShort": "YES",
      "selectedContractLong": "Observed YES-contract price",
      "seriesLabel": "Polymarket YES contract price",
      "positiveLabel": "Higher observed contract price",
      "negativeLabel": "Lower observed contract price",
      "positiveShortLabel": "Higher",
      "negativeShortLabel": "Lower",
      "neutralLabel": "No detectable change",
      "eventNoun": "development",
      "timezone": "UTC",
      "accent": "#7C3AED",
      "zoomChoices": [
        {
          "label": "All",
          "hours": null
        },
        {
          "label": "30 days",
          "hours": 720
        },
        {
          "label": "7 days",
          "hours": 168
        }
      ]
    },
    "sources": [
      {
        "id": "aoc-post",
        "title": "Mamdani acknowledges AOC endorsement",
        "publisher": "Zohran Mamdani / Bluesky",
        "url": "https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at%3A%2F%2Fdid%3Aplc%3Aj5hrotody26iqi24hcusufxu%2Fapp.bsky.feed.post%2F3lqucxtqkss2o&depth=0",
        "publishedAt": "2025-06-05T12:27:13.349Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-06T05:12:35.948993Z",
        "snapshotHash": "5485b67f4a3d31aadd21e48e867de15f90e45b59c4cf6ac3b4e898c9482c1454",
        "timestampMeaning": "indexedAt is the observed API indexing bound; createdAt belongs to Mamdani’s acknowledgement, not AOC’s original announcement."
      },
      {
        "id": "primary-cnn",
        "title": "Contemporary primary-night concession coverage",
        "publisher": "CNN",
        "url": "https://transcripts.cnn.com/show/lcl/date/2025-06-24/segment/01",
        "publishedAt": "2025-06-25T04:00:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-06T05:44:52.313242Z",
        "snapshotHash": "d5292cf4d645506a17e013a8ba59f7cb93ce7035755fd5d4ff5b3c92c45f08f2",
        "timestampMeaning": "End of broadcast bracket, not HTML publication time. Superseded for scoring by earlier eyewitness report."
      },
      {
        "id": "primary-fox",
        "title": "Cuomo concedes as Mamdani leads",
        "publisher": "FOX5 New York",
        "url": "https://www.fox5ny.com/election/zohran-mamdani-lead-cuomo-concedes/",
        "publishedAt": "2025-06-25T02:44:46Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-06T05:12:36.481940Z",
        "snapshotHash": "238efdf81aa93865d0ec1a6f9b94bc51fcc6c8002e7584e1e24494f089daae4f",
        "timestampMeaning": "Retained article metadata; final updated content is not used for the tighter pre-reveal cutoff."
      },
      {
        "id": "cuomo-ny1",
        "title": "Cuomo officially launches independent bid for mayor",
        "publisher": "NY1",
        "url": "https://ny1.com/nyc/all-boroughs/politics/2025/07/14/andrew-cuomo-officially-launches-independent-bid-for-mayor",
        "publishedAt": "2025-07-14T19:03:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-06T00:26:49.354638Z",
        "snapshotHash": "9145f6f540b7d79181de43fde006d1a679ee04fdd90e7f1bbb4e4a1f59254699"
      },
      {
        "id": "adams-ny1",
        "title": "Mayor Eric Adams ends his reelection bid",
        "publisher": "NY1",
        "url": "https://ny1.com/nyc/all-boroughs/politics/2025/09/28/eric-adams-drops-out",
        "publishedAt": "2025-09-28T17:18:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-06T13:54:10.085632Z",
        "snapshotHash": "d45098d3aaf4d8aa26ae2982274ad2e704aaabd006ed13dd7061d9501e1673be"
      },
      {
        "id": "adams-court",
        "title": "Court record preserving Adams announcement timing",
        "publisher": "U.S. Courts",
        "url": "https://www.govinfo.gov/content/pkg/USCOURTS-nyed-1_25-cv-04558/pdf/USCOURTS-nyed-1_25-cv-04558-0.pdf",
        "publishedAt": "",
        "publishedPrecision": "unknown",
        "retrievedAt": "2026-09-06T13:54:11.160828Z",
        "snapshotHash": "e7153916b8004562a4a7da97f4a5dcae25e6328a3071972d01a4b264792d8149",
        "timestampMeaning": "Historical announcement/election time is not publication time of this retrospective record. Exact publication time unverified."
      },
      {
        "id": "adams-archive",
        "title": "Archived original Adams post",
        "publisher": "Perma.cc",
        "url": "https://perma.cc/B8BX-S9BU",
        "publishedAt": "",
        "publishedPrecision": "unknown",
        "retrievedAt": "2026-09-06T05:12:36.081702Z",
        "snapshotHash": "bde50921be3d427d450aa5bbfe1ec2e01bdbe43bde55deefbc0bce47dd74d6fa",
        "timestampMeaning": "Historical announcement/election time is not publication time of this retrospective record. Exact publication time unverified."
      },
      {
        "id": "hochul-ny1",
        "title": "Hochul endorses Mamdani in NYC mayor's race",
        "publisher": "NY1",
        "url": "https://ny1.com/nyc/arts/news/2025/09/15/hochul-endorses-mamdani-in-nyc-mayor-s-race",
        "publishedAt": "2025-09-15T00:31:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-06T00:26:49.325995Z",
        "snapshotHash": "d08b3d2e38a39cf560fb1324ad60416e86f50b33cf87d7395a78506bb2e11f4b"
      },
      {
        "id": "nyc-ending",
        "title": "2025 NYC election results summary",
        "publisher": "New York City Board of Elections",
        "url": "https://vote.nyc/page/election-results-summary-2025",
        "publishedAt": "",
        "publishedPrecision": "unknown",
        "retrievedAt": "2026-09-06T05:27:18.404407Z",
        "snapshotHash": "a2d160e2a2c7b1008a13d2738ca39f89092e2d5ebbb4cd4369cb5470d153ec78",
        "timestampMeaning": "Historical announcement/election time is not publication time of this retrospective record. Exact publication time unverified."
      },
      {
        "id": "aoc-confirmation",
        "title": "NY1: campaigns confirm AOC endorsement",
        "publisher": "Spectrum NY1",
        "url": "https://ny1.com/nyc/All-Boroughs/politics/2025/06/05/mamdani-picks-up-endorsement-from-alexandria-ocasio-cortez-",
        "publishedAt": "2025-06-05T11:05:00Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T16:56:34.052383+00:00",
        "snapshotHash": "85e000dd566dd50be9be8635b148bba3f04eb5ec7b57266f42ecbc2281c7c715",
        "capturePath": "/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/next-five-2026-09-10/audit-other/nyc/aoc-ny1.html",
        "snapshotKind": "original-report",
        "captureMeaning": "Original reporting publication, confirmed directly with both campaigns. Earliest retained supported bound; original NYT interview inaccessible, so exact first-public minute remains uncertain."
      },
      {
        "id": "primary-reporter-post",
        "title": "Reporter at Cuomo concession",
        "publisher": "Annie McDonough / City & State",
        "url": "https://twitter.com/Annie_McDonough/status/1937698802670146006",
        "publishedAt": "2025-06-25T02:26:09.916000Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T16:56:34.052383+00:00",
        "snapshotHash": "8a0423881e85db8a015a5873d5fa37202ac833c6e1ad4bcc2c198efe2c68251e",
        "capturePath": "/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/next-five-2026-09-10/audit-other/nyc/primary-citystate.html",
        "snapshotKind": "embedded-original-post",
        "captureMeaning": "Original eyewitness post ID and text embedded in live blog. Snowflake supplies post time; live blog labels concession 10:25pm. This is reporting of the concession, not certified primary results."
      },
      {
        "id": "cuomo-announcement",
        "title": "Cuomo independent campaign video",
        "publisher": "Andrew Cuomo",
        "url": "https://twitter.com/andrewcuomo/status/1944829573222338765",
        "publishedAt": "2025-07-14T18:41:18.099000Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T16:56:34.052383+00:00",
        "snapshotHash": "9145f6f540b7d79181de43fde006d1a679ee04fdd90e7f1bbb4e4a1f59254699",
        "capturePath": "docs/launch-queue-research/evidence/nyc-cuomo.html",
        "snapshotKind": "embedded-original-post",
        "captureMeaning": "Original candidate video post ID embedded in NY1 report. Post caption and reporting establish independent continuation. Snowflake time is original post creation, not article update."
      },
      {
        "id": "hochul-announcement",
        "title": "Hochul endorses Mamdani",
        "publisher": "Kathy Hochul",
        "url": "https://twitter.com/KathyHochul/status/1967369861493072135",
        "publishedAt": "2025-09-14T23:28:21.601000Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T16:56:34.052383+00:00",
        "snapshotHash": "d08b3d2e38a39cf560fb1324ad60416e86f50b33cf87d7395a78506bb2e11f4b",
        "capturePath": "docs/launch-queue-research/evidence/nyc-hochul.html",
        "snapshotKind": "embedded-original-post",
        "captureMeaning": "Original governor post embedded in NY1 report links her endorsement op-ed. Original op-ed timestamp inaccessible; this is a supported public-by bound, not guaranteed first public instant."
      },
      {
        "id": "adams-announcement",
        "title": "Adams withdrawal announcement",
        "publisher": "Eric Adams",
        "url": "https://twitter.com/ericadamsfornyc/status/1972348511892262962",
        "publishedAt": "2025-09-28T17:11:44.355000Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T16:56:34.052383+00:00",
        "snapshotHash": "d45098d3aaf4d8aa26ae2982274ad2e704aaabd006ed13dd7061d9501e1673be",
        "capturePath": "docs/launch-queue-research/evidence/nyc-adams-ny1.html",
        "snapshotKind": "embedded-original-post",
        "captureMeaning": "Original candidate video post embedded in contemporaneous NY1 reporting; separately preserved in Perma archive and later court record. Snowflake time is post creation. Court filing publication is not backdated."
      }
    ],
    "events": [
      {
        "id": "aoc-endorsement",
        "title": "Alexandria Ocasio-Cortez endorses Zohran Mamdani",
        "shortTitle": "AOC endorsement",
        "occurredAt": "2025-06-05T11:05:00Z",
        "informationKnownAt": "2025-06-05T11:05:00Z",
        "precision": "minute",
        "timezone": "America/New_York",
        "dateLabel": "Jun 5",
        "category": "Endorsement",
        "mechanism": "A nationally recognizable endorsement can signal outsider momentum and coalition support.",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "aoc-fact",
            "text": "Alexandria Ocasio-Cortez endorses Zohran Mamdani for New York City mayor.",
            "knownAt": "2025-06-05T11:05:00Z",
            "sourceIds": [
              "aoc-confirmation"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "aoc-confirmation",
            "role": "primary"
          }
        ],
        "retrospectiveInterpretation": "The observed contract response was small immediately and larger over the delayed window; this is descriptive, not causal.",
        "competingExplanation": "Other endorsements, polling and ranked-choice strategy were also in the information set.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "primary-breakthrough",
        "title": "Cuomo concedes the Democratic primary to Mamdani",
        "shortTitle": "Primary breakthrough",
        "occurredAt": "2025-06-25T02:26:09.916000Z",
        "informationKnownAt": "2025-06-25T02:26:09.916000Z",
        "precision": "minute",
        "timezone": "America/New_York",
        "dateLabel": "Jun 24",
        "category": "Primary election",
        "mechanism": "A primary-night breakthrough strengthens Mamdani’s position for November; Cuomo could still run independently.",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "primary-fact",
            "text": "Contemporary primary-night coverage reports Andrew Cuomo conceding the Democratic primary to Zohran Mamdani.",
            "knownAt": "2025-06-25T02:26:09.916000Z",
            "sourceIds": [
              "primary-reporter-post"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "primary-reporter-post",
            "role": "primary"
          }
        ],
        "retrospectiveInterpretation": "The measured window includes rolling primary returns before the concession. It is a primary-night information cluster, not the isolated effect of conceding.",
        "competingExplanation": "Returns were already rolling in before the concession and other primary-night reports shared the window.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "cuomo-independent",
        "title": "Cuomo announces he will continue as an independent",
        "shortTitle": "Cuomo independent bid",
        "occurredAt": "2025-07-14T18:41:18.099000Z",
        "informationKnownAt": "2025-07-14T18:41:18.099000Z",
        "precision": "minute",
        "timezone": "America/New_York",
        "dateLabel": "Jul 14",
        "category": "Candidate change",
        "mechanism": "A defeated rival returning to the general election preserves a credible anti-Mamdani lane.",
        "expectedDirection": "negative",
        "claims": [
          {
            "id": "cuomo-fact",
            "text": "Andrew Cuomo announces that he will continue running for mayor as an independent.",
            "knownAt": "2025-07-14T18:41:18.099000Z",
            "sourceIds": [
              "cuomo-announcement"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "cuomo-announcement",
            "role": "primary"
          }
        ],
        "retrospectiveInterpretation": "The observed response was modestly lower; the window does not establish causality.",
        "competingExplanation": "The independent bid had been discussed earlier and was not wholly new information.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "hochul-endorsement",
        "title": "Governor Kathy Hochul endorses Mamdani",
        "shortTitle": "Hochul endorsement",
        "occurredAt": "2025-09-14T23:28:21.601000Z",
        "informationKnownAt": "2025-09-14T23:28:21.601000Z",
        "precision": "minute",
        "timezone": "America/New_York",
        "dateLabel": "Sep 14",
        "category": "Endorsement",
        "mechanism": "A major party establishment endorsement can broaden coalition support for the insurgent nominee.",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "hochul-fact",
            "text": "Governor Kathy Hochul endorses Zohran Mamdani for New York City mayor.",
            "knownAt": "2025-09-14T23:28:21.601000Z",
            "sourceIds": [
              "hochul-announcement"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "hochul-announcement",
            "role": "primary"
          }
        ],
        "retrospectiveInterpretation": "The observed response was modestly higher; surrounding September campaign news also matters.",
        "competingExplanation": "The endorsement followed public discussions and coalition expectations.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "adams-exit",
        "title": "Mayor Eric Adams ends his reelection campaign",
        "shortTitle": "Adams exits",
        "occurredAt": "2025-09-28T17:11:44.355000Z",
        "informationKnownAt": "2025-09-28T17:11:44.355000Z",
        "precision": "minute",
        "timezone": "America/New_York",
        "dateLabel": "Sep 28",
        "category": "Candidate change",
        "mechanism": "An incumbent exit changes the opposition field and possible vote distribution.",
        "expectedDirection": "ambiguous",
        "claims": [
          {
            "id": "adams-fact",
            "text": "Mayor Eric Adams ends his reelection campaign.",
            "knownAt": "2025-09-28T17:11:44.355000Z",
            "sourceIds": [
              "adams-announcement"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "adams-announcement",
            "role": "primary"
          }
        ],
        "retrospectiveInterpretation": "The observed response was modestly lower; it is a descriptive association, not a causal estimate.",
        "competingExplanation": "Withdrawal was publicly speculated about and another major anti-Mamdani candidate remained.",
        "attributionAssessment": "mixed"
      }
    ],
    "contextMarkers": [],
    "conclusion": {
      "title": "Reveal-only resolution",
      "text": "Zohran Mamdani won the November 4, 2025 NYC mayoral general election. The Board of Elections record is retrospective and excluded from all five pre-reveal cards.",
      "sourceId": "nyc-ending"
    }
  },
  {
    "id": "dodgers-repeat-2025-v3",
    "slug": "dodgers-repeat-2025",
    "category": "Sports",
    "version": 3,
    "status": "published",
    "question": "What changed the Dodgers’ chance of repeating as World Series champions?",
    "orientation": "April–October 2025. Rank five headlines from the biggest rise in the Dodgers’ title odds to the biggest fall.",
    "market": {
      "id": "525410",
      "provider": "Polymarket",
      "title": "Will the Los Angeles Dodgers win the 2025 World Series?",
      "rules": "This market will resolve according to the team that wins the 2025 MLB World Series. \n\nIf at any point it becomes impossible for this team to win the World Series based on the rules of the MLB (e.g., they are eliminated in the playoff bracket), this market will resolve immediately to “No”.\n\nIf the 2025  MLB season is permanently canceled or has not been completed by February 28, 2026, 11:59 PM this market will resolve to “Other”.\n",
      "openedAt": "2025-02-26T20:10:37.66Z",
      "closedAt": "2025-11-02T07:46:27.000Z",
      "status": "settled",
      "resolutionSourceUrl": "https://www.mlb.com/news/dodgers-win-2025-world-series",
      "marketUrl": "https://polymarket.com/event/world-series-champion-2025/will-the-los-angeles-dodgers-win-the-2025-world-series",
      "volume": 10561644.990771
    },
    "contract": {
      "id": "50056291296373013403053264672448796961558656386670931029485176637893947669174",
      "proposition": "Will the Los Angeles Dodgers win the 2025 World Series?",
      "nativeSide": "YES",
      "selectedPerspective": "YES",
      "resolution": "YES"
    },
    "dataset": {
      "id": "dodgers-repeat-2025-hourly-v1",
      "provider": "Polymarket",
      "path": "/data/next-five/dodgers-repeat-2025-v3/hourly.csv",
      "rawPath": "/data/next-five/dodgers-repeat-2025-v3/raw-history.json",
      "marketMetadataPath": "/data/next-five/dodgers-repeat-2025-v3/market.json",
      "manifestPath": "/data/next-five/dodgers-repeat-2025-v3/manifest.json",
      "rawSha256": "aeb332243b883b899c219e3e3ab87867ebc30f7558a9079a17d51ed62e3271c1",
      "marketMetadataSha256": "18f0e41653d894c5e7a38f85ae83aa94f2080b587e3a4107163b02a853b1179d",
      "normalizedSha256": "d09119662e51d073983ce01096cb239f8205dbb07566b945da1e630a1a431aa8",
      "retrievedAt": "2026-09-10T16:03:07.145711+00:00",
      "coverageStart": "2025-02-26T21:00:00.000Z",
      "coverageEnd": "2025-11-02T07:00:00.000Z",
      "fullMarketLifetime": false,
      "cadenceMinutes": 60,
      "transformVersion": "polymarket-hourly-v1",
      "provenanceUrl": "https://clob.polymarket.com/prices-history",
      "requestParameters": "Exact YES token; 10-day chunks, fidelity=60; latest observation per UTC hour; no filling."
    },
    "measurementProfile": {
      "id": "months-hourly-v1",
      "label": "Months / hourly",
      "cadenceMinutes": 60,
      "anticipation": {
        "startHours": -84,
        "endHours": -12
      },
      "reference": {
        "startHours": -12,
        "endHours": 0
      },
      "immediate": {
        "startHours": 0,
        "endHours": 6
      },
      "stabilized": {
        "startHours": 18,
        "endHours": 36
      },
      "delayed": {
        "startHours": 48,
        "endHours": 72
      },
      "quality": {
        "minimumCoverage": 0.6,
        "maximumGapShare": 0.5,
        "minimumDistinctUpdates": 3,
        "maximumSpread": 0.2
      },
      "tieThreshold": 0.01
    },
    "measurementNotes": [
      "Scores describe observed contract-price changes, not isolated causal effects.",
      "Version3 replaces late article updates with official game-event times; Glasnow uses the original team press release. Raw prices, window profile and one-point tie rule remain unchanged.",
      "MLB feeds are retrieved retrospective records of public live events. Their play endTime fields are not API publication times; later season outcome is not used in any scored claim.",
      "Ohtani card concerns his actual pitching debut. The June15 return announcement predates it; original announcement evidence is retained in the audit folder and not conflated with the debut.",
      "The 12-hour reference can include in-game trading. A separate six-hour pre-start comparison is diagnostic only. Repricing from previous losses/series games and simultaneous league news is not isolated.",
      "The first source-supported Glasnow publication bound may be later than the original roster disclosure. Prior injury exit on April27 already conveyed negative news; wider timing sensitivity is reported.",
      "The original selection remains five cards. No event was substituted to optimize a score; wording has been aligned with contemporaneous game facts."
    ],
    "presentation": {
      "topicLabel": "Dodgers title defense",
      "selectedContractShort": "Dodgers win",
      "selectedContractLong": "Dodgers win the 2025 World Series",
      "seriesLabel": "Dodgers championship probability",
      "positiveLabel": "Raises Dodgers title chance",
      "negativeLabel": "Lowers Dodgers title chance",
      "neutralLabel": "Ambiguous",
      "eventNoun": "headline",
      "timezone": "America/Los_Angeles",
      "accent": "#005a9c",
      "zoomChoices": [
        {
          "label": "All",
          "hours": null
        },
        {
          "label": "30d",
          "hours": 720
        }
      ]
    },
    "sources": [
      {
        "id": "glasnow-injury-source",
        "title": "Tyler Glasnow goes on the injured list",
        "publisher": "MLB",
        "url": "https://www.mlb.com/news/tyler-glasnow-injured-list-shoulder-inflammation",
        "publishedAt": "2025-04-29T01:22:56.051Z",
        "publishedPrecision": "instant",
        "updatedAt": "2025-04-29T01:22:56.051Z",
        "retrievedAt": "2026-09-10T16:07:26.811213+00:00",
        "snapshotHash": "e41c86dff4cb76971dfbebe8ae644c27b0b3a9ada78d9e48c4adcfe358f0bc12",
        "correctionStatus": "none"
      },
      {
        "id": "ohtani-return-source",
        "title": "Ohtani makes his Dodgers pitching debut",
        "publisher": "MLB",
        "url": "https://www.mlb.com/news/shohei-ohtani-makes-dodgers-pitching-debut",
        "publishedAt": "2025-06-17T06:31:00Z",
        "publishedPrecision": "instant",
        "updatedAt": "2025-06-17T07:17:34.434Z",
        "retrievedAt": "2026-09-10T16:07:26.811213+00:00",
        "snapshotHash": "9e75c8ab32166e18547d4af3112fa17c303dedde2285350cf0604891cf8e520a",
        "correctionStatus": "none"
      },
      {
        "id": "seven-losses-source",
        "title": "Dodgers lose their seventh straight game",
        "publisher": "MLB",
        "url": "https://www.mlb.com/dodgers/news/dodgers-lose-7th-straight-game",
        "publishedAt": "2025-07-12T06:57:00Z",
        "publishedPrecision": "instant",
        "updatedAt": "2025-07-12T06:57:03.618Z",
        "retrievedAt": "2026-09-10T16:07:26.811213+00:00",
        "snapshotHash": "781d07de8a7613889dddcbf8262d3484bf6fb2acf07b1fdb92fef555d26e7b69",
        "correctionStatus": "none"
      },
      {
        "id": "nlds-escape-source",
        "title": "Dodgers advance on an 11th-inning throwing error",
        "publisher": "MLB",
        "url": "https://www.mlb.com/news/dodgers-win-nlds-2025-vs-phillies",
        "publishedAt": "2025-10-10T04:18:00Z",
        "publishedPrecision": "instant",
        "updatedAt": "2025-10-10T07:11:42.629Z",
        "retrievedAt": "2026-09-10T16:07:26.811213+00:00",
        "snapshotHash": "8704e98acd46e0306999c2bafb5e8ce22536b6bf6b56f6cd43b2a0625b2cb9cf",
        "correctionStatus": "none"
      },
      {
        "id": "pennant-sweep-source",
        "title": "Dodgers sweep Milwaukee to reach the World Series",
        "publisher": "MLB",
        "url": "https://www.mlb.com/dodgers/news/dodgers-win-2025-nlcs",
        "publishedAt": "2025-10-18T06:08:00Z",
        "publishedPrecision": "instant",
        "updatedAt": "2025-10-18T06:39:41.955Z",
        "retrievedAt": "2026-09-10T16:07:26.811213+00:00",
        "snapshotHash": "f6a0ddba16d44a81ed1d2f3598094d83ad6dda772fc41eb0fae5a709c59e055e",
        "correctionStatus": "none"
      },
      {
        "id": "ending",
        "title": "Dodgers win the 2025 World Series",
        "publisher": "MLB",
        "url": "https://www.mlb.com/news/dodgers-win-2025-world-series",
        "publishedAt": "2025-11-02T07:20:00Z",
        "updatedAt": "2025-11-02T19:07:02.973Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T16:07:26.811213+00:00",
        "snapshotHash": "fc17ca07a988fa7198a5af347ca6928b0115dd576652500726a2cfb6a4980c15",
        "correctionStatus": "none"
      },
      {
        "id": "glasnow-injury-public-event",
        "title": "Dodgers roster announcement",
        "publisher": "Los Angeles Dodgers",
        "url": "https://www.mlb.com/dodgers/press-release/press-release-dodgers-recall-noah-davis-042825",
        "publishedAt": "2025-04-29T00:37:19.495Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T17:01:02.190286+00:00",
        "snapshotHash": "194e122924a694901d5bf165d5e51ea3d6719090dbf191b03f7bf9fae4c02495",
        "capturePath": "/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/next-five-2026-09-10/audit-other/dodgers/glasnow-transaction-release-apr28.html",
        "sourceIdentity": "original-team-announcement",
        "snapshotKind": "original-release",
        "timestampMeaning": "Original team roster announcement publication. Official transaction date corroborates April28; no precise earlier social announcement was established. Prior game exit occurred April27."
      },
      {
        "id": "ohtani-return-public-event",
        "title": "MLB public game record: Ohtani makes his Dodgers pitching debut",
        "publisher": "MLB",
        "url": "https://statsapi.mlb.com/api/v1.1/game/777490/feed/live",
        "publishedAt": "2025-06-17T02:31:59.850Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T17:01:02.190286+00:00",
        "snapshotHash": "84336f5f5723fcd14a15877f141e54392483b850846ba7cf1b8d8591d38e406d",
        "capturePath": "/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/next-five-2026-09-10/audit-other/dodgers/mlb-api/game-777490-live.json",
        "sourceIdentity": "historical-public-live-event",
        "snapshotKind": "retrospective-official-play-by-play",
        "timestampMeaning": "Historical pitching replacement makes the one-inning line final; inning top ended02:22:02, Banda replaced Ohtani02:31:59.850UTC. Scored event is the debut, not the June15 announcement or end of the whole game."
      },
      {
        "id": "seven-losses-public-event",
        "title": "MLB public game record: Dodgers lose their seventh straight game",
        "publisher": "MLB",
        "url": "https://statsapi.mlb.com/api/v1.1/game/777143/feed/live",
        "publishedAt": "2025-07-12T05:01:14.061Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T17:01:02.190286+00:00",
        "snapshotHash": "23724358272302c711e8ef2a935e03a413fdd96ca27a0553155db601ec71dfb0",
        "capturePath": "/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/next-five-2026-09-10/audit-other/dodgers/mlb-api/game-777143-live.json",
        "sourceIdentity": "historical-public-live-event",
        "snapshotKind": "retrospective-official-play-by-play",
        "timestampMeaning": "Historical public live-game result timestamp recorded in official MLB play-by-play, not retrieval or publication time of this current API snapshot."
      },
      {
        "id": "nlds-escape-public-event",
        "title": "MLB public game record: Dodgers advance on an 11th-inning throwing error",
        "publisher": "MLB",
        "url": "https://statsapi.mlb.com/api/v1.1/game/813042/feed/live",
        "publishedAt": "2025-10-10T01:39:19.872Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T17:01:02.190286+00:00",
        "snapshotHash": "4a74b3bb935cdab88428ee188d330528829929a3064c5334ef55bcfc18670639",
        "capturePath": "/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/next-five-2026-09-10/audit-other/dodgers/mlb-api/game-813042-live.json",
        "sourceIdentity": "historical-public-live-event",
        "snapshotKind": "retrospective-official-play-by-play",
        "timestampMeaning": "Historical public live-game result timestamp recorded in official MLB play-by-play, not retrieval or publication time of this current API snapshot."
      },
      {
        "id": "pennant-sweep-public-event",
        "title": "MLB public game record: Dodgers sweep Milwaukee to reach the World Series",
        "publisher": "MLB",
        "url": "https://statsapi.mlb.com/api/v1.1/game/813031/feed/live",
        "publishedAt": "2025-10-18T03:20:26.349Z",
        "publishedPrecision": "instant",
        "retrievedAt": "2026-09-10T17:01:02.190286+00:00",
        "snapshotHash": "cc4aad50cde836ee10c6a004f010835c03856b05a800fafd307f949ffef85d18",
        "capturePath": "/Users/simonwacziarg/Documents/ChatGPT/Forecast/docs/next-five-2026-09-10/audit-other/dodgers/mlb-api/game-813031-live.json",
        "sourceIdentity": "historical-public-live-event",
        "snapshotKind": "retrospective-official-play-by-play",
        "timestampMeaning": "Historical public live-game result timestamp recorded in official MLB play-by-play, not retrieval or publication time of this current API snapshot."
      }
    ],
    "events": [
      {
        "id": "glasnow-injury",
        "title": "Tyler Glasnow goes on the injured list",
        "shortTitle": "Tyler Glasnow goes on the injured list",
        "occurredAt": "2025-04-29T00:37:19.495Z",
        "informationKnownAt": "2025-04-29T00:37:19.495Z",
        "precision": "minute",
        "timezone": "America/Los_Angeles",
        "dateLabel": "2025-04-28",
        "category": "glasnow-injury",
        "mechanism": "Losing a leading starter threatens rotation depth and the postseason pitching plan. The earlier exit may have priced in part of the news.",
        "expectedDirection": "negative",
        "claims": [
          {
            "id": "glasnow-injury-fact",
            "text": "The Dodgers place Tyler Glasnow on the 15-day injured list with right shoulder inflammation.",
            "knownAt": "2025-04-29T00:37:19.495Z",
            "sourceIds": [
              "glasnow-injury-public-event"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "glasnow-injury-public-event",
            "role": "primary"
          },
          {
            "sourceId": "glasnow-injury-source",
            "role": "retrospective"
          }
        ],
        "retrospectiveInterpretation": "Observed change around the public result or announcement; descriptive association, not isolated causal impact.",
        "competingExplanation": "Losing a leading starter threatens rotation depth and the postseason pitching plan. The earlier exit may have priced in part of the news.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "ohtani-return",
        "title": "Ohtani makes his Dodgers pitching debut",
        "shortTitle": "Ohtani makes his Dodgers pitching debut",
        "occurredAt": "2025-06-17T02:31:59.850Z",
        "informationKnownAt": "2025-06-17T02:31:59.850Z",
        "precision": "minute",
        "timezone": "America/Los_Angeles",
        "dateLabel": "2025-06-16",
        "category": "ohtani-return",
        "mechanism": "Ohtani’s first pitching appearance for Los Angeles demonstrates his return to a two-way role.",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "ohtani-return-fact",
            "text": "Ohtani completes one inning, allowing one run, in his Dodgers pitching debut.",
            "knownAt": "2025-06-17T02:31:59.850Z",
            "sourceIds": [
              "ohtani-return-public-event"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "ohtani-return-public-event",
            "role": "primary"
          },
          {
            "sourceId": "ohtani-return-source",
            "role": "retrospective"
          }
        ],
        "retrospectiveInterpretation": "Observed change around the public result or announcement; descriptive association, not isolated causal impact.",
        "competingExplanation": "The Dodgers announced his scheduled return June15 at19:30PDT, before this debut. The game result and other team news also enter the follow-up window.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "seven-losses",
        "title": "Dodgers lose their seventh straight game",
        "shortTitle": "Dodgers lose their seventh straight game",
        "occurredAt": "2025-07-12T05:01:14.061Z",
        "informationKnownAt": "2025-07-12T05:01:14.061Z",
        "precision": "minute",
        "timezone": "America/Los_Angeles",
        "dateLabel": "2025-07-11",
        "category": "seven-losses",
        "mechanism": "A sustained slump challenges confidence in the favorite and tightens the division race. Much of the deterioration may have been reflected before the seventh loss.",
        "expectedDirection": "negative",
        "claims": [
          {
            "id": "seven-losses-fact",
            "text": "Los Angeles loses 8–7 to San Francisco, its seventh consecutive defeat.",
            "knownAt": "2025-07-12T05:01:14.061Z",
            "sourceIds": [
              "seven-losses-public-event"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "seven-losses-public-event",
            "role": "primary"
          },
          {
            "sourceId": "seven-losses-source",
            "role": "retrospective"
          }
        ],
        "retrospectiveInterpretation": "Observed change around the public result or announcement; descriptive association, not isolated causal impact.",
        "competingExplanation": "A sustained slump challenges confidence in the favorite and tightens the division race. Much of the deterioration may have been reflected before the seventh loss.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "nlds-escape",
        "title": "Dodgers advance on an 11th-inning walk-off error",
        "shortTitle": "NLDS walk-off escape",
        "occurredAt": "2025-10-10T01:39:19.872Z",
        "informationKnownAt": "2025-10-10T01:39:19.872Z",
        "precision": "minute",
        "timezone": "America/Los_Angeles",
        "dateLabel": "2025-10-09",
        "category": "nlds-escape",
        "mechanism": "A tense elimination of a major contender removes another playoff hurdle. Earlier series wins and other teams’ results also shape the title market.",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "nlds-escape-fact",
            "text": "Los Angeles beats Philadelphia 2–1 to win the NLDS three games to one.",
            "knownAt": "2025-10-10T01:39:19.872Z",
            "sourceIds": [
              "nlds-escape-public-event"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "nlds-escape-public-event",
            "role": "primary"
          },
          {
            "sourceId": "nlds-escape-source",
            "role": "retrospective"
          }
        ],
        "retrospectiveInterpretation": "Observed change around the public result or announcement; descriptive association, not isolated causal impact.",
        "competingExplanation": "A tense elimination of a major contender removes another playoff hurdle. Earlier series wins and other teams’ results also shape the title market.",
        "attributionAssessment": "mixed"
      },
      {
        "id": "pennant-sweep",
        "title": "Dodgers sweep Milwaukee to reach the World Series",
        "shortTitle": "Dodgers sweep Milwaukee to reach the World Series",
        "occurredAt": "2025-10-18T03:20:26.349Z",
        "informationKnownAt": "2025-10-18T03:20:26.349Z",
        "precision": "minute",
        "timezone": "America/Los_Angeles",
        "dateLabel": "2025-10-17",
        "category": "pennant-sweep",
        "mechanism": "Only the championship series remains; this is advancement toward the contract outcome, not the resolving victory.",
        "expectedDirection": "positive",
        "claims": [
          {
            "id": "pennant-sweep-fact",
            "text": "Los Angeles beats Milwaukee 5–1 to complete a four-game sweep and reach the World Series.",
            "knownAt": "2025-10-18T03:20:26.349Z",
            "sourceIds": [
              "pennant-sweep-public-event"
            ],
            "visibility": "pre-reveal"
          }
        ],
        "sourceRoles": [
          {
            "sourceId": "pennant-sweep-public-event",
            "role": "primary"
          },
          {
            "sourceId": "pennant-sweep-source",
            "role": "retrospective"
          }
        ],
        "retrospectiveInterpretation": "Observed change around the public result or announcement; descriptive association, not isolated causal impact.",
        "competingExplanation": "Only the championship series remains; this is advancement toward the contract outcome, not the resolving victory.",
        "attributionAssessment": "mixed"
      }
    ],
    "contextMarkers": [],
    "conclusion": {
      "title": "The repeat",
      "text": "The Dodgers won the 2025 World Series. The selected contract resolved YES.",
      "sourceId": "ending"
    }
  }
] as Study[]

export const nextFivePuzzles: DailyPuzzle[] = [
  {
    "id": "2026-09-13-trump-comeback-2024",
    "number": 7,
    "releaseTime": "2026-09-13T05:00:00Z",
    "releaseTimezone": "UTC",
    "studyId": "trump-comeback-2024-v2",
    "studyVersion": 2,
    "topic": "Trump’s 2024 comeback",
    "question": "Will Donald Trump win the 2024 US Presidential Election?",
    "instruction": "Rank the five headlines from the biggest rise in the selected outcome’s probability to the biggest fall.",
    "eventIds": [
      "conviction",
      "butler",
      "rfk-endorsement",
      "harris-debate",
      "iowa-poll"
    ],
    "initialOrder": [
      "rfk-endorsement",
      "conviction",
      "iowa-poll",
      "butler",
      "harris-debate"
    ],
    "scoring": {
      "version": "pairwise-exact-v3",
      "tieThreshold": 0,
      "tieGrouping": "anchor-window"
    }
  },
  {
    "id": "2026-09-14-thunder-first-title-2025",
    "number": 8,
    "releaseTime": "2026-09-14T05:00:00Z",
    "releaseTimezone": "UTC",
    "studyId": "thunder-first-title-2025-v3",
    "studyVersion": 3,
    "topic": "Thunder’s first title",
    "question": "What changed the Thunder’s chance of winning their first title?",
    "instruction": "Rank the five headlines from the biggest rise in the selected outcome’s probability to the biggest fall.",
    "eventIds": [
      "chet-injury",
      "cup-loss",
      "chet-return",
      "denver-game-seven",
      "west-finals"
    ],
    "initialOrder": [
      "chet-return",
      "cup-loss",
      "west-finals",
      "chet-injury",
      "denver-game-seven"
    ],
    "scoring": {
      "version": "pairwise-exact-v3",
      "tieThreshold": 0,
      "tieGrouping": "anchor-window"
    }
  },
  {
    "id": "2026-09-15-fed-september-2024-five-card",
    "number": 9,
    "releaseTime": "2026-09-15T05:00:00Z",
    "releaseTimezone": "UTC",
    "studyId": "fed-september-2024-v2",
    "studyVersion": 2,
    "topic": "The Fed’s half-point decision",
    "question": "What changed the chance of a half-point Fed rate cut?",
    "instruction": "Rank the five headlines from the biggest rise in the selected outcome’s probability to the biggest fall.",
    "eventIds": [
      "july-jobs",
      "july-cpi",
      "powell-jackson-hole",
      "august-jobs",
      "august-cpi"
    ],
    "initialOrder": [
      "july-jobs",
      "july-cpi",
      "powell-jackson-hole",
      "august-jobs",
      "august-cpi"
    ],
    "scoring": {
      "version": "pairwise-exact-v3",
      "tieThreshold": 0,
      "tieGrouping": "anchor-window"
    }
  },
  {
    "id": "2026-09-16-nyc-mamdani-2025",
    "number": 10,
    "releaseTime": "2026-09-16T05:00:00Z",
    "releaseTimezone": "UTC",
    "studyId": "nyc-mamdani-2025-v2",
    "studyVersion": 2,
    "topic": "Mamdani’s New York upset",
    "question": "Will Zohran Mamdani win the 2025 NYC mayoral election?",
    "instruction": "Rank the five headlines from the biggest rise in the selected outcome’s probability to the biggest fall.",
    "eventIds": [
      "aoc-endorsement",
      "primary-breakthrough",
      "cuomo-independent",
      "hochul-endorsement",
      "adams-exit"
    ],
    "initialOrder": [
      "cuomo-independent",
      "aoc-endorsement",
      "hochul-endorsement",
      "primary-breakthrough",
      "adams-exit"
    ],
    "scoring": {
      "version": "pairwise-exact-v3",
      "tieThreshold": 0,
      "tieGrouping": "anchor-window"
    }
  },
  {
    "id": "2026-09-17-dodgers-repeat-2025",
    "number": 11,
    "releaseTime": "2026-09-17T05:00:00Z",
    "releaseTimezone": "UTC",
    "studyId": "dodgers-repeat-2025-v3",
    "studyVersion": 3,
    "topic": "Dodgers’ title defense",
    "question": "What changed the Dodgers’ chance of repeating as World Series champions?",
    "instruction": "Rank the five headlines from the biggest rise in the selected outcome’s probability to the biggest fall.",
    "eventIds": [
      "glasnow-injury",
      "ohtani-return",
      "seven-losses",
      "nlds-escape",
      "pennant-sweep"
    ],
    "initialOrder": [
      "seven-losses",
      "nlds-escape",
      "glasnow-injury",
      "pennant-sweep",
      "ohtani-return"
    ],
    "scoring": {
      "version": "pairwise-exact-v3",
      "tieThreshold": 0,
      "tieGrouping": "anchor-window"
    }
  }
]
