import { getRedisClient } from '@/lib/redis'

const MAX_FAILURES = 8
const WINDOW_SECONDS = 15 * 60
const KEY_PREFIX = 'admin:auth-fail:'

/**
 * Failed admin logins per client address, kept in Redis for 15 minutes. After 8 failures the address
 * is blocked until the counter expires. It only touches its own `admin:auth-fail:*` keys and fails
 * open: if Redis is unreachable the normal password check still applies, nobody gets locked out by an outage.
 */
export async function getLoginBlock(ip: string) {
  try {
    const redis = await getRedisClient()
    const failures = Number((await redis.get(`${KEY_PREFIX}${ip}`)) ?? 0)

    if (failures < MAX_FAILURES) {
      return null
    }

    return { retryAfterSeconds: Math.max(1, await redis.ttl(`${KEY_PREFIX}${ip}`)) }
  } catch (error) {
    console.error('Login throttle unavailable:', error)
    return null
  }
}

/** Returns true when this failure pushed the address over the limit. */
export async function registerLoginFailure(ip: string) {
  try {
    const redis = await getRedisClient()
    const key = `${KEY_PREFIX}${ip}`
    const failures = await redis.incr(key)

    if (failures === 1) {
      await redis.expire(key, WINDOW_SECONDS)
    }

    return failures >= MAX_FAILURES
  } catch (error) {
    console.error('Login throttle unavailable:', error)
    return false
  }
}

export async function clearLoginFailures(ip: string) {
  try {
    const redis = await getRedisClient()
    await redis.del(`${KEY_PREFIX}${ip}`)
  } catch (error) {
    console.error('Login throttle unavailable:', error)
  }
}
