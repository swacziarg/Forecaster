import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

import { DAILY_WINDOW_MS, getPreRevealCard, puzzleWindowEnd, validateDailyRegistry } from '../src/domain/dailyGame.ts'
import { validateStudy } from '../src/domain/study.ts'

export const PROPOSED_APPROVED_UPCOMING_TARGET = 7
export const HISTORICAL_APPROVED_PUZZLE_IDS = new Set(['2026-09-05-biden-dropout'])
export const DATASET_ARTIFACT_FIELDS = ['path', 'rawPath', 'marketMetadataPath', 'manifestPath']
export const STATIC_ARTIFACTS = ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'og-image-v1.png']

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const asArray = (value) => Array.isArray(value) ? value : []
const parseTime = (value) => {
  const parsed = typeof value === 'string' ? Date.parse(value) : Number.NaN
  return Number.isFinite(parsed) ? parsed : null
}

const iso = (timestamp) => timestamp === null || timestamp === Number.POSITIVE_INFINITY
  ? null
  : new Date(timestamp).toISOString()

const normalizePath = (value) => String(value ?? '').replace(/^\/+/, '').replaceAll('\\', '/')

const canonicalize = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`
  if (isObject(value)) {
    return `{${Object.keys(value).sort().filter((key) => value[key] !== undefined).map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

export const sha256 = (value) => createHash('sha256').update(value).digest('hex')

export function contentHashForPuzzle(puzzle, study) {
  const { status: _status, publishedAt: _publishedAt, ...stableStudy } = study ?? {}
  return sha256(canonicalize({ puzzle, study: stableStudy }))
}

function approvalEntries(approvals) {
  if (Array.isArray(approvals)) return approvals
  if (!isObject(approvals)) return []
  return asArray(approvals.entries ?? approvals.approvals)
}

function scheduleEntries(schedule, key) {
  if (!isObject(schedule)) return []
  return asArray(schedule[key])
}

function entryId(entry) {
  return typeof entry === 'string' ? entry : entry?.puzzleId ?? entry?.id ?? null
}

function duplicateValues(values) {
  const counts = new Map()
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value)
}

function editionIdentity(detail) {
  const eventIds = asArray(detail?.eventIds).map(String).sort().join(',')
  return `${String(detail?.studyId ?? 'unknown')}@${String(detail?.studyVersion ?? 'unknown')}|${eventIds}`
}

function validateApproval(puzzle, study, approval) {
  const expectedHash = contentHashForPuzzle(puzzle, study)
  const errors = []
  if (!approval) errors.push('approval record is missing')
  else {
    if (approval.status !== 'approved') errors.push(`approval status is ${String(approval.status ?? 'missing')}, not approved`)
    if (approval.approverType !== 'human') errors.push('approval record does not identify a human approver')
    if (typeof approval.approver !== 'string' || !approval.approver.trim()) errors.push('approval record has no named approver')
    if (parseTime(approval.approvedAt) === null) errors.push('approval record has no valid approval timestamp')
    if (approval.puzzleId !== puzzle.id) errors.push('approval record references a different puzzle ID')
    if (approval.studyId !== puzzle.studyId || approval.studyVersion !== puzzle.studyVersion) errors.push('approval record references a different study version')
    if (approval.releaseTime !== puzzle.releaseTime) errors.push('approval record references a different release timestamp')
    if (approval.contentHash !== expectedHash) errors.push(`approval content hash ${String(approval.contentHash ?? 'missing')} does not match current content hash ${expectedHash}`)
  }
  return { ok: errors.length === 0, status: approval?.status ?? (approval ? 'invalid' : 'missing'), errors, expectedHash, actualHash: approval?.contentHash ?? null }
}

function collectRequiredArtifacts(studies) {
  const required = new Set(STATIC_ARTIFACTS)
  for (const study of studies) {
    for (const field of DATASET_ARTIFACT_FIELDS) {
      if (study?.dataset?.[field]) required.add(normalizePath(study.dataset[field]))
    }
  }
  return [...required].sort()
}

function metadataChecks(metadata, productionDomain) {
  const errors = []
  const domain = typeof productionDomain === 'string' ? productionDomain.replace(/\/$/, '') : null
  if (!domain) errors.push('configured production domain is missing')
  const expected = domain ? {
    canonical: `${domain}/`,
    ogUrl: `${domain}/`,
    ogImage: `${domain}/og-image-v1.png`,
    twitterImage: `${domain}/og-image-v1.png`,
  } : {}
  for (const [key, value] of Object.entries(expected)) {
    if (metadata?.[key] !== value) errors.push(`${key} is ${String(metadata?.[key] ?? 'missing')}; expected ${value}`)
  }
  if (metadata?.ogImageType !== 'image/png') errors.push(`og:image:type is ${String(metadata?.ogImageType ?? 'missing')}; expected image/png`)
  if (String(metadata?.ogImageWidth) !== '1200' || String(metadata?.ogImageHeight) !== '630') errors.push('og:image dimensions are missing or not 1200x630')
  if (metadata?.twitterCard !== 'summary_large_image') errors.push(`twitter:card is ${String(metadata?.twitterCard ?? 'missing')}; expected summary_large_image`)
  if (metadata?.containsDailyQuery) errors.push('homepage metadata contains a daily query and is not generic')
  return { ok: errors.length === 0, errors, expected }
}

function analyzeArtifacts(input, studies) {
  const required = collectRequiredArtifacts(studies)
  const sourceFiles = new Set(asArray(input.files).map(normalizePath))
  const sourceMissing = required.filter((path) => !sourceFiles.has(path))
  const distChecked = Array.isArray(input.distFiles) || input.distChecked === true
  const distFiles = new Set(asArray(input.distFiles).map(normalizePath))
  const distMissing = distChecked ? required.filter((path) => !distFiles.has(path)) : []
  const metadata = metadataChecks(input.metadata ?? {}, input.productionDomain)
  return {
    required,
    source: { checked: Array.isArray(input.files), missing: sourceMissing, count: sourceFiles.size },
    buildOutput: { checked: distChecked, missing: distMissing, count: distFiles.size },
    metadata,
  }
}

function studyValidation(studies) {
  const errors = []
  for (const study of studies) {
    let studyErrors = []
    try { studyErrors = validateStudy(study) } catch (error) { studyErrors = [`validator threw: ${error instanceof Error ? error.message : String(error)}`] }
    for (const error of studyErrors) errors.push({ studyId: study?.id ?? 'unknown', error })
  }
  return errors
}

function analyzeRunway(details, nowTimestamp) {
  const ordered = details.filter((detail) => detail.releaseTimestamp !== null).sort((a, b) => a.releaseTimestamp - b.releaseTimestamp)
  const released = ordered.filter((detail) => detail.releaseTimestamp <= nowTimestamp)
  const upcoming = ordered.filter((detail) => detail.releaseTimestamp > nowTimestamp)
  let consecutiveCount = 0
  let firstUncoveredAt = null
  let lastApproved = null
  const latestReleased = released.at(-1) ?? null

  if (upcoming.length === 0) {
    firstUncoveredAt = latestReleased?.windowEnd ?? null
  } else {
    if (latestReleased && latestReleased.windowEndTimestamp !== null && upcoming[0].releaseTimestamp > latestReleased.windowEndTimestamp) {
      firstUncoveredAt = latestReleased.windowEnd
    } else {
      for (const detail of upcoming) {
        if (!detail.approval.ok) {
          firstUncoveredAt = detail.releaseTime
          break
        }
        if (lastApproved && detail.releaseTimestamp - lastApproved.releaseTimestamp > DAILY_WINDOW_MS) {
          firstUncoveredAt = lastApproved.windowEnd
          break
        }
        consecutiveCount += 1
        lastApproved = detail
      }
      if (firstUncoveredAt === null && lastApproved) firstUncoveredAt = lastApproved.windowEnd
    }
  }

  const exhaustionTime = consecutiveCount > 0
    ? lastApproved.windowEnd
    : latestReleased?.windowEnd ?? null
  return {
    targetUpcomingEditions: PROPOSED_APPROVED_UPCOMING_TARGET,
    consecutiveApprovedUpcoming: consecutiveCount,
    approvedUpcomingTotal: upcoming.filter((detail) => detail.approval.ok).length,
    proposedUpcoming: 0,
    exhaustionTime,
    firstUncoveredAt,
    targetMet: consecutiveCount >= PROPOSED_APPROVED_UPCOMING_TARGET,
  }
}

export function buildReadinessReport(input = {}) {
  const puzzles = asArray(input.puzzles)
  const studies = asArray(input.studies)
  const nowTimestamp = parseTime(input.now) ?? Date.now()
  const now = iso(nowTimestamp)
  const blockers = []
  const warnings = []

  if (input.now !== undefined && parseTime(input.now) === null) blockers.push(`invalid --now value: ${String(input.now)}`)
  if (!puzzles.length) blockers.push('daily registry is missing or empty')
  if (!studies.length) blockers.push('study registry is missing or empty')

  const dailyValidationErrors = (() => {
    try { return validateDailyRegistry(puzzles, studies) }
    catch (error) { return [`daily validator threw: ${error instanceof Error ? error.message : String(error)}`] }
  })()
  for (const error of dailyValidationErrors) blockers.push(`daily registry: ${error}`)

  const studyErrors = studyValidation(studies)
  for (const { studyId, error } of studyErrors) blockers.push(`study ${studyId}: ${error}`)

  const ids = duplicateValues(puzzles.map((puzzle) => puzzle?.id))
  const numbers = duplicateValues(puzzles.map((puzzle) => puzzle?.number))
  if (ids.length) blockers.push(`duplicate daily puzzle IDs: ${ids.join(', ')}`)
  if (numbers.length) blockers.push(`duplicate daily puzzle numbers: ${numbers.join(', ')}`)

  const studyById = new Map(studies.map((study) => [study?.id, study]))
  const approvals = approvalEntries(input.approvals)
  const approvalByPuzzleId = new Map(approvals.map((approval) => [entryId(approval), approval]))
  const details = puzzles.map((puzzle) => {
    const releaseTimestamp = parseTime(puzzle?.releaseTime)
    const study = studyById.get(puzzle?.studyId)
    const referenceValid = Boolean(study && study.version === puzzle?.studyVersion)
    const eligibleCardErrors = []
    if (referenceValid) {
      for (const eventId of asArray(puzzle.eventIds)) {
        try {
          if (!getPreRevealCard(study, eventId)) eligibleCardErrors.push(eventId)
        } catch {
          eligibleCardErrors.push(eventId)
        }
      }
    }
    if (!referenceValid) blockers.push(`puzzle ${puzzle?.id ?? 'unknown'} references an unknown study version: ${String(puzzle?.studyId)} v${String(puzzle?.studyVersion)}`)
    if (eligibleCardErrors.length) blockers.push(`puzzle ${puzzle?.id ?? 'unknown'} is missing eligible pre-reveal card claims: ${eligibleCardErrors.join(', ')}`)

    const releaseStatus = releaseTimestamp === null ? 'invalid-release-time' : releaseTimestamp > nowTimestamp ? 'upcoming' : 'released'
    const windowEndTimestamp = releaseTimestamp === null ? null : (() => {
      try { return puzzleWindowEnd(puzzles, puzzles.indexOf(puzzle)) }
      catch { return releaseTimestamp + DAILY_WINDOW_MS }
    })()
    const historical = HISTORICAL_APPROVED_PUZZLE_IDS.has(puzzle?.id)
    const approval = historical
      ? { ok: true, status: 'historical-approved', errors: [], expectedHash: referenceValid ? contentHashForPuzzle(puzzle, study) : null, actualHash: null }
      : validateApproval(puzzle, study, approvalByPuzzleId.get(puzzle?.id))
    if (!historical && !approval.ok) blockers.push(`puzzle ${puzzle?.id ?? 'unknown'} approval: ${approval.errors.join('; ')}`)
    return {
      id: puzzle?.id ?? null,
      number: puzzle?.number ?? null,
      releaseTime: puzzle?.releaseTime ?? null,
      releaseTimestamp,
      releaseStatus,
      windowEndTimestamp,
      windowEnd: iso(windowEndTimestamp),
      studyId: puzzle?.studyId ?? null,
      studyVersion: puzzle?.studyVersion ?? null,
      eventIds: asArray(puzzle?.eventIds),
      studyStatus: study?.status ?? null,
      referenceValid,
      eligibleCardErrors,
      approval,
    }
  })

  const scheduleProvided = isObject(input.schedule)
  const approvalsProvided = input.approvals !== undefined && input.approvals !== null
  if (!scheduleProvided) blockers.push('schedule packet input is missing; no proposed or approved runway can be verified')
  else if (!Array.isArray(input.schedule.proposed) || !Array.isArray(input.schedule.approved)) blockers.push('schedule packet is malformed; proposed and approved arrays are required')
  if (!approvalsProvided) blockers.push('approval packet input is missing; only historical #001 receives the legacy approval treatment')
  else if (!Array.isArray(input.approvals) && !Array.isArray(input.approvals.entries ?? input.approvals.approvals)) blockers.push('approval packet is malformed; an entries array is required')

  const proposedEntries = scheduleEntries(input.schedule, 'proposed')
  const approvedScheduleEntries = scheduleEntries(input.schedule, 'approved')
  const runway = analyzeRunway(details, nowTimestamp)
  runway.proposedUpcoming = proposedEntries.filter((entry) => parseTime(entry?.releaseTime) !== null && parseTime(entry.releaseTime) > nowTimestamp).length
  if (runway.consecutiveApprovedUpcoming < PROPOSED_APPROVED_UPCOMING_TARGET) warnings.push(`approved upcoming runway is ${runway.consecutiveApprovedUpcoming}; proposed operating target is ${PROPOSED_APPROVED_UPCOMING_TARGET}`)
  if (runway.proposedUpcoming) warnings.push(`${runway.proposedUpcoming} proposed upcoming edition(s) are not counted as approved runway`)

  const configuredFunnelTarget = Number(input.schedule?.funnelTarget?.minimumDistinctEditions)
  const funnelTarget = Number.isInteger(configuredFunnelTarget) && configuredFunnelTarget > 0 ? configuredFunnelTarget : null
  const approvedEditionIdentities = new Set(details.filter((detail) => detail.approval.ok).map(editionIdentity))
  const proposedEditionIdentities = new Set(proposedEntries.map((entry) => `${String(entry?.studyId ?? 'unknown')}@${String(entry?.studyVersion ?? 'unknown')}|${asArray(entry?.eventIds).map(String).sort().join(',')}`))
  const funnel = {
    target: funnelTarget,
    includesBiden: input.schedule?.funnelTarget?.includesBiden === true,
    approvedDistinctEditions: approvedEditionIdentities.size,
    proposedDistinctEditions: proposedEditionIdentities.size,
    targetMet: funnelTarget === null || approvedEditionIdentities.size >= funnelTarget,
  }
  if (funnelTarget !== null && !funnel.targetMet) blockers.push(`approved funnel has ${funnel.approvedDistinctEditions} distinct edition(s); target is ${funnelTarget}`)

  const artifacts = analyzeArtifacts(input, studies)
  for (const path of artifacts.source.missing) blockers.push(`missing source artifact: ${path}`)
  if (artifacts.buildOutput.checked) for (const path of artifacts.buildOutput.missing) blockers.push(`missing build artifact: ${path}`)
  else warnings.push('build output was not checked; run the test-inclusive build before release')
  for (const error of artifacts.metadata.errors) blockers.push(`static metadata: ${error}`)

  const registered = details
  const released = details.filter((detail) => detail.releaseStatus === 'released')
  const upcoming = details.filter((detail) => detail.releaseStatus === 'upcoming')
  const proposed = proposedEntries.map((entry) => ({ id: entryId(entry), releaseTime: entry?.releaseTime ?? null, status: 'proposed' }))
  const approvedSchedule = approvedScheduleEntries.map((entry) => ({ id: entryId(entry), releaseTime: entry?.releaseTime ?? null, status: 'approved-schedule-input' }))

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    now,
    ready: blockers.length === 0,
    blockers,
    warnings,
    counts: { registered: registered.length, released: released.length, upcoming: upcoming.length, proposedUpcoming: runway.proposedUpcoming, approvedDistinctEditions: funnel.approvedDistinctEditions, proposedDistinctEditions: funnel.proposedDistinctEditions },
    registered,
    released,
    upcoming,
    proposed,
    approvedSchedule,
    runway,
    funnel,
    duplicateIds: ids,
    duplicateNumbers: numbers,
    dailyValidationErrors,
    studyValidationErrors: studyErrors,
    artifacts,
    inputs: {
      approvalPacket: approvalsProvided ? 'provided' : 'missing',
      schedulePacket: scheduleProvided ? 'provided' : 'missing',
    },
  }
}

