// Module: Component_ListState

import Common_API_Type
import SwiftUI

public struct ListStateLoading: View, Equatable {
  public init() {}

  public var body: some View {
    ProgressView()
      .frame(maxWidth: .infinity, maxHeight: .infinity)
  }
}

public struct ListStateFailure: View, Equatable {
  let entityLabel: String
  let error: HttpError

  public init(entityLabel: String, error: HttpError) {
    self.entityLabel = entityLabel
    self.error = error
  }

  public var body: some View {
    ContentUnavailableView(
      "Error loading \(entityLabel)",
      systemImage: "exclamationmark.triangle",
      description: Text(formatListError(error))
    )
  }
}

public struct ListStateEmpty: View, Equatable {
  let entityLabel: String

  public init(entityLabel: String) {
    self.entityLabel = entityLabel
  }

  public var body: some View {
    ContentUnavailableView("No \(entityLabel) found.", systemImage: "tray")
  }
}
