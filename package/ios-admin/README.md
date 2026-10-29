# Sentinel Admin (iOS)

A native iOS port of [`frontend-admin`](../frontend-admin) (the Sentinel Dashboard), written in Swift and SwiftUI with The Elm Architecture. It talks to the same backend (`package/backend`) through the same `/api/admin` endpoints.

## Tech Stack

- [**Swift 6 compiler, Swift 5 language mode**](https://www.swift.org): Language
- [**SwiftUI**](https://developer.apple.com/xcode/swiftui/): Views (iOS 18 and later)
- [**Swift Charts**](https://developer.apple.com/documentation/charts): The visitor chart
- **`lib/TeaCup`**: a small TEA runtime written for this app (`Cmd`, `Dispatcher`, `Program`, `RemoteData`), in the place of `react-tea-cup`, `tea-cup-fp` and `tea-cup-prelude`
- **`lib/TeaCupPagination`**: a port of `@rinn7e/tea-cup-pagination`
- [**XcodeGen**](https://github.com/yonaskolb/XcodeGen): Generates the Xcode project from `project.yml`

There is no third-party dependency.

## How to Run

1. Start the backend on `http://localhost:3000` (see `package/backend`), for example with `ALLOW_CORS=true make api` in `package/backend`.
2. Generate the Xcode project, then open it in Xcode and run the `SentinelAdmin` scheme on a simulator:
   ```bash
   xcodegen generate
   open SentinelAdmin.xcodeproj
   ```

Or build and run it from the command line:

```bash
xcodebuild -project SentinelAdmin.xcodeproj -scheme SentinelAdmin -destination 'platform=iOS Simulator,name=iPhone 17 Pro' -derivedDataPath build build
xcrun simctl install booted build/Build/Products/Debug-iphonesimulator/SentinelAdmin.app
xcrun simctl launch booted tech.rinn7e.sentinel-admin
```

The simulator reaches the backend on this Mac at `localhost`. Another API is set with `API_BASE` in `project.yml` (the `VITE_API_BASE` of the web app).

Test account: `admin@example.com`, password `testtest` (from `package/backend/resource/seed.sql`).

## From frontend-admin to ios-admin

The file tree follows the one of `frontend-admin/src`, in the casing of Swift: folders and files are UpperCamelCase, with acronyms in capitals (`API`, `URL`). Every module keeps its folder, and a file keeps its role (`Type`, `Update`, `Util`, `Component`) with the module as a prefix, since Swift does not allow two files of the same name in one target (`screen/user-screen/type.ts` is `Screen/UserScreen/UserScreenType.swift`).

| frontend-admin | ios-admin |
| --- | --- |
| `src/root.tsx`, `program.tsx`, `app.tsx` | `src/Root.swift`, `Program.swift`, `App.swift` |
| `src/type.ts`, `update.ts` | `src/Type.swift`, `Update.swift` |
| `src/handler/navigation-handler.ts` | `src/Handler/NavigationHandler.swift` |
| `src/util/` (destination, guard, url) | `src/Util/` (`Destination`, `Guard`, `URL`) |
| `src/common/api/type/`, `common/api/handler/` | `src/Common/API/Type/`, `Common/API/Handler/` |
| `src/common/type/destination/` | `src/Common/Type/Destination/` |
| `src/component/` (search bar, pagination nav, list state) | `src/Component/` (`SearchBar/`, `PaginationNav/`, `ListState/`) |
| `src/screen/<name>-screen/` (`type`, `update`, `util`, `component`, `sub-component/`) | `src/Screen/<Name>Screen/` (`<Name>ScreenType.swift`, `...Update`, `...Util`, `...Component`, `SubComponent/`) |
| `src/theme/` | `src/Theme/` |

The roots (`src`, `lib`, `doc`) stay in lowercase, as in the other packages of this repo.

A name says where it is defined: the namespace is the folder, and the member is the role of the file. So a name read anywhere in the app leads to its file, the way an import path does on the web:

| Name | File |
| --- | --- |
| `ArticleScreen.Model`, `ArticleScreen.Msg` | `Screen/ArticleScreen/ArticleScreenType.swift` |
| `ArticleScreen.initial`, `ArticleScreen.update` | `Screen/ArticleScreen/ArticleScreenUpdate.swift` |
| `ArticleScreen.Component` | `Screen/ArticleScreen/ArticleScreenComponent.swift` |
| `ArticleScreen.SubComponent.ArticleRow` | `Screen/ArticleScreen/SubComponent/ArticleRow.swift` |
| `SearchBar.Component` | `Component/SearchBar/SearchBarComponent.swift` |
| `ListState.Loading`, `ListState.Failure`, `ListState.Empty` | `Component/ListState/ListStateComponent.swift` |
| `DetailRow`, `RoleBadge` (a component of one file) | `Component/DetailRow.swift`, `Component/RoleBadge.swift` |

The folder `Screen/` is not a level of the name: an `enum Screen` already exists (the screen of a destination), and the `Screen` at the end of each name says it. A view is a `Component` and not a `View`, since inside the namespace `View` would hide the `View` protocol of SwiftUI.

| TypeScript and tea-cup | Swift |
| --- | --- |
| A module of a screen (`import * as UserScreen`) | An `enum` namespace (`UserScreen.Model`, `UserScreen.update`) split over its files with `extension` |
| `UserScreenMemo` from `@/screen/user-screen/component` | `UserScreen.Component` |
| `Model` with `ModelEq`, `Props` with `PropsEq`, `memo` | A `struct` that is `Equatable`; a view that is `Equatable` skips its body when its input did not change |
| A sum type with `_tag` and `switch` | An `enum` with associated values and `switch` |
| `Option<A>` | `A?` |
| `TaskEither<HttpError, A>` and `attemptTE` | `async` function returning `Result<A, HttpError>` and `Cmd.attempt` |
| `RemoteData` of remote-data-ts | `RemoteData` (`lib/TeaCup`) |
| `dispatch` with `EqAlways` | `Dispatcher`, which is always equal to another one |
| `cmd.map((subMsg) => ({ _tag: 'XMsg', subMsg }))` | `cmd.map(Msg.xMsg)` |
| `pipe(..., updateAndCmd(...))` | `updateAndCmd { ... }((model, cmd))` |
| A branded type (`Brand<T, B>`) | A `struct` with a `fileprivate` initializer, made only in the file of its owner |

## Native iOS Parts

- **Tabs** for Overview, Articles, Users, Comments and Visitors (the sidebar of the web app). On iPad the tab bar can turn into a sidebar. The tab shown is read from the model, and choosing one is a move (`Navigate`).
- **Settings** opens from the account button of the navigation bar, as a modal screen. An iPhone tab bar holds five tabs, and the system "More" list does not write the selected tab back, so a sixth tab could not be reached by a move.
- **Sheets** for the detail panels. A sheet is open while the screen model holds a selected row, and closing it (Done or a swipe down) sends the message that clears it.
- **`List`** for the tables, `.searchable` with a sort `Menu` for the search bar, a page menu under each list, Swift Charts for the visitor chart, and a `Form` for Settings.
- **Keychain** for the token (the web app uses `localStorage`); `UserDefaults` for the color scheme and the theme. The color scheme drives `preferredColorScheme`, and the primary color of the theme is the tint of the app.

## Navigation and Deep Links

The navigation is the one of `frontend-admin` (see "Navigation and the URL" in its [code convention](../frontend-admin/doc/code-convention.md)): the destination is never stored, `destinationOf` reads it from the model, every move goes through `navigationMsgHandler` and the guard, and only the navigation opens a screen (`CurrentScreenModel` and `DestinationAfterGuard` are owned types).

iOS has no address bar, so there is no `withUrl`: the app runs as the web app does with `VITE_DISABLE_URL`. A URL reaches the app as a deep link, read by `parseDestination` and opened as a move (`UrlChanged`), through the guard like any other:

```bash
xcrun simctl openurl booted sentinel://users
```

A deep link that opens the app arrives while the boot checks the stored token, so it is kept and the app boots on it (`Program.swift`).

## Not Ported

- **The persona panel**: a web helper to take a screenshot, clear the browser cache and show browser information.
- **The scroll-to-top button**: iOS scrolls a list to the top when the status bar is tapped.

## Side Effects

Every side effect runs in a `Cmd`, as the code convention asks, including the token writes on login and logout (the web app calls `saveToken` and `removeToken` inside its handlers).

## License

MIT
