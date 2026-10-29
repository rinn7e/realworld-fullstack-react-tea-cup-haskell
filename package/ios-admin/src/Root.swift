// Module: Root

@_spi(MyApp) import Program
import Package_Debug_FpsOverlay
import Package_TeaCup_Program
import SwiftUI

@main
struct SentinelAdminApp: App {
  @State private var runtime = Runtime(appProgram)

  var body: some Scene {
    WindowGroup {
      ProgramView(runtime: runtime)
        #if DEBUG
          .onAppear(perform: installFpsOverlay)
        #endif
    }
  }
}
