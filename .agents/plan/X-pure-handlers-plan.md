# Plan: Refactor API Handlers for Strict Purity

## Goal
To achieve strict compiler-enforced purity for all API controllers in the application. Currently, handlers are bound to the concrete `App` monad, which explicitly includes the `IOE` effect, rendering them theoretically impure. We will refactor these handlers to be polymorphic over the effect stack (`Eff es`), only requesting the precise capabilities they require.

## Rationale
- **True Purity:** By abstracting away the concrete `App` type, the compiler can guarantee that a handler only performs the effects specified in its constraints.
- **Improved Testability:** Handlers can be tested using mock effect environments without any risk of accidental IO operations.
- **Explicit Dependencies:** The type signature of each handler will clearly document exactly which capabilities (e.g., `ArticleDB`, `UserDB`, `Error ServerError`) it relies on.

## Execution Steps

### Phase 1: Establish the Pattern (Proof of Concept)
1. **Target a Route:** Select a representative controller, such as `Infrastructure.Api.Route.Article.Admin.Controller`.
2. **Refactor Handlers:**
   - Change the return type of `getArticlesHandler` from `App Api.AdminArticleListResponse` to `Eff es Api.AdminArticleListResponse`.
   - Add the necessary constraints to the signature: `(ArticleDB :> es, Error S.ServerError :> es) => ...`
   - Apply the same transformation to other handlers in the module (e.g., `deleteAdminArticleHandler`, adding `LoggerDB :> es` and `Time :> es`).
3. **Refactor the Route Assembler:**
   - The route assembly function (`adminArticleRoute`) must also become polymorphic:
     ```haskell
     adminArticleRoute
       :: (ArticleDB :> es, LoggerDB :> es, Time :> es, Error S.ServerError :> es)
       => S.AuthResult DB.UserId -> S.ServerT (NamedRoutes AdminArticleRoute) (Eff es)
     ```
4. **Verify Compilation:** Compile the project. The main server initialization in `RunServer.hs` or the top-level route assembler may need slight adjustments if it expects a concrete `App`, though `App` is just an alias for a specific `Eff` stack. Ensure everything resolves correctly.

### Phase 2: Systematic Rollout
Apply the pattern established in Phase 1 across all API route modules systematically:
1. `Infrastructure.Api.Route.Article.Web.Controller`
2. `Infrastructure.Api.Route.Auth.Admin.Controller`
3. `Infrastructure.Api.Route.Auth.Web.Controller`
4. `Infrastructure.Api.Route.Comment.Admin.Controller`
5. `Infrastructure.Api.Route.Comment.Web.Controller`
6. `Infrastructure.Api.Route.Dashboard.Admin.Controller`
7. `Infrastructure.Api.Route.Tag.Web.Controller`
8. `Infrastructure.Api.Route.User.Admin.Controller`
9. `Infrastructure.Api.Route.User.Web.Controller`
10. `Infrastructure.Api.Route.Metadata.Web.Controller`

### Phase 3: Cleanup and Verification
1. **Review Constraints:** Ensure no handler requests `IOE :> es` unless it legitimately requires bare IO (which should ideally be abstracted into a new capability).
2. **Run Tests:** Execute the full test suite (`make test`) to guarantee no regressions in routing or behavior.
3. **Linting:** Ensure the new signatures comply with team standards (e.g., removing unused imports after changing `App` references).

## Example Transformation

**Before (Impure):**
```haskell
getArticlesHandler
  :: S.AuthResult DB.UserId
  -> Maybe D.Limit
  -> ...
  -> App Api.AdminArticleListResponse
getArticlesHandler auth mLimit ... = do
  -- ... logic using listAdminArticles ...
```

**After (Pure):**
```haskell
getArticlesHandler
  :: (ArticleDB :> es, Error S.ServerError :> es)
  => S.AuthResult DB.UserId
  -> Maybe D.Limit
  -> ...
  -> Eff es Api.AdminArticleListResponse
getArticlesHandler auth mLimit ... = do
  -- ... same logic using listAdminArticles ...
```
