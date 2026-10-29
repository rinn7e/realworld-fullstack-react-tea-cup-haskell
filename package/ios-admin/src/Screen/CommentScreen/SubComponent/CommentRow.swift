// Module: Screen_CommentScreen_SubComponent_CommentRow

import Common_API_Type_Comment
import Component_ProfileThumbnail_Component
import SwiftUI

@_spi(Screen_CommentScreen) public struct CommentRow: View, Equatable {
  let comment: Comment

  public var body: some View {
    HStack(alignment: .top, spacing: 12) {
      ProfileThumbnailComponent(src: comment.author.image, size: 32)
      VStack(alignment: .leading, spacing: 4) {
        HStack {
          Text(comment.author.username).font(.subheadline.weight(.medium))
          Spacer()
          Text(comment.createdAt.formatted(date: .abbreviated, time: .omitted))
            .font(.caption)
            .foregroundStyle(.secondary)
        }
        Text(comment.body)
          .font(.callout)
          .lineLimit(3)
        Text(comment.articleSlug)
          .font(.caption.monospaced())
          .foregroundStyle(.tertiary)
          .lineLimit(1)
      }
    }
    .padding(.vertical, 2)
  }

  @_spi(Screen_CommentScreen) public init(comment: Comment) {
    self.comment = comment
  }
}
