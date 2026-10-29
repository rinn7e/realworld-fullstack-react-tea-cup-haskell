package screen.loginscreen

import common.api.handler.login
import common.api.type.HttpError
import common.api.type.LoginRequest
import common.api.type.UserResponse
import teacup.Cmd
import teacup.Either

fun initial(): Pair<Model, Cmd<Msg>> = Model(email = "", password = "", isSubmitting = false, error = null) to Cmd.none

fun update(msg: Msg, model: Model): Pair<Model, Cmd<Msg>> =
  when (msg) {
    is Msg.ChangeEmail -> model.copy(email = msg.value, error = null) to Cmd.none
    is Msg.ChangePassword -> model.copy(password = msg.value, error = null) to Cmd.none
    Msg.Submit -> submitHandler(model)
    is Msg.SubmitResult -> submitResultHandler(msg.result, model)
  }

private fun submitHandler(model: Model): Pair<Model, Cmd<Msg>> =
  if (model.email.isEmpty() || model.password.isEmpty()) {
    model.copy(error = "Please fill in all fields.") to Cmd.none
  } else {
    val request = LoginRequest(LoginRequest.User(email = model.email, password = model.password))
    model.copy(isSubmitting = true, error = null) to Cmd.attempt({ login(request) }, Msg::SubmitResult)
  }

private fun submitResultHandler(result: Either<HttpError, UserResponse>, model: Model): Pair<Model, Cmd<Msg>> {
  val error =
    when (result) {
      is Either.Right -> null
      is Either.Left ->
        if (result.value.statusCode == 401 || result.value.statusCode == 403) {
          "Invalid email or password."
        } else {
          "An unexpected error occurred. Please try again."
        }
    }
  return model.copy(isSubmitting = false, error = error) to Cmd.none
}
