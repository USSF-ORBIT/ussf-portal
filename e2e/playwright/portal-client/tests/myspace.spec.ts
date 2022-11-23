import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../../models/Login'
import { seedDB } from '../database/seedMongo'

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

test.beforeAll(async () => {
  await seedDB()
})

describe('MySpace', () => {
  test('can login and see MySpace', async ({ page, loginPage }) => {
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()
  })

  test('can toggle light/dark mode', async ({ page, loginPage }) => {
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
    await expect(page.locator('text=DARK MODE')).toBeVisible()

    await page.locator('[data-testid="theme-toggle"]').click()
    await expect(page.locator('text=LIGHT MODE')).toBeVisible()
  })

  test('can add a new custom collection to My Space', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()

    await page.locator('text=Add section').click()
    await page.locator('text=Create new collection').click()
    await page
      .locator('[placeholder="Name this collection"]')
      .fill('Playwright Test Collection')
    await page.locator('text=Save name').click()

    await expect(page.locator('text=Playwright Test Collection')).toBeVisible()
  })
})
