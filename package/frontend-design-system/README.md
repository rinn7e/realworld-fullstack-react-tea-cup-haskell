# `@rinn7e/realworld-design-system`

A comprehensive, Bulma-inspired design system component library and custom UI renderer suite built for RealWorld frontend applications.

---

## 📦 Installation

### 1. Package Manager (npm / pnpm / yarn)

Install the package via `pnpm`, `npm`, or `yarn`:

```bash
# Using pnpm (recommended)
pnpm add @rinn7e/realworld-design-system

# Using npm
npm install @rinn7e/realworld-design-system

# Using yarn
yarn add @rinn7e/realworld-design-system
```

### 2. Local Installation (Monorepo / Sibling Link)

If consuming this design system as a local sibling package during development (e.g. inside `frontend-web`), add it using relative `link:` in your project's `package.json`:

```json
{
  "dependencies": {
    "@rinn7e/realworld-design-system": "link:../frontend-design-system"
  }
}
```

Then run `pnpm install` in your consuming application.

### 3. Peer Dependencies

Ensure your application has the following installed:
- `react` (>= 19.0.0)
- `react-dom` (>= 19.0.0)
- `react-tea-cup` (>= 5.0.0)
- `tailwindcss` (>= 4.0.0)

---

### Tailwind CSS v4 Setup

Add the design system plugin and `@source` scanner to your application's CSS file (e.g., `index.css`):

```css
@import "tailwindcss";
@plugin "@rinn7e/realworld-design-system/plugin";
@source "../node_modules/@rinn7e/realworld-design-system";
```

---

## 🚀 Quick Start & Usage Examples

### 1. Global Styles & Font Setup

In your application's main CSS entrypoint (e.g. `src/index.css`), include the Tailwind v4 directives:

```css
@import "tailwindcss";
@plugin "@rinn7e/realworld-design-system/plugin";
@source "../node_modules/@rinn7e/realworld-design-system";
```

Include Google Fonts (`Titillium Web` and `Inter`) in your `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@700&family=Inter:wght@400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
```

---

### 2. Pure Stateless UI View Examples

Stateless view functions are invoked directly as function calls inside your JSX (`{Button.view(...)}`).

#### A. Buttons (`Button.view`)

```tsx
import { Button } from '@rinn7e/realworld-design-system'

// Primary Conduit Green Button
{Button.view({
  variant: 'primary',
  children: 'Publish Article',
  onClick: () => dispatch({ type: 'PUBLISH_CLICKED' }),
})}

// Outlined Pill Button
{Button.view({
  variant: 'primary',
  isOutlined: true,
  isRounded: true,
  children: 'Follow Author',
})}

// Loading State Button
{Button.view({
  variant: 'primary',
  isLoading: true,
  children: 'Saving...',
})}
```

#### B. Grid Layout (`Columns.view` & `Column.view`)

```tsx
import { Columns, Column, Box, Title, Content } from '@rinn7e/realworld-design-system'

{Columns.view({
  children: (
    <>
      {Column.view({
        size: 'one-quarter',
        children: Box.view({
          children: <p>Sidebar Navigation</p>,
        }),
      })}
      {Column.view({
        size: 'three-quarters',
        children: Box.view({
          children: (
            <>
              {Title.view({ size: 3, children: 'Main Dashboard' })}
              {Content.view({ children: <p>Dashboard article content goes here.</p> })}
            </>
          ),
        }),
      })}
    </>
  ),
})}
```

#### C. Notification Banner (`Notification.view`)

```tsx
import { Notification } from '@rinn7e/realworld-design-system'

{Notification.view({
  variant: 'success',
  children: 'Your profile settings have been updated successfully!',
  onDismiss: () => dispatch({ type: 'DISMISS_ALERT' }),
})}
```

---

### 3. Stateful TEA Sub-Component Examples

Interactive components (e.g. `Navbar`, `Dropdown`, `Tabs`, `Modal`, `Menu`) provide stateful TEA (The Elm Architecture) sub-component modules with `Model`, `Msg`, `init`, `update`, and `view`.

#### Navbar Sub-Component (`Navbar`)

