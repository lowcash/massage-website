import { applyCzechNbsp, bindTail } from '@/lib/typography'
import { cn } from '@/lib/utils'

import { DrawnLine } from '@/src/components/shared/DrawnLine'

interface SectionIntroProps {
  id: string
  title: string
  subtitle: string
  description?: string
  light?: boolean
  align?: 'center' | 'left'
}

export function SectionIntro({ id, title, subtitle, description, light = false, align = 'center' }: SectionIntroProps) {
  const isCentered = align === 'center'

  return (
    <div
      className={cn('flex max-w-3xl flex-col gap-4', isCentered ? 'mx-auto items-center text-center' : 'items-start')}
    >
      <p className={cn('text-xs tracking-[0.22em] text-balance uppercase', light ? 'text-white/80' : 'text-brand')}>
        {applyCzechNbsp(subtitle)}
      </p>

      <h2
        id={id}
        className={cn(
          'font-display text-[2.5rem] leading-[1.05] font-medium md:text-5xl',
          light ? 'text-white' : 'text-ink',
        )}
      >
        {bindTail(applyCzechNbsp(title))}
      </h2>

      <DrawnLine light={light} />

      {description ? (
        <p className={cn('max-w-xl leading-relaxed', light ? 'text-white/90' : 'text-body')}>
          {applyCzechNbsp(description)}
        </p>
      ) : null}
    </div>
  )
}
