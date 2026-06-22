export type NavSection = {
  id: string
  label: string
  shortLabel: string
  step: number
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'section-salary', label: 'Salary', shortLabel: 'Salary', step: 1 },
  {
    id: 'section-non-taxable',
    label: 'Non-taxable (exempt)',
    shortLabel: 'Exempt',
    step: 2,
  },
  { id: 'section-hra', label: 'HRA & exemptions', shortLabel: 'HRA', step: 3 },
  {
    id: 'section-investments',
    label: 'Investments',
    shortLabel: 'Invest',
    step: 4,
  },
  { id: 'section-results', label: 'Tax results', shortLabel: 'Results', step: 5 },
]

function getScrollOffset(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    '--layout-sticky-top',
  )
  const parsed = parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : 120
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) {
    return
  }

  const offset = getScrollOffset()
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}
