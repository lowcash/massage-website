'use client'

import { useCalendarManager } from '@/components/admin/hooks/useCalendarManager'
import { CalendarForm } from '@/components/admin/CalendarForm'
import { CalendarList } from '@/components/admin/CalendarList'
import { Button } from '@/components/ui/button'
import { type CalendarItem } from '@/types/calendar'
import { Trash2, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'
import { formatDateTime } from '@/lib/utils'

interface DateTimeSelectorProps {
  data: CalendarItem[]
}

export default function DateTimeSelector({ data }: DateTimeSelectorProps) {
  const { list, selectedIndex, setSelectedIndex, isLoading, handleAdd, handleRemove, handleToggleReserved, handleUpdate } =
    useCalendarManager(data)

  const handleAddWithToast = async (dateStr: string, timeStr: string) => {
    const result = await handleAdd(dateStr, timeStr)
    if (result?.success && result.date) {
      toast.success(`Termín ${formatDateTime(result.date)} úspěšně přidán`, {
        icon: <PlusCircle className='h-5 w-5' />,
      })
    }
  }

  const handleUpdateWithToast = async (dateStr: string, timeStr: string) => {
    const result = await handleUpdate(dateStr, timeStr)
    if (result?.success && result.date) {
      toast.success(`Termín ${formatDateTime(result.date)} úspěšně aktualizován`, {
        icon: <PlusCircle className='h-5 w-5' />,
      })
      setSelectedIndex(null) // Clear selection after update
    } else if (result?.conflict) {
      toast.error('Tento termín již existuje')
    }
  }

  const handleRemoveWithToast = async () => {
    const result = await handleRemove()
    if (result?.success && result.date) {
      toast.success(`Termín ${formatDateTime(result.date)} odstraněn`, {
        icon: <Trash2 className='h-5 w-5' />,
      })
    }
  }

  const selectedDate = selectedIndex !== null ? list[selectedIndex]?.date : null

  return (
    <div className='flex w-full max-w-2xl flex-col gap-6 rounded border bg-white p-6 shadow'>
      <div className='space-y-4'>
        <h2 className='text-lg font-semibold text-zinc-900'>Správa dostupných termínů</h2>
        <CalendarForm onAdd={handleAddWithToast} onUpdate={handleUpdateWithToast} isLoading={isLoading} selectedDate={selectedDate} />
      </div>

      <div className='space-y-4'>
        <CalendarList items={list} selectedIndex={selectedIndex} onSelect={setSelectedIndex} onToggleReserved={handleToggleReserved} />
      </div>

      {selectedIndex !== null && (
        <div className='flex gap-2 border-t border-zinc-200 pt-4'>
          <Button onClick={handleRemoveWithToast} disabled={isLoading} variant='destructive' className='flex-1 gap-2'>
            <Trash2 className='h-4 w-4' />
            Smazat vybraný termín
          </Button>
          <Button onClick={() => setSelectedIndex(null)} variant='outline' className='flex-1'>
            Zrušit výběr
          </Button>
        </div>
      )}
    </div>
  )
}
