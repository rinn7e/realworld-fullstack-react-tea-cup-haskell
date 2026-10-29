# Sentinel Dashboard

## Tech Stack

- [**react 19.x**](https://github.com/facebook/react): UI Library
- [**react-tea-cup 5.x**](https://github.com/vankeisb/react-tea-cup): State Management (The Elm Architecture)
- [**typescript 5.x**](https://github.com/microsoft/TypeScript): Language
- [**fp-ts 2.x**](https://github.com/gcanti/fp-ts): Functional programming primitives
- [**io-ts 2.x**](https://github.com/gcanti/io-ts): Runtime validation / Decoding
- [**vite 7.x**](https://github.com/vitejs/vite): Build tool & Dev server
- [**tailwindcss 4.x**](https://github.com/tailwindlabs/tailwindcss): Styling

## How to Run

### Installation & Setup

1. Install dependencies from the monorepo root (or package folder):
   ```bash
   pnpm install
   ```

### Development

To start the development server locally:

```bash
pnpm dev
```

### Production Build

To build the application for production deployment (e.g. to GitHub Pages):

```bash
VITE_BASE_URL=/sentinel-dashboard/ pnpm build
```

### Debugging Without the URL

`VITE_DISABLE_URL=true pnpm dev` runs the app on in-app navigation alone: it boots on the home screen, ignores the browser back and forward, and never writes the URL (see "Navigation and the URL" in [the code convention](doc/code-convention.md)).

### Quality Assurance & Validation

| Command               | Description                                          |
| --------------------- | ---------------------------------------------------- |
| `pnpm lint`           | Run ESLint check with zero warnings/errors tolerance |
| `pnpm typecheck`      | Run strict TypeScript compiler type checking         |
| `pnpm check:watch`    | Run TypeScript type checking in watch mode           |
| `pnpm check-circular` | Run circular dependency analysis with `madge`        |
| `pnpm preview`        | Preview the compiled production build locally        |

---

## License

MIT
