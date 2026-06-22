import {
  annualToMonthly,
  monthlyToAnnual,
  resolveSalary,
} from '../domain/aggregate-input'
import {
  PAYROLL_META_FIELDS,
  TAXABLE_SALARY_FIELDS,
} from '../domain/salary-catalog'
import type { SalaryComponents, TaxInput } from '../domain/types'
import { computeCtc, computeGrossSalary } from '../engine/gross-salary'
import { formatInr } from '../utils/format-inr'
import { CurrencyInput } from './CurrencyInput'
import { EntryModeToggle } from './EntryModeToggle'
import { MonthlySalaryGrid } from './MonthlySalaryGrid'

type SalarySectionProps = {
  fullInput: TaxInput
  onChange: (input: TaxInput) => void
}

function SalaryFieldGroup({
  title,
  description,
  fields,
  salary,
  onUpdate,
}: {
  title: string
  description?: string
  fields: typeof TAXABLE_SALARY_FIELDS
  salary: SalaryComponents
  onUpdate: (patch: Partial<SalaryComponents>) => void
}) {
  return (
    <div className="rounded-lg border border-slate-100 p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-1 mb-3 text-xs text-slate-500">{description}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ key, label, hint }) => (
          <CurrencyInput
            key={key}
            label={label}
            value={salary[key]}
            onChange={(v) => onUpdate({ [key]: v })}
            hint={hint}
          />
        ))}
      </div>
    </div>
  )
}

export function SalarySection({ fullInput, onChange }: SalarySectionProps) {
  const { salaryEntryMode, salary, monthlySalary } = fullInput
  const annualPreview = resolveSalary(fullInput)
  const taxableGross = computeGrossSalary(annualPreview)
  const ctc = computeCtc(annualPreview)

  const setMode = (mode: 'annual' | 'monthly') => {
    if (mode === salaryEntryMode) return
    if (mode === 'monthly') {
      onChange({
        ...fullInput,
        salaryEntryMode: 'monthly',
        monthlySalary: annualToMonthly(salary),
      })
    } else {
      onChange({
        ...fullInput,
        salaryEntryMode: 'annual',
        salary: monthlyToAnnual(monthlySalary),
      })
    }
  }

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
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-900/5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Salary components (taxable)
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Taxable gross: {formatInr(taxableGross)}
            <span className="mx-1.5 text-slate-300">·</span>
            CTC: {formatInr(ctc)}
          </p>
        </div>
        <EntryModeToggle
          value={salaryEntryMode}
          onChange={setMode}
          options={[
            { value: 'annual', label: 'Annual total' },
            { value: 'monthly', label: 'Month-wise' },
          ]}
        />
      </div>

      {salaryEntryMode === 'annual' ? (
        <div className="space-y-4">
          <SalaryFieldGroup
            title="Taxable components"
            fields={TAXABLE_SALARY_FIELDS}
            salary={salary}
            onUpdate={updateAnnual}
          />
          <SalaryFieldGroup
            title="Payroll"
            description="Employee PF counts toward 80C. Professional tax applies in old regime. Gratuity is for CTC tracking only."
            fields={PAYROLL_META_FIELDS}
            salary={salary}
            onUpdate={updateAnnual}
          />
        </div>
      ) : (
        <MonthlySalaryGrid
          months={monthlySalary}
          onChange={updateMonthly}
          groups={['taxable', 'payroll']}
        />
      )}

      {salaryEntryMode === 'monthly' && (
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Annual taxable gross:{' '}
          <span className="font-semibold text-slate-900">
            {formatInr(taxableGross)}
          </span>
          <span className="mx-2 text-slate-300">·</span>
          CTC:{' '}
          <span className="font-semibold text-slate-900">
            {formatInr(ctc)}
          </span>
        </p>
      )}
    </section>
  )
}
