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

const { expect } = test

let title: string

test.beforeAll(async () => {
  title = faker.lorem.words()
})

test('hero image is displayed by on internal news carousel', async ({
  page,
  loginPage,
  keystoneListPage,
  keystoneArticlePage,
}) => {
  test.slow()
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

    Category: InternalNews
    Title: <Generated using Faker>
    Hero Image: placeholder.png 
    ****************************/

  await page.locator('text=Create Article').click()
  await keystoneArticlePage.fillInternalNewsArticleFields({ title })

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

  /* Log in as a CMS manager */
  await loginPage.login(managerUser.username, managerUser.password)
  await expect(page.locator(`text=WELCOME, ${managerUser.name}`)).toBeVisible()

  await page.goto('http://localhost:3001')
  await expect(
    page.locator(`text=Signed in as ${managerUser.userId}`)
  ).toBeVisible()

  /* Navigate to the Articles page */
  await Promise.all([
    page.waitForNavigation(),
    page.locator('h3:has-text("Articles")').click(),
  ])

  /* Publish article */
  await page.locator(`a:has-text("${title}")`).click()

  await keystoneArticlePage.publishArticle()

  /* View article on the portal and confirm hero is present */
  await page.goto('http://localhost:3000/news-announcements')

  const carouselCard = page.locator(
    `div:has-text("${title}") > .grid-row >> nth=0`
  )

  await expect(carouselCard).toBeVisible()

  /* Verify that the hero image is displayed on the carousel */
  await expect(
    carouselCard.locator('img[alt="article hero graphic"]')
  ).toBeVisible()

  // Start waiting for new page before clicking
  const [article] = await Promise.all([
    page.waitForEvent('popup'),
    carouselCard.locator('text=View Article').click(),
  ])

  await expect(
    article.locator(`article >> h2:has-text("${title}")`)
  ).toBeVisible()

  /* Verify that the hero image is displayed when viewing the article */
  await expect(
    article.locator('article >> img[alt="article hero graphic"]')
  ).toBeVisible()

  /* Return to CMS and log out */
  await page.goto('http://localhost:3001')
  await loginPage.logout()
})
