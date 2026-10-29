import SwiftUI

struct VisitorDetailSheetView: View, Equatable {
  let visitor: Visitor
  let dispatch: Dispatcher<VisitorScreen.Msg>

  var body: some View {
    NavigationStack {
      List {
        Section {
          VStack(alignment: .leading, spacing: 4) {
            Text("Visitor #\(visitor.id)").font(.title2.bold())
            Text(visitor.timestamp.formatted(date: .long, time: .standard)).foregroundStyle(.secondary)
          }
        }

        Section {
          DetailRowView(label: "IP Address", value: visitor.ip, isMono: true)
          DetailRowView(label: "Path", value: visitor.path, isMono: true)
        }

        Section {
          VStack(alignment: .leading, spacing: 6) {
            Text("Fingerprint").font(.subheadline).foregroundStyle(.secondary)
            Text(visitor.fingerprint)
              .font(.caption.monospaced())
              .textSelection(.enabled)
          }
          FingerprintBreakdownView(ip: visitor.ip, userAgent: visitor.userAgent)
        } header: {
          Text("Device")
        } footer: {
          Text(
            "Each unique combination of IP address, browser User-Agent, and Accept-Language header produces the same hash, identifying the same device across visits without storing personal data."
          )
        }

        if let user = visitor.user {
          Section("Linked User") {
            DetailRowView(label: "User ID", value: "#\(user.id)", isMono: true)
            DetailRowView(label: "Username", value: "@\(user.username)", isMono: false)
            DetailRowView(label: "Email", value: user.email, isMono: false)
            LabeledContent("Role") { RoleBadgeView(role: user.role) }
          }
        }
      }
      .navigationTitle("Visitor Details")
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

/// How the fingerprint is calculated, with the inputs of this visitor
private struct FingerprintBreakdownView: View, Equatable {
  let ip: String
  let userAgent: String

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text("How is this calculated?")
        .font(.caption.bold())
        .foregroundStyle(.secondary)
      Text("SHA-256( IP | User-Agent | Accept-Language )")
        .font(.caption.monospaced())
      tagLine("IP", ip, .blue)
      tagLine("UA", userAgent, .purple)
    }
    .padding(.vertical, 4)
  }

  private func tagLine(_ tag: String, _ value: String, _ color: Color) -> some View {
    HStack(alignment: .firstTextBaseline, spacing: 8) {
      Text(tag)
        .font(.caption2.monospaced().bold())
        .foregroundStyle(color)
        .padding(.horizontal, 6)
        .background(color.opacity(0.15), in: RoundedRectangle(cornerRadius: 4))
      Text(value)
        .font(.caption)
        .foregroundStyle(.secondary)
    }
  }
}
