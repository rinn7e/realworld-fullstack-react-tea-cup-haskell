import Foundation

enum ArticleSortAttr: String, Equatable, CaseIterable {
  case id
  case title
  case favoritesCount
  case createdAt
}

struct Article: Equatable, Decodable, Identifiable {
  let id: Int
  let slug: String
  let title: String
  let description: String
  let body: String
  let tagList: [String]
  let createdAt: Date
  let updatedAt: Date
  let favorited: Bool
  let favoritesCount: Int
  let author: AdminUser
}

struct ArticleListResponse: Equatable, Decodable {
  let articles: [Article]
  let articlesCount: Int
}
