import Foundation

/// The API the app talks to: the `ApiBase` key of Info.plist (set by
/// `API_BASE` in `project.yml`), like `VITE_API_BASE`. The simulator reaches the
/// backend on this Mac at `localhost`.
let API_BASE: String =
  (Bundle.main.object(forInfoDictionaryKey: "ApiBase") as? String).flatMap { $0.isEmpty ? nil : $0 }
    ?? "http://localhost:3000/api"

/// The scheme of the deep links (`sentinel://users`), the iOS stand-in for the
/// URL of the web app
let URL_SCHEME = "sentinel"
