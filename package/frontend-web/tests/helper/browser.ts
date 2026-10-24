import { type Cmd } from 'tea-cup-fp'
import { vi } from 'vitest'

export type UrlWrite = readonly ['push' | 'replace', string]

export type Browser = {
  // Every history write, in order
  readonly writes: UrlWrite[]
  // The path of every visit sent to the visitor tracking endpoint
  readonly visits: string[]
}

// Stubs the parts of `window`, `document`, `localStorage` and `fetch` the app
// touches, with the address bar at `path`. API calls never answer; calls to
// the visitor tracking endpoint are recorded. Undo with
// `vi.unstubAllGlobals()`.
export const stubBrowser = (path: string): Browser => {
  const writes: UrlWrite[] = []
  const visits: string[] = []
  const address = { path }
  const write =
    (mode: 'push' | 'replace') => (_: unknown, __: string, url: string) => {
      writes.push([mode, url])
      address.path = url
    }
  vi.stubGlobal('window', {
    location: {
      origin: 'http://localhost',
      get href() {
        return `http://localhost${address.path}`
      },
      get pathname() {
        return address.path.split('?')[0]
      },
      get search() {
        const i = address.path.indexOf('?')
        return i < 0 ? '' : address.path.slice(i)
      },
    },
    history: { pushState: write('push'), replaceState: write('replace') },
    // Changing page scrolls to the top; the color scheme follows the system
    scrollTo: () => undefined,
    matchMedia: () => ({ matches: false }),
  })
  vi.stubGlobal('document', {
    getElementById: () => null,
    documentElement: {
      classList: { add: () => undefined, remove: () => undefined },
    },
  })
  vi.stubGlobal('localStorage', {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
  })
  vi.stubGlobal('fetch', (url: string, init?: { body?: string }) => {
    if (url.endsWith('/visitors') && typeof init?.body === 'string') {
      const body: unknown = JSON.parse(init.body)
      if (typeof body === 'object' && body !== null && 'path' in body) {
        visits.push(String(body.path))
      }
    }
    // Never settles: requests start while commands are built, and a test does
    // not always run the command that would handle a failure
    return new Promise<never>(() => undefined)
  })
  return { writes, visits }
}

// Runs a command and returns the messages it dispatched. Commands built on
// tasks resolve asynchronously, hence the short wait.
export const runCmd = async <Msg>(cmd: Cmd<Msg>): Promise<Msg[]> => {
  const msgs: Msg[] = []
  cmd.execute((msg) => msgs.push(msg))
  await new Promise((resolve) => setTimeout(resolve, 10))
  return msgs
}
