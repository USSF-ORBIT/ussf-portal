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
    await page.locator('#title').fill('A Test Article')

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

    /* Navigate back to Articles page and confirm article was created as a draft */

    await page
      .locator('[aria-label="Side Navigation"] >> text=Articles')
      .click()
    await expect(page).toHaveURL('http://localhost:3001/articles')

    await expect(
      page.locator('tr:has-text("A Test Article") td:nth-child(3)')
    ).toHaveText('Draft')

    /* Log out as CMS author */
    await loginPage.logout()
  })
  test('hero image can be viewed on published article', async ({
    page,
    loginPage,
  }) => {
    /* Log in as a CMS manager */
    await loginPage.login('cmsmanager', 'cmsmanagerpass')
    await expect(page.locator('text=WELCOME, CHRISTINA HAVEN')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as CHRISTINA.HAVEN.561698119@testusers.cce.af.mil'
      )
    ).toBeVisible()

    /* Navigate to the Articles page */
    await Promise.all([
      page.waitForNavigation(),
      page.locator('h3:has-text("Articles")').click(),
    ])

    /* Publish article */
    await page.locator('a:has-text("A Test Article")').click()

    await page.locator('label:has-text("Published")').check()

    await page.locator('button:has-text("Save changes")').click()

    /* View article on the portal and confirm hero is present */
    await page.goto('http://localhost:3000/about-us/orbit-blog/')
    await expect(page.locator('h3:has-text("A Test Article")')).toBeVisible()

    const [article] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('text=A Test Article').click(),
    ])

    await expect(
      article.locator('img[alt="article hero graphic"]')
    ).toBeVisible()
    await article.close()

    /* Return to CMS and log out */
    await page.goto('http://localhost:3001')
    await loginPage.logout()
  })
})
