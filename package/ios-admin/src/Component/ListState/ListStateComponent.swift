import SwiftUI

enum ListState {
  struct Loading: View, Equatable {
    var body: some View {
      ProgressView()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
  }

  struct Failure: View, Equatable {
    let entityLabel: String
    let error: HttpError

    var body: some View {
      ContentUnavailableView(
        "Error loading \(entityLabel)",
        systemImage: "exclamationmark.triangle",
        description: Text(ListState.formatListError(error))
      )
    }
  }

  struct Empty: View, Equatable {
    let entityLabel: String

    var body: some View {
      ContentUnavailableView("No \(entityLabel) found.", systemImage: "tray")
    }
  }
}
