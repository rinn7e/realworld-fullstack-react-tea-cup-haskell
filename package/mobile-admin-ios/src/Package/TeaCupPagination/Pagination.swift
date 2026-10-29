// Module: Package_TeaCupPagination_Pagination

import Package_TeaCup_Cmd
import Package_TeaCup_RemoteData

/// A paged list, ported from `@rinn7e/tea-cup-pagination`: the model holds the
/// page shown and its items, `update` fetches a page through `Config.handler`.
/// The views draw the items themselves (`renderItems` of the web package is a
/// view, so it lives in each screen here).
public enum Pagination {
  public struct Page<Item> {
    public let items: [Item]
    public let totalCount: Int

    public init(items: [Item], totalCount: Int) {
      self.items = items
      self.totalCount = totalCount
    }
  }

  public struct Config<Item, Err: Error> {
    let handler: (_ offset: Int, _ limit: Int) async -> Result<Page<Item>, Err>
    let limit: Int

    public init(handler: @escaping (_ offset: Int, _ limit: Int) async -> Result<Page<Item>, Err>, limit: Int) {
      self.handler = handler
      self.limit = limit
    }
  }

  public struct Model<Item: Equatable, Err: Equatable>: Equatable {
    public var items: RemoteData<Err, [Item]>
    public var page: Int
    public var pageAmount: Int

    public init(items: RemoteData<Err, [Item]>, page: Int, pageAmount: Int) {
      self.items = items
      self.page = page
      self.pageAmount = pageAmount
    }
  }

  public enum Msg<Item, ItemMsg, Err: Error> {
    case changePage(Int)
    case fetchResponse(page: Int, result: Result<Page<Item>, Err>)
    case itemMsg(ItemMsg, item: Item)
    case noOp
  }

  public static func initial<Item, ItemMsg, Err>(
    _ config: Config<Item, Err>,
    page: Int = 1
  ) -> (Model<Item, Err>, Cmd<Msg<Item, ItemMsg, Err>>) {
    (Model(items: .pending, page: page, pageAmount: 0), fetchCmd(config, page: page))
  }

  public static func update<Item, ItemMsg, Err>(
    _ config: Config<Item, Err>
  ) -> (Msg<Item, ItemMsg, Err>, Model<Item, Err>) -> (Model<Item, Err>, Cmd<Msg<Item, ItemMsg, Err>>) {
    { msg, model in
      var model = model
      switch msg {
      case .changePage(let page):
        if page == model.page {
          return (model, .none)
        } else {
          model.page = page
          model.items = .pending
          return (model, fetchCmd(config, page: page))
        }

      case .fetchResponse(let page, let result):
        // A late answer for a page left already is dropped
        guard page == model.page else { return (model, .none) }
        switch result {
        case .success(let value):
          model.items = .success(value.items)
          model.pageAmount = Int((Double(value.totalCount) / Double(config.limit)).rounded(.up))
        case .failure(let error):
          model.items = .failure(error)
        }
        return (model, .none)

      case .itemMsg, .noOp:
        return (model, .none)
      }
    }
  }

  private static func fetchCmd<Item, ItemMsg, Err>(
    _ config: Config<Item, Err>,
    page: Int
  ) -> Cmd<Msg<Item, ItemMsg, Err>> {
    let offset = (page - 1) * config.limit
    return .attempt({ await config.handler(offset, config.limit) }) { result in
      .fetchResponse(page: page, result: result)
    }
  }
}
