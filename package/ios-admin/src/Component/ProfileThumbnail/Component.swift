import SwiftUI

/// An avatar: the image at `src`, or a person symbol when there is none or it
/// does not load
public struct ProfileThumbnailComponent: View, Equatable {
  let src: String?
  let size: CGFloat

  public init(src: String?, size: CGFloat) {
    self.src = src
    self.size = size
  }

  public var body: some View {
    AsyncImage(url: src.flatMap(URL.init(string:))) { phase in
      switch phase {
      case .success(let image):
        image.resizable().scaledToFill()
      default:
        Image(systemName: "person.crop.circle.fill")
          .resizable()
          .scaledToFit()
          .foregroundStyle(.secondary)
      }
    }
    .frame(width: size, height: size)
    .clipShape(Circle())
  }
}
