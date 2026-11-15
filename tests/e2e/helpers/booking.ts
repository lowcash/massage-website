import { type Page, expect } from '@playwright/test'

/** Display text binds words with non-breaking spaces; WhatsApp messages and option values use plain spaces. */
export const plain = (text: string | null) => (text ?? '').replaceAll(' ', ' ').trim()

/** Picks the first service row, returns its plain name. */
export async function chooseFirstService(page: Page) {
  const row = page.locator('#services li').first()
  const button = row.locator('button')
  await expect(button).toBeAttached({ timeout: 10000 })
  await button.scrollIntoViewIfNeeded()
  await expect(button).toBeVisible()

  const name = plain(await row.locator('h3').textContent())
  // The row is server-rendered before it hydrates; a click in that window does nothing, so retry until it lands.
  await expect(async () => {
    await button.click()
    await expect(page.locator('#booking select')).toHaveValue(name, { timeout: 1000 })
  }).toPass({ timeout: 10000 })
  return name
}

/** Clicks the first selectable day and the first free time; returns what was chosen. */
export async function chooseFirstFreeSlot(page: Page) {
  const day = page.locator('#booking [data-day]:not([aria-disabled="true"])').first()
  await day.scrollIntoViewIfNeeded()
  await expect(day).toBeVisible()
  const dayLabel = (await day.getAttribute('aria-label')) ?? ''
  await day.click()
  await expect(day).toHaveAttribute('aria-pressed', 'true')

  const slot = page.locator('#booking [data-testid="booking-times"] button').first()
  await expect(slot).toBeVisible()
  const time = plain(await slot.textContent())
  await slot.click()
  await expect(slot).toHaveAttribute('aria-pressed', 'true')

  return { dayLabel, time }
}
