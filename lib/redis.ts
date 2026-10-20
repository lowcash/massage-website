import { createClient } from 'redis'

type RedisClient = ReturnType<typeof createClient>

const CONNECT_ATTEMPTS = 3

let client: RedisClient | null = null
let connecting: Promise<RedisClient> | null = null

function connect() {
  const next = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      connectTimeout: 5_000,
      // node-redis retries forever by default, so connect() would never settle when Redis is down (CI, builds,
      // local runs without Redis) and every caller would hang until its own timeout. Give up after a few quick
      // attempts so callers can fall back; a later call simply tries again with a fresh client.
      reconnectStrategy: (retries) => (retries >= CONNECT_ATTEMPTS ? new Error('Redis is unreachable') : retries * 200),
    },
  })

  // Without a listener a dropped connection would surface as an uncaught exception.
  next.on('error', (error) => console.error(`Redis client error: ${error.message}`))

  return next.connect().then(
    () => next,
    (error) => {
      next.destroy()
      throw error
    },
  )
}

/** One shared connection per server process, replaced when it is gone. */
export async function getRedisClient() {
  if (client?.isReady) {
    return client
  }

  if (client) {
    client.destroy()
    client = null
  }

  connecting ??= connect()
    .then((connected) => {
      client = connected
      return connected
    })
    .finally(() => {
      connecting = null
    })

  return connecting
}
