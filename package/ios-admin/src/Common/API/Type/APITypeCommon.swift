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
