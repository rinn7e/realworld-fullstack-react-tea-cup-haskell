package teacup

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlin.time.Duration

/**
 * Holds a runtime for Compose: the model is Compose state, set in the same call
 * as the `dispatch` that made it, so a text field that sends every edit reads
 * its edit back before the next frame. Commands run on the main thread.
 */
class ProgramHost<Model, Msg>(program: Program<Model, Msg>, onStep: (Msg, Duration) -> Unit = { _, _ -> }) {
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
  private val runtime: Runtime<Model, Msg> = Runtime(program, scope, onModel = { model = it }, onStep = onStep)

  var model: Model by mutableStateOf(runtime.model)
    private set

  val dispatcher: Dispatcher<Msg> get() = runtime.dispatcher

  fun start() = runtime.start()

  fun openUrl(url: String) = runtime.openUrl(url)

  fun stop() = scope.cancel()
}

/**
 * Shows a program: the view of the model, drawn again after every step. The
 * views below skip when their input did not change (strong skipping, with the
 * types of core compared by equals, `stability.conf`).
 */
@Composable
fun <Model, Msg> ProgramView(host: ProgramHost<Model, Msg>, view: @Composable (Model, Dispatcher<Msg>) -> Unit) {
  view(host.model, host.dispatcher)
}
