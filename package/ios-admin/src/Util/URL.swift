// Module: App_Util_URL

@_spi(App) import App_Type
import Common_Type_Destination_Parser
import Common_Type_Destination_Type
import Foundation

// The URL is an adapter at the edges, as in the web app, but iOS has no address
// bar: there is no history to write after a step, so there is no `withUrl` (the
// app runs like the web app with `VITE_DISABLE_URL`, plus deep links). A URL
// comes in only as a deep link (`sentinel://users`), read by `parseDestination`.

// The destination the app boots on. A deep link that opened the app arrives
// before the boot is done and replaces it (`Program.swift`).
@_spi(App) public func bootDestinationOf() -> Destination {
  defaultDestination()
}

// A deep link landed on `url`: opened as a move, like a back or forward of the
// browser
@_spi(App) public func urlChangedMsg(_ url: URL) -> Msg {
  .navigationMsg(.urlChanged(parseDestination(url)))
}
