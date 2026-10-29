import { cmdSucceed } from '@rinn7e/tea-cup-prelude'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { type Cmd } from 'tea-cup-fp'

import { TOKEN_FILE } from '@/common/env'

// The session token, in a file only the user can read (`TOKEN_FILE`)

export const loadToken = (): string | null => {
  try {
    const token = readFileSync(TOKEN_FILE, 'utf8').trim()
    return token === '' ? null : token
  } catch (_err) {
    // No token saved yet
    return null
  }
}

export const saveToken = (token: string): void => {
  mkdirSync(dirname(TOKEN_FILE), { recursive: true, mode: 0o700 })
  writeFileSync(TOKEN_FILE, token, { mode: 0o600 })
}

export const removeToken = (): void => {
  rmSync(TOKEN_FILE, { force: true })
}

export const saveTokenCmd = (token: string): Cmd<{ _tag: 'NoOp' }> =>
  cmdSucceed(() => {
    saveToken(token)
  })

export const removeTokenCmd = (): Cmd<{ _tag: 'NoOp' }> =>
  cmdSucceed(() => {
    removeToken()
  })
