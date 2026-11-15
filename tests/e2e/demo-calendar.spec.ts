/**
 * Demo calendar (preview mode). Runs against a separate build started with DEMO_CALENDAR=1 and a dead Redis URL
 * (see playwright.config.ts), so every assertion here also proves that demo mode needs no Redis.
 */
import { expect, test } from '@playwright/test'

test.describe('Demo calendar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('#booking [data-day]').first()).toBeAttached({ timeout: 10000 })
  })

  test('shows the preview notice and realistic data: free days, fully booked days, several weeks', async ({ page }) => {
    await expect(page.locator('[data-demo-calendar="true"]')).toContainText('Ukázková data')

    const freeDays = page.locator('#booking [data-day][aria-label*="volné"], #booking [data-day][aria-label*="volný"]')
    expect(await freeDays.count()).toBeGreaterThanOrEqual(10)
    await expect(page.locator('#booking [data-day][aria-label*="obsazeno"]').first()).toBeAttached()

    // The data spans into the next month.
    await page.getByRole('button', { name: 'Další měsíc' }).click()
    await expect(page.locator('#booking [data-day]:not([aria-disabled="true"])').first()).toBeAttached()
  })

  test('the hero offers a nearest free term from the demo data', async ({ page }) => {
    await expect(page.locator('#hero')).toContainText('Nejbližší volný termín')
  })

  test('a fully booked day explains itself and offers no bookable time', async ({ page }) => {
    await page.locator('#booking [data-day][aria-label*="obsazeno"]').first().click()
    await expect(page.getByTestId('booking-times')).toContainText('obsazený')
    await expect(page.locator('#booking [data-testid="booking-times"] button')).toHaveCount(0)
  })

  test('booking is simulated in memory: no WhatsApp link, slot turns busy, a reload brings it back', async ({
    page,
  }) => {
    const day = page.locator('#booking [data-day]:not([aria-disabled="true"])').first()
    await day.click()
    const chip = page.locator('#booking [data-testid="booking-times"] button').first()
    const time = ((await chip.textContent()) ?? '').trim()
    await chip.click()

    const summary = page.getByTestId('booking-summary')
    await expect(summary.getByRole('link', { name: 'Rezervovat přes WhatsApp' })).toHaveCount(0)
    await summary.getByRole('button', { name: 'Vyzkoušet rezervaci' }).click()

    await expect(summary).toContainText('Ukázková rezervace')
    await expect(
      page.locator('#booking [data-testid="booking-times"] button', { hasText: new RegExp(`^${time}$`) }),
    ).toHaveCount(0)

    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.locator('#booking [data-day]:not([aria-disabled="true"])').first().click()
    await expect(
      page.locator('#booking [data-testid="booking-times"] button', { hasText: new RegExp(`^${time}$`) }),
    ).toHaveCount(1)
  })
})
