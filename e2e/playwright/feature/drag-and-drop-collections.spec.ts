import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../models/Login'
import { seedDB } from '../portal-client/database/seedMongo'
import { portalUser1, portalUser2 } from '../cms/database/users'

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
    await expect(page.getByTestId('personal-data')).toHaveText(
      `Welcome, ${portalUser1.displayName}`
    )
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

    // 'Latest Announcements' is the first h2, so the second h2 is the first collection in My Space
    await expect(page.locator('h2').nth(1)).toHaveText('My Custom Collection')
  })

  test('can drag and drop a collection and immediately drag and drop a bookmark', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login(portalUser2.username, portalUser2.password)
    await expect(page.getByTestId('personal-data')).toHaveText(
      `Welcome, ${portalUser2.displayName}`
    )

    // Add new collections
    await page.getByRole('button', { name: 'Add widget' }).click()

    await page
      .getByRole('button', { name: 'Select collection from template' })
      .click()
    await page.getByRole('button', { name: 'Select collection Career' }).click()
    await page
      .getByRole('button', {
        name: 'Select collection Personnel & Administration',
      })
      .click()
    await page.getByRole('button', { name: 'Add selected' }).click()

    const collectionToDrag = page
      .getByRole('button', {
        name: 'Personnel & Administration Collection Settings',
      })
      .first()

    // Drag and drop
    await collectionToDrag.focus()
    await page.keyboard.press(' ')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press(' ')

    // 'Latest Announcements' is the first h2, so the second h2 is the first collection in My Space
    await expect(page.locator('h2').nth(1)).toHaveText(
      'Personnel & Administration'
    )

    // Get the drag handle for the first link in the collection
    const linkToDrag = page
      .getByRole('listitem')
      .filter({ hasText: 'Outprocessing Checklists(opens in a new window)' })
      .getByRole('button', { name: 'Drag Handle' })

    await linkToDrag.focus()
    await page.keyboard.press(' ')
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press(' ')

    // Check that linkToDrag is now the first link in the collection
    await expect(
      page.locator('ol > li > div > div > div > a').first()
    ).toHaveText('Outprocessing Checklists(opens in a new window)')

    // 'Latest Announcements' is the first h2, so the second h2 is the first collection in My Space.
    // Check that the first collection is still 'Personnel & Administration'
    await expect(page.locator('h2').nth(1)).toHaveText(
      'Personnel & Administration'
    )
  })

  test('can drag and drop a collection and immediately edit the title', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login(portalUser2.username, portalUser2.password)
    await expect(page.getByTestId('personal-data')).toHaveText(
      `Welcome, ${portalUser2.displayName}`
    )

    const collectionToDrag = page
      .getByRole('button', {
        name: 'Career Collection Settings',
      })
      .first()

    // Drag and drop collection
    await collectionToDrag.focus()
    await page.keyboard.press(' ')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press(' ')

    // 'Latest Announcements' is the first h2, so the second h2 is the first collection in My Space
    await expect(page.locator('h2').nth(1)).toHaveText('Career')

    // Update the title
    const settingsButton = page.getByTestId('collection-settings-Career')

    await settingsButton.click()

    await page
      .getByRole('button', {
        name: 'Edit Career collection title',
        exact: true,
      })
      .click()
    await page.getByTestId('textInput').fill('Career Update')
    await page.getByRole('button', { name: 'Save name' }).click()

    // 'Latest Announcements' is the first h2, so the second h2 is the first collection in My Space
    // Check that Career Update is still the first collection
    await expect(page.locator('h2').nth(1)).toHaveText('Career Update')
  })
})
