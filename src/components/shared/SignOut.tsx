'use client'

import { LogOut } from 'lucide-react'

import { signOut } from '@/app/actions/user'

export default function SignOut() {
  const handleSignOut = async () => {
    await signOut()
    window.location.reload()
  }

  return (
    <button
      className='border-line text-body hover:bg-surface-alt focus-visible:ring-brand/30 ml-auto flex h-11 cursor-pointer items-center gap-2 rounded-full border bg-white px-5 text-sm transition-colors outline-none focus-visible:ring-4'
      onClick={handleSignOut}
    >
      <span>Odhlásit</span>
      <LogOut className='h-4 w-4' />
    </button>
  )
}
