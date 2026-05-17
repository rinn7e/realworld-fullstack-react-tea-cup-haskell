import { expect, test } from '@playwright/test'

import { API_MODE } from './helpers/config'

test.describe('Health Checks', () => {
  test('app should load successfully', async ({ page }) => {
    await page.goto('/')

    // Should see the app brand/logo
    await expect(page.getByTestId('site-logo')).toBeVisible({ timeout: 10000 })

    // Should see navigation
    await expect(page.getByTestId('navbar')).toBeVisible()
  })

  test('API should be accessible', async ({ request }) => {
    test.skip(!API_MODE, 'API-only: direct API endpoint check')
    const response = await request.get('https://api.realworld.show/api/tags')
    expect(response.ok()).toBeTruthy()
  })

  test('can navigate to login page', async ({ page }) => {
    await page.goto('/login')

    // Should see login form
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Sign in',
      {
        timeout: 10000,
      },
    )
    await expect(page.getByTestId('email-input')).toBeVisible()
  })

  test('can navigate to register page', async ({ page }) => {
    await page.goto('/register')

    // Should see register form
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Sign up',
      {
        timeout: 10000,
      },
    )
    await expect(page.getByTestId('username-input')).toBeVisible()
  })
})
