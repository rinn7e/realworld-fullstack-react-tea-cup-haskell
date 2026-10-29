import { type Platform } from '@core/platform'

import { API_BASE } from '@/common/env'

const TOKEN_KEY = 'jwtToken'

// The core's platform in the browser: the API from the build's env, the
// token in `localStorage`
export const webPlatform: Platform = {
  apiBase: API_BASE,
  loadToken: () => localStorage.getItem(TOKEN_KEY),
  saveToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token)
  },
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY)
  },
}
