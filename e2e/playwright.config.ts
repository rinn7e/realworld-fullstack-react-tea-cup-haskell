import { defineConfig } from '@playwright/test'

import { baseConfig } from './test/playwright.base'

const isRemoteApi = process.env.VITE_API_BASE?.includes('api.realworld.show')

export default defineConfig({
  ...baseConfig,
  testDir: './test',
  use: {
    ...baseConfig.use,
    baseURL: process.env.BASE_URL || 'http://localhost:8001',
    testIdAttribute: 'data-test',
  },
  webServer: [
    ...(!isRemoteApi
      ? [
          {
            command: `direnv exec . make server`,
            url: 'http://localhost:8000/api/tags',
            cwd: process.env.BACKEND_PATH || '../backend',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
          },
        ]
      : []),
    {
      command: 'pnpm dev',
      url: 'http://localhost:8001',
      cwd: '../frontend-web',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
