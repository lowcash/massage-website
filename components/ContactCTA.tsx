'use client'

import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'

import { PHONE } from '@/const'

export default function ContactCTA() {
  return (
    <Button
      className='bg-studio-pink hover:bg-studio-pink/90 rounded-md py-7 pr-12 pl-12 text-lg text-white shadow-md transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg'
      onClick={() => (window.location.href = `tel:${PHONE}`)}
    >
      <Phone className='mr-2 h-4 w-4' /> Zavolat / Rezervovat termín
    </Button>
  )
}
