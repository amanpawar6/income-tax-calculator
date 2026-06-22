import { FY_MONTH_COUNT } from './fy-months'
import { emptySalaryComponents } from './types'
import {
  aggregateInvestmentDetail,
  emptyInvestmentDetail,
  type InvestmentDetail,
} from './investment-catalog'
import type {
  ExemptionInputs,
  InvestmentDeductions,
  SalaryComponents,
  TaxInput,
} from './types'
import { computeHraExemption } from '../engine/hra-exemption'

export type ResolvedTaxInput = {
  salary: SalaryComponents
  exemptions: ExemptionInputs
  investments: InvestmentDeductions
}

export function sumSalaryComponents(
  months: SalaryComponents[],
): SalaryComponents {
  const total = emptySalaryComponents()
  for (const month of months) {
    for (const key of Object.keys(total) as (keyof SalaryComponents)[]) {
      total[key] += month[key]
    }
  }
  return total
}

function sumMonthly(values: number[]): number {
  return values.reduce((a, b) => a + b, 0)
}

export function resolveAnnualRent(input: TaxInput): number {
  if (input.rentEntryMode === 'monthly') {
    return sumMonthly(input.exemptions.monthlyRentPaid)
  }
  return input.exemptions.rentPaid
}

/** Month-wise HRA exemption total (old regime). */
export function computeHraExemptionFromMonthly(
  months: SalaryComponents[],
  monthlyRent: number[],
  isMetro: boolean,
): number {
  let total = 0
  for (let i = 0; i < FY_MONTH_COUNT; i++) {
    const m = months[i] ?? emptySalaryComponents()
    const rent = monthlyRent[i] ?? 0
    total += computeHraExemption(m.basic, m.hraReceived, rent, isMetro)
  }
  return total
}

export function resolveSalary(input: TaxInput): SalaryComponents {
  if (input.salaryEntryMode === 'monthly') {
    return sumSalaryComponents(input.monthlySalary)
  }
  return input.salary
}

export function resolveInvestments(input: TaxInput): InvestmentDeductions {
  if (input.investmentEntryMode === 'detailed') {
    return aggregateInvestmentDetail(input.investmentDetail)
  }
  return input.investments
}

export function resolveTaxInput(input: TaxInput): ResolvedTaxInput {
  const salary = resolveSalary(input)
  const investments = resolveInvestments(input)
  const rentPaid = resolveAnnualRent(input)

  return {
    salary,
    exemptions: {
      ...input.exemptions,
      rentPaid,
    },
    investments,
  }
}

export function syncDetailFromSummary(
  summary: InvestmentDeductions,
): InvestmentDetail {
  const detail = emptyInvestmentDetail()
  detail.section80C.ppf = summary.section80C
  detail.section80CCD1B.npsAdditional = summary.section80CCD1B
  detail.section80CCD2.employerNps = summary.employerNps
  detail.section80D.selfFamily = summary.section80D
  detail.section80E.educationLoanInterest = summary.section80E
  detail.section24b.homeLoanInterest = summary.section24b
  detail.otherIncome.other = summary.otherIncome
  return detail
}

export function syncSummaryFromDetail(
  detail: InvestmentDetail,
): InvestmentDeductions {
  return aggregateInvestmentDetail(detail)
}

/** Copy annual salary into each month (÷12) when switching to monthly mode. */
export function annualToMonthly(
  annual: SalaryComponents,
): SalaryComponents[] {
  const keys = Object.keys(
    emptySalaryComponents(),
  ) as (keyof SalaryComponents)[]
  return Array.from({ length: FY_MONTH_COUNT }, () => {
    const month = emptySalaryComponents()
    for (const key of keys) {
      month[key] = Math.round(annual[key] / 12)
    }
    return month
  })
}

export function monthlyToAnnual(months: SalaryComponents[]): SalaryComponents {
  return sumSalaryComponents(months)
}

export function distributeRentToMonths(annualRent: number): number[] {
  const perMonth = Math.round(annualRent / 12)
  return Array.from({ length: FY_MONTH_COUNT }, () => perMonth)
}
