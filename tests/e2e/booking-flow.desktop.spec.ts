import { expect, test } from '@playwright/test'

test.describe('Booking flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('#hero')).toBeVisible()
  })

  test('service selection is reflected in booking badge and WhatsApp reservation link', async ({ page }) => {
    const serviceRow = page.locator('#services li').first()
    const serviceCard = serviceRow.locator('button')
    await expect(serviceCard).toBeAttached({ timeout: 10000 })
    await serviceCard.scrollIntoViewIfNeeded()
    await expect(serviceCard).toBeVisible()

    // Display text binds words with non-breaking spaces; the WhatsApp message uses plain spaces.
    const serviceName = ((await serviceRow.locator('h3').textContent()) ?? '').replaceAll('\u00a0', ' ').trim()
    await serviceCard.click()

    const selectedServiceBadge = page.locator('#booking span.font-medium').first()
    await expect(selectedServiceBadge).toContainText(serviceName)

    const firstAvailableSlot = page.locator('#booking article a[href^="https://wa.me/"]:visible').first()
    await expect(firstAvailableSlot).toBeVisible()
    await firstAvailableSlot.scrollIntoViewIfNeeded()

    const time = ((await firstAvailableSlot.textContent()) ?? '').trim()
    const dayCard = firstAvailableSlot.locator('xpath=ancestor::article[1]')
    const date = ((await dayCard.locator('p').first().textContent()) ?? '').trim()

    // Verify the link actually opens when clicked (catches pointer-event suppression bugs)
    const [popup] = await Promise.all([page.waitForEvent('popup'), firstAvailableSlot.click()])

    const openedUrl = popup.url()
    await popup.close()

    // wa.me redirects to api.whatsapp.com — accept either form
    expect(openedUrl).toMatch(/^https:\/\/(wa\.me|api\.whatsapp\.com)\//)

    const message = new URL(openedUrl).searchParams.get('text') ?? ''
    expect(message).toContain(serviceName)
    expect(message).toContain(date)
    expect(message).toContain(time)
  })
})
