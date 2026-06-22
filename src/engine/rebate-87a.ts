import type { Section87A } from '../domain/tax-rules/types'

export function applySection87A(
  taxBeforeRebate: number,
  taxableIncome: number,
  section87A: Section87A | null,
): number {
  if (!section87A || taxBeforeRebate <= 0) {
    return 0
  }

  if (taxableIncome > section87A.maxTaxableIncome) {
    return 0
  }

  return Math.min(taxBeforeRebate, section87A.maxRebate)
}
