import type { RegimeComparison as ComparisonResult } from '../domain/types'
import type { TaxRulesConfig } from '../domain/tax-rules/types'
import { TaxBreakdown } from './TaxBreakdown'

type RegimeComparisonProps = {
  comparison: ComparisonResult
  rules: TaxRulesConfig
}

export function RegimeComparison({ comparison, rules }: RegimeComparisonProps) {
  const { old, new: newResult, recommended } = comparison

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Detailed breakdown</h2>
      <div className="grid gap-4">
      <TaxBreakdown
        result={old}
        title="Old tax regime"
        rules={rules}
        highlighted={recommended === 'old'}
      />
      <TaxBreakdown
        result={newResult}
        title="New tax regime"
        rules={rules}
        highlighted={recommended === 'new'}
      />
      </div>
    </div>
  )
}
