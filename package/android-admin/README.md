# Sentinel Admin (Android)

A native Android port of [`frontend-admin`](../frontend-admin) (the Sentinel Dashboard), written in Kotlin and Jetpack Compose with The Elm Architecture. It talks to the same backend (`package/backend`) through the same `/api/admin` endpoints. It is the Android sibling of [`ios-admin`](../ios-admin), with the same screens and the same TEA structure.

## Tech Stack

- [**Kotlin 2.4**](https://kotlinlang.org): Language
- [**Kotlin Multiplatform**](https://kotlinlang.org/docs/multiplatform.html): The `core` module (TEA runtime, types, updates, API) has no Android dependency, so an iOS target can be added later
- [**Jetpack Compose**](https://developer.android.com/compose) with [**Material 3**](https://m3.material.io): Views
- **`teacup`** (`core/.../teacup`): a small TEA runtime written for this app (`Cmd`, `Dispatcher`, `Program`, `Runtime`, `RemoteData`, `Either`), in the place of `react-tea-cup`, `tea-cup-fp`, `tea-cup-prelude` and `fp-ts`
- **`teacuppagination`** (`core/.../teacuppagination`): a port of `@rinn7e/tea-cup-pagination`
- [**Ktor client**](https://ktor.io) and [**kotlinx.serialization**](https://github.com/Kotlin/kotlinx.serialization): HTTP and JSON (the Kotlin side of `io-ts`: decoders generated from the types)
- [**DataStore**](https://developer.android.com/topic/libraries/architecture/datastore): The token and the theme choices (the `localStorage` of the web app)
- [**Vico**](https://github.com/patrykandpatrick/vico): The visitor chart
- [**Coil**](https://coil-kt.github.io/coil/): The avatars

## How to Run

You need JDK 21 and the Android SDK (Android Studio installs both). The Gradle wrapper downloads Gradle itself.

1. Start the backend on port 3000 (see `package/backend`), for example with `make api` in `package/backend`.
2. Start an emulator (Android Studio, Device Manager), or `~/Library/Android/sdk/emulator/emulator -avd <AVD>` (`emulator -list-avds` lists them).
3. Build, install and launch:
   ```bash
   ./gradlew installDebug
   adb shell am start -n tech.rinn7e.sentinel.admin/app.MainActivity
   ```

The emulator reaches the backend on this Mac at `10.0.2.2`, the default API (`http://10.0.2.2:3000/api`). Another API is set with the `apiBase` Gradle property (the `VITE_API_BASE` of the web app):

```bash
./gradlew installDebug -PapiBase=http://192.168.0.10:3000/api
```

Test account: `admin@example.com`, password `testtest` (from `package/backend/resource/seed.sql`).

### On a Phone

Turn on **Developer options** and **USB debugging** on the phone (or wireless debugging), and plug it in: `adb devices` lists it. The phone reaches the backend over the Wi-Fi, at the LAN IP of the Mac (`ipconfig getifaddr en0`); the backend of `make api` listens on every interface already.

```bash
./gradlew installDebug -PapiBase=http://$(ipconfig getifaddr en0):3000/api
```

The phone and the Mac must be on the same Wi-Fi, with the backend running. The app allows plain HTTP (`usesCleartextTraffic` in the manifest), for this backend of development.

### Tests

The logic of `core` (TeaCup, the pagination, the navigation and its guard, the updates, the JSON decoding) is plain Kotlin, tested on the JVM with no device:

```bash
./gradlew :core:jvmTest
```

## From frontend-admin to android-admin

The file tree follows the one of `frontend-admin/src`, split in two Gradle modules:

- `core/src/commonMain/kotlin`: everything that is not a view. Types, updates, utils, the API, the cache, the TEA runtime.
- `app/src/main/kotlin`: the views (Compose) and the activity.

A folder is a Kotlin package of the same name, in lower case (`screen/user-screen` is the package `screen.userscreen`), and each file keeps the name of its web file:

| frontend-admin | android-admin |
| --- | --- |
| `src/root.tsx`, `program.tsx`, `app.tsx` | `app/.../app/Root.kt` (the activity), `core/.../app/Program.kt`, `app/.../app/App.kt` |
| `src/type.ts`, `update.ts` | `core/.../app/Type.kt`, `Update.kt` |
| `src/handler/`, `src/util/` | `core/.../app/handler/`, `core/.../app/util/` |
| `src/common/` | `core/.../common/` (and `app/.../common/type/DateFormat.kt`) |
| `src/component/<name>/type.ts`, `update.ts`, `util.ts` | `core/.../component/<name>/Type.kt`, `Update.kt`, `Util.kt` |
| `src/component/<name>/component.tsx` | `app/.../component/<name>/Component.kt` |
| `src/screen/<name>/type.ts`, `update.ts`, `util.ts` | `core/.../screen/<name>/Type.kt`, `Update.kt`, `Util.kt` |
| `src/screen/<name>/component.tsx`, `sub-component/` | `app/.../screen/<name>/Component.kt`, `subcomponent/` |
| `src/theme/` | `core/.../theme/` (presets, storage), `app/.../theme/Material.kt` (the Material theme) |

The root files of the web app are in the package `app`: a Kotlin file in no package cannot be imported from a package. The TEA runtime is in `teacup` (a folder cannot be named `package` in Kotlin, it is a keyword).

Two files of one package in the two modules must not have the same name: both would compile to the same class (`screen.userscreen.TypeKt`). So a view file is `Component.kt`, never `Type.kt` or `Update.kt`.

## Modules and Names

A Kotlin package is a namespace, and an import can be renamed, so each TEA module keeps the plain names of the web app: every screen has its `Model`, `Msg`, `ItemMsg`, `initial` and `update`, like `type.ts` and `update.ts`.

A name of another package is imported with an alias, or written with its package:

```kotlin
import screen.userscreen.update as userScreenUpdate
import teacuppagination.Model as PaginationModel

data class Model(val pagination: teacuppagination.Model<AdminUser, HttpError>)
```

Import the `Model`, `Msg`, `initial` or `update` of another module only with an alias. A plain `import teacuppagination.Model` silently replaces the `Model` of the package the file is in, everywhere in that file (checked with the compiler). Two plain imports of one name are an error.

What Kotlin has and has not, next to Haskell:

- `private` at the top level of a file is private to the file: the export list of a Haskell module.
- `internal` is the Gradle module (`core`), not the package: there is no visibility per folder. The helpers of `common/api/handler` are `internal`, and the rest of `core` is asked not to call them.
- Owned types (`CurrentScreenModel`, `DestinationAfterGuard`) have a private constructor: only their companion makes one, as on the web and iOS.

## Native Android Parts

- Tabs: a Material navigation bar (the sidebar of the web app). Choosing a tab is a move (`Navigate`), so every screen opens afresh, as on the web.
- Settings: opened from the account button of the top bar, with a back arrow.
- Back: the system back (gesture or button) goes to the overview, the start tab, and from there leaves the app. A detail sheet closes on back, which clears the selection.
- Search: a search field above the list (the search key submits, clearing submits), and a sort menu in the top bar.
- Details: Material bottom sheets (`ModalBottomSheet`), shown while the screen model holds a selected item.
- Overview: pull to refresh, a segmented button for the period, the Vico area chart.
- Theme: the primary color of the preset is the primary of Material; light, dark or the system. The icons of the system bars follow the scheme of the app.

## Navigation and Deep Links

The navigation is the one of the web app, owned by the model: `destinationOf` reads the destination from the screen model, every move goes through `navigationMsgHandler`, and the guard (`app/util/Guard.kt`) sends a signed out user to login.

There is no address bar, so there is no `withUrl`: the app runs like the web app with `VITE_DISABLE_URL`, plus deep links. `sentinel://users` opens Users (`common/type/destination/Parser.kt`):

```bash
adb shell am start -a android.intent.action.VIEW -d "sentinel://users" tech.rinn7e.sentinel.admin
```

A deep link that opens the app arrives while the boot checks the stored token, so it is kept and the app boots on it (`app/Program.kt`). The activity keeps itself on a rotation or a theme change (`configChanges`), so the runtime and its model are kept too.

## Performance

Compose skips a view when its input did not change (strong skipping, on by default). The types of `core` are declared stable in `app/stability.conf`, so they are compared with `equals`, the `memo` of the web views; every `Dispatcher` is equal to every other one, like `EqAlways`.

A debug build logs every `update` slower than 4 ms with its message (logcat, tag `Step`). A debug build is not optimized: judge a lag on a release build (R8, the debug key signs it so it installs):

```bash
./gradlew installRelease
```

For a frame counter, turn on **Profile HWUI rendering** in the developer options of the device, and use the Android Studio profiler for the detail.

## Kotlin for Haskell and TypeScript Developers

See [doc/kotlin_cheatsheet.md](doc/kotlin_cheatsheet.md).

## License

Same as the repository.
