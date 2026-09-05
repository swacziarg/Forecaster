import { electionStudy } from './election2024.ts'
import { oscarsStudy } from './oscars2026.ts'
import { fedStudy } from './fed2024.ts'
import { eaglesStudy } from './eagles2025.ts'
import { bitcoinStudy } from './bitcoin2024.ts'
import { bidenDropoutStudy } from './bidenDropout2024.ts'
import type { MarketSeriesPoint } from '../domain/eventStudy.ts'
import type { Study } from '../domain/study.ts'
import { LocalDatasetAdapter } from './localDatasetAdapter.ts'

export type StudyRegistration = { study: Study; loadSeries: () => Promise<MarketSeriesPoint[]> }

const register = (study: Study): StudyRegistration => {
  const adapter = new LocalDatasetAdapter(study)
  return { study, loadSeries: () => adapter.getSeries({ dataset: study.dataset, selectedPerspective: study.contract.selectedPerspective }).then((bundle) => bundle.observations) }
}

export const studyRegistry: StudyRegistration[] = [register(electionStudy), register(oscarsStudy), register(fedStudy), register(eaglesStudy), register(bitcoinStudy), register(bidenDropoutStudy)]

export function studyById(id: string) {
  return studyRegistry.find((registration) => registration.study.id === id)
}

export function studyFromLocation(pathname = window.location.pathname): StudyRegistration {
  const slug = pathname.match(/^\/studies\/([^/]+)/)?.[1]
  return studyRegistry.find((registration) => registration.study.slug === slug) ?? studyRegistry[0]
}
