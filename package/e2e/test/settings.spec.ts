import { expect, test } from '@playwright/test'

import { generateUniqueUser, register } from './helpers/auth'
import { API_MODE } from './helpers/config'
import { getCurrentUser, getToken } from './helpers/debug'

/**
 * Tests for the settings/profile update feature.
 * Each test updates a specific field and verifies the result.
 *
 * API mode: form submits via PUT /api/user, verifies API response.
 * Fullstack mode: form submits via POST, verifies via rendered profile page.
 */

test.describe('Settings - Profile Updates', () => {
  test.afterEach(async ({ context }) => {
    await context.close()
    await new Promise((resolve) => setTimeout(resolve, 500))
  })

  test('should update bio only', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // Go to settings
    await page.goto('/settings')
    await expect(page.getByTestId('username-input')).toHaveValue(user.username)

    // Update bio
    const newBio = `Bio updated at ${Date.now()}`
    await page.fill('textarea[name="bio"]', newBio)

    if (API_MODE) {
      // Submit and wait for API response
      const responsePromise = page.waitForResponse(
        (res) =>
          res.url().includes('/user') && res.request().method() === 'PUT',
      )
      await page.click('button[type="submit"]')
      const response = await responsePromise

      // Verify API response
      expect(response.status()).toBe(200)
      const responseBody = await response.json()
      expect(responseBody.user.bio).toBe(newBio)
      expect(responseBody.user.username).toBe(user.username)
      expect(responseBody.user.email).toBe(user.email)

      // Verify navigation happened
      await expect(page).toHaveURL(new RegExp(`/profile/${user.username}`))

      // Verify token is still present (auth not corrupted)
      const token = await getToken(page)
      expect(token).not.toBeNull()

      // Verify current user is updated
      const currentUser = await getCurrentUser(page)
      expect(currentUser).not.toBeNull()
      expect(currentUser?.username).toBe(user.username)
      expect(currentUser?.bio).toBe(newBio)
    } else {
      // Submit form and wait for redirect to profile
      await Promise.all([
        page.waitForURL(/\/profile\//),
        page.click('button[type="submit"]'),
      ])

      await expect(page).toHaveURL(new RegExp(`/profile/${user.username}`))
      await expect(page.getByTestId('user-info-section')).toContainText(newBio)
    }
  })

  test('should update image only', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    await page.goto('/settings')
    await expect(page.getByTestId('username-input')).toHaveValue(user.username)

    // Update image
    const newImage = 'https://api.realworld.io/images/smiley-cyrus.jpeg'
    await page.fill('input[name="image"]', newImage)

    if (API_MODE) {
      const responsePromise = page.waitForResponse(
        (res) =>
          res.url().includes('/user') && res.request().method() === 'PUT',
      )
      await page.click('button[type="submit"]')
      const response = await responsePromise

      expect(response.status()).toBe(200)
      const responseBody = await response.json()
      expect(responseBody.user.image).toBe(newImage)
      expect(responseBody.user.username).toBe(user.username)

      await expect(page).toHaveURL(new RegExp(`/profile/${user.username}`))

      const token = await getToken(page)
      expect(token).not.toBeNull()

      const currentUser = await getCurrentUser(page)
      expect(currentUser).not.toBeNull()
      expect(currentUser?.image).toBe(newImage)
    } else {
      await Promise.all([
        page.waitForURL(/\/profile\//),
        page.click('button[type="submit"]'),
      ])

      await expect(page).toHaveURL(new RegExp(`/profile/${user.username}`))
      await expect(page.getByTestId('profile-avatar')).toBeVisible()
    }
  })

  test('should update bio and image together', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    await page.goto('/settings')

    // Update both fields
    const newBio = `Multi-update bio ${Date.now()}`
    const newImage = 'https://api.realworld.io/images/smiley-cyrus.jpeg'
    await page.fill('textarea[name="bio"]', newBio)
    await page.fill('input[name="image"]', newImage)

    if (API_MODE) {
      const responsePromise = page.waitForResponse(
        (res) =>
          res.url().includes('/user') && res.request().method() === 'PUT',
      )
      await page.click('button[type="submit"]')
      const response = await responsePromise

      expect(response.status()).toBe(200)
      const responseBody = await response.json()
      expect(responseBody.user.bio).toBe(newBio)
      expect(responseBody.user.image).toBe(newImage)
      expect(responseBody.user.username).toBe(user.username)
      expect(responseBody.user.email).toBe(user.email)

      await expect(page).toHaveURL(new RegExp(`/profile/${user.username}`))

      const token = await getToken(page)
      expect(token).not.toBeNull()

      const currentUser = await getCurrentUser(page)
      expect(currentUser?.bio).toBe(newBio)
      expect(currentUser?.image).toBe(newImage)
    } else {
      await Promise.all([
        page.waitForURL(/\/profile\//),
        page.click('button[type="submit"]'),
      ])

      await expect(page).toHaveURL(new RegExp(`/profile/${user.username}`))
      await expect(page.getByTestId('user-info-section')).toContainText(newBio)
      await expect(page.getByTestId('profile-avatar')).toBeVisible()
    }
  })

  test('should display updated bio on profile page', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    await page.goto('/settings')

    const newBio = `Visible bio ${Date.now()}`
    await page.fill('textarea[name="bio"]', newBio)

    if (API_MODE) {
      await Promise.all([
        page.waitForResponse(
          (res) =>
            res.url().includes('/user') && res.request().method() === 'PUT',
        ),
        page.click('button[type="submit"]'),
      ])
    } else {
      await Promise.all([
        page.waitForURL(/\/profile\//),
        page.click('button[type="submit"]'),
      ])
    }

    // Wait for profile page
    await expect(page).toHaveURL(new RegExp(`/profile/${user.username}`))

    // Verify bio is displayed on profile
    await expect(page.getByTestId('user-info-section')).toContainText(newBio)
  })

  test('should display updated image on profile page', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    await page.goto('/settings')

    const newImage = 'https://api.realworld.io/images/smiley-cyrus.jpeg'
    await page.fill('input[name="image"]', newImage)

    if (API_MODE) {
      await Promise.all([
        page.waitForResponse(
          (res) =>
            res.url().includes('/user') && res.request().method() === 'PUT',
        ),
        page.click('button[type="submit"]'),
      ])
    } else {
      await Promise.all([
        page.waitForURL(/\/profile\//),
        page.click('button[type="submit"]'),
      ])
    }

    // Wait for profile page
    await expect(page).toHaveURL(new RegExp(`/profile/${user.username}`))

    // Verify image is displayed on profile (use .user-img to avoid matching navbar)
    await expect(page.getByTestId('profile-avatar')).toBeVisible()
  })

  test('should preserve username in navbar after update', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // Verify navbar shows username before update
    await expect(
      page
        .getByTestId('nav-link')
        .filter({ has: page.getByTestId('navbar-user-avatar') }),
    ).toBeVisible()

    await page.goto('/settings')

    const newBio = `Navbar test ${Date.now()}`
    await page.fill('textarea[name="bio"]', newBio)

    if (API_MODE) {
      await Promise.all([
        page.waitForResponse(
          (res) =>
            res.url().includes('/user') && res.request().method() === 'PUT',
        ),
        page.click('button[type="submit"]'),
      ])
    } else {
      await Promise.all([
        page.waitForURL(/\/profile\//),
        page.click('button[type="submit"]'),
      ])
    }

    // Verify navbar STILL shows username after update (not corrupted)
    await expect(
      page
        .getByTestId('nav-link')
        .filter({ has: page.getByTestId('navbar-user-avatar') }),
    ).toBeVisible()
  })

  test('should allow navigation to settings again after update', async ({
    page,
  }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    await page.goto('/settings')

    const bio1 = `First update ${Date.now()}`
    await page.fill('textarea[name="bio"]', bio1)

    if (API_MODE) {
      await Promise.all([
        page.waitForResponse(
          (res) =>
            res.url().includes('/user') && res.request().method() === 'PUT',
        ),
        page.click('button[type="submit"]'),
      ])
    } else {
      await Promise.all([
        page.waitForURL(/\/profile\//),
        page.click('button[type="submit"]'),
      ])
    }

    await expect(page).toHaveURL(new RegExp(`/profile/${user.username}`))

    // Go back to settings
    await page.goto('/settings')
    await expect(page.getByTestId('username-input')).toHaveValue(user.username)

    // Verify previous update persisted
    await expect(page.getByTestId('user-bio-textarea')).toHaveValue(bio1)

    // Make another update
    const bio2 = `Second update ${Date.now()}`
    await page.fill('textarea[name="bio"]', bio2)

    if (API_MODE) {
      await Promise.all([
        page.waitForResponse(
          (res) =>
            res.url().includes('/user') && res.request().method() === 'PUT',
        ),
        page.click('button[type="submit"]'),
      ])

      const currentUser = await getCurrentUser(page)
      expect(currentUser?.bio).toBe(bio2)
    } else {
      await Promise.all([
        page.waitForURL(/\/profile\//),
        page.click('button[type="submit"]'),
      ])

      await expect(page).toHaveURL(new RegExp(`/profile/${user.username}`))
      await expect(page.getByTestId('user-info-section')).toContainText(bio2)
    }
  })
})
