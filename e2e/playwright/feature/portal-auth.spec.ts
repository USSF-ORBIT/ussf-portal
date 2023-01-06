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

const routes = [
  '/',
  '/sites-and-applications',
  '/about-us',
  '/about-us/orbit-blog',
  '/news',
  '/news-announcements',
  '/search',
  '/settings',
  '/ussf-documentation',
]

test.beforeAll(async () => {
  await resetDb()
  await seedDB()
})

describe('Portal authentication', () => {
  describe('access without being logged in', () => {
    test('requires a user to be logged in to view the portal routes', async ({
      page,
      loginPage,
    }) => {
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

  describe('logging in', () => {
    test('a user can log into and out of the portal', async ({
      page,
      loginPage,
    }) => {
      await page.goto(loginPage.loginUrl)
      await expect(loginPage.loginButton).toBeVisible()

      await loginPage.login('user1', 'user1pass')
      await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()

      await Promise.all([
        page.waitForResponse('/api/auth/logout'),
        page.route(
          '**/simplesaml/saml2/idp/SingleLogoutService.php*',
          (route) =>
            route.fulfill({
              status: 200,
              body: 'Logged out',
            })
        ),
        page.locator('li:has-text("Log out")').click(),
      ])

      await page.goto('/')
      await expect(page).toHaveURL('http://localhost:3000/login')
    })
  })

  describe('access while logged in', () => {
    test('loads the user on each route', async ({ page, loginPage }) => {
      await loginPage.login('user1', 'user1pass')
      await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()

      // Check that logged in user can visit each url
      for (const url of routes) {
        await page.goto(url)
        await page.waitForLoadState('load')
        await expect(page).toHaveURL(`http://localhost:3000${url}`)
      }
    })
  })
})
