import { expect, BrowserContext, Page } from '@playwright/test'
import { faker } from '@faker-js/faker'

type ArticleFields = {
  title: string
  category: string
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
    category,
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

  async fillInternalNewsArticleFields({
    slug = undefined,
    title,
  }: ArticleFields) {
    await this.fillArticleFields({ slug, title, category: 'I' })
  }

  async fillOrbitBlogArticleFields({
    slug = undefined,
    title,
  }: ArticleFields) {
    await this.fillArticleFields({ slug, title, category: 'O' })
  }

  async createOrbitBlogArticle({
    slug = undefined,
    title,
  }: ArticleFields) {
    await this.page.locator('text=Create Article').click()

    await this.fillOrbitBlogArticleFields({ slug, title, category: 'O' })

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
