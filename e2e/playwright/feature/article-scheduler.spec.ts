import { test as base } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { managerUser, portalUser1 } from '../cms/database/users'
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

test('orbit blog article published with future date cannot be seen', async ({
  page,
  loginPage,
  keystoneListPage,
  keystoneArticlePage,
}) => {
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

  const title = faker.lorem.words()
  const slug = faker.helpers.slugify(title)

  const futureDate = DateTime.now().plus({ hours: 2 })

  // Create article
  await keystoneArticlePage.createOrbitBlogArticle({ title, slug })
  await keystoneListPage.gotoAndSortBy('articles')

  // Publish article with a future date
  await page.locator(`a:has-text("${title}")`).click(),
    await keystoneArticlePage.publishArticle({ publishedDate: futureDate })

  // check that the article has the date
  await expect(
    page.locator(`button:has-text("${futureDate.toFormat('MM/dd/yyyy')}")`)
  ).toBeVisible()
  await expect(page.locator(`input[placeholder="00:00"]`)).toHaveValue(
    futureDate.toFormat('HH:mm')
  )

  // go to the portal and ensure article doesn't show
  await page.goto('http://localhost:3000/about-us/orbit-blog/')
  await expect(
    page.locator('h2:has-text("Production team blog & announcements")')
  ).toBeVisible()
  await expect(page.locator(`h3:has-text("${title}")`)).toBeHidden()

  // go to the article as manager and you can see it as preview mode
  await page.goto(`http://localhost:3000/articles/${slug}`)
  await expect(page.locator(`h2:has-text("${title}")`)).toBeVisible()

  // orbit blog not shown in search so no need to check for it

  // return to the CMS and log out
  await page.goto('http://localhost:3001')
  await loginPage.logout()

  // try to go to the article as default user
  await loginPage.login(portalUser1.username, portalUser1.password)
  await expect(
    page.locator(`text=WELCOME, ${portalUser1.displayName}`)
  ).toBeVisible()

  const defaultResponse = await page.request.get(
    `http://localhost:3000/articles/${slug}`
  )
  expect(defaultResponse.status()).toBe(404)
})

test('internal news article published with future date cannot be seen', async ({
  page,
  loginPage,
  keystoneListPage,
  keystoneArticlePage,
}) => {
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

  const title = faker.lorem.words()
  const slug = faker.helpers.slugify(title)
  const futureDate = DateTime.now().plus({ hours: 2 })

  // Create article
  await keystoneArticlePage.createInternalNewsArticle({ title, slug })
  await keystoneListPage.gotoAndSortBy('articles')

  // Publish article with a future date
  await page.locator(`a:has-text("${title}")`).click(),
    await keystoneArticlePage.publishArticle({ publishedDate: futureDate })

  // check that the article has the date
  await expect(
    page.locator(`button:has-text("${futureDate.toFormat('MM/dd/yyyy')}")`)
  ).toBeVisible()
  await expect(page.locator(`input[placeholder="00:00"]`)).toHaveValue(
    futureDate.toFormat('HH:mm')
  )

  // go to the portal and ensure article doesn't show
  await page.goto('http://localhost:3000/news-announcements')
  await expect(
    page.locator('h1:has-text("News & Announcements")')
  ).toBeVisible()

  const carouselCard = page.locator(
    `div:has-text("${title}") > .grid-row >> nth=0`
  )

  await expect(carouselCard).toBeHidden()

  // go to the article as manager and you can see it as preview mode
  await page.goto(`http://localhost:3000/articles/${slug}`)
  await expect(page.locator(`h2:has-text("${title}")`)).toBeVisible()

  // ensure page isn't in search results
  await page.goto(`http://localhost:3000/search?q=${title}`)
  await expect(page.locator('h1:has-text("Search")')).toBeVisible()
  await expect(page.locator(`a:has-text("${title}")`)).toBeHidden()

  // return to the CMS and log out
  await page.goto('http://localhost:3001')
  await loginPage.logout()

  // try to go to the article a portal user
  await loginPage.login(portalUser1.username, portalUser1.password)
  await expect(
    page.locator(`text=WELCOME, ${portalUser1.displayName}`)
  ).toBeVisible()

  const response = await page.request.get(
    `http://localhost:3000/articles/${slug}`
  )
  expect(response.status()).toBe(404)
})
