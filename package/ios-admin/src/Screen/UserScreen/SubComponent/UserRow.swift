import SwiftUI

/// A user in the list (a row of the web table)
struct UserRowView: View, Equatable {
  let user: AdminUser

  var body: some View {
    HStack(spacing: 12) {
      ProfileThumbnailView(src: user.image, size: 40)
      VStack(alignment: .leading, spacing: 2) {
        HStack {
          Text(user.username)
            .font(.body.weight(.medium))
            .lineLimit(1)
            .truncationMode(.middle)
          RoleBadgeView(role: user.role)
            .fixedSize()
        }
        Text(user.email)
          .font(.subheadline)
          .foregroundStyle(.secondary)
          .lineLimit(1)
          .truncationMode(.middle)
        if let bio = user.bio, !bio.isEmpty {
          Text(bio)
            .font(.caption)
            .foregroundStyle(.tertiary)
            .lineLimit(1)
        }
      }
      Spacer()
      Text("#\(user.id)")
        .font(.caption.monospaced())
        .foregroundStyle(.tertiary)
    }
  }
}

struct RoleBadgeView: View, Equatable {
  let role: String

  var body: some View {
    let isAdmin = role == "AdminRole" || role == "admin"
    Text(role)
      .font(.caption2.weight(.semibold))
      .foregroundStyle(isAdmin ? .purple : .green)
      .padding(.horizontal, 6)
      .padding(.vertical, 1)
      .background((isAdmin ? Color.purple : Color.green).opacity(0.15), in: Capsule())
  }
}
