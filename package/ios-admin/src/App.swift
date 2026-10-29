// Module: SentinelAdmin (the app target, project.yml)

import Common_Type_Destination
import Package_TeaCup
import Screen_ArticleScreen
import Screen_CommentScreen
import Screen_HomeScreen
import Screen_LoginScreen
import Screen_SettingScreen
import Screen_UserScreen
import Screen_VisitorScreen
import SwiftUI
import Theme

/// The app: the login screen alone when signed out, otherwise the screens as
/// tabs (the sidebar of the web app; on iPad the tab bar can become a sidebar).
/// The selected tab is read from the model, and choosing one is a move
/// (`Navigate`), so every screen opens afresh, as on the web.
///
/// An iPhone tab bar holds five tabs, and the "More" list of the system does
/// not write the selection back, so its screens could not be reached by a move.
/// Settings is opened from the account button of the navigation bar instead,
/// as a modal screen; its Done is a move to the overview.
struct AppView: View, Equatable {
  let model: Model
  let dispatch: Dispatcher<Msg>

  private static let tabs: [(screen: Screen, label: String, systemImage: String)] = [
    (.homeScreen, "Overview", "chart.bar.xaxis"),
    (.articleScreen, "Articles", "doc.text"),
    (.userScreen, "Users", "person.2"),
    (.commentScreen, "Comments", "bubble.left.and.bubble.right"),
    (.visitorScreen, "Visitors", "globe"),
  ]

  var body: some View {
    let currentScreen = currentScreenOf(model.screenModel.screenModel)
    Group {
      switch currentScreen {
      case .loginScreen:
        ScreenView(model: model, dispatch: dispatch)
      case .settingScreen:
        NavigationStack {
          ScreenView(model: model, dispatch: dispatch)
            .toolbar {
              ToolbarItem(placement: .confirmationAction) {
                Button("Done") { dispatch(.navigationMsg(.navigate(defaultDestination()))) }
              }
            }
        }
        .transition(.move(edge: .bottom))
      case .notFoundScreen:
        NavigationStack {
          ContentUnavailableView {
            Label("404 Not Found", systemImage: "questionmark.folder")
          } actions: {
            Button("Go to Overview") { dispatch(.navigationMsg(.navigate(defaultDestination()))) }
          }
        }
      default:
        TabView(selection: Binding(get: { currentScreen }, set: { dispatch(.navigationMsg(.navigate(destinationOfScreen($0)))) })) {
          ForEach(Self.tabs, id: \.screen) { tab in
            Tab(tab.label, systemImage: tab.systemImage, value: tab.screen) {
              NavigationStack {
                Group {
                  if tab.screen == currentScreen {
                    ScreenView(model: model, dispatch: dispatch)
                  } else {
                    // A tab not shown yet: choosing it opens its screen
                    ProgressView()
                  }
                }
                .toolbar {
                  ToolbarItem(placement: .topBarLeading) {
                    Button {
                      dispatch(.navigationMsg(.navigate(destinationOfScreen(.settingScreen))))
                    } label: {
                      Label("Settings", systemImage: "person.crop.circle")
                    }
                  }
                }
              }
            }
          }
        }
        .tabViewStyle(.sidebarAdaptable)
      }
    }
    .animation(.default, value: currentScreen == .settingScreen)
    .tint(model.theme.primaryColor)
    .preferredColorScheme(preferredColorSchemeOf(model.colorScheme))
  }
}

private struct ScreenView: View, Equatable {
  let model: Model
  let dispatch: Dispatcher<Msg>

  var body: some View {
    switch model.screenModel.screenModel {
    case .homeScreenModel(let screenModel):
      HomeScreenComponent(model: screenModel, shared: model.shared, dispatch: dispatch.map(Msg.homeScreenMsg))
    case .articleScreenModel(let screenModel):
      ArticleScreenComponent(model: screenModel, shared: model.shared, dispatch: dispatch.map(Msg.articleScreenMsg))
    case .userScreenModel(let screenModel):
      UserScreenComponent(model: screenModel, shared: model.shared, dispatch: dispatch.map(Msg.userScreenMsg))
    case .commentScreenModel(let screenModel):
      CommentScreenComponent(model: screenModel, shared: model.shared, dispatch: dispatch.map(Msg.commentScreenMsg))
    case .visitorScreenModel(let screenModel):
      VisitorScreenComponent(model: screenModel, shared: model.shared, dispatch: dispatch.map(Msg.visitorScreenMsg))
    case .loginScreenModel(let screenModel):
      LoginScreenComponent(model: screenModel, dispatch: dispatch.map(Msg.loginScreenMsg))
    case .settingScreenModel:
      SettingScreenComponent(user: model.shared.user, colorScheme: model.colorScheme, theme: model.theme, dispatch: dispatch.map(Msg.settingScreenMsg))
    case .notFoundScreenModel:
      ContentUnavailableView("404 Not Found", systemImage: "questionmark.folder")
    }
  }
}
