// Module: Package_Debug_FpsOverlay

import OSLog
import SwiftUI
import UIKit

// A frame rate counter drawn above the whole app, sheets included, for finding
// where the app lags. A display link asks for a frame at the full rate of the
// screen (120 Hz on ProMotion); when the main thread is busy (a long `update`,
// a heavy `body`), the next callback comes late, so the frame took longer. A
// frame more than 1.5 times its budget is a hitch: it is counted and logged
// under the category `Hitch` (Console app, or the Xcode console).

private let hitchLog = Logger(subsystem: "tech.rinn7e.sentinel-admin", category: "Hitch")

// Puts the counter on the first window scene of the app. Called once at launch,
// in debug builds only.
@MainActor
public func installFpsOverlay() {
  guard
    overlayWindow == nil,
    let scene = UIApplication.shared.connectedScenes.compactMap({ $0 as? UIWindowScene }).first
  else { return }
  let window = UIWindow(windowScene: scene)
  // Above the status bar, and never takes a touch: the app below gets them all
  window.windowLevel = .statusBar + 1
  window.isUserInteractionEnabled = false
  window.backgroundColor = .clear
  let host = UIHostingController(rootView: FpsOverlayView(meter: FrameMeter()))
  host.view.backgroundColor = .clear
  window.rootViewController = host
  window.isHidden = false
  overlayWindow = window
}

@MainActor private var overlayWindow: UIWindow?

// The numbers of the last half second
@MainActor
@Observable
final class FrameMeter: NSObject {
  private(set) var fps = 0
  private(set) var worstFrameMs = 0.0
  private(set) var hitches = 0
  let maxFps = UIScreen.main.maximumFramesPerSecond

  @ObservationIgnored private var link: CADisplayLink?
  @ObservationIgnored private var lastTimestamp: CFTimeInterval?
  @ObservationIgnored private var windowStart: CFTimeInterval = 0
  @ObservationIgnored private var windowFrames = 0
  @ObservationIgnored private var windowWorst: CFTimeInterval = 0

  override init() {
    super.init()
    let link = CADisplayLink(target: self, selector: #selector(tick))
    let max = Float(maxFps)
    link.preferredFrameRateRange = CAFrameRateRange(minimum: max, maximum: max, preferred: max)
    link.add(to: .main, forMode: .common)
    self.link = link
  }

  @objc private func tick(_ link: CADisplayLink) {
    let now = link.timestamp
    defer { lastTimestamp = now }
    guard let last = lastTimestamp else {
      windowStart = now
      return
    }
    let frame = now - last
    let budget = link.targetTimestamp - link.timestamp
    if budget > 0 && frame > budget * 1.5 {
      hitches += 1
      hitchLog.warning("Hitch: \(Int(frame * 1000)) ms frame (budget \(Int(budget * 1000)) ms)")
    }
    windowFrames += 1
    windowWorst = max(windowWorst, frame)

    if now - windowStart >= 0.5 {
      fps = Int((Double(windowFrames) / (now - windowStart)).rounded())
      worstFrameMs = windowWorst * 1000
      windowStart = now
      windowFrames = 0
      windowWorst = 0
    }
  }
}

struct FpsOverlayView: View {
  let meter: FrameMeter

  var body: some View {
    VStack {
      HStack(spacing: 6) {
        Text("\(meter.fps) fps")
          .foregroundStyle(color)
        Text("worst \(Int(meter.worstFrameMs)) ms")
        Text("hitches \(meter.hitches)")
      }
      .font(.system(size: 11, weight: .semibold, design: .monospaced))
      .foregroundStyle(.white)
      .padding(.horizontal, 8)
      .padding(.vertical, 4)
      .background(.black.opacity(0.7), in: Capsule())
      .padding(.top, 2)
      Spacer()
    }
    .frame(maxWidth: .infinity)
  }

  private var color: Color {
    let ratio = Double(meter.fps) / Double(max(meter.maxFps, 1))
    return ratio > 0.9 ? .green : ratio > 0.6 ? .yellow : .red
  }
}
