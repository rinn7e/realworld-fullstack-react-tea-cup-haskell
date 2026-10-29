import CommonAPIType
import CommonType
import SwiftUI
import TeaCup

public struct HomeScreenComponent: View, Equatable {
  let model: HomeScreenModel
  let shared: Shared
  let dispatch: Dispatcher<HomeScreenMsg>

  public init(model: HomeScreenModel, shared: Shared, dispatch: Dispatcher<HomeScreenMsg>) {
    self.model = model
    self.shared = shared
    self.dispatch = dispatch
  }

  public var body: some View {
    List {
      Section {
        statsView
      }
      .listRowInsets(EdgeInsets())
      .listRowBackground(Color.clear)

      Section {
        Picker("Period", selection: Binding(get: { model.currentFilter }, set: { dispatch(.changeFilter($0)) })) {
          Text("24h").tag(HomeScreenTimeFilter.day)
          Text("Week").tag(HomeScreenTimeFilter.week)
          Text("Month").tag(HomeScreenTimeFilter.month)
          Text("Year").tag(HomeScreenTimeFilter.year)
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
      LogDetailSheet(log: log, dispatch: dispatch)
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
        StatCard(label: "Total Users", value: "\(stats.totalUsers)", systemImage: "person.2.fill", color: .indigo)
        StatCard(label: "Total Articles", value: "\(stats.totalArticles)", systemImage: "doc.text.fill", color: .blue)
        StatCard(label: "Total Comments", value: "\(stats.totalComments)", systemImage: "bubble.left.and.bubble.right.fill", color: .purple)
        StatCard(label: "Total Visitors", value: "\(stats.totalVisitors)", systemImage: "globe", color: .orange)
        StatCard(label: "Active Users (24h)", value: "\(stats.activeUsers24h)", systemImage: "bolt.fill", color: .green)
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
      VisitorChart(stats: stats).padding(.vertical, 8)
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
        LevelBadge(level: log.level)
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
