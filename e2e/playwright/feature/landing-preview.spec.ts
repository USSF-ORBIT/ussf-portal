import { test as base } from '@playwright/test'
import { faker } from '@faker-js/faker'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { adminUser, portalUser1 } from '../cms/database/users'
import { LoginPage } from '../models/Login'

type CustomFixtures = {
  loginPage: LoginPage
}

const test = base.extend<TestingLibraryFixtures & CustomFixtures>({
  ...fixtures,
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
})

const { expect } = test

const tagTitle = faker.lorem.words()
const landingPageTitle = faker.lorem.words()
const landingPageSlug = faker.helpers.slugify(landingPageTitle)
const landingPageDescription = faker.lorem.words()

test('can create a draft landing page in the CMS and view it in the portal', async ({
  page,
  loginPage,
}) => {
  await loginPage.login(adminUser.username, adminUser.password)

  await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()

  await page.goto('http://localhost:3001/')

  await expect(
    page.locator('text=FLOYD.KING.376144527@testusers.cce.af.mil')
  ).toBeVisible()

  // Create Landing Page
  await page.getByRole('link', { name: 'Landing Page', exact: true }).click()
  await page.waitForSelector('text=Create Landing Page')
  await page.getByRole('link', { name: 'Create Landing Page' }).click()
  await page.getByLabel('Page Title').click()
  await page.getByLabel('Page Title').fill(landingPageTitle)
  await page.getByLabel('Slug').click()
  await page.getByLabel('Slug').fill(landingPageSlug)
  await page.getByLabel('Page Description').click()
  await page.getByLabel('Page Description').fill(landingPageDescription)

  // Add collections
  await page.getByRole('group', { name: 'Collections' }).locator('svg').click()
  await page.getByText('Career', { exact: true }).click()

  // Add tag
  await page.getByRole('button', { name: 'Create related Tag' }).click()
  await page.getByLabel('Name').click()
  await page.getByLabel('Name').fill(tagTitle)
  await page.getByRole('button', { name: 'Create Tag' }).click()

  // Save Landing Page
  await page.getByRole('button', { name: 'Create Landing Page' }).click()

  await expect(page.getByRole('radio', { name: 'Draft' })).toBeChecked()
  await expect(page.getByRole('button', { name: 'Preview Landing Page' })).toBeVisible()

  // Start waiting for new page before clicking
  // and Click preview button
  const [landing] = await Promise.all([
    page.waitForEvent('popup'),
    page.locator('button:has-text("Preview Landing Page")').click(),
  ])

  // Ensure preview banner is present
  await expect(
    landing.getByRole('heading', { name: 'Draft Landing Page Preview' })
  ).toBeVisible()

  // Ensure title is present
  await expect(
    landing.getByRole('heading', { name: landingPageTitle })
  ).toBeVisible()

  // close the tab
  await landing.close()

  // ensure the landing page is on the index page and has it's tag
  await page.goto('http://localhost:3000')
  await page.getByRole('link', { name: 'Landing Pages' }).click()
  await expect(page.getByRole('cell', { name: `${landingPageTitle} Draft`, exact: true })).toBeVisible()

  // return to the CMS and log out
  await page.goto('http://localhost:3001')
  await loginPage.logout()
})

test('draft landing page cannot be seen by portal user', async ({
  page,
  loginPage,
}) => {
  // try to go to the landing page as default user
  await loginPage.login(portalUser1.username, portalUser1.password)
  await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()

  await page.getByRole('link', { name: 'Landing Pages' }).click()
  await expect(
    page.getByRole('heading', { name: 'Landing Pages' })
  ).toBeVisible()

  await expect(page.getByRole('cell', { name: `${landingPageTitle} Draft`, exact: true })).toBeHidden()
  // Try to Navigate to the landing page
  await expect(page.getByRole('link', { name: landingPageTitle })).toBeHidden()
  const defaultResponse = await page.request.get(
    `http://localhost:3000/landing/${landingPageSlug}`
  )
  expect(defaultResponse.status()).toBe(404)

  // logout of portal user
  await page.locator('[data-testid="header"] [data-testid="button"]').click()
})
