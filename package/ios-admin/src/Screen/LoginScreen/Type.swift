// Module: Screen_LoginScreen_Type

import Common_API_Type_Common
import Common_API_Type_User

public struct LoginScreenModel: Equatable {
  @_spi(Screen_LoginScreen) public var email: String
  @_spi(Screen_LoginScreen) public var password: String
  @_spi(Screen_LoginScreen) public var isSubmitting: Bool
  @_spi(Screen_LoginScreen) public var error: String?

  @_spi(Screen_LoginScreen) public init(email: String, password: String, isSubmitting: Bool, error: String? = nil) {
    self.email = email
    self.password = password
    self.isSubmitting = isSubmitting
    self.error = error
  }
}

public enum LoginScreenMsg {
  case changeEmail(String)
  case changePassword(String)
  case submit
  case submitResult(Result<UserResponse, HttpError>)
}
