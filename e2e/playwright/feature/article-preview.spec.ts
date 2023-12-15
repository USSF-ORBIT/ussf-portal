import { test as base } from '@playwright/test'
import { faker } from '@faker-js/faker'
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

const { describe, expect } = test

describe('orbit blog', () => {
  const title = faker.lorem.words()
  const slug = faker.helpers.slugify(title)

  test('orbit blog article can be previewed ', async ({
    page,
    loginPage,
    keystoneArticlePage,
  }) => {
    await loginPage.login(managerUser.username, managerUser.password)
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

    // Create article
    await keystoneArticlePage.createOrbitBlogArticle({ title, slug })

    // Check for help text
    await expect(
      page.locator(
        'span:has-text("Be sure to save changes before previewing your article.")'
      )
    ).toBeVisible()

    // Check for preview button
    await expect(
      page.locator('button:has-text("Preview Article")')
    ).toBeVisible()

    // Start waiting for new page before clicking
    // and Click preview button
    const [article] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('button:has-text("Preview Article")').click(),
    ])

    // go to the portal and ensure article doesn't show
    await page.goto('http://localhost:3000/about-us/orbit-blog/')
    await expect(
      page.locator('h2:has-text("Production team blog & announcements")')
    ).toBeVisible()
    await expect(page.locator(`h3:has-text("${title}")`)).toBeHidden()

    // Ensure preview banner is present
    await expect(
      article.locator('article >> h2:has-text("Draft Article Preview")')
    ).toBeVisible()

    // Ensure article title is present
    await expect(
      article.locator(`article >> h2:has-text("${title}")`)
    ).toBeVisible()

    // return to the CMS and log out
    await page.goto('http://localhost:3001')
    await loginPage.logout()
  })

  test('cannot be seen by portal user', async ({ page, loginPage }) => {
    // try to go to the article as default user
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()

    const defaultResponse = await page.request.get(
      `http://localhost:3000/articles/${slug}`
    )
    expect(defaultResponse.status()).toBe(404)

    // logout of portal user
    await page.locator('[data-testid="header"] [data-testid="button"]').click()
  })

  test('if published banner is not shown', async ({
    page,
    loginPage,
    keystoneListPage,
    keystoneArticlePage,
  }) => {
    await loginPage.login(managerUser.username, managerUser.password)
    await expect(page.locator('text=WELCOME, CHRISTINA HAVEN')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as CHRISTINA.HAVEN.561698119@testusers.cce.af.mil'
      )
    ).toBeVisible()

    /* Navigate to the Articles page */
    await keystoneListPage.gotoAndSortBy('articles')
    await page.locator(`a:has-text("${title}")`).click()
    await keystoneArticlePage.publishArticle()

    // Check for preview button
    await expect(
      page.locator('button:has-text("View Article")')
    ).toBeVisible()

    // Start waiting for new page before clicking
    // and Click preview button
    const [article] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('button:has-text("View Article")').click(),
    ])

    // go to the portal and ensure article doesn't show
    await page.goto('http://localhost:3000/about-us/orbit-blog/')
    await expect(page.locator(`h3:has-text("${title}")`)).toBeVisible()

    // Ensure preview banner is present
    await expect(
      article.locator('article >> h2:has-text("Draft Article Preview")')
    ).toBeHidden()

    // Ensure article title is present
    await expect(
      article.locator(`article >> h2:has-text("${title}")`)
    ).toBeVisible()
  })
})

describe('internal news', () => {
  const title = faker.lorem.words()
  const slug = faker.helpers.slugify(title)

  test('article can be previewed ', async ({
    page,
    loginPage,
    keystoneArticlePage,
  }) => {
    await loginPage.login(managerUser.username, managerUser.password)
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

    // Create article
    await keystoneArticlePage.createInternalNewsArticle({ title, slug })

    // Check for help text
    await expect(
      page.locator(
        'span:has-text("Be sure to save changes before previewing your article.")'
      )
    ).toBeVisible()

    // Check for preview button
    await expect(
      page.locator('button:has-text("Preview Article")')
    ).toBeVisible()

    // Start waiting for new page before clicking
    // and Click preview button
    const [article] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('button:has-text("Preview Article")').click(),
    ])

    // go to the portal and ensure article doesn't show
    await page.goto('http://localhost:3000/news-announcements')
    await expect(
      page.locator('h1:has-text("News & Announcements")')
    ).toBeVisible()

    const carouselCard = page.locator(
      `div:has-text("${title}") > .grid-row >> nth=0`
    )

    await expect(carouselCard).toBeHidden()

    await page.goto(`http://localhost:3000/articles/${slug}`)

    // Ensure preview banner is present
    await expect(
      article.locator('article >> h2:has-text("Draft Article Preview")')
    ).toBeVisible()

    // Ensure article title is present
    await expect(
      article.locator(`article >> h2:has-text("${title}")`)
    ).toBeVisible()

    // return to the CMS and log out
    await page.goto('http://localhost:3001')
    await loginPage.logout()
  })

  test('cannot be seen by portal user', async ({ page, loginPage }) => {
    // try to go to the article as default user
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()

    const defaultResponse = await page.request.get(
      `http://localhost:3000/articles/${slug}`
    )
    expect(defaultResponse.status()).toBe(404)

    // logout of portal user
    await page.locator('[data-testid="header"] [data-testid="button"]').click()
  })

  test('if published banner is not shown', async ({
    page,
    loginPage,
    keystoneListPage,
    keystoneArticlePage,
  }) => {
    await loginPage.login(managerUser.username, managerUser.password)
    await expect(page.locator('text=WELCOME, CHRISTINA HAVEN')).toBeVisible()

    await page.goto('http://localhost:3001')
    await expect(
      page.locator(
        'text=Signed in as CHRISTINA.HAVEN.561698119@testusers.cce.af.mil'
      )
    ).toBeVisible()

    /* Navigate to the Articles page */
    await keystoneListPage.gotoAndSortBy('articles')
    await page.locator(`a:has-text("${title}")`).click()
    await keystoneArticlePage.publishArticle()

    // Check for preview button
    await expect(
      page.locator('button:has-text("View Article")')
    ).toBeVisible()

    // Start waiting for new page before clicking
    // and Click preview button
    const [article] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('button:has-text("View Article")').click(),
    ])

    // go to the portal and ensure article doesn't show
    await page.goto(`http://localhost:3000/articles/${slug}`)

    // Ensure preview banner is present
    await expect(
      article.locator('article >> h2:has-text("Draft Article Preview")')
    ).toBeHidden()

    // Ensure article title is present
    await expect(
      article.locator(`article >> h2:has-text("${title}")`)
    ).toBeVisible()
  })
})
