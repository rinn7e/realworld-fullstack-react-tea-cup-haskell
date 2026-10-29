import Package_TeaCup
import SwiftUI

public struct LoginScreenComponent: View, Equatable {
  let model: LoginScreenModel
  let dispatch: Dispatcher<LoginScreenMsg>

  public init(model: LoginScreenModel, dispatch: Dispatcher<LoginScreenMsg>) {
    self.model = model
    self.dispatch = dispatch
  }

  public var body: some View {
    NavigationStack {
      Form {
        Section {
          VStack(spacing: 12) {
            Image(systemName: "shield.lefthalf.filled")
              .font(.system(size: 56))
              .foregroundStyle(.tint)
            Text("Sentinel Admin")
              .font(.largeTitle.bold())
            Text("Sign in to manage the RealWorld platform telemetry.")
              .font(.subheadline)
              .foregroundStyle(.secondary)
              .multilineTextAlignment(.center)
          }
          .frame(maxWidth: .infinity)
          .padding(.vertical, 12)
        }
        .listRowBackground(Color.clear)

        Section {
          InputView("Email Address", value: model.email) { dispatch(.changeEmail($0)) }
            .textContentType(.username)
            .keyboardType(.emailAddress)
            .textInputAutocapitalization(.never)
            .autocorrectionDisabled()
            .submitLabel(.next)
          InputView("Password", value: model.password, kind: .secure) { dispatch(.changePassword($0)) }
            .textContentType(.password)
            .submitLabel(.go)
        } footer: {
          if let error = model.error {
            Label(error, systemImage: "exclamationmark.circle.fill")
              .foregroundStyle(.red)
          }
        }

        Section {
          Button {
            dispatch(.submit)
          } label: {
            HStack {
              Spacer()
              if model.isSubmitting {
                ProgressView()
              } else {
                Text("Sign In").bold()
              }
              Spacer()
            }
          }
          .disabled(model.isSubmitting)
        }
      }
      .onSubmit { dispatch(.submit) }
    }
  }
}
