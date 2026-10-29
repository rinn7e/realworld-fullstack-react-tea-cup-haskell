// Module: Common_API_Type

import Foundation

public struct DashboardStats: Equatable, Decodable {
  public let totalUsers: Int
  public let totalArticles: Int
  public let totalComments: Int
  public let totalVisitors: Int
  public let activeUsers24h: Int
}

public struct VisitorStat: Equatable, Decodable {
  public let name: String
  public let visitors: Int
}

public enum LogLevel: String, Equatable, Decodable {
  case INFO
  case WARNING
  case ERROR
  case DEBUG
}

public struct Log: Equatable, Decodable, Identifiable {
  public let id: Int
  public let level: LogLevel
  public let message: String
  public let source: String
  public let timestamp: Date
  public let userId: Int?
}

public struct LogListResponse: Equatable, Decodable {
  public let logs: [Log]
  public let totalCount: Int
}
