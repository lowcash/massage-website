'use client'

import { useState } from 'react'

import { PlusCircle, Trash2, Undo2 } from 'lucide-react'
import { toast } from 'sonner'

import { formatDateTime } from '@/lib/utils'

import { CalendarList } from '@/src/components/features/admin/CalendarList'
import { MonthCalendar } from '@/src/components/features/admin/MonthCalendar'
import { useCalendarManager } from '@/src/components/features/admin/hooks/useCalendarManager'

import { type CalendarItem } from '@/types/calendar'

interface DateTimeSelectorProps {
  data: CalendarItem[]
}

// One shared id: a new change replaces the previous message, so "Vrátit zpět" always means the last change only.
const CHANGE_TOAST_ID = 'calendar-change'
const UNDO_VISIBLE_MS = 12_000

const saveFailedMessage = 'Uložení se nezdařilo, změna nebyla provedena. Zkuste to prosím znovu.'

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague' })

/** Opens on the nearest day that has slots, or on today when the calendar is empty. */
function initialDay(items: CalendarItem[]) {
  const today = dayKeyFormatter.format(new Date())
  const upcoming = items.map((item) => dayKeyFormatter.format(item.date)).filter((key) => key >= today)

  return upcoming.sort()[0] ?? today
}

export default function DateTimeSelector({ data }: DateTimeSelectorProps) {
  const { list, isLoading, handleAdd, handleRemoveAt, handleToggleReserved, handleRestore } = useCalendarManager(data)
  const [selectedDay, setSelectedDay] = useState(() => initialDay(data))
  const [query, setQuery] = useState('')

  const announceChange = (message: string, previousList: CalendarItem[], icon: React.ReactNode) => {
    toast.success(message, {
      id: CHANGE_TOAST_ID,
      icon,
      duration: UNDO_VISIBLE_MS,
      action: {
        label: 'Vrátit zpět',
        onClick: async () => {
          const restored = await handleRestore(previousList)
          if (restored) {
            toast.success('Poslední změna byla vrácena zpět.', {
              id: CHANGE_TOAST_ID,
              icon: <Undo2 className='h-5 w-5' />,
            })
          } else {
            toast.error(saveFailedMessage, { id: CHANGE_TOAST_ID })
          }
        },
      },
    })
  }

  const handleAddTime = async (dateStr: string, timeStr: string) => {
    const result = await handleAdd(dateStr, timeStr)

    if (!result) {
      toast.error('Zadejte čas, který ještě nenastal.')
      return false
    }
    if (result.success && result.date && result.previousList) {
      announceChange(
        `Termín ${formatDateTime(result.date)} byl přidán.`,
        result.previousList,
        <PlusCircle className='h-5 w-5' />,
      )
      return true
    }
    toast.error('saveFailed' in result && result.saveFailed ? saveFailedMessage : 'Tento termín už existuje.')
    return false
  }

  const handleToggle = async (index: number) => {
    const result = await handleToggleReserved(index)

    if (result.success && result.date && result.previousList) {
      announceChange(
        result.reserved
          ? `Termín ${formatDateTime(result.date)} je nově rezervovaný.`
          : `Rezervace termínu ${formatDateTime(result.date)} byla zrušena, termín je opět volný.`,
        result.previousList,
        <PlusCircle className='h-5 w-5' />,
      )
    } else {
      toast.error(saveFailedMessage)
    }
  }

  const handleDelete = async (index: number) => {
    const result = await handleRemoveAt(index)

    if (result.success && result.date && result.previousList) {
      announceChange(
        `Termín ${formatDateTime(result.date)} byl smazán.`,
        result.previousList,
        <Trash2 className='h-5 w-5' />,
      )
    } else if ('saveFailed' in result && result.saveFailed) {
      toast.error(saveFailedMessage)
    }
  }

  return (
    <div className='grid items-start gap-6 lg:grid-cols-[22rem_1fr]'>
      <section aria-label='Kalendář' className='border-line bg-paper shadow-soft rounded-3xl border p-5'>
        <MonthCalendar
          items={list}
          selectedDay={selectedDay}
          onSelectDay={(dayKey) => {
            setSelectedDay(dayKey)
            setQuery('')
          }}
        />
      </section>

      <section className='border-line bg-paper shadow-soft rounded-3xl border p-5'>
        <CalendarList
          items={list}
          selectedDay={selectedDay}
          query={query}
          onQueryChange={setQuery}
          isLoading={isLoading}
          onToggleReserved={handleToggle}
          onDelete={handleDelete}
          onAddTime={handleAddTime}
        />
      </section>
    </div>
  )
}
