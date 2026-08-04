# Code Conventions for `@rinn7e/realworld-design-system`

## Mistakes to Avoid

1. **Never Export `./component` in `index.ts` Barrel Files**:
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

2. **Always Provide `Eq` Instances for Memoized Components**:
   - **Why**: Every memoized component (`<Name>Memo`) must pass a custom `Eq` comparison function derived from `fp-ts` (e.g. `memo(<Name>Component, <Name>PropsEq.equals)`) instead of relying on default shallow equality.
   - **Example**:
     ```typescript
     // ❌ Bad: Relying on default shallow equality
     export const ModalMemo = memo(ModalComponent)

     // ✅ Good: Passing explicit Eq comparator
     export const ModalMemo = memo(ModalComponent, ModalPropsEq.equals)
     ```

3. **Use `Eq.struct` for `PropsEq` and `ModelEq` Combinators**:
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

4. **Extract Complex Message Handlers into Top-Level Handler Functions**:
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

5. **Always Include `data-component` Attribute on Root Element**:
   - **Why**: Every design system view component MUST render a `data-component="<ComponentName>"` attribute on its root DOM element. This enables automated testing, DOM inspection, and debugging tools to easily identify design system components.
   - **Example**:
     ```typescript
     // ❌ Bad: Missing data-component attribute
     export const ContainerComponent: React.FC<ContainerProps> = ({ dataTest, ... }) => (
       <div data-test={dataTest} className={...}>
     )

     // ✅ Good: Always include data-component="<ComponentName>"
     export const ContainerComponent: React.FC<ContainerProps> = ({ dataTest, ... }) => (
       <div data-test={dataTest} data-component="Container" className={...}>
     )
     ```

6. **Never Use Mutable Variables (`let`) - Follow Pure FP Patterns**:
   - **Why**: Functional programming principles require immutability. Do not declare mutable state or variables using `let` (e.g. `let targetPage = ...`). Instead, use pure functions, switch expressions, ternary operators, or helper mapping functions with `const` bindings.
   - **Example**:
     ```typescript
     // ❌ Bad: Using mutable let variable
     let targetPage: AppRoute['page'] = { _tag: 'HomePage' }
     if (key === 'elements') {
       targetPage = { _tag: 'BlockPage' }
     } else if (key === 'components') {
       targetPage = { _tag: 'BreadcrumbPage' }
     }

     // ✅ Good: Pure FP helper mapping function with const
     const getTargetPage = (key: string): AppRoute['page'] => {
       switch (key) {
         case 'elements':
           return { _tag: 'BlockPage' }
         case 'components':
           return { _tag: 'BreadcrumbPage' }
         default:
           return { _tag: 'HomePage' }
       }
     }
     const targetPage = getTargetPage(key)
     ```

7. **Never Use React State (`useState` / `useReducer`) in Design System Components**:
   - **Why**: Design system view components MUST be pure presentation components adhering strictly to The Elm Architecture (TEA). ALL interactive state (such as open/closed dropdowns, expanded menu items, collapsed panels) MUST be stored purely in the component's TEA `Model` and modified via `Msg` and `update` functions. Components MUST NOT use React `useState` or `useReducer`.
   - **Example**:
     ```typescript
     // ❌ Bad: Using React useState for expanded keys in view component
     const [expandedKeys, setExpandedKeys] = useState<ReadonlySet<string>>(new Set())

     // ✅ Good: Pure TEA Model state driven by Msg updates
     // In type.ts:
     export type Model = { readonly expandedKeys?: ReadonlyArray<string> }
     export type Msg = { readonly _tag: 'ToggleExpand'; readonly key: string }

     // In view component:
     const isExpanded = model.expandedKeys?.includes(item.key) ?? false
     onClick={() => dispatch({ _tag: 'ToggleExpand', key: item.key })}
     ```

8. **Never Include `key` in Component Props or Destructure `key` in View Functions**:
   - **Why**: React treats `key` as a special reserved prop used internally by the reconciler. In React components, `key` is handled directly by JSX at invocation call sites (`<DsButtonMemo key={item.key} />`) and is NOT accessible inside `props`. Component `Props` types MUST NOT declare `key?: React.Key` and view components MUST NOT destructure `key` from props or pass `key={key}` to child DOM nodes.
