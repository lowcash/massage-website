/**
 * Admin calendar tests. They WRITE to Redis, so they only run when E2E_ADMIN=1 and E2E_REDIS_URL points
 * at a local throwaway instance (the guard below refuses anything else). The preview server must be
 * started against the same Redis and with AUTH_USERNAME/AUTH_PASSWORD matching E2E_ADMIN_USER/PASSWORD.
 */
import { type Page, expect, test } from '@playwright/test'
import { SignJWT } from 'jose'
import { createClient } from 'redis'

const REDIS_URL = process.env.E2E_REDIS_URL ?? ''
const ADMIN_USER = process.env.E2E_ADMIN_USER ?? ''
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? ''
const IS_LOCAL_REDIS = /^redis:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(REDIS_URL)

const CALENDAR_KEY = 'calendar'
const BACKUP_LATEST_KEY = 'calendar:backup:latest'

test.describe.configure({ mode: 'serial' })
test.skip(
  process.env.E2E_ADMIN !== '1' || !IS_LOCAL_REDIS || !ADMIN_USER || !ADMIN_PASSWORD,
  'admin tests need E2E_ADMIN=1, a local E2E_REDIS_URL and E2E_ADMIN_USER/E2E_ADMIN_PASSWORD',
)
test.use({ httpCredentials: { username: ADMIN_USER, password: ADMIN_PASSWORD } })

type StoredSlot = { date: string; reserved: boolean }

/** Prague wall-clock time on a day `dayOffset` days from now, as a Date (handles DST). */
function pragueSlot(dayOffset: number, hours: number, minutes: number) {
  const base = new Date(Date.now() + dayOffset * 86_400_000)
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague' })
    .format(base)
    .split('-')
    .map(Number)
  const guess = Date.UTC(year, month - 1, day, hours, minutes)
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Prague',
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
      .formatToParts(new Date(guess))
      .map((part) => [part.type, Number(part.value)]),
  )
  const asPrague = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute)

  return {
    date: new Date(guess - (asPrague - guess)),
    inputDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  }
}

const FIXTURE: StoredSlot[] = [
  { date: pragueSlot(3, 10, 0).date.toISOString(), reserved: false },
  { date: pragueSlot(3, 11, 0).date.toISOString(), reserved: true },
  { date: pragueSlot(4, 14, 0).date.toISOString(), reserved: false },
]

const redis = createClient({ url: REDIS_URL })

async function readCalendar() {
  return JSON.parse((await redis.get(CALENDAR_KEY)) ?? '[]') as StoredSlot[]
}

async function resetRedis() {
  const keys = [...(await redis.keys('calendar*')), ...(await redis.keys('admin:auth-fail:*'))]
  if (keys.length > 0) {
    await redis.del(keys)
  }
  await redis.set(CALENDAR_KEY, JSON.stringify(FIXTURE, null, 2))
}

const todayKey = () =>
  `calendar:backup:${new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague' }).format(new Date())}`

async function openAdmin(page: Page) {
  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: 'Správa termínů' })).toBeVisible()
}

/** Clicks a day in the month calendar, paging forward when it lies in a later month. */
async function pickDay(page: Page, inputDate: string) {
  const [year, month, day] = inputDate.split('-').map(Number)
  const [thisYear, thisMonth] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague' })
    .format(new Date())
    .split('-')
    .map(Number)

  for (let step = 0; step < (year - thisYear) * 12 + (month - thisMonth); step++) {
    await page.getByRole('button', { name: 'Další měsíc' }).click()
  }
  await page.locator(`button[aria-label^="${day}. "]:not([disabled])`).click()
}

let originalCalendar: string | null = null

test.beforeAll(async () => {
  await redis.connect()
  originalCalendar = await redis.get(CALENDAR_KEY)
})

test.afterAll(async () => {
  // Leave the (local) Redis as the suite found it so other specs keep their data.
  const keys = [...(await redis.keys('calendar*')), ...(await redis.keys('admin:auth-fail:*'))]
  if (keys.length > 0) {
    await redis.del(keys)
  }
  if (originalCalendar !== null) {
    await redis.set(CALENDAR_KEY, originalCalendar)
  }
  await redis.quit()
})

