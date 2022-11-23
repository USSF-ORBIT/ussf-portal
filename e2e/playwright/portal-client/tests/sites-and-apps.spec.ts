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

describe('Sites & Applications', () => {
  test('can visit the Sites & Applications page', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()

    await page.locator('text=All sites & applications').click()
    await expect(
      page.locator('h2:has-text("Sites & Applications")')
    ).toBeVisible()

    await expect(page.locator('text=Personnel & Administration')).toBeVisible()
    await expect(page.locator('text=Finance & Travel')).toBeVisible()
    await expect(page.locator('text=Public Military Websites')).toBeVisible()

    // Toggle sorting
    await page.locator('text=Sort alphabetically').click()
    await expect(page.locator('text=Sort alphabetically')).toBeDisabled()
    await expect(
      page.locator(
        'text=Provides direct Civil Engineer information management support to active Air Force units, the Air National Guard, and the Air Force Reserve, during peace and war, at fixed main bases, bare bases, and deployed locations.'
      )
    ).toBeVisible()

    await page.locator('text=Sort by type').click()
    await expect(page.locator('text=Sort by type')).toBeDisabled()
    await expect(
      page.locator(
        'text=Provides direct Civil Engineer information management support to active Air Force units, the Air National Guard, and the Air Force Reserve, during peace and war, at fixed main bases, bare bases, and deployed locations.'
      )
    ).toBeHidden()
  })
})
