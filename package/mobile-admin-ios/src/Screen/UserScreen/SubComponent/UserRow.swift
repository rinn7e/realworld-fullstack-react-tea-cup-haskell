// Module: Screen_UserScreen_SubComponent_UserRow

import Common_API_Type_User
import Component_ProfileThumbnail_Component
import Component_RoleBadge_Component
import SwiftUI

/// A user in the list (a row of the web table)
@_spi(Screen_UserScreen) public struct UserRow: View, Equatable {
  let user: AdminUser

  public var body: some View {
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

  @_spi(Screen_UserScreen) public init(user: AdminUser) {
    self.user = user
  }
}
