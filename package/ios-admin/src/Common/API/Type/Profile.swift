struct Profile: Equatable, Decodable {
  let username: String
  let bio: String?
  let image: String?
  let following: Bool
}
