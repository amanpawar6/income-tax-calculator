import {
  computeHraExemptionFromMonthly,
  type ResolvedTaxInput,
} from '../domain/aggregate-input'
import type { TaxInput, TaxRegime, SalaryComponents } from '../domain/types'
import type { RegimeRules, TaxRulesConfig } from '../domain/tax-rules/types'
import { FY_MONTH_COUNT } from '../domain/fy-months'
import { emptySalaryComponents } from '../domain/types'
import { computeHraExemption } from './hra-exemption'

function isAllowed(regime: RegimeRules, key: string): boolean {
  return regime.allowedDeductions.includes(
    key as (typeof regime.allowedDeductions)[number],
  )
}

function monthlySalaryForHra(
  raw: TaxInput,
  resolved: ResolvedTaxInput,
): SalaryComponents[] {
  if (raw.salaryEntryMode === 'monthly') {
    return raw.monthlySalary
  }
  const a = resolved.salary
  return Array.from({ length: FY_MONTH_COUNT }, () => {
    const month = emptySalaryComponents()
    for (const key of Object.keys(month) as (keyof SalaryComponents)[]) {
      month[key] = a[key] / 12
    }
    return month
  })
}

function monthlyRentForHra(raw: TaxInput, resolved: ResolvedTaxInput): number[] {
  if (raw.rentEntryMode === 'monthly') {
    return raw.exemptions.monthlyRentPaid
  }
  const perMonth = resolved.exemptions.rentPaid / 12
  return Array.from({ length: FY_MONTH_COUNT }, () => perMonth)
}

export function computeExemptions(
  raw: TaxInput,
  resolved: ResolvedTaxInput,
  regimeRules: RegimeRules,
): { hra: number; lta: number } {
  const { salary, exemptions } = resolved

  const hra = isAllowed(regimeRules, 'hra')
    ? raw.salaryEntryMode === 'monthly' || raw.rentEntryMode === 'monthly'
      ? computeHraExemptionFromMonthly(
          monthlySalaryForHra(raw, resolved),
          monthlyRentForHra(raw, resolved),
          exemptions.isMetro,
        )
      : computeHraExemption(
          salary.basic,
          salary.hraReceived,
          exemptions.rentPaid,
          exemptions.isMetro,
        )
    : 0

  const lta = isAllowed(regimeRules, 'lta')
    ? Math.min(salary.ltaReceived, exemptions.ltaExemptAmount)
    : 0

  return { hra, lta }
}

export function computeDeductions(
  resolved: ResolvedTaxInput,
  regime: TaxRegime,
  rules: TaxRulesConfig,
  netSalaryAfterExemptions: number,
): Record<string, number> {
  const regimeRules = regime === 'old' ? rules.oldRegime : rules.newRegime
  const { salary, investments } = resolved
  const caps = rules.deductionCaps
  const deductions: Record<string, number> = {}

  if (isAllowed(regimeRules, 'standardDeduction')) {
    deductions.standardDeduction = Math.min(
      regimeRules.standardDeductionSalaried,
      netSalaryAfterExemptions,
    )
  }

  if (isAllowed(regimeRules, 'professionalTax')) {
    deductions.professionalTax = Math.min(
      salary.professionalTax,
      netSalaryAfterExemptions,
    )
  }

  if (isAllowed(regimeRules, '80C')) {
    const total80C = salary.employeePf + investments.section80C
    deductions.section80C = Math.min(total80C, caps.section80C)
  }

  if (isAllowed(regimeRules, '80CCD1B')) {
    deductions.section80CCD1B = Math.min(
      investments.section80CCD1B,
      caps.section80CCD1B,
    )
  }

  if (isAllowed(regimeRules, '80CCD2')) {
    const maxNps =
      salary.basic * regimeRules.employerNps80CCD2PercentOfBasic
    deductions.section80CCD2 = Math.min(investments.employerNps, maxNps)
  }

  if (isAllowed(regimeRules, '80D')) {
    const max80D = caps.section80D.self + caps.section80D.parents
    deductions.section80D = Math.min(investments.section80D, max80D)
  }

  if (isAllowed(regimeRules, '80E')) {
    deductions.section80E = investments.section80E
  }

  if (isAllowed(regimeRules, '24b')) {
    deductions.section24b = Math.min(investments.section24b, caps.section24b)
  }

  return deductions
}

export function sumDeductions(deductions: Record<string, number>): number {
  return Object.values(deductions).reduce((sum, v) => sum + v, 0)
}
