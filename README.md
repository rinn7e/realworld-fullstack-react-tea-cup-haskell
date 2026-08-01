# RealWorld FullStack Monorepo

A type-safe implementation of the RealWorld spec, featuring a Haskell Servant backend and React frontends using the Elm Architecture (TEA).

## Project Structure

*   [**package/backend/**](package/backend) - Haskell Servant Conduit API with Postgres, Persistent, and Esqueleto.
*   [**package/frontend-web/**](package/frontend-web) - React 19 web application built with TypeScript, react-tea-cup, and Tailwind CSS 4.
*   [**package/frontend-admin/**](package/frontend-admin) - Sentinel Dashboard for system management and cache control.
*   [**package/frontend-design-system/**](package/frontend-design-system) - Bulma-inspired design system library built with Tailwind CSS and react-tea-cup.
*   [**package/todo-app/**](package/todo-app) - Todo application sample.
*   [**e2e/**](e2e) - Standalone black-box integration tests using Playwright (only tests frontend-web).

## Getting Started

Refer to the individual directory README files for setup and execution commands:

*   [package/backend/README.md](package/backend/README.md)
*   [package/frontend-web/README.md](package/frontend-web/README.md)
*   [package/frontend-admin/README.md](package/frontend-admin/README.md)
*   [package/frontend-design-system/README.md](package/frontend-design-system/README.md)
*   [e2e/README.md](e2e/README.md)

## License

This project is licensed under the MIT License.
