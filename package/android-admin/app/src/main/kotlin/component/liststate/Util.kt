package component.liststate

import common.api.type.HttpError

/**
 * API field errors become "field: message, message" pairs joined by "; ",
 * otherwise the connection status and raw error are shown.
 */
fun formatListError(err: HttpError): String {
  val apiError = err.err
  return if (apiError != null) {
    apiError.errors.entries
      .sortedBy { it.key }
      .joinToString("; ") { (key, messages) -> "$key: ${messages.joinToString(", ")}" }
  } else {
    "Connection error (Status ${err.statusCode}): ${err.actualErr}"
  }
}
