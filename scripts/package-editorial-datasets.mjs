import { createHash } from 'node:crypto'
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(process.cwd())
const topic = process.argv[2]
const configurations = {
  tiktok: {
    output: 'tiktok-banned-before-may-2025-v1',
    csv: 'docs/launch-queue-research/datasets/tiktok-hourly.csv',
    market: 'docs/launch-queue-research/evidence/tiktok-event.json',
    historyPrefix: 'tiktok-history-',
    provider: 'Polymarket',
    tokenId: '24635636911615866092589652362670811323984202357282728474473612545495782013438',
    provenanceUrl: 'https://docs.polymarket.com/api-reference/markets/get-prices-history',
  },
  eagles: {
    output: 'eagles-super-bowl-lix-five-v1',
    csv: 'docs/launch-queue-research/datasets/eagles-hourly.csv',
    market: 'docs/launch-queue-research/evidence/eagles-market.json',
    historyPrefix: 'eagles-history-',
    provider: 'Polymarket',
    tokenId: '110222417228270638383974743746762302792556220380554556504458115620557107501861',
    provenanceUrl: 'https://docs.polymarket.com/api-reference/markets/get-prices-history',
  },
}

if (!configurations[topic]) throw new Error(`Usage: node scripts/package-editorial-datasets.mjs <${Object.keys(configurations).join('|')}>`)
const config = configurations[topic]
const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const read = (path) => readFileSync(join(root, path))
const relativePath = (path) => path.replace(`${root}/`, '')
const csvBytes = read(config.csv)
const marketBytes = read(config.market)
const historyFiles = readdirSync(join(root, 'docs/launch-queue-research/evidence'))
  .filter((name) => name.startsWith(config.historyPrefix) && name.endsWith('.json'))
  .sort()
const history = historyFiles.map((name) => ({
  file: `docs/launch-queue-research/evidence/${name}`,
  sha256: sha256(read(`docs/launch-queue-research/evidence/${name}`)),
  response: JSON.parse(readFileSync(join(root, 'docs/launch-queue-research/evidence', name), 'utf8')),
}))
if (!history.length) throw new Error(`No retained provider history found for ${topic}.`)

const output = join(root, 'public/data', config.output)
mkdirSync(output, { recursive: true })
const normalizedName = 'polymarket-hourly.csv'
const rawName = 'raw-prices-history.json'
const marketName = 'raw-market.json'
const manifestName = 'manifest.json'
copyFileSync(join(root, config.csv), join(output, normalizedName))
copyFileSync(join(root, config.market), join(output, marketName))

const rawPayload = `${JSON.stringify({
  artifactType: 'retained-polymarket-history-v1',
  sourceFiles: history.map(({ file, sha256: digest }) => ({ file, sha256: digest })),
  responses: history.map(({ response }) => response),
}, null, 2)}\n`
writeFileSync(join(output, rawName), rawPayload)

const csvText = csvBytes.toString('utf8').trim()
const rows = csvText.split(/\r?\n/).slice(1)
const first = rows[0]?.split(',')[0]
const last = rows.at(-1)?.split(',')[0]
const manifest = {
  schemaVersion: 1,
  provider: config.provider,
  tokenId: config.tokenId,
  retrievedAt: '2026-09-06T16:40:00Z',
  sourceInputs: {
    normalizedCsv: { path: relativePath(config.csv), sha256: sha256(csvBytes) },
    marketMetadata: { path: relativePath(config.market), sha256: sha256(marketBytes) },
    retainedHistory: history.map(({ file, sha256: digest }) => ({ path: file, sha256: digest })),
  },
  coverageStart: first,
  coverageEnd: last,
  rawSha256: sha256(rawPayload),
  marketMetadataSha256: sha256(marketBytes),
  normalizedSha256: sha256(csvBytes),
  rawObservations: history.reduce((total, item) => total + (Array.isArray(item.response) ? item.response.length : Array.isArray(item.response?.history) ? item.response.history.length : 0), 0),
  normalizedObservations: rows.length,
  transformVersion: 'polymarket-hourly-v1',
  markPolicy: 'Latest retained provider price per UTC hour, treated as a trade under the project importer convention. No filling or cross-contract splicing.',
  provenanceUrl: config.provenanceUrl,
}
writeFileSync(join(output, manifestName), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(JSON.stringify({ topic, output: `public/data/${config.output}`, ...manifest }, null, 2))
