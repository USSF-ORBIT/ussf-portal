import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { LoginPage } from '../models/Login'
import { seedDB } from '../portal-client/database/seedMongo'

import axios from 'axios'
type CustomFixtures = {
  loginPage: LoginPage
}

const test = base.extend<TestingLibraryFixtures & CustomFixtures>({
  ...fixtures,
})

const { describe, expect } = test

test.beforeAll(async () => {
  await seedDB()
})

describe('JWT Authentication', () => {
  test.skip('user can get valid token', async () => {
    // Make an API request
    const response = await axios.get(
      'http://localhost:5001/login?userId=KING.FLOYD.376144527'
    )

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('token')
  })
})
