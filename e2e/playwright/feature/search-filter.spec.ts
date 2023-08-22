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

describe('Filter search results', () => {
  test('can build a search query', async ({ page, loginPage }) => {
    const label = faker.lorem.words()

    await loginPage.login(adminUser.username, adminUser.password)
    await expect(page.locator('text=WELCOME, FLOYD')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as FLOYD.KING.376144527@testusers.cce.af.mil'
      )
    ).toBeVisible()

    /* Create a label from the Labels page */
    await page
      .getByRole('navigation', { name: 'Side Navigation' })
      .getByRole('link', { name: 'Labels' })
      .click()

    await page.getByRole('link', { name: 'Create Label' }).click()
    await page.getByLabel('Name').click()
    await page.getByLabel('Name').fill(label)
    await page.locator('.css-ackcql').click()
    await page.getByText('Audience', { exact: true }).click()
    await page.getByRole('button', { name: 'Create Label' }).click()

    await expect(page.getByText('Created By')).toBeVisible()

    /* Navigate back to the portal and the /search page */
    await page.goto('http://localhost:3000/search')

    /* Enter a search query */
    await page.getByTestId('search-input').fill('Test query')

    /* Select filter options */
    await page.getByTestId('fieldset').getByText('News').click()
    await page.getByTestId('label-dropdown').selectOption(label)

    await page.getByRole('button', { name: 'Filter' }).click()
    await expect(page.getByTestId('search-input')).toHaveValue(
      `label:"${label}" category:news Test query`
    )
  })

  test('can filter search results', async ({ page, loginPage }) => {
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()

    await page.goto('http://localhost:3000/search')
    await page.getByTestId('fieldset').getByText('Application').click()
    await page.getByRole('button', { name: 'Filter' }).click()
    await expect(
      page.getByRole('link', { name: 'MyVector (opens in a new window)' })
    ).toBeVisible()
  })
})
