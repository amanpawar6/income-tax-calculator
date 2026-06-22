import { emptySalaryComponents, emptyTaxInput, type TaxInput } from './types'

/** Merge partial input (e.g. test fixtures) with defaults. */
export function normalizeTaxInput(
  partial: Partial<TaxInput> & {
    salary: TaxInput['salary']
    investments: TaxInput['investments']
  },
): TaxInput {
  const base = emptyTaxInput()
  const investmentEntryMode =
    partial.investmentEntryMode ??
    (partial.investments ? 'summary' : base.investmentEntryMode)

  return {
    ...base,
    ...partial,
    investmentEntryMode,
    exemptions: { ...base.exemptions, ...(partial.exemptions ?? {}) },
    investments: { ...base.investments, ...partial.investments },
    salary: { ...emptySalaryComponents(), ...partial.salary },
    monthlySalary:
      partial.monthlySalary?.map((month) => ({
        ...emptySalaryComponents(),
        ...month,
      })) ?? base.monthlySalary,
  }
}
