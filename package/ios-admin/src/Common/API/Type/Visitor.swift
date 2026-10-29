// Module: Common_API_Type_Visitor

@_spi(Common_API_Type) import Common_API_Type_User
import Foundation

public enum VisitorSortAttr: String, Equatable, CaseIterable {
  case id
  case ip
  case path
  case timestamp
}

public struct Visitor: Equatable, Decodable, Identifiable {
  public let id: Int
  public let ip: String
  public let userAgent: String
  public let path: String
  public let fingerprint: String
  public let timestamp: Date
  public let user: AdminUser?
}

public struct VisitorListResponse: Equatable, Decodable {
  public let visitors: [Visitor]
  public let totalCount: Int
}
