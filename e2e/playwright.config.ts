import { defineConfig } from '@playwright/test'

import { baseConfig } from './test/playwright.base'

const isRemoteApi = process.env.VITE_API_BASE?.includes('api.realworld.show')

export default defineConfig({
  ...baseConfig,
  testDir: './test',
  use: {
    ...baseConfig.use,
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    testIdAttribute: 'data-test',
  },
  webServer: [
    ...(!isRemoteApi
      ? [
          {
            command: `direnv exec . make server`,
            url: 'http://localhost:3000/api/tags',
            cwd: process.env.BACKEND_PATH || '../../haskell-servant-realworld/backend',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
          },
        ]
      : []),
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      cwd: '../frontend',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
