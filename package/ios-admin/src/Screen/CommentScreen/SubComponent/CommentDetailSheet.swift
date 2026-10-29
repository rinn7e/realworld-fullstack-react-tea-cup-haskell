// Module: Screen_CommentScreen_SubComponent_CommentDetailSheet

import Common_API_Type_Comment
import Component_DetailRow_Component
import Component_ProfileThumbnail_Component
import Package_TeaCup_Dispatcher
@_spi(Screen_CommentScreen) import Screen_CommentScreen_Type
import SwiftUI

@_spi(Screen_CommentScreen) public struct CommentDetailSheet: View, Equatable {
  let comment: Comment
  let dispatch: Dispatcher<CommentScreenMsg>

  public var body: some View {
    NavigationStack {
      List {
        Section("Author") {
          HStack(spacing: 12) {
            ProfileThumbnailComponent(src: comment.author.image, size: 44)
            VStack(alignment: .leading, spacing: 2) {
              Text(comment.author.username).font(.headline)
              Text(comment.author.bio.flatMap { $0.isEmpty ? nil : $0 } ?? "No bio")
                .font(.caption)
                .foregroundStyle(.secondary)
            }
          }
        }

        Section("Comment") {
          Text(comment.body)
            .textSelection(.enabled)
        }

        Section {
          DetailRowComponent(label: "Comment ID", value: "\(comment.id)", isMono: true)
          DetailRowComponent(label: "Article", value: comment.articleSlug, isMono: true)
          DetailRowComponent(label: "Created At", value: comment.createdAt.formatted(date: .abbreviated, time: .shortened), isMono: false)
        }
      }
      .navigationTitle("Comment Details")
      .navigationBarTitleDisplayMode(.inline)
      .toolbar {
        ToolbarItem(placement: .confirmationAction) {
          Button("Done") { dispatch(.clearSelected) }
        }
      }
    }
    .presentationDetents([.medium, .large])
  }

  @_spi(Screen_CommentScreen) public init(comment: Comment, dispatch: Dispatcher<CommentScreenMsg>) {
    self.comment = comment
    self.dispatch = dispatch
  }
}
