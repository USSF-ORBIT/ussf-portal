import { expect, BrowserContext, Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'

type ArticleFields = {
  title: string
  category?: string
  slug?: string
  preview?: string
}


export class KeystoneArticlePage {
  readonly page: Page
  readonly context: BrowserContext

  constructor(page: Page, context: BrowserContext) {
    this.page = page
    this.context = context
  }

  async fillArticleFields({
    slug = undefined,
    title,
    category = 'O',
    preview = undefined,
  }: ArticleFields) {
    await this.page.locator('label[for="category"]').click()
    await this.page.keyboard.type(category)
    await this.page.keyboard.press('Enter')

    if (slug) {
      await this.page.locator('#slug').fill(`${slug}`)
    }
    await this.page.locator('#title').fill(`${title}`)
    const previewData = preview ? preview : faker.lorem.words(20)
    await this.page.locator('#preview').fill(previewData)
  }

  async fillInternalNewsArticleFields(articleFields: ArticleFields) {
    await this.fillArticleFields({ category: 'I', ...articleFields })
  }

  async fillOrbitBlogArticleFields(articleFields: ArticleFields) {
    await this.fillArticleFields({ category: 'O', ...articleFields })
  }

  async createOrbitBlogArticle(articleFields: ArticleFields) {
    await this.page.locator('text=Create Article').click()

    await this.fillOrbitBlogArticleFields(articleFields)

    await this.createArticle()
  }

  async createInternalNewsArticle(articleFields: ArticleFields) {
    await this.page.locator('text=Create Article').click()

    await this.fillInternalNewsArticleFields(articleFields)

    await this.createArticle()
  }

  async createArticle() {
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.locator('form span:has-text("Create Article")').click(),
    ])
  }

  nthNumber(number: number) {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  async publishArticle({ publishedDate }: { publishedDate?: DateTime } = {}) {
    await this.page.locator('label:has-text("Published") >> nth=0').click()
    if (publishedDate) {
      await this.page.locator('text=mm/dd/yyyy').click()
      await expect(this.page.locator('.rdp')).toBeVisible()
      // If the current month isn't what was passed in assume it's the next one
      // not handling dates in the past since that's not the happy path but we may need to at somepoint
      if (await this.page.locator(`h2:has-text("${publishedDate.toFormat("MMMM yyyy")}")`).isHidden()) {
        await this.page.locator('[aria-label="Go to next month"]').click()
      }
      // Keystone labels the calendar buttons 1010th February for some reason
      // So using `nth=0` guarantees we find 4th February instead of 4th, 14th, and 24th.
      const dateFormat = `d'${this.nthNumber(publishedDate.day)}' MMMM`
      await this.page.locator(`button:has-text("${publishedDate.toFormat(dateFormat)}") >> nth=0`).click()
      // Wait for the dialog to disappear, otherwise you might not set the time
      await expect(this.page.locator('.rdp')).toBeHidden()
      await this.page.locator('input[placeholder="00:00"]').fill(publishedDate.toFormat("HH:mm"))
    }

    await this.page.locator('button:has-text("Save changes")').click()
    await expect(
      this.page.locator('label:has-text("Published") input')
    ).toBeChecked()
  }
}
