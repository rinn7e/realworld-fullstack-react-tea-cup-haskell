# RealWorld FullStack Monorepo

A type-safe implementation of the RealWorld spec, featuring a Haskell Servant backend and React frontends using the Elm Architecture (TEA).

## Project Structure

*   [**backend/**](backend) - Haskell Servant Conduit API with Postgres, Persistent, and Esqueleto.
*   [**frontend-web/**](frontend-web) - React 19 web application built with TypeScript, react-tea-cup, and Tailwind CSS 4.
*   [**frontend-admin/**](frontend-admin) - Sentinel Dashboard for system management and cache control.
*   [**e2e/**](e2e) - Standalone black-box integration tests using Playwright (only tests frontend-web).

## Getting Started

Refer to the individual directory README files for setup and execution commands:

*   [backend/README.md](backend/README.md)
*   [frontend-web/README.md](frontend-web/README.md)
*   [frontend-admin/README.md](frontend-admin/README.md)
*   [e2e/README.md](e2e/README.md)

## License

This project is licensed under the MIT License.
