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
import { KeystoneAnnouncementPage } from '../models/KeystoneAnnouncement'

type CustomFixtures = {
  loginPage: LoginPage
  keystoneAnnouncementPage: KeystoneAnnouncementPage
  keystoneListPage: KeystoneListPage
  keystoneArticlePage: KeystoneArticlePage
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

describe('article was deleted', () => {
  const title = faker.lorem.words()
  const announcementTitle = faker.lorem.words()
  const slug = faker.helpers.slugify(title)

  test('404 link in Call-To-Action when article deleted', async ({page, loginPage, keystoneAnnouncementPage, keystoneListPage, keystoneArticlePage }) => {
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
    await page.getByRole('button', { name: 'Done' }).click()
    await createAnnoucnementButton.click()

    // Publish announcement
    await keystoneAnnouncementPage.publishAnnouncement()

    // Delete article
    //   Navigate to the Articles page
    await keystoneListPage.gotoAndSortBy('articles')
    await page.locator(`a:has-text("${title}")`).click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('dialog', { name: 'Delete Confirmation' }).getByRole('button', { name: 'Delete' }).click()

    //   Verify the article 404's now
    const articlePageResponse = await page.request.get(
      `http://localhost:3000/articles/${slug}`
    )
    expect(articlePageResponse.status()).toBe(404)
    
    // navigate to home page to see the annoucnement
    await page.goto('http://localhost:3000')

    // Check for the CTA
    await expect(page.getByRole('heading', { name: announcementTitle })).toBeVisible()
    const viewMore = page.getByRole('link', { name: 'View more' })
    await expect(viewMore).toBeVisible()
    const href = await viewMore.getAttribute('href')
    expect(href).toBe('/404')
    const ctaLinkResponse = await page.request.get(
      `http://localhost:3000${href}`
    )
    expect(ctaLinkResponse.status()).toBe(404)

    // logout of portal user
    await page.locator('[data-testid="header"] [data-testid="button"]').click()
  })
})

describe('article does not exsist', () => {
  const title = faker.lorem.words()
  const slug = faker.helpers.slugify(title)

  test('404 shown to portal user', async ({ page, loginPage }) => {
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

  // This is here because of article preview logic that caused 500 errors when a CMS user loaded a non-existent article
  test('404 shown to cms user', async ({ page, loginPage }) => {
    // try to go to the article as default user
    await loginPage.login(managerUser.username, managerUser.password)
    await expect(page.locator('text=WELCOME, CHRISTINA HAVEN')).toBeVisible()

    const defaultResponse = await page.request.get(
      `http://localhost:3000/articles/${slug}`
    )
    expect(defaultResponse.status()).toBe(404)

    // logout of portal user
    await page.locator('[data-testid="header"] [data-testid="button"]').click()
  })
})
