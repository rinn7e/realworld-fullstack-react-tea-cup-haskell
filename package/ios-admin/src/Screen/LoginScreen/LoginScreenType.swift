import Common_API_Type

public struct LoginScreenModel: Equatable {
  var email: String
  var password: String
  var isSubmitting: Bool
  var error: String?
}

public enum LoginScreenMsg {
  case changeEmail(String)
  case changePassword(String)
  case submit
  case submitResult(Result<UserResponse, HttpError>)
}
