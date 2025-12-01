import 'server-only'

import { cookies } from 'next/headers'
import { createSafeActionClient } from 'next-safe-action'
import { getTokenPayload } from '@/lib/jwt'

import { AUTH_JWT_KEY, ERROR_CAUSE } from '@/const'

export const actionClient = createSafeActionClient({})

export const authActionClient = actionClient.use(async ({ next }) => {
  const jwtToken = (await cookies()).get(AUTH_JWT_KEY)?.value

  if (!jwtToken) throw new Error(ERROR_CAUSE.UNAUTHORIZED)

  const { payload } = await getTokenPayload(jwtToken)

  if (!payload) throw new Error(ERROR_CAUSE.UNAUTHORIZED)

  return next({ ctx: { username: payload.username } })
})
