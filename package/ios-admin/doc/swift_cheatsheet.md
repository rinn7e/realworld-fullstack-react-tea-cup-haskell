# Swift Cheat Sheet (FP Perspective)

This cheat sheet is a quick syntax mapping between the Swift constructs used in the `ios-admin` project and their counterparts in **Haskell**, **Elm**, and functional **TypeScript** (with `fp-ts` and the `react-tea-cup` conventions of `frontend-admin`).

---

## 1. Modules, Files & Imports

Every example in this section was checked with the Swift 6.3 compiler; the error messages are the real ones.

### 1.1 The One Idea: a Module Is a Target, Not a File

In Haskell and TypeScript, one file is one module. In Swift, one module is a whole **target**: an app, a framework, or a target of a Swift package. Every file of the target is part of the same module.

| | Haskell | TypeScript | Swift |
| :--- | :--- | :--- | :--- |
| **A module is** | one file (`module M where`) | one file | one target (all its files) |
| **The unit you depend on** | a package (a `library` in `.cabal`) | a package (`package.json`) | a module (a target) |
| **Names between files of one module** | need `import` | need `import` | visible with no `import` |
| **`import` is for** | other modules | other files and packages | other modules only |
| **Default visibility** | everything, unless the module has an export list | nothing, unless `export` | the whole module (`internal`) |

The closest Haskell picture: a Swift module is **one big Haskell module that is split over many files**, with no export list inside it.

So `ios-admin` makes a module of every file (section 1.9): one target per file, the way a Haskell project has one module per file.

### 1.2 Inside One Module: No Imports

* **Haskell**:
  ```haskell
  -- Answer.hs
  module Answer (answer) where
  answer :: Int
  answer = 42

  -- Main.hs
  module Main where
  import Answer (answer)        -- required
  main = print answer
  ```
* **TypeScript**:
  ```typescript
  // answer.ts
  export const answer = (): number => 42

  // main.ts
  import { answer } from './answer'   // required
  console.log(answer())
  ```
* **Swift** (two files of one target):
  ```swift
  // Answer.swift
  func answer() -> Int { 42 }

  // main.swift
  print(answer())               // no import: same module
  ```

In `ios-admin`, `Update.swift` calls `navigationMsgHandler` from `Handler/NavigationHandler.swift` with no import line, since both are files of the app module. To call `homeScreenInitial`, it must `import Screen_HomeScreen`: that one is another module.

### 1.3 The Price: One Flat Namespace per Module

All top-level names of a module share one namespace, so two of them cannot have the same name:

```swift
// A1.swift
struct Model {}

// A2.swift
struct Model {}      // error: invalid redeclaration of 'Model'
```

Haskell has no such problem, since `Screen.UserScreen.Model` and `Screen.HomeScreen.Model` live in different modules. In Swift there are two ways out:

* **Nested types**: a name inside a type is qualified by that type (`enum UserScreen { struct Model {} }` gives `UserScreen.Model`). The `enum` is only a namespace: it hides nothing (section 4).
* **Separate modules, with prefixed names** (`UserScreenModel` in the module `Screen_UserScreen_Type`): what `ios-admin` does, one module per file, because the prefix also protects against the silent shadowing of section 1.8.

File names are also flat: two files with the same name in one module do not build, even in different folders (`X/Type.swift` and `Y/Type.swift` fail with "multiple producers" of `Type.swift.o`). In different modules they are fine, so with a module per file `ios-admin` keeps the web file names: every screen has its `Type.swift` and `Update.swift`.

### 1.4 Making Another Module: a Local Swift Package

A second module needs a second target. The usual way is a local Swift package, the equivalent of a second library in a `.cabal` file, or of a workspace package in `pnpm-workspace.yaml`:

```
TeaCup/
  Package.swift
  Sources/TeaCup/Cmd.swift
  Sources/TeaCup/Dispatcher.swift
```

```swift
// TeaCup/Package.swift
// swift-tools-version: 6.0
import PackageDescription

let package = Package(
  name: "TeaCup",
  products: [.library(name: "TeaCup", targets: ["TeaCup"])],
  targets: [.target(name: "TeaCup")]
)
```

* **Haskell** (`tea-cup.cabal`):
  ```cabal
  library
    exposed-modules: TeaCup.Cmd, TeaCup.Dispatcher
    hs-source-dirs:  src
  ```
* **TypeScript** (`package.json` of a workspace package):
  ```json
  { "name": "@rinn7e/tea-cup", "main": "src/index.ts" }
  ```

The app then lists the package as a dependency (in `project.yml` for XcodeGen, or in the `dependencies:` of another `Package.swift`), and its files write `import TeaCup`.

A package can hold many modules: `ios-admin` has one `Package.swift` at its root, with a target per folder of `src/`, its TEA runtime included (`src/Package/TeaCup` is the module `Package_TeaCup`), so there is no second package to keep in step (section 1.9).

