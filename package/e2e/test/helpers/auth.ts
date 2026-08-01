import { Page } from '@playwright/test'

import { performActionAndWaitForResponse } from './network'

export async function register(
  page: Page,
  username: string,
  email: string,
  password: string,
) {
  await page.goto('/register', { waitUntil: 'load' })
  await page.getByTestId('username-input').fill(username)
  await page.getByTestId('email-input').fill(email)
  await page.getByTestId('password-input').fill(password)

  // Wait for API response
  try {
    await performActionAndWaitForResponse(page, () =>
      page.click('button[type="submit"]'),
    )
    // Then wait for navigation
    await page.waitForURL('/')
  } catch (error) {
    // If navigation fails, check for errors
    const errorMsg = await page
      .getByTestId('be-input-error-list')
      .first()
      .textContent()
      .catch(() => '')
    if (errorMsg) {
      throw new Error(`Registration failed: ${errorMsg}`)
    }
    throw error
  }
}

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login', { waitUntil: 'load' })
  await page.getByTestId('email-input').fill(email)
  await page.getByTestId('password-input').fill(password)

  // Wait for API response
  try {
    await performActionAndWaitForResponse(page, () =>
      page.click('button[type="submit"]'),
    )
    // Then wait for navigation
    await page.waitForURL('/')
  } catch (error) {
    // If navigation fails, check for errors
    const errorMsg = await page
      .getByTestId('be-input-error-list')
      .first()
      .textContent()
      .catch(() => '')
    if (errorMsg) {
      throw new Error(`Login failed: ${errorMsg}`)
    }
    throw error
  }
}

export async function logout(page: Page) {
  await page.getByTestId('nav-link').filter({ hasText: 'Settings' }).click()
  await Promise.all([
    page.waitForURL('/'),
    page.getByTestId('logout-btn').click(),
  ])
}

export function generateUniqueUser() {
  const timestamp = Date.now()
  return {
    username: `testuser${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'password123',
  }
}
