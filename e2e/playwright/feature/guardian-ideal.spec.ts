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

test('can add/remove Guardian Ideal section to My Space', async ({
  page,
  loginPage,
}) => {
  // Log in as CMS admin
  await loginPage.login(adminUser.username, adminUser.password)

  await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()

  // Remove Guardian Ideal
  await page.locator('[aria-label="Section Settings"]').last().click()
  await page.locator('text=Remove Guardian Ideal section').click()
  await page.locator('[data-testid="modalFooter"] >> text=Delete').click()

  await expect(
    page.locator('text=Connect in a Collaborative Environment')
  ).toBeHidden()

  // Add Guardian Ideal to My Space
  await page.locator('[aria-label="Add section"]').click()
  await page.locator('text=Add Guardian Ideal section').click()

  await expect(
    page.locator('text=Connect in a Collaborative Environment')
  ).toBeVisible()
})
