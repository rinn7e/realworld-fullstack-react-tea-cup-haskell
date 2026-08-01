import { Page } from '@playwright/test'

/**
 * Performs a UI action and waits for all network activity to settle.
 * (Wait until there are no network connections for at least 500ms).
 */
export async function performActionAndWaitForResponse(
  page: Page,
  action: () => Promise<void>,
): Promise<void> {
  await action()
  await page.waitForLoadState('networkidle')
}