### 1.5 What Another Module Can See

Across modules, the default (`internal`) is hidden, and only `public` is seen, like an export list in Haskell or `export` in TypeScript:

```swift
// Module TeaCup, file Cmd.swift
public struct Cmd {
  public let name: String
  public init(name: String) { self.name = name }   // a public type still needs a public init
  package func forThisPackage() -> String { "package" }
  func forThisModule() -> String { "internal" }
}
struct Helper {}                                     // internal: TeaCup only
```

```swift
// Module App, file main.swift
import TeaCup

let c = Cmd(name: "a")       // fine: public
c.forThisPackage()           // fine: App and TeaCup are targets of the same package
c.forThisModule()            // error: 'forThisModule' is inaccessible due to 'internal' protection level
let h = Helper()             // error: cannot find 'Helper' in scope
```

Without `import TeaCup`, even `Cmd` fails: `error: cannot find 'Cmd' in scope`.

Compared with the export list of Haskell:

```haskell
module TeaCup.Cmd
  ( Cmd (..)       -- public struct Cmd, its fields and its init
  , forThisPackage -- package func (Haskell has no "package only" level)
  ) where          -- forThisModule and Helper stay hidden

-- Haskell: an opaque type exports the type without its constructor
module TeaCup.Cmd (Cmd, mkCmd) where
```

The Swift opaque type is a `public struct` with a non-public `init` and a public maker function (section 13).

### 1.6 The Access Levels

From the most hidden to the most open:

| Swift | Seen from | Haskell | TypeScript |
| :--- | :--- | :--- | :--- |
| `private` | this declaration, and its extensions in the same file | a `where` binding, or a name left out of the export list | a name with no `export`, or a `#private` field |
| `fileprivate` | this file | a name left out of the export list (a module is a file) | a name with no `export` |
| `internal` (the default, no keyword) | this module (the whole target) | *no equivalent: a module is one file* | *no equivalent* |
| `package` | the modules of this Swift package | a module in `other-modules` of the cabal package | a name the package exports, left out of its `exports` field |
| `public` | every module that imports it | the export list | `export` from the package entry |
| `open` | like `public`, and its classes can be subclassed outside the module | *no classes* | *no equivalent* |

A `private` name used from another file of the same module fails too: `error: 'helper' is inaccessible due to 'private' protection level`. So in one module, `private` and `fileprivate` are the only way to hide anything.

### 1.7 Import Forms

| Intent | Haskell | TypeScript | Swift |
| :--- | :--- | :--- | :--- |
| **Import everything** | `import Data.Text` | `import * as T from 'text'` (qualified) | `import TeaCup` |
| **Import a dotted module path** | `import Common.API.Type` | `import ... from '@/common/api/type'` | *not possible*: a Swift module name is one identifier (`import Common_API_Type`); dotted imports exist only for C and Objective-C submodules (`import Darwin.C.stdio`) |
| **Import some names** | `import TeaCup (Cmd)` | `import { Cmd } from 'tea-cup'` | `import struct TeaCup.Cmd` (also `func`, `enum`, `class`, `protocol`, `typealias`, `var`, `let`) |
| **Import qualified only** | `import qualified TeaCup` | `import * as TeaCup from 'tea-cup'` | *not possible*: `import qualified TeaCup` is a syntax error; every imported name is also usable unqualified |
| **Qualify a name** | `TeaCup.Cmd` | `TeaCup.Cmd` | `TeaCup::Cmd` (a module selector, Swift 6.3, SE-0491); `TeaCup.Cmd` also works, unless the module has a type named `TeaCup` |
| **Alias the module** | `import qualified TeaCup as T` | `import * as T from 'tea-cup'` | *not possible*: `import TeaCup as T` is a syntax error; alias one type with `typealias T = TeaCup.Cmd` |
| **Hide some names** | `import TeaCup hiding (Cmd)` | *import only what you need* | *not possible* |
| **Re-export** | `module App (module TeaCup) where` | `export * from './cmd'` | *only the unofficial `@_exported import TeaCup`* |

After `import struct TeaCup.Cmd`, the other names of the module are out of scope: `Sub()` fails with `error: cannot find 'Sub' in scope`.

### 1.8 Name Clashes Between Modules

A name of your own module silently wins over an imported one:

```swift
// Module App
import TeaCup

struct Cmd { let name: String; let local = true }   // App.Cmd

let d = Cmd(name: "b")           // App.Cmd: no error, no warning
let c = TeaCup::Cmd(name: "a")   // the imported one, by a module selector
let e = App::Cmd(name: "c")      // the own one, said out loud
```

In Haskell, the same clash is an "ambiguous occurrence" error until you qualify one of them. In Swift it is not an error, and nothing forces the qualifier: a bare `Cmd` quietly means the local one. Two imported modules with the same name do give an error ("ambiguous for type lookup"), as `Theme.ColorScheme` and SwiftUI `ColorScheme` did in `ios-admin` until one was nested.

