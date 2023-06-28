import { test as base } from '@playwright/test'
import { faker } from '@faker-js/faker'

import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { managerUser } from '../cms/database/users'
import { LoginPage } from '../models/Login'
import { KeystoneAnnouncementPage } from '../models/KeystoneAnnouncement'
import { KeystoneListPage } from '../models/KeystoneList'
import { KeystoneArticlePage } from '../models/KeystoneArticle'

type CustomFixtures = {
  loginPage: LoginPage
  keystoneAnnouncementPage: KeystoneAnnouncementPage
}

const test = base.extend<TestingLibraryFixtures & CustomFixtures>({
  ...fixtures,
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
  keystoneAnnouncementPage: async ({ page, context }, use) => {
    await use(new KeystoneAnnouncementPage(page, context))
  },
  keystoneListPage: async ({ page, context }, use) => {
    await use(new KeystoneListPage(page, context))
  },
  keystoneArticlePage: async ({ page, context }, use) => {
    await use(new KeystoneArticlePage(page, context))
  },
})

const { describe, expect } = test

test('announcements can be seen in carousel and accessible page', async ({
  page,
  loginPage,
  keystoneAnnouncementPage,
}) => {
  await loginPage.login(managerUser.username, managerUser.password)
  await expect(page.locator('text=WELCOME, CHRISTINA HAVEN')).toBeVisible()

  await page.goto('http://localhost:3001')
  await expect(
    page.locator(
      'text=Signed in as CHRISTINA.HAVEN.561698119@testusers.cce.af.mil'
    )
  ).toBeVisible()

  // Navigate to Announcements page
  await Promise.all([
    page.waitForNavigation(),
    page.locator('h3:has-text("Announcements")').click(),
  ])

  const title = faker.lorem.words()

  // Create announcement
  await page.locator('text=Create Announcement').click()
  await expect(page).toHaveURL('http://localhost:3001/announcements/create')
  await page.locator('input[type="text"]').fill(title)
  await page.locator('button:has-text("Create Announcement")').click()

  // Publish announcement
  await keystoneAnnouncementPage.publishAnnouncement()

  // Navigate to portal and verify that the announcement is visible
  await page.goto('http://localhost:3000/')
  await expect(page.locator('text=WELCOME, CHRISTINA HAVEN')).toBeVisible()

  await expect(
    page.getByRole('heading', { level: 4, name: title })
  ).toBeVisible()

  // Focus the screen reader-only link
  const accessibleLink = page.locator(
    'a:has-text("Latest Announcements in Accessible Format (opens in a new tab)")'
  )
  await accessibleLink.focus()

  // Wait for the Latest Announcements page to load
  const popupPromise = page.waitForEvent('popup')
  await page.keyboard.press('Enter')

  const announcementsPage = await popupPromise
  await announcementsPage.waitForLoadState()

  // Confirm the page loads and the new announcement is visible
  expect(announcementsPage.url()).toBe('http://localhost:3000/announcements')
  await expect(announcementsPage.locator(`text=${title}`)).toBeVisible()
})

describe('announcment with call to action', () => {
  const title = faker.lorem.words()
  const announcementTitle = faker.lorem.words()
  const slug = faker.helpers.slugify(title)

  test('using article', async ({page, loginPage, keystoneAnnouncementPage, keystoneListPage, keystoneArticlePage }) => {
    // login as manager
    await loginPage.login(managerUser.username, managerUser.password)
    await expect(page.locator('text=WELCOME, CHRISTINA HAVEN')).toBeVisible()

    // login as manager to the CMS
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

    // Publish article
    await keystoneArticlePage.publishArticle()

    // Navigate to Announcements page
    await Promise.all([
      page.waitForNavigation(),
      page.locator('a:has-text("Announcements")').click(),
    ])

    // Create announcement
    await page.locator('text=Create Announcement').click()
    await expect(page).toHaveURL('http://localhost:3001/announcements/create')
    await page.locator('input[type="text"]').fill(announcementTitle)

    // Add a CTA linking to an article
    await page.waitForSelector('button:has-text("Create Announcement")')
    // TODO: Is there a better selector for this button?
    await page.locator('.css-b3pn3b > .css-150h8ib').click()
    await page.getByRole('button', { name: 'Call To Action' }).click()
    await page.getByRole('button', { name: 'Edit' }).click()
    // TODO: Is there a better selector for this button?
    await page.locator('.css-ackcql').click()
    await page.getByText('Article', { exact: true }).click()
    // Tried to find the article in the drop down but it didn't work consistently.
    // 1. it worked when stepping
    // 2. it failed when run without a pause
    // await page.getByText(title, { exact: true }).click()
    const createAnnoucnementButton = page.locator('button:has-text("Create Announcement")')
    await expect(createAnnoucnementButton).toBeVisible()
    await page.locator('#react-select-15-input').fill(title)
    await page.locator('#react-select-15-input').press('Enter')
    await page.locator('button:has-text("Done")').click()
    await createAnnoucnementButton.click()

    // Publish announcement
    await keystoneAnnouncementPage.publishAnnouncement()

    // navigate to home page to see the annoucnement
    await page.goto('http://localhost:3000')

    // Check for the CTA
    await expect(page.getByRole('heading', { name: announcementTitle })).toBeVisible()
    const viewMore = page.getByRole('link', { name: 'View more' })
    await expect(viewMore).toBeVisible()
    const href = await viewMore.getAttribute('href')
    expect(href).toBe(`/articles/${slug}`)
    const ctaLinkResponse = await page.request.get(
      `http://localhost:3000${href}`
    )
    expect(ctaLinkResponse.status()).toBe(200)

    // logout of portal user
    await page.locator('[data-testid="header"] [data-testid="button"]').click()
  })
})
