import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../../models/Login'
import { seedDB } from '../database/seedMongo'
import { portalUser1 } from '../../cms/database/users'
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

const waitFor = (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

test.beforeAll(async () => {
  await seedDB()
})

describe('MySpace', () => {
  test('can add a new custom collection to My Space', async ({
    page,
    loginPage,
  }) => {
    // Login
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(
      page.locator(`text=WELCOME, ${portalUser1.displayName}`)
    ).toBeVisible()

    // Create a custom collection
    await page.locator('text=Add widget').click()
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
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(
      page.locator(`text=WELCOME, ${portalUser1.displayName}`)
    ).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Remove Webmail and undo
    await expect(
      page.locator('text=Webmail(opens in a new window)')
    ).toBeVisible()
    await page.locator('[aria-label="remove Webmail from collection"]').click()
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
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(
      page.locator(`text=WELCOME, ${portalUser1.displayName}`)
    ).toBeVisible()
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

  test('can add/edit/delete custom links in an existing collection', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(
      page.locator(`text=WELCOME, ${portalUser1.displayName}`)
    ).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Open dropdown and select the 'Add custom link' option and click it
    await page.locator('text=+ Add link').first().click()
    await page.locator('[data-testid="combo-box-input"]').click()
    await page
      .locator('[data-testid="combo-box-input"]')
      .fill('Test Custom Link')
    await page.locator('[data-testid="combo-box-option-custom"]').click()

    await page
      .locator('[placeholder="https\\:\\/\\/www\\.copy-paste-your-url\\.com"]')
      .click()
    await page
      .locator('[placeholder="https\\:\\/\\/www\\.copy-paste-your-url\\.com"]')
      .fill('example.com')
    await page.locator('text=Save custom link').click()

    // Check that custom link is in the collection
    await expect(
      page.locator('text=Test Custom Link(opens in a new window)')
    ).toBeVisible()

    // Edit custom link
    await page.locator('[aria-label="edit Test Custom Link bookmark"]').click()
    await page.locator('[placeholder="Example link name"]').click()
    await page
      .locator('[placeholder="Example link name"]')
      .fill('Updated Custom Link')
    await page.locator('text=Save custom link').click()
    await expect(
      page.locator('text=Updated Custom Link(opens in a new window)')
    ).toBeVisible()

    // Delete custom link
    await page
      .locator('[aria-label="edit Updated Custom Link bookmark"]')
      .click()
    await page.locator('text=Delete').click()
    await expect(
      page.locator('text=Updated Custom Link(opens in a new window)')
    ).toBeHidden()
  })

  test('can edit an existing collection title', async ({ page, loginPage }) => {
    // Login and check that user is in My Space
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(
      page.locator(`text=WELCOME, ${portalUser1.displayName}`)
    ).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Update Example Collection title
    await page.locator('[aria-label="Collection Settings"]').first().click()
    await page.locator('text=Edit Example Collection collection title').click()
    await page
      .locator('[placeholder="Name this collection"]')
      .fill('Updated Collection Title')
    await page.locator('text=Save name').click()

    await expect(page.locator('text=Updated Collection Title')).toBeVisible()

    // Change back so other tests don't depend on this update
    await page.locator('[aria-label="Collection Settings"]').first().click()
    await page
      .locator('text=Edit Updated Collection Title collection title')
      .click()
    await page
      .locator('[placeholder="Name this collection"]')
      .fill('Example Collection')
    await page.locator('text=Save name').click()

    await expect(page.locator('text=Example Collection')).toBeVisible()
  })

  test('can remove multiple links at once from an existing collection', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(
      page.locator(`text=WELCOME, ${portalUser1.displayName}`)
    ).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    await page.locator('[aria-label="remove Webmail from collection"]').click()

    await page.locator('[aria-label="remove MyPay from collection"]').click()

    await expect(
      page.locator('text=Webmail(opens in a new window)')
    ).toBeHidden()
    await expect(page.locator('text=MyPay(opens in a new window)')).toBeHidden()

    // 'Undo remove' option disappears after 3 seconds, so we wait for 4 seconds
    // before performing check
    await waitFor(4000)
    await expect(page.locator('text=Undo remove')).toBeHidden()
  })

  test('can delete an existing collection', async ({ page, loginPage }) => {
    // Login and check that user is in My Space
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(
      page.locator(`text=WELCOME, ${portalUser1.displayName}`)
    ).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Cancel
    await page.locator('[aria-label="Collection Settings"]').first().click()
    await page
      .locator('button:has-text("Delete Example Collection collection")')
      .click()
    await page.locator('[data-testid="modalFooter"] >> text=Cancel').click()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Delete
    await page.locator('[aria-label="Collection Settings"]').first().click()
    await page
      .locator('button:has-text("Delete Example Collection collection")')
      .click()
    await page.locator('[data-testid="modalFooter"] >> text=Delete').click()
    await expect(page.locator('text=Example Collection')).toBeHidden()
  })

  test('can add/remove the News Widget to My Space', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(
      page.locator(`text=WELCOME, ${portalUser1.displayName}`)
    ).toBeVisible()

    // Add News Widget
    await page.locator('text=Add widget').click()
    await page.locator('text=Add news widget').click()
    await expect(page.locator('text=Recent News')).toBeVisible()

    // Remove News Widget
    await page.locator('[aria-label="Recent News Widget Settings"]').click()
    await page.locator('text=Remove Recent News widget').click()
    await page.locator('[data-testid="modalFooter"] >> text=Delete').click()
    await expect(page.locator('text=Recent News')).toBeHidden()
  })
})
