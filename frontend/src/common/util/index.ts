import { cmdSucceed } from '@rinn7e/tea-cup-prelude'
import { type Cmd } from 'tea-cup-fp'

import { BASE_URL } from '@/common/env'

export * from './memo-strategy'
export * from './form'

export const assetPath = (path: string): string => {
  if (path.startsWith('http') || path.startsWith('//')) {
    return path
  }
  const base = BASE_URL.replace(/\/$/, '')
  const cleanPath = path.replace(/^\//, '')
  return base + '/' + cleanPath
}

export const scrollToTopCmd = (): Cmd<{ _tag: 'NoOp' }> =>
  cmdSucceed(() =>
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    }),
  )
