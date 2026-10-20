/**
 * Credential rules for the admin login, tested directly (no server). The placeholder password from .env.example
 * must work for a local `pnpm dev` and be refused everywhere else.
 */
import { expect, test } from '@playwright/test'

import { credentialsAreValid } from '../../lib/security/admin-credentials'

const PLACEHOLDER = 'your_admin_password_here'

test.describe('credentialsAreValid', () => {
  test('the .env.example placeholder works in development so a copied .env.example logs in locally', () => {
    const env = { AUTH_USERNAME: 'admin', AUTH_PASSWORD: PLACEHOLDER, NODE_ENV: 'development' }

    expect(credentialsAreValid('admin', PLACEHOLDER, env)).toBe(true)
    expect(credentialsAreValid('admin', 'something-else', env)).toBe(false)
    expect(credentialsAreValid('root', PLACEHOLDER, env)).toBe(false)
  })

  test('the placeholder is refused in production, in preview builds and when NODE_ENV is unknown', () => {
    for (const NODE_ENV of ['production', 'test', undefined]) {
      const env = { AUTH_USERNAME: 'admin', AUTH_PASSWORD: PLACEHOLDER, NODE_ENV }
      expect(credentialsAreValid('admin', PLACEHOLDER, env), `NODE_ENV=${NODE_ENV}`).toBe(false)
    }
  })

  test('a real password works everywhere and a wrong one never does', () => {
    for (const NODE_ENV of ['production', 'development']) {
      const env = { AUTH_USERNAME: 'admin', AUTH_PASSWORD: 'long-random-password:with-colon', NODE_ENV }

      expect(credentialsAreValid('admin', 'long-random-password:with-colon', env)).toBe(true)
      expect(credentialsAreValid('admin', 'long-random-password', env)).toBe(false)
      expect(credentialsAreValid('admin', '', env)).toBe(false)
    }
  })

  test('missing configuration never matches, not even empty credentials', () => {
    expect(credentialsAreValid('', '', { NODE_ENV: 'development' })).toBe(false)
    expect(credentialsAreValid('admin', PLACEHOLDER, { AUTH_USERNAME: 'admin', NODE_ENV: 'development' })).toBe(false)
    expect(credentialsAreValid('admin', 'x', { AUTH_PASSWORD: 'x', NODE_ENV: 'development' })).toBe(false)
  })
})
