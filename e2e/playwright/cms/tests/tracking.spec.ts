import { test as base } from '@playwright/test'
import { LoginPage } from '../../models/Login'
import { adminUser, defaultUser } from '../database/users'

const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
})

const { describe, expect } = test

describe('Event logging', () => {
  test('making changes to the data automatically creates events', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login(defaultUser.username, defaultUser.password)

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

    await page.fill('#name', 'Johnathan Henke')
    await page.locator('button span:has-text("Save changes")').click()

    await expect(
      page.locator(
        'legend:has-text("Updated By") + div:has-text("JOHN.HENKE.562270783@testusers.cce.af.mil")'
      )
    ).toBeVisible()

    await loginPage.logout()

    await loginPage.login(adminUser.username, adminUser.password)
    await expect(page.locator('text=WELCOME, FLOYD KING')).toBeVisible()
    await page.goto('http://localhost:3001')
    await Promise.all([
      page.waitForNavigation(),
      page.locator('[aria-label="Side Navigation"] >> text=Events').click(),
    ])

    // Sort events in descending order and choose the first
    // This will pull up the most recent event
    await page.locator('button:has-text("No field")').click()

    await page.locator('input[role="combobox"]').fill('updated')
    await page.locator('input[role="combobox"]').press('Enter')
    await expect(page).toHaveURL(
      'http://localhost:3001/events?sortBy=updatedAt'
    )
    // Must re-click 'Updated At' dropdown option to get to descending order
    await page.locator('button:has-text("Updated At ascending")').click()
    await page.locator('input[role="combobox"]').fill('updated')
    await page.locator('input[role="combobox"]').press('Enter')

    await Promise.all([
      page.waitForNavigation(),
      page.locator('a:left-of(:text("update User"))>>nth=0').click(),
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
