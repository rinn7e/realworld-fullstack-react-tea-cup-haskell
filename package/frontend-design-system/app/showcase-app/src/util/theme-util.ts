import { cmdSucceed } from '@rinn7e/tea-cup-prelude'
import type { Cmd } from 'tea-cup-fp'

export type ColorScheme = 'light' | 'dark' | 'auto'

const COLOR_SCHEME_KEY = 'showcase-color-scheme'

export const loadColorScheme = (): ColorScheme => {
  const stored = localStorage.getItem(COLOR_SCHEME_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'auto')
    return stored
  return 'auto'
}

export const saveColorScheme = (scheme: ColorScheme): void => {
  localStorage.setItem(COLOR_SCHEME_KEY, scheme)
}

export const resolveIsDark = (scheme: ColorScheme): boolean => {
  if (scheme === 'dark') return true
  if (scheme === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const applyColorScheme = (scheme: ColorScheme): void => {
  const root = document.documentElement
  const isDark = resolveIsDark(scheme)

  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const setColorSchemeCmd = (scheme: ColorScheme): Cmd<{ _tag: 'NoOp' }> =>
  cmdSucceed(() => {
    saveColorScheme(scheme)
    applyColorScheme(scheme)
  })
