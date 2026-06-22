import type { SalaryComponents } from '../domain/types'
import {
  CTC_RETIRAL_KEYS,
  NON_TAXABLE_SALARY_KEYS,
  TAXABLE_SALARY_KEYS,
  sumSalaryKeys,
} from '../domain/salary-catalog'

export function computeGrossSalary(salary: SalaryComponents): number {
  return sumSalaryKeys(salary, TAXABLE_SALARY_KEYS)
}

export function computeNonTaxableAllowances(
  salary: SalaryComponents,
): number {
  return sumSalaryKeys(salary, NON_TAXABLE_SALARY_KEYS)
}

export function computeCtc(salary: SalaryComponents): number {
  return (
    computeGrossSalary(salary) +
    computeNonTaxableAllowances(salary) +
    sumSalaryKeys(salary, CTC_RETIRAL_KEYS)
  )
}
