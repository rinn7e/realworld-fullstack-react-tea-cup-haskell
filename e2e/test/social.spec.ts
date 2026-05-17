import { expect, test } from '@playwright/test'

import { createArticle, generateUniqueArticle } from './helpers/articles'
import { generateUniqueUser, register } from './helpers/auth'
import { followUser, unfollowUser } from './helpers/profile'
import { createUserInIsolation } from './helpers/setup'

test.describe('Social Features', () => {
  test.slow()

  test.afterEach(async ({ context }) => {
    // Close the browser context to ensure complete isolation between tests.
    // This releases browser instances, network connections, and other resources.
    await context.close()
    // Wait 500ms to allow async cleanup operations to complete.
    // Without this delay, running 6+ tests in sequence causes flaky failures
    // due to resource exhaustion (network connections, file descriptors, etc).
    // This timing issue manifests as timeouts when loading article pages.
    // This will be investigated and fixed later.
    await new Promise((resolve) => setTimeout(resolve, 500))
  })

  test('should follow and unfollow a user', async ({ page, browser }) => {
    // Register our test user
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // API mode: use johndoe (demo backend, user isolation prevents creating visible users)
    // Fullstack mode: create a second user via UI in an isolated browser context
    // if (API_MODE) {
    //   targetUsername = 'johndoe'
    // } else {
    const otherUser = generateUniqueUser()
    await createUserInIsolation(browser, otherUser)
    const targetUsername = otherUser.username
    // }

    await followUser(page, targetUsername)
    await expect(page.getByTestId('follow-btn')).toContainText('Unfollow')

    await unfollowUser(page, targetUsername)
    await expect(page.getByTestId('follow-btn')).toContainText('Follow')
  })

  test('should view own profile', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // Click on profile link
    await page
      .getByTestId('nav-link')
      .filter({ has: page.getByTestId('navbar-user-avatar') })
      .click()

    // Should show user information
    await expect(page.getByRole('heading', { level: 4 })).toHaveText(
      user.username,
    )

    // Should see Edit Profile Settings button (own profile)
    await expect(page.getByTestId('edit-profile-settings')).toBeVisible()

    // Should not see Follow button (can't follow yourself)
    await expect(page.getByTestId('follow-btn')).not.toBeVisible()
  })

  test('should view other user profile', async ({ page, browser }) => {
    // Register our test user
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // API mode: johndoe exists with articles on the demo backend
    // Fullstack mode: create a second user with an article via UI
    // if (API_MODE) {
    //   targetUsername = 'johndoe'
    // } else {
    const otherUser = generateUniqueUser()
    const ctx = await browser.newContext()
    const otherPage = await ctx.newPage()
    await register(
      otherPage,
      otherUser.username,
      otherUser.email,
      otherUser.password,
    )
    await createArticle(otherPage, {
      title: `Article by ${otherUser.username}`,
      description: 'A test article',
      body: 'Body content',
    })
    await ctx.close()
    const targetUsername = otherUser.username
    // }

    await page.goto(`/profile/${targetUsername}`, { waitUntil: 'load' })
    await page
      .getByRole('heading', { level: 4 })
      .waitFor({ state: 'visible', timeout: 10000 })

    await expect(page.getByRole('heading', { level: 4 })).toHaveText(
      targetUsername,
    )
    await expect(page.getByTestId('follow-btn')).toBeVisible()
    await expect(page.getByTestId('edit-profile-settings')).not.toBeVisible()
    await expect(page.getByTestId('article-preview').first()).toBeVisible()
  })

  test('should display user articles on profile', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // Create multiple articles (generate just-in-time so Date.now() is distinct)
    const article1 = generateUniqueArticle()
    await createArticle(page, article1)
    const article2 = generateUniqueArticle()
    await createArticle(page, article2)

    // Go to profile
    await page.goto(`/profile/${user.username}`)

    // Both articles should be visible
    await expect(
      page.getByRole('heading', { name: article1.title }).first(),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: article2.title }).first(),
    ).toBeVisible()
  })

  test('should display favorited articles on profile', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // Go to global feed to find an existing article (can't favorite own articles)
    await page.goto('/', { waitUntil: 'load' })

    // Wait for articles to load
    await page
      .getByTestId('article-preview')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 })

    // Check first article exists and click it
    await expect(
      page.getByTestId('article-preview').first().getByRole('heading'),
    ).toBeVisible()

    // Click on first article to go to its detail page
    const articleTitle = await page
      .getByTestId('article-preview')
      .first()
      .getByRole('heading')
      .innerText()
    await page
      .getByTestId('article-preview')
      .first()
      .getByRole('heading')
      .click()
    await page
      .getByRole('heading', { name: articleTitle })
      .waitFor({ state: 'visible', timeout: 10000 })

    // Wait for article page to load
    await expect(page.getByTestId('fav-button').first()).toBeVisible({
      timeout: 10000,
    })

    // Check if already favorited, if not favorite it
    const favButton = page.getByTestId('fav-button').first()
    const isFavorited = (await favButton.innerText()).includes('Unfavorite')
    if (!isFavorited) {
      await favButton.click()
      // Wait for the favorite to complete
      await expect(favButton).toContainText('Unfavorite', { timeout: 10000 })
    }

    // Go to profile and click Favorited tab
    await page.goto(`/profile/${user.username}`, { waitUntil: 'load' })
    await page
      .getByTestId('profile-tab')
      .filter({ hasText: 'Favorited' })
      .waitFor({ state: 'visible', timeout: 3000 })
    await page
      .getByTestId('profile-tab')
      .filter({ hasText: 'Favorited' })
      .click()

    // Wait for URL to change then for articles to load
    await expect(page).toHaveURL(new RegExp(`/profile/[^/]+\\?favorites=true`))
    await expect(page.getByTestId('article-preview').first()).toBeVisible({
      timeout: 3000,
    })
  })

  test('should display followed users articles in feed', async ({
    page,
    browser,
  }) => {
    // Register our test user
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // API mode: johndoe exists with articles on the demo backend
    // Fullstack mode: create a second user with an article via UI
    // if (API_MODE) {
    //   targetUsername = 'johndoe'
    // } else {
    const otherUser = generateUniqueUser()
    const ctx = await browser.newContext()
    const otherPage = await ctx.newPage()
    await register(
      otherPage,
      otherUser.username,
      otherUser.email,
      otherUser.password,
    )
    await createArticle(otherPage, {
      title: `Feed article by ${otherUser.username}`,
      description: 'Should appear in feed',
      body: 'Body content',
    })
    await ctx.close()
    const targetUsername = otherUser.username
    // }
    await followUser(page, targetUsername)

    // Go to home and click "Your Feed"
    await page.goto('/', { waitUntil: 'load' })
    await page
      .getByTestId('feed-toggle')
      .waitFor({ state: 'visible', timeout: 10000 })
    await page.getByTestId('home-tab').filter({ hasText: 'Your Feed' }).click()

    // Wait for articles to load
    await page
      .getByTestId('article-preview')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 })
    await expect(page.getByTestId('article-preview').first()).toBeVisible()
  })
})
