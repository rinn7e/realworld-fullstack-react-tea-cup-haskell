# Kotlin Cheat Sheet (FP Perspective)

This cheat sheet is a quick syntax mapping between the Kotlin constructs used in the `mobile-admin-android` project and their counterparts in **Haskell**, **Elm**, and functional **TypeScript** (with `fp-ts` and the `react-tea-cup` conventions of `frontend-admin`). It is the Kotlin sibling of the Swift cheat sheet of `mobile-admin-ios`.

---

## 1. Packages, Files & Imports

The rules of this section were checked with the Kotlin 2.4 compiler of this project.

### 1.1 The One Idea: a Package Is a Namespace, a Module Is a Build Unit

Kotlin has two levels, and Haskell and TypeScript fold them into one:

| | Haskell | TypeScript | Kotlin |
| :--- | :--- | :--- | :--- |
| **A namespace is** | one file (`module M where`) | one file | a package (`package screen.userscreen`), any number of files |
| **The unit you build and depend on** | a package (a `library` in `.cabal`) | a package (`package.json`) | a Gradle module (`app`) |
| **Names between files of one package** | need `import` | need `import` | visible with no `import` |
| **`import` is for** | other modules | other files | other packages |
| **Default visibility** | everything, unless an export list | nothing, unless `export` | `public` |

So a Kotlin package is close to a Haskell module that is split over several files (all the files of `screen/userscreen/` are one package), and a Gradle module is close to a Cabal package.

### 1.2 Import Forms

| Haskell | TypeScript | Kotlin |
| :--- | :--- | :--- |
| `import M (x)` | `import { x } from './m'` | `import m.x` |
| `import M` | none (each name is imported by name) | `import m.*` |
| `import qualified M as P` then `P.x` | `import * as P from './m'` then `P.x` | no package alias; write `m.x` in full, or rename one name |
| `import M (x)` renamed | `import { x as y } from './m'` | `import m.x as y` |
| `import M hiding (x)` | none | none |

A name can always be written with its package, with no import at all: `teacuppagination.Model<AdminUser, HttpError>`. That is the qualified name of Haskell, without the `import qualified` line.

### 1.3 Which Name Wins

In a file of the package `screen.userscreen`, a name is looked up in this order:

1. The names imported one by one (`import teacuppagination.Model`).
2. The names of the package of the file (`screen.userscreen.Model`).
3. The names of `import x.*`.
4. The default imports (`kotlin.*`, `kotlin.collections.*`, ...).

So an explicit import **silently replaces** the `Model` of the package, in the whole file:

```kotlin
package screen.userscreen

import teacuppagination.Model   // now `Model` is the pagination's, not this screen's

fun probe() = Model<Int, Int>(RemoteData.Pending, 1, 0)   // compiles: the pagination Model
```

And two explicit imports of one name are an error, even if the name is not used:

```kotlin
import teacuppagination.Model
import component.searchbar.Model   // error: Conflicting import: imported name 'Model' is ambiguous.
```

The rule of `mobile-admin-android` follows from this: import the `Model`, `Msg`, `initial` or `update` of another module only with an alias, or write it with its package.

```kotlin
import component.searchbar.update as searchBarUpdate
import teacuppagination.Msg as PaginationMsg
```

### 1.4 Visibility

| Kotlin | Seen by | Haskell / TypeScript |
| :--- | :--- | :--- |
| `public` (the default) | everyone | an exported name / `export` |
| `internal` | the Gradle module (`app`, the whole app here) | a module of the `other-modules` of a Cabal package |
| `private` at the top level | the file | a name left out of the export list / no `export` |
| `private` in a class | the class (and its companion) | an unexported field |

There is no visibility per package or per folder (Java has package private, Kotlin does not). So the `.Internal` pattern of Haskell is a convention here: the helpers of `common/api/handler/Common.kt` are `internal`, and only the handlers of that folder call them.

### 1.5 How `mobile-admin-android` Is Organised

| Folder | Package | Web |
| :--- | :--- | :--- |
| `teacup/`, `teacuppagination/` | `teacup`, `teacuppagination` | `react-tea-cup`, `tea-cup-fp`, `@rinn7e/tea-cup-pagination` |
| `common/api/type/` | `common.api.type` | `src/common/api/type` |
| `screen/userscreen/` | `screen.userscreen` | `src/screen/user-screen` |
| `app/` | `app` | `src/*.tsx` |

The folders are under `app/src/main/kotlin`. Each file becomes a class named after it (`screen.userscreen.TypeKt`), so two files of one package cannot have the same name.

---

## 2. Records / Product Types (Data Classes)

* **Haskell**:
  ```haskell
  data Model = Model { email :: String, isSubmitting :: Bool }
  ```
* **Elm**:
  ```elm
  type alias Model = { email : String, isSubmitting : Bool }
  ```
* **TypeScript**:
  ```typescript
  type Model = { readonly email: string; readonly isSubmitting: boolean }
  ```
