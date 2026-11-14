import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm run build && pnpm run preview:e2e',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 240000,
    env: {
      SITE_ENV: 'production',
      REDIS_URL: process.env.REDIS_URL ?? process.env.E2E_REDIS_URL ?? '',
      AUTH_USERNAME: process.env.AUTH_USERNAME ?? process.env.E2E_ADMIN_USER ?? '',
      AUTH_PASSWORD: process.env.AUTH_PASSWORD ?? process.env.E2E_ADMIN_PASSWORD ?? '',
      JWT_SECRET: process.env.JWT_SECRET ?? '',
    },
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/*.mobile.spec.ts'],
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
      testIgnore: ['**/*.desktop.spec.ts'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      testIgnore: ['**/*.desktop.spec.ts'],
    },
  ],
})
