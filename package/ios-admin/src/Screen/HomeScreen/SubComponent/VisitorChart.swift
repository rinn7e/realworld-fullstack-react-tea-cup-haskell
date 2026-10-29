import Charts
import SwiftUI

extension HomeScreen.SubComponent {
  /// The visitors of each period, as the area chart of the web app
  struct VisitorChart: View, Equatable {
    let stats: [VisitorStat]

    var body: some View {
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
  }
}
