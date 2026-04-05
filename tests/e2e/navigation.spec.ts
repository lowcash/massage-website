import { expect, test } from '@playwright/test'

/**
 * Navigation tests — desktop links, hero CTA, mobile menu open/close.
 * Run against a live dev server: npm run dev
 */

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
    const section = document.querySelector(selector)
    const header = document.querySelector('header')
    if (!section || !header) {
      return { canAlign: false, navBottom: 0, tolerance: 0 }
    }

    const offsetValue = getComputedStyle(document.documentElement).getPropertyValue('--navigation-offset').trim()
    const offset = Number.parseFloat(offsetValue) || 70
    const sectionTop = (section as HTMLElement).getBoundingClientRect().top + window.scrollY
    const desiredTop = sectionTop - offset
    const scroller = document.scrollingElement ?? document.documentElement
    const maxScroll = Math.max(0, scroller.scrollHeight - window.innerHeight)
    const navBottom = (header as HTMLElement).getBoundingClientRect().bottom
    return {
      canAlign: desiredTop <= maxScroll + 1,
      navBottom,
      tolerance: window.matchMedia('(min-width: 768px)').matches ? 24 : 30,
    }
  }, sectionSelector)

  await expect
    .poll(async () => section.evaluate((el) => el.getBoundingClientRect().top), { timeout: 8000 })
    .toBeGreaterThanOrEqual(alignmentContext.navBottom - alignmentContext.tolerance)

  if (alignmentContext.canAlign) {
    await expect
      .poll(
        async () => {
          const sectionTop = await section.evaluate((el) => el.getBoundingClientRect().top)
          return sectionTop <= alignmentContext.navBottom + alignmentContext.tolerance * 3
        },
        { timeout: 8000 },
      )
      .toBeTruthy()
  }
}

test.describe('Desktop navigation', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop navigation assertions run only on desktop projects.')

  test.beforeEach(async ({ page }) => {
    await gotoHome(page)
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
      await page.waitForTimeout(1000)
      await expectSectionAlignedUnderHeader(page, getScrollTargetSelector(sectionId))
    })
  }

  test('desktop navigation offset variable stays in expected range', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })

    const offset = await page.evaluate(() => {
      const offsetValue = getComputedStyle(document.documentElement).getPropertyValue('--navigation-offset').trim()
      return Number.parseFloat(offsetValue)
    })

    expect(offset).toBe(70)
  })

  test('hero CTA button scrolls to #services', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    // Use role+name to avoid matching the scroll cue (also links to #services)
    const cta = page.getByRole('link', { name: 'Vyberte si masáž' })
    await expect(cta).toBeVisible()
    await cta.click()

    const servicesSection = page.locator('#services')
    const servicesHeading = page.locator(getScrollTargetSelector('services')).first()

    await expect(servicesSection).toBeInViewport({ ratio: 0.2 })
    await expect(servicesHeading).toBeVisible()

    const overlapsHeader = await page.evaluate(() => {
      const heading = document.querySelector('#services-heading')
      const header = document.querySelector('header')
      if (!heading || !header) return true

      const headingTop = (heading as HTMLElement).getBoundingClientRect().top
      const navBottom = (header as HTMLElement).getBoundingClientRect().bottom
      return headingTop < navBottom - 24
    })

    expect(overlapsHeader).toBe(false)
  })

  test('navbar remains the top layer above light sections and gallery overlay', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })

    const desktopNav = page.locator('header .hidden.lg\\:flex')
    await expect(desktopNav).toBeVisible()

    await desktopNav.locator('button').nth(SECTIONS.indexOf('about')).click()

    await expect(page.locator('#about')).toBeInViewport({ ratio: 0.1 })

    const topPointIsHeader = await page.evaluate(() => {
      const el = document.elementFromPoint(window.innerWidth / 2, 20)
      return Boolean(el?.closest('header'))
    })
    expect(topPointIsHeader).toBe(true)

    await desktopNav.locator('button').nth(SECTIONS.indexOf('studio')).click()

    await expect(page.locator('#studio')).toBeInViewport({ ratio: 0.1 })

    const galleryTrigger = page.locator('button[aria-label^="Zobrazit fotografii"]:visible').first()
    await expect(galleryTrigger).toBeVisible()
    await galleryTrigger.click()

    const dialog = page.getByRole('dialog', { name: 'Náhled fotografie' })
    await expect(dialog).toBeVisible()

    const zIndexValues = await page.evaluate(() => {
      const header = document.querySelector('header')
      const modal = document.querySelector('[role="dialog"][aria-label="Náhled fotografie"]')
      return {
        header: Number.parseInt(getComputedStyle(header as Element).zIndex || '0', 10),
        modal: Number.parseInt(getComputedStyle(modal as Element).zIndex || '0', 10),
      }
    })

    expect(zIndexValues.header).toBeGreaterThan(zIndexValues.modal)
  })
})

test.describe('Mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'Mobile menu assertions run only on mobile projects.')

  test.beforeEach(async ({ page }) => {
    // Use mobile viewport so the hamburger button is visible
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoHome(page)
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
    await expect(aside).toHaveClass(/translate-x-full/)
    await expect(aside).toHaveAttribute('inert', '')
  })

  test('closes when backdrop is clicked', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: /otevřít navigaci/i })
    await hamburger.click()

    const aside = page.locator('aside')
    await expect(aside).toBeVisible()

    // The backdrop sits behind the aside — click far left of screen
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

    // Click first nav item (Services)
    const firstNavBtn = aside.locator('div.flex-1 button[type="button"]').first()
    await firstNavBtn.click()
    await page.waitForTimeout(600)

    // Menu should close
    await expect(aside).toHaveClass(/translate-x-full/)
    await expect(aside).toHaveAttribute('inert', '')

    await expectSectionAlignedUnderHeader(page, getScrollTargetSelector('services'))
  })

  test('mobile navigation offset variable stays in expected range', async ({ page }) => {
    const offset = await page.evaluate(() => {
      const offsetValue = getComputedStyle(document.documentElement).getPropertyValue('--navigation-offset').trim()
      return Number.parseFloat(offsetValue)
    })

    expect(offset).toBe(70)
  })
})
