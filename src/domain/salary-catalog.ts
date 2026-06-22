import type { SalaryComponents } from './types'

export type SalaryFieldDef = {
  key: keyof SalaryComponents
  label: string
  hint?: string
}

export const TAXABLE_SALARY_FIELDS: SalaryFieldDef[] = [
  { key: 'basic', label: 'Basic salary', hint: 'HRA & employer NPS base' },
  { key: 'hraReceived', label: 'HRA received' },
  { key: 'specialAllowance', label: 'Special allowance' },
  { key: 'ltaReceived', label: 'LTA received' },
  { key: 'bonus', label: 'Bonus / variable pay' },
  { key: 'otherTaxableAllowances', label: 'Other taxable allowances' },
]

export const NON_TAXABLE_SALARY_FIELDS: SalaryFieldDef[] = [
  {
    key: 'foodCoupons',
    label: 'Food coupons / meal vouchers',
    hint: 'Tax-free if conditions met (e.g. meal vouchers)',
  },
  {
    key: 'phoneInternet',
    label: 'Phone & internet reimbursement',
    hint: 'Bill-based reimbursement for official use',
  },
  {
    key: 'driverCarAllowance',
    label: 'Driver salary / car maintenance',
    hint: 'Exempt when used for official duties',
  },
  {
    key: 'childrenEducationAllowance',
    label: "Children's education allowance",
    hint: 'Exempt portion only (₹100/month per child, max 2)',
  },
  {
    key: 'childrenHostelAllowance',
    label: "Children's hostel allowance",
    hint: 'Exempt portion only (₹300/month per child, max 2)',
  },
  {
    key: 'giftVouchers',
    label: 'Gift vouchers / gifts from employer',
    hint: 'Small-value gifts may be exempt',
  },
  { key: 'uniformAllowance', label: 'Uniform allowance' },
  {
    key: 'booksPeriodicals',
    label: 'Books & periodicals reimbursement',
  },
  {
    key: 'otherNonTaxable',
    label: 'Other non-taxable reimbursements',
    hint: 'Any other exempt allowance not listed above',
  },
]

export const PAYROLL_META_FIELDS: SalaryFieldDef[] = [
  {
    key: 'employeePf',
    label: 'Employee PF (EPF)',
    hint: 'Not taxable; counts toward Section 80C',
  },
  {
    key: 'professionalTax',
    label: 'Professional tax',
    hint: 'Deductible from salary (old regime)',
  },
  {
    key: 'gratuity',
    label: 'Employer gratuity',
    hint: 'Accrued by employer; taxable only on payout (with exemption limits)',
  },
]

export const TAXABLE_SALARY_KEYS = TAXABLE_SALARY_FIELDS.map((f) => f.key)
export const NON_TAXABLE_SALARY_KEYS = NON_TAXABLE_SALARY_FIELDS.map(
  (f) => f.key,
)
/** Employer retirals included in CTC (employee PF + employer gratuity accrual). */
export const CTC_RETIRAL_KEYS: (keyof SalaryComponents)[] = [
  'employeePf',
  'gratuity',
]

export function sumSalaryKeys(
  salary: SalaryComponents,
  keys: (keyof SalaryComponents)[],
): number {
  return keys.reduce((sum, key) => sum + salary[key], 0)
}
