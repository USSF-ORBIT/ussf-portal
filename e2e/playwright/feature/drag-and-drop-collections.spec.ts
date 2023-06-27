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

describe('Drag and drop user collections', () => {
  test('can use the keyboard to drag and drop a collection', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Add a new collection
    await page.getByRole('button', { name: 'Add widget' }).click()
    await page.getByRole('button', { name: 'Create new collection' }).click()
    await page.getByTestId('textInput').fill('My Custom Collection')
    await page.getByRole('button', { name: 'Save name' }).click()

    // Drag and drop the new collection
    const collectionToDrag = page.getByRole('button', {
      name: 'My Custom Collection Collection Settings + Add link',
    })

    await collectionToDrag.focus()
    await page.keyboard.press(' ')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press(' ')

    // First h3 should be the new collection
    await expect(page.locator('h3').first()).toHaveText('My Custom Collection')
  })
})
