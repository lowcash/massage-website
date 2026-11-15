import { applyCzechNbsp, bindTail } from '@/lib/typography'
import { cn } from '@/lib/utils'

interface SectionIntroProps {
  id: string
  title: string
  subtitle: string
  description?: string
  /** Render on the dark (night) panel. */
  onNight?: boolean
  align?: 'center' | 'left'
}

export function SectionIntro({ id, title, subtitle, description, onNight = false, align = 'left' }: SectionIntroProps) {
  const isCentered = align === 'center'

  return (
    <div
      className={cn(
        'reveal flex max-w-3xl flex-col gap-[var(--spacing-s2)]',
        isCentered ? 'mx-auto items-center text-center' : 'items-start',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-3 text-[length:var(--text-fluid--1)] leading-snug font-semibold tracking-[0.14em] text-balance uppercase',
          onNight ? 'text-glow' : 'text-brand',
        )}
      >
        <span aria-hidden='true' className='h-px w-8 bg-current opacity-60' />
        {applyCzechNbsp(subtitle)}
      </p>

      <h2 id={id} className={cn('text-[length:var(--text-fluid-4)]', onNight && 'text-night-ink')}>
        {bindTail(applyCzechNbsp(title))}
      </h2>

      {description ? (
        <p
          className={cn(
            'max-w-xl text-[length:var(--text-fluid-1)] leading-snug',
            onNight ? 'text-night-muted' : 'text-body',
          )}
        >
          {applyCzechNbsp(description)}
        </p>
      ) : null}
    </div>
  )
}
