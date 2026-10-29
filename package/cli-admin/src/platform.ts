import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

import { type Platform } from '@core/platform'

import { API_BASE, TOKEN_FILE } from '@/common/env'

const readToken = (): string | null => {
  try {
    const token = readFileSync(TOKEN_FILE, 'utf8').trim()
    return token === '' ? null : token
  } catch (_err) {
    // No token saved yet
    return null
  }
}

// The core's platform in the terminal: the API from the env, the token in a
// file only the user can read
export const cliPlatform: Platform = {
  apiBase: API_BASE,
  loadToken: readToken,
  saveToken: (token) => {
    mkdirSync(dirname(TOKEN_FILE), { recursive: true, mode: 0o700 })
    writeFileSync(TOKEN_FILE, token, { mode: 0o600 })
  },
  removeToken: () => {
    rmSync(TOKEN_FILE, { force: true })
  },
}
