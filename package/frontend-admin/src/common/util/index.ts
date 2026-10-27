import { cmdSucceed } from '@rinn7e/tea-cup-prelude'
import { type Cmd } from 'tea-cup-fp'

export const scrollToTopCmd = (): Cmd<{ _tag: 'NoOp' }> =>
  cmdSucceed(() => {
    const element = document.getElementById('main-content')
    if (element) {
      element.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  })

// Adds `url` to the history as a new entry (no `popstate` fires for it)
export const pushUrlCmd = (url: string): Cmd<{ _tag: 'NoOp' }> =>
  cmdSucceed(() => {
    window.history.pushState(null, '', url)
  })

// Changes the history entry shown to `url` (no `popstate` fires for it)
export const replaceUrlCmd = (url: string): Cmd<{ _tag: 'NoOp' }> =>
  cmdSucceed(() => {
    window.history.replaceState(null, '', url)
  })