So `ios-admin` prefixes every public name with its module (`SearchBarModel`, `UserScreenModel`): no two public names of the app are the same, so no local name can hide an imported one, and no qualifier is ever needed.

### 1.9 How `ios-admin` Is Organised

Every file is a module, named after its path (section 1.3 explains why file names may repeat across modules):

| File | Swift module | Like |
| :--- | :--- | :--- |
| `src/Screen/UserScreen/Type.swift` | `Screen_UserScreen_Type` | Haskell `Screen.UserScreen.Type` |
| `src/Screen/UserScreen/SubComponent/UserRow.swift` | `Screen_UserScreen_SubComponent_UserRow` | Haskell `Screen.UserScreen.SubComponent.UserRow` |
| `src/Common/API/Type/Article.swift` | `Common_API_Type_Article` | Haskell `Common.API.Type.Article` |
| `src/Package/TeaCup/Cmd.swift` | `Package_TeaCup_Cmd` | a module of the package `tea-cup-fp` |
| `src/Update.swift`, `src/Util/Guard.swift` | `MyApp_Update`, `MyApp_Util_Guard` | the modules of a cabal `executable` |
| `src/Root.swift` (`@main`) | `MyApp_Root`, the module of the app target | `Main.hs` |

```swift
// Package.swift: one target per file, its dependencies are the imports of the file
.target(name: "Component_PagedList_Component",
        dependencies: ["Common_API_Type_Common", "Component_ListState_Component",
                       "Component_PaginationNav_Component", "Package_TeaCup_Dispatcher",
                       "Package_TeaCup_RemoteData"],
        path: "src/Component/PagedList", sources: ["Component.swift"]),
```

```swift
// Module: Screen_UserScreen_Component
import Component_PagedList_Component                                   // another folder
import Component_SearchBar_Component
@_spi(Screen_UserScreen) import Screen_UserScreen_SubComponent_UserRow  // a sibling (section 1.11)
@_spi(Screen_UserScreen) import Screen_UserScreen_Type

public struct UserScreenComponent: View, Equatable { ... }             // exported

// Module: Screen_UserScreen_SubComponent_UserRow
@_spi(Screen_UserScreen) public struct UserRow: View, Equatable { ... } // for the siblings only
```

No screen depends on another screen, so `import Screen_HomeScreen_Type` in a user screen file does not build: the layers of the code convention are checked by the compiler. `script/check-spi.sh` checks that every `@_spi(X)` stays in the folder `X`.

### 1.10 Haskell Import and Export, Item by Item

The export side of Swift is about as rich as an export list of Haskell, written on each declaration instead of in one list. The import side is poorer: no `hiding`, no qualified-only import, no alias.

| Haskell | Swift | |
| :--- | :--- | :--- |
| `module M (Model, update) where` (export list) | `public` on `Model` and `update`, the rest `internal` | same effect, per declaration |
| `Model(..)` (a type with its constructor and fields) | `public struct`, `public init`, `public var` fields | yes |
| `Model` (a type, its constructor hidden) | `public struct` with a non-public `init` | yes |
| `Model(selectedUser)` (only some fields) | `public var selectedUser`, the other fields `internal` | yes |
| A field others read but cannot set | `public internal(set) var` | yes, finer than Haskell |
| `module App (module M) where` (re-export a module) | `@_exported import M` | unofficial (underscored) |
| Re-export one type | `public typealias Model = M.Model` | yes, for types |
| `import M (Model, update)` | `import struct M.Model`, `import func M.update` | yes, one line per kind |
| `import M hiding (update)` | | no |
| `import qualified M` | | no: every imported name is usable bare |
| `import qualified M as X` | | no: only the module selector `M::Model` |
| An import that does not leak to the importers of this module | `internal import M` (SE-0409, Swift 6) | yes |

Neither language can export a name to some modules only: an export list of Haskell gives `Model(..)` to every module that imports `M`. Haskell shares more with sibling modules through the `.Internal` pattern: `M.Internal` exports everything, `M` re-exports the public part, and the other modules are asked not to import `M.Internal`.

### 1.11 The `.Internal` Pattern in Swift: `@_spi`

Swift has the same tool, unofficial but used by Apple and by Swift Testing: `@_spi` (a "system programming interface"). A `public` declaration marked `@_spi(Group)` is seen only by modules that import with the same group:

```swift
// Module Screen_UserScreen_Type
public struct UserScreenModel {
  @_spi(Screen_UserScreen) public var selectedUser: AdminUser?   // the .Internal part
}

// Module Screen_UserScreen_Update: a sibling, opts in
@_spi(Screen_UserScreen) import Screen_UserScreen_Type
model.selectedUser = nil                                         // fine

// The app: a plain import
import Screen_UserScreen_Type
model.selectedUser                // error: 'selectedUser' is inaccessible due to '@_spi' protection level
```

