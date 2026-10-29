// Module: Package_TeaCup_Cmd

import Foundation
@_spi(Package_TeaCup) import Package_TeaCup_Dispatcher

/// A command: a description of work the runtime does after `update`, like `Cmd`
/// of tea-cup-fp. `update` stays pure: it only returns commands, and the runtime
/// runs them.
public struct Cmd<Msg> {
  public typealias Effect = @MainActor (_ dispatch: Dispatcher<Msg>) async -> Void

  fileprivate let effects: [Effect]

  /// One piece of IO, like `cmdSucceed` of tea-cup-prelude: the only way to run a
  /// side effect, so `update` never runs one itself.
  public init(effect: @escaping Effect) {
    effects = [effect]
  }

  private init(effects: [Effect]) {
    self.effects = effects
  }

  public static var none: Cmd { Cmd(effects: []) }

  public static func batch(_ cmds: [Cmd]) -> Cmd {
    Cmd(effects: cmds.flatMap(\.effects))
  }

  /// Runs `task` and sends its result as a message, like `attemptTE` of
  /// tea-cup-prelude (the task is the `TaskEither`, `Result` its `Either`).
  public static func attempt<A, E>(
    _ task: @escaping () async -> Result<A, E>,
    _ toMsg: @escaping (Result<A, E>) -> Msg
  ) -> Cmd {
    Cmd { dispatch in dispatch(toMsg(await task())) }
  }

  /// Sends `msg` once the current step is done, like `Task.perform(Task.succeed)`.
  public static func succeed(_ msg: Msg) -> Cmd {
    Cmd { dispatch in dispatch(msg) }
  }

  public func map<B>(_ toMsg: @escaping (Msg) -> B) -> Cmd<B> {
    Cmd<B>(effects: effects.map { effect in
      { dispatch in await effect(dispatch.map(toMsg)) }
    })
  }

  /// Runs every effect, each in its own task, as tea-cup does after a step.
  /// Internal: only the runtime of this module runs commands.
  @MainActor
  @_spi(Package_TeaCup) public func run(_ dispatch: Dispatcher<Msg>) {
    for effect in effects {
      Task { await effect(dispatch) }
    }
  }
}

/// One more step after a step, its commands added to the first ones, like
/// `updateAndCmd` of tea-cup-prelude in a `pipe`:
/// `updateAndCmd { m in ... }((model, cmd))`
public func updateAndCmd<Model, Msg>(
  _ step: @escaping (Model) -> (Model, Cmd<Msg>)
) -> ((Model, Cmd<Msg>)) -> (Model, Cmd<Msg>) {
  { previous in
    let (model, cmd) = step(previous.0)
    return (model, .batch([previous.1, cmd]))
  }
}
