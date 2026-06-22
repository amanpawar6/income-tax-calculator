import { useFinancialYear } from '../context/FinancialYearContext'
import { formatInr } from '../utils/format-inr'

export function FyCapsBanner() {
  const { rules } = useFinancialYear()
  const { deductionCaps, oldRegime, newRegime } = rules

  return (
    <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
      <span className="font-medium text-slate-800">{rules.label}:</span> 80C cap{' '}
      {formatInr(deductionCaps.section80C)} · Standard deduction (old / new){' '}
      {formatInr(oldRegime.standardDeductionSalaried)} /{' '}
      {formatInr(newRegime.standardDeductionSalaried)} · 87A rebate up to taxable
      income{' '}
      {oldRegime.section87A
        ? formatInr(oldRegime.section87A.maxTaxableIncome)
        : 'N/A'}{' '}
      (old) /{' '}
      {newRegime.section87A
        ? formatInr(newRegime.section87A.maxTaxableIncome)
        : 'N/A'}{' '}
      (new)
    </p>
  )
}
