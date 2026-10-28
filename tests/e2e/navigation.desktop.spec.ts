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

test.describe('Desktop navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoHome(page)
  })

  for (const sectionId of SECTIONS) {
    test(`nav link scrolls to #${sectionId}`, async ({ page }) => {
      const desktopNav = page.locator('header .hidden.lg\\:flex')
      await expect(desktopNav).toBeVisible()

      const btn = desktopNav.locator('button').filter({ hasText: new RegExp(sectionId, 'i') })
      const btnCount = await desktopNav.locator('button').count()
      const sectionIndex = SECTIONS.indexOf(sectionId)
      const targetBtn = sectionIndex < btnCount ? desktopNav.locator('button').nth(sectionIndex) : btn

      await targetBtn.click()
      // Smooth scroll to #contact (and other far sections) can exceed a fixed 1s wait on CI.
      await expect.poll(async () => targetBtn.getAttribute('aria-current'), { timeout: 8000 }).toBe('page')
      await expectSectionAlignedUnderHeader(page, getScrollTargetSelector(sectionId))
    })
  }

  test('clicking vouchers marks vouchers as active section', async ({ page }) => {
    const desktopNav = page.locator('header .hidden.lg\\:flex')
    await expect(desktopNav).toBeVisible()

    const vouchersButton = desktopNav.locator('button').nth(SECTIONS.indexOf('vouchers'))
    await vouchersButton.click()

    await expect.poll(async () => vouchersButton.getAttribute('aria-current'), { timeout: 8000 }).toBe('page')
    await expectSectionAlignedUnderHeader(page, getScrollTargetSelector('vouchers'))
  })

  test('desktop navigation offset variable stays in expected range', async ({ page }) => {
    const offset = await page.evaluate(() => {
      const barHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--navigation-bar-height').trim(),
      )

      // Resolve --navigation-offset (may be a calc()) via a probe — custom props stay uncomputed otherwise.
      const probe = document.createElement('div')
      probe.style.scrollMarginTop = 'var(--navigation-offset)'
      document.body.appendChild(probe)
      const resolvedOffset = Number.parseFloat(getComputedStyle(probe).scrollMarginTop)
      probe.remove()

      return { barHeight, resolvedOffset }
    })

    expect(offset.barHeight).toBe(70)
    expect(offset.resolvedOffset).toBe(70)
  })

  test('hero CTA button scrolls to #services', async ({ page }) => {
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

  test('service card click scrolls to #booking with selected service badge', async ({ page }) => {
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

  test('gallery overlay is above navigation and floating controls when lightbox is open', async ({ page }) => {
    const desktopNav = page.locator('header .hidden.lg\\:flex')
    await expect(desktopNav).toBeVisible()

    await desktopNav.locator('button').nth(SECTIONS.indexOf('about')).click()

    await expect(page.locator('#about')).toBeInViewport({ ratio: 0.1 })

    const topPointIsHeader = await page.evaluate(() => {
      const element = document.elementFromPoint(window.innerWidth / 2, 20)
      return Boolean(element?.closest('header'))
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
      const scrollTopButton = document.querySelector('[aria-label="Zpět nahoru"]')
      const whatsappButton = document.querySelector('[aria-label="Kontaktujte mě na WhatsApp"]')

      const toNumber = (element: Element | null) => {
        if (!element) {
          return 0
        }

        const parsed = Number.parseInt(getComputedStyle(element).zIndex || '0', 10)
        return Number.isFinite(parsed) ? parsed : 0
      }

      return {
        header: toNumber(header),
        modal: toNumber(modal),
        scrollTop: toNumber(scrollTopButton),
        whatsapp: toNumber(whatsappButton),
      }
    })

    expect(zIndexValues.modal).toBeGreaterThan(zIndexValues.header)
    expect(zIndexValues.modal).toBeGreaterThan(zIndexValues.scrollTop)
    expect(zIndexValues.modal).toBeGreaterThan(zIndexValues.whatsapp)
  })

  test('active nav updates correctly during manual scroll', async ({ page }) => {
    const desktopNavButtons = page.locator('header .hidden.lg\\:flex button')
    await expect(desktopNavButtons.first()).toBeVisible()

    for (const sectionId of SECTIONS) {
      const sectionIndex = SECTIONS.indexOf(sectionId)

      const targetTop = await page.evaluate((targetId) => {
        const section = document.getElementById(targetId)
        const header = document.querySelector('header') as HTMLElement | null
        if (!section || !header) {
          return null
        }

        const offset = header.getBoundingClientRect().height
        const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - offset + 4)
        window.scrollTo(0, top)
        return top
      }, sectionId)

      expect(targetTop).not.toBeNull()
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual((targetTop as number) - 1)

      await expect
        .poll(async () => desktopNavButtons.nth(sectionIndex).getAttribute('aria-current'), { timeout: 3000 })
        .toBe('page')
    }
  })

  test('URL hash updates to match the active section on scroll', async ({ page }) => {
    await page.waitForLoadState('load')
    // Two-arg scrollTo: html { scroll-behavior: smooth } ignores behavior: 'auto'|'instant' in Chromium.
    const targetTop = await page.evaluate((targetId) => {
      const section = document.getElementById(targetId)
      const header = document.querySelector('header') as HTMLElement | null
      if (!section || !header) return null
      const offset = header.getBoundingClientRect().height
      const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - offset + 4)
      window.scrollTo(0, top)
      return top
    }, 'booking')

    expect(targetTop).not.toBeNull()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual((targetTop as number) - 1)
    await expect.poll(() => page.evaluate(() => window.location.hash), { timeout: 3000 }).toBe('#booking')
  })

  test('URL hash sync on scroll does not jump the viewport', async ({ page }) => {
    await page.waitForLoadState('load')

    // Sit well below the section start so a fragment scroll-to-hash would jump upward.
    const targetTop = await page.evaluate(() => {
      const section = document.getElementById('services')
      const header = document.querySelector('header') as HTMLElement | null
      if (!section || !header) {
        return null
      }

      const offset = header.getBoundingClientRect().height
      const pastStart = section.getBoundingClientRect().top + window.scrollY - offset + 240
      const top = Math.max(0, pastStart)
      window.scrollTo(0, top)
      return top
    })

    expect(targetTop).not.toBeNull()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual((targetTop as number) - 1)

    const scrollBefore = await page.evaluate(() => window.scrollY)
    await expect.poll(() => page.evaluate(() => window.location.hash), { timeout: 3000 }).toBe('#services')

    // Hash sync is deferred until scroll settles; wait a beat for the write + any fragment side-effect.
    await page.waitForTimeout(200)
    const scrollAfter = await page.evaluate(() => window.scrollY)
    expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(8)
  })

  test('URL hash clears when scrolled back to hero', async ({ page }) => {
    await page.waitForLoadState('load')

    const servicesTop = await page.evaluate(() => {
      const section = document.getElementById('services')
      const header = document.querySelector('header') as HTMLElement | null
      if (!section || !header) return null
      const offset = header.getBoundingClientRect().height
      const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - offset + 4)
      window.scrollTo(0, top)
      return top
    })
    expect(servicesTop).not.toBeNull()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual((servicesTop as number) - 1)
    await expect.poll(() => page.evaluate(() => window.location.hash), { timeout: 3000 }).toBe('#services')

    await page.evaluate(() => window.scrollTo(0, 0))
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await expect.poll(() => page.evaluate(() => window.location.hash), { timeout: 3000 }).toBe('')
  })

  test('URL hash sync on scroll does not grow browser history', async ({ page }) => {
    await page.waitForLoadState('load')
    const historyLengthBefore = await page.evaluate(() => window.history.length)

    const targetTop = await page.evaluate(() => {
      const section = document.getElementById('studio')
      const header = document.querySelector('header') as HTMLElement | null
      if (!section || !header) return null
      const offset = header.getBoundingClientRect().height
      const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - offset + 4)
      window.scrollTo(0, top)
      return top
    })

    expect(targetTop).not.toBeNull()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual((targetTop as number) - 1)
    await expect.poll(() => page.evaluate(() => window.location.hash), { timeout: 3000 }).toBe('#studio')

    const historyLengthAfter = await page.evaluate(() => window.history.length)
    expect(historyLengthAfter).toBe(historyLengthBefore)
  })
})
