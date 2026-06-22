import type { RegimeComparison, TaxInput } from '../domain/types'
import type { TaxRulesConfig } from '../domain/tax-rules/types'
import { calculateTax } from './index'

export function compareRegimes(
  input: TaxInput,
  rules: TaxRulesConfig,
): RegimeComparison {
  const old = calculateTax(input, 'old', rules)
  const newResult = calculateTax(input, 'new', rules)

  const recommended =
    old.totalTax <= newResult.totalTax ? ('old' as const) : ('new' as const)
  const savings = Math.abs(old.totalTax - newResult.totalTax)

  return {
    financialYearId: rules.id,
    old,
    new: newResult,
    recommended,
    savings,
  }
}
