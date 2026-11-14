'use client'

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useRef,
} from 'react'

import { cn } from '@/lib/utils'

import { useScrollLock } from '@/src/hooks/useScrollLock'

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

type DialogProps = {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  className?: string
  /** Extra class for the backdrop layer. */
  backdropClassName?: string
  /** When set, focus returns here on close. */
  returnFocusRef?: RefObject<HTMLElement | null>
}

function getFocusable(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
  )
}

/**
 * Accessible dialog: Escape, focus trap, focus restore, scroll lock, inert background via sibling inert.
 */
export function Dialog({ open, onClose, label, children, className, backdropClassName, returnFocusRef }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const labelId = useId()
  useScrollLock(open, 'overflow')

  useEffect(() => {
    if (!open) return

    const previouslyFocused = (returnFocusRef?.current ??
      (document.activeElement instanceof HTMLElement ? document.activeElement : null)) as HTMLElement | null

    const dialog = dialogRef.current
    if (dialog) {
      const focusable = getFocusable(dialog)
      ;(focusable[0] ?? dialog).focus()
    }

    // The dialog is rendered in place (not portaled), so walk up to <body> and make every
    // sibling along the way inert — everything except the dialog's own ancestor chain.
    const root = dialog?.closest('[data-dialog-root]') as HTMLElement | null
    const inertTargets: HTMLElement[] = []
    for (let node: HTMLElement | null = root; node && node !== document.body; node = node.parentElement) {
      for (const sibling of Array.from(node.parentElement?.children ?? [])) {
        if (sibling !== node && sibling instanceof HTMLElement && !sibling.inert) {
          inertTargets.push(sibling)
        }
      }
    }
    for (const node of inertTargets) {
      node.inert = true
    }

    return () => {
      for (const node of inertTargets) {
        node.inert = false
      }
      previouslyFocused?.focus?.()
    }
  }, [open, returnFocusRef])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const onKeyDownTrap = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !dialogRef.current) return
    const focusable = getFocusable(dialogRef.current)
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div data-dialog-root='' className='contents'>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-80 bg-black/70 transition-opacity duration-300',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          backdropClassName,
        )}
      />
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label={label}
        aria-labelledby={labelId}
        tabIndex={-1}
        inert={!open || undefined}
        onKeyDown={onKeyDownTrap}
        onClick={(event) => {
          // Click on the padding around the content (not on the content itself) dismisses.
          if (event.target === event.currentTarget) onClose()
        }}
        className={cn(
          'fixed inset-0 z-80 flex items-center justify-center p-4 transition-[opacity,transform] duration-300',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          className,
        )}
      >
        <span id={labelId} className='sr-only'>
          {label}
        </span>
        {children}
      </div>
    </div>
  )
}
