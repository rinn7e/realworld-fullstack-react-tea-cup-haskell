// Module: Screen_HomeScreen_SubComponent_VisitorChart

import Charts
import Common_API_Type_Dashboard
import SwiftUI

/// The visitors of each period, as the area chart of the web app
@_spi(Screen_HomeScreen) public struct VisitorChart: View, Equatable {
  let stats: [VisitorStat]

  public var body: some View {
    Chart(stats, id: \.name) { stat in
      AreaMark(x: .value("Period", stat.name), y: .value("Visitors", stat.visitors))
        .interpolationMethod(.monotone)
        .foregroundStyle(.linearGradient(colors: [.accentColor.opacity(0.25), .accentColor.opacity(0)], startPoint: .top, endPoint: .bottom))
      LineMark(x: .value("Period", stat.name), y: .value("Visitors", stat.visitors))
        .interpolationMethod(.monotone)
        .lineStyle(StrokeStyle(lineWidth: 3))
      PointMark(x: .value("Period", stat.name), y: .value("Visitors", stat.visitors))
        .symbolSize(30)
    }
    .chartYAxis {
      AxisMarks(position: .leading)
    }
    .frame(height: 220)
  }

  @_spi(Screen_HomeScreen) public init(stats: [VisitorStat]) {
    self.stats = stats
  }
}
