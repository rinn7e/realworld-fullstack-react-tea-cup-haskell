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

To run the application locally, you must clone **both** this application repository and its sibling library package repository (`tea-cup-package`) as sibling directories under the same parent folder.

#### 1. Clone Sibling Repositories

Ensure your local directory layout is structured as siblings:

```text
parent-directory/
├── realworld-fullstack-react-tea-cup-haskell/  <-- This repository
└── tea-cup-package/                           <-- Sibling library repository
```

Clone the sibling package repository if you haven't already:

```bash
git clone https://github.com/rinn7e/tea-cup-package.git
```

#### 2. Build the Shared Libraries

Before running the application, build the shared `tea-cup-package` libraries first:

```bash
cd tea-cup-package
pnpm install
pnpm build
cd ../realworld-fullstack-react-tea-cup-haskell/frontend-admin
```

#### 3. Install Admin Dependencies

1. Go to the `frontend-admin` directory.
2. Install dependencies:
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
