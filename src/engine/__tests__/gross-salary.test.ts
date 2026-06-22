import { describe, expect, it } from 'vitest'
import { emptySalaryComponents } from '../../domain/types'
import {
  computeCtc,
  computeGrossSalary,
  computeNonTaxableAllowances,
} from '../gross-salary'

describe('gross salary', () => {
  it('excludes non-taxable allowances from taxable gross', () => {
    const salary = {
      ...emptySalaryComponents(),
      basic: 800_000,
      foodCoupons: 26_400,
      phoneInternet: 24_000,
      driverCarAllowance: 12_000,
    }
    expect(computeGrossSalary(salary)).toBe(800_000)
    expect(computeNonTaxableAllowances(salary)).toBe(62_400)
    expect(computeCtc(salary)).toBe(862_400)
  })

  it('includes retirals in CTC', () => {
    const salary = {
      ...emptySalaryComponents(),
      basic: 600_000,
      employeePf: 72_000,
      gratuity: 28_000,
    }
    expect(computeCtc(salary)).toBe(700_000)
  })
})
