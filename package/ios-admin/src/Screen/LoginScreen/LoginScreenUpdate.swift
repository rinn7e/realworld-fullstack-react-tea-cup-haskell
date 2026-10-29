extension LoginScreen {
  static func initial() -> (Model, Cmd<Msg>) {
    (Model(email: "", password: "", isSubmitting: false, error: nil), .none)
  }

  static func update(_ msg: Msg, _ model: Model) -> (Model, Cmd<Msg>) {
    var model = model
    switch msg {
    case .changeEmail(let value):
      model.email = value
      model.error = nil
      return (model, .none)
    case .changePassword(let value):
      model.password = value
      model.error = nil
      return (model, .none)
    case .submit:
      return submitHandler(model)
    case .submitResult(let result):
      return submitResultHandler(result, model)
    }
  }

  private static func submitHandler(_ model: Model) -> (Model, Cmd<Msg>) {
    var updatedModel = model
    if model.email.isEmpty || model.password.isEmpty {
      updatedModel.error = "Please fill in all fields."
      return (updatedModel, .none)
    } else {
      updatedModel.isSubmitting = true
      updatedModel.error = nil
      let request = LoginRequest(user: LoginRequest.User(email: model.email, password: model.password))
      return (updatedModel, .attempt({ await login(request) }, Msg.submitResult))
    }
  }

  private static func submitResultHandler(_ result: Result<UserResponse, HttpError>, _ model: Model) -> (Model, Cmd<Msg>) {
    var updatedModel = model
    updatedModel.isSubmitting = false
    switch result {
    case .success:
      updatedModel.error = nil
    case .failure(let err):
      updatedModel.error =
        err.statusCode == 401 || err.statusCode == 403
        ? "Invalid email or password."
        : "An unexpected error occurred. Please try again."
    }
    return (updatedModel, .none)
  }
}
