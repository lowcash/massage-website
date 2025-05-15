'use client'

import { signOut } from '@/app/actions/user'
import { update } from '@/app/actions/calendar'

export default function Admin() {
  const handleSignOut = async () => {
    await signOut()
    window.location.reload()
  }

  return (
    <>
      <button onClick={handleSignOut}>Sign Out</button>
      <button onClick={() => update()}>Update calendar</button>
    </>
  )
}
