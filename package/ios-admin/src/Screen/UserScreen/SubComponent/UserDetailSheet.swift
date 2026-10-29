import CommonAPIType
import ComponentDetailRow
import ComponentProfileThumbnail
import ComponentRoleBadge
import SwiftUI
import TeaCup

struct UserDetailSheet: View, Equatable {
  let user: AdminUser
  let dispatch: Dispatcher<UserScreenMsg>

  var body: some View {
    NavigationStack {
      List {
        Section {
          HStack(spacing: 16) {
            ProfileThumbnailComponent(src: user.image, size: 72)
            VStack(alignment: .leading, spacing: 4) {
              Text(user.username).font(.title2.bold())
              Text(user.email).foregroundStyle(.secondary)
            }
          }
          .padding(.vertical, 4)
        }

        Section {
          DetailRowComponent(label: "User ID", value: "\(user.id)", isMono: true)
          LabeledContent("Role") { RoleBadgeComponent(role: user.role) }
          DetailRowComponent(label: "Account Status", value: "Active", isMono: false)
        }

        Section("Biography") {
          Text("\"\(user.bio.flatMap { $0.isEmpty ? nil : $0 } ?? "This user has not written a bio yet.")\"")
            .italic()
            .foregroundStyle(.secondary)
        }

        // TODO: Member since and Total Articles are currently mock values since the AdminUser API does not return them
        Section("Account Meta") {
          DetailRowComponent(label: "Member since", value: "Jan 2024", isMono: false)
          DetailRowComponent(label: "Total Articles", value: "12", isMono: false)
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
