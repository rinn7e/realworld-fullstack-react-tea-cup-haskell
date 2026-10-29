package teacup

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import kotlin.time.Duration
import kotlin.time.TimeSource

/**
 * A TEA program, like `Program` of react-tea-cup: `init` and `update` return the
 * next model with commands. `onOpenUrl` is the `onUrlChange` of
 * `ProgramWithNav`: Android has no address bar, so a URL reaches the app only as
 * a deep link. The view is not here: `ProgramView` draws the model with
 * Compose, and this file stays plain Kotlin.
 */
class Program<Model, Msg>(
  val init: () -> Pair<Model, Cmd<Msg>>,
  val update: (Msg, Model) -> Pair<Model, Cmd<Msg>>,
  val onOpenUrl: (String) -> Msg,
)

/**
 * Holds the model of a program and runs its commands on `scope`. `onModel`
 * hears every new model, synchronously, so a text field that sends each edit
 * sees it back before the next frame. `onStep` hears how long each `update`
 * took, for finding a slow one.
 */
class Runtime<Model, Msg>(
  private val program: Program<Model, Msg>,
  private val scope: CoroutineScope,
  private val onModel: (Model) -> Unit,
  private val onStep: (Msg, Duration) -> Unit = { _, _ -> },
) {
  val dispatcher: Dispatcher<Msg> = Dispatcher { msg -> dispatch(msg) }

  private val initial = program.init()

  var model: Model = initial.first
    private set

  /** Runs the commands of `init`. Apart from the constructor, so the holder of the model is ready first. */
  fun start() {
    run(initial.second)
  }

  fun dispatch(msg: Msg) {
    val start = TimeSource.Monotonic.markNow()
    val (newModel, cmd) = program.update(msg, model)
    model = newModel
    onModel(newModel)
    run(cmd)
    onStep(msg, start.elapsedNow())
  }

  fun openUrl(url: String) = dispatch(program.onOpenUrl(url))

  // Every effect in its own coroutine, as tea-cup does after a step
  private fun run(cmd: Cmd<Msg>) {
    for (effect in cmd.effects) {
      scope.launch { effect(dispatcher) }
    }
  }
}