export function formatReadinessReport(report) {
  const lines = [
    'NexusPoint launch readiness',
    `clock: ${report.now} (UTC)`,
    `result: ${report.ready ? 'READY' : 'BLOCKED'}`,
    `registered: ${report.counts.registered} | released: ${report.counts.released} | upcoming: ${report.counts.upcoming} | proposed upcoming: ${report.counts.proposedUpcoming}`,
    `approved upcoming runway: ${report.runway.consecutiveApprovedUpcoming} consecutive edition(s) (target: ${report.runway.targetUpcomingEditions})`,
    `distinct approved funnel: ${report.funnel.approvedDistinctEditions}${report.funnel.target === null ? '' : ` / ${report.funnel.target}`} | distinct proposed funnel: ${report.funnel.proposedDistinctEditions}`,
    `runway exhaustion: ${report.runway.exhaustionTime ?? 'not established'}`,
    `first uncovered time: ${report.runway.firstUncoveredAt ?? 'not established'}`,
    `inputs: approvals ${report.inputs.approvalPacket}; schedule ${report.inputs.schedulePacket}`,
    `duplicates: IDs ${report.duplicateIds.length ? report.duplicateIds.join(', ') : 'none'} | numbers ${report.duplicateNumbers.length ? report.duplicateNumbers.join(', ') : 'none'}`,
    `validators: daily ${report.dailyValidationErrors.length ? `${report.dailyValidationErrors.length} error(s)` : 'ok'} | studies ${report.studyValidationErrors.length ? `${report.studyValidationErrors.length} error(s)` : 'ok'}`,
    '',
    'Registered puzzles:',
  ]
  for (const puzzle of report.registered) {
    lines.push(`- #${String(puzzle.number).padStart(3, '0')} ${puzzle.id ?? 'unknown'} — ${puzzle.releaseStatus}; approval ${puzzle.approval.status}${puzzle.eligibleCardErrors.length ? `; missing cards ${puzzle.eligibleCardErrors.join(', ')}` : ''}`)
  }
  lines.push('', `Artifacts: ${report.artifacts.required.length} required; source missing ${report.artifacts.source.missing.length}; build checked ${report.artifacts.buildOutput.checked ? `yes, missing ${report.artifacts.buildOutput.missing.length}` : 'no'}; metadata ${report.artifacts.metadata.ok ? 'ok' : 'mismatched'}`)
  if (report.blockers.length) {
    lines.push('', 'Blockers:')
    for (const blocker of report.blockers) lines.push(`- ${blocker}`)
  }
  if (report.warnings.length) {
    lines.push('', 'Warnings:')
    for (const warning of report.warnings) lines.push(`- ${warning}`)
  }
  return `${lines.join('\n')}\n`
}

