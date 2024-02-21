import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { LoginPage } from '../models/Login'
import { seedDB } from '../portal-client/database/seedMongo'
import { adminUser } from '../cms/database/users'

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

describe('Site header', () => {
  test('can create a Site Header and interact with it in the portal', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login(adminUser.username, adminUser.password)
    await expect(page.locator(`text=WELCOME, ${adminUser.name}`)).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Create a new Site Header
    await page.goto('http://localhost:3001/')
    await page
      .getByRole('main')
      .getByRole('link', { name: 'Site Header' })
      .click()
    await expect(page.locator(`text=${adminUser.userId}`)).toBeVisible()
    expect(page.url()).toBe('http://localhost:3001/site-header/1')
    await page.getByRole('link', { name: 'Create Site Header' }).click()
    expect(page.url()).toBe('http://localhost:3001/site-header/create')
    await page.getByLabel('Header button label').click()
    await page.getByLabel('Header button label').fill('News')
    await page.getByLabel('Header button source').click()
    await page.getByLabel('Header button source').fill('/news')
    await page.getByLabel('Header dropdown label').click()
    await page.getByLabel('Header dropdown label').fill('Dropdown')
    await page.getByLabel('Dropdown item 1 label').click()
    await page.getByLabel('Dropdown item 1 label').fill('Settings')
    await page.getByLabel('Dropdown item 1 source').click()
    await page.getByLabel('Dropdown item 1 source').fill('/settings')
    await page.getByLabel('Dropdown item 2 label').click()
    await page.getByLabel('Dropdown item 2 label').fill('Landing Pages')
    await page.getByLabel('Dropdown item 2 source').click()
    await page.getByLabel('Dropdown item 2 source').fill('/landing')
    await page.getByRole('button', { name: 'Create Site Header' }).click()

    // Go to the portal and interact with the Site Header
    await page.getByRole('link', { name: 'USSF Portal' }).click()
    expect(page.url()).toBe('http://localhost:3000/')
    await page.getByTestId('nav-header-dropdown').click()
    await page.getByTestId('nav-dropdown-item-0').click()
    expect(page.url()).toBe('http://localhost:3000/settings')
    await expect(
      page.getByTestId('header').getByRole('link', { name: 'News' })
    ).toBeVisible()
  })
})
