import { test as base } from '@playwright/test'
import { faker } from '@faker-js/faker'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../models/Login'
import { adminUser, managerUser } from '../cms/database/users'

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

describe('Can add, view, and delete a bookmark', () => {
  test('as an admin', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login(adminUser.username, adminUser.password)
    await expect(
      page.locator(`text=WELCOME, ${adminUser.displayName}`)
    ).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(`text=Signed in as ${adminUser.userId}`)
    ).toBeVisible()

    await page.getByRole('link', { name: 'Bookmarks', exact: true }).click()

    const url = faker.internet.url()
    const label = faker.lorem.words()
    const description = faker.lorem.sentence()
    const keywords = faker.lorem.words()
    // Add a bookmark
    await page.getByRole('link', { name: 'Create Bookmark' }).click()
    await page.getByLabel('Url').fill(url)
    await page.getByLabel('Label').fill(label)
    await page.getByLabel('Description').fill(description)
    await page.getByLabel('Keywords').fill(keywords)
    await page.getByRole('button', { name: 'Create Bookmark' }).click()

    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible()
    await expect(page.getByText('Item ID')).toBeVisible()

    // View the bookmark
    await page.getByRole('navigation', { name: 'Side Navigation' }).getByRole('link', { name: 'Bookmarks' }).click()
    await page.getByPlaceholder('Search by Url, Label, Description, Keywords').fill(label)
    await page.locator('form').getByRole('button').click()
    await expect(page.getByRole('link', { name: label })).toBeVisible()

    // Delete the bookmark
    await page.getByRole('row', { name: `${label} ${url} ${description}` }).locator('label div').click()
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible()
    await page.getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByRole('heading', { name: 'Delete Confirmation' })).toBeVisible()
    await page.getByRole('dialog', { name: 'Delete Confirmation' }).getByRole('button', { name: 'Delete' }).click()
    await page.getByPlaceholder('Search by Url, Label, Description, Keywords').fill(label)
    await page.locator('form').getByRole('button').click()
    await expect(page.getByRole('link', { name: label })).toBeHidden()
  })

  test('as a manager', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login(managerUser.username, managerUser.password)
    await expect(
      page.locator(`text=WELCOME, ${managerUser.displayName}`)
    ).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(`text=Signed in as ${managerUser.userId}`)
    ).toBeVisible()

    await page.getByRole('link', { name: 'Bookmarks', exact: true }).click()

      // getByRole('link', { name: 'Create Bookmark' })
      // getByRole('row', { name: 'MilConnect https://milconnect.dmdc.osd.mil/milconnect/ Review personal, health care, and personnel information from one reliable source, the Defense Enrollment Eligibility Reporting System (DEERS)' }).locator('label')
      // getByRole('button', { name: 'Delete' })
    
    const url = faker.internet.url()
    const label = faker.lorem.words()
    const description = faker.lorem.sentence()
    const keywords = faker.lorem.words()
    // Add a bookmark
    await page.getByRole('link', { name: 'Create Bookmark' }).click()
    await page.getByLabel('Url').fill(url)
    await page.getByLabel('Label').fill(label)
    await page.getByLabel('Description').fill(description)
    await page.getByLabel('Keywords').fill(keywords)
    await page.getByRole('button', { name: 'Create Bookmark' }).click()

    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible()
    await expect(page.getByText('Item ID')).toBeVisible()

    // View the bookmark
    await page.getByRole('navigation', { name: 'Side Navigation' }).getByRole('link', { name: 'Bookmarks' }).click()
    await page.getByPlaceholder('Search by Url, Label, Description, Keywords').fill(label)
    await page.locator('form').getByRole('button').click()
    await expect(page.getByRole('link', { name: label })).toBeVisible()

    // Delete the bookmark
    await page.getByRole('row', { name: `${label} ${url} ${description}` }).locator('label div').click()
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible()
    await page.getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByRole('heading', { name: 'Delete Confirmation' })).toBeVisible()
    await page.getByRole('dialog', { name: 'Delete Confirmation' }).getByRole('button', { name: 'Delete' }).click()
    await page.getByPlaceholder('Search by Url, Label, Description, Keywords').fill(label)
    await page.locator('form').getByRole('button').click()
    await expect(page.getByRole('link', { name: label })).toBeHidden()
  })
})
