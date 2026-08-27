import type {
  CheckpointId,
  Direction,
  FactorDefinition,
  ForecastDecision,
  ForecastResult,
  ForecastSkillReport,
  HumanMentalModel,
  Scenario,
} from './types.ts'

const EPSILON = 0.000001
const FORECAST_SENSITIVITY = 2.15

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
export const clampProbability = (value: number) => clamp(value, EPSILON, 1 - EPSILON)
export const sigmoid = (value: number) => 1 / (1 + Math.exp(-value))
export const logit = (probability: number) => {
  const safe = clampProbability(probability)
  return Math.log(safe / (1 - safe))
}

export const directionValue = (direction: Direction) => {
  if (direction === 'more_likely') return 1
  if (direction === 'less_likely') return -1
  return 0
}

export const totalImportance = (model: HumanMentalModel) => Object.values(model.beliefs)
  .reduce((sum, belief) => sum + belief.importance, 0)

const distributeIntegerBudget = (remaining: number, ids: string[], weights: Record<string, number>) => {
  if (ids.length === 0) return {}
  const positiveTotal = ids.reduce((sum, id) => sum + Math.max(weights[id] ?? 0, 0), 0)
  if (positiveTotal === 0) {
    const evenly = Math.floor(remaining / ids.length)
    const remainder = remaining - evenly * ids.length
    return Object.fromEntries(ids.map((id, index) => [id, evenly + (index < remainder ? 1 : 0)]))
  }

  const raw = ids.map((id) => ({ id, value: Math.max(weights[id] ?? 0, 0) / positiveTotal * remaining }))
  const floors = raw.map((item) => ({ ...item, value: Math.floor(item.value), fraction: item.value - Math.floor(item.value) }))
  let left = remaining - floors.reduce((sum, item) => sum + item.value, 0)
  floors.sort((a, b) => b.fraction - a.fraction)
  floors.forEach((item) => {
    if (left > 0) {
      item.value += 1
      left -= 1
    }
  })
  return Object.fromEntries(floors.map((item) => [item.id, item.value]))
}

/** Change one point allocation while preserving an exact 100-point budget. */
export const rebalanceImportance = (model: HumanMentalModel, changedId: string, requestedValue: number, factorIds: string[]) => {
  const nextValue = Math.round(clamp(Number.isFinite(requestedValue) ? requestedValue : 0, 0, 100))
  const otherIds = factorIds.filter((id) => id !== changedId)
  const previousWeights = Object.fromEntries(factorIds.map((id) => [id, model.beliefs[id]?.importance ?? 0]))
  const allocations = distributeIntegerBudget(100 - nextValue, otherIds, previousWeights)
  const beliefs = Object.fromEntries(factorIds.map((id) => {
    const previous = model.beliefs[id]
    return [id, {
      factorId: id,
      importance: id === changedId ? nextValue : allocations[id] ?? 0,
      direction: previous?.direction ?? 'neutral',
    }]
  }))
  return { beliefs, totalImportance: totalImportance({ beliefs, totalImportance: 100 }) }
}

export const setDirection = (model: HumanMentalModel, factorId: string, direction: Direction): HumanMentalModel => ({
  ...model,
  beliefs: {
    ...model.beliefs,
    [factorId]: { ...(model.beliefs[factorId] ?? { factorId, importance: 0 }), factorId, direction },
  },
})

/** Translate the user's live factor model into a probability around the Kalshi baseline. */
export const calculateForecast = (scenario: Scenario, checkpointId: CheckpointId, model: HumanMentalModel): ForecastResult => {
  const checkpoint = scenario.checkpoints.find((item) => item.id === checkpointId) ?? scenario.checkpoints[0]
  let runningLogOdds = logit(checkpoint.marketProbability / 100)
  const contributions: ForecastResult['contributions'] = []

  scenario.factors.forEach((factor) => {
    const belief = model.beliefs[factor.id]
    const observation = factor.observations[checkpoint.id]
    const weight = clamp(belief?.importance ?? 0, 0, 100) / 100
    const direction = belief?.direction ?? 'neutral'
    const logOddsEffect = weight * observation.signal * directionValue(direction) * FORECAST_SENSITIVITY
    const before = sigmoid(runningLogOdds)
    runningLogOdds += logOddsEffect
    contributions.push({
      factorId: factor.id,
      label: factor.label,
      direction,
      logOddsEffect,
      probabilityDelta: sigmoid(runningLogOdds) - before,
    })
  })

  const userProbability = clampProbability(sigmoid(runningLogOdds))
  return {
    marketProbability: checkpoint.marketProbability / 100,
    userProbability,
    probabilityDelta: userProbability - checkpoint.marketProbability / 100,
    contributions: contributions.sort((a, b) => Math.abs(b.probabilityDelta) - Math.abs(a.probabilityDelta)),
  }
}

export const scoreProbability = (probability: number, outcome: boolean) => {
  const p = clampProbability(probability)
  const y = outcome ? 1 : 0
  return {
    brier: (p - y) ** 2,
    logLoss: -(y * Math.log(p) + (1 - y) * Math.log(1 - p)),
  }
}

export const scoreForecastPath = (decisions: ForecastDecision[], outcome: boolean): ForecastSkillReport => {
  if (decisions.length === 0) return { user: { brier: 0, logLoss: 0 }, market: { brier: 0, logLoss: 0 }, userBeatMarketCount: 0, checkpoints: 0 }
  const userScores = decisions.map((decision) => scoreProbability(decision.userProbability, outcome))
  const marketScores = decisions.map((decision) => scoreProbability(decision.marketProbability, outcome))
  const mean = (scores: ProbabilityScoreLike[], key: 'brier' | 'logLoss') => scores.reduce((sum, score) => sum + score[key], 0) / scores.length
  return {
    user: { brier: mean(userScores, 'brier'), logLoss: mean(userScores, 'logLoss') },
    market: { brier: mean(marketScores, 'brier'), logLoss: mean(marketScores, 'logLoss') },
    userBeatMarketCount: decisions.filter((decision) => scoreProbability(decision.userProbability, outcome).logLoss < scoreProbability(decision.marketProbability, outcome).logLoss).length,
    checkpoints: decisions.length,
  }
}

type ProbabilityScoreLike = { brier: number; logLoss: number }

export const modelFromScenario = (scenario: Scenario): HumanMentalModel => {
  const defaultWeights = [35, 25, 17, 15, 8]
  const beliefs = Object.fromEntries(scenario.factors.map((factor, index) => [factor.id, {
    factorId: factor.id,
    importance: defaultWeights[index] ?? 0,
    direction: 'neutral' as Direction,
  }]))
  return { beliefs, totalImportance: totalImportance({ beliefs, totalImportance: 0 }) }
}
