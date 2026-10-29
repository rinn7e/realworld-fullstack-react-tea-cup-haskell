import Foundation

enum VisitorSortAttr: String, Equatable, CaseIterable {
  case id
  case ip
  case path
  case timestamp
}

struct Visitor: Equatable, Decodable, Identifiable {
  let id: Int
  let ip: String
  let userAgent: String
  let path: String
  let fingerprint: String
  let timestamp: Date
  let user: AdminUser?
}

struct VisitorListResponse: Equatable, Decodable {
  let visitors: [Visitor]
  let totalCount: Int
}
