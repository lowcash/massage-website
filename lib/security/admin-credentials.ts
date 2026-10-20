import { createHash, timingSafeEqual } from 'node:crypto'

// The value from .env.example. It is convenient for a local `pnpm dev`, never acceptable on a real deployment.
const PLACEHOLDER_PASSWORD = 'your_admin_password_here'

type Env = Partial<Record<'AUTH_USERNAME' | 'AUTH_PASSWORD' | 'NODE_ENV', string>>

/** Hashing first makes the comparison constant-time regardless of the input lengths. */
function safeEqual(received: string, expected: string) {
  const receivedHash = createHash('sha256').update(received).digest()
  const expectedHash = createHash('sha256').update(expected).digest()
  return timingSafeEqual(receivedHash, expectedHash)
}

export function isAdminPasswordPlaceholder(env: Env = process.env) {
  return env.AUTH_PASSWORD === PLACEHOLDER_PASSWORD
}

/**
 * True when the credentials match AUTH_USERNAME / AUTH_PASSWORD. The placeholder password from .env.example is
 * accepted only while NODE_ENV is explicitly "development" (`next dev`), so copying .env.example to .env.local gives a working local
 * login (admin / your_admin_password_here) while every production build refuses it.
 */
export function credentialsAreValid(username: string, password: string, env: Env = process.env) {
  const expectedUser = env.AUTH_USERNAME
  const expectedPassword = env.AUTH_PASSWORD

  if (!expectedUser || !expectedPassword) {
    return false
  }

  if (isAdminPasswordPlaceholder(env) && env.NODE_ENV !== 'development') {
    return false
  }

  // Both are always evaluated so the response time does not reveal which one was wrong.
  const userMatches = safeEqual(username, expectedUser)
  const passwordMatches = safeEqual(password, expectedPassword)
  return userMatches && passwordMatches
}
