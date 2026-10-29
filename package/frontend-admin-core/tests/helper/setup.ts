import { setPlatform } from '@core/platform'

// A platform with nothing stored and no server: the tests never reach the
// API
setPlatform({
  apiBase: 'http://localhost:3000/api',
  loadToken: () => null,
  saveToken: () => undefined,
  removeToken: () => undefined,
})
