#!/usr/bin/env node
/**
 * Calendar backup tool for the Redis `calendar` key.
 *
 *   pnpm calendar:backup list                 show automatic backups made by the admin
 *   pnpm calendar:backup dump [file]          save the live calendar to a JSON file (read only)
 *   pnpm calendar:backup restore <key|file> --yes   put a backup back (snapshots the current state first)
 *
 * REDIS_URL comes from the environment (the pnpm script loads .env.local). The host is printed before
 * anything happens, `list` and `dump` only read, and `restore` refuses to run without --yes.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { createClient } from 'redis'

const CALENDAR_KEY = 'calendar'
const BACKUP_PREFIX = 'calendar:backup:'

const [command, target, ...rest] = process.argv.slice(2)
const confirmed = [target, ...rest].includes('--yes')

const url = process.env.REDIS_URL
if (!url) {
  console.error('REDIS_URL is not set.')
  process.exit(1)
}

const host = new URL(url).host
console.log(`Redis: ${host}`)

const describe = (raw) => {
  try {
    const items = JSON.parse(raw)
    const reserved = items.filter((item) => item.reserved).length
    return `${items.length} slots (${reserved} reserved)`
  } catch {
    return 'unreadable JSON'
  }
}

const redis = createClient({ url })
await redis.connect()

try {
  if (command === 'list') {
    const keys = (await redis.keys(`${BACKUP_PREFIX}*`)).sort()
    if (keys.length === 0) {
      console.log('No backups yet. They are created by the first admin change.')
    }
    for (const key of keys) {
      const ttl = await redis.ttl(key)
      const expires = ttl > 0 ? `expires in ${Math.ceil(ttl / 86400)} d` : 'no expiry'
      console.log(`${key.padEnd(44)} ${describe((await redis.get(key)) ?? '')}, ${expires}`)
    }
    const live = await redis.get(CALENDAR_KEY)
    console.log(`\nlive ${CALENDAR_KEY}: ${live ? describe(live) : 'missing'}`)
  } else if (command === 'dump') {
    const live = await redis.get(CALENDAR_KEY)
    if (!live) {
      throw new Error('The live calendar key is empty, nothing to dump.')
    }
    const file =
      target && !target.startsWith('--')
        ? target
        : `calendar-backups/calendar-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, live)
    console.log(`Saved ${describe(live)} to ${file}`)
  } else if (command === 'restore') {
    if (!target || target.startsWith('--')) {
      throw new Error('Usage: restore <redis-backup-key|file.json> --yes')
    }
    const raw = target.startsWith(BACKUP_PREFIX) ? await redis.get(target) : readFileSync(target, 'utf8')
    if (!raw) {
      throw new Error(`Backup ${target} not found.`)
    }
    JSON.parse(raw)

    const live = await redis.get(CALENDAR_KEY)
    console.log(`live now:   ${live ? describe(live) : 'missing'}`)
    console.log(`restoring:  ${describe(raw)} from ${target}`)

    if (!confirmed) {
      console.log('\nDry run. Add --yes to apply.')
    } else {
      if (live) {
        const safety = `${BACKUP_PREFIX}before-restore-${Date.now()}`
        await redis.set(safety, live, { expiration: { type: 'EX', value: 60 * 60 * 24 * 60 } })
        console.log(`Current state saved as ${safety}`)
      }
      await redis.set(CALENDAR_KEY, raw)
      console.log('Restored.')
    }
  } else {
    console.log('Usage: calendar-backup <list | dump [file] | restore <key|file> --yes>')
    process.exitCode = 1
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  await redis.quit()
}
