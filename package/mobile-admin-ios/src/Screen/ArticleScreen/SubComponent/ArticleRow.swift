// Module: Screen_ArticleScreen_SubComponent_ArticleRow

import Common_API_Type_Article
import SwiftUI

@_spi(Screen_ArticleScreen) public struct ArticleRow: View, Equatable {
  let article: Article

  public var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      Text(article.title)
        .font(.body.weight(.medium))
        .lineLimit(2)
      Text(article.slug)
        .font(.caption.monospaced())
        .foregroundStyle(.secondary)
        .lineLimit(1)
      HStack(spacing: 12) {
        Label(article.author.username, systemImage: "person")
        Label("\(article.favoritesCount)", systemImage: "heart")
        Spacer()
        Text(article.createdAt.formatted(date: .abbreviated, time: .omitted))
      }
      .font(.caption)
      .foregroundStyle(.secondary)
      .labelStyle(.titleAndIcon)
    }
    .padding(.vertical, 2)
  }

  @_spi(Screen_ArticleScreen) public init(article: Article) {
    self.article = article
  }
}
