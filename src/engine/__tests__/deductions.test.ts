import { describe, expect, it } from 'vitest'
import { resolveTaxInput } from '../../domain/aggregate-input'
import { emptySalaryComponents } from '../../domain/types'
import { normalizeTaxInput } from '../../domain/normalize-input'
import { getTaxRules } from '../../domain/tax-rules'
import { computeDeductions } from '../deductions'

describe('computeDeductions — Section 80C cap', () => {
  const rules = getTaxRules('fy-2025-26')

  const input = normalizeTaxInput({
    salary: {
      ...emptySalaryComponents(),
      basic: 500_000,
      hraReceived: 0,
      specialAllowance: 0,
      ltaReceived: 0,
      bonus: 0,
      otherTaxableAllowances: 0,
      employeePf: 100_000,
      professionalTax: 0,
    },
    investments: {
      section80C: 50_000,
      section80CCD1B: 0,
      employerNps: 0,
      section80D: 0,
      section80E: 0,
      section24b: 0,
      otherIncome: 0,
    },
  })

  it('caps 80C at ₹1.5L including employee PF', () => {
    const resolved = resolveTaxInput(input)
    const deductions = computeDeductions(resolved, 'old', rules, 500_000)
    expect(deductions.section80C).toBe(150_000)
  })
})
