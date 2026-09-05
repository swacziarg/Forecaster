import { auditSeries, normalizeObservationPerspective, normalizeObservationSeries, parseMarketCsv } from '../domain/eventStudy.ts'
import type { DatasetBundle, MarketDataAdapter, ProviderMarketRef, SeriesRequest } from '../domain/marketData.ts'
import type { Study } from '../domain/study.ts'

const sha256 = async (text: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))).map((byte) => byte.toString(16).padStart(2, '0')).join('')

export class LocalDatasetAdapter implements MarketDataAdapter {
  provider: string
  capabilities = { trades: true, quotes: true, volume: true, openInterest: true, historicalArchive: true }
  private readonly study: Study

  constructor(study: Study) {
    this.study = study
    this.provider = study.dataset.provider
  }

  async getMarket(_ref: ProviderMarketRef) {
    return this.study.market
  }

  async getContracts(_ref: ProviderMarketRef) {
    return [this.study.contract]
  }

  async getSeries(request: SeriesRequest): Promise<DatasetBundle> {
    const response = await fetch(request.dataset.path)
    if (!response.ok) throw new Error(`${this.study.presentation.topicLabel} market history could not load (${response.status}).`)
    const csv = await response.text()
    const calculatedSha256 = await sha256(csv)
    if (calculatedSha256 !== request.dataset.normalizedSha256) throw new Error('The local market snapshot does not match its published SHA-256 digest.')
    const parsed = parseMarketCsv(csv).map((point) => normalizeObservationPerspective(point, request.selectedPerspective))
    const observations = this.study.legacyException ? parsed : normalizeObservationSeries(parsed, request.dataset.cadenceMinutes)
    const audit = auditSeries(observations, request.dataset.cadenceMinutes)
    const warnings = [
      ...(request.dataset.fullMarketLifetime ? [] : ['This dataset covers only part of the market lifetime.']),
      ...(audit.duplicateTimestamps.length ? [`${audit.duplicateTimestamps.length} duplicate cadence bucket(s) detected.`] : []),
      ...(audit.missingBuckets.length ? [`${audit.missingBuckets.length} missing cadence bucket(s) detected.`] : []),
    ]
    return { observations, dataset: request.dataset, audit, warnings, calculatedSha256 }
  }
}
