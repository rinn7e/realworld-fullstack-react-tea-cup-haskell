// Module: Screen_HomeScreen_SubComponent_LogDetailSheet

import Common_API_Type_Dashboard
import Component_DetailRow_Component
import Package_TeaCup_Dispatcher
@_spi(Screen_HomeScreen) import Screen_HomeScreen_SubComponent_LevelBadge
@_spi(Screen_HomeScreen) import Screen_HomeScreen_Type
import SwiftUI

/// The detail of a log, the slide-over panel of the web app as a sheet
@_spi(Screen_HomeScreen) public struct LogDetailSheet: View, Equatable {
  let log: Log
  let dispatch: Dispatcher<HomeScreenMsg>

  public var body: some View {
    NavigationStack {
      List {
        Section("Event Message") {
          Text(log.message)
            .font(.callout.monospaced())
            .textSelection(.enabled)
        }
        Section {
          DetailRowComponent(label: "Level", value: log.level.rawValue, isMono: false)
          DetailRowComponent(label: "Source", value: log.source, isMono: true)
          DetailRowComponent(label: "Occurrence Time", value: log.timestamp.formatted(date: .abbreviated, time: .standard), isMono: false)
        }
        Section("Context Metadata") {
          DetailRowComponent(label: "Node ID", value: "node-ap-southeast-1a", isMono: true)
          LabeledContent("Environment") {
            Text("Production").foregroundStyle(.green).bold()
          }
        }
      }
      .navigationTitle("Log Detail")
      .navigationBarTitleDisplayMode(.inline)
      .toolbar {
        ToolbarItem(placement: .principal) {
          HStack {
            Text("Log Detail").font(.headline)
            LevelBadge(level: log.level)
          }
        }
        ToolbarItem(placement: .confirmationAction) {
          Button("Done") { dispatch(.selectLog(nil)) }
        }
      }
    }
    .presentationDetents([.medium, .large])
  }

  @_spi(Screen_HomeScreen) public init(log: Log, dispatch: Dispatcher<HomeScreenMsg>) {
    self.log = log
    self.dispatch = dispatch
  }
}
