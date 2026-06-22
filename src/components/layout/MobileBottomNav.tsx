import { scrollToSection, type NavSection } from '../../config/navigation'

type MobileBottomNavProps = {
  sections: NavSection[]
  activeId: string
}

export function MobileBottomNav({ sections, activeId }: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Mobile section navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur-md md:hidden"
    >
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${sections.length}, minmax(0, 1fr))`,
        }}
      >
        {sections.map((section) => {
          const isActive = activeId === section.id
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-indigo-700' : 'text-slate-500'
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {section.step}
              </span>
              {section.shortLabel}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
