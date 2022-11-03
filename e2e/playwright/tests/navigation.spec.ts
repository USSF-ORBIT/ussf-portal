import { test as base } from '@playwright/test'

import { LoginPage } from '../models/Login'

const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
})

const { describe, expect } = test

describe('Navigation', () => {
  test('can access each link in the side bar navigation', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login('cmsuser', 'cmsuserpass')
    await expect(page.locator('text=WELCOME, JOHN HENKE')).toBeVisible()
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
      page.locator('h2:has-text("WELCOME, JOHN HENKE")')
    ).toBeVisible()
  })
})
