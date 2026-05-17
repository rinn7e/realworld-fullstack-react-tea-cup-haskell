import { expect, test } from '@playwright/test'

import { generateUniqueUser, login, logout, register } from './helpers/auth'
import { API_MODE } from './helpers/config'
import { getAuthState, getToken } from './helpers/debug'

test.describe('Authentication', () => {
  test('should register a new user', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    // Should be redirected to home page
    await expect(page).toHaveURL('/')
    // Should see username in header
    await expect(
      page
        .getByTestId('nav-link')
        .filter({ has: page.getByTestId('navbar-user-avatar') }),
    ).toBeVisible()
    // Should be able to access editor
    await page
      .getByTestId('nav-link')
      .filter({ hasText: 'New Article' })
      .click()
    await expect(page).toHaveURL('/editor')
  })

  test('should login with existing user', async ({ page }) => {
    const user = generateUniqueUser()
    // First register a user
    await register(page, user.username, user.email, user.password)
    // Logout
    await logout(page)
    // Should see Sign in link
    await expect(
      page.getByTestId('nav-link').filter({ hasText: 'Sign in' }),
    ).toBeVisible()
    // Login again
    await login(page, user.email, user.password)
    // Should be logged in
    await expect(
      page
        .getByTestId('nav-link')
        .filter({ has: page.getByTestId('navbar-user-avatar') }),
    ).toBeVisible()
  })

  test('should show error for invalid login', async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('email-input').fill('nonexistent@example.com')
    await page.getByTestId('password-input').fill('wrongpassword')
    await page.getByTestId('login-btn').click()
    // Should show error message
    await expect(page.getByTestId('be-input-error-list')).toBeVisible()
  })

  test('should fail login with wrong password', async ({ page }) => {
    const user = generateUniqueUser()
    // First register a user with correct credentials
    await register(page, user.username, user.email, user.password)
    // Logout
    await logout(page)
    // Try to login with correct email but wrong password
    await page.goto('/login')
    await page.getByTestId('email-input').fill(user.email)
    await page.getByTestId('password-input').fill('wrongpassword123')
    await page.getByTestId('login-btn').click()
    // Should show error message
    await expect(page.getByTestId('be-input-error-list')).toBeVisible()
    // Should still be on login page (not redirected)
    await expect(page).toHaveURL('/login')
  })

  test('should logout successfully', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    // User should be logged in
    await expect(
      page
        .getByTestId('nav-link')
        .filter({ has: page.getByTestId('navbar-user-avatar') }),
    ).toBeVisible()
    // Logout
    await logout(page)
    // Should see Sign in link (user is logged out)
    await expect(
      page.getByTestId('nav-link').filter({ hasText: 'Sign in' }),
    ).toBeVisible()
    // Should not see profile link
    await expect(
      page
        .getByTestId('nav-link')
        .filter({ has: page.getByTestId('navbar-user-avatar') }),
    ).not.toBeVisible()
  })

  test('should prevent accessing editor when not logged in', async ({
    page,
  }) => {
    await page.goto('/editor')
    // Should be redirected to login or home
    await expect(page).not.toHaveURL('/editor')
  })

  test('should maintain session after page reload', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    // Reload the page
    await page.reload()
    // Should still be logged in
    await expect(
      page
        .getByTestId('nav-link')
        .filter({ has: page.getByTestId('navbar-user-avatar') }),
    ).toBeVisible()
  })

  test('should handle invalid token on page reload gracefully', async ({
    page,
  }) => {
    test.skip(!API_MODE, 'API-only: tests localStorage token handling')
    // Set an invalid token in localStorage before navigating
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('jwtToken', 'invalid-token-that-will-cause-401')
    })
    // Reload the page - this should NOT cause a blank screen
    await page.reload()
    // The app should still load and show the unauthenticated UI
    await expect(
      page.getByTestId('nav-link').filter({ hasText: 'Sign in' }),
    ).toBeVisible()
    await expect(
      page.getByTestId('nav-link').filter({ hasText: 'Sign up' }),
    ).toBeVisible()
    // The invalid token should be cleared (use debug interface)
    const token = await getToken(page)
    expect(token).toBeNull()
    const authState = await getAuthState(page)
    expect(authState).toBe('unauthenticated')
  })
})
