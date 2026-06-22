import { useFinancialYear } from '../context/FinancialYearContext'

type FinancialYearSelectorProps = {
  variant?: 'light' | 'dark'
  compact?: boolean
}

export function FinancialYearSelector({
  variant = 'light',
  compact = false,
}: FinancialYearSelectorProps) {
  const { fyId, setFyId, availableYears } = useFinancialYear()
  const isDark = variant === 'dark'

  return (
    <label
      className={`flex text-sm ${compact ? 'flex-row items-center gap-2' : 'flex-col gap-1'}`}
    >
      <span
        className={`shrink-0 font-medium ${isDark ? 'text-indigo-200' : 'text-slate-600'} ${compact ? 'text-xs' : ''}`}
      >
        FY
      </span>
      <select
        value={fyId}
        onChange={(e) => setFyId(e.target.value)}
        className={
          isDark
            ? `min-w-0 rounded-lg border border-white/20 bg-white/10 text-white shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 ${compact ? 'flex-1 px-2 py-2 text-xs sm:text-sm' : 'px-3 py-2'}`
            : `rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200`
        }
      >
        {availableYears.map((fy) => (
          <option key={fy.id} value={fy.id} className="text-slate-900">
            {compact ? fy.label.replace(' (AY ', ' · AY ').replace(')', '') : fy.label}
          </option>
        ))}
      </select>
    </label>
  )
}
