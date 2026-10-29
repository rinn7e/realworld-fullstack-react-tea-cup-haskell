package screen.loginscreen

import common.api.type.HttpError
import common.api.type.UserResponse
import teacup.Either

data class Model(
  val email: String,
  val password: String,
  val isSubmitting: Boolean,
  val error: String?,
)

sealed interface Msg {
  data class ChangeEmail(val value: String) : Msg

  data class ChangePassword(val value: String) : Msg

  data object Submit : Msg

  data class SubmitResult(val result: Either<HttpError, UserResponse>) : Msg
}