* **Kotlin**:
  ```kotlin
  data class Model(val email: String, val isSubmitting: Boolean)
  ```

A `data class` gets `equals`, `hashCode`, `toString` and `copy` for free. `val` is a read-only field; `var` would make it mutable (`mobile-admin-android` uses `val` only).

### Copying

| Haskell / Elm | TypeScript | Kotlin |
| :--- | :--- | :--- |
| `model { email = "a" }` | `{ ...model, email: 'a' }` | `model.copy(email = "a")` |

---

## 3. Sum Types (Sealed Interfaces and Enums)

### 3.1 Simple Enums

* **Haskell**: `data Direction = Asc | Desc`
* **Kotlin**:
  ```kotlin
  enum class Direction(val value: String) {
    Asc("asc"),
    Desc("desc"),
  }
  ```

### 3.2 Constructors with Fields (Msg)

* **Haskell**:
  ```haskell
  data Msg
    = ChangeEmail String
    | Submit
    | SubmitResult (Either HttpError UserResponse)
  ```
* **TypeScript** (`frontend-admin`):
  ```typescript
  type Msg =
    | { _tag: 'ChangeEmail'; value: string }
    | { _tag: 'Submit' }
    | { _tag: 'SubmitResult'; result: Either<HttpError, UserResponse> }
  ```
* **Kotlin**:
  ```kotlin
  sealed interface Msg {
    data class ChangeEmail(val value: String) : Msg
    data object Submit : Msg
    data class SubmitResult(val result: Either<HttpError, UserResponse>) : Msg
  }
  ```

`sealed` means every case is in this module, so a `when` over it is checked for exhaustiveness. A case with no field is a `data object`. A constructor is called like a function: `Msg.ChangeEmail("a")`, and passed like one: `Msg::ChangeEmail` (the `ChangeEmail` of Haskell, a function `String -> Msg`).

### 3.3 Generic Sum Types and Variance

```kotlin
sealed interface RemoteData<out E, out A> {
  data object Pending : RemoteData<Nothing, Nothing>
  data class Success<out A>(val value: A) : RemoteData<Nothing, A>
}
```

`Nothing` is the empty type (`Void` of Haskell). With `out` (covariance), `RemoteData<Nothing, Nothing>` fits any `RemoteData<E, A>`, so `Pending` is one value for every type, like `Pending :: RemoteData e a` in Haskell. `Cmd<out Msg>` works the same way: `Cmd.none` is a `Cmd<Nothing>` and fits any `Cmd<Msg>`.

---

## 4. A TEA Module: a Package of Files, Plain Names

A screen is a package. Its files share every name with no import, as `type.ts` and `update.ts` would with imports:

```kotlin
// screen/loginscreen/Type.kt
package screen.loginscreen

data class Model(val email: String, val password: String, val isSubmitting: Boolean, val error: String?)

sealed interface Msg { /* ... */ }

// screen/loginscreen/Update.kt
package screen.loginscreen

fun initial(): Pair<Model, Cmd<Msg>> = Model("", "", false, null) to Cmd.none

fun update(msg: Msg, model: Model): Pair<Model, Cmd<Msg>> = /* ... */
```

The parent names it with its package, like `import qualified Screen.LoginScreen as LoginScreen` in Haskell:

```kotlin
// app/Type.kt
data class LoginScreenModel(val model: screen.loginscreen.Model) : ScreenModel

// app/Update.kt
import screen.loginscreen.update as loginScreenUpdate
```

Compare with `mobile-admin-ios`, where a Swift module has one flat namespace and no renaming import, so every public name carries its folder (`LoginScreenModel`, `loginScreenUpdate`).

---

## 5. Functions & Lambdas

| Haskell | TypeScript | Kotlin |
| :--- | :--- | :--- |
| `add :: Int -> Int -> Int` | `const add = (a: number, b: number) => a + b` | `fun add(a: Int, b: Int): Int = a + b` |
| `\x -> x + 1` | `(x) => x + 1` | `{ x -> x + 1 }`, or `{ it + 1 }` |
| `(a, b)` | `[a, b]` | `a to b` (a `Pair`) |
| `let (m, c) = step` | `const [m, c] = step` | `val (m, c) = step` |
| `f . g` | `flow(g, f)` | `{ x -> f(g(x)) }` |

A lambda that is the last argument goes after the parentheses: `Cmd { dispatch -> dispatch(msg) }` is `Cmd({ dispatch -> dispatch(msg) })`.

### Extension Functions

```kotlin
inline fun <E, A, B> Either<E, A>.map(f: (A) -> B): Either<E, B> = /* ... */

getLogs(token).map { it.logs }
```

A function written outside the type and called like a method, as `pipe(x, E.map(f))` of fp-ts reads `x.map(f)`. It must be imported like any function (`import teacup.map`).

---

## 6. Pattern Matching (`when`)

* **Haskell**:
  ```haskell
  update msg model = case msg of
    ChangeEmail v -> (model { email = v }, Cmd.none)
    Submit        -> submitHandler model
  ```
