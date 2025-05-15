'use server'

import { authActionClient } from '@/lib/safe-action'
import { cookies } from 'next/headers'

import { AUTH_RESET_KEY } from '@/const'

export const signOut = authActionClient.action(async () => {
  ;(await cookies()).set({
    name: AUTH_RESET_KEY,
    value: 'true',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  })
})
