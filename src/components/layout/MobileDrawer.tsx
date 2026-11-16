'use client'

import { type MouseEvent, type RefObject, useEffect, useRef } from 'react'

import { Mail, MapPin, Phone, X } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { applyCzechNbsp } from '@/lib/utils'

const drawerContacts = [
  {
    Icon: Phone,
    label: siteContent.contact.cards.phoneLabel,
    href: `tel:+${siteContent.brand.phoneDigits}`,
    external: false,
    lines: [siteContent.brand.phone],
  },
  {
    Icon: Mail,
    label: siteContent.contact.cards.emailLabel,
    href: `mailto:${siteContent.brand.email}`,
    external: false,
    lines: [siteContent.brand.email],
  },
  {
    Icon: MapPin,
    label: siteContent.contact.cards.addressLabel,
    href: siteContent.brand.mapsLink,
    external: true,
    lines: [siteContent.brand.addressLine1, siteContent.brand.addressLine2],
  },
]

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Elements that live under <body> but must stay reachable / are not page content.
const INERT_SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK', 'NEXT-ROUTE-ANNOUNCER', 'NEXTJS-PORTAL'])

/**
 * Marks everything outside the given elements as `inert` (walks up to <body> so it keeps working if the
 * drawer is nested). Returns a restore function that only undoes what this call changed.
 */
function inertBackground(keep: Array<HTMLElement | null>) {
  const keepPath = new Set<Element>()

  for (const element of keep) {
    let node: Element | null = element
    while (node && node !== document.body) {
      keepPath.add(node)
      node = node.parentElement
    }
  }

  const changed: HTMLElement[] = []

  for (const node of keepPath) {
    const parent = node.parentElement
    if (!parent) continue

    for (const sibling of Array.from(parent.children)) {
      if (
        !(sibling instanceof HTMLElement) ||
        keepPath.has(sibling) ||
        sibling.inert ||
        INERT_SKIP_TAGS.has(sibling.tagName)
      ) {
        continue
      }

      sibling.inert = true
      changed.push(sibling)
    }
  }

  return () => {
    for (const element of changed) {
      element.inert = false
    }
  }
}

interface MobileDrawerProps {
  open: boolean
  activeSection: string
  onClose: () => void
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void
  /** Element (the menu button) that receives focus again when the drawer closes. */
  returnFocusRef: RefObject<HTMLElement | null>
}

export default function MobileDrawer({ open, activeSection, onClose, onNavigate, returnFocusRef }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const drawer = drawerRef.current
    if (!drawer) {
      return
    }

    const restoreBackground = inertBackground([drawer, backdropRef.current])
    closeButtonRef.current?.focus({ preventScroll: true })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusable = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (!drawer.contains(active)) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus({ preventScroll: true })
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Background must be interactive again before focus can return to the header menu button.
      restoreBackground()

      const returnTarget = returnFocusRef.current
      if (returnTarget?.isConnected) {
        returnTarget.focus({ preventScroll: true })
      }
    }
  }, [open, onClose, returnFocusRef])

  return (
    <>
      {/* Mobile drawer — CSS transitions, no framer-motion */}
      <div
        ref={backdropRef}
        aria-hidden='true'
        onClick={onClose}
        className={`bg-ink/55 fixed inset-0 z-50 cursor-pointer transition-opacity duration-300 ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside
        ref={drawerRef}
        role='dialog'
        aria-label={siteContent.navigation.openMenuAriaLabel}
        aria-modal='true'
        inert={!open || undefined}
        className={`border-line bg-paper fixed top-0 right-0 bottom-0 z-50 flex h-dvh w-[92%] max-w-sm flex-col border-l pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Keep the chrome compact so the six links fit without scrolling on common phone heights. */}
        <div className='flex shrink-0 items-center justify-between px-5 py-4 [@media(max-height:700px)]:py-3'>
          <a
            href='#hero'
            onClick={(event) => onNavigate(event, '#hero')}
            className='font-display text-ink text-left text-[1.2rem] leading-none font-[450] transition-opacity duration-300 ease-out [font-variation-settings:"SOFT"_100,"opsz"_48] hover:opacity-85'
            aria-label={siteContent.navigation.homeAriaLabel}
          >
            {applyCzechNbsp(siteContent.brand.name)}
          </a>

          <button
            ref={closeButtonRef}
            type='button'
            onClick={onClose}
            className='border-ink/28 text-ink bg-surface flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border'
            aria-label={siteContent.navigation.closeMenuAriaLabel}
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 sm:px-5'>
          <nav aria-label='Mobilní navigace' className='flex flex-col gap-1.5 [@media(max-height:700px)]:gap-1'>
            {siteContent.navigation.items.map((item) => {
              const isActive = activeSection === item.href.replace('#', '')

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(event) => onNavigate(event, item.href)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`font-display flex min-h-11 cursor-pointer items-center justify-between rounded-(--radius-md) px-4 py-2.5 text-left text-[1.35rem] leading-none transition-colors duration-300 ease-out [@media(max-height:700px)]:py-2 [@media(max-height:700px)]:text-[1.25rem] ${isActive ? 'bg-brand-soft text-brand-hover' : 'text-ink hover:bg-surface'}`}
                >
                  {applyCzechNbsp(item.label)}
                  {isActive ? <span aria-hidden='true' className='bg-brand h-2 w-2 rounded-full' /> : null}
                </a>
              )
            })}
          </nav>
        </div>

        <div className='border-line mt-auto shrink-0 border-t px-4 pt-3 pb-4 sm:px-5 [@media(max-height:700px)]:pt-2.5 [@media(max-height:700px)]:pb-3'>
          <ul className='grid gap-1.5 [@media(max-height:700px)]:gap-1'>
            {drawerContacts.map(({ Icon, label, href, external, lines }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className='hover:bg-surface-alt bg-surface flex items-center gap-3 rounded-(--radius-md) px-3 py-2 transition-colors duration-300 ease-out [@media(max-height:700px)]:py-1.5'
                >
                  <span className='bg-brand/10 text-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-full'>
                    <Icon aria-hidden='true' className='h-4 w-4' />
                  </span>
                  <span className='flex min-w-0 flex-col'>
                    <span className='text-brand text-xs font-semibold tracking-[0.14em] uppercase'>{label}</span>
                    <span className='text-ink text-sm leading-snug break-words'>
                      {lines.map((line) => (
                        <span key={line} className='block'>
                          {applyCzechNbsp(line)}
                        </span>
                      ))}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}
