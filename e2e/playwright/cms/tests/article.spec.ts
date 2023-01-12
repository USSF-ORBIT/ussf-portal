import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { faker } from '@faker-js/faker'
import { LoginPage } from '../../models/Login'
import { authorUser, managerUser } from '../database/users'
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
let title: string
let slug: string

test.beforeAll(async () => {
  title = faker.lorem.words()
  slug = faker.helpers.slugify(title)
})

describe('Articles', () => {
  test('can be created by an author', async ({ page, loginPage }) => {
    test.slow()
    await loginPage.login(authorUser.username, authorUser.password)

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

    await page.locator('#slug').fill(`${slug}`)
    await page.locator('#title').fill(`${title}'`)
    await page.locator('#preview').fill('This is my test article.')

    await Promise.all([
      page.waitForNavigation(),
      page.locator('form span:has-text("Create Article")').click(),
    ])

    await page
      .locator('[aria-label="Side Navigation"] >> text=Articles')
      .click()
    await expect(page).toHaveURL('http://localhost:3001/articles')
    await expect(
      page.locator(`tr:has-text("${title}") td:nth-child(3)`)
    ).toHaveText('Draft')

    await loginPage.logout()
  })

  test('can be published by a manager', async ({ page, loginPage }) => {
    test.slow()
    await loginPage.login(managerUser.username, managerUser.password)

    await expect(page.locator('text=WELCOME, CHRISTINA HAVEN')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as CHRISTINA.HAVEN.561698119@testusers.cce.af.mil'
      )
    ).toBeVisible()

    await Promise.all([
      page.waitForNavigation(),
      page.locator('h3:has-text("Articles")').click(),
    ])

    await expect(page).toHaveURL('http://localhost:3001/articles')
    await expect(
      page.locator(`tr:has-text("${title}") td:nth-child(3)`)
    ).toHaveText('Draft')

    await Promise.all([
      page.waitForNavigation(),
      page.locator(`a:has-text("${title}")`).click(),
    ])

    await page.locator('label:has-text("Published")').click()

    await page.locator('button:has-text("Save changes")').click()
    await expect(
      page.locator('label:has-text("Published") input')
    ).toBeChecked()

    await page
      .locator('[aria-label="Side Navigation"] >> text=Articles')
      .click()
    await expect(page).toHaveURL('http://localhost:3001/articles')
    await expect(
      page.locator(`tr:has-text("${title}") td:nth-child(3)`)
    ).toHaveText('Published')
    await loginPage.logout()
  })
})
