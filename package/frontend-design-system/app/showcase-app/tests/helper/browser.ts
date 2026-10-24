import { type Cmd } from 'tea-cup-fp'
import { vi } from 'vitest'

export type UrlWrite = readonly ['push' | 'replace', string]

// Stubs the parts of the browser the app's commands use, with the address bar
// at `path`. Returns the list the stub records every history write into. Undo
// with `vi.unstubAllGlobals()`.
export const stubBrowser = (path: string): UrlWrite[] => {
  const writes: UrlWrite[] = []
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
    matchMedia: () => ({ matches: false }),
  })
  vi.stubGlobal('document', {
    documentElement: { classList: { add: () => {}, remove: () => {} } },
  })
  vi.stubGlobal('localStorage', {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
  })
  return writes
}

// Runs a command and returns the messages it dispatched. Commands built on
// tasks resolve asynchronously, hence the short wait.
export const runCmd = async <Msg>(cmd: Cmd<Msg>): Promise<Msg[]> => {
  const msgs: Msg[] = []
  cmd.execute((msg) => msgs.push(msg))
  await new Promise((resolve) => setTimeout(resolve, 10))
  return msgs
}
