export const BASE_URL: string =
  (import.meta as { env?: { VITE_BASE_URL?: string } }).env?.VITE_BASE_URL ??
  '/'

export const API_BASE: string =
  (import.meta as { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE ??
  'http://localhost:3000/api'

export const IS_RUNNING_E2E: boolean =
  (import.meta as any).env?.VITE_IS_RUNNING_E2E !== 'false'
