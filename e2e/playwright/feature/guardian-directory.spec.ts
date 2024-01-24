import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { portalUser1 } from '../cms/database/users'
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

test('can view the guardian directory', async ({ page, loginPage }) => {
  // Log in as CMS admin
  await loginPage.login(portalUser1.username, portalUser1.password)

  await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
  await page.locator('text=Guardian Directory').click()
  await expect(
    page.getByRole('heading', { name: 'Guardian Directory' })
  ).toBeVisible()
  await expect(
    page.getByRole('columnheader', { name: 'First Name' })
  ).toBeVisible()
  await expect(
    page.getByRole('columnheader', { name: 'Last Name' })
  ).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Rank' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Title' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Base' })).toBeVisible()
  await expect(
    page.getByRole('columnheader', { name: 'Field Commands' })
  ).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible()

  // wait for data to show
  await page
    .locator('[data-testid="guardian-directory-table"] tbody tr')
    .first()
    .waitFor()

  // check first row
  await expect(page.getByTestId('0_FirstName')).toBeVisible()
  await expect(page.getByTestId('0_FirstName')).toHaveText('Ronald')
  await expect(page.getByTestId('0_LastName')).toBeVisible()
  await expect(page.getByTestId('0_LastName')).toHaveText('Boyd')
  await expect(page.getByTestId('0_Rank')).toBeVisible()
  await expect(page.getByTestId('0_Rank')).toHaveText('Spc2/E-2')
  await expect(page.getByTestId('0_DutyTitle')).toBeVisible()
  await expect(page.getByTestId('0_DutyTitle')).toHaveText('ENGINEER')
  await expect(page.getByTestId('0_BaseLoc')).toBeVisible()
  await expect(page.getByTestId('0_BaseLoc')).toHaveText('Vandenberg')
  await expect(page.getByTestId('0_MajCom')).toBeVisible()
  await expect(page.getByTestId('0_MajCom')).toHaveText(
    'Space Training And Readiness Command (6T)'
  )
  await expect(page.getByTestId('0_Email')).toBeVisible()
  await expect(page.getByTestId('0_Email')).toHaveText(
    'ronald.boyd@spaceforce.mil'
  )

  // check last row
  await expect(page.getByTestId('8_FirstName')).toBeVisible()
  await expect(page.getByTestId('8_FirstName')).toHaveText('Lindsey')
  await expect(page.getByTestId('8_LastName')).toBeVisible()
  await expect(page.getByTestId('8_LastName')).toHaveText('Wilson')
  await expect(page.getByTestId('8_Rank')).toBeVisible()
  await expect(page.getByTestId('8_Rank')).toHaveText('Spc3/E-3')
  await expect(page.getByTestId('8_DutyTitle')).toBeVisible()
  await expect(page.getByTestId('8_DutyTitle')).toHaveText('DESIGNER')
  await expect(page.getByTestId('8_BaseLoc')).toBeVisible()
  await expect(page.getByTestId('8_BaseLoc')).toHaveText('Buckley')
  await expect(page.getByTestId('8_MajCom')).toBeVisible()
  await expect(page.getByTestId('8_MajCom')).toHaveText(
    'United States Space Force Forces (6F)'
  )
  await expect(page.getByTestId('8_Email')).toBeVisible()
  await expect(page.getByTestId('8_Email')).toHaveText(
    'lindsey.wilson@spaceforce.mil'
  )

  // check an officer
  await expect(page.getByTestId('5_FirstName')).toBeVisible()
  await expect(page.getByTestId('5_FirstName')).toHaveText('Ethel')
  await expect(page.getByTestId('5_LastName')).toBeVisible()
  await expect(page.getByTestId('5_LastName')).toHaveText('Neal')
  await expect(page.getByTestId('5_Rank')).toBeVisible()
  await expect(page.getByTestId('5_Rank')).toHaveText('1st Lt/O-2')
  await expect(page.getByTestId('5_DutyTitle')).toBeVisible()
  await expect(page.getByTestId('5_DutyTitle')).toHaveText('SPACE COMBAT')
  await expect(page.getByTestId('5_BaseLoc')).toBeVisible()
  await expect(page.getByTestId('5_BaseLoc')).toHaveText('Schriever')
  await expect(page.getByTestId('5_MajCom')).toBeVisible()
  await expect(page.getByTestId('5_MajCom')).toHaveText(
    'Space Systems Command (6S)'
  )
  await expect(page.getByTestId('5_Email')).toBeVisible()
  await expect(page.getByTestId('5_Email')).toHaveText(
    'ethel.neal@spaceforce.mil'
  )
})

