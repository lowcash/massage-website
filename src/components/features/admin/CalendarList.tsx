'use client'

import { CalendarItem } from '@/types/calendar'
import { CalendarListItem } from './CalendarListItem'

interface CalendarListProps {
  items: CalendarItem[]
  selectedIndex: number | null
  onSelect: (index: number) => void
  onToggleReserved: (index: number) => void
}

export function CalendarList({ items, selectedIndex, onSelect, onToggleReserved }: CalendarListProps) {
  if (items.length === 0) {
    return (
      <div className='rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center'>
        <p className='text-sm text-zinc-600'>Zatím žádné termíny. Přidejte nový termín výše.</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full'>
      <h3 className='mb-3 text-sm font-semibold text-zinc-700 shrink-0'>Dostupné termíny ({items.length})</h3>
      <div className='flex-1 space-y-2 overflow-y-auto rounded-lg border border-zinc-200 bg-white'>
        {items.map((item, idx) => (
          <CalendarListItem
            key={`${item.date.getTime()}-${idx}`}
            item={item}
            isSelected={selectedIndex === idx}
            onSelect={() => onSelect(idx)}
            onToggleReserved={() => onToggleReserved(idx)}
          />
        ))}
      </div>
    </div>
  )
}
