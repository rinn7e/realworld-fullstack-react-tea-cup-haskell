import SwiftUI
import TeaCup

extension UserScreen.SubComponent {
  struct UserDetailSheet: View, Equatable {
    let user: AdminUser
    let dispatch: Dispatcher<UserScreen.Msg>

    var body: some View {
      NavigationStack {
        List {
          Section {
            HStack(spacing: 16) {
              ProfileThumbnail(src: user.image, size: 72)
              VStack(alignment: .leading, spacing: 4) {
                Text(user.username).font(.title2.bold())
                Text(user.email).foregroundStyle(.secondary)
              }
            }
            .padding(.vertical, 4)
          }

          Section {
            DetailRow(label: "User ID", value: "\(user.id)", isMono: true)
            LabeledContent("Role") { RoleBadge(role: user.role) }
            DetailRow(label: "Account Status", value: "Active", isMono: false)
          }

          Section("Biography") {
            Text("\"\(user.bio.flatMap { $0.isEmpty ? nil : $0 } ?? "This user has not written a bio yet.")\"")
              .italic()
              .foregroundStyle(.secondary)
          }

          // TODO: Member since and Total Articles are currently mock values since the AdminUser API does not return them
          Section("Account Meta") {
            DetailRow(label: "Member since", value: "Jan 2024", isMono: false)
            DetailRow(label: "Total Articles", value: "12", isMono: false)
          }
        }
        .navigationTitle("User Profile")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
          ToolbarItem(placement: .confirmationAction) {
            Button("Done") { dispatch(.clearSelected) }
          }
        }
      }
      .presentationDetents([.medium, .large])
    }
  }
}
