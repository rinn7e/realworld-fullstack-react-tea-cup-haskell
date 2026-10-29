package app

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import common.cache.Store
import common.env.Env
import debug.FpsOverlay
import okio.Path.Companion.toPath
import teacup.ProgramHost
import teacup.ProgramView
import tech.rinn7e.sentinel.admin.BuildConfig
import kotlin.time.Duration.Companion.milliseconds

/**
 * The one activity: it sets what only Android knows (the API of the build, the
 * file of the store), runs the program, and passes deep links to it (`sentinel://users`),
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

    setContent {
      Box {
        ProgramView(host) { programModel, dispatch -> PreView(programModel, dispatch) }
        // The frame rate counter of a debug build, or of a release built with
        // `-PfpsOverlay` (README, Performance)
        if (BuildConfig.DEBUG || BuildConfig.FPS_OVERLAY) FpsOverlay(Modifier.align(Alignment.TopCenter))
      }
    }
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