As with `.Internal`, nothing stops another module from writing `@_spi(Screen_UserScreen) import`: it is a convention, made visible by the name of the group, so a check can find every opt-in. `ios-admin` names each group after its folder, and `script/check-spi.sh` fails when a file uses the group of another folder.

Why there is no real "friend" level: submodules and a group level were pitched several times (2017), and turned down as a C++ `friend` by another name. What was accepted is `package` (SE-0386, Swift 5.9), which opens a name to the whole package, not to a chosen group.

---

## 2. Records / Product Types (Structs)

Swift uses `struct` for records. A struct is a value: assigning it copies it, so a change to the copy never reaches the original. `Equatable` and `Hashable` are derived by the compiler when every field has them.

### Syntax Comparison
* **Swift**:
  ```swift
  struct AdminUser: Equatable, Decodable, Identifiable {
    let id: Int
    let username: String
    let email: String
    let bio: String?
    let role: String
  }
  ```
* **Haskell**:
  ```haskell
  data AdminUser = AdminUser
    { id :: Int
    , username :: Text
    , email :: Text
    , bio :: Maybe Text
    , role :: Text
    } deriving (Eq, Show, Generic, FromJSON)
  ```
* **Elm**:
  ```elm
  type alias AdminUser =
      { id : Int
      , username : String
      , email : String
      , bio : Maybe String
      , role : String
      }
  ```
* **TypeScript (fp-ts)**:
  ```typescript
  export type AdminUser = {
    id: number
    username: string
    email: string
    bio: string | null
    role: string
  }
  ```

### Instantiation & Copying

| Operation | Swift | Haskell | Elm | TypeScript |
| :--- | :--- | :--- | :--- | :--- |
| **Create** | `Shared(user: nil, token: nil)` (memberwise initializer, labels required) | `Shared Nothing Nothing` | `{ user = Nothing, token = Nothing }` | `{ user: O.none, token: O.none }` |
| **Default values** | `var page: Int = 1` in the struct | *No defaults* | *No defaults* | *No defaults* |
| **Copy with one field changed** | `var m = model; m.page = 2` | `model { page = 2 }` | *see below* | `{ ...model, page: 2 }` |

The Elm record update is `{ model | page = 2 }`. In Swift, `var m = model` copies the struct, and changing `m` leaves `model` as it was, so a `var` copy plays the part of the record update:

```swift
static func update(_ msg: Msg, _ model: Model) -> (Model, Cmd<Msg>) {
  var model = model          // a copy: the caller still holds the old model
  model.error = nil
  return (model, .none)
}
```

`let` fields can never change; `var` fields can change only on a `var` copy.

---

## 3. Algebraic Data Types / Sum Types (Enums)

Swift `enum` is a sum type. A case can carry values ("associated values").

### 3.1 Simple Enums
* **Swift**:
  ```swift
  enum Direction: String, Equatable, CaseIterable {
    case asc
    case desc
  }
  ```
* **Haskell**:
  ```haskell
  data Direction = Asc | Desc deriving (Eq, Show, Enum, Bounded)
  ```
* **Elm**:
  ```elm
  type Direction = Asc | Desc
  ```
* **TypeScript**:
  ```typescript
  type Direction = 'asc' | 'desc'
  ```

`: String` gives every case a raw value (`Direction.asc.rawValue == "asc"`, `Direction(rawValue: "asc")`), which is how `ios-admin` writes enums into query strings.

### 3.2 Enums with Associated Values (Msg)
* **Swift**:
  ```swift
  enum Msg {
    case changeEmail(String)
    case changePassword(String)
    case submit
    case submitResult(Result<UserResponse, HttpError>)
  }
  ```
* **Haskell**:
  ```haskell
  data Msg
    = ChangeEmail Text
    | ChangePassword Text
    | Submit
    | SubmitResult (Either HttpError UserResponse)
  ```
* **Elm**:
  ```elm
  type Msg
      = ChangeEmail String
      | ChangePassword String
      | Submit
      | SubmitResult (Result Http.Error UserResponse)
  ```
* **TypeScript**:
  ```typescript
  type Msg =
    | { readonly _tag: 'ChangeEmail'; readonly value: string }
    | { readonly _tag: 'ChangePassword'; readonly value: string }
    | { readonly _tag: 'Submit' }
    | { readonly _tag: 'SubmitResult'; readonly result: Result<HttpError, UserResponse> }
  ```

A case with a value is also a function: `Msg.changeEmail` has the type `(String) -> Msg`, so `cmd.map(Msg.homeScreenMsg)` reads like Elm `Cmd.map HomeScreenMsg cmd`.

### 3.3 Recursive Enums
* **Swift**: `indirect enum Tree { case leaf; case node(Tree, Int, Tree) }`
* **Haskell**: `data Tree = Leaf | Node Tree Int Tree`
* **Elm**: `type Tree = Leaf | Node Tree Int Tree`
* **TypeScript**: `type Tree = { _tag: 'Leaf' } | { _tag: 'Node'; left: Tree; value: number; right: Tree }`

