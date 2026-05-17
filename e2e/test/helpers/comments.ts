import { Page } from '@playwright/test'

export async function addComment(page: Page, commentText: string) {
  // Assumes we're on an article page - wait for comment form to be ready
  await page.getByTestId('comment-textarea').fill(commentText)

  // Get initial comment count
  const initialCount = await page.getByTestId('comment-card').count()

  await page.click('button:has-text("Post Comment")')

  // Wait for a new comment to appear (count should increase by 1)
  await page.waitForFunction(
    (expectedCount) =>
      document.querySelectorAll('[data-test="comment-card"]').length >=
      expectedCount,
    initialCount + 1,
    { timeout: 5000 },
  )
}

export async function deleteComment(page: Page, commentText: string) {
  // Find the comment card containing the text and click its delete button
  const commentCard = page.getByTestId('comment-card').filter({
    hasText: commentText,
  })
  await commentCard.getByTestId('delete-comment-btn').click()

  // Wait for comment to disappear
}

export async function getCommentCount(page: Page): Promise<number> {
  return await page.getByTestId('comment-card').count()
}