function walkFiles(directory, base = directory) {
  if (!existsSync(directory)) return []
  const output = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) output.push(...walkFiles(path, base))
    else output.push(relative(base, path).replaceAll('\\', '/'))
  }
  return output
}

function readMeta(html, matcher) {
  const match = html.match(matcher)
  return match?.[1] ?? null
}

function actualMetadata(root) {
  const html = readFileSync(join(root, 'index.html'), 'utf8')
  return {
    canonical: readMeta(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i),
    ogUrl: readMeta(html, /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i),
    ogImage: readMeta(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i),
    ogImageType: readMeta(html, /<meta[^>]+property=["']og:image:type["'][^>]+content=["']([^"']+)["']/i),
    ogImageWidth: readMeta(html, /<meta[^>]+property=["']og:image:width["'][^>]+content=["']([^"']+)["']/i),
    ogImageHeight: readMeta(html, /<meta[^>]+property=["']og:image:height["'][^>]+content=["']([^"']+)["']/i),
    twitterCard: readMeta(html, /<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']+)["']/i),
    twitterImage: readMeta(html, /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i),
    containsDailyQuery: /(?:canonical|og:url|og:image|twitter:image)[^>]*\?daily=/i.test(html),
  }
}

function configuredProductionDomain(root) {
  const config = readFileSync(join(root, 'wrangler.jsonc'), 'utf8')
  const route = config.match(/"pattern"\s*:\s*"([^"/]+(?:\.[^"/]+)+)"[\s\S]*?"custom_domain"\s*:\s*true/i)
  return route ? `https://${route[1]}` : null
}

async function loadActualInput(root) {
  const readPacket = (path) => existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null
  const input = {
    now: new Date().toISOString(),
    files: walkFiles(join(root, 'public')),
    distFiles: walkFiles(join(root, 'dist')),
    distChecked: true,
    metadata: actualMetadata(root),
    productionDomain: configuredProductionDomain(root),
    schedule: readPacket(join(root, 'docs/launch-work/schedule/proposed-queue.json')),
    approvals: readPacket(join(root, 'docs/launch-work/schedule/approvals.json')),
  }
  try {
    const [{ dailyPuzzles }, { studyRegistry }] = await Promise.all([
      import('../src/data/dailyPuzzles.ts'),
      import('../src/data/studies.ts'),
    ])
    input.puzzles = dailyPuzzles
    input.studies = studyRegistry.map(({ study }) => study)
  } catch (error) {
    input.puzzles = []
    input.studies = []
    input.inputError = `could not load the current registry: ${error instanceof Error ? error.message : String(error)}`
  }
  return input
}

function reportWithInputError(report, inputError) {
  if (!inputError) return report
  return { ...report, ready: false, blockers: [`${inputError}`, ...report.blockers] }
}

async function main() {
  const args = process.argv.slice(2)
  const fixtureIndex = args.indexOf('--fixture')
  const nowIndex = args.indexOf('--now')
  const json = args.includes('--json')
  const root = resolve(new URL('..', import.meta.url).pathname)
  let input
  if (fixtureIndex !== -1) {
    const fixturePath = args[fixtureIndex + 1]
    if (!fixturePath) throw new Error('--fixture requires a JSON file path')
    input = JSON.parse(readFileSync(resolve(process.cwd(), fixturePath), 'utf8'))
  } else {
    input = await loadActualInput(root)
  }
  if (nowIndex !== -1) input.now = args[nowIndex + 1]
  const report = reportWithInputError(buildReadinessReport(input), input.inputError)
  process.stdout.write(json ? `${JSON.stringify(report, null, 2)}\n` : formatReadinessReport(report))
  if (!report.ready) process.exitCode = 1
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) await main()
