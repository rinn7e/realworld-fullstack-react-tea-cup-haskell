// Module: Screen_ArticleScreen

import Common_API_Type
import Component_DetailRow
import Component_ProfileThumbnail
import Package_TeaCup
import SwiftUI

struct ArticleDetailSheet: View, Equatable {
  let article: Article
  let dispatch: Dispatcher<ArticleScreenMsg>

  var body: some View {
    NavigationStack {
      List {
        Section {
          DetailRowComponent(label: "Title", value: article.title, isMono: false)
          DetailRowComponent(label: "Slug", value: article.slug, isMono: true)
          DetailRowComponent(label: "Description", value: article.description, isMono: false)
        }

        Section("Author") {
          HStack(spacing: 12) {
            ProfileThumbnailComponent(src: article.author.image, size: 44)
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
          DetailRowComponent(label: "Favorites", value: "\(article.favoritesCount)", isMono: false)
          DetailRowComponent(label: "Created", value: article.createdAt.formatted(date: .abbreviated, time: .shortened), isMono: false)
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
