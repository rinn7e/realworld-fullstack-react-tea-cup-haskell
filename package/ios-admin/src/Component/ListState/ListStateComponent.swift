import SwiftUI

struct ListLoadingView: View, Equatable {
  var body: some View {
    ProgressView()
      .frame(maxWidth: .infinity, maxHeight: .infinity)
  }
}

struct ListErrorView: View, Equatable {
  let entityLabel: String
  let error: HttpError

  var body: some View {
    ContentUnavailableView(
      "Error loading \(entityLabel)",
      systemImage: "exclamationmark.triangle",
      description: Text(formatListError(error))
    )
  }
}

struct ListEmptyView: View, Equatable {
  let entityLabel: String

  var body: some View {
    ContentUnavailableView("No \(entityLabel) found.", systemImage: "tray")
  }
}
