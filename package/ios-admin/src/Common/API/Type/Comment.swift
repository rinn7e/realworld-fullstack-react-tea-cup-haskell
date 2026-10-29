import Foundation

enum CommentSortAttr: String, Equatable, CaseIterable {
  case id
  case createdAt
  case author
}

struct Comment: Equatable, Decodable, Identifiable {
  let id: Int
  let body: String
  let createdAt: Date
  let updatedAt: Date
  let articleSlug: String
  let author: Profile
}

struct CommentListResponse: Equatable, Decodable {
  let comments: [Comment]
  let totalCount: Int
}
