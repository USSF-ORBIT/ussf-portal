import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../models/Login'
import { resetDb } from '../cms/database/seed'
import { seedDB } from '../portal-client/database/seedMongo'

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
  await resetDb()
  await seedDB()
})

describe('Portal authentication', () => {
  test('requires a user to be logged in to view the portal routes', async ({
    page,
    loginPage,
  }) => {
    const routes = [
      '/',
      '/sites-and-applications',
      '/about-us',
      '/news',
      '/news-announcements',
      '/search',
      '/settings',
      '/ussf-documentation',
    ]

    // Navigate to portal login page
    await page.goto(loginPage.loginUrl)
    await expect(loginPage.loginButton).toBeVisible()

    // Check that each route redirects to /login
    for (const url of routes) {
      await page.goto(url)
      await page.waitForLoadState('domcontentloaded')
      await expect(page).toHaveURL('http://localhost:3000/login')
    }
  })
})
