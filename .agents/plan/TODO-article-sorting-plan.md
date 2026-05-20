# Implementation Plan: API-Level Sorting for Articles

I have designed a plan to add sort and direction parameters to the admin articles API and refactor the Articles page pagination logic.

## Proposed Changes

### Backend changes

#### [MODIFY] [Type.hs](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/backend/src/Infrastructure/Api/Route/Article/Admin/Type.hs)
- Add `QueryParam "sort" D.Sort` and `QueryParam "direction" D.Direction` to the `getArticles` Servant route definition.

#### [MODIFY] [Controller.hs](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/backend/src/Infrastructure/Api/Route/Article/Admin/Controller.hs)
- Update `getArticlesHandler` to accept `Maybe D.Sort` and `Maybe D.Direction` and pass them to `listAdminArticles`.

#### [MODIFY] [ArticleDB.hs](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/backend/src/Capability/Database/ArticleDB.hs)
- Update `ListAdminArticles` capability constructor and `listAdminArticles` helper function signatures to accept `Maybe D.Sort` and `Maybe D.Direction`.

#### [MODIFY] [ArticleDB.hs](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/backend/src/Infrastructure/Interpreter/Real/DB/ArticleDB.hs)
- Pass sort and direction parameters from `listAdminArticlesHandler` through to `Q.listAdminArticles`.

#### [MODIFY] [Article.hs](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/backend/src/Infrastructure/Interpreter/Real/DB/Query/Article.hs)
- Update `listAdminArticles` and `listAdminArticlesSQL` signatures to accept sort/direction and pass them down.
- Update `filterAdminArticlesIdsSQL` signature and query body to dynamically apply ordering:
  - `"title"` -> `ArticleTitle`
  - `"id"` -> `ArticleId`
  - `"favoritesCount"` -> order by the favorites count subexpression
  - `"createdAt"` / default -> `ArticleCreatedAt`

#### [MODIFY] [ArticleDB.hs](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/backend/src/Infrastructure/Interpreter/Stub/DB/ArticleDB.hs)
- Update stub implementation to support dynamic sorting by title, id, favoritesCount, and createdAt attributes matching sort and direction.

---

### Frontend changes

#### [MODIFY] [article.ts](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-admin/src/common/api/handler/article.ts)
- Extend `getAdminArticles` parameters to accept `sort?: string` and `direction?: string`.
- Append these parameters to `URLSearchParams`.

#### [MODIFY] [helper.tsx](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-admin/src/page/articles/helper.tsx)
- Pass `sort: model.searchBar.sort.attr` and `direction: model.searchBar.sort.direction` into `getAdminArticles`.
- Remove the client-side `.sort(...)` mapping logic from the response parser.

---

## Verification Plan

### Automated Tests
- Build backend to ensure changes compile: `make build` inside `backend`.
- Build frontend to ensure type checks and packaging works: `npm run build` inside `frontend-admin`.
