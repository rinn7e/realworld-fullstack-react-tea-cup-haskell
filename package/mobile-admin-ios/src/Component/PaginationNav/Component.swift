// Module: Component_PaginationNav_Component

@_spi(Component_PaginationNav) import Component_PaginationNav_Util
import Package_TeaCup_Dispatcher
import SwiftUI

/// The page controls under a list: previous, a menu of the pages (the same items
/// as the page buttons of the web app) and next.
public struct PaginationNavComponent: View, Equatable {
  let currentPage: Int
  let pageAmount: Int
  let onPageChange: Dispatcher<Int>

  public init(currentPage: Int, pageAmount: Int, onPageChange: Dispatcher<Int>) {
    self.currentPage = currentPage
    self.pageAmount = pageAmount
    self.onPageChange = onPageChange
  }

  public var body: some View {
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
          ForEach(getPaginationPageItems(currentPage, pageAmount), id: \.self) { item in
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
