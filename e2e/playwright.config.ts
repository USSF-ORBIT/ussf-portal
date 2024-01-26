import { PlaywrightTestConfig } from '@playwright/test'
import path from 'path'

const cmsConfig = {
  use: {
    baseURL: 'http://localhost:3001',
  },
  testDir: 'playwright/cms/tests',
}
const clientConfig = {
  use: {
    baseURL: 'http://localhost:3000',
  },
  testDir: 'playwright/portal-client/tests',
}
const featureConfig = {
  use: {
    baseURL: 'http://localhost:3000',
  },
  testDir: 'playwright/feature',
}

const config: PlaywrightTestConfig = {
  globalSetup: path.resolve('./playwright/global-setup'),
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    permissions: ["clipboard-read", "clipboard-write"],
  },
  workers: 1,
  retries: 3,
  expect: { timeout: 15000 },
  projects: [
    {
      ...cmsConfig,
      name: 'cms-msedge',
      use: {
        ...cmsConfig.use,
        channel: 'msedge',
      },
    },
    {
      ...clientConfig,
      name: 'client-msedge',
      use: {
        ...clientConfig.use,
        channel: 'msedge',
      },
    },
    {
      ...featureConfig,
      name: 'feature-msedge',
      use: {
        ...featureConfig.use,
        channel: 'msedge',
      },
    },
    {
      ...cmsConfig,
      name: 'cms-chrome',
      use: {
        ...cmsConfig.use,
        channel: 'chrome',
      },
    },
    {
      ...clientConfig,
      name: 'client-chrome',
      use: {
        ...clientConfig.use,
        channel: 'chrome',
      },
    },
    {
      ...featureConfig,
      name: 'feature-chrome',
      use: {
        ...featureConfig.use,
        channel: 'chrome',
      },
    },
    {
      ...cmsConfig,
      name: 'cms-chromium',
      use: {
        ...cmsConfig.use,
        browserName: 'chromium',
      },
    },
    {
      ...clientConfig,
      name: 'client-chromium',
      use: {
        ...clientConfig.use,
        browserName: 'chromium',
      },
    },
    {
      ...featureConfig,
      name: 'feature-chromium',
      use: {
        ...featureConfig.use,
        browserName: 'chromium',
      },
    },
    {
      ...cmsConfig,
      name: 'cms-firefox',
      use: {
        browserName: 'firefox',
        ...cmsConfig.use,
      },
      timeout: 45000,
      expect: { timeout: 20000 },
    },
    {
      ...clientConfig,
      name: 'client-firefox',
      use: {
        ...clientConfig.use,
        browserName: 'firefox',
      },
      timeout: 45000,
      expect: { timeout: 20000 },
    },
    {
      ...featureConfig,
      name: 'feature-firefox',
      use: {
        ...featureConfig.use,
        browserName: 'firefox',
      },
      timeout: 45000,
      expect: { timeout: 20000 },
    },
    // TODO: cannot sign into docker e2e services when using web kit
    // login of the user fails just redirects from login page to the
    // unauth portal landing page.
    // {
    //   ...cmsConfig,
    //   name: 'cms-webkit',
    //   use: {
    //     ...cmsConfig.use,
    //     browserName: 'webkit',
    //   },
    // },
    // {
    //   ...clientConfig,
    //   name: 'client-webkit',
    //   use: {
    //     ...clientConfig.use,
    //     browserName: 'webkit',
    //   },
    // },
    // {
    //   ...featureConfig,
    //   name: 'feature-webkit',
    //   use: {
    //     ...featureConfig.use,
    //     browserName: 'webkit',
    //   },
    // },
  ],
}

export default config
