export const BASE_URL: string = import.meta.env.VITE_BASE_URL ?? '/'

export const API_BASE: string =
  import.meta.env.VITE_API_BASE ?? 'http://localhost:3000/api'

// Debugging only: the app ignores the URL (in-app navigation alone), see
// `withUrl`
export const IS_DISABLE_URL: boolean =
  import.meta.env.VITE_DISABLE_URL === 'true'
