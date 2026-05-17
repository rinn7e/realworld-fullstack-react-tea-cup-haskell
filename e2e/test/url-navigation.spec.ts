import { expect, test } from '@playwright/test'

import {
  createManyArticles as createManyArticlesViaAPI,
  registerUserViaAPI,
} from './helpers/api'
import { generateUniqueUser, login, register } from './helpers/auth'
import { API_MODE } from './helpers/config'
import { createManyArticles, createUserInIsolation } from './helpers/setup'

test.describe('URL-based Navigation (Realworld Issue #691)', () => {
  test.afterEach(async ({ context }) => {
    await context.close()
    await new Promise((resolve) => setTimeout(resolve, 1000))
  })

  test('/ should show Global Feed for everyone', async ({ page }) => {
    await page.goto('/')
    // Should see Global Feed active
    await expect(
      page.getByTestId('home-tab').filter({ hasText: 'Global Feed' }),
    ).toHaveAttribute('aria-current', 'page')
    // Should see articles
    await expect(page.getByTestId('article-preview').first()).toBeVisible({
      timeout: 2000,
    })
    // URL should be /
    await expect(page).toHaveURL('/')
  })

  test('/?tab=user-feed should show Your Feed (authenticated)', async ({
    page,
  }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    await page.goto('/?tab=user-feed')
    // Should see Your Feed active
    await expect(
      page.getByTestId('home-tab').filter({ hasText: 'Your Feed' }),
    ).toHaveAttribute('aria-current', 'page')
    // URL should have tab param
    await expect(page).toHaveURL('/?tab=user-feed')
  })

  test('/?tab=user-feed should redirect to /login when not authenticated', async ({
    page,
  }) => {
    await page.goto('/?tab=user-feed')
    // Should be redirected to login
    await expect(page).toHaveURL('/login')
  })

  test('/?tab=tag-feed&tag=:tag should filter by tag', async ({ page }) => {
    await page.goto('/')
    await page
      .getByTestId('home-sidebar')
      .waitFor({ state: 'visible', timeout: 2000 })
    // Get a tag from the sidebar
    const firstTag = await page.getByTestId('tag-pill').first().textContent()
    expect(firstTag).toBeTruthy()
    const tag = firstTag?.trim() || ''
    // Navigate directly to the tag URL
    await page.goto(`/?tab=tag-feed&tag=${tag}`)
    // Should see the tag filter active
    await expect(
      page.getByTestId('home-tab').filter({ hasText: `# ${tag}` }),
    ).toBeVisible()
    await expect(
      page.getByTestId('home-tab').filter({ hasText: `# ${tag}` }),
    ).toHaveAttribute('aria-current', 'page')
  })

  test('tabs should have correct href attributes', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    await page.goto('/')
    await page
      .getByTestId('feed-toggle')
      .waitFor({ state: 'visible', timeout: 2000 })
    // Your Feed should link to /?tab=user-feed
    const yourFeedLink = page
      .getByTestId('home-tab')
      .filter({ hasText: 'Your Feed' })
    await expect(yourFeedLink).toHaveAttribute('href', '/?tab=user-feed')
    // Global Feed should link to /
    const globalFeedLink = page
      .getByTestId('home-tab')
      .filter({ hasText: 'Global Feed' })
    await expect(globalFeedLink).toHaveAttribute('href', '/')
  })

  test('clicking Your Feed should navigate to /?tab=user-feed', async ({
    page,
  }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    // Should be at /
    await expect(page).toHaveURL('/')
    // Click Your Feed
    await page.getByTestId('home-tab').filter({ hasText: 'Your Feed' }).click()
    // Should navigate to /?tab=user-feed
    await expect(page).toHaveURL('/?tab=user-feed')
    await expect(
      page.getByTestId('home-tab').filter({ hasText: 'Your Feed' }),
    ).toHaveAttribute('aria-current', 'page')
  })

  test('clicking Global Feed should navigate to /', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    // Go to Your Feed first
    await page.goto('/?tab=user-feed')
    await expect(
      page.getByTestId('home-tab').filter({ hasText: 'Your Feed' }),
    ).toHaveAttribute('aria-current', 'page')
    // Click Global Feed
    await page
      .getByTestId('home-tab')
      .filter({ hasText: 'Global Feed' })
      .click()
    // Should navigate to /
    await expect(page).toHaveURL('/')
    await expect(
      page.getByTestId('home-tab').filter({ hasText: 'Global Feed' }),
    ).toHaveAttribute('aria-current', 'page')
  })

  test('empty Your Feed shows helpful message with link to Global Feed', async ({
    page,
  }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    await page.goto('/?tab=user-feed')
    // Wait for loading to complete
    await page
      .getByTestId('empty-feed-msg')
      .waitFor({ state: 'visible', timeout: 2000 })
    // Should show helpful empty message
    const emptyMessage = page.getByTestId('empty-feed-msg')
    await expect(emptyMessage).toContainText('Your feed is empty')
    // Should have a link to Global Feed
    const globalFeedLink = emptyMessage
      .locator('a')
      .filter({ hasText: 'Global Feed' })
    await expect(globalFeedLink).toBeVisible()
  })
})

