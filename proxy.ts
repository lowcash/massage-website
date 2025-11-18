import { NextRequest, NextResponse } from 'next/server'
import { getSignedToken, getTokenPayload } from '@/lib/jwt'
import { AUTH_JWT_EXPIRE_HOURS, AUTH_BASIC_KEY, AUTH_JWT_KEY, AUTH_RESET_KEY, ROUTE } from '@/const'

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname !== ROUTE.ADMIN) {
    return NextResponse.next()
  }

  const httpBasicRes = new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Access to the secured API"',
    },
  })

  if (req.cookies.has(AUTH_RESET_KEY)) {
    httpBasicRes.cookies.delete(AUTH_JWT_KEY)
    httpBasicRes.cookies.delete(AUTH_RESET_KEY)
    return httpBasicRes
  }

  const jwtToken = req.cookies.get(AUTH_JWT_KEY)?.value

  if (!jwtToken) {
    const basicAuth = req.headers.get(AUTH_BASIC_KEY)
    if (!basicAuth) {
      return httpBasicRes
    }

    const base64Credentials = basicAuth.replace('Basic ', '')
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
    const [username, password] = credentials.split(':')

    if (username !== process.env.AUTH_USERNAME || password !== process.env.AUTH_PASSWORD) {
      return httpBasicRes
    }

    const authRes = NextResponse.next()
    authRes.cookies.set({
      name: AUTH_JWT_KEY,
      value: await getSignedToken({ username }),
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
  } catch (error) {
    httpBasicRes.cookies.delete(AUTH_JWT_KEY)
    return httpBasicRes
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
