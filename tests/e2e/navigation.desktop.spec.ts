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
      await page.waitForTimeout(1000)
      await expect(targetBtn).toHaveAttribute('aria-current', 'page')
      await expectSectionAlignedUnderHeader(page, getScrollTargetSelector(sectionId))
    })
  }

  test('clicking vouchers marks vouchers as active section', async ({ page }) => {
    const desktopNav = page.locator('header .hidden.lg\\:flex')
    await expect(desktopNav).toBeVisible()

    const vouchersButton = desktopNav.locator('button').nth(SECTIONS.indexOf('vouchers'))
    await vouchersButton.click()

    await expect(vouchersButton).toHaveAttribute('aria-current', 'page')
    await expectSectionAlignedUnderHeader(page, getScrollTargetSelector('vouchers'))
  })

  test('desktop navigation offset variable stays in expected range', async ({ page }) => {
    const offset = await page.evaluate(() => {
      const offsetValue = getComputedStyle(document.documentElement).getPropertyValue('--navigation-offset').trim()
      return Number.parseFloat(offsetValue)
    })

    expect(offset).toBe(70)
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
    await serviceCard.scrollIntoViewIfNeeded()
    await expect(serviceCard).toBeVisible()

    const serviceName = (await serviceCard.locator('h3').textContent())?.trim()
    await serviceCard.click()

    await expect(page).toHaveURL(/#booking$/)
    await expectSectionAlignedUnderHeader(page, getScrollTargetSelector('booking'))
    await expect(page.locator('#booking span.font-medium')).toContainText(serviceName ?? '')
  })

  test('navbar remains the top layer above light sections and gallery overlay', async ({ page }) => {
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
      return {
        header: Number.parseInt(getComputedStyle(header as Element).zIndex || '0', 10),
        modal: Number.parseInt(getComputedStyle(modal as Element).zIndex || '0', 10),
      }
    })

    expect(zIndexValues.header).toBeGreaterThan(zIndexValues.modal)
  })

  test('active nav updates correctly during manual scroll', async ({ page }) => {
    const desktopNavButtons = page.locator('header .hidden.lg\\:flex button')
    await expect(desktopNavButtons.first()).toBeVisible()

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
        .poll(async () => desktopNavButtons.nth(sectionIndex).getAttribute('aria-current'), { timeout: 3000 })
        .toBe('page')
    }
  })
})
