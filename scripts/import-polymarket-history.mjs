import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const [tokenId, startIso, endIso, outputCsv, outputRaw, outputManifest, marketSlug = ''] = process.argv.slice(2)
if (!tokenId || !startIso || !endIso || !outputCsv || !outputRaw || !outputManifest) {
  throw new Error('Usage: node scripts/import-polymarket-history.mjs tokenId startIso endIso output.csv raw.json manifest.json [marketSlug]')
}

const start = Math.floor(Date.parse(startIso) / 1000)
const end = Math.floor(Date.parse(endIso) / 1000)
if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) throw new Error('The requested coverage interval is invalid.')

const fidelityMinutes = 60
const chunkSeconds = 10 * 24 * 60 * 60
const endpoint = 'https://clob.polymarket.com/prices-history'
const requests = []
const responses = []

for (let chunkStart = start; chunkStart < end; chunkStart += chunkSeconds) {
  const chunkEnd = Math.min(end, chunkStart + chunkSeconds)
  const url = `${endpoint}?market=${tokenId}&startTs=${chunkStart}&endTs=${chunkEnd}&fidelity=${fidelityMinutes}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Polymarket returned ${response.status} for ${url}`)
  const body = await response.json()
  if (!Array.isArray(body.history)) throw new Error(`Polymarket returned an invalid price history for ${url}`)
  requests.push({ startTs: chunkStart, endTs: chunkEnd, fidelity: fidelityMinutes, url })
  responses.push(body)
}

const rawArtifact = `${JSON.stringify({ provider: 'Polymarket', tokenId, marketSlug, retrievedAt: new Date().toISOString(), requests, responses }, null, 2)}\n`
const revisions = new Map()
let duplicateCadenceBuckets = 0
let rejectedProbabilities = 0

for (const body of responses) {
  for (const point of body.history) {
    const timestamp = Number(point.t)
    const probability = Number(point.p)
    if (!Number.isFinite(timestamp) || !Number.isFinite(probability) || probability < 0 || probability > 1) {
      rejectedProbabilities += 1
      continue
    }
    const bucket = Math.floor(timestamp / (fidelityMinutes * 60)) * fidelityMinutes * 60
    if (revisions.has(bucket)) duplicateCadenceBuckets += 1
    const existing = revisions.get(bucket)
    if (!existing || timestamp >= existing.timestamp) revisions.set(bucket, { timestamp, probability })
  }
}

const observations = [...revisions.entries()].sort(([left], [right]) => left - right)
const rows = ['time,q,raw_price,bid,ask,volume,open_interest,mark_type,stale']
for (const [bucket, point] of observations) rows.push(`${new Date(bucket * 1000).toISOString()},${point.probability.toFixed(4)},${point.probability.toFixed(4)},,,,,trade,false`)
const normalized = `${rows.join('\n')}\n`

const missingBuckets = []
for (let index = 1; index < observations.length; index += 1) {
  for (let missing = observations[index - 1][0] + fidelityMinutes * 60; missing < observations[index][0]; missing += fidelityMinutes * 60) {
    missingBuckets.push(new Date(missing * 1000).toISOString())
  }
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const manifest = {
  provider: 'Polymarket', tokenId, marketSlug, retrievedAt: JSON.parse(rawArtifact).retrievedAt,
  request: { endpoint, startTs: start, endTs: end, fidelityMinutes, chunkSeconds, chunks: requests.length },
  coverageStart: observations.length ? new Date(observations[0][0] * 1000).toISOString() : null,
  coverageEnd: observations.length ? new Date(observations.at(-1)[0] * 1000).toISOString() : null,
  rawSha256: sha256(rawArtifact), normalizedSha256: sha256(normalized),
  rawObservations: responses.reduce((total, body) => total + body.history.length, 0), normalizedObservations: observations.length,
  duplicateCadenceBuckets, missingBucketCount: missingBuckets.length, missingBuckets,
  rejectedProbabilities, transformVersion: 'polymarket-hourly-v1',
  markPolicy: 'Use each API history price as a traded mark; sort chronologically and keep the latest source observation in each UTC hour. Do not fill missing hours.',
  provenanceUrl: 'https://docs.polymarket.com/api-reference/markets/get-prices-history',
}

for (const path of [outputCsv, outputRaw, outputManifest]) await mkdir(dirname(path), { recursive: true })
await writeFile(outputCsv, normalized)
await writeFile(outputRaw, rawArtifact)
await writeFile(outputManifest, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(JSON.stringify(manifest, null, 2))
