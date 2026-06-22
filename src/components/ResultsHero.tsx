import type { RegimeComparison as ComparisonResult } from '../domain/types'
import { formatInr } from '../utils/format-inr'

type ResultsHeroProps = {
  comparison: ComparisonResult
  fyLabel: string
}

export function ResultsHero({ comparison, fyLabel }: ResultsHeroProps) {
  const { recommended, savings, old, new: newResult } = comparison
  const winnerTax = recommended === 'new' ? newResult.totalTax : old.totalTax
  const loserTax = recommended === 'new' ? old.totalTax : newResult.totalTax

  return (
    <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-5 text-white shadow-lg shadow-indigo-200/50">
      <p className="text-xs font-medium uppercase tracking-wider text-indigo-200">
        {fyLabel} · Recommendation
      </p>
      <p className="mt-2 text-2xl font-bold">
        {recommended === 'new' ? 'New' : 'Old'} regime is better
      </p>
      <p className="mt-1 text-sm text-indigo-100">
        You save{' '}
        <span className="font-semibold text-white">{formatInr(savings)}</span>{' '}
        compared to the other regime
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
          <p className="text-xs text-indigo-200">Best option</p>
          <p className="text-lg font-bold">{formatInr(winnerTax)}</p>
          <p className="text-xs text-indigo-200">total tax / year</p>
        </div>
        <div className="rounded-xl bg-white/5 px-3 py-2 backdrop-blur-sm">
          <p className="text-xs text-indigo-200">Other regime</p>
          <p className="text-lg font-semibold text-indigo-100">
            {formatInr(loserTax)}
          </p>
          <p className="text-xs text-indigo-200">total tax / year</p>
        </div>
      </div>
    </div>
  )
}