test.beforeEach(async () => {
  await resetRedis()
})

test('rejects requests without credentials', async ({ baseURL }) => {
  const response = await fetch(`${baseURL}/admin`)
  expect(response.status).toBe(401)
})

test('opens on the nearest day with slots and shows its state', async ({ page }) => {
  await openAdmin(page)

  await expect(page.getByRole('switch')).toHaveCount(2)
  await expect(page.getByRole('switch', { name: 'Rezervováno 10:00' })).toHaveAttribute('aria-checked', 'false')
  await expect(page.getByRole('switch', { name: 'Rezervováno 11:00' })).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByText('2 termíny, z toho 1 rezervováno')).toBeVisible()
})

test('adding a time keeps stored data and format intact and snapshots a backup', async ({ page }) => {
  const added = pragueSlot(6, 12, 0)
  await openAdmin(page)

  await pickDay(page, added.inputDate)
  await page.getByRole('button', { name: 'Přidat 12:00' }).click()
  await expect(page.getByText('byl přidán')).toBeVisible()
  await expect(page.getByRole('button', { name: '12:00 už je přidáno' })).toBeDisabled()

  const stored = await readCalendar()
  expect(stored).toHaveLength(FIXTURE.length + 1)
  expect(stored).toEqual(expect.arrayContaining(FIXTURE))
  expect(stored).toContainEqual({ date: added.date.toISOString(), reserved: false })
  for (const slot of stored) {
    expect(Object.keys(slot).sort()).toEqual(['date', 'reserved'])
    expect(slot.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  }

  const fixtureRaw = JSON.stringify(FIXTURE, null, 2)
  expect(await redis.get(BACKUP_LATEST_KEY)).toBe(fixtureRaw)
  expect(await redis.get(todayKey())).toBe(fixtureRaw)
  expect(await redis.ttl(todayKey())).toBeGreaterThan(0)
})

test('daily backup keeps the first state of the day, latest follows each write', async ({ page }) => {
  await openAdmin(page)

  await page.getByRole('switch', { name: 'Rezervováno 10:00' }).click()
  await expect.poll(async () => (await readCalendar()).filter((slot) => slot.reserved).length).toBe(2)
  const afterFirstWrite = await redis.get(CALENDAR_KEY)

  await page.getByRole('switch', { name: 'Rezervováno 11:00' }).click()
  await expect.poll(async () => await redis.get(CALENDAR_KEY)).not.toBe(afterFirstWrite)

  expect(await redis.get(todayKey())).toBe(JSON.stringify(FIXTURE, null, 2))
  expect(await redis.get(BACKUP_LATEST_KEY)).toBe(afterFirstWrite)
})

test('deleting changes only the targeted slot, a reserved slot cannot be deleted', async ({ page }) => {
  await openAdmin(page)

  await expect(page.getByRole('button', { name: 'Smazat termín 11:00' })).toBeDisabled()

  await page.getByRole('button', { name: 'Smazat termín 10:00' }).click()
  await expect(page.getByText('byl smazán')).toBeVisible()
  await expect.poll(async () => await readCalendar()).toEqual([FIXTURE[1], FIXTURE[2]])
})

test('a failed save rolls the list back, shows an error and leaves Redis untouched', async ({ page }) => {
  await openAdmin(page)
  await page.route('**/admin', (route) =>
    route.request().headers()['next-action'] ? route.fulfill({ status: 500, body: 'boom' }) : route.continue(),
  )

  const toggle = page.getByRole('switch', { name: 'Rezervováno 10:00' })
  await toggle.click()

  await expect(page.getByText('Uložení se nezdařilo')).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-checked', 'false')
  expect(await readCalendar()).toEqual(FIXTURE)
  expect(await redis.exists(BACKUP_LATEST_KEY)).toBe(0)
})

test('times that already passed cannot be added, a custom past time is refused with a message', async ({ page }) => {
  // Freeze the browser clock at 12:00 Prague time so "already passed" does not depend on when the suite runs.
  await page.clock.install({ time: pragueSlot(0, 12, 0).date })
  await openAdmin(page)

  await pickDay(page, pragueSlot(0, 12, 0).inputDate)
  await expect(page.getByRole('button', { name: 'Přidat 09:00' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Přidat 15:00' })).toBeEnabled()

  await page.getByRole('button', { name: 'Jiný čas' }).click()
  await page.locator('#custom-hour').selectOption('9')
  await page.locator('#custom-minute').selectOption('15')
  await page.getByRole('button', { name: 'Přidat', exact: true }).click()

  await expect(page.getByText('Zadejte čas, který ještě nenastal')).toBeVisible()
  expect(await readCalendar()).toEqual(FIXTURE)
})

test('a custom time is added like any other', async ({ page }) => {
  const added = pragueSlot(6, 17, 45)
  await openAdmin(page)

  await pickDay(page, added.inputDate)
  await page.getByRole('button', { name: 'Jiný čas' }).click()
  await page.locator('#custom-hour').selectOption('17')
  await page.locator('#custom-minute').selectOption('45')
  await page.getByRole('button', { name: 'Přidat', exact: true }).click()

  await expect(page.getByText('byl přidán')).toBeVisible()
  await expect
    .poll(async () => await readCalendar())
    .toContainEqual({ date: added.date.toISOString(), reserved: false })
})

test('the month calendar switches the day, an empty day explains itself and still allows adding', async ({ page }) => {
  await openAdmin(page)

  await pickDay(page, pragueSlot(4, 14, 0).inputDate)
  await expect(page.getByRole('switch')).toHaveCount(1)
  await expect(page.getByRole('switch', { name: 'Rezervováno 14:00' })).toBeVisible()

  await pickDay(page, pragueSlot(6, 12, 0).inputDate)
  await expect(page.getByText('V tento den zatím nejsou žádné termíny.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Přidat 15:00' })).toBeVisible()
})

test('search looks through all days and returns to the day view when cleared', async ({ page }) => {
  await openAdmin(page)
  const search = page.getByRole('searchbox', { name: 'Hledat termíny' })

  await search.fill('14:00')
  await expect(page.getByText('Nalezeno 1 termín ve všech dnech')).toBeVisible()
  await expect(page.getByRole('switch', { name: 'Rezervováno 14:00' })).toBeVisible()

  await search.fill('rezervováno')
  await expect(page.getByRole('switch')).toHaveCount(1)
  await expect(page.getByRole('switch', { name: 'Rezervováno 11:00' })).toHaveAttribute('aria-checked', 'true')

  await search.fill('zzz')
  await expect(page.getByText('Žádný termín neodpovídá hledání.')).toBeVisible()

  await page.getByRole('button', { name: 'Vymazat hledání' }).click()
  await expect(page.getByRole('switch')).toHaveCount(2)
  expect(await readCalendar()).toEqual(FIXTURE)
})

test.describe('undo', () => {
  test('a deleted slot can be brought back with "Vrátit zpět"', async ({ page }) => {
    await openAdmin(page)

    await page.getByRole('button', { name: 'Smazat termín 10:00' }).click()
    await expect(page.getByText('byl smazán')).toBeVisible()
    await expect.poll(async () => (await readCalendar()).length).toBe(2)

    await page.getByRole('button', { name: 'Vrátit zpět' }).click()
    await expect(page.getByText('Poslední změna byla vrácena zpět')).toBeVisible()
    await expect.poll(async () => (await readCalendar()).length).toBe(3)
    expect(await readCalendar()).toEqual(expect.arrayContaining(FIXTURE))
    await expect(page.getByRole('switch', { name: 'Rezervováno 10:00' })).toBeVisible()
  })

  test('undoing a reservation toggle restores the previous state', async ({ page }) => {
    await openAdmin(page)

    await page.getByRole('switch', { name: 'Rezervováno 10:00' }).click()
    await expect(page.getByText('je nově rezervovaný')).toBeVisible()
    await page.getByRole('button', { name: 'Vrátit zpět' }).click()

    await expect.poll(async () => await readCalendar()).toEqual(FIXTURE)
    await expect(page.getByRole('switch', { name: 'Rezervováno 10:00' })).toHaveAttribute('aria-checked', 'false')
  })

  test('only the last change can be undone, a newer change replaces the older offer', async ({ page }) => {
    await openAdmin(page)

    await page.getByRole('switch', { name: 'Rezervováno 10:00' }).click()
    await expect.poll(async () => (await readCalendar()).filter((slot) => slot.reserved).length).toBe(2)
    await page.getByRole('switch', { name: 'Rezervováno 11:00' }).click()
    await expect.poll(async () => (await readCalendar()).filter((slot) => slot.reserved).length).toBe(1)

    await expect(page.getByRole('button', { name: 'Vrátit zpět' })).toHaveCount(1)
    await page.getByRole('button', { name: 'Vrátit zpět' }).click()

    await expect.poll(async () => (await readCalendar()).filter((slot) => slot.reserved).length).toBe(2)
    expect(await readCalendar()).toContainEqual({ ...FIXTURE[0], reserved: true })
    expect(await readCalendar()).toContainEqual(FIXTURE[1])
  })
})

test.describe('admin access control', () => {
  const basic = (user: string, password: string) => `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`
  const request = (baseURL: string | undefined, headers: Record<string, string> = {}, path = '/admin') =>
    fetch(`${baseURL}${path}`, { headers, redirect: 'manual' })

  test('wrong credentials are refused', async ({ baseURL }) => {
    expect((await request(baseURL, { Authorization: basic(ADMIN_USER, 'not-the-password') })).status).toBe(401)
    expect((await request(baseURL, { Authorization: basic('someone-else', ADMIN_PASSWORD) })).status).toBe(401)
    expect((await request(baseURL, { Authorization: basic(ADMIN_USER, ADMIN_PASSWORD) })).status).toBe(200)
  })

  test('sub-paths of /admin are protected as well', async ({ baseURL }) => {
    expect((await request(baseURL, {}, '/admin/anything')).status).toBe(401)
  })

  test('cookies signed with a guessable secret or without a signature are refused', async ({ baseURL }) => {
    const forge = (secret: string) =>
      new SignJWT({ username: ADMIN_USER })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(new TextEncoder().encode(secret))
    const unsigned = `${Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url')}.${Buffer.from(`{"username":"${ADMIN_USER}"}`).toString('base64url')}.`

    for (const token of [
      await forge('supersecret'),
      await forge('secret'),
      await forge('dev-only-secret-never-used-in-production'),
      unsigned,
    ]) {
      const response = await request(baseURL, { Cookie: `_auth_token=${token}`, 'x-real-ip': '198.51.100.20' })
      expect(response.status).toBe(401)
    }
  })

  test('repeated wrong passwords lock the address out, other addresses are unaffected', async ({ baseURL }) => {
    const attacker = { 'x-real-ip': '203.0.113.50' }
    const statuses: number[] = []

    for (let attempt = 0; attempt < 8; attempt++) {
      statuses.push(
        (await request(baseURL, { ...attacker, Authorization: basic(ADMIN_USER, `guess-${attempt}`) })).status,
      )
    }
    expect(statuses.slice(0, 7)).toEqual(Array(7).fill(401))
    expect(statuses[7]).toBe(429)

    // Even the right password is refused while blocked, otherwise guessing would still be possible.
    const blocked = await request(baseURL, { ...attacker, Authorization: basic(ADMIN_USER, ADMIN_PASSWORD) })
    expect(blocked.status).toBe(429)
    expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThan(0)

    expect(
      (await request(baseURL, { 'x-real-ip': '203.0.113.51', Authorization: basic(ADMIN_USER, ADMIN_PASSWORD) }))
        .status,
    ).toBe(200)
  })

  test('a successful login resets the failure counter', async ({ baseURL }) => {
    const user = { 'x-real-ip': '203.0.113.60' }

    for (let attempt = 0; attempt < 5; attempt++) {
      await request(baseURL, { ...user, Authorization: basic(ADMIN_USER, `typo-${attempt}`) })
    }
    expect((await request(baseURL, { ...user, Authorization: basic(ADMIN_USER, ADMIN_PASSWORD) })).status).toBe(200)
    expect(await redis.exists('admin:auth-fail:203.0.113.60')).toBe(0)
  })
})
