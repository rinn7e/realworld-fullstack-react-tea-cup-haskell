import { Page } from '@playwright/test'

import { API_MODE } from './config'

export async function followUser(page: Page, username: string) {
  await page.goto(`/profile/${username}`, { waitUntil: 'load' })
  // Wait for profile page to load and Follow button to appear
  await page
    .getByRole('button', { name: 'Follow' })
    .waitFor({ state: 'visible', timeout: 30000 })
  await page
    .getByTestId('profile-tab')
    .filter({ hasText: 'Favorited' })
    .waitFor({ state: 'visible', timeout: 3000 })
  await page.click('button:has-text("Follow")')
  // Wait for button to update
  await page
    .getByRole('button', { name: 'Unfollow' })
    .waitFor({ state: 'visible', timeout: 5000 })
}

export async function unfollowUser(page: Page, username: string) {
  await page.goto(`/profile/${username}`, { waitUntil: 'load' })
  // Wait for profile page to load and Unfollow button to appear
  await page
    .getByRole('button', { name: 'Unfollow' })
    .waitFor({ state: 'visible', timeout: 30000 })
  await page.click('button:has-text("Unfollow")')
  // Wait for button to update
  await page
    .getByRole('button', { name: 'Follow' })
    .waitFor({ state: 'visible', timeout: 5000 })
}

export async function updateProfile(
  page: Page,
  updates: {
    image?: string
    username?: string
    bio?: string
    email?: string
    password?: string
  },
) {
  await page.goto('/settings', { waitUntil: 'load' })

  if (updates.image !== undefined) {
    await page.getByTestId('user-image-input').fill(updates.image)
  }
  if (updates.username) {
    await page.getByTestId('username-input').fill(updates.username)
  }
  if (updates.bio !== undefined) {
    await page.getByTestId('bio-input').fill(updates.bio)
  }
  if (updates.email) {
    await page.getByTestId('email-input').fill(updates.email)
  }
  if (updates.password) {
    await page.getByTestId('password-input').fill(updates.password)
  }

  if (API_MODE) {
    // Click submit and wait for API call to complete, then navigation
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes('/user') &&
          response.request().method() === 'PUT',
      ),
      page.waitForURL((url) => !url.toString().includes('/settings')),
      page.click('button[type="submit"]'),
    ])
  } else {
    // Click submit and wait for navigation away from settings
    await Promise.all([
      page.waitForURL((url) => !url.toString().includes('/settings')),
      page.click('button[type="submit"]'),
    ])
  }
}
