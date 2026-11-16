'use client'

import { useEffect, useState } from 'react'

import { siteContent } from '@/lib/content'
import { cn, scrollToSection } from '@/lib/utils'

import { FloatingContainer } from '@/src/components/layout/FloatingContainer'
import { useFooterVisible } from '@/src/hooks/useFooterVisible'
import { resolveActiveSection } from '@/src/lib/navigation-core-adapter'

const SHOW_AFTER_SCROLL = 360

const sections = [
  { id: 'hero', label: siteContent.navigation.homeLabel },
  ...siteContent.navigation.items.map((item) => ({ id: item.href.replace('#', ''), label: item.label })),
]

/**
 * Side position indicator for wide screens. It duplicates the navbar, so it is hidden from assistive
 * tech and keyboard focus; sighted mouse users get a "where am I" cue without a visible scrollbar.
 */
export default function SectionDots() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isVisible, setIsVisible] = useState(false)
  const isFooterVisible = useFooterVisible()

  useEffect(() => {
    let frameId: number | null = null

    const sync = () => {
      frameId = null
      setIsVisible(window.scrollY > SHOW_AFTER_SCROLL)
      setActiveSection(resolveActiveSection(sections.map((section) => section.id)) ?? 'hero')
    }

    const schedule = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(sync)
      }
    }

    sync()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  const canShowDots = isVisible && !isFooterVisible

  return (
    <FloatingContainer className='top-1/2 z-30 hidden -translate-y-1/2 min-[1440px]:block' innerClassName='justify-end'>
      <nav
        aria-hidden='true'
        className={cn(
          // w-11 matches ScrollToTop so dots sit on its horizontal center line.
          'flex w-11 flex-col items-center gap-3 transition-opacity duration-500',
          canShowDots ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        {sections.map((section) => {
          const isActive = activeSection === section.id

          return (
            <button
              key={section.id}
              type='button'
              tabIndex={-1}
              onClick={() => scrollToSection(section.id)}
              className='group relative flex h-4 w-4 cursor-pointer items-center justify-center'
            >
              <span
                className={cn(
                  'rounded-full transition-all duration-300',
                  isActive
                    ? 'bg-ink h-3 w-3 shadow-[0_0_0_3px_var(--color-paper)]'
                    : 'bg-ink/30 group-hover:bg-ink/60 h-2 w-2',
                )}
              />
              <span className='bg-ink/90 pointer-events-none absolute right-7 rounded-full px-3 py-1 text-xs tracking-wide whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                {section.label}
              </span>
            </button>
          )
        })}
      </nav>
    </FloatingContainer>
  )
}