* **Kotlin**:
  ```kotlin
  fun update(msg: Msg, model: Model): Pair<Model, Cmd<Msg>> =
    when (msg) {
      is Msg.ChangeEmail -> model.copy(email = msg.value) to Cmd.none
      Msg.Submit -> submitHandler(model)
    }
  ```

`is` checks a case with fields, and then `msg` has that type in the branch (a smart cast): `msg.value` needs no unpacking. A `data object` is matched by its name. As an expression, `when` must cover every case of a sealed type, like `-Wincomplete-patterns` turned into an error.

A guard is a condition branch: `when { x > 0 -> ...; else -> ... }`.

---

## 7. Maybe (Nullable Types)

| Haskell | TypeScript | Kotlin |
| :--- | :--- | :--- |
| `Maybe String` | `string` or `undefined` | `String?` |
| `fromMaybe d m` | `m ?? d` | `m ?: d` |
| `fmap f m` | `m?.f()` | `m?.let(f)`, `m?.field` |
| `case m of Nothing -> e; Just x -> ...` | early return | `val x = m ?: return e` |

`?:` takes a `return` on its right, which reads like `guard let` of Swift:

```kotlin
val token = shared.token ?: return Cmd.none
```

---

## 8. Either and Effects

Kotlin has a `Result<A>` for exceptions only, so `teacup` has its own `Either` (the one of fp-ts), with `map`, `flatMap` and `mapLeft`:

```kotlin
sealed interface Either<out E, out A> {
  data class Left<out E>(val value: E) : Either<E, Nothing>
  data class Right<out A>(val value: A) : Either<Nothing, A>
}
```

An effect is a `suspend` function, the `Task` of fp-ts: it can wait (on the network) without blocking. A `Cmd` holds such functions, and only the runtime runs them:

| fp-ts / tea-cup | Kotlin (`teacup`) |
| :--- | :--- |
| `TaskEither<HttpError, A>` | `suspend () -> Either<HttpError, A>` |
| `attemptTE(task, toMsg)` | `Cmd.attempt({ task() }, toMsg)` |
| `Cmd.batch([a, b])` | `Cmd.batch(a, b)` |
| `cmd.map(toMsg)` | `cmd.map(toMsg)` |
| `Cmd.none()` | `Cmd.none` |

---

## 9. Generics

```kotlin
fun <Item, Err> update(config: Config<Item, Err>, msg: Msg<Item, *, Err>, model: Model<Item, Err>): Pair<Model<Item, Err>, Cmd<Msg<Item, Nothing, Err>>>
```

`<Item, Err>` are the type variables of Haskell, written before the name. `*` is a type argument you do not care about (an existential, roughly `forall x. Msg Item x Err`). `out T` is covariance (section 3.3); `in T` is contravariance (`Dispatcher<in Msg>` takes messages and never gives one).

---

## 10. The Elm Architecture in Kotlin

| Elm | react-tea-cup | mobile-admin-android |
| :--- | :--- | :--- |
| `Model` | `type Model` | `data class Model` |
| `Msg` | tagged union | `sealed interface Msg` |
| `init` | `init` | `initial()` returning `Pair<Model, Cmd<Msg>>` |
| `update` | `update` | `update(msg, model)` returning `Pair<Model, Cmd<Msg>>` |
| `view` | a React component with `dispatch` | a `@Composable` function with a `Dispatcher` |
| `Html.map` | `(sub) => dispatch({ _tag: 'XMsg', sub })` | `dispatch.map(Msg::XMsg)` |
| `Html.Lazy` | `memo` | skipped by Compose when the input is equal (`stability.conf`) |
| `Browser.application` | `ProgramWithNav` | `Program(init, update, onOpenUrl)` run by `ProgramHost` |

---

## 11. Compose Views at a Glance

A view is a function, not a class: Compose calls it again when its input changes, and skips it when the input is equal.

```kotlin
@Composable
fun LoginScreen(model: Model, dispatch: Dispatcher<Msg>) {
  Column {
    OutlinedTextField(value = model.email, onValueChange = { dispatch(Msg.ChangeEmail(it)) })
    Button(onClick = { dispatch(Msg.Submit) }) { Text("Sign In") }
  }
}
```

| React / tea-cup | Compose |
| :--- | :--- |
| `<div className="flex flex-col">` | `Column { }` |
| `<div className="flex">` | `Row { }` |
| `{cond && <X />}` | `if (cond) X()` |
| `{items.map(i => <Row key={i.id} />)}` | `LazyColumn { items(list, key = { it.id }) { Row(it) } }` |
| `useState` for a menu open or closed | `var isOpen by remember { mutableStateOf(false) }` |
| `useEffect` | `LaunchedEffect`, `SideEffect` |

`mobile-admin-android` keeps the app state in the model only. `remember` is used for state that belongs to a widget and not to the app (a dropdown open or closed), as a DOM element keeps its own focus.
