import { expect, test } from '@playwright/test'

const SECTIONS = ['services', 'vouchers', 'about', 'studio', 'booking', 'contact'] as const

const getScrollTargetSelector = (sectionId: (typeof SECTIONS)[number]) => `#${sectionId}`

async function gotoHome(page: import('@playwright/test').Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('#hero')).toBeVisible()
}

async function expectSectionAlignedUnderHeader(page: import('@playwright/test').Page, sectionSelector: string) {
  const section = page.locator(sectionSelector).first()
  await expect(section).toBeAttached()

  const alignmentContext = await page.evaluate((selector) => {
    const targetSection = document.querySelector(selector)
    const header = document.querySelector('header')
    if (!targetSection || !header) {
      return { navBottom: 0, tolerance: 0 }
    }

    const navBottom = (header as HTMLElement).getBoundingClientRect().bottom
    return {
      navBottom,
      tolerance: window.matchMedia('(min-width: 768px)').matches ? 24 : 30,
    }
  }, sectionSelector)

  await expect
    .poll(async () => section.evaluate((el) => el.getBoundingClientRect().top), { timeout: 8000 })
    .toBeGreaterThanOrEqual(alignmentContext.navBottom - alignmentContext.tolerance)
}

test.describe('Mobile menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoHome(page)
  })

  test('opens when hamburger is clicked', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /otevřít navigaci/i })
    await expect(hamburger).toBeVisible()
    await hamburger.click()

    const aside = page.locator('aside')
    await expect(aside).toBeVisible()
  })

  test('closes when X button is clicked', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /otevřít navigaci/i })
    await hamburger.click()

    const aside = page.locator('aside')
    await expect(aside).toBeVisible()

    const closeButton = page.getByRole('button', { name: /zavřít navigaci/i })
    await closeButton.click()
    await page.waitForTimeout(400)
    await expect(aside).toHaveClass(/translate-x-full/)
    await expect(aside).toHaveAttribute('inert', '')
  })

  test('closes when backdrop is clicked', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /otevřít navigaci/i })
    await hamburger.click()

    const aside = page.locator('aside')
    await expect(aside).toBeVisible()

    await page.mouse.click(20, 400)
    await page.waitForTimeout(400)
    await expect(aside).toHaveClass(/translate-x-full/)
    await expect(aside).toHaveAttribute('inert', '')
  })

  test('nav link inside menu scrolls to section and closes menu', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /otevřít navigaci/i })
    await hamburger.click()

    const aside = page.locator('aside')
    await expect(aside).toBeVisible()

    const firstNavButton = aside.locator('div.flex-1 button[type="button"]').first()
    await firstNavButton.click()
    await page.waitForTimeout(600)

    await expect(aside).toHaveClass(/translate-x-full/)
    await expect(aside).toHaveAttribute('inert', '')

    await expectSectionAlignedUnderHeader(page, getScrollTargetSelector('services'))
  })

  test('service card click scrolls to #booking with selected service badge on mobile', async ({ page }) => {
    const serviceCard = page.locator('#services button').first()
    // Wait for the dynamically-imported Services chunk to be fully hydrated
    await expect(serviceCard).toBeAttached({ timeout: 10000 })
    await serviceCard.scrollIntoViewIfNeeded()
    await expect(serviceCard).toBeVisible()

    const serviceName = (await serviceCard.locator('h3').textContent())?.trim()
    await serviceCard.click()

    await expect(page).toHaveURL(/#booking$/)
    await expectSectionAlignedUnderHeader(page, getScrollTargetSelector('booking'))
    await expect(page.locator('#booking span.font-medium')).toContainText(serviceName ?? '')
  })

  test('mobile navigation offset variable stays in expected range', async ({ page }) => {
    const offset = await page.evaluate(() => {
      const offsetValue = getComputedStyle(document.documentElement).getPropertyValue('--navigation-offset').trim()
      return Number.parseFloat(offsetValue)
    })

    expect(offset).toBe(70)
  })

  test('active nav highlight syncs during scroll on mobile', async ({ page }) => {
    const mobileNavButtons = page.locator('aside div.flex-1 button[type="button"]')
    await expect(mobileNavButtons.first()).toBeAttached()

    for (const sectionId of SECTIONS) {
      const sectionIndex = SECTIONS.indexOf(sectionId)

      const didScroll = await page.evaluate((targetId) => {
        const section = document.getElementById(targetId)
        const header = document.querySelector('header') as HTMLElement | null
        if (!section || !header) {
          return false
        }

        const offset = header.getBoundingClientRect().height
        const sectionTop = section.getBoundingClientRect().top + window.scrollY - offset + 4
        window.scrollTo({ top: Math.max(0, sectionTop), behavior: 'auto' })
        return true
      }, sectionId)

      expect(didScroll).toBe(true)

      await expect
        .poll(async () => mobileNavButtons.nth(sectionIndex).getAttribute('aria-current'), { timeout: 3000 })
        .toBe('page')
    }
  })

  test('clicked mobile link stays highlighted as active section', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /otevřít navigaci/i })

    for (const sectionId of SECTIONS) {
      const sectionIndex = SECTIONS.indexOf(sectionId)

      await hamburger.click()
      const aside = page.locator('aside')
      await expect(aside).toBeVisible()

      const navButton = aside.locator('div.flex-1 button[type="button"]').nth(sectionIndex)
      await navButton.click()

      await expect(aside).toHaveClass(/translate-x-full/)
      await expectSectionAlignedUnderHeader(page, getScrollTargetSelector(sectionId))

      await hamburger.click()
      await expect(aside).toBeVisible()
      await expect(aside.locator('div.flex-1 button[type="button"]').nth(sectionIndex)).toHaveAttribute(
        'aria-current',
        'page',
      )

      const closeButton = page.getByRole('button', { name: /zavřít navigaci/i })
      await closeButton.click()
      await expect(aside).toHaveClass(/translate-x-full/)
    }
  })
})
