import Foundation

struct DashboardStats: Equatable, Decodable {
  let totalUsers: Int
  let totalArticles: Int
  let totalComments: Int
  let totalVisitors: Int
  let activeUsers24h: Int
}

struct VisitorStat: Equatable, Decodable {
  let name: String
  let visitors: Int
}

enum LogLevel: String, Equatable, Decodable {
  case INFO
  case WARNING
  case ERROR
  case DEBUG
}

struct Log: Equatable, Decodable, Identifiable {
  let id: Int
  let level: LogLevel
  let message: String
  let source: String
  let timestamp: Date
  let userId: Int?
}

struct LogListResponse: Equatable, Decodable {
  let logs: [Log]
  let totalCount: Int
}
