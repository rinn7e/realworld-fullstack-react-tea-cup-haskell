export const BASE_URL: string =
  (import.meta as { env?: { VITE_BASE_URL?: string } }).env?.VITE_BASE_URL ??
  '/'

export const API_BASE: string =
  (import.meta as { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE ??
  'http://localhost:3000/api'
