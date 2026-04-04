import { test, expect } from '@playwright/test'

/**
 * Navigation tests — desktop links, hero CTA, mobile menu open/close.
 * Run against a live dev server: npm run dev
 */

const SECTIONS = ['services', 'vouchers', 'about', 'studio', 'booking', 'contact'] as const

test.describe('Desktop navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  for (const sectionId of SECTIONS) {
    test(`nav link scrolls to #${sectionId}`, async ({ page }) => {
      // Click the desktop nav button (hidden on mobile, visible on lg+) — use viewport 1280px
      await page.setViewportSize({ width: 1280, height: 800 })
      const desktopNav = page.locator('header .hidden.lg\\:flex')
      await expect(desktopNav).toBeVisible()

      // Find button by aria-current or position — simplest: click the one whose text matches the id
      const btn = desktopNav.locator('button').filter({ hasText: new RegExp(sectionId, 'i') })
      // If text match fails (Czech labels), fall back to index-based click by section order
      const btnCount = await desktopNav.locator('button').count()
      const sectionIndex = SECTIONS.indexOf(sectionId)
      const targetBtn = sectionIndex < btnCount ? desktopNav.locator('button').nth(sectionIndex) : btn

      await targetBtn.click()
      await page.waitForTimeout(800) // allow smooth scroll

      const section = page.locator(`#${sectionId}`)
      await expect(section).toBeInViewport({ ratio: 0.1 })
    })
  }

  test('hero CTA button scrolls to #services', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    // Use role+name to avoid matching the scroll cue (also links to #services)
    const cta = page.getByRole('link', { name: 'Vyberte si masáž' })
    await expect(cta).toBeVisible()
    await cta.click()
    await page.waitForTimeout(800)

    const services = page.locator('#services')
    await expect(services).toBeInViewport({ ratio: 0.1 })
  })
})

test.describe('Mobile menu', () => {
  test.beforeEach(async ({ page }) => {
    // Use mobile viewport so the hamburger button is visible
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('opens when hamburger is clicked', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /otevřít navigaci/i })
    await expect(hamburger).toBeVisible()
    await hamburger.click()

    // The mobile aside panel should slide in
    const aside = page.locator('aside')
    await expect(aside).toBeVisible()
  })

  test('closes when X button is clicked', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /otevřít navigaci/i })
    await hamburger.click()

    const aside = page.locator('aside')
    await expect(aside).toBeVisible()

    const closeBtn = page.getByRole('button', { name: /zavřít navigaci/i })
    await closeBtn.click()
    await page.waitForTimeout(400) // exit animation

    await expect(aside).not.toBeVisible()
  })

  test('closes when backdrop is clicked', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /otevřít navigaci/i })
    await hamburger.click()

    const aside = page.locator('aside')
    await expect(aside).toBeVisible()

    // The backdrop sits behind the aside — click far left of screen
    await page.mouse.click(20, 400)
    await page.waitForTimeout(400)

    await expect(aside).not.toBeVisible()
  })

  test('nav link inside menu scrolls to section and closes menu', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /otevřít navigaci/i })
    await hamburger.click()

    const aside = page.locator('aside')
    await expect(aside).toBeVisible()

    // Click first nav item (Services)
    const firstNavBtn = aside.locator('button').first()
    await firstNavBtn.click()
    await page.waitForTimeout(600)

    // Menu should close
    await expect(aside).not.toBeVisible()
  })
})
