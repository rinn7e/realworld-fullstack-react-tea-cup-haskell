# RealWorld example app in `react-tea-cup`

[![Deploy to GitHub Pages](https://github.com/rinn7e/tea-cup-realworld/actions/workflows/deploy.yml/badge.svg)](https://github.com/rinn7e/tea-cup-realworld/actions/workflows/deploy.yml)

### [Demo](https://rinn7e.github.io/tea-cup-realworld)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

A functional, type-safe implementation of the RealWorld Medium.com clone spec built using **react-tea-cup** following **The Elm Architecture (TEA)**.

## Tech Stack

- [**react 19.x**](https://github.com/facebook/react): UI Library
- [**react-tea-cup 5.x**](https://github.com/vankeisb/react-tea-cup): State Management (The Elm Architecture)
- [**typescript 5.x**](https://github.com/microsoft/TypeScript): Language
- [**fp-ts 2.x**](https://github.com/gcanti/fp-ts): Functional programming primitives
- [**io-ts 2.x**](https://github.com/gcanti/io-ts): Runtime validation / Decoding
- [**vite 7.x**](https://github.com/vitejs/vite): Build tool & Dev server
- [**tailwindcss 4.x**](https://github.com/tailwindlabs/tailwindcss): Styling

## How to start locally

To run the application with a local API server:

1.  Clone the repository.
2.  Go to the `frontend-web` directory:
    ```bash
    cd frontend-web
    ```
3.  Install dependencies:
    ```bash
    pnpm install
    ```
4.  Ensure you have a local [RealWorld backend](https://github.com/gothinkster/realworld) running (usually on `http://localhost:3000/api`).
5.  Run the development server:
    ```bash
    pnpm dev
    ```

## How to start using official API server

To run the application using the official RealWorld API server:

```bash
cd frontend-web
pnpm dev --mode production
```

This will use the base URL: `https://api.realworld.show/api`.

## Available Scripts

> [!NOTE]
> All scripts should be run from the `frontend-web/` directory.

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start the development server         |
| `pnpm build`        | Build the application for production |
| `pnpm preview`      | Preview the production build locally |
| `pnpm lint`         | Lint the codebase                    |
| `pnpm typecheck`    | Run TypeScript type checking         |
| `pnpm check:watch`  | Run Type checking in watch mode     |

Check the [e2e/README.md](e2e/README.md) for instructions on how to run the E2E tests locally and [testing-philosophy.md](testing-philosophy.md) for the core principles behind our testing strategy.

## CI/CD/CT/CM

Check [ci-cd-ct-cm.md](ci-cd-ct-cm.md) for a detailed breakdown of automated pipeline terminology and an example roadmap for professional delivery.

## Product Analytics

Check [product-analytic.md](product-analytic.md) for an example roadmap on analyzing user behavior and business metrics in a professional web app.

## API Spec

The application implements the [RealWorld API spec](https://github.com/realworld-apps/realworld/tree/main/specs/api).

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

MIT
