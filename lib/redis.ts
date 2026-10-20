import { createClient } from 'redis'

let redisClient: ReturnType<typeof createClient> | null = null

/** One shared connection per server process. */
export async function getRedisClient() {
  if (!redisClient) {
    const client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    })
    // Without a listener a dropped connection would surface as an uncaught exception.
    client.on('error', (error) => console.error('Redis client error:', error))
    await client.connect()
    redisClient = client
  }
  return redisClient
}
