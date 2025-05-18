'use client'

import { signOut } from '@/app/actions/user'

import { LogOut } from 'lucide-react'

export default function SignOut() {
  const handleSignOut = async () => {
    await signOut()
    window.location.reload()
  }

  return (
    <button
      className='ml-auto flex items-center gap-2 rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500'
      onClick={handleSignOut}
    >
      <span>Odhlásit</span>
      <LogOut className='h-5 w-5' />
    </button>
  )
}