---

## 4. A TEA Module: a Folder of File Modules, Prefixed Names

A TEA module of the web app (a folder with `type.ts`, `update.ts`, `component.tsx`) is a folder of Swift modules in `ios-admin`, one per file (section 1.9). Its public names start with the name of the folder, since Swift has no qualified import and a local name silently wins over an imported one (section 1.8). What the files of the folder share with each other only is `@_spi(<folder>)` (section 1.11).

* **Swift** (folder `Screen/UserScreen`):
  ```swift
  // Module: Screen_UserScreen_Type
  public struct UserScreenModel: Equatable {
    @_spi(Screen_UserScreen) public var pagination: Pagination.Model<AdminUser, HttpError>  // siblings only
    @_spi(Screen_UserScreen) public var selectedUser: AdminUser?
  }
  public enum UserScreenMsg { case clearSelected; case paginationMsg(...) }

  // Module: Screen_UserScreen_Update
  @_spi(Screen_UserScreen) import Screen_UserScreen_Type
  public func userScreenInitial(_ shared: Shared) -> (UserScreenModel, Cmd<UserScreenMsg>) { ... }
  public func userScreenUpdate(_ shared: Shared) -> (UserScreenMsg, UserScreenModel) -> (UserScreenModel, Cmd<UserScreenMsg>) { ... }
  private func paginationMsgHandler(...) { ... }              // this file only

  // Module: Screen_UserScreen_Component
  public struct UserScreenComponent: View, Equatable {
    public init(model: UserScreenModel, shared: Shared, dispatch: Dispatcher<UserScreenMsg>) { ... }
  }

  // Module: Screen_UserScreen_SubComponent_UserRow
  @_spi(Screen_UserScreen) public struct UserRow: View, Equatable { ... }   // private to the screen

  // In the app (Module: MyApp_Update)
  import Screen_UserScreen_Type
  import Screen_UserScreen_Update
  userScreenUpdate(model.shared)(subMsg, screenModel)
  ```
* **Haskell**: `Screen.UserScreen.Type`, `Screen.UserScreen.Update`, ... with the fields in `Screen.UserScreen.Internal.Type`, imported by the siblings only.
* **Elm**: `module Screen.UserScreen exposing (Model, Msg, init, update, view)`.
* **TypeScript**: `screen/user-screen/index.ts` re-exports `type.ts` and `update.ts`; the view is imported from `@/screen/user-screen/component`; a sub-component is never re-exported.

`init` is a keyword in Swift, so the `init` of a TEA module is `xInitial` in `ios-admin`.

### 4.1 A Name Says Where It Is Defined

| Swift name | Module | File | TypeScript import |
| :--- | :--- | :--- | :--- |
| `UserScreenModel` | `Screen_UserScreen_Type` | `Screen/UserScreen/Type.swift` | `import { type Model } from '@/screen/user-screen'` |
| `UserScreenComponent` | `Screen_UserScreen_Component` | `Screen/UserScreen/Component.swift` | `import { UserScreenMemo } from '@/screen/user-screen/component'` |
| `SearchBarModel` | `Component_SearchBar_Type` | `Component/SearchBar/Type.swift` | `import { type Model } from '@/component/search-bar'` |
| `DetailRowComponent` | `Component_DetailRow_Component` | `Component/DetailRow/Component.swift` | `import { DetailRowMemo } from '@/component/detail-row'` |

The view of a folder is `<Folder>Component` in its `Component.swift`. The names a folder shares through `@_spi` stay short (`UserRow`, `formatListError`): only its siblings see them, so they cannot clash.

### 4.2 The Other Way: a Caseless `enum` Namespace

Without a module per folder, a caseless `enum` gives qualified names in one module:

```swift
enum UserScreen {
  struct Model: Equatable { ... }
  enum Msg { ... }
}
extension UserScreen {                       // in another file
  static func update(...) -> ... { ... }
}
UserScreen.Model, UserScreen.update(...)
```

An `enum` with no cases cannot be made, so `UserScreen()` never compiles, unlike an empty `struct`. But it is a namespace, not a module: it hides nothing (every member is `internal`, seen by the whole module), and it adds no import, so any file can use any screen. `ios-admin` used it before its modules; the modules replaced it because they check the layers.

---

## 5. Functions, Closures & Extensions

### 5.1 Functions and Labels
* **Swift**:
  ```swift
  func getAdminUsers(_ token: String, limit: Int? = nil, offset: Int? = nil) async -> Result<AdminUserListResponse, HttpError>

  // Usage: `_` drops the label, the others are named and can be left out
  await getAdminUsers(token, limit: 50)
  ```
