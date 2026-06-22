import type { Slab } from '../domain/tax-rules/types'
import { formatInr } from '../utils/format-inr'

type SlabBreakdownProps = {
  slabs: Slab[]
  taxableIncome: number
}

function formatSlabRange(previous: number, upTo: number | null): string {
  const from = formatInr(previous + 1)
  if (upTo === null) {
    return `Above ${formatInr(previous)}`
  }
  return `${from} – ${formatInr(upTo)}`
}

export function SlabBreakdown({ slabs, taxableIncome }: SlabBreakdownProps) {
  if (taxableIncome <= 0) {
    return null
  }

  let previous = 0
  const rows: { range: string; rate: string; tax: number }[] = []

  for (const slab of slabs) {
    const upper = slab.upTo ?? Number.POSITIVE_INFINITY
    if (taxableIncome <= previous) {
      break
    }
    const incomeInSlab = Math.min(taxableIncome, upper) - previous
    if (incomeInSlab > 0) {
      rows.push({
        range: formatSlabRange(previous, slab.upTo),
        rate: `${(slab.rate * 100).toFixed(0)}%`,
        tax: Math.round(incomeInSlab * slab.rate),
      })
    }
    previous = upper
  }

  return (
    <details className="mt-3 text-xs">
      <summary className="cursor-pointer font-medium text-slate-600">
        Slab-wise tax breakdown
      </summary>
      <table className="mt-2 w-full border-collapse">
        <thead>
          <tr className="text-left text-slate-500">
            <th className="py-1 pr-2">Income slab</th>
            <th className="py-1 pr-2">Rate</th>
            <th className="py-1 text-right">Tax</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.range} className="text-slate-700">
              <td className="py-0.5 pr-2">{row.range}</td>
              <td className="py-0.5 pr-2">{row.rate}</td>
              <td className="py-0.5 text-right">{formatInr(row.tax)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}
