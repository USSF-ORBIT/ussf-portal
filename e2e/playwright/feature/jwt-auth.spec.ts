import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { LoginPage } from '../models/Login'
import { seedDB } from '../portal-client/database/seedMongo'
import { testUser1 } from '../portal-client/database/users'

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

describe('JWT Authorization', () => {
  test('existing user can get valid token and make a request', async () => {
    // Make an API request to get JWT
    const response = await axios.get(
      `http://localhost:5001/login?userId=${testUser1.userId}`
    )
    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('token')

    // Make an API request to get a protected resource
    const token = response.data.token
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
    const query = `
      query getDisplayName {
        displayName
      }
    `
    const protectedResponse = await axios.post(
      `http://localhost:3000/api/thirdparty/graphql`,
      { query },
      { headers }
    )

    expect(protectedResponse.status).toBe(200)
    expect(protectedResponse.data.data.displayName).toBe(testUser1.displayName)
  })

  test('non-existing user can get a valid token and make a request', async () => {
    // Make an API request to get JWT
    const response = await axios.get(
      `http://localhost:5001/login?userId=NEW.USER.0123456789`
    )
    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('token')

    // Make an API request to get a protected resource
    const token = response.data.token
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
    const query = `
      query getDisplayName {
        displayName
      }
    `
    const protectedResponse = await axios.post(
      `http://localhost:3000/api/thirdparty/graphql`,
      { query },
      { headers }
    )

    expect(protectedResponse.status).toBe(200)
    expect(protectedResponse.data.data.displayName).toBe('NEW.USER.0123456789')
  })

  test('unauth user cannot make a request to protected API calls', async () => {
    // Make an API request to get a protected resource
    const headers = {
      'Content-Type': 'application/json',
    }
    const query = `
      query getDisplayName {
        displayName
      }
    `
    const protectedResponse = await axios.post(
      `http://localhost:3000/api/thirdparty/graphql`,
      { query },
      { headers }
    )

    expect(protectedResponse.status).toBe(200) // GraphQL always returns 200
    expect(protectedResponse.data.errors[0].message).toBe(
      'User not authenticated'
    )
  })

  test('request with bogus JWT will not work', async () => {
    // John Doe token pulled from jwt.is
    const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
    const headers = {
      Authorization: `Bearer ${fakeToken}`,
      'Content-Type': 'application/json',
    }
    const query = `
      query getDisplayName {
        displayName
      }
    `
    const protectedResponse = await axios.post(
      `http://localhost:3000/api/thirdparty/graphql`,
      { query },
      { headers }
    )
    expect(protectedResponse.status).toBe(200) // GraphQL always returns 200
    expect(protectedResponse.data.errors[0].message).toBe(
      'User not authenticated'
    )
  })
})
