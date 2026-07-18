# End-to-End Testing

The project includes a standalone E2E test suite based on Playwright. These tests are generic and can be run against any RealWorld implementation.

## Running tests locally

1.  Navigate to the `e2e` directory:
    ```bash
    cd e2e
    ```
2.  Install dependencies (first time only):
    ```bash
    npm install
    ```
3.  Install Playwright browsers:
    ```bash
    npx playwright install chromium
    ```
4.  Run tests against your local frontend:
    ```bash
    BASE_URL=http://localhost:5173 npm run test:e2e
    ```

> [!TIP]
> The directory contains an `.envrc` file. If you use [direnv](https://direnv.net/), the `BASE_URL` and `JWT_SECRET` will be loaded automatically, and you can just run `npm run test:e2e`.

To run tests in interactive mode:

```bash
BASE_URL=http://localhost:5173 npm run test:e2e:ui
```

## Running tests against a remote API

You can run the tests against any RealWorld-compliant API (e.g., the official endpoint) by setting the `VITE_API_BASE` environment variable. This will automatically point both the frontend and the tests to the remote API, and skip starting the local backend.

```bash
VITE_API_BASE=https://api.realworld.show/api npx playwright test
```

To run in UI mode:

```bash
VITE_API_BASE=https://api.realworld.show/api npx playwright test --ui
```

## Cheatsheet

- run 1 test and output error in terminal

```
npx playwright test -g "should favorite an article" --reporter=line
```

- agent may nto able to access envrc, so

```
BASE_URL=http://localhost:5173 npx playwright test -g "should favorite an article" --reporter=line
```
