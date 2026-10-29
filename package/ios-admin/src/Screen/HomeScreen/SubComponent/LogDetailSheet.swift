// Module: Screen_HomeScreen

import Common_API_Type
import Component_DetailRow
import Package_TeaCup
import SwiftUI

/// The detail of a log, the slide-over panel of the web app as a sheet
struct LogDetailSheet: View, Equatable {
  let log: Log
  let dispatch: Dispatcher<HomeScreenMsg>

  var body: some View {
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
}
