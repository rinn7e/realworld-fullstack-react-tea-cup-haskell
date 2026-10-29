import SwiftUI

/// A TEA program, like `Program` of react-tea-cup: `init` and `update` return the
/// next model with commands, `view` draws the model. `onOpenUrl` is the
/// `onUrlChange` of `ProgramWithNav`: iOS has no address bar, so a URL reaches
/// the app only as a deep link.
struct Program<Model, Msg, Content: View> {
  let `init`: () -> (Model, Cmd<Msg>)
  let update: (Msg, Model) -> (Model, Cmd<Msg>)
  let view: (Model, Dispatcher<Msg>) -> Content
  let onOpenUrl: (URL) -> Msg
}

/// Holds the model of a program and runs its commands.
@MainActor
@Observable
final class Runtime<Model, Msg, Content: View> {
  private(set) var model: Model
  @ObservationIgnored private let program: Program<Model, Msg, Content>
  @ObservationIgnored private(set) var dispatcher: Dispatcher<Msg> = Dispatcher { _ in }

  init(_ program: Program<Model, Msg, Content>) {
    let (model, cmd) = program.`init`()
    self.program = program
    self.model = model
    dispatcher = Dispatcher { [unowned self] msg in dispatch(msg) }
    cmd.run(dispatcher)
  }

  func dispatch(_ msg: Msg) {
    let (newModel, cmd) = program.update(msg, model)
    model = newModel
    cmd.run(dispatcher)
  }

  fileprivate var content: Content {
    program.view(model, dispatcher)
  }

  fileprivate func openUrl(_ url: URL) {
    dispatch(program.onOpenUrl(url))
  }
}

/// Shows a runtime. The body reads the model, so it runs again after every step;
/// the views below it are `Equatable` and skip their body when their input did
/// not change.
struct ProgramView<Model, Msg, Content: View>: View {
  @State var runtime: Runtime<Model, Msg, Content>

  var body: some View {
    runtime.content
      .onOpenURL(perform: runtime.openUrl)
  }
}
