'use client'

import { Button } from '@/components/ui/button'
import { getDefaultDateString, getDefaultTimeString } from './utils/calendar'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'

interface CalendarFormProps {
  onAdd: (dateStr: string, timeStr: string) => void
  onUpdate: (dateStr: string, timeStr: string) => void
  isLoading: boolean
  selectedDate?: Date | null
}

export function CalendarForm({ onAdd, onUpdate, isLoading, selectedDate }: CalendarFormProps) {
  const now = new Date()
  const [date, setDate] = useState(getDefaultDateString(now))
  const [time, setTime] = useState(getDefaultTimeString(now))
  
  // Update form when calendar item is selected
  useEffect(() => {
    if (selectedDate) {
      setDate(getDefaultDateString(selectedDate))
      setTime(getDefaultTimeString(selectedDate))
    }
  }, [selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate) {
      onUpdate(date, time)
    } else {
      onAdd(date, time)
      setDate(getDefaultDateString(new Date()))
      setTime(getDefaultTimeString(new Date()))
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div>
          <label htmlFor='date' className='mb-2 block text-sm font-medium text-zinc-700'>
            Datum
          </label>
          <input
            id='date'
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isLoading}
            className='w-full rounded border border-zinc-300 px-3 py-2 text-sm transition-colors disabled:bg-zinc-50 disabled:text-zinc-500'
          />
        </div>
        <div>
          <label htmlFor='time' className='mb-2 block text-sm font-medium text-zinc-700'>
            Čas
          </label>
          <input
            id='time'
            type='time'
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={isLoading}
            className='w-full rounded border border-zinc-300 px-3 py-2 text-sm transition-colors disabled:bg-zinc-50 disabled:text-zinc-500'
          />
        </div>
      </div>
      <Button type='submit' disabled={isLoading} className='w-full gap-2 bg-green-600 hover:bg-green-700'>
        <Plus className='h-4 w-4' />
        {selectedDate ? 'Aktualizovat termín' : 'Přidat termín'}
      </Button>
    </form>
  )
}
