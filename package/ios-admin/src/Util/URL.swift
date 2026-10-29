import Common
import Foundation

// The URL is an adapter at the edges, as in the web app, but iOS has no address
// bar: there is no history to write after a step, so there is no `withUrl` (the
// app runs like the web app with `VITE_DISABLE_URL`, plus deep links). A URL
// comes in only as a deep link (`sentinel://users`), read by `parseDestination`.

// The destination the app boots on. A deep link that opened the app arrives
// before the boot is done and replaces it (`Program.swift`).
func bootDestinationOf() -> Destination {
  defaultDestination()
}

// A deep link landed on `url`: opened as a move, like a back or forward of the
// browser
func urlChangedMsg(_ url: URL) -> Msg {
  .navigationMsg(.urlChanged(parseDestination(url)))
}
