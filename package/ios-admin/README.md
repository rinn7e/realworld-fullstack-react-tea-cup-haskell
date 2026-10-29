# Sentinel Admin (iOS)

A native iOS port of [`frontend-admin`](../frontend-admin) (the Sentinel Dashboard), written in Swift and SwiftUI with The Elm Architecture. It talks to the same backend (`package/backend`) through the same `/api/admin` endpoints.

## Tech Stack

- [**Swift 6 compiler, Swift 5 language mode**](https://www.swift.org): Language
- [**SwiftUI**](https://developer.apple.com/xcode/swiftui/): Views (iOS 18 and later)
- [**Swift Charts**](https://developer.apple.com/documentation/charts): The visitor chart
- **`Package_TeaCup`** (`src/Package/TeaCup`): a small TEA runtime written for this app (`Cmd`, `Dispatcher`, `Program`, `RemoteData`), in the place of `react-tea-cup`, `tea-cup-fp` and `tea-cup-prelude`
- **`Package_TeaCupPagination`** (`src/Package/TeaCupPagination`): a port of `@rinn7e/tea-cup-pagination`
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

The file tree follows the one of `frontend-admin/src`, in the casing of Swift: folders and files are UpperCamelCase, with acronyms in capitals (`API`, `URL`). Every module keeps its folder, and every file keeps the name of the web file (`screen/user-screen/type.ts` is `Screen/UserScreen/Type.swift`). Two files of one module cannot have the same name, but each folder is its own module (see Modules), so a `Type.swift` in every screen is fine.

| frontend-admin | ios-admin |
| --- | --- |
| `src/root.tsx`, `program.tsx`, `app.tsx` | `src/Root.swift`, `Program.swift`, `App.swift` |
| `src/type.ts`, `update.ts` | `src/Type.swift`, `Update.swift` |
| `src/handler/navigation-handler.ts` | `src/Handler/NavigationHandler.swift` |
| `src/util/` (destination, guard, url) | `src/Util/` (`Destination`, `Guard`, `URL`) |
| `src/common/api/type/`, `common/api/handler/` | `src/Common/API/Type/`, `Common/API/Handler/` |
| `src/common/type/destination/` | `src/Common/Type/Destination/` |
| `src/component/` (search bar, pagination nav, list state) | `src/Component/` (`SearchBar/`, `PaginationNav/`, `ListState/`) |
| `src/screen/<name>-screen/` (`type`, `update`, `util`, `component`, `sub-component/`) | `src/Screen/<Name>Screen/` (`Type.swift`, `Update.swift`, `Util.swift`, `Component.swift`, `SubComponent/`) |
| `src/theme/` | `src/Theme/` |

The roots (`src`, `lib`, `doc`) stay in lowercase, as in the other packages of this repo.

## Modules

Every folder of `src/` that holds code is a module (a target of `Package.swift`), the Swift form of a Haskell module or an npm package. The app target (`project.yml`) holds the rest of `src/`: the root (`Root`, `Program`, `App`, `Type`, `Update`), `Handler/` and `Util/`.

| Module | Folder | Web |
| --- | --- | --- |
| `Package_TeaCup`, `Package_TeaCupPagination` | `src/Package/<Name>` | `react-tea-cup`, `tea-cup-fp`, `@rinn7e/tea-cup-pagination` |
| `Theme` | `src/Theme` | `src/theme` |
| `Common_Env`, `Common_Cache`, `Common_Type`, `Common_Type_Destination`, `Common_API_Type`, `Common_API_Handler` | `src/Common/<Path>` | `src/common/*` |
| `Component_SearchBar`, `Component_ListState`, `Component_PaginationNav`, `Component_PagedList`, `Component_DetailRow`, `Component_ProfileThumbnail`, `Component_RoleBadge` | `src/Component/<Name>` | `src/component/*` |
| `Screen_HomeScreen`, `Screen_LoginScreen`, `Screen_ArticleScreen`, `Screen_UserScreen`, `Screen_CommentScreen`, `Screen_VisitorScreen`, `Screen_SettingScreen` | `src/Screen/<Name>Screen` | `src/screen/*` |

A module is named after its path, with `_` between the folders (Haskell `Common.API.Type` is `Common_API_Type`): a Swift module name is one identifier, so it cannot hold a dot, and `import Common.API.Type` does not exist (dotted imports are only for the submodules of C and Objective-C modules, like `import Darwin.C.stdio`). A folder with modules inside holds no file of its own (`Common/Env.swift` is `Common/Env/Env.swift`), and a component of one file has its folder too (`Component/DetailRow/Component.swift`).

The dependencies of each module in `Package.swift` are the modules its files import, so the layers of the code convention of frontend-admin ("Dependency Order and Hierarchy") are checked by the compiler: `Common` imports no component or screen, a component imports no screen, and a screen imports no other screen. Each module builds alone:

```bash
swift build --sdk "$(xcrun --sdk iphonesimulator --show-sdk-path)" --triple arm64-apple-ios18.0-simulator --target Component_SearchBar
```

The SDK and triple are needed: a plain `swift build` builds for macOS, where some modules of iOS SwiftUI (keyboard types, `.searchable` placements) do not exist. Without `--target`, it builds every module.

## Names

Swift has no qualified import: inside a module, a name of the module wins over an imported one with no error. So the public names of a module start with the name of the module, and no two public names of the app are the same:

| Name | File |
| --- | --- |
| `ArticleScreenModel`, `ArticleScreenMsg`, `ArticleScreenItemMsg` | `Screen/ArticleScreen/Type.swift` |
| `articleScreenInitial`, `articleScreenUpdate` | `Screen/ArticleScreen/Update.swift` |
| `ArticleScreenComponent` | `Screen/ArticleScreen/Component.swift` |
| `SearchBarModel`, `SearchBarMsg`, `searchBarUpdate`, `SearchBarComponent` | `Component/SearchBar/` |
| `ListStateLoading`, `ListStateFailure`, `ListStateEmpty` | `Component/ListState/Component.swift` |
| `DetailRowComponent` | `Component/DetailRow/Component.swift` |

The view of a module is `<Module>Component` in its `Component.swift`. The internal names stay short (`StatCard`, `UserRow`, `mkPaginationConfig`, `formatListError`): no other module sees them, so a sub-component is private to its screen, as a web sub-component that is not re-exported. The domain types of `Common` (`AuthUser`, `HttpError`, `Destination`, `Article`, ...) keep their web names, which are already unique.

| TypeScript and tea-cup | Swift |
| --- | --- |
| A module of a screen (`import * as UserScreen from '@/screen/user-screen'`) | `import Screen_UserScreen`, then `UserScreenModel`, `userScreenUpdate` |
| `UserScreenMemo` from `@/screen/user-screen/component` | `UserScreenComponent` |
| `Model` with `ModelEq`, `Props` with `PropsEq`, `memo` | A `struct` that is `Equatable`; a view that is `Equatable` skips its body when its input did not change |
| A sum type with `_tag` and `switch` | An `enum` with associated values and `switch` |
| `Option<A>` | `A?` |
| `TaskEither<HttpError, A>` and `attemptTE` | `async` function returning `Result<A, HttpError>` and `Cmd.attempt` |
| `RemoteData` of remote-data-ts | `RemoteData` (`Package_TeaCup`) |
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
