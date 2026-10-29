import SwiftUI

/// The role of a user as a colored capsule (admins in purple, others in green),
/// used by the user and visitor details
struct RoleBadge: View, Equatable {
  let role: String

  var body: some View {
    let isAdmin = role == "AdminRole" || role == "admin"
    Text(role)
      .font(.caption2.weight(.semibold))
      .foregroundStyle(isAdmin ? .purple : .green)
      .padding(.horizontal, 6)
      .padding(.vertical, 1)
      .background((isAdmin ? Color.purple : Color.green).opacity(0.15), in: Capsule())
  }
}
