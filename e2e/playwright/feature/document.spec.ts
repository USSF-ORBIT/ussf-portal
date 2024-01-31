import { test as base } from '@playwright/test'
import path from 'path'
import { faker } from '@faker-js/faker'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { authorUser, defaultUser, managerUser } from '../cms/database/users'
import { LoginPage } from '../models/Login'
import { KeystoneListPage } from '../models/KeystoneList'

type CustomFixtures = {
  loginPage: LoginPage
  keystoneListPage: KeystoneListPage
}

const test = base.extend<TestingLibraryFixtures & CustomFixtures>({
  ...fixtures,
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
  keystoneListPage: async ({ page, context }, use) => {
    await use(new KeystoneListPage(page, context))
  },
})

const { describe, expect } = test
let documentTitle: string, description: string
let sectionTitle: string
let pageTitle: string
const testfile = path.resolve(__dirname, 'test-file.pdf')

test.beforeAll(async () => {
  documentTitle = faker.lorem.words()
  sectionTitle = faker.lorem.words()
  description = faker.lorem.words()
  pageTitle = faker.lorem.words()
})

describe('Document', () => {
  test('document can be created and saved by an author', async ({
    page,
    loginPage,
    keystoneListPage,
  }) => {
    test.slow()

    /* Log in as a CMS author */
    await loginPage.login(authorUser.username, authorUser.password)

    await expect(page.locator(`text=WELCOME, ${authorUser.name}`)).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(`text=Signed in as ${authorUser.userId}`)
    ).toBeVisible()

    /* Navigate to the documents type page */
    await Promise.all([
      page.waitForNavigation(),
      page.locator('h3:text-is("Documents")').click(),
    ])

    /** Create a new document *****
      
      Title: <Generated using Faker>
      Description: <Generated using Faker>
      File: test-file.pdf
      ****************************/
    await page.locator('text=Create Document').click()
    await page.locator('label[for="title"]').fill(documentTitle)
    await page.locator('label[for="description"]').fill(description)

    /* Use fileChooser to upload a document pdf */
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('text=Upload').click(),
    ])
    await fileChooser.setFiles(testfile)

    /* Save new document */
    await Promise.all([
      page.waitForNavigation(),
      page.locator('form span:has-text("Create Document")').click(),
    ])

    await expect(page.locator('text=Created Successfully')).toBeVisible()

    /* Navigate back to Documents page and confirm document was created */

    await keystoneListPage.gotoAndSortBy('documents')

    await expect(page.locator(`tr:has-text("${documentTitle}")`)).toBeVisible()
    await loginPage.logout()
  })

  test('document section can be created by a manager', async ({
    page,
    loginPage,
    keystoneListPage,
  }) => {
    test.slow()
    /* Log in as a CMS manager */
    await loginPage.login(managerUser.username, managerUser.password)

    await expect(
      page.locator(`text=WELCOME, ${managerUser.name}`)
    ).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(`text=Signed in as ${managerUser.userId}`)
    ).toBeVisible()

    /* Navigate to the Document Sections page */
    await Promise.all([
      page.waitForNavigation(),
      page.locator('h3:has-text("Document Sections")').click(),
    ])

    /** Create a new document section *****

      Title: <Generated using Faker>
      Document: <Generated using Faker>
      ****************************/

    await page.locator('text=Create Document Section').click()
    await page.locator('#title').fill(sectionTitle)
    await page.locator('legend:has-text("Document")').click()
    await page.keyboard.type(documentTitle)
    await page.keyboard.press('Enter')

    /* Save new document section  */
    await Promise.all([
      page.waitForNavigation(),
      page.locator('form span:has-text("Create Document Section")').click(),
    ])

    await expect(page.locator('text=Created Successfully')).toBeVisible()

    /* Navigate back to Articles page and confirm article was created as a draft */

    await keystoneListPage.gotoAndSortBy('document-sections')

    await expect(page.locator(`tr:has-text("${sectionTitle}")`)).toBeVisible()

    await loginPage.logout()
  })

  test('documents page can be created by a manager', async ({
    page,
    loginPage,
    keystoneListPage,
  }) => {
    /* Log in as a CMS manager */
    await loginPage.login(managerUser.username, managerUser.password)

    await expect(
      page.locator(`text=WELCOME, ${managerUser.name}`)
    ).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(`text=Signed in as ${managerUser.userId}`)
    ).toBeVisible()

    /* Navigate to the Document Pages page */
    await keystoneListPage.gotoAndSortBy('documents-pages')

    /** Create a new document page *****

      Title: <Generated using Faker>
      Document Section: <Generated using Faker>
      ****************************/

    await page.locator('text=Create Documents Page').click()
    await page.locator('#pageTitle').fill(pageTitle)
    await page
      .locator('text=SectionsSelect...Create related Document Section')
      .click()
    await page.locator(`text="${sectionTitle}"`).click()

    /* Save new document section  */

    await page.locator('form span:has-text("Create Documents Page")').click()
    await expect(page.locator('text=Created Successfully')).toBeVisible()

    /* Navigate back to Documents Page and confirm page was created  */

    await keystoneListPage.gotoAndSortBy('documents-pages')

    await expect(page.locator(`tr:has-text("${pageTitle}")`)).toBeVisible()

    await loginPage.logout()
  })

  test('documents page can be viewed on the portal by a user', async ({
    page,
    loginPage,
  }) => {
    /* Log in as a portal user */
    await loginPage.login(defaultUser.username, defaultUser.password)
    await expect(
      page.locator(`text=WELCOME, ${defaultUser.name}`)
    ).toBeVisible()

    /* Navigate to the USSF Documentation page */
    await page.goto('http://localhost:3000/ussf-documentation')

    await expect(page.locator(`h2:has-text("${pageTitle}")`)).toBeVisible()
    await expect(page.locator(`text="${sectionTitle}"`)).toBeVisible()
  })

  test('document page can be deleted by a manager', async ({
    page,
    loginPage,
    keystoneListPage,
  }) => {
    /* Log in as a CMS manager */
    await loginPage.login(managerUser.username, managerUser.password)

    await expect(
      page.locator(`text=WELCOME, ${managerUser.name}`)
    ).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(`text=Signed in as ${managerUser.userId}`)
    ).toBeVisible()

    await keystoneListPage.gotoAndSortBy('documents-pages')

    await expect(page.locator(`tr:has-text("${pageTitle}")`)).toBeVisible()

    /* Delete page */

    await page.locator(`td:nth-child(2)`).click(),
      await page.locator('button:has-text("Delete")').click()
    await page.locator('div[role="dialog"] button:has-text("Delete")').click()

    await expect(page.locator('text=No Documents Pages found')).toBeVisible()
  })
})
