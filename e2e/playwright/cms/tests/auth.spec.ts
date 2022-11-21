import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../models/Login'
import { resetDb, seedRevokeUsers, seedGrantUsers } from '../database/seed'

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
})

test.afterAll(async () => {
  await resetDb()
})

describe('Authentication', () => {
  test('redirects a user to the portal log in page if not logged in', async ({
    page,
    context,
  }) => {
    await context.clearCookies()

    await page.goto('/')

    await expect(page.url()).toBe(
      'http://localhost:3000/login?redirectTo=http%3A%2F%2Flocalhost%3A3001%2F'
    )
    await expect(page.locator('h1')).toHaveText('Space Force Portal Login')
  })

  test('can log in as a CMS user', async ({ page, loginPage }) => {
    await loginPage.login('cmsuser', 'cmsuserpass')

    await expect(page.locator('text=WELCOME, JOHN HENKE')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as JOHN.HENKE.562270783@testusers.cce.af.mil'
      )
    ).toBeVisible()

    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 1 item'
    )

    await loginPage.logout()
  })

  test('can log in as a CMS admin', async ({ page, loginPage }) => {
    await loginPage.login('cmsadmin', 'cmsadminpass')

    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as FLOYD.KING.376144527@testusers.cce.af.mil'
      )
    ).toBeVisible()

    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 2 items'
    )

    await loginPage.logout()
  })

  test('cannot log in as a user with no CMS access', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login('user1', 'user1pass')

    await expect(
      page.locator('text=WELCOME, BERNADETTE CAMPBELL')
    ).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator("text=You don't have access to this page.")
    ).toBeVisible()
  })

  test('logging in as a user who previously had CMS access but now does not syncs their state', async ({
    page,
    loginPage,
  }) => {
    await seedRevokeUsers()

    // Verify previous state as admin user
    await loginPage.login('cmsadmin', 'cmsadminpass')
    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 3 items'
    )
    await page.locator('a:has-text("Users 3 items")').click()

    // RONALD BOYD is enabled but should not be
    await expect(
      page.locator('tr:has-text("RONALD BOYD") td:nth-child(5)')
    ).toHaveText('False')
    await expect(
      page.locator('tr:has-text("RONALD BOYD") td:nth-child(6)')
    ).toHaveText('True')

    await loginPage.logout()

    // Login as user with no access
    await loginPage.login('user2', 'user2pass')
    await expect(page.locator('text=WELCOME, RONALD BOYD')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.url()).toContain('/no-access')
    await expect(
      page.locator("text=You don't have access to this page.")
    ).toBeVisible()

    // Verify new state as admin user
    await loginPage.login('cmsadmin', 'cmsadminpass')
    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 3 items'
    )
    await page.locator('a:has-text("Users 3 items")').click()

    // RONALD BOYD is now disabled
    await expect(
      page.locator('tr:has-text("RONALD BOYD") td:nth-child(5)')
    ).toHaveText('False')
    await expect(
      page.locator('tr:has-text("RONALD BOYD") td:nth-child(6)')
    ).toHaveText('False')
  })

  test('logging in as a user who previously had CMS admin access but now does not syncs their state', async ({
    page,
    loginPage,
  }) => {
    await seedRevokeUsers()

    // Verify previous state as admin user
    await loginPage.login('cmsadmin', 'cmsadminpass')
    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 3 items'
    )
    await page.locator('a:has-text("Users 3 items")').click()

    // JOHN HENKE is admin but should not be
    await expect(
      page.locator('tr:has-text("JOHN HENKE") > td:nth-child(5)')
    ).toHaveText('True')
    await expect(
      page.locator('tr:has-text("JOHN HENKE") td:nth-child(6)')
    ).toHaveText('True')

    await loginPage.logout()

    // Login as non admin user
    await loginPage.login('cmsuser', 'cmsuserpass')
    await expect(page.locator('text=WELCOME, JOHN HENKE')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as JOHN.HENKE.562270783@testusers.cce.af.mil'
      )
    ).toBeVisible()
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 1 item'
    )
    await loginPage.logout()

    // Verify new state as admin user
    await loginPage.login('cmsadmin', 'cmsadminpass')
    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 3 items'
    )
    await page.locator('a:has-text("Users 3 items")').click()

    // JOHN HENKE is no longer an admin
    await expect(
      page.locator('tr:has-text("JOHN HENKE") > td:nth-child(5)')
    ).toHaveText('False')
    await expect(
      page.locator('tr:has-text("JOHN HENKE") td:nth-child(6)')
    ).toHaveText('True')
  })

  test('logging in as a CMS admin who was not an admin previously syncs their state', async ({
    page,
    loginPage,
  }) => {
    await seedGrantUsers()

    await loginPage.login('cmsadmin', 'cmsadminpass')
    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 2 items'
    )
    await page.locator('a:has-text("Users 2 items")').click()
  })

  test('logging in as a CMS user who had no access previously syncs their state', async ({
    page,
    loginPage,
  }) => {
    await seedGrantUsers()

    await loginPage.login('cmsuser', 'cmsuserpass')
    await expect(page.locator('text=WELCOME, JOHN HENKE')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 1 item'
    )
    await page.locator('a:has-text("Users 1 item")').click()
  })
})
