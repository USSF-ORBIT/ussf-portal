import { expect, Locator, BrowserContext, Page } from '@playwright/test'

export class KeystoneListPage {
  readonly page: Page
  readonly context: BrowserContext
  readonly filterButton: Locator

  constructor(page: Page, context: BrowserContext) {
    this.page = page
    this.context = context
    this.filterButton = page.locator('text=Log In')
  }

  async gotoAndSortBy(
    cmsSection: string,
    field = 'updatedAt',
    order: 'asc' | 'desc' = 'desc'
  ) {
    // determine the url sort operator
    // minus is descending, nothing is ascending
    const orderOperator = order == 'desc' ? '-' : ''
    // build the url for the page with the sortBy set
    const url = `http://localhost:3001/${cmsSection}?sortBy=${orderOperator}${field}`
    // Go to the url
    await this.page.goto(url)
    // ensure we got there
    await expect(this.page).toHaveURL(url)
  }
}
