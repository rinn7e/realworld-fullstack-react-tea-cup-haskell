import SwiftUI

enum PaginationNav {
  /// The page controls under a list: previous, a menu of the pages (the same items
  /// as the page buttons of the web app) and next.
  struct Component: View, Equatable {
    let currentPage: Int
    let pageAmount: Int
    let onPageChange: Dispatcher<Int>

    var body: some View {
      if pageAmount > 1 {
        HStack {
          Button {
            onPageChange(currentPage - 1)
          } label: {
            Image(systemName: "chevron.left")
          }
          .disabled(currentPage <= 1)
          .accessibilityLabel("Previous page")

          Spacer()

          Menu {
            ForEach(PaginationNav.getPaginationPageItems(currentPage, pageAmount), id: \.self) { item in
              switch item {
              case .page(let page):
                Button {
                  onPageChange(page)
                } label: {
                  if page == currentPage {
                    Label("Page \(page)", systemImage: "checkmark")
                  } else {
                    Text("Page \(page)")
                  }
                }
              case .ellipsis:
                Divider()
              }
            }
          } label: {
            Text("Page \(currentPage) of \(pageAmount)")
              .font(.subheadline.weight(.medium))
              .monospacedDigit()
          }

          Spacer()

          Button {
            onPageChange(currentPage + 1)
          } label: {
            Image(systemName: "chevron.right")
          }
          .disabled(currentPage >= pageAmount)
          .accessibilityLabel("Next page")
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(.bar)
      }
    }
  }
}
