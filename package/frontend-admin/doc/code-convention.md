# Code Conventions for `frontend-admin`

## Mistakes to Avoid

1. **Never Export `./component` in `index.ts` Barrel Files**:
   - **Why**: Component barrel files (`index.ts`) must only re-export `./type` and `./update` (if present). Re-exporting `./component` from `index.ts` degrades tree-shaking efficiency, leads to circular dependencies, and violates deep subpath import contracts. Callers MUST import view components directly from `/component` (e.g. `@/component/modal/component`).
   - **Example**:
     ```typescript
     // ❌ Bad: Re-exporting component in index.ts
     // src/component/modal/index.ts
     export * from './type'
     export * from './update'
     export * from './component' // NEVER DO THIS

     // ❌ Bad caller import:
     import { ModalMemo } from '@/component/modal'

     // ✅ Good: index.ts re-exports type and update only
     // src/component/modal/index.ts
     export * from './type'
     export * from './update'

     // ✅ Good caller import:
     import { ModalMemo } from '@/component/modal/component'
     ```
