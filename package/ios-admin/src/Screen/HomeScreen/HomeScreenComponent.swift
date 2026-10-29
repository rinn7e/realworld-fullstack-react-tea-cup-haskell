import SwiftUI

extension HomeScreen {
  /// The views used only by this screen (`SubComponent/`)
  enum SubComponent {}

  struct Component: View, Equatable {
    let model: HomeScreen.Model
    let shared: Shared
    let dispatch: Dispatcher<HomeScreen.Msg>

    var body: some View {
      List {
        Section {
          statsView
        }
        .listRowInsets(EdgeInsets())
        .listRowBackground(Color.clear)

        Section {
          Picker("Period", selection: Binding(get: { model.currentFilter }, set: { dispatch(.changeFilter($0)) })) {
            Text("24h").tag(HomeScreen.TimeFilter.day)
            Text("Week").tag(HomeScreen.TimeFilter.week)
            Text("Month").tag(HomeScreen.TimeFilter.month)
            Text("Year").tag(HomeScreen.TimeFilter.year)
          }
          .pickerStyle(.segmented)
          visitorChartView
        } header: {
          Text("Visitor Activity")
        }

        Section("System Logs") {
          logsView
        }
      }
      .listStyle(.insetGrouped)
      .navigationTitle("Overview")
      .refreshable { dispatch(.refresh) }
      .toolbar {
        ToolbarItem(placement: .topBarTrailing) {
          Button {
            dispatch(.refresh)
          } label: {
            Label("Refresh", systemImage: "arrow.clockwise")
          }
        }
      }
      .sheet(item: Binding(get: { model.selectedLog }, set: { if $0 == nil { dispatch(.selectLog(nil)) } })) { log in
        HomeScreen.SubComponent.LogDetailSheet(log: log, dispatch: dispatch)
      }
    }

    @ViewBuilder
    private var statsView: some View {
      switch model.stats {
      case .initial, .pending:
        ProgressView().frame(maxWidth: .infinity, minHeight: 120)
      case .failure(let err):
        Text("Error loading stats: \(err.actualErr)").foregroundStyle(.red)
      case .success(let stats):
        LazyVGrid(columns: [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)], spacing: 12) {
          HomeScreen.SubComponent.StatCard(label: "Total Users", value: "\(stats.totalUsers)", systemImage: "person.2.fill", color: .indigo)
          HomeScreen.SubComponent.StatCard(label: "Total Articles", value: "\(stats.totalArticles)", systemImage: "doc.text.fill", color: .blue)
          HomeScreen.SubComponent.StatCard(label: "Total Comments", value: "\(stats.totalComments)", systemImage: "bubble.left.and.bubble.right.fill", color: .purple)
          HomeScreen.SubComponent.StatCard(label: "Total Visitors", value: "\(stats.totalVisitors)", systemImage: "globe", color: .orange)
          HomeScreen.SubComponent.StatCard(label: "Active Users (24h)", value: "\(stats.activeUsers24h)", systemImage: "bolt.fill", color: .green)
        }
      }
    }

    @ViewBuilder
    private var visitorChartView: some View {
      switch model.visitorStats {
      case .initial, .pending:
        ProgressView().frame(maxWidth: .infinity, minHeight: 220)
      case .failure(let err):
        Text("Error loading visitor activity: \(err.actualErr)").foregroundStyle(.red)
      case .success(let stats):
        HomeScreen.SubComponent.VisitorChart(stats: stats).padding(.vertical, 8)
      }
    }

    @ViewBuilder
    private var logsView: some View {
      switch model.logs {
      case .initial, .pending:
        ProgressView().frame(maxWidth: .infinity)
      case .failure(let err):
        Text("Error loading logs: \(err.actualErr)").foregroundStyle(.red)
      case .success(let logs) where logs.isEmpty:
        Text("No recent activity logs.").foregroundStyle(.secondary)
      case .success(let logs):
        ForEach(logs) { log in
          Button {
            dispatch(.selectLog(log))
          } label: {
            LogRow(log: log)
          }
          .tint(.primary)
        }
      }
    }
  }

  private struct LogRow: View, Equatable {
    let log: Log

    var body: some View {
      VStack(alignment: .leading, spacing: 6) {
        HStack {
          HomeScreen.SubComponent.LevelBadge(level: log.level)
          Text(log.source)
            .font(.caption.monospaced())
            .foregroundStyle(.secondary)
          Spacer()
          Text(log.timestamp.formatted(date: .omitted, time: .shortened))
            .font(.caption)
            .foregroundStyle(.secondary)
        }
        Text(log.message)
          .font(.footnote.monospaced())
          .lineLimit(2)
      }
      .padding(.vertical, 2)
    }
  }
}
