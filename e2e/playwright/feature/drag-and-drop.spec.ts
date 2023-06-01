import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../models/Login'
import { seedDB } from '../portal-client/database/seedMongo'
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

test.beforeAll(async () => {
  await seedDB()
})

describe('Drag and drop feature', () => {
  test('can use the keyboard to drag and drop a bookmark', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    const dragHandle = page
      .getByRole('listitem')
      .filter({ hasText: 'Webmail(opens in a new window)' })
      .getByRole('button', { name: 'Drag Handle' })

    const dragTo = page
      .getByRole('listitem')
      .filter({
        hasText: 'MyPay(opens in a new window)',
      })
      .getByRole('button', { name: 'Drag Handle' })

    await dragHandle.hover()
    await page.mouse.down()
    await dragTo.hover()
    await page.mouse.up()

    await expect(
      page.locator('ol > li > div > div > div > a').first()
    ).toHaveText('MyPay(opens in a new window)')
  })
})
