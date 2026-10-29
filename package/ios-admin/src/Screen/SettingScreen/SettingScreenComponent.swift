import Common
import SwiftUI
import TeaCup
import Theme

enum SettingScreen {
  struct Component: View, Equatable {
    let user: AuthUser?
    let colorScheme: Theme.ColorScheme
    let theme: Theme
    let dispatch: Dispatcher<Msg>

    private static let schemeOptions: [(value: Theme.ColorScheme, label: String, description: String, systemImage: String)] = [
      (.light, "Light", "Always use light interface", "sun.max"),
      (.dark, "Dark", "Always use dark interface", "moon"),
      (.auto, "Auto", "Follow your OS setting", "circle.lefthalf.filled"),
    ]

    var body: some View {
      Form {
        // Account Profile Section
        if let user {
          Section {
            HStack(spacing: 16) {
              if user.image != nil {
                ProfileThumbnail(src: user.image, size: 64)
              } else {
                Text(user.username.prefix(2).uppercased())
                  .font(.title2.weight(.black))
                  .foregroundStyle(.tint)
                  .frame(width: 64, height: 64)
                  .background(.tint.opacity(0.15), in: Circle())
              }
              VStack(alignment: .leading, spacing: 4) {
                HStack {
                  Text(user.username).font(.title3.bold())
                  Text("ADMINISTRATOR")
                    .font(.caption2.weight(.black))
                    .foregroundStyle(.tint)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(.tint.opacity(0.15), in: Capsule())
                }
                Text(user.email).font(.subheadline).foregroundStyle(.secondary)
                if let bio = user.bio, !bio.isEmpty {
                  Text("\"\(bio)\"").font(.footnote).italic().foregroundStyle(.secondary)
                }
              }
            }
            .padding(.vertical, 4)
          } header: {
            Text("Account")
          }
        }

        // Appearance Section
        Section {
          ForEach(Self.schemeOptions, id: \.value) { option in
            Button {
              dispatch(.setColorScheme(option.value))
            } label: {
              HStack {
                Label {
                  VStack(alignment: .leading) {
                    Text(option.label).foregroundStyle(.primary)
                    Text(option.description).font(.caption).foregroundStyle(.secondary)
                  }
                } icon: {
                  Image(systemName: option.systemImage).foregroundStyle(theme.primaryColor)
                }
                Spacer()
                if colorScheme == option.value {
                  Image(systemName: "checkmark").foregroundStyle(theme.primaryColor).bold()
                }
              }
            }
            .tint(.primary)
          }
        } header: {
          Text("Appearance")
        }

        // Theme Section
        Section {
          ForEach(themes) { option in
            Button {
              dispatch(.switchTheme(option))
            } label: {
              HStack {
                Circle()
                  .fill(option.primaryColor)
                  .overlay(Circle().strokeBorder(option.secondaryColor, lineWidth: 3))
                  .frame(width: 24, height: 24)
                Text(option.name).foregroundStyle(.primary)
                Spacer()
                if theme == option {
                  Image(systemName: "checkmark").foregroundStyle(theme.primaryColor).bold()
                }
              }
            }
            .tint(.primary)
          }
        } header: {
          Text("Color Theme")
        }

        Section {
          Button("Sign Out", role: .destructive) { dispatch(.logout) }
        }
      }
      .navigationTitle("Settings")
    }
  }
}
