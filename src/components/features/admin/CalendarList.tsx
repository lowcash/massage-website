'use client'

import { Search, X } from 'lucide-react'

import { timeToInput } from '@/lib/utils'

import { CalendarItem } from '@/types/calendar'

import { AddTimeForm } from './AddTimeForm'
import { SlotRow } from './SlotRow'

interface CalendarListProps {
  items: CalendarItem[]
  /** yyyy-MM-dd (Prague): the day shown while the search box is empty. */
  selectedDay: string
  query: string
  onQueryChange: (query: string) => void
  isLoading: boolean
  onToggleReserved: (index: number) => void
  onDelete: (index: number) => void
  onAddTime: (dateStr: string, timeStr: string) => Promise<boolean>
}

const dayLabelFormatter = new Intl.DateTimeFormat('cs-CZ', {
  timeZone: 'Europe/Prague',
  weekday: 'long',
  day: 'numeric',
  month: 'numeric',
})
const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague' })

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

/** "pátek 23. 10." is also searchable as "23.10.", "patek", "15:00", "rezervovano" or "volny". */
function searchText(item: CalendarItem) {
  const label = dayLabelFormatter.format(item.date)
  const compactDate = label.replace(/\s+(\d+)\.\s+(\d+)\./, ' $1.$2.')
  const state = item.reserved ? 'rezervovano rezervace' : 'volny volne'

  return normalize(`${label} ${compactDate} ${timeToInput(item.date)} ${state}`)
}

function matchesQuery(item: CalendarItem, query: string) {
  const tokens = normalize(query).split(/\s+/).filter(Boolean)
  const haystack = searchText(item)
  return tokens.every((token) => haystack.includes(token))
}

const dayLabel = (dayKey: string) => dayLabelFormatter.format(new Date(`${dayKey}T12:00:00Z`))

type Entry = { item: CalendarItem; index: number }

const termWord = (count: number) => (count === 1 ? 'termín' : count < 5 ? 'termíny' : 'termínů')

export function CalendarList({
  items,
  selectedDay,
  query,
  onQueryChange,
  isLoading,
  onToggleReserved,
  onDelete,
  onAddTime,
}: CalendarListProps) {
  const isSearching = query.trim() !== ''
  const entries: Entry[] = items.map((item, index) => ({ item, index }))

  const dayEntries = entries.filter(({ item }) => dayKeyFormatter.format(item.date) === selectedDay)
  const results = isSearching ? entries.filter(({ item }) => matchesQuery(item, query)) : []

  const renderRows = (rows: Entry[]) => (
    <ul className='flex flex-col gap-1'>
      {rows.map(({ item, index }) => (
        <SlotRow
          key={`${item.date.getTime()}-${index}`}
          item={item}
          onToggleReserved={() => onToggleReserved(index)}
          onDelete={() => onDelete(index)}
        />
      ))}
    </ul>
  )

  const reservedInDay = dayEntries.filter(({ item }) => item.reserved).length

  return (
    <div className='flex flex-col gap-5'>
      <div className='relative'>
        <Search
          aria-hidden='true'
          className='text-muted-ink pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2'
        />
        <input
          type='search'
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder='Hledat: 15:00, pátek, 23. 10., rezervováno…'
          aria-label='Hledat termíny'
          className='border-line focus:border-brand focus:ring-brand/20 text-ink h-12 w-full rounded-xl border bg-white pr-10 pl-10 text-base outline-none focus:ring-4'
        />
        {query ? (
          <button
            type='button'
            onClick={() => onQueryChange('')}
            aria-label='Vymazat hledání'
            className='text-muted-ink hover:text-ink absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full'
          >
            <X className='h-4 w-4' />
          </button>
        ) : null}
      </div>

      {isSearching ? (
        <section aria-label='Výsledky hledání' className='flex flex-col gap-4'>
          <p className='text-muted-ink text-sm' aria-live='polite'>
            {results.length === 0
              ? 'Žádný termín neodpovídá hledání.'
              : `Nalezeno ${results.length} ${termWord(results.length)} ve všech dnech`}
          </p>
          {Array.from(new Set(results.map(({ item }) => dayKeyFormatter.format(item.date)))).map((key) => (
            <div key={key}>
              <h3 className='text-ink mb-1 px-3 text-sm font-medium first-letter:uppercase'>{dayLabel(key)}</h3>
              {renderRows(results.filter(({ item }) => dayKeyFormatter.format(item.date) === key))}
            </div>
          ))}
        </section>
      ) : (
        <section aria-label={dayLabel(selectedDay)} className='flex flex-col gap-4'>
          <div>
            <h3 className='font-display text-ink text-2xl first-letter:uppercase'>{dayLabel(selectedDay)}</h3>
            <p className='text-muted-ink text-sm'>
              {dayEntries.length === 0
                ? 'V tento den zatím nejsou žádné termíny.'
                : `${dayEntries.length} ${termWord(dayEntries.length)}${reservedInDay > 0 ? `, z toho ${reservedInDay} rezervováno` : ''}`}
            </p>
          </div>

          {dayEntries.length > 0 ? (
            <div>
              <p aria-hidden='true' className='text-muted-ink mb-1 pr-16 text-right text-xs'>
                Rezervováno
              </p>
              {renderRows(dayEntries)}
            </div>
          ) : null}

          <AddTimeForm
            dayKey={selectedDay}
            takenTimes={new Set(dayEntries.map(({ item }) => timeToInput(item.date)))}
            isLoading={isLoading}
            onAdd={(timeStr) => onAddTime(selectedDay, timeStr)}
          />
        </section>
      )}
    </div>
  )
}
