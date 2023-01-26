import { PlaywrightTestConfig } from '@playwright/test'
import path from 'path'

const config: PlaywrightTestConfig = {
  globalSetup: path.resolve('./playwright/global-setup'),
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  workers: 1,
  expect: { timeout: 15000 },
  projects: [
    {
      name: 'CMS E2E',
      use: {
        baseURL: 'http://localhost:3001',
      },
      testDir: 'playwright/cms/tests',
    },
    {
      name: 'PORTAL CLIENT E2E',
      use: {
        baseURL: 'http://localhost:3000',
      },
      testDir: 'playwright/portal-client/tests',
    },
    {
      name: 'FEATURES E2E',
      use: {
        baseURL: 'http://localhost:3000',
      },
      testDir: 'playwright/feature',
    },
  ],
}

export default config
