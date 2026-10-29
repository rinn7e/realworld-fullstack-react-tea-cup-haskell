// Module: Screen_ArticleScreen_SubComponent_ArticleDetailSheet

import Common_API_Type_Article
import Component_DetailRow_Component
import Component_ProfileThumbnail_Component
import Package_TeaCup_Dispatcher
@_spi(Screen_ArticleScreen) import Screen_ArticleScreen_Type
import SwiftUI

@_spi(Screen_ArticleScreen) public struct ArticleDetailSheet: View, Equatable {
  let article: Article
  let dispatch: Dispatcher<ArticleScreenMsg>

  public var body: some View {
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

  @_spi(Screen_ArticleScreen) public init(article: Article, dispatch: Dispatcher<ArticleScreenMsg>) {
    self.article = article
    self.dispatch = dispatch
  }
}
