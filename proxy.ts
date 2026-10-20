import { NextRequest, NextResponse } from 'next/server'

import { createHash, timingSafeEqual } from 'node:crypto'

import { ROUTE } from '@/lib/config/routes'
import { getSignedToken, getTokenPayload } from '@/lib/jwt'
import { AUTH_BASIC_KEY, AUTH_JWT_EXPIRE_HOURS, AUTH_JWT_KEY, AUTH_RESET_KEY } from '@/lib/security/auth-constants'
import { clearLoginFailures, getLoginBlock, registerLoginFailure } from '@/lib/security/login-throttle'

// The value from .env.example must never be accepted as a real password.
const PLACEHOLDER_PASSWORDS = new Set(['your_admin_password_here'])

function isAdminPath(pathname: string) {
  return pathname === ROUTE.ADMIN || pathname.startsWith(`${ROUTE.ADMIN}/`)
}

/** Hashing first makes the comparison constant-time regardless of the input lengths. */
function safeEqual(received: string, expected: string) {
  const receivedHash = createHash('sha256').update(received).digest()
  const expectedHash = createHash('sha256').update(expected).digest()
  return timingSafeEqual(receivedHash, expectedHash)
}

let placeholderWarningShown = false

function credentialsAreValid(username: string, password: string) {
  const expectedUser = process.env.AUTH_USERNAME
  const expectedPassword = process.env.AUTH_PASSWORD

  if (expectedPassword && PLACEHOLDER_PASSWORDS.has(expectedPassword) && !placeholderWarningShown) {
    placeholderWarningShown = true
    console.warn(
      'Admin login is disabled: AUTH_PASSWORD is still the placeholder from .env.example. ' +
        'Set a real password in .env.local, or start the app with `pnpm dev:local`.',
    )
  }

  if (!expectedUser || !expectedPassword || PLACEHOLDER_PASSWORDS.has(expectedPassword)) {
    return false
  }

  // Both are always evaluated so the response time does not reveal which one was wrong.
  const userMatches = safeEqual(username, expectedUser)
  const passwordMatches = safeEqual(password, expectedPassword)
  return userMatches && passwordMatches
}

function parseBasicAuth(header: string) {
  if (!header.startsWith('Basic ')) {
    return null
  }

  const decoded = Buffer.from(header.slice('Basic '.length), 'base64').toString('utf-8')
  const separator = decoded.indexOf(':')

  // Split at the first colon only: passwords may legitimately contain one.
  return separator === -1 ? null : { username: decoded.slice(0, separator), password: decoded.slice(separator + 1) }
}

/**
 * Only `x-real-ip` is trusted: Vercel sets it (and overwrites anything a client sends), while Next.js adds an
 * `x-forwarded-for` with the local socket address even in development. Without it there is no reliable
 * address to count failures against, so local runs are not throttled.
 */
function clientAddress(req: NextRequest) {
  return req.headers.get('x-real-ip')
}

export async function proxy(req: NextRequest) {
  if (!isAdminPath(req.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const httpBasicRes = new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Access to the secured API"',
    },
  })

  const tooManyAttempts = (retryAfterSeconds: number) =>
    new NextResponse('Too many failed attempts. Try again later.', {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSeconds) },
    })

  if (req.cookies.has(AUTH_RESET_KEY)) {
    httpBasicRes.cookies.delete(AUTH_JWT_KEY)
    httpBasicRes.cookies.delete(AUTH_RESET_KEY)
    return httpBasicRes
  }

  const address = clientAddress(req)
  const jwtToken = req.cookies.get(AUTH_JWT_KEY)?.value

  if (!jwtToken) {
    const block = await getLoginBlock(address)
    if (block) {
      return tooManyAttempts(block.retryAfterSeconds)
    }

    const basicAuth = req.headers.get(AUTH_BASIC_KEY)
    if (!basicAuth) {
      return httpBasicRes
    }

    const credentials = parseBasicAuth(basicAuth)
    if (!credentials || !credentialsAreValid(credentials.username, credentials.password)) {
      const nowBlocked = await registerLoginFailure(address)
      return nowBlocked ? tooManyAttempts(60 * 15) : httpBasicRes
    }

    let signedToken: string
    try {
      signedToken = await getSignedToken({ username: credentials.username })
    } catch (error) {
      console.error('Admin login unavailable:', error)
      return new NextResponse('Admin is not configured.', { status: 503 })
    }

    await clearLoginFailures(address)

    const authRes = NextResponse.next()
    authRes.cookies.set({
      name: AUTH_JWT_KEY,
      value: signedToken,
      path: '/',
      maxAge: 60 * 60 * AUTH_JWT_EXPIRE_HOURS,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })
    return authRes
  }

  // if cookie no longer exists, force to fill credentials by http basic auth
  try {
    await getTokenPayload(jwtToken)
    return NextResponse.next()
  } catch {
    // An expired cookie ends up here too; a forged one counts as a failed attempt.
    await registerLoginFailure(address)
    httpBasicRes.cookies.delete(AUTH_JWT_KEY)
    return httpBasicRes
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
