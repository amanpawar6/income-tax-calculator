import { describe, expect, it } from 'vitest'
import {
  aggregateInvestmentDetail,
  emptyInvestmentDetail,
} from '../investment-catalog'
import {
  annualToMonthly,
  computeHraExemptionFromMonthly,
  resolveSalary,
  sumSalaryComponents,
} from '../aggregate-input'
import { emptySalaryComponents, emptyTaxInput } from '../types'

describe('aggregate-input', () => {
  it('sums monthly salary to annual', () => {
    const months = annualToMonthly({
      ...emptySalaryComponents(),
      basic: 1_200_000,
    })
    const total = sumSalaryComponents(months)
    expect(total.basic).toBe(1_200_000)
  })

  it('aggregates investment detail lines', () => {
    const detail = emptyInvestmentDetail()
    detail.section80C.ppf = 50_000
    detail.section80C.elss = 100_000
    const agg = aggregateInvestmentDetail(detail)
    expect(agg.section80C).toBe(150_000)
  })

  it('computes month-wise HRA when salary changes mid-year', () => {
    const months = annualToMonthly(emptySalaryComponents())
    months[0] = { ...emptySalaryComponents(), basic: 50_000, hraReceived: 20_000 }
    months[1] = { ...emptySalaryComponents(), basic: 60_000, hraReceived: 24_000 }
    const rent = [15_000, 18_000, ...Array(10).fill(0)]
    const exemption = computeHraExemptionFromMonthly(months, rent, true)
    expect(exemption).toBeGreaterThan(0)
  })

  it('resolveSalary uses monthly when mode is monthly', () => {
    const input = emptyTaxInput()
    input.salaryEntryMode = 'monthly'
    input.monthlySalary = annualToMonthly({
      ...emptySalaryComponents(),
      basic: 600_000,
    })
    expect(resolveSalary(input).basic).toBe(600_000)
  })
})
