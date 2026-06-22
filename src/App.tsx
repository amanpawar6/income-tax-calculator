import { useMemo, useState, type ReactNode } from 'react'
import { DeductionsSection } from './components/DeductionsSection'
import { FyCapsBanner } from './components/FyCapsBanner'
import { HraSection } from './components/HraSection'
import { AppChrome } from './components/layout/AppChrome'
import {
  FloatingResultChip,
  hasSalaryInput,
} from './components/layout/FloatingResultChip'
import { MobileBottomNav } from './components/layout/MobileBottomNav'
import { SidebarNav } from './components/layout/SidebarNav'
import { NonTaxableSection } from './components/NonTaxableSection'
import { RegimeComparison } from './components/RegimeComparison'
import { ResultsHero } from './components/ResultsHero'
import { SalarySection } from './components/SalarySection'
import { useChromeOffset } from './hooks/useChromeOffset'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import {
  useActiveSection,
  useVisibleNavSections,
} from './hooks/useActiveSection'
import {
  FinancialYearProvider,
  useFinancialYear,
} from './context/FinancialYearContext'
import { resolveSalary } from './domain/aggregate-input'
import { emptyTaxInput, type TaxInput } from './domain/types'
import { compareRegimes } from './engine/compare-regimes'

function SectionAnchor({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-[var(--layout-sticky-top)]">
      {children}
    </div>
  )
}

function Calculator() {
  useChromeOffset()
  const { rules } = useFinancialYear()
  const [input, setInput] = useState<TaxInput>(emptyTaxInput)
  const debouncedInput = useDebouncedValue(input, 300)

  const comparison = useMemo(
    () => compareRegimes(debouncedInput, rules),
    [debouncedInput, rules],
  )

  const showHra = resolveSalary(input).hraReceived > 0
  const navSections = useVisibleNavSections(showHra)
  const sectionIds = navSections.map((s) => s.id)
  const activeId = useActiveSection(sectionIds)
  const showFloatingChip =
    hasSalaryInput(debouncedInput) && activeId !== 'section-results'

  const reset = () => setInput(emptyTaxInput())

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-8">
      <AppChrome
        onReset={reset}
        sections={navSections}
        activeId={activeId}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-stretch">
          <SidebarNav sections={navSections} activeId={activeId} />

          <div className="min-w-0 flex-1">
            <div className="grid items-start gap-6 lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
              <div className="space-y-6 lg:space-y-8">
                <SectionAnchor id="section-salary">
                  <SalarySection fullInput={input} onChange={setInput} />
                </SectionAnchor>

                <SectionAnchor id="section-non-taxable">
                  <NonTaxableSection fullInput={input} onChange={setInput} />
                </SectionAnchor>

                {showHra && (
                  <SectionAnchor id="section-hra">
                    <HraSection fullInput={input} onChange={setInput} />
                  </SectionAnchor>
                )}

                <SectionAnchor id="section-investments">
                  <DeductionsSection fullInput={input} onChange={setInput} />
                </SectionAnchor>
              </div>

              <div
                className="space-y-4 xl:sticky xl:max-h-[calc(100vh-var(--layout-sticky-top)-1.5rem)] xl:overflow-y-auto xl:overscroll-contain xl:self-start xl:pr-1"
                style={{ top: 'var(--layout-sticky-top)' }}
              >
                <SectionAnchor id="section-results">
                  <div className="space-y-4">
                    <ResultsHero
                      comparison={comparison}
                      fyLabel={rules.label}
                    />
                    <FyCapsBanner />
                    <RegimeComparison comparison={comparison} rules={rules} />
                  </div>
                </SectionAnchor>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav sections={navSections} activeId={activeId} />

      <FloatingResultChip comparison={comparison} visible={showFloatingChip} />

      <footer className="mx-auto max-w-7xl border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-500">
        Estimates only — not tax advice. Verify with a CA or the{' '}
        <a
          href="https://www.incometax.gov.in"
          className="font-medium text-indigo-600 underline hover:text-indigo-800"
          target="_blank"
          rel="noreferrer"
        >
          Income Tax Department
        </a>
        . LTA, surcharge & senior slabs simplified in this version.
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <FinancialYearProvider>
      <Calculator />
    </FinancialYearProvider>
  )
}
