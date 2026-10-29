import SwiftUI

struct CommentDetailSheetView: View, Equatable {
  let comment: Comment
  let dispatch: Dispatcher<CommentScreen.Msg>

  var body: some View {
    NavigationStack {
      List {
        Section("Author") {
          HStack(spacing: 12) {
            ProfileThumbnailView(src: comment.author.image, size: 44)
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
          DetailRowView(label: "Comment ID", value: "\(comment.id)", isMono: true)
          DetailRowView(label: "Article", value: comment.articleSlug, isMono: true)
          DetailRowView(label: "Created At", value: comment.createdAt.formatted(date: .abbreviated, time: .shortened), isMono: false)
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
