import { test as base } from '@playwright/test'
import { faker } from '@faker-js/faker'

import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { managerUser } from '../cms/database/users'
import { LoginPage } from '../models/Login'
import { KeystoneAnnouncementPage } from '../models/KeystoneAnnouncement'

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
})

const { expect } = test

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
