import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../models/Login'
import { portalUser1 } from '../cms/database/users'

type CustomFixtures = {
  loginPage: LoginPage
}

const test = base.extend<TestingLibraryFixtures & CustomFixtures>({
  ...fixtures,
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
})

const { describe, expect } = test

describe('Toggle light/dark mode', () => {
  test('can toggle light/dark mode', async ({ page, loginPage }) => {
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(
      page.locator(`text=WELCOME, ${portalUser1.displayName}`)
    ).toBeVisible()
    await expect(page.locator('text=DARK MODE')).toBeVisible()

    await page.locator('[data-testid="theme-toggle"]').click()
    await expect(page.locator('text=LIGHT MODE')).toBeVisible()
  })
})
