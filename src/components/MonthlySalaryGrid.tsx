import { FY_MONTH_LABELS } from '../domain/fy-months'
import {
  NON_TAXABLE_SALARY_FIELDS,
  PAYROLL_META_FIELDS,
  TAXABLE_SALARY_FIELDS,
} from '../domain/salary-catalog'
import type { SalaryComponents } from '../domain/types'
import { formatInr } from '../utils/format-inr'

type FieldGroupKey = 'taxable' | 'nonTaxable' | 'payroll'

type FieldGroup = {
  key: FieldGroupKey
  title: string
  description?: string
  fields: typeof TAXABLE_SALARY_FIELDS
  rowClassName?: string
}

const FIELD_GROUPS: FieldGroup[] = [
  {
    key: 'taxable',
    title: 'Taxable',
    fields: TAXABLE_SALARY_FIELDS,
  },
  {
    key: 'nonTaxable',
    title: 'Non-taxable (exempt)',
    description:
      'Not included in taxable salary. Enter only amounts that are tax-exempt under your employer policy.',
    fields: NON_TAXABLE_SALARY_FIELDS,
    rowClassName: 'bg-emerald-50/40',
  },
  {
    key: 'payroll',
    title: 'Payroll (not in gross)',
    description:
      'PF and professional tax are handled separately in tax calculation. Gratuity is for CTC tracking only.',
    fields: PAYROLL_META_FIELDS,
    rowClassName: 'bg-slate-50/80',
  },
]

type MonthlySalaryGridProps = {
  months: SalaryComponents[]
  onChange: (months: SalaryComponents[]) => void
  /** Which field groups to render. Defaults to all. */
  groups?: FieldGroupKey[]
}

export function MonthlySalaryGrid({
  months,
  onChange,
  groups,
}: MonthlySalaryGridProps) {
  const visibleGroups = groups
    ? FIELD_GROUPS.filter((g) => groups.includes(g.key))
    : FIELD_GROUPS

  const updateMonth = (
    monthIndex: number,
    key: keyof SalaryComponents,
    value: number,
  ) => {
    const next = months.map((m, i) =>
      i === monthIndex ? { ...m, [key]: value } : m,
    )
    onChange(next)
  }

  const annualTotal = (key: keyof SalaryComponents) =>
    months.reduce((sum, m) => sum + m[key], 0)

  return (
    <div className="space-y-6 overflow-x-auto">
      {visibleGroups.map((group) => (
        <div key={group.key}>
          <h3 className="mb-1 text-sm font-semibold text-slate-800">
            {group.title}
          </h3>
          {group.description && (
            <p className="mb-2 text-xs text-slate-500">{group.description}</p>
          )}
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="sticky left-0 bg-white py-2 pr-3 font-medium">
                  Component
                </th>
                {FY_MONTH_LABELS.map((label) => (
                  <th key={label} className="px-1 py-2 font-medium">
                    {label}
                  </th>
                ))}
                <th className="py-2 pl-2 font-medium text-slate-900">FY total</th>
              </tr>
            </thead>
            <tbody>
              {group.fields.map(({ key, label, hint }) => (
                <tr
                  key={key}
                  className={`border-b border-slate-100 ${group.rowClassName ?? ''}`}
                >
                  <td className="sticky left-0 bg-white py-2 pr-3">
                    <span className="font-medium text-slate-800">{label}</span>
                    {hint && (
                      <span className="block text-xs text-slate-400">
                        {hint}
                      </span>
                    )}
                  </td>
                  {FY_MONTH_LABELS.map((_, monthIndex) => (
                    <td key={monthIndex} className="px-1 py-1">
                      <input
                        type="number"
                        min={0}
                        step={500}
                        value={months[monthIndex]?.[key] || ''}
                        onChange={(e) =>
                          updateMonth(
                            monthIndex,
                            key,
                            Math.max(0, Number(e.target.value) || 0),
                          )
                        }
                        className="w-full min-w-[4.5rem] rounded border border-slate-200 px-1.5 py-1 text-right text-xs focus:border-indigo-500 focus:outline-none"
                        placeholder="0"
                      />
                    </td>
                  ))}
                  <td className="py-2 pl-2 text-right font-medium text-slate-900">
                    {formatInr(annualTotal(key))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {!groups?.includes('nonTaxable') && (
        <p className="text-xs text-slate-500">
          Enter amounts per month (Apr–Mar). Use the Non-taxable section for
          exempt allowances.
        </p>
      )}
    </div>
  )
}
