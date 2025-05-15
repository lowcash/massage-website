import { SignJWT, jwtVerify } from 'jose'

import { AUTH_JWT_EXPIRE_HOURS } from '@/const'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'
const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET)

export async function getSignedToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${AUTH_JWT_EXPIRE_HOURS}h`)
    .sign(JWT_SECRET_KEY)
}

export async function getTokenPayload(token: string) {
  return jwtVerify(token, JWT_SECRET_KEY)
}