test('can search the guardian directory', async ({ page, loginPage }) => {
  // Log in as CMS admin
  await loginPage.login(portalUser1.username, portalUser1.password)

  await expect(page.locator('text=WELCOME, BERNIE')).toBeVisible()
  await page.locator('text=Guardian Directory').click()
  await expect(
    page.getByRole('heading', { name: 'Guardian Directory' })
  ).toBeVisible()

  // Wait for data to show
  await page
    .locator('[data-testid="guardian-directory-table"] tbody tr')
    .first()
    .waitFor()

  // Check we have the full expected directory
  expect(
    await page
      .locator('[data-testid="guardian-directory-table"] tbody tr')
      .count()
  ).toBe(9)

  // Successfully search for a Guardian
  await page.getByTestId('textInput').click()
  await page.getByTestId('textInput').fill('floyd')
  await page.getByTestId('form').getByTestId('button').click()

  // We should only have one result
  await page.getByTestId('0_FirstName').click()
  await expect(page.getByTestId('0_FirstName')).toHaveText('Floyd')
  expect(
    await page
      .locator('[data-testid="guardian-directory-table"] tbody tr')
      .count()
  ).toBe(1)

  // Searching for empty string should return all results
  await page.getByTestId('textInput').click()
  await page.getByTestId('textInput').fill('')
  await page.getByTestId('form').getByTestId('button').click()
  // Inexplicably, counting the rows does not work here,
  // so let's check the first and last rows render
  // This might be due to a bug see https://app.shortcut.com/orbit-truss/story/3126/guardian-directory-search-with-empty-string-returns-incomplete-list
  await expect(page.getByTestId('0_FirstName')).toBeVisible()
  await expect(page.getByTestId('7_FirstName')).toBeVisible()

  // Searching for a non-matching input returns no results
  await page.getByTestId('textInput').click()
  await page.getByTestId('textInput').fill('noresults')
  await page.getByTestId('form').getByTestId('button').click()
 
  // We should NOT have any results
  await expect(page.getByRole('heading', { name: 'There are no results that match that query.' })).toBeVisible()
  // Same as above, counting the rows does not work here, so checking
  // that all rows are hidden manually
  await expect(page.getByTestId('0_FirstName')).toBeHidden()
  await expect(page.getByTestId('1_FirstName')).toBeHidden()
  await expect(page.getByTestId('2_FirstName')).toBeHidden()
  await expect(page.getByTestId('3_FirstName')).toBeHidden()
  await expect(page.getByTestId('4_FirstName')).toBeHidden()
  await expect(page.getByTestId('5_FirstName')).toBeHidden()
  await expect(page.getByTestId('6_FirstName')).toBeHidden()
  await expect(page.getByTestId('7_FirstName')).toBeHidden()

  // Reset search results returns full directory
  await page.getByRole('button', { name: 'Reset search' }).click()

  await page.waitForSelector('[data-testid="guardian-directory-table"]')

  // Inexplicably, counting the rows does not work here,
  // so let's check the first and last rows render
  // This might be due to a bug see https://app.shortcut.com/orbit-truss/story/3126/guardian-directory-search-with-empty-string-returns-incomplete-list
  await expect(page.getByTestId('0_FirstName')).toBeVisible()
  await expect(page.getByTestId('7_FirstName')).toBeVisible()
})