* **Haskell**: `getAdminUsers :: Text -> Maybe Int -> Maybe Int -> IO (Either HttpError AdminUserListResponse)`
* **Elm**: `getAdminUsers : String -> { limit : Maybe Int, offset : Maybe Int } -> Cmd Msg`
* **TypeScript**: `getAdminUsers(token, { limit: 50 })`

### 5.2 Closures and Currying
Swift functions are not curried; a curried function returns a closure.
* **Swift**:
  ```swift
  static func update(_ shared: Shared) -> (Msg, Model) -> (Model, Cmd<Msg>) {
    { msg, model in ... }
  }

  // Short closures
  users.map { $0.username }
  users.map(\.username)          // a key path as a function
  ```
* **Haskell**: `update :: Shared -> Msg -> Model -> (Model, Cmd Msg)` and `map username users`
* **Elm**: `update : Shared -> Msg -> Model -> ( Model, Cmd Msg )` and `List.map .username users`
* **TypeScript**: `const update = (shared: Shared) => (msg: Msg, model: Model): [Model, Cmd<Msg>] => ...`

### 5.3 Pipelines
Swift has no `|>` or `pipe`. Methods chain from left to right, which covers most pipelines:
```swift
title.lowercased().split(separator: "-").joined(separator: "-")
fetched.flatMap(decode).mapError(decodeApiError)
```

### 5.4 Extension Methods
* **Swift**:
  ```swift
  extension View {
    func searchBar<Sort>(model: SearchBarModel<Sort>, ...) -> some View { ... }
  }

  // Usage
  list.searchBar(model: model.searchBar, ...)
  ```
* **Haskell / Elm**: a plain function, `searchBar model list` or `list |> searchBar model`
* **TypeScript**: a plain function, `pipe(list, searchBar(model))`

---

## 6. Pattern Matching

### 6.1 `switch` (exhaustive)
* **Swift**:
  ```swift
  switch msg {
  case .changeEmail(let value):
    ...
  case .submit:
    ...
  case .submitResult(.success(let response)):
    ...
  case .submitResult(.failure(let err)):
    ...
  }
  ```
* **Haskell**: `case msg of ChangeEmail value -> ...`
* **Elm**: `case msg of ChangeEmail value -> ...`
* **TypeScript**: `switch (msg._tag) { case 'ChangeEmail': ... }`

A missing case is a compile error, as in Elm.

### 6.2 Matching a Tuple
```swift
switch (programModel, msg) {
case (.booting(let bootDestination), .initialize(let user, let isUnavailable, let token)):
  ...
case (.ready(let model), _):
  ...
}
```
This is the Elm `case ( model, msg ) of`, used in `Program.swift` and in the root `update`.

### 6.3 Guards
* **Swift**: `case .login where user != nil:`
* **Haskell**: `Login | isJust user -> ...`
* **Elm**: *no guards; an `if` inside the branch*
* **TypeScript**: `if (dest._tag === 'LoginScreen' && O.isSome(user))`

### 6.4 One Case Only (`if case`, `guard case`)
```swift
if case .itemMsg(let itemMsg, _) = subMsg { ... }

guard case .homeScreenModel(let screenModel) = model.screenModel.screenModel else {
  return (model, .none)
}
```
`guard` is the early return: the rest of the function runs only when the pattern matched, and the bound names stay in scope.

### 6.5 `switch` and `if` as Expressions
```swift
let screen: Screen =
  switch pieces {
  case []: .homeScreen
  case ["users"]: .userScreen
  default: .notFoundScreen
  }
```
Like Elm `case ... of`, the branches give the value. Such a `switch` must be on the right of an assignment or after `return`.

---

## 7. Type Classes (Protocols)

Swift protocols play the part of type classes. The compiler derives the common ones.

| Swift | Haskell | Elm | TypeScript (fp-ts) |
| :--- | :--- | :--- | :--- |
| `struct Model: Equatable` | `deriving (Eq)` | *built-in `==`* | `const ModelEq: Eq<Model> = EqClass.struct({...})` |
| `Hashable` | `deriving (Eq, Ord)` with a `Hashable` instance | *comparable* | *no equivalent* |
| `Decodable` / `Encodable` (`Codable`) | `FromJSON` / `ToJSON` | `Json.Decode.Decoder` written by hand | `io-ts` codec (`t.Type<A>`) |
| `Identifiable` (has an `id`) | *a type class with an `id` method* | *no equivalent* | *no equivalent* |
| `static func == (lhs:, rhs:) -> Bool` (custom) | `instance Eq A where (==) = ...` | *not possible* | `{ equals: (x, y) => ... }` |
| `func f<T: Equatable>(_ x: T)` | `f :: Eq t => t -> ...` | *only built-in constraints (`comparable`)* | `<T>(eq: Eq<T>) => (x: T) => ...` |
| `extension RemoteData: Equatable where E: Equatable, A: Equatable {}` | `instance (Eq e, Eq a) => Eq (RemoteData e a)` | *built-in* | `RD.getEq(eqE, eqA)` |

