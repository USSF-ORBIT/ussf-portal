import { expect, BrowserContext, Page } from '@playwright/test'
import { DateTime } from 'luxon'

export class KeystoneAnnouncementPage {
  readonly page: Page
  readonly context: BrowserContext

  constructor(page: Page, context: BrowserContext) {
    this.page = page
    this.context = context
  }

  nthNumber(number: number) {
    if (number > 3 && number < 21) return 'th'
    switch (number % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  async publishAnnouncement({
    publishedDate,
  }: { publishedDate?: DateTime } = {}) {
    await this.page.locator('text=Published').first().click()
    if (publishedDate) {
      await this.page.locator('text=mm/dd/yyyy').click()
      await expect(this.page.locator('.rdp')).toBeVisible()
      // If the current month isn't what was passed in assume it's the next one
      // not handling dates in the past since that's not the happy path but we may need to at somepoint
      if (
        await this.page
          .locator(`h2:has-text("${publishedDate.toFormat('MMMM yyyy')}")`)
          .isHidden()
      ) {
        await this.page.locator('[aria-label="Go to next month"]').click()
      }
      // Keystone labels the calendar buttons 1010th February for some reason
      // So using `nth=0` guarantees we find 4th February instead of 4th, 14th, and 24th.
      const dateFormat = `d'${this.nthNumber(publishedDate.day)}' MMMM ('${
        publishedDate.weekdayLong
      }')`
      await this.page
        .locator(
          `button:has-text("${publishedDate.toFormat(dateFormat)}") >> nth=0`
        )
        .click()
      // Wait for the dialog to disappear, otherwise you might not set the time
      await expect(this.page.locator('.rdp')).toBeHidden()
      await this.page
        .locator('input[placeholder="00:00"]')
        .fill(publishedDate.toFormat('HH:mm'))
    }

    await this.page.locator('button:has-text("Save changes")').click()
    await expect(
      this.page.locator('label:has-text("Published") input')
    ).toBeChecked()
  }
}
