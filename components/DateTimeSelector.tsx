'use client'

import { useState, useEffect } from 'react'
import { updateCalendar } from '@/app/actions/calendar'
import { dateToInput, formatDateTime, timeToInput } from '@/lib/utils'
import { type CalendarItem } from '@/app/types/calendar'

import { PlusCircle, Trash2 } from 'lucide-react'

interface DateTimeSelectorProps {
  data: CalendarItem[]
  defaultDateTime: Date
  // defaultDateString: string
  // defaultTimeString: string
}

function getDefaultDateString(date: Date) {
  return dateToInput(date)
}
function getDefaultTimeString(date: Date) {
  date.setSeconds(0, 0)
  let min = Math.round(date.getMinutes() / 5) * 5
  if (min === 60) {
    date.setHours(date.getHours() + 1)
    min = 0
  }
  date.setMinutes(min)
  return date.toTimeString().slice(0, 5)
}

export default function DateTimeSelector({ data, ...p }: DateTimeSelectorProps) {
  const [list, setList] = useState<CalendarItem[]>(data)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Inputy pro datum a čas
  const [selectedDate, setSelectedDate] = useState(getDefaultDateString(p.defaultDateTime))
  const [selectedTime, setSelectedTime] = useState(getDefaultTimeString(p.defaultDateTime))

  // Když vyberu item, nastav inputy podle něj
  useEffect(() => {
    if (selectedIndex !== null && list[selectedIndex]) {
      const item = list[selectedIndex]
      setSelectedDate(dateToInput(item.date))
      setSelectedTime(timeToInput(item.date))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex])

  // Pokud není vybrán žádný item, inputy jsou defaultní
  useEffect(() => {
    if (selectedIndex === null) {
      setSelectedDate(getDefaultDateString(p.defaultDateTime))
      setSelectedTime(getDefaultTimeString(p.defaultDateTime))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex])

  // Helper to sort list by date
  function sortList(input: CalendarItem[]): CalendarItem[] {
    return [...input].sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  // Přidání nového termínu
  function handleAdd() {
    const selected = combineDateTime(selectedDate, selectedTime)
    if (!selected || !isDateTimeInFuture(selected)) return
    if (!list.some((dt) => dt.date.getTime() === selected.getTime())) {
      const newList = sortList([...list, { date: selected, dateFormated: formatDateTime(selected), available: true }])
      setList(newList)
      onChangeAndLog(newList)
    }
  }

  // Odebrání vybraného termínu
  function handleRemove() {
    if (selectedIndex !== null && list[selectedIndex]) {
      const newList = list.filter((_, idx) => idx !== selectedIndex)
      setList(newList)
      setSelectedIndex(null)
      onChangeAndLog(newList)
    }
  }

  // Změna data inputu
  function handleChangeDate(e: React.ChangeEvent<HTMLInputElement>) {
    const newDate = e.target.value
    setSelectedDate(newDate)
    // Pokud je vybrán item, změním jeho datum (a čas)
    if (selectedIndex !== null && list[selectedIndex]) {
      const updatedDate = combineDateTime(newDate, selectedTime)
      if (updatedDate && isDateTimeInFuture(updatedDate)) {
        const newList = list.map((item, idx) => (idx === selectedIndex ? { ...item, date: updatedDate } : item))
        setList(sortList(newList))
        onChangeAndLog(sortList(newList))
      }
    }
  }

  // Změna času inputu
  function handleChangeTime(e: React.ChangeEvent<HTMLInputElement>) {
    const newTime = e.target.value
    setSelectedTime(newTime)
    // Pokud je vybrán item, změním jeho čas (a datum)
    if (selectedIndex !== null && list[selectedIndex]) {
      const updatedDate = combineDateTime(selectedDate, newTime)
      if (updatedDate && isDateTimeInFuture(updatedDate)) {
        const newList = list.map((item, idx) => (idx === selectedIndex ? { ...item, date: updatedDate } : item))
        setList(sortList(newList))
        onChangeAndLog(sortList(newList))
      }
    }
  }

  function handleToggleAvailable(idx: number) {
    const newList = list.map((item, i) => (i === idx ? { ...item, available: !item.available } : item))
    setList(newList)
    onChangeAndLog(newList)
  }

  function onChangeAndLog(newList: CalendarItem[]) {
    updateCalendar(newList)
    // Log to console for debugging
    console.debug(
      'Aktuální seznam termínů:',
      newList.map((item) => ({
        date: item.date,
        available: item.available,
      })),
    )
  }

  const selected = combineDateTime(selectedDate, selectedTime)
  const isValid = isDateTimeInFuture(selected)
  const isSelected = selectedIndex != null

  return (
    <div className='flex w-full max-w-lg flex-col gap-6 rounded border bg-white p-4 shadow'>
      <div className='flex w-full flex-row items-end gap-3'>
        <label className='flex flex-col'>
          <span className='mb-1 block'>Datum</span>
          <input
            type='date'
            value={selectedDate}
            onChange={handleChangeDate}
            min={getDefaultDateString(p.defaultDateTime)}
            className='rounded border px-2 py-1'
          />
        </label>
        <label className='flex flex-col'>
          <span className='mb-1 block'>Čas</span>
          <input
            type='time'
            value={selectedTime}
            onChange={handleChangeTime}
            className='rounded border px-2 py-1'
            step={300}
          />
        </label>
      </div>
      <div className='flex w-full flex-row gap-3'>
        <button
          onClick={handleAdd}
          disabled={!isValid || isSelected}
          className={`flex flex-1 items-center justify-center rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 ${!isValid || isSelected ? 'cursor-not-allowed opacity-50' : ''}`}
          title={!isValid ? 'Lze přidat pouze termín v budoucnosti' : undefined}
        >
          <PlusCircle className='mr-2 h-5 w-5' />
          Přidat
        </button>
        <button
          onClick={handleRemove}
          className='flex flex-1 items-center justify-center rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-300'
          disabled={selectedIndex === null}
        >
          <Trash2 className='mr-2 h-5 w-5' />
          Odebrat
        </button>
      </div>
      <div className='w-full flex-1'>
        <ul className='divide-y rounded border bg-gray-50'>
          {list.length === 0 && <li className='p-3 text-gray-400'>Žádný termín v seznamu</li>}
          {list.map((item, idx) => (
            <li
              key={idx}
              className={[
                'group flex flex-row items-center justify-between p-3',
                selectedIndex === idx ? 'bg-blue-100 font-bold' : 'hover:bg-gray-200',
              ].join(' ')}
            >
              {/* Klikací oblast pro výběr záznamu */}
              <span
                className='flex-1 cursor-pointer'
                onClick={() => setSelectedIndex(selectedIndex === idx ? null : idx)}
              >
                {item.dateFormated}
              </span>
              {/* Checkbox dostupnosti – mimo klikací oblast, větší, bez textu */}
              <label className='ml-6 flex items-center' onClick={(e) => e.stopPropagation()} tabIndex={-1}>
                <input
                  type='checkbox'
                  checked={item.available}
                  onChange={() => handleToggleAvailable(idx)}
                  className='scale-150 cursor-pointer accent-green-600'
                />
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function combineDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null
  const result = new Date(`${dateStr}T${timeStr}`)
  return isNaN(result.getTime()) ? null : result
}

function isDateTimeInFuture(dateObj: Date | null): boolean {
  if (!dateObj) return false
  return dateObj.getTime() > Date.now()
}
