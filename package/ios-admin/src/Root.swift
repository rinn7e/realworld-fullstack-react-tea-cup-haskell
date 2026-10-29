import Package_TeaCup
import SwiftUI

@main
struct SentinelAdminApp: App {
  @State private var runtime = Runtime(appProgram)

  var body: some Scene {
    WindowGroup {
      ProgramView(runtime: runtime)
    }
  }
}
