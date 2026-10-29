import SwiftUI

struct ArticleDetailSheetView: View, Equatable {
  let article: Article
  let dispatch: Dispatcher<ArticleScreen.Msg>

  var body: some View {
    NavigationStack {
      List {
        Section {
          DetailRowView(label: "Title", value: article.title, isMono: false)
          DetailRowView(label: "Slug", value: article.slug, isMono: true)
          DetailRowView(label: "Description", value: article.description, isMono: false)
        }

        Section("Author") {
          HStack(spacing: 12) {
            ProfileThumbnailView(src: article.author.image, size: 44)
            VStack(alignment: .leading, spacing: 2) {
              Text(article.author.username).font(.headline)
              Text(article.author.bio.flatMap { $0.isEmpty ? nil : $0 } ?? "No bio")
                .font(.caption)
                .foregroundStyle(.secondary)
            }
          }
        }

        Section("Body Content") {
          Text(article.body)
            .font(.callout)
            .textSelection(.enabled)
        }

        Section {
          DetailRowView(label: "Favorites", value: "\(article.favoritesCount)", isMono: false)
          DetailRowView(label: "Created", value: article.createdAt.formatted(date: .abbreviated, time: .shortened), isMono: false)
        }
      }
      .navigationTitle("Article Details")
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
