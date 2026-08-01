# `@rinn7e/frontend-design-system`

A comprehensive, Bulma-inspired design system component library and custom UI renderer suite built for RealWorld frontend applications.

---

## 🎨 Philosophy & Design Architecture

### 1. Bulma CSS Design System Foundation
`frontend-design-system` follows the **Bulma CSS Design System** specification, providing a clean, responsive, CSS-first component architecture divided into 5 core categories:

1. **Elements**: Primitive UI building blocks (`Block`, `Box`, `Button`, `Content`, `Delete`, `Icon`, `Image`, `Notification`, `Progress`, `Table`, `Tag`, `Title`).
2. **Components**: Interactive and composite navigation/content structures (`Breadcrumb`, `Card`, `Dropdown`, `Menu`, `Message`, `Modal`, `Navbar`, `Pagination`, `Panel`, `Tabs`).
3. **Form**: Form controls and field containers (`Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `File`).
4. **Layout**: Page layout containers (`Container`, `Hero`, `Section`, `Level`, `MediaObject`, `Footer`).
5. **Grid**: Flexbox multi-column layout system (`Columns`, `Column`).

---

### 2. Stateless UI Views vs. TEA Components

The library strictly segregates UI rendering into two explicit patterns:

#### A. Pure Stateless UI Views (`type.ts` + `view.tsx`)
- **Applies to**: Elements, Layout Containers, Grid Cells, and Form Renderers.
- **Pattern**: Pure, controlled presentation views. State is held in the caller application's `Model`.
- **File Layout**:
  - `lib/<category>/<component-name>/type.ts`: Props interface and variant types.
  - `lib/<category>/<component-name>/view.tsx`: Functional React view component.
  - `lib/<category>/<component-name>/index.ts`: Public module exports.

#### B. Complex TEA Sub-Components (`type.ts` + `update.ts` + `component.tsx`)
- **Applies to**: Interactive components with stateful workflows (`Dropdown`, `Modal`, `Navbar`, `Pagination`, `Panel`, `Tabs`, `Menu`).
- **Pattern**: Pure Elm Architecture (TEA) sub-components providing explicit `Model`, `Msg`, `init`, `update`, and `view` functions.
- **File Layout**:
  - `lib/components/<name>/type.ts`: Sub-component `Model` and `Msg` definitions.
  - `lib/components/<name>/update.ts`: Reducer `update(msg)(model)` returning `[Model, Cmd<Msg>]`.
  - `lib/components/<name>/component.tsx`: Sub-component view function.
  - `lib/components/<name>/index.ts`: Barrel export.

---

### 3. Integration with `@rinn7e/tea-cup-form`
All form renderers under `lib/form/` (`input`, `textarea`, `select`, `checkbox`, `radio`, `file`) are designed as pure stateless UI renderers matching `@rinn7e/tea-cup-form`'s custom UI argument types (`UiArg`), allowing seamless drop-in rendering for forms.

---

## 🛠️ Development & Script Guide

### Showcase Documentation Web App
Launch the interactive `react-tea-cup` documentation website showcasing all components with live **Canvas** previews and **Code Snippets**:

```bash
cd exe/showcase-app
pnpm install
pnpm run dev
```

### Library Scripts
Run from the root of `frontend-design-system`:

- **Typecheck**:
  ```bash
  pnpm run check
  ```
- **Check Circular Dependencies**:
  ```bash
  pnpm run check-circular
  ```
- **Lint Codebase**:
  ```bash
  pnpm run lint
  ```
- **Compile Library**:
  ```bash
  pnpm run build
  ```
- **Run All Verification Checks (Staged)**:
  ```bash
  pnpm run staged
  ```
