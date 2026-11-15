import { expect, test } from '@playwright/test'

import { chooseFirstFreeSlot, chooseFirstService, plain } from './helpers/booking'

test.describe('Booking flow mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('#hero')).toBeVisible()
  })

  test('service, day and time end in a WhatsApp reservation link with all three on mobile', async ({ page }) => {
    const serviceName = await chooseFirstService(page)
    await expect(page.locator('#booking select')).toHaveValue(serviceName)

    const { time } = await chooseFirstFreeSlot(page)

    const summary = page.getByTestId('booking-summary')
    await expect(summary).toContainText(serviceName)
    await expect(summary).toContainText(time)

    const cta = summary.getByRole('link', { name: 'Rezervovat přes WhatsApp' })
    await expect(cta).toBeVisible()

    // Verify the link actually opens when clicked (catches pointer-event suppression bugs)
    const [popup] = await Promise.all([page.waitForEvent('popup'), cta.click()])
    const openedUrl = popup.url()
    await popup.close()

    // wa.me redirects to api.whatsapp.com — accept either form
    expect(openedUrl).toMatch(/^https:\/\/(wa\.me|api\.whatsapp\.com)\//)

    const message = plain(new URL(openedUrl).searchParams.get('text'))
    expect(message).toContain(serviceName)
    expect(message).toContain(time)
    expect(message).toMatch(/\d{1,2}\.\d{1,2}\./)
  })
})
