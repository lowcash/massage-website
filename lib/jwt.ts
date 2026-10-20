import { SignJWT, jwtVerify } from 'jose'

import { AUTH_JWT_EXPIRE_HOURS } from '@/lib/security/auth-constants'

// Values that appear in examples or wordlists must never sign anything in production.
const KNOWN_WEAK_SECRETS = new Set(['supersecret', 'secret', 'changeme', 'YOUR_JWT_SECRET_HERE'])
const DEV_ONLY_SECRET = 'dev-only-secret-never-used-in-production'

/** Resolved on use, not at import, so builds and preview deployments without the variable still work. */
function getSecretKey() {
  const secret = process.env.JWT_SECRET

  if (secret && !KNOWN_WEAK_SECRETS.has(secret)) {
    return new TextEncoder().encode(secret)
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is missing or a known weak value. Admin login is disabled until it is set.')
  }

  return new TextEncoder().encode(DEV_ONLY_SECRET)
}

export async function getSignedToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${AUTH_JWT_EXPIRE_HOURS}h`)
    .sign(getSecretKey())
}

export async function getTokenPayload(token: string) {
  return jwtVerify(token, getSecretKey(), { algorithms: ['HS256'] })
}
