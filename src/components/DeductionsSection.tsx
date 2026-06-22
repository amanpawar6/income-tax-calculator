import {
  INVESTMENT_CATEGORIES,
  type InvestmentDetail,
} from '../domain/investment-catalog'
import {
  resolveInvestments,
  syncDetailFromSummary,
  syncSummaryFromDetail,
} from '../domain/aggregate-input'
import type { InvestmentDeductions, TaxInput } from '../domain/types'
import { useFinancialYear } from '../context/FinancialYearContext'
import { formatInr } from '../utils/format-inr'
import { CurrencyInput } from './CurrencyInput'
import { EntryModeToggle } from './EntryModeToggle'

type DeductionsSectionProps = {
  fullInput: TaxInput
  onChange: (input: TaxInput) => void
}

export function DeductionsSection({
  fullInput,
  onChange,
}: DeductionsSectionProps) {
  const { rules } = useFinancialYear()
  const caps = rules.deductionCaps
  const { investmentEntryMode, investments, investmentDetail } = fullInput
  const resolved = resolveInvestments(fullInput)

  const setMode = (mode: 'summary' | 'detailed') => {
    if (mode === investmentEntryMode) return
    if (mode === 'detailed') {
      onChange({
        ...fullInput,
        investmentEntryMode: 'detailed',
        investmentDetail: syncDetailFromSummary(investments),
      })
    } else {
      onChange({
        ...fullInput,
        investmentEntryMode: 'summary',
        investments: syncSummaryFromDetail(investmentDetail),
      })
    }
  }

  const updateSummary = (patch: Partial<InvestmentDeductions>) => {
    onChange({
      ...fullInput,
      investments: { ...investments, ...patch },
    })
  }

  const updateDetailField = (
    categoryId: keyof InvestmentDetail,
    fieldKey: string,
    value: number,
  ) => {
    const category = investmentDetail[categoryId] as Record<string, number>
    onChange({
      ...fullInput,
      investmentDetail: {
        ...investmentDetail,
        [categoryId]: { ...category, [fieldKey]: value },
      },
    })
  }

  const categoryTotal = (categoryId: keyof InvestmentDetail): number => {
    const cat = investmentDetail[categoryId] as Record<string, number>
    return Object.values(cat).reduce((a, b) => a + b, 0)
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-900/5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Investments & deductions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            80C cap {formatInr(caps.section80C)} · Mostly old regime
          </p>
        </div>
        <EntryModeToggle
          value={investmentEntryMode}
          onChange={setMode}
          options={[
            { value: 'detailed', label: 'Item-wise' },
            { value: 'summary', label: 'Section totals' },
          ]}
        />
      </div>

      {investmentEntryMode === 'summary' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <CurrencyInput
            label="Section 80C (PPF, ELSS, LIC, etc.)"
            value={investments.section80C}
            onChange={(v) => updateSummary({ section80C: v })}
            hint={`Cap ${formatInr(caps.section80C)} excl. employee PF`}
          />
          <CurrencyInput
            label="Section 80CCD(1B) — additional NPS"
            value={investments.section80CCD1B}
            onChange={(v) => updateSummary({ section80CCD1B: v })}
            hint={`Cap ${formatInr(caps.section80CCD1B)}`}
          />
          <CurrencyInput
            label="Employer NPS — 80CCD(2)"
            value={investments.employerNps}
            onChange={(v) => updateSummary({ employerNps: v })}
            hint="Both regimes (different % of basic)"
          />
          <CurrencyInput
            label="Section 80D — health insurance"
            value={investments.section80D}
            onChange={(v) => updateSummary({ section80D: v })}
            hint={`Max ~${formatInr(caps.section80D.self + caps.section80D.parents)}`}
          />
          <CurrencyInput
            label="Section 80E — education loan interest"
            value={investments.section80E}
            onChange={(v) => updateSummary({ section80E: v })}
          />
          <CurrencyInput
            label="Section 24(b) — home loan interest"
            value={investments.section24b}
            onChange={(v) => updateSummary({ section24b: v })}
            hint={`Cap ${formatInr(caps.section24b)}`}
          />
          <CurrencyInput
            label="Other income"
            value={investments.otherIncome}
            onChange={(v) => updateSummary({ otherIncome: v })}
            hint="Interest, rental, etc."
          />
        </div>
      ) : (
        <div className="space-y-6">
          {INVESTMENT_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border border-slate-100 bg-slate-50/50 p-4"
            >
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {category.title}
                    <span className="ml-2 rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-800">
                      {category.sectionLabel}
                    </span>
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {category.description}
                  </p>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Total: {formatInr(categoryTotal(category.id))}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {category.fields.map((field) => (
                  <CurrencyInput
                    key={field.key}
                    label={field.label}
                    value={
                      (
                        investmentDetail[category.id] as Record<string, number>
                      )[field.key] ?? 0
                    }
                    onChange={(v) =>
                      updateDetailField(category.id, field.key, v)
                    }
                    hint={field.hint}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-900">
        Resolved annual totals used for tax: 80C{' '}
        {formatInr(resolved.section80C)} + PF · 80D{' '}
        {formatInr(resolved.section80D)} · 24(b){' '}
        {formatInr(resolved.section24b)}
      </p>
    </section>
  )
}
