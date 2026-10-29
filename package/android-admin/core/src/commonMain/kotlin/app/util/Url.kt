package app.util

import app.Msg
import common.type.destination.Destination
import common.type.destination.NavigationMsg
import common.type.destination.defaultDestination
import common.type.destination.parseDestination

// The URL is an adapter at the edges, as in the web app, but Android has no
// address bar: there is no history to write after a step, so there is no
// `withUrl` (the app runs like the web app with `VITE_DISABLE_URL`, plus deep
// links). A URL comes in only as a deep link (`sentinel://users`), read by
// `parseDestination`.

// The destination the app boots on. A deep link that opened the app arrives
// before the boot is done and replaces it (`Program.kt`).
fun bootDestinationOf(): Destination = defaultDestination()

// A deep link landed on `url`: opened as a move, like a back or forward of the
// browser
fun urlChangedMsg(url: String): Msg = Msg.NavigationMsg(NavigationMsg.UrlChanged(parseDestination(url)))
