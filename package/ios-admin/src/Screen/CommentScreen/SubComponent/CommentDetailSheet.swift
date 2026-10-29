// Module: Screen_CommentScreen

import Common_API_Type
import Component_DetailRow
import Component_ProfileThumbnail
import Package_TeaCup
import SwiftUI

struct CommentDetailSheet: View, Equatable {
  let comment: Comment
  let dispatch: Dispatcher<CommentScreenMsg>

  var body: some View {
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
}
