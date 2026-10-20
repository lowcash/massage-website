#!/usr/bin/env node
/**
 * Safe local development: runs `next dev` against a throwaway Redis on port 6390 with fixed local admin
 * credentials. .env.local may point at the production Redis; this script overrides it so nothing you do
 * locally (adding, toggling or deleting slots in /admin) can touch production data.
 *
 *   pnpm dev:local          →  http://localhost:3000  and  http://localhost:3000/admin  (PORT=3001 to change)
 *   admin login             →  user "admin", password "local-admin"
 */
import { spawn, spawnSync } from 'node:child_process'
import net from 'node:net'
import { createClient } from 'redis'

const REDIS_PORT = 6390
const PORT = process.env.PORT ?? '3000'
const LOCAL_ENV = {
  REDIS_URL: `redis://127.0.0.1:${REDIS_PORT}`,
  AUTH_USERNAME: 'admin',
  AUTH_PASSWORD: 'local-admin',
  JWT_SECRET: 'local-development-secret-not-for-production',
}

const redisIsUp = () =>
  spawnSync('redis-cli', ['-p', String(REDIS_PORT), 'ping'], { encoding: 'utf8' }).stdout?.trim() === 'PONG'

const portIsFree = await new Promise((resolve) => {
  const probe = net.createServer()
  probe.once('error', () => resolve(false))
  probe.once('listening', () => probe.close(() => resolve(true)))
  probe.listen(Number(PORT))
})
if (!portIsFree) {
  console.error(
    `Port ${PORT} is already in use, probably another "pnpm dev". Stop it first: Next.js allows only one dev ` +
      `server per project folder, and the other one may be connected to the production Redis.`,
  )
  process.exit(1)
}

let redisProcess = null
if (!redisIsUp()) {
  redisProcess = spawn('redis-server', ['--port', String(REDIS_PORT), '--save', '', '--appendonly', 'no'], {
    stdio: 'ignore',
  })
  redisProcess.on('error', () => {
    console.error('Could not start redis-server. Install it first, for example: brew install redis')
    process.exit(1)
  })
  for (let attempt = 0; attempt < 30 && !redisIsUp(); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
}

// Demo slots for the next 6 days, only if the local calendar is empty.
const redis = createClient({ url: LOCAL_ENV.REDIS_URL })
await redis.connect()
if (!(await redis.get('calendar'))) {
  const slots = []
  for (let day = 1; day <= 6; day++) {
    for (const hour of [13, 14, 15, 16, 17]) {
      const date = new Date()
      date.setUTCDate(date.getUTCDate() + day)
      date.setUTCHours(hour, 0, 0, 0)
      slots.push({ date: date.toISOString(), reserved: (day + hour) % 4 === 0 })
    }
  }
  await redis.set('calendar', JSON.stringify(slots, null, 2))
}
await redis.quit()

console.log('\nLocal Redis:  redis://127.0.0.1:%d (throwaway, production is not touched)', REDIS_PORT)
console.log(`Site:         http://localhost:${PORT}`)
console.log(`Admin:        http://localhost:${PORT}/admin   user "admin", password "local-admin"`)
console.log(`Admin (URL):  http://admin:local-admin@localhost:${PORT}/admin\n`)

const next = spawn('pnpm', ['exec', 'next', 'dev', '--port', PORT, '--turbopack'], {
  stdio: 'inherit',
  env: { ...process.env, ...LOCAL_ENV },
})

const stop = () => {
  next.kill()
  redisProcess?.kill()
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
next.on('exit', (code) => {
  redisProcess?.kill()
  process.exit(code ?? 0)
})
