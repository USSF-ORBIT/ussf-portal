import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { adminUser } from '../cms/database/users'
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

test('can add/remove Weather widget to My Space', async ({
  page,
  loginPage,
}) => {
  await loginPage.login(adminUser.username, adminUser.password)

  await expect(page.locator(`text=WELCOME, ${adminUser.name}`)).toBeVisible()

  // Add Weather widget
  await page.getByRole('button', { name: 'Add widget' }).click()
  await page.getByRole('button', { name: 'Add weather widget' }).click()
  await page.getByTestId('weatherWidget_input').fill('90210')

  await page.getByRole('button', { name: 'Save zip code' }).click()

  await expect(page.locator('text=Beverly Hills, CA')).toBeVisible()

  // Edit Weather widget
  await page
    .getByRole('button', {
      name: 'Weather settings for Beverly Hills, CA',
      exact: true,
    })
    .click()
  await page.getByRole('button', { name: 'Edit zip code', exact: true }).click()
  await page.getByTestId('weatherWidget_input').fill('85202')

  await page.getByRole('button', { name: 'Save zip code' }).click()

  await expect(page.locator('text=Tempe, AZ')).toBeVisible()

  // Remove Weather widget
  await page
    .getByRole('button', {
      name: 'Weather settings for Tempe, AZ',
      exact: true,
    })
    .click()
  await page
    .getByRole('button', {
      name: 'Remove weather widget for Tempe, AZ',
      exact: true,
    })
    .click()
  await page.getByRole('button', { name: 'Delete' }).click()

  await expect(page.locator('text=Weather')).toBeHidden()
  await expect(page.locator('text=Tempe, AZ')).toBeHidden()
})

test('can only add five Weather widgets', async ({ page, loginPage }) => {
  test.slow()

  await loginPage.login(adminUser.username, adminUser.password)

  await expect(page.locator(`text=WELCOME, ${adminUser.name}`)).toBeVisible()

  // Add Weather widget
  await page.getByRole('button', { name: 'Add widget' }).click()
  await page.getByRole('button', { name: 'Add weather widget' }).click()
  await page.getByTestId('weatherWidget_input').fill('90210')

  await page.getByRole('button', { name: 'Save zip code' }).click()

  await expect(page.locator('text=Beverly Hills, CA')).toBeVisible()

  // Add Weather widget
  await page.getByRole('button', { name: 'Add widget' }).click()
  await page.getByRole('button', { name: 'Add weather widget' }).click()
  await page.getByTestId('weatherWidget_input').fill('85202')

  await page.getByRole('button', { name: 'Save zip code' }).click()

  await expect(page.locator('text=Tempe, AZ')).toBeVisible()

  // Add Weather widget
  await page.getByRole('button', { name: 'Add widget' }).click()
  await page.getByRole('button', { name: 'Add weather widget' }).click()
  await page.getByTestId('weatherWidget_input').fill('85001')

  await page.getByRole('button', { name: 'Save zip code' }).click()

  await expect(page.locator('text=Guadalupe, AZ')).toBeVisible()

  // Add Weather widget
  await page.getByRole('button', { name: 'Add widget' }).click()
  await page.getByRole('button', { name: 'Add weather widget' }).click()
  await page.getByTestId('weatherWidget_input').fill('30310')

  await page.getByRole('button', { name: 'Save zip code' }).click()

  await expect(page.locator('text=Atlanta, GA')).toBeVisible()

  // Add Weather widget
  await page.getByRole('button', { name: 'Add widget' }).click()
  await page.getByRole('button', { name: 'Add weather widget' }).click()
  await page.getByTestId('weatherWidget_input').fill('60601')

  await page.getByRole('button', { name: 'Save zip code' }).click()

  await expect(page.locator('text=Chicago, IL')).toBeVisible()

  // Check that Add Weather widget button is disabled
  await page.getByRole('button', { name: 'Add widget' }).click()
  await expect(page.locator('text=Add weather widget')).toBeDisabled()
})
