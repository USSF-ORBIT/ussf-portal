import { test as base } from '@playwright/test'
import path from 'path'
import { faker } from '@faker-js/faker'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { authorUser, managerUser } from '../cms/database/users'
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
const testfile = path.resolve(__dirname, 'test-file.pdf')

test.beforeAll(async () => {
  documentTitle = faker.lorem.words()
  sectionTitle = faker.lorem.words()
  description = faker.lorem.words()
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

    await expect(page.locator('text=WELCOME, ETHEL NEAL')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as ETHEL.NEAL.643097412@testusers.cce.af.mil'
      )
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
    /* Log in as a CMS manager */
    await loginPage.login(managerUser.username, managerUser.password)

    await expect(page.locator('text=WELCOME, CHRISTINA HAVEN')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as CHRISTINA.HAVEN.561698119@testusers.cce.af.mil'
      )
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

    await expect(page.locator('text=WELCOME, CHRISTINA HAVEN')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as CHRISTINA.HAVEN.561698119@testusers.cce.af.mil'
      )
    ).toBeVisible()

    /* Navigate to the Document Pages page */
    await Promise.all([
      page.waitForNavigation(),
      page.locator('h3:has-text("Documents Page")').click(),
    ])

    /** Create a new document page *****

      Title: "USSF Documentation"
      Document Section: <Generated using Faker>
      ****************************/

    await page.locator('text=Create Documents Page').click()
    await page.locator('#pageTitle').fill('USSF Documentation')
    await page.locator('legend:has-text("Sections")').click()
    await page.keyboard.type(sectionTitle)
    await page.keyboard.press('Enter')

    /* Save new document section  */
    await Promise.all([
      page.waitForNavigation(),
      page.locator('form span:has-text("Create Documents Page")').click(),
    ])

    await expect(page.locator('text=Created Successfully')).toBeVisible()

    /* Navigate back to Articles page and confirm article was created as a draft */

    await keystoneListPage.gotoAndSortBy('documents-pages')

    await expect(
      page.locator(`tr:has-text("USSF Documentation")`)
    ).toBeVisible()

    await loginPage.logout()
  })
})
