import type { MarketSeriesPoint, SeriesAudit } from './eventStudy.ts'
import type { Contract, Dataset, Market } from './study.ts'

export type AdapterCapabilities = { trades: boolean; quotes: boolean; volume: boolean; openInterest: boolean; historicalArchive: boolean }
export type ProviderMarketRef = { marketId: string }
export type SeriesRequest = { dataset: Dataset; selectedPerspective: 'YES' | 'NO' }
export type DatasetBundle = { observations: MarketSeriesPoint[]; dataset: Dataset; audit: SeriesAudit; warnings: string[]; calculatedSha256: string }

export interface MarketDataAdapter {
  provider: string
  capabilities: AdapterCapabilities
  getMarket(ref: ProviderMarketRef): Promise<Market>
  getContracts(ref: ProviderMarketRef): Promise<Contract[]>
  getSeries(request: SeriesRequest): Promise<DatasetBundle>
}
