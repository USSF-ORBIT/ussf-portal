import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { faker } from '@faker-js/faker'
import { LoginPage } from '../../models/Login'
import { KeystoneListPage } from '../../models/KeystoneList'
import { KeystoneArticlePage } from '../../models/KeystoneArticle'
import { authorUser, managerUser } from '../database/users'

type CustomFixtures = {
  loginPage: LoginPage
  keystoneListPage: KeystoneListPage
  keystoneArticlePage: KeystoneArticlePage
}

const test = base.extend<TestingLibraryFixtures & CustomFixtures>({
  ...fixtures,
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
  keystoneListPage: async ({ page, context }, use) => {
    await use(new KeystoneListPage(page, context))
  },
  keystoneArticlePage: async ({ page, context }, use) => {
    await use(new KeystoneArticlePage(page, context))
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
  test('can be created by an author', async ({
    page,
    loginPage,
    keystoneListPage,
    keystoneArticlePage,
  }) => {
    await loginPage.login(authorUser.username, authorUser.password)

    await expect(page.locator(`text=WELCOME, ${authorUser.name}`)).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(`text=Signed in as ${authorUser.userId}`)
    ).toBeVisible()

    await Promise.all([
      page.waitForNavigation(),
      page.locator('h3:has-text("Articles")').click(),
    ])

    await keystoneArticlePage.createOrbitBlogArticle({ slug, title })

    await keystoneListPage.gotoAndSortBy('articles')
    await expect(
      page.locator(`tr:has-text("${title}") td:nth-child(3)`)
    ).toHaveText('Draft')

    await loginPage.logout()
  })

  test('can be published by a manager', async ({
    page,
    loginPage,
    keystoneListPage,
    keystoneArticlePage,
  }) => {
    await loginPage.login(managerUser.username, managerUser.password)

    await expect(
      page.locator(`text=WELCOME, ${managerUser.name}`)
    ).toBeVisible()

    await keystoneListPage.gotoAndSortBy('articles')

    await Promise.all([
      page.waitForNavigation(),
      page.locator(`a:has-text("${title}")`).click(),
    ])

    await keystoneArticlePage.publishArticle()

    await keystoneListPage.gotoAndSortBy('articles')
    await expect(
      page.locator(`tr:has-text("${title}") td:nth-child(3)`)
    ).toHaveText('Published')
    await loginPage.logout()
  })
})
