import { cmdSucceed } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import type { Cmd } from 'tea-cup-fp'

import { ALL_COLOR_SCHEMES, type ColorScheme } from './type'

const COLOR_SCHEME_KEY = 'realworld-color-scheme'

export const loadColorScheme = (): ColorScheme => {
  const stored = localStorage.getItem(COLOR_SCHEME_KEY)
  return pipe(
    ALL_COLOR_SCHEMES,
    A.findFirst((scheme) => scheme === stored),
    O.getOrElse((): ColorScheme => 'auto'),
  )
}

export const saveColorScheme = (scheme: ColorScheme): void => {
  localStorage.setItem(COLOR_SCHEME_KEY, scheme)
}

export const resolveIsDark = (scheme: ColorScheme): boolean => {
  if (scheme === 'dark') {
    return true
  } else if (scheme === 'light') {
    return false
  } else {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
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

export const setColorSchemeCmd = (
  scheme: ColorScheme,
): Cmd<{ readonly _tag: 'NoOp' }> =>
  cmdSucceed(() => {
    saveColorScheme(scheme)
    applyColorScheme(scheme)
  })
