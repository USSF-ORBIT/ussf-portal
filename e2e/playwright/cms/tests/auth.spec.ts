import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../../models/Login'
import {
  adminUser,
  defaultUser,
  portalUser1,
  portalUser2,
} from '../database/users'
import { createOrUpdateUsers } from '../database/seed'
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

describe('Authentication', () => {
  test('redirects a user to the portal log in page if not logged in', async ({
    page,
    context,
  }) => {
    await context.clearCookies()

    await page.goto('/')

    expect(page.url()).toBe(
      'http://localhost:3000/login?redirectTo=http%3A%2F%2Flocalhost%3A3001%2F'
    )
    await expect(page.locator('h1')).toHaveText('Space Force Portal Login')
  })

  test('can log in as a CMS user', async ({ page, loginPage }) => {
    await loginPage.login(defaultUser.username, defaultUser.password)

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
    await loginPage.login(adminUser.username, adminUser.password)

    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as FLOYD.KING.376144527@testusers.cce.af.mil'
      )
    ).toBeVisible()

    await loginPage.logout()
  })

  test('cannot log in as a user with no CMS access', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login(portalUser1.username, portalUser1.password)

    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator("text=You don't have access to this page.")
    ).toBeVisible()
  })

  test('logging in as a user who previously had CMS access but now does not', async ({
    page,
    loginPage,
  }) => {
    // Test Case: Make sure the SAML permissions take precedent.
    // Create portalUser RONALD BOYD in CMS database with `isEnabled = true`.
    // Log in as adminUser and verify RONALD BOYD `isEnabled = true`.
    // Log in as RONALD BOYD and verify No Access.
    // The database state will sync with SAML permissions, and `isEnabled = false`.

    await createOrUpdateUsers([portalUser2])

    // Verify isEnabled state as admin user
    await loginPage.login(adminUser.username, adminUser.password)
    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 5 items'
    )
    await page.locator('a:has-text("Users 5 items")').click()

    // RONALD BOYD is enabled but should not be
    await expect(
      page.locator('tr:has-text("RONALD BOYD") td:nth-child(5)')
    ).toHaveText('False')
    await expect(
      page.locator('tr:has-text("RONALD BOYD") td:nth-child(6)')
    ).toHaveText('True')

    await loginPage.logout()

    // Login as RONALD BOYD
    // Expected: No Access
    await loginPage.login(portalUser2.username, portalUser2.password)
    await expect(page.locator('text=WELCOME, RONNY')).toBeVisible()
    await page.goto('http://localhost:3001')
    expect(page.url()).toContain('/no-access')
    await expect(
      page.locator("text=You don't have access to this page.")
    ).toBeVisible()

    // Verify updated state as admin user
    await loginPage.login(adminUser.username, adminUser.password)
    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 5 items'
    )
    await page.locator('a:has-text("Users 5 items")').click()

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
    // Test Case: Make sure the SAML permissions take precedent.
    // Update defaultUser JOHN HENKE in CMS database with `isAdmin = true`.
    // Log in as adminUser FLOYD KING and verify `isAdmin = true` status.
    // Log in as defaultUser JOHN HENKE and verify no admin access.
    // The database state will sync with SAML permissions, and  defaultUser `isAdmin = false`.

    // Erroneously set defaultUser to be an admin
    await createOrUpdateUsers([{ ...defaultUser, isAdmin: true }])

    // Verify previous state as admin user
    await loginPage.login(adminUser.username, adminUser.password)
    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 5 items'
    )
    await page.locator('a:has-text("Users 5 items")').click()

    // JOHN HENKE is admin but should not be
    await expect(
      page.locator('tr:has-text("JOHN HENKE") > td:nth-child(5)')
    ).toHaveText('True')
    await expect(
      page.locator('tr:has-text("JOHN HENKE") td:nth-child(6)')
    ).toHaveText('True')

    await loginPage.logout()

    // Login as JOHN HENKE
    await loginPage.login(defaultUser.username, defaultUser.password)
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
    await loginPage.login(`${adminUser.username}`, `${adminUser.password}`)
    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 5 items'
    )
    await page.locator('a:has-text("Users 5 items")').click()

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
    // Test Case: Make sure the SAML permissions take precedent.
    // Update adminUser FLOYD KING in CMS database with `isAdmin = false`.
    // Log in as adminUser FLOYD KING
    // The database state will sync with SAML permissions and set `isAdmin = true`.

    await createOrUpdateUsers([{ ...adminUser, isAdmin: false }])

    await loginPage.login(adminUser.username, adminUser.password)
    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 5 items'
    )
    await page.locator('a:has-text("Users 5 items")').click()
  })

  test('logging in as a CMS user who had no access previously syncs their state', async ({
    page,
    loginPage,
  }) => {
    // Test Case: Make sure the SAML permissions take precedent.
    // Update defaultUser JOHN HENKE in CMS database with `isEnabled = false`.
    // Log in as adminUser and verify JOHN HENKE `isEnabled = false` status.
    // Log in as defaultUser JOHN HENKE and verify access.
    // The database state will sync with SAML permissions, and `isEnabled = true`.
    await createOrUpdateUsers([{ ...defaultUser, isEnabled: false }])

    await loginPage.login(defaultUser.username, defaultUser.password)
    await expect(page.locator('text=WELCOME, JOHN HENKE')).toBeVisible()
    await page.goto('http://localhost:3001')
    await expect(page.locator('main div:has(h3:has-text("Users"))')).toHaveText(
      'Users 1 item'
    )
    await page.locator('a:has-text("Users 1 item")').click()
  })
})
