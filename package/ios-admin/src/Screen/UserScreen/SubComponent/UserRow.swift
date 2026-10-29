import CommonAPIType
import ComponentProfileThumbnail
import ComponentRoleBadge
import SwiftUI

/// A user in the list (a row of the web table)
struct UserRow: View, Equatable {
  let user: AdminUser

  var body: some View {
    HStack(spacing: 12) {
      ProfileThumbnailComponent(src: user.image, size: 40)
      VStack(alignment: .leading, spacing: 2) {
        HStack {
          Text(user.username)
            .font(.body.weight(.medium))
            .lineLimit(1)
            .truncationMode(.middle)
          RoleBadgeComponent(role: user.role)
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
