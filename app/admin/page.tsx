'use client'

import { signOut } from '@/app/actions/user'

export default function Admin() {
  const handleSignOut = async () => {
    await signOut()
    window.location.reload()
  }

  return <button onClick={handleSignOut}>Sign Out</button>
}
