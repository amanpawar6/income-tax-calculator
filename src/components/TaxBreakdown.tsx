import type { TaxRulesConfig } from '../domain/tax-rules/types'
import type { TaxResult } from '../domain/types'
import { formatInr, formatPercent } from '../utils/format-inr'
import { SlabBreakdown } from './SlabBreakdown'

const DEDUCTION_LABELS: Record<string, string> = {
  standardDeduction: 'Standard deduction',
  professionalTax: 'Professional tax',
  section80C: 'Section 80C',
  section80CCD1B: 'Section 80CCD(1B)',
  section80CCD2: 'Section 80CCD(2)',
  section80D: 'Section 80D',
  section80E: 'Section 80E',
  section24b: 'Section 24(b)',
}

type TaxBreakdownProps = {
  result: TaxResult
  title: string
  rules: TaxRulesConfig
  highlighted?: boolean
}

export function TaxBreakdown({
  result,
  title,
  rules,
  highlighted = false,
}: TaxBreakdownProps) {
  const regimeRules =
    result.regime === 'old' ? rules.oldRegime : rules.newRegime
  const deductionEntries = Object.entries(result.deductions).filter(
    ([, v]) => v > 0,
  )

  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm ${
        highlighted
          ? 'border-indigo-300 bg-indigo-50/80 ring-2 ring-indigo-200'
          : 'border-slate-200/80 bg-white ring-1 ring-slate-900/5'
      }`}
    >
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <dl className="mt-4 space-y-2 text-sm">
        <Row label="CTC (annual)" value={formatInr(result.ctc)} bold />
        {result.nonTaxableAllowances > 0 && (
          <Row
            label="Non-taxable allowances"
            value={formatInr(result.nonTaxableAllowances)}
            muted
          />
        )}
        <Row
          label="Taxable gross salary"
          value={formatInr(result.grossSalary)}
        />
        {result.exemptions.hra > 0 && (
          <Row
            label="HRA exemption"
            value={`− ${formatInr(result.exemptions.hra)}`}
          />
        )}
        {result.exemptions.lta > 0 && (
          <Row
            label="LTA exemption"
            value={`− ${formatInr(result.exemptions.lta)}`}
          />
        )}
        {deductionEntries.map(([key, amount]) => (
          <Row
            key={key}
            label={DEDUCTION_LABELS[key] ?? key}
            value={`− ${formatInr(amount)}`}
          />
        ))}
        <Row
          label="Taxable income"
          value={formatInr(result.taxableIncome)}
          bold
        />
        <Row label="Tax before rebate" value={formatInr(result.taxBeforeRebate)} />
        {result.rebate87A > 0 && (
          <Row
            label="Rebate u/s 87A"
            value={`− ${formatInr(result.rebate87A)}`}
          />
        )}
        <Row label="Cess (4%)" value={formatInr(result.cess)} />
        <Row label="Total tax" value={formatInr(result.totalTax)} bold />
        <Row label="Monthly (approx.)" value={formatInr(result.monthlyTds)} />
        <Row
          label="Effective rate"
          value={formatPercent(result.effectiveRate)}
        />
      </dl>
      <SlabBreakdown
        slabs={regimeRules.slabs}
        taxableIncome={result.taxableIncome}
      />
    </article>
  )
}

function Row({
  label,
  value,
  bold = false,
  muted = false,
}: {
  label: string
  value: string
  bold?: boolean
  muted?: boolean
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={muted ? 'text-emerald-700' : 'text-slate-600'}>{label}</dt>
      <dd
        className={`text-right ${muted ? 'text-emerald-800' : 'text-slate-900'} ${bold ? 'font-semibold' : ''}`}
      >
        {value}
      </dd>
    </div>
  )
}
