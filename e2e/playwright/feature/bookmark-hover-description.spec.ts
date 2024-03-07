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

describe('Hovering over a bookmark in MySpace', () => {
  test('can see info tooltip with bookmark description', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.getByTestId('personal-data')).toHaveText(
      `Welcome, ${portalUser1.displayName}`
    )

    await page.locator('text=vMPF').first().hover()
    await page.locator('[data-testid="triggerElement"]').hover()
    await expect(
      page.locator('text=View your deployment band and other MPF information.')
    ).toBeVisible()
  })
})

describe('Hovering over a bookmark in Sites and Applications', () => {
  test('can see info tooltip with bookmark description', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.getByTestId('personal-data')).toHaveText(
      `Welcome, ${portalUser1.displayName}`
    )

    // Navigate to /sites-and-applications using the side nav
    await page.locator('text=All sites & applications').click()
    await expect(
      page.getByRole('heading', { name: 'Sites & Applications By type' })
    ).toBeVisible()

    await page.locator('text=vMPF').first().hover()
    await page.locator('[data-testid="triggerElement"]').hover()
    await expect(
      page.locator('text=View your deployment band and other MPF information.')
    ).toBeVisible()
  })
})
