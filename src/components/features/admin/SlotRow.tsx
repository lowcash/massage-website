'use client'

import { Trash2 } from 'lucide-react'

import { cn, timeToInput } from '@/lib/utils'

import { CalendarItem } from '@/types/calendar'

interface SlotRowProps {
  item: CalendarItem
  onToggleReserved: () => void
  onDelete: () => void
}

export function SlotRow({ item, onToggleReserved, onDelete }: SlotRowProps) {
  const time = timeToInput(item.date)

  return (
    <li className='hover:bg-surface flex min-h-14 items-center gap-3 rounded-xl px-3 transition-colors'>
      <span className={cn('flex-1 text-lg font-medium tabular-nums', item.reserved ? 'text-muted-ink' : 'text-ink')}>
        {time}
      </span>

      <button
        type='button'
        role='switch'
        aria-checked={item.reserved}
        aria-label={`Rezervováno ${time}`}
        onClick={onToggleReserved}
        className={cn(
          'focus-visible:ring-brand/40 relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors outline-none focus-visible:ring-2',
          item.reserved ? 'bg-brand' : 'bg-ink/20',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
            item.reserved && 'translate-x-5',
          )}
        />
      </button>

      <button
        type='button'
        onClick={onDelete}
        disabled={item.reserved}
        aria-label={`Smazat termín ${time}`}
        title={item.reserved ? 'Rezervovaný termín nejdřív uvolněte' : 'Smazat termín'}
        className='text-muted-ink focus-visible:ring-brand/40 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors outline-none hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current'
      >
        <Trash2 className='h-4 w-4' />
      </button>
    </li>
  )
}
