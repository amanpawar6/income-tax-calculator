import { resolveTaxInput } from '../domain/aggregate-input'
import type { TaxInput, TaxRegime, TaxResult } from '../domain/types'
import type { TaxRulesConfig } from '../domain/tax-rules/types'
import {
  computeDeductions,
  computeExemptions,
  sumDeductions,
} from './deductions'
import {
  computeCtc,
  computeGrossSalary,
  computeNonTaxableAllowances,
} from './gross-salary'
import { applySection87A } from './rebate-87a'
import { computeSlabTax } from './slab-tax'

export { computeHraExemption } from './hra-exemption'
export { computeSlabTax } from './slab-tax'

export function calculateTax(
  input: TaxInput,
  regime: TaxRegime,
  rules: TaxRulesConfig,
): TaxResult {
  const resolved = resolveTaxInput(input)
  const regimeRules = regime === 'old' ? rules.oldRegime : rules.newRegime
  const grossSalary = computeGrossSalary(resolved.salary)
  const nonTaxableAllowances = computeNonTaxableAllowances(resolved.salary)
  const ctc = computeCtc(resolved.salary)
  const exemptions = computeExemptions(input, resolved, regimeRules)

  const netSalary =
    grossSalary -
    exemptions.hra -
    exemptions.lta +
    resolved.investments.otherIncome

  const deductions = computeDeductions(
    resolved,
    regime,
    rules,
    netSalary,
  )
  const totalDeductions = sumDeductions(deductions)
  const grossTotalIncome = netSalary
  const taxableIncome = Math.max(0, grossTotalIncome - totalDeductions)

  const taxBeforeRebate = computeSlabTax(taxableIncome, regimeRules.slabs)
  const rebate87A = applySection87A(
    taxBeforeRebate,
    taxableIncome,
    regimeRules.section87A,
  )
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate87A)
  const cess = Math.round(taxAfterRebate * rules.cessRate)
  const totalTax = taxAfterRebate + cess

  const effectiveRate =
    grossSalary > 0 ? (totalTax / grossSalary) * 100 : 0

  return {
    regime,
    financialYearId: rules.id,
    ctc,
    grossSalary,
    nonTaxableAllowances,
    exemptions,
    deductions,
    grossTotalIncome,
    taxableIncome,
    taxBeforeRebate,
    rebate87A,
    taxAfterRebate,
    cess,
    totalTax,
    monthlyTds: Math.round(totalTax / 12),
    effectiveRate,
  }
}
