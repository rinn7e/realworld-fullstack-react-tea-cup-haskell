# Code Conventions for `frontend-design-system`

These conventions are shared by both packages in this folder:

- `lib/` — the published `@rinn7e/realworld-design-system` library
- `app/showcase-app/` — the documentation & showcase app

## Table of Contents

- [Mistakes to Avoid](#mistakes-to-avoid)
- [Task Scope and Refactoring](#task-scope-and-refactoring)
- [Preserving Comments and Documentation](#preserving-comments-and-documentation)
- [Import Organization](#import-organization)
- [Control Flow](#control-flow)
- [Functional Programming (fp-ts)](#functional-programming-fp-ts)
- [Mutable Variables (let)](#mutable-variables-let)
- [Algebraic Data Types (ADTs)](#algebraic-data-types-adts)
- [Sum-Type Eq Instances](#sum-type-eq-instances)
- [Side-Effects and IO in TEA Architecture](#side-effects-and-io-in-tea-architecture)
- [TEA Child Msg Interception](#tea-child-msg-interception)
- [Navigation and the URL](#navigation-and-the-url)
- [No `update` Wrapper (and the URL Exception)](#no-update-wrapper-and-the-url-exception)
- [Follow the Component Tree](#follow-the-component-tree)
- [One Source of Truth: Make Impossible States Impossible](#one-source-of-truth-make-impossible-states-impossible)
- [Make Impossible Updates Impossible](#make-impossible-updates-impossible)
- [File Structure and Splitting](#file-structure-and-splitting)
  - [Tea Cup Components](#tea-cup-components)
  - [Library Layout (`lib/`)](#library-layout-lib)
  - [Dependency Order and Hierarchy](#dependency-order-and-hierarchy)
  - [React Components](#react-components)
  - [Props Ordering](#props-ordering)
  - [TypeScript Type Assertions](#typescript-type-assertions)
- [UI Styling Guidelines](#ui-styling-guidelines)
- [Tests](#tests)

## Mistakes to Avoid

1. **Using Raw Unicode Emojis in UI / Frontend (Except Country Flags)**:
   - **Why**: Never use raw Unicode emojis (e.g. `🎯`, `⚖️`, `⚡`, `⭐`, `🏆`, `👤`, `🔀`, etc.) for UI icons, buttons, badges, role indicators, or trophies. Raw emojis have inconsistent rendering across operating systems and cannot be styled with Tailwind CSS color classes. Always use vector SVG icons from `lucide-react` (e.g. `<Crosshair />`, `<Scale />`, `<Zap />`, `<Star />`, `<Trophy />`, `<User />`).
   - **Exception**: Country flag emojis dynamically generated from standard 2-letter ISO country codes (e.g. `🇺🇸`, `🇷🇺`, `🇨🇳`, `🇩🇪`, `🇵🇭`, `🇲🇳`, `🇮🇱`) are permitted for player nationalities, as they provide standard, lightweight national flag representations without heavy image dependencies.
   - **Example**:
     ```tsx
     // Good: Vector SVG Icon for UI concepts
     <div className="flex items-center gap-1.5">
       <Crosshair className="h-3.5 w-3.5 text-rose-500" />
       <span>Carry</span>
     </div>

     // Good: Country flag emoji for nationality
     <span>{getCountryFlagEmoji(player.countryCode)}</span>

     // Bad: Raw emoji for UI controls or indicators
     <div>🎯 Carry</div>
     ```

2. **Missing Dark Mode Overrides on Hover / Focus States**:
   - **Why**: Never apply light-mode hover or focus styles (e.g. `hover:bg-white`, `focus:bg-white`) without providing their corresponding dark-mode overrides (`dark:hover:bg-slate-900`, `dark:focus:bg-slate-900`, `dark:placeholder:text-slate-500`). Missing dark mode styles cause harsh, blinding white flashes when interactive elements are clicked or hovered in dark mode.
   - **Example**:
     ```tsx
     // Good: Dark mode hover and focus explicitly declared
     <input className="bg-slate-50 focus:bg-white dark:bg-slate-950 dark:focus:bg-slate-900 dark:text-white" />

     // Bad: focus:bg-white with no dark mode override
     <input className="bg-slate-50 focus:bg-white dark:bg-slate-950 dark:text-white" />
     ```

3. **Assuming Generic Defaults Instead of Auditing Codebase Conventions**:
   - **Why**: Do not rely on generic framework/language habits instead of inspecting existing component patterns in the codebase _before_ writing code. Always enforce established project styling and initialization standards. Use Tailwind CSS (`className="..."`) for all view styling rather than inline `style={{ ... }}` layout attributes.
   - **Example**:
     ```tsx
     // Good: Tailwind CSS
     <div className="flex w-full flex-col gap-1.5" />

     // Bad: Inline style
     <div style={{ display: 'flex', flexDirection: 'column' }} />
     ```

4. **Using `msgCmd` Instead of Direct Message Handler Functions**:
   - **Why**: Do not use `msgCmd` to trigger internal state transitions unless there is absolutely no other choice. Using `msgCmd` creates an unnecessary extra dispatch cycle (`Cmd -> dispatch(Msg) -> update`), causes delayed state application, and prevents direct functional composition with `updateAndCmd` and `pipe`. Always prefer invoking message handler functions directly.

5. **No Type Synonyms (Aliases for Identical Types)**:
   - **Why**: Never create redundant type aliases that merely rename an existing type (e.g. `export type TournamentStandingRow = TeamRatingStats`). Type synonyms add cognitive overhead, pollute autocomplete, cause confusion about whether types are identical or distinct, and require unnecessary translation. Use the canonical source type directly across all files.
   - **Example**:
     ```typescript
     // Good: Use the canonical domain type directly
     export function computeTournamentStandings(
       tournaments: readonly TournamentDTO[],
       teamsMap: Map<string, TeamDTO>,
     ): TeamRatingStats[]

     // Bad: Redundant type synonym
     export type TournamentStandingRow = TeamRatingStats
     ```

6. **Strictly Implement User Specifications Without Fabricating Unrequested Heuristics**:
   - **Why**: Implement exactly what is requested without inventing unprompted assumptions, heuristic rules, or edge-case bypasses (e.g. checking if name equals abbreviation, or checking if a string already contains parentheses when told: "if the team is a lol team always display their abbr otherwise display the name normally"). Adhere strictly to the requested behavior.

7. **Only Allow Re-Exports in `index.ts` (Never Re-Export from Non-Index Files)**:
   - **Why**: Never re-export types, interfaces, or values imported from other files within non-index files (e.g. `export type { Position, WeightProfile }` or `export { PositionJson, WeightProfileJson }`). Non-index module files must strictly export only the types, constants, and functions that they themselves define. Cross-module re-exports and barrel aggregations belong strictly in `index.ts` files (such as `src/common/api/type/index.ts`). Callers should either import directly from the defining module or from the canonical `index.ts` barrel.
   - **Example**:
     ```typescript
     // Good: index.ts barrels and re-exports module exports
     // src/common/api/type/index.ts
     export * from './hero'
     export * from './matchup'
     export * from './team'

     // Good: module files only export what they define directly
     // src/common/api/type/team.ts
     import { type Position, PositionJson } from './hero'
     export type TeamRoles = Partial<Record<Position, string>>
     export const TeamRolesJson: t.Type<TeamRoles> = ...

     // Bad: non-index module re-exporting imported types/values
     // src/common/api/type/team.ts
     import { type Position, PositionJson } from './hero'
     export type { Position }
     export { PositionJson }
     ```

8. **No Defensive Null/Undefined Fallbacks on Strictly Typed Non-Null Domain Fields**:
   - **Why**: When domain models, database schemas, and API codecs declare a field as non-null and required (e.g. `lastCrawlAt: Date`), helper functions, utilities, and UI components must accept the non-null type directly (`date: Date`). Never pollute signatures with optional or nullable types (`date?: Date | null`, `lastCrawlAt?: Date | null`), and never add defensive runtime fallback branches (e.g. `if (!date || !(date instanceof Date)) return 'Never / No Data'`, or `const hasData = meta.lastCrawlAt instanceof Date && ...`). Trust schema decoding and type safety. If a field is guaranteed non-null by the type system, treat it as non-null everywhere without defensive fallbacks or branches.
   - **Example**:
     ```typescript
     // Good: Strictly accept non-null type guaranteed by domain/codec
     export function formatTimestamp(date: Date): string {
       const dateStr = date.toLocaleDateString('en-US', {
         month: 'short',
         day: 'numeric',
         year: 'numeric',
       })
       const timeStr = date.toLocaleTimeString('en-US', {
         hour: '2-digit',
         minute: '2-digit',
         hour12: false,
       })
       return `${dateStr}, ${timeStr}`
     }

     export function isCrawlSourceStale(
       lastCrawlAt: Date,
       thresholdMs: number = CRAWLER_STALE_THRESHOLD_MS,
       now: number = Date.now(),
     ): boolean {
       if (now - lastCrawlAt.getTime() > thresholdMs) {
         return true
       } else {
         return false
       }
     }

     // Bad: Defensive null/undefined fallback guards on guaranteed non-null fields
     export function formatTimestamp(date?: Date | null): string {
       if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
         return 'Never / No Data'
       }
       ...
     }

     export function isCrawlSourceStale(
       lastCrawlAt?: Date | null,
       ...
     ): boolean {
       if (!lastCrawlAt || !(lastCrawlAt instanceof Date) || Number.isNaN(lastCrawlAt.getTime())) {
         return true
       }
       ...
     }
     ```

9. **Using `sm:` or `md:` as Responsive Layout Shift Breakpoints (Enforce `lg:` Desktop Breakpoint)**:
   - **Why**: Never use `sm:` (640px) or `md:` (768px) to trigger layout shifts (such as expanding single-column lists to multi-column grids, toggling `flex-col` to `flex-row`, or unhiding navigation text labels).
     - **Default styles (unprefixed)** must strictly target **Mobile Phones and Portrait Tablets** (< 1024px). Handheld touch devices (including iPads at 768px, 810px, or 834px) have limited horizontal viewport space; activating desktop multi-column grids or inline text labels prematurely cramps cards, overflows navbars, and wraps text awkwardly.
     - **Breakpoint (`lg:`)** strictly targets **Desktop, Laptop, and Landscape Tablets** (≥ 1024px). Only at 1024px and wider should layouts shift to full multi-column grids, horizontal toolbars, and expanded text labels.
     - **Deprecate `sm:` and `md:`**: Do not introduce `sm:` or `md:` prefixes for responsive layout shifts or typography breakpoints.
   - **Example**:
     ```tsx
     // Good: Default mobile & portrait tablet (icon-only, single column), lg: for desktop/landscape
     <span className="hidden lg:inline">{item.label}</span>
     <div className="grid grid-cols-1 gap-[16px] lg:grid-cols-3" />
     <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center" />

     // Bad: Premature layout shifts on sm: or md: cramping portrait tablets
     <span className="hidden sm:inline">{item.label}</span>
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3" />
     <div className="flex flex-col md:flex-row" />
     ```

10. **Never Export `./component` in `index.ts` Barrel Files**:
    - **Why**: Component barrel files (`index.ts`) must only re-export `./type` and `./update` (if present). Re-exporting `./component` from `index.ts` degrades tree-shaking efficiency, leads to circular dependencies, and violates deep subpath import contracts. Callers MUST import view components directly from `/component` (e.g. `@rinn7e/realworld-design-system/component/modal/component`).
    - **Example**:
      ```typescript
      // ❌ Bad: Re-exporting component in index.ts
      // lib/component/modal/index.ts
      export * from './type'
      export * from './update'
      export * from './component' // NEVER DO THIS

      // ❌ Bad caller import:
      import { ModalMemo } from '@rinn7e/realworld-design-system/component/modal'

      // ✅ Good: index.ts re-exports type and update only
      // lib/component/modal/index.ts
      export * from './type'
      export * from './update'

      // ✅ Good caller import:
      import { ModalMemo } from '@rinn7e/realworld-design-system/component/modal/component'
      ```

11. **Always Provide `Eq` Instances for Memoized Components**:
    - **Why**: Every memoized component (`<Name>Memo`) must pass a custom `Eq` comparison function derived from `fp-ts` (e.g. `memo(<Name>Component, <Name>PropsEq.equals)`) instead of relying on default shallow equality.
    - **Example**:

    ```typescript
    // ❌ Bad: Relying on default shallow equality
    export const ModalMemo = memo(ModalComponent)

    // ✅ Good: Passing explicit Eq comparator
    export const ModalMemo = memo(ModalComponent, ModalPropsEq.equals)
    ```

12. **Use `Eq.struct` for `PropsEq` and `ModelEq` Combinators**:
    - **Why**: Do not manually write `equals: (x, y) => x.a === y.a && x.b === y.b ...` boolean chains for `Eq` instances. Use `EqClass.struct` (along with `EqClass.array`, `EqClass.eqStrict`, `EqClass.eqString`, etc.) from `fp-ts/lib/Eq` to construct declarative, type-safe `Eq` instances.
    - **Example**:

    ```typescript
    // ❌ Bad: Manual boolean chain
    export const PanelPropsEq: EqClass.Eq<PanelProps> = {
      equals: (x, y) =>
        x.heading === y.heading &&
        x.className === y.className &&
        x.dispatch === y.dispatch &&
        ModelEq.equals(x.model, y.model) &&
        x.blocks.length === y.blocks.length &&
        x.blocks.every((b, i) => PanelBlockItemEq.equals(b, y.blocks[i])),
    }

    // ✅ Good: Declarative EqClass.struct combinator
    export const PanelPropsEq: EqClass.Eq<PanelProps> = EqClass.struct({
      heading: EqClass.eqStrict,
      tabs: EqClass.eqStrict,
      blocks: EqClass.array(PanelBlockItemEq),
      model: ModelEq,
      dispatch: EqClass.eqStrict,
      className: EqClass.eqStrict,
      dataTest: EqClass.eqStrict,
    })
    ```

13. **Extract Complex Message Handlers into Top-Level Handler Functions**:
    - **Why**: Large, inline `switch (msg._tag)` cases in `update.ts` (such as complex sub-component or layout message handling logic) degrade readability and testability. Always extract multi-step or conditional update logic into clean, top-level helper functions (e.g. `sidebarMsgHandler = (msg) => (model) => ...`).
    - **Example**:

    ```typescript
    // ❌ Bad: Inline complex logic inside switch case
    case 'SidebarMsg': {
      const [sidebarModel, sidebarCmd] = DsSidebar.update(msg.subMsg)(model.sidebarModel)
      // ... multi-step route updates and conditional batching inline ...
      return [updatedModel, Cmd.batch([...])]
    }

    // ✅ Good: Clean top-level handler function
    const sidebarMsgHandler =
      (msg: DsSidebar.Msg) =>
      (model: Model): [Model, Cmd<Msg>] => {
        const [sidebarModel, sidebarCmd] = DsSidebar.update(msg)(model.sidebarModel)
        // ...
        return [updatedModel, Cmd.batch([...])]
      }

    // Inside switch:
    case 'SidebarMsg':
      return sidebarMsgHandler(msg.subMsg)(model)
    ```

14. **Always Include `data-component` Attribute on Root Element**:
    - **Why**: Every design system view component MUST render a `data-component="<ComponentName>"` attribute on its root DOM element. This enables automated testing, DOM inspection, and debugging tools to easily identify design system components.
    - **Example**:

    ```typescript
    // ❌ Bad: Missing data-component attribute
    const ContainerComponent = ({ dataTest, ... }: ContainerProps) => (
      <div data-test={dataTest} className={...}>
    )

    // ✅ Good: Always include data-component="<ComponentName>"
    const ContainerComponent = ({ dataTest, ... }: ContainerProps) => (
      <div data-test={dataTest} data-component="Container" className={...}>
    )
    ```

15. **Never Use React State (`useState` / `useReducer`) in Design System Components**:
    - **Why**: Design system view components MUST be pure presentation components adhering strictly to The Elm Architecture (TEA). ALL interactive state (such as open/closed dropdowns, expanded menu items, collapsed panels) MUST be stored purely in the component's TEA `Model` and modified via `Msg` and `update` functions. Components MUST NOT use React `useState` or `useReducer`.
    - **Example**:

    ```typescript
    // ❌ Bad: Using React useState for expanded keys in view component
    const [expandedKeys, setExpandedKeys] = useState<ReadonlySet<string>>(new Set())

    // ✅ Good: Pure TEA Model state driven by Msg updates
    // In type.ts:
    export type Model = { readonly expandedKeys: ReadonlyArray<string> }
    export type Msg = { readonly _tag: 'ToggleExpand'; readonly key: string }

    // In view component:
    const isExpanded = model.expandedKeys.includes(item.key)
    onClick={() => dispatch({ _tag: 'ToggleExpand', key: item.key })}
    ```

16. **Never Include `key` in Component Props or Destructure `key` in View Functions**:
    - **Why**: React treats `key` as a special reserved prop used internally by the reconciler. In React components, `key` is handled directly by JSX at invocation call sites (`<DsButtonMemo key={item.key} />`) and is NOT accessible inside `props`. Component `Props` types MUST NOT declare `key?: React.Key` and view components MUST NOT destructure `key` from props or pass `key={key}` to child DOM nodes.

17. **Never Call `dispatch` Multiple Times in a Single Event Handler**:
    - **Why**: In The Elm Architecture (TEA), every user interaction event handler MUST dispatch at most ONE single `Msg`. Stacking multiple `dispatch` calls inside an event handler (e.g. `dispatch(Msg1); dispatch(Msg2)`) violates atomic state updates and risks out-of-order state transitions. Any compound behavior (such as toggling an item's expanded state in addition to item click logic) MUST be handled cleanly inside the pure `update` function in response to a single `Msg`.
    - **Example**:

    ```typescript
    // ❌ Bad: Calling dispatch multiple times in one onClick
    onClick={() => {
      dispatch({ _tag: 'ToggleExpand', key: item.key })
      dispatch({ _tag: 'ClickItem', item })
    }}

    // ✅ Good: Single dispatch call, update function handles expansion state transition
    onClick={() => dispatch({ _tag: 'ClickItem', item })}

    // In update.ts:
    case 'ClickItem': {
      const expandedKeys = model.expandedKeys
      const isExpanded = expandedKeys.includes(msg.item.key)
      const nextKeys = msg.item.children?.length
        ? isExpanded
          ? expandedKeys.filter((k) => k !== msg.item.key)
          : [...expandedKeys, msg.item.key]
        : expandedKeys
      return [{ ...model, expandedKeys: nextKeys }, Cmd.none()]
    }
    ```

18. **Never Cast `Eq` Instances (`as unknown as EqClass.Eq<...>`)**:
    - **Why**: Casting a `struct<Required<Props>>` to `Eq<Props>` hides real type mismatches (e.g. `A.getEq` used on a `ReadonlyArray`). Library props may be optional; wrap the `Eq` of every optional field in `UndefinableEq` from `@rinn7e/tea-cup-prelude` (`EqClass.eqStrict` already accepts `undefined`), and nullable fields in `NullableEq`.
    - **Example**:
      ```typescript
      // ❌ Bad: casting away the optional fields
      export const ButtonPropsEq: EqClass.Eq<ButtonProps> = EqClass.struct<
        Required<ButtonProps>
      >({ color: string.Eq, onClick: EqClass.eqStrict }) as unknown as EqClass.Eq<ButtonProps>

      // ✅ Good: optional fields wrapped in UndefinableEq
      export const ButtonPropsEq: EqClass.Eq<ButtonProps> = EqClass.struct<ButtonProps>({
        color: UndefinableEq(string.Eq),
        onClick: EqClass.eqStrict,
      })
      ```

---

## TypeScript Type Assertions

Prefer to use `satisfies Type` instead of `as Type` for TypeSript code, unless there is absolutely no other choice besides using `as Type`. This ensures that the object matches the type while still retaining its specific implementation layout for better type inference.

## Task Scope and Refactoring

Prefer not to update or refactor code outside of the specific task or feature that is assigned to you. Keep your changes focused on the current objective to prevent unintended side effects and scope creep.

## Preserving Comments and Documentation

Never strip, delete, or overwrite existing comments, documentation notes, or JSDoc comments during code modifications and refactoring. Existing comments often explain subtle business logic, edge cases (e.g. backend error status caveats), test expectations, or TODO items. Preserving comments maintains codebase history and documentation integrity.

---

## Import Organization

All imports should be grouped into three sections for clarity and consistency:

1. **External libraries** – third-party dependencies.
2. **Path aliases** – files imported via `@/`.
3. **Relative imports** – files imported via `./` or `../`.

Each section is then sorted alphabetically.

- **`lib/`** is a published package and has **no `@/` alias**: it only uses relative imports (`../../theme`, `./type`), so the emitted `.d.ts` files resolve for consumers.
- **`app/showcase-app/`** uses the `@/` alias for anything outside the current folder, and `./` for siblings. It imports the library through `@rinn7e/realworld-design-system/...` subpaths.

Example:

```ts
import { pipe } from 'fp-ts/lib/function'
import { memo } from 'react'
import * as RT from 'react-tooltip'
import { Cmd, map } from 'tea-cup-fp'

import { MyPG } from '@/cache/db'
import { mkTooltipClass } from '@/components/shared/dumb-tooltip'
import * as Form from '@/hook/form-tea'

import { Msg } from './type'
...
```

---

## Control Flow

Avoid early returns. Always express branching as a full `if / else if / else` tree so that every code path is explicit.

```ts
// ❌ early return
const foo = (x: number) => {
  if (x === 0) return 'zero'
  return 'non-zero'
}

// ✅ if-else tree
const foo = (x: number) => {
  if (x === 0) {
    return 'zero'
  } else {
    return 'non-zero'
  }
}
```

---

## Functional Programming (fp-ts)

Prefer `fp-ts` over plain JavaScript array/object methods. Always use `pipe` with the appropriate `fp-ts` module (e.g. `A` for `Array`, `O` for `Option`, `M` for `Map`) rather than calling methods directly on values.

```ts
// ❌ plain JS
return list.map((ps) =>
  getNameFromProfileSelection(ps) === getNameFromProfileSelection(newProfile)
    ? newProfile
    : ps,
)

// ✅ fp-ts
return pipe(
  list,
  A.map((ps) =>
    getNameFromProfileSelection(ps) === getNameFromProfileSelection(newProfile)
      ? newProfile
      : ps,
  ),
)
```

This applies to all array operations (`.map`, `.filter`, `.find`, `.some`, `.every`, etc.) as well as `Option`, `Either`, `Map`, and other `fp-ts` data types.

---

## Mutable Variables (`let`)

Do not use mutable `let` bindings or procedural variable reassignment. Reassigning variables introduces hidden state mutations and makes control flow difficult to reason about. Always use immutable `const`, pure helper expressions, ternary expressions, `pipe`, and pure functional transforms.

```ts
// ❌ procedural mutable let reassignment
let pathname = url.pathname
if (pathname.startsWith(base)) {
  pathname = pathname.slice(base.length)
}

// ✅ pure immutable const expression
const pathname = url.pathname.startsWith(base)
  ? url.pathname.slice(base.length)
  : url.pathname
```

---

## Algebraic Data Types (ADTs)

When dealing with Algebraic Data Types (ADTs), prefer to use a `switch` statement on the discriminator field (e.g. `_tag`) rather than using `if-else` chains.

```ts
// ❌ if-else
if (x._tag === 'ExactProfilesDialog') {
  ...
} else if (x._tag === 'SubsetContactsDialog') {
  ...
} else if (x._tag === 'CompoundBundlesDialog') {
  ...
}

// ✅ switch
switch (x._tag) {
  case 'ExactProfilesDialog':
    ...
  case 'SubsetContactsDialog':
    ...
  case 'CompoundBundlesDialog':
    ...
}
```

---

## Sum-Type Eq Instances

When writing an `Eq` instance for a sum-type (union type), use an explicit branch check for each variant of the union to ensure type-safe comparison of its properties.

```ts
export const SystemMessageEq: EqClass.Eq<SystemMessage> = {
  equals: (x, y) => {
    if (x.type === 'sm_added' && y.type === 'sm_added') {
      return EqClass.struct({
        type: S.Eq,
        contents: A.getEq(ContactFromApiEq),
      }).equals(x, y)
    } else if (x.type === 'sm_removed' && y.type === 'sm_removed') {
      return EqClass.struct({
        type: S.Eq,
        contents: A.getEq(ContactFromApiEq),
      }).equals(x, y)
    } else {
      return false
    }
  },
}
```

---

## Side-Effects and IO in TEA Architecture

All side-effects and IO operations (such as `localStorage` reads/writes, DOM mutations, or HTTP requests) **MUST** be executed inside pure Elm commands (`Cmd`), and **NEVER** imperatively inside update handler functions.

```ts
// ❌ Direct imperative IO inside update handler
const changeColorSchemeHandler =
  (scheme: ColorScheme) =>
  (model: Model): [Model, Cmd<Msg>] => {
    saveColorScheme(scheme) // ❌ Imperative IO side-effect inside update!
    applyColorScheme(scheme) // ❌ Imperative DOM mutation inside update!
    return [{ ...model, colorScheme: scheme }, Cmd.none()]
  }

// ✅ Pure TEA architecture: IO wrapped inside Cmd via cmdSucceed
export const setColorSchemeCmd = (
  scheme: ColorScheme,
): Cmd<{ readonly _tag: 'NoOp' }> =>
  cmdSucceed(() => {
    saveColorScheme(scheme)
    applyColorScheme(scheme)
  })

const changeColorSchemeHandler =
  (scheme: ColorScheme) =>
  (model: Model): [Model, Cmd<Msg>] => {
    return [
      { ...model, colorScheme: scheme },
      setColorSchemeCmd(scheme).map((subMsg): Msg => subMsg),
    ]
  }
```

---

## TEA Child Msg Interception

When a parent component needs to intercept or respond to specific messages from its child components, use the `updateAndCmd` (or `updateAndCmdExtra`) pattern within a `pipe`. This keeps the child message handling clean and modular by avoiding nested `switch` or `if-else` blocks for simple interception logic.

```ts
case 'ChildMsg': {
  const [newChildModel, childCmd] = Child.update(
    msg.subMsg,
    model.childModel,
  )

  return pipe(
    [
      { ...model, child: newChildModel },
      childCmd.map(
        (m) =>
          ({
            _tag: 'ChildMsg' as const,
            subMsg: m,
          }) as Msg,
      ),
    ],
    updateAndCmd((m) => {
      if (msg.subMsg._tag === 'MsgToIntercept') {
        return [
          { ...m, someParentField: true }, // Update parent model
          Cmd.none(), // Add parent commands
        ]
      } else {
        return [m, Cmd.none()]
      }
    }),
  )
}
```

---

## Navigation and the URL

The showcase app owns where it is; the URL only follows. The paths below are under `app/showcase-app/`. The words:

- **Destination** (`src/common/type/destination/`): where the app is, a `screen` plus, when an app has them, flat params (`currentX` style fields of their owners, one boolean per dialog that has its own URL). It is **never stored**: `destinationOf(model)` (`src/util/destination.ts`) reads it from the models that show it.
- **Screen**: what the destination shows (`HomeScreen`, `BoxScreen`, ...). The screen components live in `src/screen/`. There are no pages.
- **`NavigationMsg`**: every move of the app (`Navigate`, `ModifyDestination`, `Refresh`, and `UrlChanged` for the browser back and forward), handled by `navigationMsgHandler` (`src/handler/navigation-handler.ts`), which opens its screen. The showcase has no guard: every destination can be shown (an app with one runs the destination through `guardDestination` first).
- **The URL** is an adapter at the edges (`src/util/url.ts`). It is written from the destination after every step (`withUrl`, see the next section) and read only at boot (`bootDestinationOf`) and on back or forward (`urlChangedMsg`). `parseDestination` and `toUrlString` are the only code that knows its spelling: the menu hrefs come from `toUrlString`, and a nav item click opens the destination of its key (`navItemDestination`), never a parsed href. Nothing the app writes comes back as an event: the URL commands call `window.history` directly, which fires no `popstate`.

How the history follows a step (`urlWriteOf`):

1. A change of destination pushes an entry.
2. The same destination writes nothing (a click on the screen shown refreshes it, with no new entry).
3. A back or forward (`UrlChanged`) already has its entry: it writes nothing, unless the app shows another destination than the one its URL opens (a guard redirected it, or a navigation block kept the destination shown); then it replaces. The showcase has neither, so it never replaces today.
4. In an app with a guard, the boot replaces a redirected URL. The showcase boots on the destination of its URL as it is, and leaves another spelling of it (`/box/`) as typed.

`VITE_DISABLE_URL=true` turns the adapter off, for debugging only: the app boots on the default destination, ignores back and forward, and writes no URL.

---

## No `update` Wrapper (and the URL Exception)

Do not add a step by wrapping the whole `update` of a component to run after every message, for example renaming `update` to `screenUpdate` and adding an outer `update` around it. Put the step in the `case` of the messages that change that state, with `updateAndCmd` in its `pipe` (see [TEA Child Msg Interception](#tea-child-msg-interception)). A wrapper hides the step from whoever reads the `case`, and it breaks the rule that dispatching `XMsg` and calling `xMsgHandler` are the same thing: a handler called from the step of another message goes through the wrapper of that step, not of its own message.

```ts
// Bad: a pass after every message of the screen
export const update = (msg: Msg, model: Model) =>
  pipe(screenUpdate(msg, model), updateAndCmd(closeHiddenRows))

// Good: in the case that changes the list
case 'PaginationMsg':
  return pipe(
    paginationMsgHandler(msg.subMsg)(model),
    updateAndCmd(closeHiddenRows),
  )
```

**The one exception: the URL** (`withUrl` in `app/showcase-app/src/util/url.ts`, around the root `update` in `app/showcase-app/src/program.tsx`). The URL is not state: it is written from the destination, which is read from the models (`destinationOf`), the same way the view is rendered from them. After each step `withUrl` compares the destination before and after (`urlWriteOf`) and pushes or replaces the URL. This is fine, and not the wrapper above, because:

1. It wraps only the outermost `update`, the one the program runs for every message. Every handler runs inside one of its steps, so none can escape it: dispatching `XMsg` and calling `xMsgHandler` give the same URL (calling the handler inside another step folds its change into the single entry of that step).
2. It decides from the state, not from the message: the destination before and after the step, whichever handlers changed it. The only use of the message is that a back or forward of the browser itself (`UrlChanged`) is corrected with a replace instead of pushed, which describes what the browser did.
3. Its command answers only with `NoOp`, which changes no destination, so it never writes again: no loop of steps.
4. The alternative is worse: every place that changes the destination (a navigation, a nav item click, a screen param changed in place) would have to return its own URL write, and one that forgets leaves the URL showing something else than the screen.

Nothing else may wrap `update`. A new step that must run after every message is a sign that its state is stored twice: make it read from the models instead, as the destination is.

---

## Follow the Component Tree

Components nest as a tree (the app, a screen, its sub-components), and their `init`, `reInit` and handlers nest the same way: each one sets up or updates its own model and calls those of its direct children, nothing more. When a child has to react to something new (a destination param, a setting), add that step to the function that already passes this kind of change down to it, in the component that owns the child. Do not add a second pass from higher up.

Before writing a new function for the state of a child, find the chain that already reaches the child for this kind of change: for a destination change, that is the `reInit` of the parent (and its `init` for the first destination of the app), which already receive the destination. Add the step for the child there. A separate step bolted on in a grandparent splits the reaction of one component over two levels, makes the grandparent know its grandchild, and has to rebuild what the parent already receives.

When the parent skips its work for an unchanged input (an early return), the step for the child must still run when its own input changed: check the new input in that branch too.

Signs of the mistake: a grandparent pipes the result of the parent through a handler of the grandchild; a new handler whose only caller is a grandparent; arguments the grandparent derives from data the parent already gets.

```ts
// Bad: the app reaches into a modal of the screen after the screen init
const [screenModel, screenCmd] = pipe(
  ModalScreen.init(),
  updateAndCmd(ModalScreen.openRichModalHandler(destination.richModal)),
)

// Good (an illustration, the demo modals have no URL flag): the modal is a
// child of the screen, so the screen `reInit` (which
// already gets both destinations) opens or closes it; the app only calls
// `ModalScreen.reInit`
export const reInit = (oldDestination, newDestination, oldModel) => {
  const [modalRichModel, modalRichCmd] = DsModal.reInit({
    oldModel: oldModel.modalRichModel,
    oldShown: oldDestination.richModal,
    newShown: newDestination.richModal,
  })
  // ...
}
```

---

## One Source of Truth: Make Impossible States Impossible

Every fact lives in **one** place in the model, and the types allow only the states that can really happen. Do not keep a second copy of something the model already holds, and do not add a field whose value can be worked out from another one.

**When a component gains a capability, refactor its model.** Reshape the existing state so the new capability fits it, even when that touches every caller. Do not bolt on a field that mirrors the old one and then sync the two: every later change has to remember both copies, and the types no longer stop them from disagreeing.

Signs that a model holds the same state twice:

- A `sync*` function that copies one field into another after updates, or a comment saying a field "follows" another.
- A back-sync, such as an "is closed by the user" check that copies a close back into another field so a sync would not reopen it.
- A `useEffect` that dispatches only to bring the model in line with itself.
- A boolean or `Option` that only says whether something else is open, shown or set (`open: boolean` next to a dialog model).
- Types that allow combinations that cannot happen.

The destination follows the same rule:

- **Never store the destination.** Each owner keeps a flat field for its part, set by its `init` or `reInit`: the screen model says which screen is shown (here its tag, read with `currentScreenOf`: a `currentScreen` field next to it would say the same thing twice), and a screen or pane with a param keeps it as a flat `currentX` field (`currentFilter`, `currentTab`). `destinationOf(model)` reads the destination from the owners.
- **Read dialog and overlay flags from the dialog** (its `isOpen`; a dialog closing counts as closed), never store them a second time.
- **A user close only updates its owner, and the URL follows.** No "closed by the user, so navigate" sync back. The one exception is a screen whose leaving must go through a navigation block or an auto-save: its close navigates instead of only closing, and that is documented on its model.
- **A dialog that should survive a refresh and close on back** gets one flat boolean in the destination (`x_setting=true` style in the URL), opened and closed by its owner `reInit`, and dropped by the guard where it cannot open. One boolean per dialog: no `Option` of a dialog union, no grouping type. The showcase has no such dialog today: the demo modals of the modal screen stay out of the URL.

---

## Make Impossible Updates Impossible

One source of truth says where a fact lives. This says **who may change it**: a fact with an owner gets a type only its owner makes, so a write that skips the owner does not type check. Everyone reads it as its plain type; writing it needs the function of the owner. It is the abstract type of Haskell or Elm (export the type, not its constructor), done in TypeScript with a branded type (also called an opaque type): `Brand<T, B>` (`app/showcase-app/src/common/type/brand-wrapper.ts`), where `B` is a `declare class` with one private method that the owner declares next to the type and never exports (it has no value, so its name starts with `_` for the unused-vars rule). A class method, not a symbol key: an object spread drops it, so copying or changing an owned value by a spread gives the plain type again, not an owned one.

```ts
// app/showcase-app/src/type.ts: the owner
declare class _CurrentScreenModelBrand {
  private _currentScreenModelBrand(): void
}

export type CurrentScreenModel = Brand<ScreenModel, _CurrentScreenModelBrand>

// The only ways in: a move, and the screen shown in place
export const currentScreenModelOfMove = (screenModel: ScreenModel): CurrentScreenModel => ...
export const sameScreenWith =
  (current: CurrentScreenModel) => (screenModel: ScreenModel): CurrentScreenModel => ...
```

```ts
// Anywhere else
model.screenModel._tag                         // fine: reading, it is a ScreenModel
{ ...model, screenModel: someScreenModel }     // type error: not a CurrentScreenModel
```

The owned value in the showcase:

| Value                | Made only by                                                                                                | So you cannot                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `CurrentScreenModel` | `currentScreenModelOfMove` (used by the navigation only), `sameScreenWith` (`app/showcase-app/src/type.ts`) | change the screen without a move; `sameScreenWith` only changes the model of the screen shown |

An app with a guard also owns the destination the guard let through (`DestinationAfterGuard`, made only by `guardDestination`, the only kind `initScreenModel` takes), and a screen or pane with a param owns its `currentX` field. The showcase has no guard and no screen param, so it owns neither.

Rules:

- **Reading stays free.** A brand is a subtype, so views, getters and `destinationOf` read it as the plain type.
- **Make one only through its owner.** The types stop every write that is not a cast: a plain value, a changed copy. The owner is the one file that casts to its own value (its makers), each cast with an `eslint-disable-next-line` of `consistent-type-assertions` (see [TypeScript Type Assertions](#typescript-type-assertions)).
- **Only a move calls the move maker** (`currentScreenModelOfMove`): the types cannot say who may call an exported function, so `app/showcase-app/eslint.config.js` forbids it outside the navigation (`navigation-handler.ts`) and tests. That is the only lint rule here.
- **A spread does not keep it.** `{ ...owned, field: x }` is the plain type, so a changed copy does not type check where the owned value is needed. Copying the parent (`{ ...model }`) keeps it: its field still holds the value its owner made.
- **Review watches the rest.** Each owned type, maker and `initScreenModel` carries a `Review:` comment saying what misuse looks like. Block in review: a cast to an owned type outside its owner file (`as X`, `as any`, a value typed `any`), a cast to a type holding one over a changed field (`as Model`), `Object.assign` onto an owned field, and a call of `initScreenModel` outside a move.
- **Tests go through the owner too:** a fixture builds a model with `init` (`bootOn` in `app/showcase-app/tests/helper/app.ts`) or `initScreenModel`, not by hand.
- **`app/showcase-app/tests/convention/owned-fields.test.ts` pins it:** each bypass there is a `@ts-expect-error`, so `tsc` fails when one starts to type check.
- **Add a brand when a fact has an owner and a wrong write is easy:** a field set by `init` / `reInit` that other code could set on the side, or a value that must have passed a check (a guard). Not for every field: a component writing its own private state needs none.

---

## File Structure and Splitting

### Tea Cup Components

Each component should follow a clear, modular structure to promote maintainability and avoid circular dependencies.

#### Naming Rules

- **File names** must be **singular**.
- **Folder names** must also be **singular** (folders act as logical _tags_).
  - Asset files and folders do not have to follow this convention since they are not code.
  - Global styles should be located in `src/asset/` (e.g., `src/asset/index.css`).

- File and folder names must be in kebab-case.
- Use the prefix **`list`** or **`array`** to indicate a collection of items.
  - Example: `component/article-list.tsx`

- Component names should be `<ExampleComponent>` for the component and `<ExampleMemo>` for its memoized version.
  - Example:

```ts
export const AccountSettingMemo = memo(AccountSettingComponent, PropsEq.equals)
```

- Props types are named after the component (e.g. `LinkProps`, `FooterProps`), except the TEA module's own `Props` in `type.ts`.
- Views are always React components (`<TabItemMemo />`), never `renderXxx(...)` functions returning JSX.
- **Naming the model a step returns**: the `Model` that a handler or step gives back is `updatedModel`, or `newModel` in an `init` or `reInit` (beside its `oldModel`). Do not name it after what the step did (not `withDialog`, `closed` or `opened`): the name says it is the model, the step says what changed. Its `Cmd` is named after the step (`navigationCmd`).

#### Recommended File Breakdown

For any component (or screen), split it into the following files:

**1. `type.ts`**

- Defines the component's `Model` and `Msg`.
- Defines `ModelEq` for memoization.
- Defines `Props` and `PropsEq` for the view.

**2. `update.ts`**

- Contains the `init` and `update` functions.
- Imports `Model` and `Msg` from `./type`.

**3. `component.tsx`**

- Defines the view components.
- Only export the memo version (e.g., `export const ExampleMemo = ...`).
- Imports `Props` and `PropsEq` from `./type`.

**4. `index.ts`**

- Re-exports everything from `./type` and `./update`.
- **NEVER** `export * from './component'` in `index.ts`. Callers must import view components directly from `/component` (or `./component.tsx`).

For complex components (like screens):

**5. `sub-component/`**

- Directory for child components.
- Each child component follows the same `type.ts`, `update.ts`, `component.tsx`, `index.ts` structure.
- Child components can also contain their own `sub-component/` directory if necessary, though this should be rare.

**6. `common/`**

- Directory for types, views, or utilities shared **only** among the child components of this specific screen/component.

---

### Library Layout (`lib/`)

- Each view lives in `lib/<category>/<name>/` (categories: `element`, `component`, `form`, `layout`, `grid`, `misc`) with `type.ts`, `update.ts` (only when it has TEA state), `component.tsx` and `index.ts`.
- Shared library code lives in `lib/type/` (e.g. `nav-item.ts`, `animate.ts`) and `lib/theme/` (`cn`); nothing there imports from a view folder.
- Every new entry file must also be added to the `build.lib.entry` map in `vite.config.ts`.
- Public props may be optional with defaults in the destructuring (`color = 'green'`), since they are the library API. The style maps they index must be typed by the prop union (`Record<ButtonColor, string>`), so no `|| fallback` lookups are needed.

### Dependency Order and Hierarchy

To minimize circular dependencies and ensure a clean modular structure, follow this hierarchy:

1.  **`src/common/`**: Central shared logic. Nothing in `common/` should import from outside `common/` (except external libraries).
2.  **Global Components (`src/component/`)**: Generic UI components (e.g., `navbar.tsx`, `link.tsx`).
3.  **Screens (`src/screen/`)**: Application screens.
4.  **Sub Components (`src/screen/*/sub-component/`)**: Specific components used only by a single screen or parent component.

**App Structure:**

- The root `App` is the entry point that composes **Components** and **Screens**.
- Each **Component** or **Screen** can contain its own **sub-component** directory.
- Deep nesting of sub-components is possible but should be kept rare to avoid complexity.

**Import Rules:**

- Always prefer importing from `@/common/...`.
- Sub-components should import shared screen-level logic from their parent's `./common/` directory.
- Avoid importing from the top-level `@/type.ts` unless you are a global component needing the root `Model` or `Msg`.

### React Components

- All components should have `<MyComponent>` and `<MyComponentMemo>`.
- Only export the memo version, unless the component cannot be memoized.
- Must define proper `Eq` instance for memoization.
- Only use `EqAlways` if you are certain the value will not change. Avoid using it for model data that can be updated.
- Use TEA state management unless it is impossible to do so.

#### Props Ordering

When defining props for a React component, order the fields logically to improve readability and distinguish between component-specific data and generic data passed from parents:

1.  **Component-specific fields** – Props unique to the component's logic
2.  **Parent-passed** – Props passed from high-level parentProps

Example:

```ts
export type ParticipantSelectionProps = {
  // Specific fields
  label: string
  profileSelectionType: RecipientField
  calculatedField: number

  // Fields passed from parent
  isMaximized: boolean
  header: Header
  auth: ProfileFromApi
  dispatch: Dispatcher<Msg>
}

<ParticipantSelectionMemo
  label='bcc'
  profileSelectionType='BCC'
  calculatedField={calculateSth()}

  isMaximized={parentProps.isMaximized}
  header={parentProps.header}
  auth={parentProps.auth}
  dispatch={parentProps.dispatch}
/>
```

---

## UI Styling Guidelines

The project mainly uses Tailwind CSS; use custom CSS only when necessary.

- **Do not** use margin classes. Use a parent element with padding instead.

- **Prefer** explicit pixel values (`px`) using square brackets over Tailwind's default numeric scale for dimensions and spacing (e.g., use `w-[304px]` instead of `w-76`). This ensures precision and better alignment with design specifications.

- **Do not** use `h-screen`, as this doesn't play well with mobile browsers due to the varying appearance of the URL bar.
  - Use `h-full` instead (or `h-dvh` after further experimentation).
- **Should** use `createPortal` with `absolute` (or `fixed` position, requiring more experimentation) to display a UI stack on top of another.
  - The `body` element has the class `relative`, so we can display a dialog with just `absolute` instead of `fixed`. This allows us to use `h-full` instead of `h-screen` to make the dialog fill the screen.
- **Must** use mobile-first conventions:
  - **Do not** use `max-lg:` or any `max-*` breakpoints. Always define mobile styles first, then override them for desktop using `lg:`.
  - Use `w-full lg:w-[400px]` instead of `w-[400px] max-lg:w-full`.
  - Use `hidden lg:block` instead of `max-lg:hidden`.
- **Should** use multi-line classes for complex layouts:
  - Organize classes into `shared`, `mobile`, and `desktop` groups for readability.

```ts
// Example of a mobile-first, multi-line className
className={cn(
  // shared class
  'h-full flex flex-col overflow-y-auto scrollbar scrollbar-w-[8px] scrollbar-thumb-cf-dark-30',
  // mobile class
  'fixed inset-0 w-full bg-white px-[24px] z-10 pb-[16px]',
  // desktop class
  'lg:static lg:shrink-0 lg:bg-cf-light-400 lg:gap-[16px] lg:w-[386px] lg:px-[20px] lg:pb-0',
)}
```

---

## Tests

- Tests live in a `tests/` folder next to the source root (never inside it), and the file tree **mirrors exactly** the source path of the function under test:
  - `lib/component/sidebar/update.ts` → `tests/component/sidebar/update.test.ts` (imported with relative paths)
  - `app/showcase-app/src/common/type/route/parser.ts` → `app/showcase-app/tests/common/type/route/parser.test.ts` (imported through `@/`)
- End-to-end tests live in the separate `package/e2e` package.
