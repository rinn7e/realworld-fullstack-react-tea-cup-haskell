// Module: Common_API_Type_Comment

@_spi(Common_API_Type) import Common_API_Type_Profile
import Foundation

public enum CommentSortAttr: String, Equatable, CaseIterable {
  case id
  case createdAt
  case author
}

public struct Comment: Equatable, Decodable, Identifiable {
  public let id: Int
  public let body: String
  public let createdAt: Date
  public let updatedAt: Date
  public let articleSlug: String
  public let author: Profile
}

public struct CommentListResponse: Equatable, Decodable {
  public let comments: [Comment]
  public let totalCount: Int
}
