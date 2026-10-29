// Module: Package_TeaCup_Program

@_spi(Package_TeaCup) import Package_TeaCup_Cmd
@_spi(Package_TeaCup) import Package_TeaCup_Dispatcher
import OSLog
import SwiftUI

private let signposter = OSSignposter(subsystem: "tech.rinn7e.sentinel-admin", category: .pointsOfInterest)
private let stepLog = Logger(subsystem: "tech.rinn7e.sentinel-admin", category: "Step")

/// A TEA program, like `Program` of react-tea-cup: `init` and `update` return the
/// next model with commands, `view` draws the model. `onOpenUrl` is the
/// `onUrlChange` of `ProgramWithNav`: iOS has no address bar, so a URL reaches
/// the app only as a deep link.
public struct TeaCupProgram<Model, Msg, Content: View> {
  let `init`: () -> (Model, Cmd<Msg>)
  let update: (Msg, Model) -> (Model, Cmd<Msg>)
  let view: (Model, Dispatcher<Msg>) -> Content
  let onOpenUrl: (URL) -> Msg

  // Written out: the memberwise initializer of a struct is never public
  public init(
    init: @escaping () -> (Model, Cmd<Msg>),
    update: @escaping (Msg, Model) -> (Model, Cmd<Msg>),
    view: @escaping (Model, Dispatcher<Msg>) -> Content,
    onOpenUrl: @escaping (URL) -> Msg
  ) {
    self.`init` = `init`
    self.update = update
    self.view = view
    self.onOpenUrl = onOpenUrl
  }
}

/// Holds the model of a program and runs its commands.
@MainActor
@Observable
public final class Runtime<Model, Msg, Content: View> {
  public private(set) var model: Model
  @ObservationIgnored private let program: TeaCupProgram<Model, Msg, Content>
  @ObservationIgnored private(set) var dispatcher: Dispatcher<Msg> = Dispatcher { _ in }

  public init(_ program: TeaCupProgram<Model, Msg, Content>) {
    let (model, cmd) = program.`init`()
    self.program = program
    self.model = model
    dispatcher = Dispatcher { [unowned self] msg in dispatch(msg) }
    cmd.run(dispatcher)
  }

  public func dispatch(_ msg: Msg) {
    // Each step is an interval in Instruments (Points of Interest), and a slow
    // `update` is logged with its message: a hitch right after one is its cost
    let state = signposter.beginInterval("update", "\(String(describing: msg).prefix(120))")
    let start = ContinuousClock.now
    let (newModel, cmd) = program.update(msg, model)
    model = newModel
    cmd.run(dispatcher)
    signposter.endInterval("update", state)
    #if DEBUG
      let elapsed = ContinuousClock.now - start
      if elapsed > .milliseconds(4) {
        stepLog.warning("Slow update: \(elapsed) for \(String(describing: msg).prefix(120))")
      }
    #endif
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
public struct ProgramView<Model, Msg, Content: View>: View {
  @State var runtime: Runtime<Model, Msg, Content>

  public init(runtime: Runtime<Model, Msg, Content>) {
    _runtime = State(initialValue: runtime)
  }

  public var body: some View {
    runtime.content
      .onOpenURL(perform: runtime.openUrl)
  }
}