`Dispatcher` in `Package_TeaCup` writes its own `==` that is always `true`: the `EqAlways` of the `dispatch` prop.

---

## 8. Optional / Maybe

| Operation | Swift | Haskell | Elm | TypeScript (fp-ts) |
| :--- | :--- | :--- | :--- | :--- |
| **Type** | `A?` (`Optional<A>`) | `Maybe a` | `Maybe a` | `Option<A>` (or a nullable field) |
| **Some** | `x` (wrapped for you) | `Just x` | `Just x` | `O.some(x)` |
| **None** | `nil` | `Nothing` | `Nothing` | `O.none` |
| **Map** | `opt.map(f)` | `fmap f opt` | `Maybe.map f opt` | `pipe(opt, O.map(f))` |
| **FlatMap** | `opt.flatMap(f)` | `opt >>= f` | `Maybe.andThen f opt` | `pipe(opt, O.chain(f))` |
| **Fallback** | `opt ?? y` | `fromMaybe y opt` | `Maybe.withDefault y opt` | `pipe(opt, O.getOrElse(() => y))` |
| **Chain of fallbacks** | `a ?? b ?? c` | `asum [a, b, c]` | `Maybe.Extra.or` | `pipe(a, O.alt(() => b))` |
| **Unwrap in scope** | `if let user { ... }` / `guard let user else { ... }` | `case user of Just u -> ...` | `case user of Just u -> ...` | `if (O.isSome(user)) { user.value }` |
| **Field of an optional** | `user?.email` | `email <$> user` | `Maybe.map .email user` | `pipe(user, O.map((u) => u.email))` |

---

## 9. Result / Either

| Operation | Swift | Haskell | Elm | TypeScript (fp-ts) |
| :--- | :--- | :--- | :--- | :--- |
| **Type** | `Result<A, E>` (success first, `E: Error`) | `Either e a` | `Result e a` | `Either<E, A>` |
| **Success** | `.success(x)` | `Right x` | `Ok x` | `E.right(x)` |
| **Failure** | `.failure(e)` | `Left e` | `Err e` | `E.left(e)` |
| **Map** | `r.map(f)` | `fmap f r` | `Result.map f r` | `pipe(r, E.map(f))` |
| **Chain** | `r.flatMap(f)` | `r >>= f` | `Result.andThen f r` | `pipe(r, E.chain(f))` |
| **Map the error** | `r.mapError(f)` | `first f r` | `Result.mapError f r` | `pipe(r, E.mapLeft(f))` |

---

## 10. Collections

| Operation | Swift | Haskell | Elm | TypeScript |
| :--- | :--- | :--- | :--- | :--- |
| **Prepend** | `[x] + list` | `x : list` | `x :: list` | `[x, ...list]` |
| **Append** | `list + [x]` | `list ++ [x]` | `list ++ [x]` | `[...list, x]` |
| **Map** | `list.map(f)` | `map f list` | `List.map f list` | `list.map(f)` |
| **FlatMap** | `list.flatMap(f)` | `concatMap f list` | `List.concatMap f list` | `list.flatMap(f)` |
| **Filter and map** | `list.compactMap(f)` (drops the `nil`) | `mapMaybe f list` | `List.filterMap f list` | `pipe(list, A.filterMap(f))` |
| **Find** | `list.first { $0.id == id }` | `find ((== id) . userId) list` | `List.Extra.find` | `list.find((u) => u.id === id)` |
| **Range** | `1...5`, `0..<10` | `[1..5]` | `List.range 1 5` | `Array.from({ length: 5 }, (_, i) => i + 1)` |
| **Dictionary** | `[String: [String]]` | `Map Text [Text]` | `Dict String (List String)` | `Record<string, string[]>` |

---

## 11. Generics

* **Swift**:
  ```swift
  enum Pagination {
    struct Model<Item: Equatable, Err: Equatable>: Equatable {
      var items: RemoteData<Err, [Item]>
      var page: Int
    }
  }
  ```
* **Haskell**: `data Model item err = Model { items :: RemoteData err [item], page :: Int }`
* **Elm**: `type alias Model item err = { items : RemoteData err (List item), page : Int }`
* **TypeScript**: `type Model<Item, Err> = { items: RD.RemoteData<Err, Item[]>; page: number }`

Constraints sit on the parameter (`Item: Equatable`) or after `where` (`extension PagedListView where Header == EmptyView`).

---

## 12. Async Effects

Swift has `async` functions and `Task` built in. `ios-admin` wraps them in `Cmd`, so `update` stays pure.

