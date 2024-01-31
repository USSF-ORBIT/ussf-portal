import { test as base } from '@playwright/test'
import { faker } from '@faker-js/faker'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { adminUser } from '../cms/database/users'
import { LoginPage } from '../models/Login'
import { KeystoneArticlePage } from '../models/KeystoneArticle'

type CustomFixtures = {
  loginPage: LoginPage
  keystoneArticlePage: KeystoneArticlePage
}

const test = base.extend<TestingLibraryFixtures & CustomFixtures>({
  ...fixtures,
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
  keystoneArticlePage: async ({ page, context }, use) => {
    await use(new KeystoneArticlePage(page, context))
  },
})

const { expect } = test

test('can create an article with an embedded video', async ({
  page,
  loginPage,
  keystoneArticlePage,
}) => {
  await loginPage.login(adminUser.username, adminUser.password)
  await expect(page.locator(`text=WELCOME, ${adminUser.name}`)).toBeVisible()

  await page.goto('http://localhost:3001')
  await expect(
    page.locator(`text=Signed in as ${adminUser.userId}`)
  ).toBeVisible()

  /* Navigate to the Articles page */
  await Promise.all([
    page.waitForNavigation(),
    page.locator('h3:has-text("Articles")').click(),
  ])

  const title = faker.lorem.words()
  const slug = faker.helpers.slugify(title)
  const videoLink = 'https://youtu.be/dh4uUt3Bbjs'

  // Create article
  await keystoneArticlePage.createInternalNewsArticle({
    title,
    slug,
    videoLink,
  })

  // Go to portal to view article
  await page.goto(`http://localhost:3000/articles/${slug}`)
  await expect(page.locator(`text=${title}`)).toBeVisible()

  await expect(
    page.frameLocator('iframe').locator('[aria-label="Play"]')
  ).toBeVisible()

  // We want to check that the embed IDs match
  const embedId = (await page.locator('iframe').getAttribute('src'))?.split(
    '/embed/'
  )[1]
  const videoLinkId = videoLink.split('/')[3]
  expect(embedId).toBe(videoLinkId)
})
