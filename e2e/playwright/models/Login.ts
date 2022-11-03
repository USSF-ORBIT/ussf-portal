import { expect, Locator, BrowserContext, Page } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly context: BrowserContext
  readonly loginUrl: string
  readonly loginButton: Locator
  readonly submitLogin: Locator

  readonly logoutMenuBtn: Locator
  readonly logoutBtn: Locator

  constructor(page: Page, context: BrowserContext) {
    this.page = page
    this.context = context
    this.loginUrl = 'http://localhost:3000/login'
    this.loginButton = page.locator('text=Log In')
    this.submitLogin = page.locator('text=Login')

    this.logoutMenuBtn = page.locator('[aria-label="Links and signout"]')
    this.logoutBtn = page.locator('text=Sign out')
  }

  async login(username: string, password: string) {
    await this.context.clearCookies()
    await this.page.goto(this.loginUrl)
    await this.loginButton.click()

    // SAML
    await expect(this.page.url()).toContain('http://localhost:8080/simplesaml/')
    await expect(
      this.page.locator('h2:has-text("Enter your username and password")')
    ).toBeVisible()

    await this.page.fill('#username', username)
    await this.page.fill('#password', password)

    await Promise.all([this.page.waitForNavigation(), this.submitLogin.click()])
  }

  async logout() {
    // await this.logoutBtn.click()
    await this.page.locator('button span:has-text("Sign out")').click()
    // await Promise.all([this.page.waitForNavigation(), this.logoutBtn.click()])
    await expect(
      this.page.locator('h1:has-text("Space Force Portal Login")')
    ).toBeVisible()
  }
}
