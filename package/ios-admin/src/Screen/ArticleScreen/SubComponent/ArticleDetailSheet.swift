import Common
import SwiftUI
import TeaCup

extension ArticleScreen.SubComponent {
  struct ArticleDetailSheet: View, Equatable {
    let article: Article
    let dispatch: Dispatcher<ArticleScreen.Msg>

    var body: some View {
      NavigationStack {
        List {
          Section {
            DetailRow(label: "Title", value: article.title, isMono: false)
            DetailRow(label: "Slug", value: article.slug, isMono: true)
            DetailRow(label: "Description", value: article.description, isMono: false)
          }

          Section("Author") {
            HStack(spacing: 12) {
              ProfileThumbnail(src: article.author.image, size: 44)
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
            DetailRow(label: "Favorites", value: "\(article.favoritesCount)", isMono: false)
            DetailRow(label: "Created", value: article.createdAt.formatted(date: .abbreviated, time: .shortened), isMono: false)
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
}