| Concept | Swift (`Package_TeaCup`) | Haskell | Elm | TypeScript (tea-cup) |
| :--- | :--- | :--- | :--- | :--- |
| **An async call** | `func login(_ r: LoginRequest) async -> Result<UserResponse, HttpError>` | `login :: LoginRequest -> IO (Either HttpError UserResponse)` | `Http.post { ..., expect = Http.expectJson SubmitResult decoder }` | `login(r): TaskEither<HttpError, UserResponse>` |
| **Run it from update** | `.attempt({ await login(r) }, Msg.submitResult)` | *an effect in the update* | *the `Cmd` from `Http.post`* | `attemptTE(login(r), (result) => ({ _tag: 'SubmitResult', result }))` |
| **Several at once** | `.batch([cmdA, cmdB])` | `concurrently` | `Cmd.batch [ cmdA, cmdB ]` | `Cmd.batch([cmdA, cmdB])` |
| **No effect** | `.none` | `pure ()` | `Cmd.none` | `Cmd.none()` |
| **A side effect, no answer** | `Cmd { _ in saveToken(token) }` | `liftIO (saveToken token)` | *a port* | `cmdSucceed(() => saveToken(token))` |
| **Wait for it** | `await` | `<-` in `do` | *not possible* | `await` / `TE` chain |

---

## 13. Access Control & Opaque Types

The access levels are in section 1.6. An opaque type is a type whose constructor is hidden, so only its owner makes one:

| Scope of the owner | Swift | Haskell | Elm | TypeScript |
| :--- | :--- | :--- | :--- | :--- |
| **One file** (`ios-admin`) | a struct with a `fileprivate init` | `module M (T) where` (type without its constructor) | `module M exposing (T)` | `Brand<T, B>` with a private class method |
| **One module** (another module uses it) | a `public struct` with an `internal init` and a `public` maker function | the same export list | the same | a branded type exported from the package |

```swift
struct DestinationAfterGuard: Equatable {
  let destination: Destination            // anyone reads it

  fileprivate init(_ destination: Destination) {   // only Guard.swift makes one
    self.destination = destination
  }
}
```
Outside `Guard.swift`, `DestinationAfterGuard(...)` does not compile: the guard is the only way to get one.

---

## 14. The Elm Architecture in Swift

| TEA | Swift (`ios-admin`) | Elm | TypeScript (react-tea-cup) |
| :--- | :--- | :--- | :--- |
| **Model** | `public struct XModel: Equatable` | `type alias Model` | `type Model` with `ModelEq` |
| **Msg** | `public enum XMsg` | `type Msg` | `type Msg` with `_tag` |
| **init** | `public func xInitial(...) -> (XModel, Cmd<XMsg>)` | `init : flags -> ( Model, Cmd Msg )` | `init = (): [Model, Cmd<Msg>]` |
| **update** | `public func xUpdate(_ msg: XMsg, _ model: XModel) -> (XModel, Cmd<XMsg>)` | `update : Msg -> Model -> ( Model, Cmd Msg )` | `update = (msg, model): [Model, Cmd<Msg>]` |
| **view** | `public struct XComponent: View, Equatable { let model; let dispatch }` with a `public init` | `view : Model -> Html Msg` | `XMemo = memo(XComponent, PropsEq.equals)` |
| **Send a message** | `dispatch(.submit)` | `onClick Submit` | `dispatch({ _tag: 'Submit' })` |
| **Child messages** | `dispatch.map(Msg.loginScreenMsg)`, `cmd.map(Msg.loginScreenMsg)` | `Html.map LoginScreenMsg`, `Cmd.map LoginScreenMsg` | `(subMsg) => dispatch({ _tag: 'LoginScreenMsg', subMsg })` |
| **Program** | `TeaCupProgram(init:update:view:onOpenUrl:)` run by `Runtime` | `Browser.application` | `ProgramWithNav` |
| **Text input** | `InputView("Email", value: model.email) { dispatch(.changeEmail($0)) }` | `input [ value model.email, onInput ChangeEmail ] []` | `<input value={model.email} onChange={...} />` |
| **Show a dialog** | `.sheet(item: Binding(get: { model.selected }, set: { ... }))` | *a view branch on the model* | `{O.isSome(selected) && <Overlay />}` |

---

## 15. SwiftUI Views at a Glance

| SwiftUI | HTML / Tailwind |
| :--- | :--- |
| `VStack(alignment: .leading, spacing: 8)` | `<div className='flex flex-col items-start gap-[8px]'>` |
| `HStack { ... Spacer() ... }` | `<div className='flex'>` with `justify-between` |
| `Text(x).font(.headline).foregroundStyle(.secondary)` | `<span className='font-bold text-slate-500'>` |
| `List { Section("Title") { ... } }` | a table or a card with rows |
| `Form { ... }` | a settings form |
| `.padding(16)` | `p-[16px]` |
| `.frame(maxWidth: .infinity)` | `w-full` |
| `if cond { ... }` inside a view | `{cond && ...}` |
| `ForEach(items) { item in ... }` | `items.map((item) => ...)` with a `key` |
| `.toolbar { ToolbarItem(placement: .topBarTrailing) { ... } }` | buttons in the header bar |
| `.preferredColorScheme(.dark)` | the `dark` class on the root |
