import { expect, test } from '@playwright/test'

import { registerUserViaAPI, updateUserViaAPI } from './helpers/api'
import { createArticle, generateUniqueArticle } from './helpers/articles'
import { generateUniqueUser, login, register } from './helpers/auth'
import { addComment } from './helpers/comments'
import { API_MODE } from './helpers/config'
import { updateProfile } from './helpers/profile'

/**
 * Tests for null/empty image and bio field handling.
 * Verifies that a default avatar SVG is shown when image is null or empty,
 * and that bio fields never render the literal text "null".
 */

test.describe('Null/Empty Image and Bio Handling', () => {
  // Brief cooldown between tests to avoid backend rate limiting
  test.afterEach(async ({ context }) => {
    await context.close()
    await new Promise((resolve) => setTimeout(resolve, 100))
  })

  test('newly registered user should show default avatar on profile page', async ({
    page,
  }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    await page.goto(`/profile/${user.username}`, { waitUntil: 'load' })
    await page.getByTestId('profile-avatar').waitFor({ state: 'visible' })
    const profileImg = page.getByTestId('profile-avatar')
    await expect(profileImg).toBeVisible()
    const src = await profileImg.getAttribute('src')
    expect(src).toContain('default-avatar.svg')
  })

  test('newly registered user should show default avatar in navbar', async ({
    page,
  }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    const navImg = page.getByTestId('navbar').getByTestId('navbar-user-avatar')
    await expect(navImg).toBeVisible()
    const src = await navImg.getAttribute('src')
    expect(src).toContain('default-avatar.svg')
  })

  test('newly registered user should show default avatar on article meta', async ({
    page,
  }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    const article = generateUniqueArticle()
    await createArticle(page, article)
    const articleMetaImg = page
      .getByTestId('article-metadata')
      .first()
      .getByTestId('article-author-img')
    await expect(articleMetaImg).toBeVisible()
    const src = await articleMetaImg.getAttribute('src')
    expect(src).toContain('default-avatar.svg')
  })

  test('newly registered user should show default avatar in comment section', async ({
    page,
  }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    const article = generateUniqueArticle()
    await createArticle(page, article)
    await addComment(page, 'Test comment for avatar check')
    // Comment form author image
    const commentFormImg = page.getByTestId('comment-author-img').first()
    await expect(commentFormImg).toBeVisible()
    const formSrc = await commentFormImg.getAttribute('src')
    expect(formSrc).toContain('default-avatar.svg')
    // Posted comment author image
    const commentImg = page
      .getByTestId('comment-card')
      .getByTestId('comment-author-img')
      .first()
    await expect(commentImg).toBeVisible()
    const commentSrc = await commentImg.getAttribute('src')
    expect(commentSrc).toContain('default-avatar.svg')
  })

  test('setting image should display custom avatar on profile page', async ({
    page,
    request,
  }) => {
    const user = generateUniqueUser()
    const testImage = 'https://api.realworld.io/images/smiley-cyrus.jpeg'
    if (API_MODE) {
      const token = await registerUserViaAPI(request, user)
      await updateUserViaAPI(request, token, { image: testImage })
      await login(page, user.email, user.password)
    } else {
      await register(page, user.username, user.email, user.password)
      await updateProfile(page, { image: testImage })
    }
    await page.goto(`/profile/${user.username}`, { waitUntil: 'load' })
    await page.getByTestId('profile-avatar').waitFor({ state: 'visible' })
    const profileImg = page.getByTestId('profile-avatar')
    await expect(profileImg).toHaveAttribute('src', testImage)
  })

  test('clearing image to empty string should restore default avatar', async ({
    page,
    request,
  }) => {
    const user = generateUniqueUser()
    if (API_MODE) {
      const token = await registerUserViaAPI(request, user)
      await updateUserViaAPI(request, token, {
        image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
      })
      await updateUserViaAPI(request, token, { image: '' })
      await login(page, user.email, user.password)
    } else {
      await register(page, user.username, user.email, user.password)
      await updateProfile(page, {
        image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
      })
      await updateProfile(page, { image: '' })
    }
    await page.goto(`/profile/${user.username}`, { waitUntil: 'load' })
    await page.getByTestId('profile-avatar').waitFor({ state: 'visible' })
    const profileImg = page.getByTestId('profile-avatar')
    const src = await profileImg.getAttribute('src')
    expect(src).toContain('default-avatar.svg')
  })

  test('null bio should not render as literal "null" on profile page', async ({
    page,
  }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    await page.goto(`/profile/${user.username}`, { waitUntil: 'load' })
    await page.getByTestId('user-info-section').waitFor({ state: 'visible' })
    const bioText = await page.getByTestId('user-bio').textContent()
    expect(bioText?.trim()).not.toBe('null')
    expect(bioText?.trim()).toBe('')
  })

  test('setting then clearing bio should not show stale data', async ({
    page,
    request,
  }) => {
    // Cooldown: this test runs after many rapid API calls; backend needs breathing room
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const user = generateUniqueUser()
    const testBio = 'This is a test bio'
    if (API_MODE) {
      const token = await registerUserViaAPI(request, user)
      await updateUserViaAPI(request, token, { bio: testBio })
      await updateUserViaAPI(request, token, { bio: '' })
      await login(page, user.email, user.password)
    } else {
      await register(page, user.username, user.email, user.password)
      await updateProfile(page, { bio: testBio })
      await updateProfile(page, { bio: '' })
    }
    await page.goto(`/profile/${user.username}`, { waitUntil: 'load' })
    await page.getByTestId('user-info-section').waitFor({ state: 'visible' })
    const bioText = await page.getByTestId('user-bio').textContent()
    expect(bioText?.trim()).not.toBe(testBio)
    expect(bioText?.trim()).not.toBe('null')
  })

  test('settings form should show empty string for null image', async ({
    page,
  }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    await page.goto('/settings', { waitUntil: 'load' })
    await expect(page.getByTestId('user-image-input')).toHaveValue('')
  })

  test('settings form should show empty string for null bio', async ({
    page,
  }) => {
    const user = generateUniqueUser()
    await register(page, user.username, user.email, user.password)
    await page.goto('/settings', { waitUntil: 'load' })
    await expect(page.getByTestId('user-bio-textarea')).toHaveValue('')
  })

  test('author avatars should render on other user articles in feed', async ({
    page,
  }) => {
    // Cooldown: this test runs after many rapid API calls; backend needs breathing room
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // The global feed contains articles from the backend's seed users
    await page.goto('/', { waitUntil: 'load' })
    await page
      .getByTestId('home-tab')
      .filter({ hasText: 'Global Feed' })
      .click()
    // Wait for at least 2 article previews to load (seed data from multiple authors)
    const previews = page.getByTestId('article-preview')
    await expect(previews.nth(1)).toBeVisible({ timeout: 10000 })
    const count = await previews.count()
    const authors = new Set<string>()
    for (let i = 0; i < count; i++) {
      const preview = previews.nth(i)
      const authorName = await preview
        .getByTestId('article-author')
        .textContent()
      if (authorName) authors.add(authorName.trim())
      const img = preview.getByTestId('article-author-img')
      await expect(img).toBeVisible()
      await expect(img).toHaveAttribute(
        'src',
        /\.(svg|jpe?g|png|webp)(\?.*)?$/i,
      )
      const loaded = await img.evaluate(
        (el: HTMLImageElement) => el.naturalWidth > 0,
      )
      expect(loaded).toBe(true)
    }
    // Ensure the feed actually contains articles from different users
    expect(authors.size).toBeGreaterThanOrEqual(2)
  })
})
