import type { ApiError, HttpError } from '@/common/api'

/**
 * API field errors become "field: message, message" pairs joined by "; ",
 * otherwise the connection status and raw error are shown.
 */
export const formatListError = (err: HttpError<ApiError>): string => {
  if (err.err !== null) {
    return Object.entries(err.err.errors)
      .map(([k, v]) => `${k}: ${v.join(', ')}`)
      .join('; ')
  } else {
    return `Connection error (Status ${err.statusCode}): ${err.actualErr}`
  }
}
