import CommonAPIType
import ComponentProfileThumbnail
import SwiftUI

extension CommentScreen.SubComponent {
  struct CommentRow: View, Equatable {
    let comment: Comment

    var body: some View {
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
  }
}
