import { FinancialYearSelector } from '../FinancialYearSelector'
import { scrollToSection, type NavSection } from '../../config/navigation'

type AppChromeProps = {
  onReset: () => void
  sections: NavSection[]
  activeId: string
}

export function AppChrome({ onReset, sections, activeId }: AppChromeProps) {
  return (
    <div className="sticky top-0 z-50 shadow-md" data-app-chrome>
      {/* Main header */}
      <header className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-base font-bold sm:h-10 sm:w-10 sm:rounded-xl sm:text-lg"
              aria-hidden
            >
              ₹
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold sm:text-xl">
                India Tax Calculator
              </h1>
              <p className="hidden text-xs text-indigo-200 sm:block">
                Old vs new regime · Salaried individuals
              </p>
            </div>
          </div>

          <div className="flex w-full shrink-0 items-end gap-2 sm:w-auto sm:gap-3">
            <div className="min-w-0 flex-1 sm:min-w-[11rem] sm:flex-initial">
              <FinancialYearSelector variant="dark" compact />
            </div>
            <button
              type="button"
              onClick={onReset}
              className="shrink-0 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/20 sm:text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Section tabs — tablet/desktop only; hidden on xl (sidebar replaces) */}
      <nav
        aria-label="Section navigation"
        className="hidden border-b border-slate-200 bg-white md:block xl:hidden"
      >
        <div className="mx-auto flex max-w-7xl gap-0.5 overflow-x-auto px-2 sm:px-4">
          {sections.map((section) => {
            const isActive = activeId === section.id
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`relative shrink-0 whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors sm:px-4 sm:py-3 ${
                  isActive
                    ? 'text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <span
                  className={`mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold sm:mr-2 sm:text-xs ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {section.step}
                </span>
                <span className="hidden sm:inline">{section.label}</span>
                <span className="sm:hidden">{section.shortLabel}</span>
                {isActive && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-indigo-600 sm:inset-x-4" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
