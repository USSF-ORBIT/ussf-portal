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

const routes = [
  { route: '/', title: 'My Space - USSF Portal' },
  {
    route: '/sites-and-applications',
    title: 'Sites & Applications - USSF Portal',
  },
  { route: '/about-us', title: 'About Us - USSF Portal' },
  { route: '/about-us/orbit-blog', title: 'Orbit Blog - USSF Portal' },
  { route: '/news', title: 'Internal News - USSF Portal' },
  { route: '/announcements', title: 'Latest Announcements - USSF Portal' },
  { route: '/settings', title: 'Settings - USSF Portal' },
  { route: '/ussf-documentation', title: 'Documentation - USSF Portal' },
]

test.beforeAll(async () => {
  await seedDB()
})

describe('Unique page titles', () => {
  describe('access while logged in', () => {
    test('renders correct page title per page', async ({ page, loginPage }) => {
      await loginPage.login(portalUser1.username, portalUser1.password)
      await expect(
        page.locator(`text=WELCOME, ${portalUser1.displayName}`)
      ).toBeVisible()

      // Check that correct page title renders for each route
      for (const route of routes) {
        await page.goto(route.route)
        await page.waitForLoadState('load')
        await expect(page).toHaveURL(`http://localhost:3000${route.route}`)
        await expect(page).toHaveTitle(route.title)
      }
    })
  })
})
