import { describe, expect, it } from 'vitest'
import { normalizeTaxInput } from '../../domain/normalize-input'
import { emptySalaryComponents } from '../../domain/types'
import { getTaxRules } from '../../domain/tax-rules'
import { applySection87A } from '../rebate-87a'
import { compareRegimes } from '../compare-regimes'

describe('compareRegimes', () => {
  const rules = getTaxRules('fy-2025-26')

  const highDeductionInput = normalizeTaxInput({
    salary: {
      ...emptySalaryComponents(),
      basic: 400_000,
      hraReceived: 160_000,
      specialAllowance: 200_000,
      ltaReceived: 0,
      bonus: 240_000,
      otherTaxableAllowances: 0,
      employeePf: 72_000,
      professionalTax: 2_400,
    },
    exemptions: {
      rentPaid: 150_000,
      monthlyRentPaid: Array(12).fill(0),
      isMetro: true,
      ltaExemptAmount: 0,
    },
    investments: {
      section80C: 78_000,
      section80CCD1B: 0,
      employerNps: 0,
      section80D: 75_000,
      section80E: 0,
      section24b: 200_000,
      otherIncome: 0,
    },
  })

  it('old regime can beat new when deductions are high (FY 2024-25)', () => {
    const rules2425 = getTaxRules('fy-2024-25')
    const result = compareRegimes(highDeductionInput, rules2425)
    expect(result.old.totalTax).toBeLessThan(result.new.totalTax)
    expect(result.recommended).toBe('old')
    expect(result.savings).toBeGreaterThan(0)
  })

  it('recommended regime matches lower total tax', () => {
    const result = compareRegimes(highDeductionInput, rules)
    const lower =
      result.old.totalTax <= result.new.totalTax ? 'old' : 'new'
    expect(result.recommended).toBe(lower)
  })

  it('new regime wins with minimal deductions on ₹12L CTC', () => {
    const input = normalizeTaxInput({
      salary: {
        ...emptySalaryComponents(),
        basic: 500_000,
        hraReceived: 200_000,
        specialAllowance: 300_000,
        ltaReceived: 0,
        bonus: 200_000,
        otherTaxableAllowances: 0,
        employeePf: 60_000,
        professionalTax: 0,
      },
      investments: {
        section80C: 0,
        section80CCD1B: 0,
        employerNps: 0,
        section80D: 0,
        section80E: 0,
        section24b: 0,
        otherIncome: 0,
      },
    })
    const result = compareRegimes(input, rules)
    expect(result.new.totalTax).toBeLessThanOrEqual(result.old.totalTax)
  })
})

describe('applySection87A', () => {
  const rules = getTaxRules('fy-2025-26')

  it('full rebate when taxable income within new regime limit', () => {
    const rebate = applySection87A(
      60_000,
      1_200_000,
      rules.newRegime.section87A,
    )
    expect(rebate).toBe(60_000)
  })

  it('no rebate when income exceeds limit', () => {
    const rebate = applySection87A(
      60_000,
      1_300_000,
      rules.newRegime.section87A,
    )
    expect(rebate).toBe(0)
  })
})
