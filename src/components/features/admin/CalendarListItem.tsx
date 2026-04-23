'use client'

import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

import { Checkbox } from '@/src/components/ui/checkbox'

import { CalendarItem } from '@/types/calendar'

interface CalendarListItemProps {
  item: CalendarItem
  isSelected: boolean
  onSelect: () => void
  onToggleReserved: () => void
}

export function CalendarListItem({ item, isSelected, onSelect, onToggleReserved }: CalendarListItemProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'flex cursor-pointer items-center gap-3 border-b border-zinc-100 px-4 py-3 transition-colors last:border-b-0',
        isSelected ? 'bg-blue-50' : 'hover:bg-zinc-50',
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleReserved()
        }}
        className='shrink-0'
      >
        <Checkbox checked={item.reserved} onChange={onToggleReserved} readOnly />
      </button>
      <div className='flex-1'>
        <p className={cn('text-sm', item.reserved ? 'text-zinc-400 line-through' : 'text-zinc-900')}>
          {formatDateTime(item.date)}
        </p>
      </div>
      {isSelected && <div className='shrink-0 rounded-full bg-blue-500 p-1' />}
    </div>
  )
}
