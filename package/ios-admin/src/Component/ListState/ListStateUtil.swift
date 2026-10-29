import Common_API_Type

/// API field errors become "field: message, message" pairs joined by "; ",
/// otherwise the connection status and raw error are shown.
func formatListError(_ err: HttpError) -> String {
  if let apiError = err.err {
    return apiError.errors
      .sorted { $0.key < $1.key }
      .map { "\($0.key): \($0.value.joined(separator: ", "))" }
      .joined(separator: "; ")
  } else {
    return "Connection error (Status \(err.statusCode)): \(err.actualErr)"
  }
}
