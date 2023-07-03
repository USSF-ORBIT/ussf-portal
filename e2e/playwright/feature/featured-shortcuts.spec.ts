import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { adminUser } from '../cms/database/users'
import { LoginPage } from '../models/Login'

type CustomFixtures = {
  loginPage: LoginPage
}

const test = base.extend<TestingLibraryFixtures & CustomFixtures>({
  ...fixtures,
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
})

const { expect } = test

test('can add/remove Featured Shortcuts widget to My Space', async ({
  page,
  loginPage,
}) => {
  // Log in as CMS admin
  await loginPage.login(adminUser.username, adminUser.password)

  await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()

  // Remove Default Featured Shortcuts
  await page.locator('[aria-label="Featured Shortcuts Widget Settings"]').first().click()
  await page.locator('text=Remove Featured Shortcuts widget').click()
  await page.locator('[data-testid="modalFooter"] >> text=Delete').click()

  await expect(page.locator('Featured Apps')).toBeHidden()

  // Add Featured Shortcuts to My Space
  await page.locator('[aria-label="Add widget"]').click()
  await page.locator('text=Add Featured Shortcuts widget').click()

  await expect(page.locator('text=Featured Shortcuts')).toBeVisible()

  // Cannot add Featured Shortcuts twice
  await page.locator('[aria-label="Add widget"]').click()
  const button = page.locator('text=Add Featured Shortcuts widget')
  await expect(button).toBeDisabled()
})
