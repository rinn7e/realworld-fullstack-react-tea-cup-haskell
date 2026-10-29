// Module: Common_API_Type

import Foundation

public enum ArticleSortAttr: String, Equatable, CaseIterable {
  case id
  case title
  case favoritesCount
  case createdAt
}

public struct Article: Equatable, Decodable, Identifiable {
  public let id: Int
  public let slug: String
  public let title: String
  public let description: String
  public let body: String
  public let tagList: [String]
  public let createdAt: Date
  public let updatedAt: Date
  public let favorited: Bool
  public let favoritesCount: Int
  public let author: AdminUser
}

public struct ArticleListResponse: Equatable, Decodable {
  public let articles: [Article]
  public let articlesCount: Int
}
