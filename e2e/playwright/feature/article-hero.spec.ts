import { test as base } from '@playwright/test'
import path from 'path'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../models/Login'
import { resetDb, seedCMSUsers } from '../cms/database/seed'
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

test.beforeAll(async () => {
  await resetDb()
  await seedDB()
  await seedCMSUsers()
})

describe('Article Hero Image', () => {
  test('hero image can be uploaded and saved by an author', async ({
    page,
    loginPage,
  }) => {
    test.slow()
    await loginPage.login('cmsauthor', 'cmsauthorpass')

    await expect(page.locator('text=WELCOME, ETHEL NEAL')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as ETHEL.NEAL.643097412@testusers.cce.af.mil'
      )
    ).toBeVisible()

    await Promise.all([
      page.waitForNavigation(),
      page.locator('h3:has-text("Articles")').click(),
    ])

    await page.locator('text=Create Article').click()

    await page.locator('label[for="category"]').click()
    await page.keyboard.type('O')
    await page.keyboard.press('Enter')
    await page.locator('#title').fill('My Test Article')

    // Note that Promise.all prevents a race condition
    // between clicking and waiting for the file chooser.
    const [fileChooser] = await Promise.all([
      // It is important to call waitForEvent before click to set up waiting.
      page.waitForEvent('filechooser'),
      // Opens the file chooser.
      page.locator('text=Upload').click(),
    ])
    await fileChooser.setFiles(path.resolve(__dirname, 'placeholder.png'))

    await Promise.all([
      page.waitForNavigation(),
      page.locator('form span:has-text("Create Article")').click(),
    ])

    await expect(
      page.locator('img[alt="Image uploaded to hero field"]')
    ).toBeVisible()

    await page
      .locator('[aria-label="Side Navigation"] >> text=Articles')
      .click()
    await expect(page).toHaveURL('http://localhost:3001/articles')
    await expect(
      page.locator('tr:has-text("My Test Article") td:nth-child(3)')
    ).toHaveText('Draft')

    // Remove the hero image
    // Click text=My Test Article
    await page.locator('a:has-text("My Test Article")').click()
    // await expect(page.locator('#slug')).toHaveText('my-test-article')
    // Click button:has-text("Remove")
    await page.locator('button:has-text("Remove")').click()
    // Click button:has-text("Save changes")
    await page.locator('button:has-text("Save changes")').click()
    // Click text=HeroUpload Image >> svg
    await expect(page.locator('text=HeroUpload Image >> svg')).toBeVisible()

    await loginPage.logout()
  })
})
