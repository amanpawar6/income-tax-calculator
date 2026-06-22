import { resolveSalary } from '../domain/aggregate-input'
import { NON_TAXABLE_SALARY_FIELDS, sumSalaryKeys, NON_TAXABLE_SALARY_KEYS } from '../domain/salary-catalog'
import type { SalaryComponents, TaxInput } from '../domain/types'
import { computeNonTaxableAllowances } from '../engine/gross-salary'
import { formatInr } from '../utils/format-inr'
import { CurrencyInput } from './CurrencyInput'
import { MonthlySalaryGrid } from './MonthlySalaryGrid'

type NonTaxableSectionProps = {
  fullInput: TaxInput
  onChange: (input: TaxInput) => void
}

export function NonTaxableSection({
  fullInput,
  onChange,
}: NonTaxableSectionProps) {
  const { salaryEntryMode, salary, monthlySalary } = fullInput
  const annualPreview = resolveSalary(fullInput)
  const nonTaxableTotal = computeNonTaxableAllowances(annualPreview)

  const updateAnnual = (patch: Partial<SalaryComponents>) => {
    onChange({
      ...fullInput,
      salary: { ...salary, ...patch },
    })
  }

  const updateMonthly = (months: SalaryComponents[]) => {
    onChange({ ...fullInput, monthlySalary: months })
  }

  return (
    <section className="rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-sm ring-1 ring-emerald-900/5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Non-taxable (exempt)
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Food coupons, reimbursements, and similar benefits excluded from
          taxable salary. Enter only amounts that are tax-exempt under your
          employer policy.
        </p>
        <p className="mt-2 text-xs font-medium text-emerald-800">
          Annual exempt total: {formatInr(nonTaxableTotal)}
          {salaryEntryMode === 'monthly' && (
            <span className="font-normal text-emerald-700">
              {' '}
              · Month-wise entry (same mode as Salary)
            </span>
          )}
        </p>
      </div>

      {salaryEntryMode === 'annual' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {NON_TAXABLE_SALARY_FIELDS.map(({ key, label, hint }) => (
            <CurrencyInput
              key={key}
              label={label}
              value={salary[key]}
              onChange={(v) => updateAnnual({ [key]: v })}
              hint={hint}
            />
          ))}
        </div>
      ) : (
        <>
          <MonthlySalaryGrid
            months={monthlySalary}
            onChange={updateMonthly}
            groups={['nonTaxable']}
          />
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            FY exempt total:{' '}
            <span className="font-semibold">
              {formatInr(sumSalaryKeys(annualPreview, NON_TAXABLE_SALARY_KEYS))}
            </span>
          </p>
        </>
      )}
    </section>
  )
}
