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

test('can view filtered article results with a specific tag or label', async ({
  page,
  loginPage,
  keystoneArticlePage,
}) => {
  test.slow()

  const title = faker.lorem.words()
  const slug = faker.helpers.slugify(title)
  const tag = faker.lorem.words()
  const label = faker.lorem.words()

  await loginPage.login(adminUser.username, adminUser.password)
  await expect(page.locator(`text=WELCOME, ${adminUser.name}`)).toBeVisible()

  await page.goto('http://localhost:3001')
  await expect(
    page.locator(`text=Signed in as ${adminUser.userId}`)
  ).toBeVisible()

  /* Create a label from the Labels page */
  await page
    .getByRole('navigation', { name: 'Side Navigation' })
    .getByRole('link', { name: 'Labels' })
    .click()

  await page.getByRole('link', { name: 'Create Label' }).click()
  await page.getByLabel('Name').click()
  await page.getByLabel('Name').fill(label)
  await page.locator('.css-ackcql').click()
  await page.getByText('Audience', { exact: true }).click()
  await page.getByRole('button', { name: 'Create Label' }).click()

  /* Create a tag from the Tags page */
  await page
    .getByRole('navigation', { name: 'Side Navigation' })
    .getByRole('link', { name: 'Tags' })
    .click()
  await page.getByRole('link', { name: 'Create Tag' }).click()
  await page.getByLabel('Name').click()
  await page.getByLabel('Name').fill(tag)
  await page.getByRole('button', { name: 'Create Tag' }).click()

  /* Create an article with the new label and tag */

  /* Navigate to the Articles page */
  await page
    .getByRole('navigation', { name: 'Side Navigation' })
    .getByRole('link', { name: 'Articles' })
    .click()

  // Create article
  await keystoneArticlePage.createInternalNewsArticle({
    title,
    slug,
    label,
    tag,
  })

  // Publish article
  await keystoneArticlePage.publishArticle()

  /* Navigate to the Portal and confirm tag */
  await page.goto(`http://localhost:3000/articles/${slug}`)
  await expect(page.locator(`text=${title}`)).toBeVisible()
  await expect(page.locator(`text=${tag}`)).toBeVisible()

  /* Click on the tag and verify the tag results page */
  await page.getByText(tag).click()
  await expect(page.getByRole('heading', { level: 2, name: tag })).toBeVisible()

  /* Navigate to the Portal and confirm label */
  await page.goto(`http://localhost:3000/articles/${slug}`)
  await expect(page.locator(`text=${title}`)).toBeVisible()
  await expect(page.locator(`text=${label}`)).toBeVisible()

  /* Click on the tag and verify the tag results page */
  await page.getByText(label).click()
  await expect(
    page.getByRole('heading', { level: 2, name: label })
  ).toBeVisible()
})
