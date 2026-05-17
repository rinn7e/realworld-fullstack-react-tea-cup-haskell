# CI/CD/CT/CM Concepts and Terminology

This document breaks down the full lifecycle of a professional web application: **Continuous Integration (CI)**, **Continuous Deployment (CD)**, **Continuous Testing (CT)**, and **Continuous Monitoring (CM)**.

## Core Concepts

### 1. CI (Continuous Integration)
The practice of automatically integrating code changes from multiple contributors into a single project.
*   **Example**: Merging code into `master` after basic linting and build checks pass.

### 2. CD (Continuous Deployment / Delivery)
The practice of automatically deploying code to a production environment.
*   **Example in this repo**: `deploy.yml`. It builds the frontend and publishes it to GitHub Pages.

### 3. CT (Continuous Testing)
The practice of executing automated tests at every stage of the pipeline to obtain immediate feedback on business risk.
*   **Example in this repo**: `e2e.yml`. It runs a full battery of functional tests against a real backend to ensure the app actually *works* before or after a deployment.

### 4. CM (Continuous Monitoring)
The practice of monitoring the health, performance, and errors of the application after it is live.
*   **Example (Planned)**: Integrating Sentry to catch JavaScript crashes that happen on users' browsers in real-time.

---

## Terminology Breakdown

| Term | Description | Example in this Project |
| :--- | :--- | :--- |
| **Workflow / Pipeline** | The entire automated process defined in a YAML file. | `e2e.yml`, `deploy.yml` |
| **Trigger / Event** | The specific action that starts the process. | `on: push` (Auto) or `workflow_dispatch` (Manual) |
| **Job / Step** | The individual tasks (Install, Build, Test, Deploy). | `npx playwright test`, `npm run build` |
| **Test Suite** | A collection of tests designed to verify a specific behavior. | **CT Concept** (Playwright tests) |
| **Regression Testing** | Re-running tests to ensure that new changes haven't broken existing features. | **CT Concept** |
| **Artifact** | Files generated during the process (Reports, Bundles). | `playwright-report`, `dist` folder |
| **Environment** | The target destination for the code (Staging, Production). | `github-pages` |

---

## TODO: Professional Roadmap (CI/CD/CT/CM)

### 1. PR Validation [CI/CT]
*   **What**: Automatically run Linting and E2E tests on every Pull Request.
*   **Why**: Prevent broken code from ever reaching the `master` branch.

### 2. Preview Environments [CI/CD/CT]
*   **What**: Deploy a version of the app for every PR and run a subset of tests against it.
*   **Why**: Functional verification in a production-like environment before merge.

### 3. Smoke Testing [CT]
*   **What**: A small set of critical tests run immediately after a production deployment.
*   **Why**: To ensure the core features (Login, Post Article) still work in the live environment.

### 4. Error Monitoring [CM]
*   **What**: Integrate a tool like Sentry.
*   **Why**: Catch crashes that automated tests might have missed.

### 5. Synthetic Monitoring [CT/CM]
*   **What**: Running E2E tests against the production site on a schedule (e.g., every hour).
*   **Why**: To proactively find issues even when no code has changed (e.g., API downtime).
