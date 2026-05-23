# Implementation Plan - Add Visitor Tracking to Frontend Web

This plan details how we will implement automatic visitor tracking. We will create a backend endpoint for logging page views and integrate it into the React TEA frontend application so that every routing transition and tab selection is tracked properly.

## User Review Required

> [!IMPORTANT]
> The backend tracking endpoint will automatically extract the visitor's IP address, User-Agent, and current time from the request context and log the logged-in `userId` if the request is authenticated with a JWT token. The frontend only needs to send the page path (e.g. `/`, `/login`, etc.).

---

## Proposed Changes

### Backend Component

#### [MODIFY] [DTO/Visitor.hs](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/backend/src/Infrastructure/Api/DTO/Visitor.hs)
- Define `TrackVisitorRequest` request body containing the page `path`.
- Add `FromJSON` and `ToSchema` instances for validation and OpenAPI/Swagger documentation.

#### [NEW] [Visitor/Web/Type.hs](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/backend/src/Infrastructure/Api/Route/Visitor/Web/Type.hs)
- Define `VisitorWebRoute` containing `POST /api/visitors` endpoint.

#### [NEW] [Visitor/Web/Controller.hs](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/backend/src/Infrastructure/Api/Route/Visitor/Web/Controller.hs)
- Implement `webVisitorRoute` controller handler.
- Extract `IP` (from `X-Forwarded-For`/`X-Real-IP` or `remoteHost`) and `User-Agent` from WAI `Request`.
- Extract `userId` from auth result if present.
- Log record to database using `insertVisitor` capability.

#### [MODIFY] [Type.hs](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/backend/src/Type.hs)
- Add `visitors :: mode :- NamedRoutes VisitorWebRoute` to `AppRoute` web API.

#### [MODIFY] [RunServer.hs](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/backend/src/RunServer.hs)
- Mount `webVisitorRoute` inside `runWebServer`.

---

### Frontend Component

#### [NEW] [api/type/visitor.ts](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-web/src/common/api/type/visitor.ts)
- Define TypeScript types and `io-ts` schema for `TrackVisitorRequest`.

#### [MODIFY] [api/type/index.ts](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-web/src/common/api/type/index.ts)
- Export visitor type.

#### [NEW] [api/handler/visitor.ts](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-web/src/common/api/handler/visitor.ts)
- Implement `trackVisitor` API client function using `fetchToTaskEither` and optional JWT auth header.

#### [MODIFY] [api/handler/index.ts](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-web/src/common/api/handler/index.ts)
- Export visitor handler.

#### [MODIFY] [update.ts](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-web/src/update.ts)
- Define `trackVisitorCmd` which invokes `trackVisitor` as a fire-and-forget command mapping to `NoOp`.
- Modify `navigate` and `changeRouteNoReload` to batch `trackVisitorCmd(token, route)` on every page transition.

---

## Verification Plan

### Automated Tests
- Run `pnpm run typecheck` in `frontend-web` to ensure typescript safety.
- Run `make test` or `cabal test` in `backend` to verify compilation and unit tests.

### Manual Verification
- Run backend and frontend-web servers.
- Navigate to various pages (Home, Article, Login, Settings, Profile).
- Query visitor database or check admin logs dashboard to verify that visitor events are correctly saved with path, ip, user agent, timestamp, and optional user ID.
