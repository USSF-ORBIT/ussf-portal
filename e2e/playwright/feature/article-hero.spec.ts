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
import { KeystoneArticlePage } from '../models/KeystoneArticle'

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

test.beforeAll(async () => {
  title = faker.lorem.words()
})

describe('Article Hero Image', () => {
  test('hero image can be uploaded and saved by an author', async ({
    page,
    loginPage,
    keystoneListPage,
    keystoneArticlePage,
  }) => {
    /* Log in as a CMS author */
    await loginPage.login(authorUser.username, authorUser.password)

    await expect(page.locator(`text=WELCOME, ${authorUser.name}`)).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(`text=Signed in as ${authorUser.userId}`)
    ).toBeVisible()

    /* Navigate to the Articles page */
    await Promise.all([
      page.waitForNavigation(),
      page.locator('h3:has-text("Articles")').click(),
    ])

    /** Create a new article *****

      Category: ORBITBlog
      Title: <Generated using Faker>
      Hero Image: placeholder.png 
      ****************************/

    await page.locator('text=Create Article').click()
    await keystoneArticlePage.fillOrbitBlogArticleFields({ title })

    /* Use fileChooser to upload a hero image */
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('text=Upload').click(),
    ])
    await fileChooser.setFiles(path.resolve(__dirname, 'placeholder.png'))

    /* Create article */
    await keystoneArticlePage.createArticle()

    /* Confirm image has successfully uploaded and saved */
    await expect(
      page.locator('img[alt="Image uploaded to hero field"]')
    ).toBeVisible()

    /* Navigate back to Articles page and confirm article was created as a draft */

    await keystoneListPage.gotoAndSortBy('articles')

    await expect(
      page.locator(`tr:has-text("${title}") td:nth-child(3)`)
    ).toHaveText('Draft')

    /* Log out as CMS author */
    await loginPage.logout()
  })

  test('hero image can be viewed on published article', async ({
    page,
    loginPage,
    keystoneListPage,
    keystoneArticlePage,
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

    /* Navigate to the Articles page */
    await keystoneListPage.gotoAndSortBy('articles')

    /* Publish article */
    await page.locator(`a:has-text("${title}")`).click()

    await keystoneArticlePage.publishArticle()

    /* View article on the portal and confirm hero is present */
    await page.goto('http://localhost:3000/about-us/orbit-blog/')
    await expect(page.locator(`h3:has-text("${title}")`)).toBeVisible()

    const [article] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator(`text="${title}"`).click(),
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
