import { applyCzechNbsp, bindTail } from '@/lib/typography'
import { cn } from '@/lib/utils'

interface SectionIntroProps {
  id: string
  title: string
  subtitle: string
  description?: string
  align?: 'center' | 'left'
  /** `light` is for text on the brand colour band. */
  tone?: 'default' | 'light'
}

export function SectionIntro({
  id,
  title,
  subtitle,
  description,
  align = 'left',
  tone = 'default',
}: SectionIntroProps) {
  const isCentered = align === 'center'
  const isLight = tone === 'light'

  return (
    <div
      className={cn(
        'reveal flex max-w-3xl flex-col gap-[var(--spacing-s2)]',
        isCentered ? 'mx-auto items-center text-center' : 'items-start',
      )}
    >
      <p
        className={cn(
          isLight ? 'text-on-brand/85' : 'text-muted-ink',
          'flex items-center gap-3 text-[length:var(--text-fluid--1)] leading-snug tracking-[0.16em] text-balance uppercase',
        )}
      >
        <span aria-hidden='true' className={cn('h-px w-8', isLight ? 'bg-on-brand/60' : 'bg-brand/70')} />
        {applyCzechNbsp(subtitle)}
      </p>

      <h2 id={id} className={cn('text-[length:var(--text-fluid-3)]', isLight && 'text-on-brand')}>
        {bindTail(applyCzechNbsp(title))}
      </h2>

      {description ? (
        <p
          className={cn(
            'max-w-xl text-[length:var(--text-fluid-0)] leading-relaxed',
            isLight ? 'text-on-brand/92' : 'text-body',
          )}
        >
          {applyCzechNbsp(description)}
        </p>
      ) : null}
    </div>
  )
}
