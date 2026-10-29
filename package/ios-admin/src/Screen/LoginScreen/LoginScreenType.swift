enum LoginScreen {
  struct Model: Equatable {
    var email: String
    var password: String
    var isSubmitting: Bool
    var error: String?
  }

  enum Msg {
    case changeEmail(String)
    case changePassword(String)
    case submit
    case submitResult(Result<UserResponse, HttpError>)
  }
}