```tsx
import { Navbar } from '@rinn7e/realworld-design-system'

// 1. Include Navbar.Model in your main TEA Model
interface Model {
  navbarModel: Navbar.Model
}

// 2. Initialize Navbar Sub-Component State
const init = (): [Model, Cmd<Msg>] => [
  { navbarModel: Navbar.init(false) },
  Cmd.none(),
]

// 3. Forward Navbar.Msg in your update reducer
type Msg = { type: 'NAVBAR_MSG'; msg: Navbar.Msg }

const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg.type) {
    case 'NAVBAR_MSG': {
      const [updatedNavbar, cmd] = Navbar.update(msg.msg)(model.navbarModel)
      return [
        { ...model, navbarModel: updatedNavbar },
        cmd.map((m) => ({ type: 'NAVBAR_MSG', msg: m })),
      ]
    }
  }
}

// 4. Render Navbar view
{Navbar.view({
  brand: {
    name: 'conduit',
    href: '#/',
  },
  items: [
    { id: 'home', label: 'Home', href: '#/' },
    { id: 'editor', label: 'New Article', href: '#/editor' },
    { id: 'settings', label: 'Settings', href: '#/settings' },
  ],
  model: model.navbarModel,
  dispatch: (navMsg) => dispatch({ type: 'NAVBAR_MSG', msg: navMsg }),
})}
```

---

### 4. Form Renderer Examples (`Field` & `Input`)

All form renderers are stateless views designed for drop-in use with `@rinn7e/tea-cup-form` or standard React forms:

```tsx
import { Field, Input, Textarea } from '@rinn7e/realworld-design-system'

// Controlled Input Field with Icon & Error Helper
{Field.view({
  label: 'Email Address',
  helpText: 'We will never share your email.',
  children: Input.view({
    type: 'email',
    value: model.email,
    placeholder: 'Email',
    onChange: (val) => dispatch({ type: 'EMAIL_CHANGED', value: val }),
  }),
})}

// Textarea Field
{Field.view({
  label: 'Article Body',
  children: Textarea.view({
    value: model.body,
    rows: 8,
    placeholder: 'Write your article (in markdown)...',
    onChange: (val) => dispatch({ type: 'BODY_CHANGED', value: val }),
  }),
})}
```

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
- **Pattern**: Pure, controlled presentation views invoked directly via function calls (e.g. `{Button.view({...})}`, `{Navbar.view({...})}`). State is held in the caller application's `Model`.
- **File Layout**:
  - `lib/<category>/<component-name>/type.ts`: Props interface and variant types.
  - `lib/<category>/<component-name>/view.tsx`: Functional React view component returning explicit `: React.ReactElement`.
  - `lib/<category>/<component-name>/index.ts`: Public module exports (`export { view } from './view'`).

#### B. Complex TEA Sub-Components (`type.ts` + `update.ts` + `component.tsx`)
- **Applies to**: Interactive components with stateful workflows (`Dropdown`, `Modal`, `Navbar`, `Pagination`, `Panel`, `Tabs`, `Menu`).
- **Pattern**: Pure Elm Architecture (TEA) sub-components providing explicit `Model`, `Msg`, `init`, `update`, and `view` functions.
- **File Layout**:
  - `lib/components/<name>/type.ts`: Sub-component `Model` and `Msg` definitions.
  - `lib/components/<name>/update.ts`: Reducer `update(msg)(model)` returning `[Model, Cmd<Msg>]`.
  - `lib/components/<name>/component.tsx`: Sub-component view function.
  - `lib/components/<name>/index.ts`: Barrel export.

---

### 3. Font & Asset Management Strategy

To ensure optimal performance and minimal package bundle sizes, `@rinn7e/realworld-design-system` **does not bundle binary font files** (`.woff2`, `.ttf`) inside the library package. Instead:

- **Library Tokens**: The library defines CSS font theme tokens (`--font-titillium: "Titillium Web", sans-serif`).
- **Caller Responsibility**: The consuming application (the caller) is responsible for loading the font files (e.g., via Google Fonts CDN or local font loaders) in its `<head>` or main stylesheet.

---

## 🛠️ Development & Script Guide

### Showcase Documentation Web App
Launch the interactive `react-tea-cup` documentation website showcasing all components on port `5175` with live **Canvas** previews and **Code Snippets**:

```bash
# From root of frontend-design-system
pnpm run showcase:dev

# Or directly in the showcase app directory
cd app/showcase-app
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
