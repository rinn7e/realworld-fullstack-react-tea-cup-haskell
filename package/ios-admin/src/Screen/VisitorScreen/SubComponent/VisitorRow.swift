import SwiftUI

struct VisitorRowView: View, Equatable {
  let visitor: Visitor

  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      HStack {
        Text(visitor.path)
          .font(.body.monospaced().weight(.medium))
          .lineLimit(1)
        Spacer()
        Text(visitor.timestamp.formatted(date: .abbreviated, time: .shortened))
          .font(.caption)
          .foregroundStyle(.secondary)
      }
      HStack(spacing: 12) {
        Label(visitor.ip, systemImage: "network")
        if let user = visitor.user {
          Label(user.username, systemImage: "person.fill")
        } else {
          Label("Anonymous", systemImage: "person")
        }
      }
      .font(.caption)
      .foregroundStyle(.secondary)
      Text(visitor.userAgent)
        .font(.caption2)
        .foregroundStyle(.tertiary)
        .lineLimit(1)
    }
    .padding(.vertical, 2)
  }
}
