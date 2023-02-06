import { expect, BrowserContext, Page } from '@playwright/test'

export class KeystoneArticlePage {
  readonly page: Page
  readonly context: BrowserContext

  constructor(page: Page, context: BrowserContext) {
    this.page = page
    this.context = context
  }

  async fillInternalNewsArticleFields({slug = undefined, title}: {slug?: string, title: string}) {
    await this.page.locator('label[for="category"]').click()
    await this.page.keyboard.type('I')
    await this.page.keyboard.press('Enter')

    if (slug) {
      await this.page.locator('#slug').fill(`${slug}`)
    }
    await this.page.locator('#title').fill(`${title}`)
    await this.page.locator('#preview').fill('This is my test article.')
  }

  async fillOrbitBlogArticleFields({slug = undefined, title}: {slug?: string, title: string}) {
    await this.page.locator('label[for="category"]').click()
    await this.page.keyboard.type('O')
    await this.page.keyboard.press('Enter')

    if (slug) {
      await this.page.locator('#slug').fill(`${slug}`)
    }
    await this.page.locator('#title').fill(`${title}`)
    await this.page.locator('#preview').fill('This is my test article.')
  }

  async createOrbitBlogArticle({slug = undefined, title}: {slug?: string, title: string}) {
    await this.page.locator('text=Create Article').click()

    await this.fillOrbitBlogArticleFields({slug, title})

    await this.createArticle()
  }

  async createArticle() {
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.locator('form span:has-text("Create Article")').click(),
    ])
  }

  async publishArticle() {
    await this.page.locator('label:has-text("Published") >> nth=0').click()

    await this.page.locator('button:has-text("Save changes")').click()
    await expect(
      this.page.locator('label:has-text("Published") input')
    ).toBeChecked()
  }
}
