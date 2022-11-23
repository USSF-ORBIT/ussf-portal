import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../../models/Login'
import { seedDB } from '../database/seedMongo'

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

describe('MySpace', () => {
  test('can toggle light/dark mode', async ({ page, loginPage }) => {
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
    await expect(page.locator('text=DARK MODE')).toBeVisible()

    await page.locator('[data-testid="theme-toggle"]').click()
    await expect(page.locator('text=LIGHT MODE')).toBeVisible()
  })

  test('can add a new custom collection to My Space', async ({
    page,
    loginPage,
  }) => {
    // Login
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()

    // Create a custom collection
    await page.locator('text=Add section').click()
    await page.locator('text=Create new collection').click()
    await page
      .locator('[placeholder="Name this collection"]')
      .fill('Playwright Test Collection')
    await page.locator('text=Save name').click()
    await expect(page.locator('text=Playwright Test Collection')).toBeVisible()
  })

  test('can hide links from an existing collection', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Remove Webmail and undo
    await expect(
      page.locator('text=Webmail(opens in a new window)')
    ).toBeVisible()
    await page.locator('[aria-label="Remove this link"]').first().click()
    await expect(
      page.locator('text=Webmail(opens in a new window)')
    ).toBeHidden()
    await page.locator('text=Undo remove').click()
    await expect(
      page.locator('text=Webmail(opens in a new window)')
    ).toBeVisible()
  })

  test('can add existing links to an existing collection', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Open dropdown and select an existing bookmark and click it
    await page.locator('text=+ Add link').first().click()
    await page.locator('[data-testid="combo-box-toggle"]').click()
    await expect(page.locator('li:has-text("ACPINS")')).toBeVisible()
    await page.locator('li:has-text("ACPINS")').click()

    // Check that dropdown is hidden and there is a new bookmark
    await expect(page.locator('[data-testid="combo-box-toggle"]')).toBeHidden()
    await expect(
      page.locator('text=ACPINS(opens in a new window)')
    ).toBeVisible()
  })

  test('can add custom links to an existing collection', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Open dropdown and select the 'Add custom link' option and click it
    await page.locator('text=+ Add link').first().click()
    await page.locator('[data-testid="combo-box-toggle"]').click()
    await page.locator('[data-testid="combo-box-option-custom"]').click()

    // Modal
    await expect(page.locator('#bookmarkLabel >> nth=0')).toBeVisible()
    await page.locator('#bookmarkLabel').first().fill('My Custom Link')
    await page.locator('#bookmarkUrl').first().fill('google.com')
    await page
      .locator('.usa-form > .usa-button-group > li > .usa-button')
      .first()
      .click()

    // Check that custom link is in the collection
    await expect(
      page.locator('text=My Custom Link(opens in a new window)')
    ).toBeVisible()
  })
})
