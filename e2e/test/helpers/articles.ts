import { Page, expect } from '@playwright/test'

export interface ArticleData {
  title: string
  description: string
  body: string
  tags?: string[]
}

export async function createArticle(
  page: Page,
  article: ArticleData,
  options: { sleepAfter?: number } = {},
) {
  const { sleepAfter = 1 } = options

  await page.goto('/editor', { waitUntil: 'load' })

  await page.getByTestId('article-title-input').fill(article.title)
  await page.getByTestId('article-desc-input').fill(article.description)
  await page.getByTestId('article-body-textarea').fill(article.body)

  if (article.tags && article.tags.length > 0) {
    for (const tag of article.tags) {
      await page.getByTestId('tagInput-input').fill(tag)
      await page.getByTestId('tagInput-input').press('Enter')
    }
  }

  // Start waiting for navigation before clicking to avoid race condition
  await Promise.all([
    page.waitForURL(/\/article\/.+/),
    page.click('button:has-text("Publish Article")'),
  ])

  // Ensure Date.now() advances so the next generateUniqueArticle() gets a distinct timestamp
  if (sleepAfter > 0) {
    await new Promise((resolve) => setTimeout(resolve, sleepAfter))
  }
}

export async function editArticle(
  page: Page,
  slug: string,
  updates: Partial<ArticleData>,
) {
  await page.goto(`/editor/${slug}`, { waitUntil: 'load' })

  // Wait for the API data to populate the form (not just for the input to exist)
  const titleInput = page.getByTestId('article-title-input')
  await expect(titleInput).not.toHaveValue('', { timeout: 10000 })

  if (updates.title) {
    await page.getByTestId('article-title-input').fill('')
    await page.getByTestId('article-title-input').fill(updates.title)
  }
  if (updates.description) {
    await page.getByTestId('article-desc-input').fill('')
    await page.getByTestId('article-desc-input').fill(updates.description)
  }
  if (updates.body) {
    await page.getByTestId('article-body-textarea').fill('')
    await page.getByTestId('article-body-textarea').fill(updates.body)
  }

  await Promise.all([
    page.waitForURL(/\/article\/.+/),
    page.click('button:has-text("Publish Article")'),
  ])
}

export async function deleteArticle(page: Page) {
  // Assumes we're already on the article page
  await Promise.all([
    page.waitForURL('/'),
    page.click('button:has-text("Delete Article")'),
  ])
}

export async function favoriteArticle(page: Page) {
  await page.getByTestId('fav-button').first().click()
  // Wait for the button to update to "Unfavorite"
  await expect(page.getByTestId('fav-button').first()).toContainText(
    'Unfavorite',
  )
}

export async function unfavoriteArticle(page: Page) {
  await page.getByTestId('fav-button').first().click()
  // Wait for the button to update back to "Favorite"
  await expect(page.getByTestId('fav-button').first()).toContainText('Favorite')
}

export function generateUniqueArticle(): ArticleData {
  const timestamp = Date.now()
  return {
    title: `Test Article ${timestamp}`,
    description: `Description for test article ${timestamp}`,
    body: `This is the body content for test article created at ${timestamp}. It contains enough text to be meaningful.`,
    tags: ['test', 'playwright'],
  }
}
