import SwiftUI

extension ArticleScreen.SubComponent {
  struct ArticleRow: View, Equatable {
    let article: Article

    var body: some View {
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
  }
}
