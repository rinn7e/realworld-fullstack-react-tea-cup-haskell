package app

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import common.cache.Store
import common.env.Env
import okio.Path.Companion.toPath
import teacup.ProgramHost
import teacup.ProgramView
import tech.rinn7e.sentinel.admin.BuildConfig
import kotlin.time.Duration.Companion.milliseconds

/**
 * The one activity: it sets what core cannot know (the API, the file of the
 * store), runs the program, and passes deep links to it (`sentinel://users`),
 * both the one that opened the app and the ones that come while it runs.
 */
class MainActivity : ComponentActivity() {
  private lateinit var host: ProgramHost<ProgramModel, Msg>

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    Env.apiBase = BuildConfig.API_BASE
    Store.ensure { PreferenceDataStoreFactory.createWithPath { filesDir.resolve("admin.preferences_pb").absolutePath.toPath() } }

    // A slow `update` is logged with its message (logcat, tag Step): a jank
    // right after one is its cost
    host =
      ProgramHost(appProgram) { msg, elapsed ->
        if (BuildConfig.DEBUG && elapsed > 4.milliseconds) Log.w("Step", "Slow update: $elapsed for ${msg.toString().take(120)}")
      }
    host.start()
    intent?.data?.let { host.openUrl(it.toString()) }

    setContent { ProgramView(host) { programModel, dispatch -> PreView(programModel, dispatch) } }
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    intent.data?.let { host.openUrl(it.toString()) }
  }

  override fun onDestroy() {
    host.stop()
    super.onDestroy()
  }
}
