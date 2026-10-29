import CommonAPIType
import SwiftUI
import TeaCup

extension HomeScreen.SubComponent {
  /// The detail of a log, the slide-over panel of the web app as a sheet
  struct LogDetailSheet: View, Equatable {
    let log: Log
    let dispatch: Dispatcher<HomeScreen.Msg>

    var body: some View {
      NavigationStack {
        List {
          Section("Event Message") {
            Text(log.message)
              .font(.callout.monospaced())
              .textSelection(.enabled)
          }
          Section {
            DetailRow(label: "Level", value: log.level.rawValue, isMono: false)
            DetailRow(label: "Source", value: log.source, isMono: true)
            DetailRow(label: "Occurrence Time", value: log.timestamp.formatted(date: .abbreviated, time: .standard), isMono: false)
          }
          Section("Context Metadata") {
            DetailRow(label: "Node ID", value: "node-ap-southeast-1a", isMono: true)
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
              HomeScreen.SubComponent.LevelBadge(level: log.level)
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
}
