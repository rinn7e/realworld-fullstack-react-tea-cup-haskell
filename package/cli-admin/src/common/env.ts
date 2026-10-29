import { homedir } from 'node:os'
import { join } from 'node:path'

export const API_BASE: string =
  process.env.SENTINEL_API_BASE ?? 'http://localhost:3000/api'

// Where the session token is kept between runs
export const TOKEN_FILE: string =
  process.env.SENTINEL_TOKEN_FILE ??
  join(homedir(), '.config', 'sentinel-admin', 'token')
