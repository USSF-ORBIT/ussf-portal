import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../../models/Login'
import { resetDb } from '../../cms/database/seed'
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

const waitFor = (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

test.beforeAll(async () => {
  await resetDb()
  await seedDB()
})

describe('MySpace', () => {
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

  test('can add/edit/delete custom links in an existing collection', async ({
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

    // Edit custom link
    await page.locator('[aria-label="Edit this link"]').first().click()

    await page
      .locator(
        'div.is-visible > div.usa-modal-overlay > div > div.usa-modal__content > div.usa-modal__main > form > input'
      )
      .first()
      .fill('Edited custom link name')

    await page
      .locator(
        'div.is-visible > div.usa-modal-overlay > div > div.usa-modal__content > div.usa-modal__main > form > ul.usa-button-group > li > button:has-text("Save custom link")'
      )
      .click()

    await expect(
      page.locator('text=Edited custom link name(opens in a new window)')
    ).toBeVisible()

    // Delete custom link
    await page.locator('[aria-label="Edit this link"]').first().click()

    await page
      .locator(
        'div.is-visible > div.usa-modal-overlay > div > div.usa-modal__content > div.usa-modal__main > form > ul.usa-button-group > li > button:has-text("Delete")'
      )
      .click()

    await expect(
      page.locator('text=Edited custom link name(opens in a new window)')
    ).toBeHidden()
  })

  test('can edit an existing collection title', async ({ page, loginPage }) => {
    // Login and check that user is in My Space
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Update Example Collection title
    await page.locator('[aria-label="Collection Settings"]').first().click()
    await page.locator('text=Edit collection title').click()
    await page
      .locator('[placeholder="Name this collection"]')
      .fill('Updated Collection Title')
    await page.locator('text=Save name').click()

    await expect(page.locator('text=Updated Collection Title')).toBeVisible()
  })

  test('can remove multiple links at once from an existing collection', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
    await expect(page.locator('text=Updated Collection Title')).toBeVisible()

    // This line is repeated because after the first click, the first 'x' disappears
    // and the second bookmark in the collection becomes the first
    await page.locator('[aria-label="Remove this link"]').first().click()
    await page.locator('[aria-label="Remove this link"]').first().click()

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
    await loginPage.login('user1', 'user1pass')
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
    await expect(page.locator('text=Updated Collection Title')).toBeVisible()

    // Cancel
    await page.locator('[aria-label="Collection Settings"]').first().click()
    await page.locator('button:has-text("Delete this collection")').click()
    await page
      .locator(
        'div.is-visible > div.usa-modal-overlay > div > div.usa-modal__content > div.usa-modal__main > div.usa-modal__footer > ul > li > button:has-text("Cancel")'
      )
      .click()
    await expect(page.locator('text=Updated Collection Title')).toBeVisible()

    // Delete
    await page.locator('[aria-label="Collection Settings"]').first().click()
    await page.locator('button:has-text("Delete this collection")').click()
    await page
      .locator(
        'div.is-visible > div.usa-modal-overlay > div > div.usa-modal__content > div.usa-modal__main > div.usa-modal__footer > ul > li > button:has-text("Delete")'
      )
      .click()
    await expect(page.locator('text=Updated Collection Title')).toBeHidden()
  })
})
