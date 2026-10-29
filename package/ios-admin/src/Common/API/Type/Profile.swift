// Module: Common_API_Type

public struct Profile: Equatable, Decodable {
  public let username: String
  public let bio: String?
  public let image: String?
  public let following: Bool
}
