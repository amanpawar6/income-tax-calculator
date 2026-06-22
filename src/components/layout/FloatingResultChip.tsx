import { scrollToSection } from '../../config/navigation'
import { resolveSalary } from '../../domain/aggregate-input'
import type { RegimeComparison } from '../../domain/types'
import { formatInr } from '../../utils/format-inr'

type FloatingResultChipProps = {
  comparison: RegimeComparison
  visible: boolean
}

export function FloatingResultChip({
  comparison,
  visible,
}: FloatingResultChipProps) {
  if (!visible || comparison.savings === 0) return null

  return (
    <div className="fixed bottom-20 right-4 z-40 hidden md:bottom-6 md:block">
      <button
        type="button"
        onClick={() => scrollToSection('section-results')}
        className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 shadow-lg transition hover:bg-emerald-100"
      >
        {comparison.recommended === 'new' ? 'New' : 'Old'} saves{' '}
        {formatInr(comparison.savings)} →
      </button>
    </div>
  )
}

export function hasSalaryInput(input: Parameters<typeof resolveSalary>[0]) {
  const s = resolveSalary(input)
  const taxable =
    s.basic +
    s.hraReceived +
    s.specialAllowance +
    s.ltaReceived +
    s.bonus +
    s.otherTaxableAllowances
  return taxable > 0
}
