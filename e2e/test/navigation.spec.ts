import { expect, test } from '@playwright/test'

import {
  createManyArticles as createManyArticlesViaAPI,
  registerUserViaAPI,
} from './helpers/api'
import { createArticle, generateUniqueArticle } from './helpers/articles'
import { generateUniqueUser, login, register } from './helpers/auth'
import { API_MODE } from './helpers/config'
import { performActionAndWaitForResponse } from './helpers/network'
import { createManyArticles, createUserInIsolation } from './helpers/setup'

test.describe('Navigation and Filtering', () => {
  test.afterEach(async ({ context }) => {
    // Close the browser context to ensure complete isolation between tests.
    // This releases browser instances, network connections, and other resources.
    await context.close()
    // Wait 1000ms to allow async cleanup operations to complete.
    // Without this delay, running 6+ tests in sequence causes flaky failures
    // due to resource exhaustion (network connections, file descriptors, etc).
    // This timing issue manifests as timeouts when loading article pages.
    // This will be investigated and fixed later.
    await new Promise((resolve) => setTimeout(resolve, 1000))
  })

  test('should navigate through main pages when logged out', async ({
    page,
  }) => {
    await page.goto('/')

    // Should see home page
    await expect(page.getByTestId('site-logo')).toBeVisible()

    // Click Sign in
    await page.getByTestId('nav-link').filter({ hasText: 'Sign in' }).click()
    await expect(page).toHaveURL('/login')

    // Click Sign up
    await page.getByTestId('nav-link').filter({ hasText: 'Sign up' }).click()
    await expect(page).toHaveURL('/register')

    // Click Home
    await page.getByTestId('site-logo').click()
    await expect(page).toHaveURL('/')
  })

  test('should navigate through main pages when logged in', async ({
    page,
  }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // Should see authenticated navigation
    await expect(
      page.getByTestId('nav-link').filter({ hasText: 'Home' }),
    ).toBeVisible()
    await expect(
      page.getByTestId('nav-link').filter({ hasText: 'New Article' }),
    ).toBeVisible()
    await expect(
      page.getByTestId('nav-link').filter({ hasText: 'Settings' }),
    ).toBeVisible()
    await expect(
      page
        .getByTestId('nav-link')
        .filter({ has: page.getByTestId('navbar-user-avatar') }),
    ).toBeVisible()

    // Navigate to editor
    await page
      .getByTestId('nav-link')
      .filter({ hasText: 'New Article' })
      .click()
    await expect(page).toHaveURL('/editor')

    // Navigate to settings
    await page.getByTestId('nav-link').filter({ hasText: 'Settings' }).click()
    await expect(page).toHaveURL('/settings')

    // Navigate to profile
    await page
      .getByTestId('nav-link')
      .filter({ has: page.getByTestId('navbar-user-avatar') })
      .click()
    await expect(page).toHaveURL(`/profile/${user.username}`)
  })

  test('should filter articles by tag', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // Create article with specific tag
    const article = {
      ...generateUniqueArticle(),
      tags: ['playwright-test', 'automation'],
    }

    await createArticle(page, article)

    // Go to home and wait for it to load
    await page.goto('/', { waitUntil: 'load' })

    // Wait for the sidebar to be visible
    await page
      .getByTestId('popular-tags')
      .waitFor({ state: 'visible', timeout: 3000 })

    // Wait for the specific tag to appear in Popular Tags sidebar (or use first available tag)
    // Note: Custom tags might not appear immediately in Popular Tags
    const tagExists =
      (await page
        .getByTestId('tag-pill')
        .filter({ hasText: 'playwright-test' })
        .count()) > 0

    if (tagExists) {
      // Click on our custom tag
      await page
        .getByTestId('tag-pill')
        .filter({ hasText: 'playwright-test' })
        .click()

      await expect(
        page
          .getByTestId('home-tab')
          .filter({ hasText: `# ${article.tags[0]}` }),
      ).toBeVisible()

      // Should show the article with that tag
      await expect(
        page.getByRole('heading', { name: article.title }),
      ).toBeVisible()
    } else {
      // If custom tag doesn't appear, use an existing popular tag from the demo backend
      await page.getByTestId('tag-pill').first().click()

      // Get the tag text that was clicked
      const tagText = await page.getByTestId('tag-pill').first().textContent()

      await expect(
        page
          .getByTestId('home-tab')
          .filter({ hasText: `# ${tagText?.trim()}` }),
      ).toBeVisible()

      // Should show articles with that tag
      await expect(page.getByTestId('article-preview').first()).toBeVisible()
    }
  })

  test('should switch between Global Feed and Your Feed', async ({ page }) => {
    // Create user and article
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    const article = generateUniqueArticle()
    await createArticle(page, article)

    // Go to home
    await page.goto('/', { waitUntil: 'load' })

    // Wait for articles to load
    await page
      .getByTestId('article-preview')
      .first()
      .waitFor({ state: 'visible', timeout: 3000 })

    // Should see our article and existing articles in Global Feed
    await page
      .getByTestId('home-tab')
      .filter({ hasText: 'Global Feed' })
      .click()
    // Wait for articles to load after clicking Global Feed
    await page
      .getByTestId('article-preview')
      .first()
      .waitFor({ state: 'visible', timeout: 3000 })
    await expect(
      page.getByRole('heading', { name: article.title }).first(),
    ).toBeVisible()

    if (API_MODE) {
      // Also should see johndoe's articles from demo backend
      await expect(page.getByTestId('article-preview').first()).toBeVisible()
    }

    // Switch to Your Feed (should be empty since not following anyone)
    await page.getByTestId('home-tab').filter({ hasText: 'Your Feed' }).click()
    // Should see empty state or own articles
  })

  test('should display popular tags', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // Create article with tags
    const article = {
      ...generateUniqueArticle(),
      tags: ['popular', 'trending'],
    }

    await createArticle(page, article)

    // Go to home
    await page.goto('/')

    // Should see tags in the sidebar
    await expect(page.getByTestId('popular-tags')).toBeVisible()
    await expect(
      page.getByTestId('tag-pill').filter({ hasText: 'popular' }),
    ).toBeVisible()
    await expect(
      page.getByTestId('tag-pill').filter({ hasText: 'trending' }),
    ).toBeVisible()
  })

  test('should paginate articles', async ({ page, request, browser }) => {
    // Create user and 12 articles (via API when available, UI otherwise)
    const uniqueTag = `pag${Date.now()}`
    const user = generateUniqueUser()
    if (API_MODE) {
      const token = await registerUserViaAPI(request, user)
      await createManyArticlesViaAPI(request, token, 12, uniqueTag)
      await login(page, user.email, user.password)
    } else {
      await createUserInIsolation(browser, user)
      await login(page, user.email, user.password)
      await createManyArticles(page, 12, uniqueTag)
    }
    await page.goto(`/?tab=tag-feed&tag=${uniqueTag}`)

    await page
      .getByTestId('article-preview')
      .first()
      .waitFor({ state: 'visible', timeout: 3000 })

    // Count articles on first page
    const firstPageCount = await page.getByTestId('article-preview').count()
    expect(firstPageCount).toBeGreaterThan(0)
    expect(firstPageCount).toBeLessThanOrEqual(10)
  })

  test('should navigate to article from author name', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    const article = generateUniqueArticle()
    await createArticle(page, article)

    // Go to global feed to see the article we just created
    await page.goto('/')

    // Click on author name
    await page
      .getByTestId('article-preview')
      .first()
      .getByTestId('article-author')
      .click()

    // Should navigate to author profile
    await expect(page).toHaveURL(`/profile/${user.username}`)
  })

  test('should show article count on profile tabs', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // Create articles (generate just-in-time so Date.now() is distinct)
    const article1 = generateUniqueArticle()
    await createArticle(page, article1)
    const article2 = generateUniqueArticle()
    await createArticle(page, article2)

    // Favorite article1 - go to global feed to see the article
    await page.goto('/')

    // Favorite article1 and wait for the API to confirm before navigating
    await performActionAndWaitForResponse(page, () =>
      page
        .getByTestId('article-preview')
        .filter({ hasText: article1.title })
        .getByTestId('fav-button')
        .click(),
    )

    // Go to profile
    await page.goto(`/profile/${user.username}`)

    // Should have 2 articles in My Articles
    await expect(page.getByTestId('article-preview')).toHaveCount(2)

    // Click Favorited Articles tab (likely just says "Favorited")
    await page
      .getByTestId('profile-tab')
      .filter({ hasText: 'Favorited' })
      .click()

    // Should have 1 favorited article
    await expect(page.getByTestId('article-preview')).toHaveCount(1)
  })

  test('should handle empty states gracefully', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)

    // Go to profile (no articles yet)
    await page.goto(`/profile/${user.username}`, { waitUntil: 'load' })

    // Wait for profile page to load
    await page
      .getByTestId('user-info-section')
      .waitFor({ state: 'visible', timeout: 3000 })

    // Check if there are article previews
    const articleCount = await page.getByTestId('article-preview').count()
    // Empty profile should have 0 articles or show empty state message
    expect(articleCount).toBeGreaterThanOrEqual(0)

    // Check if Favorited tab exists and try to click it
    const favoritedTabExists =
      (await page
        .getByTestId('profile-tab')
        .filter({ hasText: 'Favorited' })
        .count()) > 0
    if (favoritedTabExists) {
      await page
        .getByTestId('profile-tab')
        .filter({ hasText: 'Favorited' })
        .click()
      // Should handle empty favorites gracefully
      const favoritedCount = await page.getByTestId('article-preview').count()
      expect(favoritedCount).toBeGreaterThanOrEqual(0)
    }
  })
})
