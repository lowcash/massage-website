import { expect, test } from '@playwright/test'

test.describe('Booking flow mobile', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!test.info().project.name.startsWith('mobile-'), 'Mobile booking flow coverage runs only on mobile projects.')

    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('#hero')).toBeVisible()
  })

  test('service selection is reflected in booking badge and WhatsApp reservation link on mobile', async ({ page }) => {
    const serviceCard = page.locator('#services button').first()
    await serviceCard.scrollIntoViewIfNeeded()
    await expect(serviceCard).toBeVisible()

    const serviceName = ((await serviceCard.locator('h3').textContent()) ?? '').trim()
    await serviceCard.click()

    const selectedServiceBadge = page.locator('#booking span.font-medium').first()
    await expect(selectedServiceBadge).toContainText(serviceName)

    const firstAvailableSlot = page.locator('#booking article a[href^="https://wa.me/"]:visible').first()
    await expect(firstAvailableSlot).toBeVisible()
    await firstAvailableSlot.scrollIntoViewIfNeeded()

    const time = ((await firstAvailableSlot.textContent()) ?? '').trim()
    const dayCard = firstAvailableSlot.locator('xpath=ancestor::article[1]')
    const date = ((await dayCard.locator('p').first().textContent()) ?? '').trim()

    const openedUrl = (await firstAvailableSlot.getAttribute('href')) ?? ''
    await expect(firstAvailableSlot).toHaveAttribute('target', '_blank')

    expect(openedUrl).toMatch(/^https:\/\/wa\.me\//)

    const message = new URL(openedUrl).searchParams.get('text') ?? ''
    expect(message).toContain(serviceName)
    expect(message).toContain(date)
    expect(message).toContain(time)

    await firstAvailableSlot.evaluate((element) => {
      element.setAttribute('target', '_self')
    })

    await Promise.all([
      page.waitForURL(/(wa\.me|api\.whatsapp\.com)/, { waitUntil: 'domcontentloaded' }),
      firstAvailableSlot.click(),
    ])

    await expect(page).toHaveURL(/text=/)
  })
})