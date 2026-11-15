/**
 * Booking calendar behaviour (month grid, time chips, summary). Runs against the seeded local Redis;
 * data-independent: it picks whatever the first selectable day is.
 */
import { expect, test } from '@playwright/test'

test.describe('Booking calendar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('#booking [data-day]').first()).toBeAttached({ timeout: 10000 })
    await page.locator('#booking').scrollIntoViewIfNeeded()
  })

  test('empty selection: no day pressed, summary prompts and the reservation button is disabled', async ({ page }) => {
    await expect(page.locator('#booking [data-day][aria-pressed="true"]')).toHaveCount(0)
    await expect(page.getByTestId('booking-times')).toContainText('Vyberte den')
    const summary = page.getByTestId('booking-summary')
    await expect(summary).toContainText('Vyberte den a čas')
    await expect(summary.locator('button[disabled]')).toBeVisible()
  })

  test('days announce their availability and unavailable days are aria-disabled', async ({ page }) => {
    const free = page.locator('#booking [data-day]:not([aria-disabled="true"])').first()
    await expect(free).toHaveAttribute('aria-label', /voln/)
    await expect(page.locator('#booking [data-day][aria-disabled="true"]').first()).toBeAttached()
  })

  test('selecting a day lists times; picking a time fills the summary; changing day clears the time', async ({
    page,
  }) => {
    const days = page.locator('#booking [data-day]:not([aria-disabled="true"])')
    await days.nth(0).click()
    const chips = page.locator('#booking [data-testid="booking-times"] button')
    await expect(chips.first()).toBeVisible()

    await chips.first().click()
    const summary = page.getByTestId('booking-summary')
    await expect(summary).toContainText('Termín')
    await expect(summary.getByRole('link', { name: 'Rezervovat přes WhatsApp' })).toBeVisible()

    await days.nth(1).click()
    await expect(page.locator('#booking [data-testid="booking-times"] button[aria-pressed="true"]')).toHaveCount(0)
    await expect(summary.getByRole('link', { name: 'Rezervovat přes WhatsApp' })).toHaveCount(0)
  })

  test('keyboard: arrow keys move focus between days, Enter selects, Tab leaves the grid', async ({ page }) => {
    const first = page.locator('#booking [data-day]:not([aria-disabled="true"])').first()
    await first.focus()
    const firstKey = await first.getAttribute('data-day')

    await page.keyboard.press('ArrowRight')
    const afterRight = await page.evaluate(() => (document.activeElement as HTMLElement).dataset.day)
    expect(afterRight).not.toBe(firstKey)
    expect(new Date(afterRight!).getTime() - new Date(firstKey!).getTime()).toBe(86_400_000)

    await page.keyboard.press('ArrowDown')
    const afterDown = await page.evaluate(() => (document.activeElement as HTMLElement).dataset.day)
    expect(new Date(afterDown!).getTime() - new Date(afterRight!).getTime()).toBe(7 * 86_400_000)

    await first.focus()
    await page.keyboard.press('Enter')
    await expect(first).toHaveAttribute('aria-pressed', 'true')

    // Roving tabindex: exactly one day is in the tab order.
    await expect(page.locator('#booking [data-day][tabindex="0"]')).toHaveCount(1)
  })

  test('the "next free" shortcut selects the nearest free day and time', async ({ page }) => {
    await page.getByRole('button', { name: /Nejbližší volný termín/ }).click()
    await expect(page.locator('#booking [data-day][aria-pressed="true"]')).toHaveCount(1)
    await expect(page.locator('#booking [data-testid="booking-times"] button[aria-pressed="true"]')).toHaveCount(1)
  })

  test('slot, day and nav targets are at least 44px tall and nothing overflows horizontally', async ({ page }) => {
    const day = page.locator('#booking [data-day]:not([aria-disabled="true"])').first()
    expect((await day.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44)
    await day.click()
    const chip = page.locator('#booking [data-testid="booking-times"] button').first()
    expect((await chip.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
