// Module: Common_API_Type_Common

public struct ApiError: Equatable, Decodable {
  public let errors: [String: [String]]

  public init(errors: [String: [String]]) {
    self.errors = errors
  }
}

/// A failed request: the HTTP status (0 when the server was not reached), the
/// error of the API when its body is one, and the raw error
public struct HttpError: Error, Equatable {
  public let statusCode: Int
  public let err: ApiError?
  public let actualErr: String

  public init(statusCode: Int, err: ApiError?, actualErr: String) {
    self.statusCode = statusCode
    self.err = err
    self.actualErr = actualErr
  }
}

extension HttpError {
  /// The error of a request made with no token: the screens cannot load
  /// anything signed out
  public static let notAuthenticated = HttpError(
    statusCode: 401,
    err: ApiError(errors: ["body": ["Not authenticated"]]),
    actualErr: "Not authenticated"
  )
}
