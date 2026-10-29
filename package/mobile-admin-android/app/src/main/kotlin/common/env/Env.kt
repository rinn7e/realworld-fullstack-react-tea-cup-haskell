package common.env

/**
 * The API the app talks to, like `VITE_API_BASE`. Set once at startup by the
 * activity, from the build config (the `apiBase` Gradle property).
 */
object Env {
  var apiBase: String = "http://10.0.2.2:3000/api"
}

/** The scheme of the deep links (`sentinel://users`), the Android stand-in for the URL of the web app */
const val URL_SCHEME = "sentinel"
