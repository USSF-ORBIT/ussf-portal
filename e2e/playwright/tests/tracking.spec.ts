import { test as base } from '@playwright/test'

import { LoginPage } from '../models/Login'
import { resetDb } from '../database/seed'

const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
})

const { describe, expect } = test

test.beforeAll(async () => {
  await resetDb()
})

test.afterAll(async () => {
  await resetDb()
})

describe('Event logging', () => {
  test('making changes to the data automatically creates events', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login('cmsuser', 'cmsuserpass')

    await expect(page.locator('text=WELCOME, JOHN HENKE')).toBeVisible()
    await page.goto('/')

    await Promise.all([
      page.waitForNavigation(),
      page.locator('[aria-label="Side Navigation"] >> text=Users').click(),
    ])

    await expect(page.locator('h1:has-text("Users")')).toBeVisible()

    await Promise.all([
      page.waitForNavigation(),
      page
        .locator('a:has-text("JOHN.HENKE.562270783@testusers.cce.af.mil")')
        .click(),
    ])

    await expect(
      page.locator('legend:has-text("Updated By") + div')
    ).toHaveText('Select...')

    await page.fill('#name', 'Johnathan Henke')
    await page.locator('button span:has-text("Save changes")').click()

    await expect(
      page.locator(
        'legend:has-text("Updated By") + div:has-text("JOHN.HENKE.562270783@testusers.cce.af.mil")'
      )
    ).toBeVisible()

    await loginPage.logout()

    await loginPage.login('cmsadmin', 'cmsadminpass')
    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()
    await page.goto('http://localhost:3001')
    await Promise.all([
      page.waitForNavigation(),
      page.locator('[aria-label="Side Navigation"] >> text=Events').click(),
    ])

    await Promise.all([
      page.waitForNavigation(),
      page.locator('a:left-of(:text("update User"), 20)').click(),
    ])

    await expect(page.locator('label:has-text("Input Data") + div'))
      .toHaveText(`{
  "name": "Johnathan Henke"
}`)

    await expect(
      page.locator(
        'legend:has-text("Actor") + div:has-text("JOHN.HENKE.562270783@testusers.cce.af.mil")'
      )
    ).toBeVisible()
  })
})
