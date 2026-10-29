struct ApiError: Equatable, Decodable {
  let errors: [String: [String]]
}

/// A failed request: the HTTP status (0 when the server was not reached), the
/// error of the API when its body is one, and the raw error
struct HttpError: Error, Equatable {
  let statusCode: Int
  let err: ApiError?
  let actualErr: String
}

extension HttpError {
  /// The error of a request made with no token: the screens cannot load
  /// anything signed out
  static let notAuthenticated = HttpError(
    statusCode: 401,
    err: ApiError(errors: ["body": ["Not authenticated"]]),
    actualErr: "Not authenticated"
  )
}
