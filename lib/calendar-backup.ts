import type { createClient } from 'redis'

type RedisClient = ReturnType<typeof createClient>

export const CALENDAR_KV_KEY = 'calendar'
const CALENDAR_BACKUP_PREFIX = 'calendar:backup:'
const CALENDAR_BACKUP_LATEST_KEY = `${CALENDAR_BACKUP_PREFIX}latest`

const DAILY_BACKUP_TTL_SECONDS = 60 * 60 * 24 * 60
const PRAGUE_TZ = 'Europe/Prague'

function pragueDay(date: Date) {
  // en-CA formats as yyyy-MM-dd
  return new Intl.DateTimeFormat('en-CA', { timeZone: PRAGUE_TZ }).format(date)
}

/**
 * Snapshots the current calendar before it is overwritten. Only adds new keys, the live `calendar`
 * key keeps its exact format:
 * - `calendar:backup:latest` always holds the state before the most recent write (undo one change),
 * - `calendar:backup:yyyy-MM-dd` holds the state before the first write of that day and is kept for
 *   60 days (recover from "everything got deleted" even after many edits).
 *
 * Throws on failure so the caller can abort the write: no backup, no overwrite.
 */
export async function backupCalendarBeforeWrite(redis: RedisClient, now = new Date()) {
  const current = await redis.get(CALENDAR_KV_KEY)

  if (!current) {
    return
  }

  await redis
    .multi()
    .set(CALENDAR_BACKUP_LATEST_KEY, current)
    .set(`${CALENDAR_BACKUP_PREFIX}${pragueDay(now)}`, current, {
      condition: 'NX',
      expiration: { type: 'EX', value: DAILY_BACKUP_TTL_SECONDS },
    })
    .exec()
}
