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
       key: EqClass.eqStrict,
       dataTest: EqClass.eqStrict,
     })
     ```
