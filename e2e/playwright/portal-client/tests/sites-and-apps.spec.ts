import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

import { LoginPage } from '../../models/Login'
import { seedDB } from '../database/seedMongo'
import { portalUser1 } from '../../cms/database/users'

type CustomFixtures = {
  loginPage: LoginPage
}

const test = base.extend<TestingLibraryFixtures & CustomFixtures>({
  ...fixtures,
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
})

const { describe, expect } = test

test.beforeAll(async () => {
  await seedDB()
})

describe('Sites & Applications', () => {
  test('can visit the Sites & Applications page', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.getByTestId('personal-data')).toHaveText(
      `Welcome, ${portalUser1.displayName}`
    )

    // Navigate to /sites-and-applications using the side nav
    await page.locator('text=All sites & applications').click()
    await expect(
      page.getByRole('heading', { name: 'Sites & Applications By type' })
    ).toBeVisible()

    // Check that default collections are displaying
    await expect(page.locator('text=Personnel & Administration')).toBeVisible()
    await expect(page.locator('text=Finance & Travel')).toBeVisible()
    await expect(page.locator('text=Public Military Websites')).toBeVisible()

    // Toggle sorting to Alpha view
    await page.getByTestId('navDropDownButton').click()
    await page.getByRole('button', { name: 'Alphabetically' }).click()
    await expect(
      page.getByRole('button', { name: 'Alphabetically' })
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'By type' })).toBeHidden()
    await expect(
      page.locator(
        'text=Provides direct Civil Engineer information management support to active Air Force units, the Air National Guard, and the Air Force Reserve, during peace and war, at fixed main bases, bare bases, and deployed locations.'
      )
    ).toBeVisible()

    // Toggle sorting to Type view
    await page.getByTestId('navDropDownButton').click()
    await page.getByRole('button', { name: 'By type' }).click()
    await expect(page.getByRole('button', { name: 'By type' })).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Alphabetically' })
    ).toBeHidden()
    await expect(
      page.locator(
        'text=Provides direct Civil Engineer information management support to active Air Force units, the Air National Guard, and the Air Force Reserve, during peace and war, at fixed main bases, bare bases, and deployed locations.'
      )
    ).toBeHidden()
  })

  test('can add collections from the Sites & Applications page to My Space', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.getByTestId('personal-data')).toHaveText(
      `Welcome, ${portalUser1.displayName}`
    )

    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Click 'Add Widget' and navigate to /sites-and-applications
    await page.locator('text=Add widget').click()
    await page.locator('text=Select collection from template').click()
    await expect(page).toHaveURL(
      'http://localhost:3000/sites-and-applications?selectMode=true'
    )

    // Add three collections from Sites & Apps, unselect one, and navigate back to My Space
    await page
      .locator('[aria-label="Select collection Personnel \\& Administration"]')
      .click()
    await page.locator('[aria-label="Select collection Career"]').click()
    await page
      .locator('[aria-label="Select collection Medical \\& Dental"]')
      .click()
    await expect(page.locator('text=3 collections selected')).toBeVisible()
    await page
      .locator('[aria-label="Unselect collection Medical \\& Dental"]')
      .click()
    await expect(page.locator('text=2 collections selected')).toBeVisible()
    await page.locator('text=Add selected').click()
    await expect(page).toHaveURL('http://localhost:3000/')

    // Check that new collections are in My Space
    await expect(page.locator('text=Personnel & Administration')).toBeVisible()
    await expect(page.locator('text=Career')).toBeVisible()
  })

  test('can add links to a new collection from the Sites & Applications page', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.getByTestId('personal-data')).toHaveText(
      `Welcome, ${portalUser1.displayName}`
    )
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Navigate to /sites-and-applications
    await page.locator('text=All sites & applications').click()
    await expect(page).toHaveURL('http://localhost:3000/sites-and-applications')

    // Add the ACES bookmark to a new collection in My Space
    await page.getByTestId('navDropDownButton').click()
    await page.getByRole('button', { name: 'Alphabetically' }).click()

    await page
      .locator(
        'text=ACES(opens in a new window)Provides direct Civil Engineer information management >> [data-testid="button"]'
      )
      .click()
    await page.locator('text=Add to new collection').click()
    await expect(page).toHaveURL('http://localhost:3000/')
    await page
      .locator('[placeholder="Name this collection"]')
      .fill('Test adding from sites and apps')
    await page.locator('text=Save name').click()
    await expect(
      page.locator('text=Test adding from sites and apps')
    ).toBeVisible()
    await expect(page.locator('text=ACES(opens in a new window)')).toBeVisible()
  })

  test('can add links to an existing collection from the Sites & Applications page', async ({
    page,
    loginPage,
  }) => {
    // Login and check that user is in My Space
    await loginPage.login(portalUser1.username, portalUser1.password)
    await expect(page.getByTestId('personal-data')).toHaveText(
      `Welcome, ${portalUser1.displayName}`
    )
    await expect(page.locator('text=Example Collection')).toBeVisible()

    // Navigate to /sites-and-applications
    await page.locator('text=All sites & applications').click()
    await expect(page).toHaveURL('http://localhost:3000/sites-and-applications')

    // Add 'Air University' bookmark to 'Example Collection' in My space

    await page.getByTestId('navDropDownButton').click()
    await page.getByRole('button', { name: 'Alphabetically' }).click()
    await page
      .locator(
        'text=Air University(opens in a new window)A center for professional military educatio >> [data-testid="button"]'
      )
      .click()
    await page.locator('text=Example Collection').click()

    // Navigate back to My Space
    await page.locator('[data-testid="sidenav"] >> text=My Space').click()
    await expect(page).toHaveURL('http://localhost:3000/')
    await expect(page.locator('text=Example Collection')).toBeVisible()
    await expect(
      page.locator('text=Air University(opens in a new window)')
    ).toBeVisible()
  })
})
