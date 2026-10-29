package teacup

/**
 * A command: a description of work the runtime does after `update`, like `Cmd`
 * of tea-cup-fp. `update` stays pure: it only returns commands, and the runtime
 * runs them. Covariant: `Cmd.none` and a command that never sends some message
 * fit any command type.
 */
class Cmd<out Msg> internal constructor(internal val effects: List<suspend (Dispatcher<Msg>) -> Unit>) {
  fun <B> map(toMsg: (Msg) -> B): Cmd<B> =
    Cmd(effects.map { effect -> { dispatch: Dispatcher<B> -> effect(dispatch.map(toMsg)) } })

  companion object {
    val none: Cmd<Nothing> = Cmd(emptyList())

    fun <Msg> batch(cmds: List<Cmd<Msg>>): Cmd<Msg> = Cmd(cmds.flatMap { it.effects })

    fun <Msg> batch(vararg cmds: Cmd<Msg>): Cmd<Msg> = batch(cmds.toList())

    /**
     * Runs `task` and sends its result as a message, like `attemptTE` of
     * tea-cup-prelude (the task is the `TaskEither`).
     */
    fun <E, A, Msg> attempt(task: suspend () -> Either<E, A>, toMsg: (Either<E, A>) -> Msg): Cmd<Msg> =
      Cmd { dispatch -> dispatch(toMsg(task())) }

    /** Sends `msg` once the current step is done, like `Task.perform(Task.succeed)`. */
    fun <Msg> succeed(msg: Msg): Cmd<Msg> = Cmd { dispatch -> dispatch(msg) }
  }
}

/**
 * One piece of IO, like `cmdSucceed` of tea-cup-prelude: the only way to run a
 * side effect, so `update` never runs one itself.
 */
fun <Msg> Cmd(effect: suspend (dispatch: Dispatcher<Msg>) -> Unit): Cmd<Msg> = Cmd(listOf(effect))

/**
 * One more step after a step, its commands added to the first ones, like
 * `updateAndCmd` of tea-cup-prelude in a `pipe`:
 * `updateAndCmd { m -> ... }(model to cmd)`
 */
fun <Model, Msg> updateAndCmd(
  step: (Model) -> Pair<Model, Cmd<Msg>>,
): (Pair<Model, Cmd<Msg>>) -> Pair<Model, Cmd<Msg>> = { (model, cmd) ->
  val (nextModel, nextCmd) = step(model)
  nextModel to Cmd.batch(cmd, nextCmd)
}
