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
  await seedCMSUsers()
  await seedDB()
})
describe('Article Hero Image', () => {
  test('hero image can be uploaded and saved by an author', async ({
    page,
    loginPage,
  }) => {
    test.slow()

    /* Log in as a CMS author */
    await loginPage.login('cmsauthor', 'cmsauthorpass')

    await expect(page.locator('text=WELCOME, ETHEL NEAL')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as ETHEL.NEAL.643097412@testusers.cce.af.mil'
      )
    ).toBeVisible()

    /* Navigate to the Articles page */
    await Promise.all([
      page.waitForNavigation(),
      page.locator('h3:has-text("Articles")').click(),
    ])

    /** Create a new article *****

      Category: ORBITBlog
      Title: My Test Article
      Hero Image: placeholder.png 
      ****************************/

    await page.locator('text=Create Article').click()
    await page.locator('label[for="category"]').click()
    await page.keyboard.type('O')
    await page.keyboard.press('Enter')
    await page.locator('#title').fill('My Test Article')

    /* Use fileChooser to upload a hero image */
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('text=Upload').click(),
    ])
    await fileChooser.setFiles(path.resolve(__dirname, 'placeholder.png'))

    /* Create article */
    await Promise.all([
      page.waitForNavigation(),
      page.locator('form span:has-text("Create Article")').click(),
    ])

    /* Confirm image has successfully uploaded and saved */
    await expect(
      page.locator('img[alt="Image uploaded to hero field"]')
    ).toBeVisible()

    await page.locator('label:has-text("Published")').check()

    /* Navigate back to Articles page and confirm article was created as a draft */

    await page
      .locator('[aria-label="Side Navigation"] >> text=Articles')
      .click()
    await expect(page).toHaveURL('http://localhost:3001/articles')

    await expect(
      page.locator('tr:has-text("My Test Article") td:nth-child(3)')
    ).toHaveText('Draft')

    /* Publish article */
    await page.locator('a:has-text("My Test Article")').click()

    // The Status labels are never "enabled"
    // Here are many ways I tried to find them, but the inputs are marked
    // disabled in the html. This only happens during a test, not when running
    // codegen, or browsing the app.

    // await page.locator('label:has-text("Published")').check()
    // await page.locator('text=Status >> text=Published').click({ timeout: 5000 })
    // await page.locator('text=Status >> label:nth-child(1) >> input').check()

    // await page.locator('button:has-text("Save changes")').click()

    /* View article on the portal and confirm hero is present */
    // #TODO

    /* Navigate back to the CMS and remove the hero image*/
    // #TODO

    // Click text=My Test Article
    // await page.locator('a:has-text("My Test Article")').click()
    // // await expect(page.locator('#slug')).toHaveText('my-test-article')
    // // Click button:has-text("Remove")
    // await page.locator('button:has-text("Remove")').click()
    // // Click button:has-text("Save changes")
    // await page.locator('button:has-text("Save changes")').click()
    // // Click text=HeroUpload Image >> svg
    // await expect(page.locator('text=HeroUpload Image >> svg')).toBeVisible()

    /* View article on the portal and confirm no hero image */
    //#TODO

    await loginPage.logout()
  })
})
