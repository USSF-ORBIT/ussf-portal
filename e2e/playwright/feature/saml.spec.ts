import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../models/Login'
import { seedDB } from '../portal-client/database/seedMongo'
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

test.beforeAll(async () => {
  await seedDB()
})

describe('SAML flow (with test IdP)', () => {
  test('User flow', async ({ page, loginPage }) => {
    // If user is not logged in, a request to /api/auth/user should return null
    const response = await page.request.get('/api/auth/user')
    expect(response.status()).toBe(401)

    // Logged in user visits /api/auth/login and is redirected to /
    await loginPage.login(portalUser1.username, portalUser1.password)
    await page.request.get('/api/auth/login')

    // Request logged in user
    const authenticatedResponse = await page.request.get('/api/auth/user')
    expect(authenticatedResponse.status()).toBe(200)

    // Log out
    await Promise.all([
      page.waitForResponse('/api/auth/logout'),
      page.route('**/simplesaml/saml2/idp/SingleLogoutService.php*', (route) =>
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
