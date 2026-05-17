# E2E Testing Philosophy: The Developer's Blueprint

This document defines the high-level engineering principles and technical patterns used to build a resilient, portable, and maintainable E2E testing infrastructure.

---

## 1. Architectural Core: The "Three Pillars"

For an E2E suite to be valuable to developers (rather than a burden), it must satisfy three requirements:

1.  **Determinism (Stability)**: If a test fails, it must be because of a bug, never because of a race condition or a slow network.
2.  **Portability (Flexibility)**: The exact same test suite must be able to run against a local `localhost` dev server, a shared `staging` environment, or a live `production` cluster.
3.  **Observability (Debuggability)**: When a test fails in a headless CI environment, a developer should be able to reconstruct the exact state of the application without guessing.

---

## 2. Layered Infrastructure

Our suite is built in four distinct layers to separate "Business Intent" from "Implementation Detail":

| Layer | Location | Purpose |
| :--- | :--- | :--- |
| **Specs** | `e2e/test/*.spec.ts` | Pure business logic. Written in "Human Readable" code. |
| **Action Helpers** | `e2e/test/helpers/*.ts` | Orchestrates UI interactions. Hides selectors and timing logic. |
| **API Helpers** | `e2e/test/helpers/api.ts` | Rapidly creates state (users, articles) bypassing the UI. |
| **Debug Interface** | `window.__conduit_debug__` | Exposes internal app state to Playwright for deep verification. |

---

## 3. Engineering Patterns (Deep Dive)

### Pattern A: Hybrid State Setup (The "API Shortcut")
**Philosophy**: Only test the UI that is the direct subject of your test. Use the API for everything else.

*   **Implementation**: [e2e/test/helpers/api.ts](e2e/test/helpers/api.ts)
*   **The Problem**: To test "Deleting a Comment," you first need to Login, Create an Article, and Post a Comment. Doing all of this via the UI is slow and increases the surface area for random failures.
*   **The Solution**: Use `request.post()` to setup the state in the background, then navigate directly to the page you want to test.
*   **Code Reference**:
    ```typescript
    // In e2e/test/social.spec.ts
    test('should delete a comment', async ({ page, request }) => {
      // 1. Setup state via API (Fast)
      const token = await loginUserViaAPI(request, user.email, user.password);
      const slug = await createArticleViaAPI(request, token, articleData);
      
      // 2. Test the specific UI behavior (Thorough)
      await page.goto(`/article/${slug}`);
      await deleteComment(page, commentId);
    });
    ```

### Pattern B: Standardized Observability (The Debug Contract)
**Philosophy**: Don't guess if the app is ready; ask the app.

*   **Implementation**: [e2e/test/helpers/debug.ts](e2e/test/helpers/debug.ts)
*   **The Pattern**: The application exposes a global `window.__conduit_debug__` object. This allows Playwright to read "invisible" state like JWT tokens or internal Auth status.
*   **Technical Benefit**: It eliminates "sleep" timers. Instead of `waitForTimeout(1000)`, we use `waitForFunction` to wait for a specific internal state change.
*   **Implementation Guide**:
    ```typescript
    // In the Frontend (tea-cup logic)
    window.__conduit_debug__ = {
      getAuthState: () => model.authStatus,
      getToken: () => model.session?.token
    };
    ```

### Pattern C: Non-Deterministic Data (Parallel Safety)
**Philosophy**: Every test run is a fresh start in a parallel universe.

*   **Implementation**: [e2e/test/helpers/setup.ts](e2e/test/helpers/setup.ts)
*   **The Pattern**: Never use hardcoded strings like `testuser1`. Always append a timestamp or UUID.
*   **Why**: This allows 10 different CI runners to hit the same backend simultaneously without "User already exists" errors.
    ```typescript
    export const generateUniqueUser = () => ({
      username: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    });
    ```

### Pattern D: Network-Bound Synchronization
**Philosophy**: UI consistency follows Network settlement.

*   **Implementation**: [e2e/test/helpers/network.ts](e2e/test/helpers/network.ts)
*   **The Challenge**: In frameworks with **Optimistic UI** (like TEA/Elm or React Query), the button might look clicked *before* the server has actually responded.
*   **The Solution**: Wrap critical actions in a helper that waits for `networkidle`.
    ```typescript
    export async function performActionAndWaitForResponse(page: Page, action: () => Promise<void>) {
      await action();
      // Wait for all inflight requests (POST/PUT) to settle
      await page.waitForLoadState('networkidle');
    }
    ```

