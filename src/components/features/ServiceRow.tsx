'use client'

import { flushSync } from 'react-dom'

import type { ServiceItem } from '@/lib/content'
import { applyCzechNbsp, bindTail } from '@/lib/typography'
import { scrollToSection } from '@/lib/utils'

import { useBooking } from '@/src/contexts/BookingContext'

/**
 * One selectable service. Client leaf: choosing it stores the service for the booking panel
 * and scrolls there; the "Vybraná služba" box swaps through a view transition where supported.
 * The card is plain markup (real h3); a stretched button on top carries the interaction.
 */
export default function ServiceRow({ service }: { service: ServiceItem }) {
  const { selectedService, setSelectedService } = useBooking()
  const isSelected = selectedService === service.name

  const handleClick = () => {
    const select = () => setSelectedService(service.name)
    const canTransition =
      typeof document.startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (canTransition) {
      document.startViewTransition(() => flushSync(select))
    } else {
      select()
    }

    scrollToSection('booking')
  }

  return (
    <li className='group relative'>
      <div
        className={`row-lift border-line group-hover:bg-paper group-has-[button:focus-visible]:bg-paper grid grid-cols-[1fr_auto] items-baseline gap-x-5 gap-y-1 rounded-(--radius-md) border-b px-3 py-[1.1rem] text-left transition-[translate,box-shadow,border-color,background-color] duration-480 ease-(--ease-soft) ${isSelected ? 'bg-paper border-brand/50' : ''}`}
      >
        <h3 className='text-ink text-[length:var(--text-fluid-1)] leading-tight font-[360] [font-variation-settings:"SOFT"_80,"opsz"_36]'>
          {bindTail(applyCzechNbsp(service.name))}
        </h3>
        <span className='text-brand text-[length:var(--text-fluid--1)] font-medium whitespace-nowrap tabular-nums'>
          {applyCzechNbsp(service.price)}
        </span>
        {service.duration ? (
          <span className='text-muted-ink col-span-2 text-[length:var(--text-fluid--1)]'>
            {applyCzechNbsp(service.duration)}
          </span>
        ) : null}
        <p className='text-muted-ink col-span-2 max-w-[60ch] text-[length:var(--text-fluid--1)] leading-[1.55]'>
          {applyCzechNbsp(service.description)}
        </p>
      </div>

      <button
        type='button'
        onClick={handleClick}
        aria-pressed={isSelected}
        aria-label={`Vybrat: ${service.name}`}
        className='absolute inset-0 cursor-pointer rounded-(--radius-md)'
      />
    </li>
  )
}
