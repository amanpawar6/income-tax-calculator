import { useEffect, useState } from 'react'
import { NAV_SECTIONS } from '../config/navigation'

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    for (const el of elements) {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sectionIds.join('|')])

  return activeId
}

export function useVisibleNavSections(showHra: boolean) {
  const filtered = NAV_SECTIONS.filter((s) => showHra || s.id !== 'section-hra')
  return filtered.map((s, i) => ({ ...s, step: i + 1 }))
}
