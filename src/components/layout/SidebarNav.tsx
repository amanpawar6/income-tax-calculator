import { scrollToSection, type NavSection } from '../../config/navigation'

type SidebarNavProps = {
  sections: NavSection[]
  activeId: string
}

export function SidebarNav({ sections, activeId }: SidebarNavProps) {
  return (
    <aside className="hidden w-52 shrink-0 xl:block">
      {/*
        Parent flex row must use items-stretch so this column is as tall as main
        content — required for position:sticky to work on desktop.
      */}
      <div
        className="sticky z-30 w-52"
        style={{ top: 'var(--layout-sticky-top)' }}
      >
        <nav
          aria-label="Jump to section"
          className="max-h-[calc(100vh-var(--layout-sticky-top)-1.5rem)] overflow-y-auto overscroll-contain rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm ring-1 ring-slate-900/5"
        >
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Jump to
          </p>
          <ul className="space-y-0.5">
            {sections.map((section) => {
              const isActive = activeId === section.id
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-indigo-50 font-medium text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {section.step}
                    </span>
                    <span className="leading-snug">{section.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
