// Module: MyApp_Root

@_spi(MyApp) import MyApp_Program
import Package_TeaCup_Program
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
