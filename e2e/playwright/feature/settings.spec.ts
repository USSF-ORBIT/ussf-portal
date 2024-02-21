import { test as base } from '@playwright/test'
import { faker } from '@faker-js/faker'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../models/Login'
import { portalUser1, adminUser } from '../cms/database/users'

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

describe('Settings page', () => {
  test('can see userId and copy it to clipboard', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login(adminUser.username, adminUser.password)
    await expect(page.locator('text=WELCOME, FLOYD')).toBeVisible()
    await page.getByTestId('editName').click()
    await expect(
      page.getByText(`Your user id is: ${adminUser.userId}`)
    ).toBeVisible()
    await page.getByRole('button', { name: 'Copy To Clipboard' }).click()
    await expect(page.getByText('Copied!')).toBeVisible()

    // Read the content of the clipboard
    const clipboardContent = await page.evaluate(
      'navigator.clipboard.readText()'
    )
    expect(clipboardContent).toEqual(adminUser.userId)

    // Button should revert to original text
    await expect(page.getByText('Copied!')).toBeHidden()
    await expect(page.getByText('Copy To Clipboard')).toBeVisible()

    // logout of portal user
    await page.locator('[data-testid="nav_logout"]').click()
  })
})
