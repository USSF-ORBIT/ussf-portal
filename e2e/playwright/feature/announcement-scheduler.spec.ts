import { test as base } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
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

test('announcement published with future date cannot be seen', async ({
  page,
  loginPage,
  keystoneAnnouncementPage,
}) => {
  await loginPage.login(managerUser.username, managerUser.password)
  await expect(page.locator(`text=WELCOME, ${managerUser.name}`)).toBeVisible()

  await page.goto('http://localhost:3001')
  await expect(
    page.locator(`text=Signed in as ${managerUser.userId}`)
  ).toBeVisible()

  // Navigate to Announcements page
  await Promise.all([
    page.waitForNavigation(),
    page.locator('h3:has-text("Announcements")').click(),
  ])

  const title = faker.lorem.words()

  const futureDate = DateTime.now().plus({ hours: 2 })

  // Create announcement
  await page.locator('text=Create Announcement').click()
  await expect(page).toHaveURL('http://localhost:3001/announcements/create')
  await page.locator('input[type="text"]').fill(title)
  await page.locator('button:has-text("Create Announcement")').click()

  // Publish announcement with a future date
  await keystoneAnnouncementPage.publishAnnouncement({
    publishedDate: futureDate,
  })

  // Check that the button has the correct date
  await expect(
    page.locator(`button:has-text("${futureDate.toFormat('MM/dd/yyyy')}")`)
  ).toBeVisible()

  await expect(page.locator(`input[placeholder="00:00"]`)).toHaveValue(
    futureDate.toFormat('HH:mm')
  )

  // Navigate to portal and verify that the announcement is not visible
  await page.goto('http://localhost:3000/')
  await expect(page.locator(`text=WELCOME, ${managerUser.name}`)).toBeVisible()
  await expect(page.locator(title)).toBeHidden()
})
