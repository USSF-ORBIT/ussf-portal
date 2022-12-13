import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../models/Login'
import { resetDb } from '../cms/database/seed'
import { seedDB } from '../portal-client/database/seedMongo'

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
  await resetDb()
  await seedDB()
})

describe('Drag and drop feature', () => {
  test('can use the keyboard to drag and drop a bookmark', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Use keyboard to drag and drop
    await page.locator('[aria-label="Drag Handle"]').first().focus()
    await expect(
      page.locator('[aria-label="Drag Handle"]').first()
    ).toBeFocused()
    await page.keyboard.press('Space')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Space')
    await expect(
      page.locator('ol > li > div > div > div > a').first()
    ).toHaveText('MyPay(opens in a new window)')

    // An attempt was made to create a test that uses the mouse and click events
    // to perform the same action, but Playwright doesn't like the drag and drop
    // library that we are using :(
  })
})
