import { test as base } from '@playwright/test'

import { LoginPage } from '../../models/Login'
import { seedDB } from '../../portal-client/database/seedMongo'
import { defaultUser } from '../database/users'
const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
})

const { describe, expect } = test

test.beforeAll(async () => {
  await seedDB()
})

describe('Navigation', () => {
  test('can access each link in the side bar navigation', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login(defaultUser.username, defaultUser.password)
    await expect(
      page.locator(`text=WELCOME, ${defaultUser.name}`)
    ).toBeVisible()
    await page.goto('/')

    await Promise.all([
      page.waitForNavigation(),
      page.locator('[aria-label="Side Navigation"] >> text=Users').click(),
    ])

    await expect(page.locator('h1:has-text("Users")')).toBeVisible()

    await Promise.all([
      page.waitForNavigation(),
      page.locator('[aria-label="Side Navigation"] >> text=Bookmarks').click(),
    ])

    await expect(page.locator('h1:has-text("Bookmarks")')).toBeVisible()

    await Promise.all([
      page.waitForNavigation(),
      page
        .locator('[aria-label="Side Navigation"] >> text=Collections')
        .click(),
    ])

    await expect(page.locator('h1:has-text("Collections")')).toBeVisible()

    await Promise.all([
      page.waitForNavigation(),
      page
        .locator('[aria-label="Side Navigation"] >> text=USSF Portal')
        .click(),
    ])

    await expect(
      page.locator(`h2:has-text("WELCOME, ${defaultUser.name}")`)
    ).toBeVisible()
  })
})