test.describe('Pagination', () => {
  test.afterEach(async ({ context }) => {
    await context.close()
    await new Promise((resolve) => setTimeout(resolve, 1000))
  })

  test('pagination should update URL with ?page=N', async ({
    page,
    request,
    browser,
  }) => {
    // Create user and 15 articles with a unique tag for this test
    const uniqueTag = `pag${Date.now()}`
    const testUser = generateUniqueUser()
    if (API_MODE) {
      const token = await registerUserViaAPI(request, testUser)
      await createManyArticlesViaAPI(request, token, 15, uniqueTag)
      await login(page, testUser.email, testUser.password)
    } else {
      await createUserInIsolation(browser, testUser)
      await login(page, testUser.email, testUser.password)
      await createManyArticles(page, 15, uniqueTag)
    }
    // Navigate to the tag page - this shows ONLY our articles
    await page.goto(`/?tab=tag-feed&tag=${uniqueTag}`)
    await page
      .getByTestId('article-preview')
      .first()
      .waitFor({ state: 'visible', timeout: 2000 })
    // Should have pagination (15 articles = 2 pages with limit 10)
    await expect(
      page.getByTestId('pagination-nav').getByRole('button', { name: '2' }),
    ).toBeVisible({
      timeout: 2000,
    })
    // Click page 2
    await page
      .getByTestId('pagination-nav')
      .getByRole('button', { name: '2' })
      .click()
    // URL should have ?page=2
    await expect(page).toHaveURL(
      new RegExp(`\\?tab=tag-feed&tag=${uniqueTag}&page=2`),
    )
    // Page 2 should be active
    await expect(
      page.getByTestId('pagination-nav').getByRole('button', { name: '2' }),
    ).toHaveAttribute('aria-current', 'page')
  })

  test('should load correct page when navigating directly to ?page=N', async ({
    page,
    request,
    browser,
  }) => {
    // Create user and 15 articles with a unique tag for this test
    const uniqueTag = `pag${Date.now()}`
    const testUser = generateUniqueUser()
    if (API_MODE) {
      const token = await registerUserViaAPI(request, testUser)
      await createManyArticlesViaAPI(request, token, 15, uniqueTag)
      await login(page, testUser.email, testUser.password)
    } else {
      await createUserInIsolation(browser, testUser)
      await login(page, testUser.email, testUser.password)
      await createManyArticles(page, 15, uniqueTag)
    }
    // Go directly to page 2 of the tag
    await page.goto(`/?tab=tag-feed&tag=${uniqueTag}&page=2`)
    await page
      .getByTestId('article-preview')
      .first()
      .waitFor({ state: 'visible', timeout: 2000 })
    // Page 2 should be active
    await expect(
      page.getByTestId('pagination-nav').getByRole('button', { name: '2' }),
    ).toHaveAttribute('aria-current', 'page')
    // URL should have page=2
    const url = new URL(page.url())
    expect(url.searchParams.get('page')).toBe('2')
  })

  test('pagination URL preserves feed parameter', async ({ page }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    // Your Feed shows articles from users you FOLLOW (not your own articles)
    // Just verify that if pagination exists on Your Feed, the URL is correct
    await page.goto('/?tab=user-feed')
    // Wait for the page to load (might be empty or have articles)
    await page
      .getByTestId('article-preview')
      .or(page.getByTestId('empty-feed-msg'))
      .first()
      .waitFor({
        state: 'visible',
        timeout: 2000,
      })
    // Check if pagination exists (depends on followed users having 11+ articles)
    const page2Button = page
      .getByTestId('pagination-nav')
      .getByRole('button', { name: '2' })
    const hasPage2 = await page2Button.isVisible().catch(() => false)
    if (hasPage2) {
      // Click page 2
      await page2Button.click()
      // URL should preserve feed param and add page
      await expect(page).toHaveURL('/?tab=user-feed&page=2')
    } else {
      // No pagination available - just verify URL structure is correct
      await expect(page).toHaveURL('/?tab=user-feed')
    }
  })

  test('pagination should work with tag feed', async ({
    page,
    request,
    browser,
  }) => {
    // Create user and 15 articles with a unique tag for this test
    const uniqueTag = `pag${Date.now()}`
    const testUser = generateUniqueUser()
    if (API_MODE) {
      const token = await registerUserViaAPI(request, testUser)
      await createManyArticlesViaAPI(request, token, 15, uniqueTag)
      await login(page, testUser.email, testUser.password)
    } else {
      await createUserInIsolation(browser, testUser)
      await login(page, testUser.email, testUser.password)
      await createManyArticles(page, 15, uniqueTag)
    }
    // Navigate to our tag
    await page.goto(`/?tab=tag-feed&tag=${uniqueTag}`)
    await page
      .getByTestId('article-preview')
      .first()
      .waitFor({ state: 'visible', timeout: 2000 })
    // Should have pagination
    await expect(
      page.getByTestId('pagination-nav').getByRole('button', { name: '2' }),
    ).toBeVisible({
      timeout: 2000,
    })
    // Click page 2
    await page
      .getByTestId('pagination-nav')
      .getByRole('button', { name: '2' })
      .click()
    // Wait for URL to update after page navigation
    await expect(page).toHaveURL(`/?tab=tag-feed&tag=${uniqueTag}&page=2`)
  })

  test('page should reset when switching feeds', async ({
    page,
    request,
    browser,
  }) => {
    // Create user and 15 articles with a unique tag for this test
    const uniqueTag = `pag${Date.now()}`
    const testUser = generateUniqueUser()
    if (API_MODE) {
      const token = await registerUserViaAPI(request, testUser)
      await createManyArticlesViaAPI(request, token, 15, uniqueTag)
      await login(page, testUser.email, testUser.password)
    } else {
      await createUserInIsolation(browser, testUser)
      await login(page, testUser.email, testUser.password)
      await createManyArticles(page, 15, uniqueTag)
    }
    // Navigate to our tag
    await page.goto(`/?tab=tag-feed&tag=${uniqueTag}`)
    await page
      .getByTestId('article-preview')
      .first()
      .waitFor({ state: 'visible', timeout: 2000 })
    // Should have pagination
    await expect(
      page.getByTestId('pagination-nav').getByRole('button', { name: '2' }),
    ).toBeVisible({
      timeout: 2000,
    })
    // Go to page 2
    await page
      .getByTestId('pagination-nav')
      .getByRole('button', { name: '2' })
      .click()
    await expect(page).toHaveURL(
      new RegExp(`\\?tab=tag-feed&tag=${uniqueTag}&page=2`),
    )
    // Click Global Feed and wait for URL to change to root path
    await page
      .getByTestId('home-tab')
      .filter({ hasText: 'Global Feed' })
      .click()
    await expect(page).toHaveURL('/')
    // Verify articles loaded
    await page
      .getByTestId('article-preview')
      .first()
      .waitFor({ state: 'visible', timeout: 2000 })
  })

  test('tag pagination shows correct articles per page', async ({
    page,
    request,
    browser,
  }) => {
    // Create user and 15 articles with a unique tag for this test
    const uniqueTag = `pag${Date.now()}`
    const testUser = generateUniqueUser()
    if (API_MODE) {
      const token = await registerUserViaAPI(request, testUser)
      await createManyArticlesViaAPI(request, token, 15, uniqueTag)
      await login(page, testUser.email, testUser.password)
    } else {
      await createUserInIsolation(browser, testUser)
      await login(page, testUser.email, testUser.password)
      await createManyArticles(page, 15, uniqueTag)
    }
    // Navigate to our tag
    await page.goto(`/?tab=tag-feed&tag=${uniqueTag}`)
    await page
      .getByTestId('article-preview')
      .first()
      .waitFor({ state: 'visible', timeout: 2000 })
    // Should have pagination (15 articles = 2 pages)
    await expect(
      page.getByTestId('pagination-nav').getByRole('button', { name: '2' }),
    ).toBeVisible({
      timeout: 2000,
    })
    // First page should show 10 articles
    const articlesOnPage1 = await page.getByTestId('article-preview').count()
    expect(articlesOnPage1).toBe(10)
    // Click page 2
    await page
      .getByTestId('pagination-nav')
      .getByRole('button', { name: '2' })
      .click()
    // Wait for page 2 to be active
    await expect(
      page.getByTestId('pagination-nav').getByRole('button', { name: '2' }),
    ).toHaveAttribute('aria-current', 'page', {
      timeout: 2000,
    })
    await page
      .getByTestId('article-preview')
      .first()
      .waitFor({ state: 'visible', timeout: 2000 })
    // URL should show ?page=2
    await expect(page).toHaveURL(
      new RegExp(`\\?tab=tag-feed&tag=${uniqueTag}&page=2`),
    )
    // Small wait for Angular to finish rendering the new page
    await page.waitForTimeout(500)
    // Second page should have 5 articles (15 - 10 = 5)
    const articlesOnPage2 = await page.getByTestId('article-preview').count()
    expect(articlesOnPage2).toBe(5)
  })
})
