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

describe('Filter search results', () => {
  test('can build a search query', async ({ page, loginPage }) => {
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()

    await page.goto('http://localhost:3000/search')
    await page.getByText('Application').click()
    await page.getByText('Documentation').click()

    // Add label in here

    // Type in search query
    await page.getByTestId('search-input').fill('Test query')

    await page.getByRole('button', { name: 'Filter' }).click()
    await expect(page.getByTestId('search-input')).toHaveValue(
      'category:application category:documentation Test query'
    )
  })

  test('can filter search results', async ({ page, loginPage }) => {
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()

    await page.goto('http://localhost:3000/search')
    await page.getByText('Application').click()
    await page.getByRole('button', { name: 'Filter' }).click()
    await expect(
      page.getByRole('link', { name: 'MyVector (opens in a new window)' })
    ).toBeVisible()
  })
})
