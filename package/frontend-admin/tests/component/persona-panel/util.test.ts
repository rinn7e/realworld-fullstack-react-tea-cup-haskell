import { describe, expect, it } from 'vitest'

import { detectBrowser, detectOs } from '@/component/persona-panel/util'

const CHROME_MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
const SAFARI_MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'
const FIREFOX_WIN =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0'
const OPERA_LINUX =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 OPR/112.0.0.0'

describe('detectBrowser', () => {
  it('prefers the more specific browser tokens', () => {
    expect(detectBrowser(CHROME_MAC)).toBe('Chrome')
    expect(detectBrowser(SAFARI_MAC)).toBe('Safari')
    expect(detectBrowser(FIREFOX_WIN)).toBe('Firefox')
    expect(detectBrowser(OPERA_LINUX)).toBe('Opera')
    expect(detectBrowser('curl/8.0')).toBe('Unknown')
  })
})

describe('detectOs', () => {
  it('detects the operating system', () => {
    expect(detectOs(CHROME_MAC)).toBe('MacOS')
    expect(detectOs(FIREFOX_WIN)).toBe('Windows')
    expect(detectOs(OPERA_LINUX)).toBe('Linux')
    expect(detectOs('curl/8.0')).toBe('Unknown')
  })
})
