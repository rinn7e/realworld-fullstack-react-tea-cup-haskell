# Implementation Plan: Connect API to Users Page

I have designed a plan to connect the users page to the admin users API using Servant routing definitions and pagination matching the Articles page pattern.

## Proposed Changes

### Frontend changes

#### [NEW] [helper.tsx](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-admin/src/page/users/helper.tsx)
- Create `mkPaginationConfig` for users.
- Implement prefix search helper `getSearchParams` and `parsePrefix` to parse search tokens:
  - `username:value` -> `{ username: value }`
  - `@value` -> `{ username: value }`
  - `email:value` -> `{ email: value }`
  - Defaults to `{ username: value }` when no prefix is matched.
- Render states: pending/loading (spinner), error loading, empty state (no users found), and users list table.
- Render columns: ID, Avatar, Username, Email, Bio, and Role.
- Dispatch `SelectUser` when a row is clicked.

#### [MODIFY] [type.ts](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-admin/src/page/users/type.ts)
- Replace mock `users: User[]` in the `Model` with `pagination: Pagination.Model<AdminUser, HttpError<ApiError>>`.
- Change `selectedUser` type from `User` to `AdminUser`.
- Extend page messages (`Msg`) to include:
  - `ClearSelected`
  - `PaginationMsg`
- Define `GET_USERS_LIMIT = 50`.
- Update `ModelEq` to use `Pagination.mkModelEq` with `AdminUserEq`.
- Add `shared: Shared` to component `Props` and update `PropsEq`.

#### [MODIFY] [update.ts](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-admin/src/page/users/update.ts)
- Update `init` signature to accept `shared: Shared`.
- Initialize `pagination` in `init` using remote-data pending, current page `1`, and then invoke `Pagination.init` with the pagination configuration helper.
- Curry `update` signature to accept `shared: Shared`.
- Handle `ClearSelected`, `SearchBarMsg`, and `PaginationMsg` cases.
- Implement sub-handlers:
  - `searchBarMsgHandler`: Reset pagination and reload users on Submit, ChangeSort, or ChangeDirection.
  - `paginationMsgHandler`: Update pagination model state.
  - `paginationItemMsgHandler`: Select user when row click message is intercepted.

#### [MODIFY] [component.tsx](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-admin/src/page/users/component.tsx)
- Import `PaginationMemo` and use it inside `UsersPageComponent` instead of the static mock table.
- Define table headers including a `Role` column.
- Pass `shared` and list of sort options (`username`, `email`, `id`) to `SearchBarMemo`.

#### [MODIFY] [user-detail-overlay.tsx](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-admin/src/page/users/sub-component/user-detail-overlay.tsx)
- Change `selectedUser` property type to `O.Option<AdminUser>`.
- Add detail row for `Role` (displaying `user.role`).
- // TODO: Add a TODO highlighting that "Member since" and "Total Articles" are hardcoded mock data not returned by the API.

#### [MODIFY] [app.tsx](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-admin/src/app.tsx)
- Pass `shared={model.shared}` when rendering `UsersPageMemo`.

#### [MODIFY] [update.ts](file:///home/rinne/projects/my-package/realworld-fullstack-react-tea-cup-haskell/frontend-admin/src/update.ts)
- Pass `shared` when initializing and updating `UsersPage` page model.

---

## Verification Plan

### Automated Tests
- Verify frontend compilation: `pnpm check` inside `frontend-admin`.
- Verify linting: `pnpm run lint` inside `frontend-admin`.
