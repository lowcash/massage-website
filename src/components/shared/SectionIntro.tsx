import { applyCzechNbsp, bindTail } from '@/lib/typography'
import { cn } from '@/lib/utils'

interface SectionIntroProps {
  id: string
  title: string
  subtitle: string
  description?: string
  align?: 'center' | 'left'
}

export function SectionIntro({ id, title, subtitle, description, align = 'left' }: SectionIntroProps) {
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
          'text-muted-ink flex items-center gap-3 text-[length:var(--text-fluid--1)] leading-snug tracking-[0.16em] text-balance uppercase',
        )}
      >
        <span aria-hidden='true' className='bg-brand/60 h-px w-8' />
        {applyCzechNbsp(subtitle)}
      </p>

      <h2 id={id} className='text-[length:var(--text-fluid-3)]'>
        {bindTail(applyCzechNbsp(title))}
      </h2>

      {description ? (
        <p className='text-body max-w-xl text-[length:var(--text-fluid-0)] leading-relaxed'>
          {applyCzechNbsp(description)}
        </p>
      ) : null}
    </div>
  )
}
