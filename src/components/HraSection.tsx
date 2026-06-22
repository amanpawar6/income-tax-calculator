import {
  distributeRentToMonths,
  resolveSalary,
} from '../domain/aggregate-input'
import type { ExemptionInputs, TaxInput } from '../domain/types'
import { FY_MONTH_LABELS } from '../domain/fy-months'
import { formatInr } from '../utils/format-inr'
import { CurrencyInput } from './CurrencyInput'
import { EntryModeToggle } from './EntryModeToggle'

type HraSectionProps = {
  fullInput: TaxInput
  onChange: (input: TaxInput) => void
}

export function HraSection({ fullInput, onChange }: HraSectionProps) {
  const hraReceived = resolveSalary(fullInput).hraReceived
  const { exemptions, rentEntryMode, salaryEntryMode } = fullInput

  if (hraReceived <= 0) {
    return null
  }

  const updateExemptions = (patch: Partial<ExemptionInputs>) => {
    onChange({
      ...fullInput,
      exemptions: { ...exemptions, ...patch },
    })
  }

  const setRentMode = (mode: 'annual' | 'monthly') => {
    if (mode === rentEntryMode) return
    if (mode === 'monthly') {
      onChange({
        ...fullInput,
        rentEntryMode: 'monthly',
        exemptions: {
          ...exemptions,
          monthlyRentPaid: distributeRentToMonths(exemptions.rentPaid),
        },
      })
    } else {
      const total = exemptions.monthlyRentPaid.reduce((a, b) => a + b, 0)
      onChange({
        ...fullInput,
        rentEntryMode: 'annual',
        exemptions: { ...exemptions, rentPaid: total },
      })
    }
  }

  const updateMonthlyRent = (index: number, value: number) => {
    const next = [...exemptions.monthlyRentPaid]
    next[index] = Math.max(0, value)
    updateExemptions({ monthlyRentPaid: next })
  }

  const showMonthlyRent =
    rentEntryMode === 'monthly' || salaryEntryMode === 'monthly'

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-900/5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          HRA exemption (old regime)
        </h2>
        <EntryModeToggle
          value={showMonthlyRent ? 'monthly' : 'annual'}
          onChange={setRentMode}
          options={[
            { value: 'annual', label: 'Annual rent' },
            { value: 'monthly', label: 'Month-wise rent' },
          ]}
        />
      </div>

      {showMonthlyRent ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[58rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                {FY_MONTH_LABELS.map((label) => (
                  <th key={label} className="px-1 py-2 font-medium">
                    {label}
                  </th>
                ))}
                <th className="py-2 pl-2 font-medium text-slate-900">FY total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                {FY_MONTH_LABELS.map((label, i) => (
                  <td key={label} className="px-1 py-1">
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={exemptions.monthlyRentPaid[i] || ''}
                      onChange={(e) =>
                        updateMonthlyRent(i, Number(e.target.value) || 0)
                      }
                      className="w-full min-w-[5.5rem] rounded-lg border border-slate-300 px-2 py-2 text-right text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="0"
                      aria-label={`Rent paid in ${label}`}
                    />
                  </td>
                ))}
                <td className="py-2 pl-2 text-right font-medium text-slate-900">
                  {formatInr(
                    exemptions.monthlyRentPaid.reduce((a, b) => a + b, 0),
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs text-slate-500">
            Enter rent per month (Apr–Mar). Scroll horizontally on smaller
            screens.
          </p>
        </div>
      ) : (
        <CurrencyInput
          label="Annual rent paid"
          value={exemptions.rentPaid}
          onChange={(v) => updateExemptions({ rentPaid: v })}
        />
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={exemptions.isMetro}
            onChange={(e) => updateExemptions({ isMetro: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
          />
          Metro city (50% of basic vs 40%)
        </label>
        <CurrencyInput
          label="LTA exempt amount"
          value={exemptions.ltaExemptAmount}
          onChange={(v) => updateExemptions({ ltaExemptAmount: v })}
          hint="Enter eligible exempt LTA (simplified)"
        />
      </div>
    </section>
  )
}
