import CommonType
import SwiftUI
import TeaCup

/// The search bar as native parts: the search field of the navigation bar
/// (`searchable`) and a sort menu in the toolbar. Submitting the field sends
/// `submit`, as the Enter of the web field does. Clearing it (its clear button
/// or Cancel) also submits, so the list comes back without the search, as iOS
/// users expect.
public struct SearchBarComponent<Sort: Hashable>: ViewModifier {
  let model: SearchBarModel<Sort>
  let sortOptions: [SearchBarOption<Sort>]
  let placeholder: String
  let dispatch: Dispatcher<SearchBarMsg<Sort>>
  @State private var buffer: InputBuffer

  public init(
    model: SearchBarModel<Sort>,
    sortOptions: [SearchBarOption<Sort>],
    placeholder: String,
    dispatch: Dispatcher<SearchBarMsg<Sort>>
  ) {
    self.model = model
    self.sortOptions = sortOptions
    self.placeholder = placeholder
    self.dispatch = dispatch
    _buffer = State(initialValue: InputBuffer(model.searchText))
  }

  public func body(content: Content) -> some View {
    content
      .searchable(text: searchText, placement: .navigationBarDrawer(displayMode: .always), prompt: placeholder)
      .textInputAutocapitalization(.never)
      .autocorrectionDisabled()
      .onSubmit(of: .search) { dispatch(.submit) }
      .onChange(of: model.searchText) { _, newValue in buffer.receive(newValue) }
      .toolbar {
        ToolbarItem(placement: .topBarTrailing) {
          Menu {
            Picker("Sort by", selection: Binding(get: { model.sort }, set: { dispatch(.changeSort($0)) })) {
              ForEach(sortOptions, id: \.value) { option in
                Text(option.label).tag(option.value)
              }
            }
            Picker("Order", selection: Binding(get: { model.direction }, set: { dispatch(.changeDirection($0)) })) {
              Label("Ascending", systemImage: "arrow.up").tag(Direction.asc)
              Label("Descending", systemImage: "arrow.down").tag(Direction.desc)
            }
          } label: {
            Label("Sort", systemImage: "arrow.up.arrow.down")
          }
        }
      }
  }

  private var searchText: Binding<String> {
    bufferBinding($buffer) { text in
      let wasSearching = !model.searchText.isEmpty
      dispatch(.changeSearchText(text))
      if text.isEmpty && wasSearching { dispatch(.submit) }
    }
  }
}

extension View {
  public func searchBar<Sort: Hashable>(
    model: SearchBarModel<Sort>,
    sortOptions: [SearchBarOption<Sort>],
    placeholder: String,
    dispatch: Dispatcher<SearchBarMsg<Sort>>
  ) -> some View {
    modifier(SearchBarComponent(model: model, sortOptions: sortOptions, placeholder: placeholder, dispatch: dispatch))
  }
}
