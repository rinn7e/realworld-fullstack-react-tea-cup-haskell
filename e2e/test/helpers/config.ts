// export const API_MODE = process.env.API_MODE?.toLowerCase() !== 'false'
// export const API_BASE = process.env.API_BASE || 'http://localhost:3000/api'

export const API_MODE = true
// export const API_BASE = 'http://localhost:3000/api'
export const API_BASE = process.env.VITE_API_BASE || 'http://localhost:3000/api'
