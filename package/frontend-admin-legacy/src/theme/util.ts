import { type Theme } from './type'

export type ColorScheme = 'light' | 'dark' | 'auto'

const COLOR_SCHEME_KEY = 'admin-color-scheme'

export const loadColorScheme = (): ColorScheme => {
  const stored = localStorage.getItem(COLOR_SCHEME_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'auto')
    return stored
  return 'auto'
}

export const saveColorScheme = (scheme: ColorScheme): void => {
  localStorage.setItem(COLOR_SCHEME_KEY, scheme)
}

const THEME_KEY = 'admin-theme'

export const loadThemeId = (): string | null => {
  return localStorage.getItem(THEME_KEY)
}

export const saveTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_KEY, theme.id)
}

export const resolveIsDark = (scheme: ColorScheme): boolean => {
  if (scheme === 'dark') return true
  if (scheme === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const injectTheme = (theme: Theme, scheme: ColorScheme): void => {
  const root = document.documentElement
  const isDark = resolveIsDark(scheme)

  root.style.setProperty(
    '--color-primary',
    isDark ? theme.primaryColorDarkMode : theme.primaryColor,
  )
  root.style.setProperty(
    '--color-secondary',
    isDark ? theme.secondaryColorDarkMode : theme.secondaryColor,
  )
  root.style.setProperty('--font-header', theme.headerFont)
  root.style.setProperty('--font-normal', theme.normalFont)

  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