### Pattern E: The Selector Contract (SELECTORS.md)
**Philosophy**: Selectors are an API. Treat them as a Breaking Change.

*   **Implementation**: [e2e/test/SELECTORS.md](e2e/test/SELECTORS.md)
*   **The Pattern**: A dedicated Markdown file documenting every CSS class used by the tests.
*   **Technical Benefit**: Developers can refactor HTML structure freely, as long as they preserve the "Contract Classes" defined in this file. It turns "Magic Strings" into a documented interface.

---

### Pattern F: Config Inheritance
**Philosophy**: Standardize the infrastructure, specialize the implementation.

*   **Implementation**: [e2e/test/playwright.base.ts](e2e/test/playwright.base.ts)
*   **The Pattern**: Define `baseConfig` in a shared location. Specific project repositories (React, Angular, Elm) then import and extend this base.
*   **Technical Benefit**: Ensures consistent timeouts, retry logic, and browser versions across the entire company ecosystem.

### Pattern G: Environmental Agnosticism
**Philosophy**: Use the same test binaries for dev and prod.

*   **Implementation**: [e2e/playwright.config.ts](e2e/playwright.config.ts)
*   **The Pattern**: Detect if `VITE_API_BASE` points to a known production URL. If not, auto-spawn a local backend using Playwright's `webServer` utility.
*   **Code Reference**:
    ```typescript
    const isRemoteApi = process.env.VITE_API_BASE?.includes('api.realworld.show');
    
    export default defineConfig({
      webServer: !isRemoteApi ? [{
        command: 'make run',
        url: 'http://localhost:3000/api/tags',
        cwd: '../../backend'
      }] : []
    });
    ```

### Pattern H: Stateless Teardown (Just-in-Time Cleanup)
**Philosophy**: Cleanup is for the beginning of a test, not the end.

*   **Pattern**: We do **not** run "Teardown" scripts to delete data after a test.
*   **Why**: 
    1.  If a test crashes, you want the data to stay there so you can manually inspect it.
    2.  If the CI runner dies, the cleanup script never runs anyway.
*   **Solution**: By using unique names (Pattern C), we don't care if old data exists. If we need a clean state, we just generate a new user.

### Pattern I: Browser Context Isolation
**Philosophy**: Zero side-effects between tests.

*   **Pattern**: Playwright runs every test in a fresh **Browser Context** (like a private window).
*   **Technical Benefit**: Cookies, LocalStorage, and IndexedDB are wiped automatically between every `test()` block. You never have to manually "Log out" as part of a test cleanup.

### Pattern J: Atomic Assertions
**Philosophy**: One test, one behavior, clear blame.

*   **Pattern**: Avoid giant "End-to-End" flows that test 10 things in a row. 
*   **The Goal**: If "Article Favoriting" fails, the test name should be `should favorite an article`, not `user should login, post, and favorite`.
*   **Benefit**: Faster debugging. You know exactly what part of the system is broken without looking at logs.

### Pattern K: Failure Observability (Trace Viewer)
**Philosophy**: Logs are not enough.

*   **Implementation**: `reporter: 'html'` + `trace: 'on-first-retry'`.
*   **The Pattern**: In CI, Playwright records a `.zip` trace of every failure. This includes a full video, every network request, every console log, and a snapshot of the DOM at every microsecond.

---

## 4. Porting Guide: How to Apply this to Your Project

If you are starting a new repository and want to apply this philosophy, follow these steps:

### Step 1: Define the "Internal Contract"
Expose `window.__conduit_debug__` in your frontend. This is the single most important step for reducing flakiness.

### Step 2: Establish the Helper Layer
Don't write a single test until you have `helpers/auth.ts` and `helpers/network.ts`. Force your team to use them.

### Step 3: Implement Unique Seeding
Ensure your `setup.ts` has a robust randomization engine. Avoid hardcoded strings at all costs.

### Step 4: Configure the "Local-First" CI
Ensure your `playwright.config.ts` can auto-spawn your backend. This makes it trivial for new developers to run tests on their first day.

---

## 5. Troubleshooting & Debugging

*   **Local Debugging**: Run `npx playwright test --ui`. Use the "Pick Selector" tool to verify your helpers.
*   **CI Failures**: Download the `playwright-report` artifact from GitHub Actions and run `npx playwright show-report`.
*   **Race Conditions**: If a test is flaking, check if you are using `performActionAndWaitForResponse`. Usually, the issue is an optimistic UI update that finished before the network.
