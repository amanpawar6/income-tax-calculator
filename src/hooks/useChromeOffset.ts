import { useEffect } from 'react'

const CHROME_SELECTOR = '[data-app-chrome]'

/** Sync --layout-sticky-top with actual rendered header chrome height (desktop). */
export function useChromeOffset() {
  useEffect(() => {
    const chrome = document.querySelector(CHROME_SELECTOR)
    if (!chrome) return

    const update = () => {
      const height = chrome.getBoundingClientRect().height
      document.documentElement.style.setProperty(
        '--layout-sticky-top',
        `${height}px`,
      )
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(chrome)

    return () => observer.disconnect()
  }, [])
}
