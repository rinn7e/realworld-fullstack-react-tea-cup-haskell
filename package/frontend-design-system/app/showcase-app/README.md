# `@rinn7e/realworld-design-system-showcase`

Interactive showcase application for the Conduit RealWorld Design System library, built with React 19, Tailwind CSS v4, and `react-tea-cup`.

## Features

- **Component Gallery**: Interactive documentation and live canvas previews for all elements, components, forms, and layouts.
- **Code Snippets**: Copy-pasteable TEA view code examples for each design system component.
- **Pure Tailwind CSS v4**: Consumes `@plugin '@rinn7e/realworld-design-system/plugin'` directives.

## Getting Started

### Development Server

Run the development server on port `5175`:

```bash
pnpm run dev
```

### Debugging Without the URL

`VITE_DISABLE_URL=true pnpm run dev` runs the app on in-app navigation alone: it boots on the home screen, ignores the browser back and forward, and never writes the URL (see "Navigation and the URL" in [the code convention](../../doc/code-convention.md)).

### Build

Compile for production:

```bash
pnpm run build
```

### Code Quality

Run formatting, type checking, circular dependency scan, and linting:

```bash
pnpm run staged
```
