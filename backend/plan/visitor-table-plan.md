# Implementation Plan - Visitor Tracking System

This plan outlines the steps to implement a visitor tracking system that uses browser fingerprinting and IP addresses to identify unique visitors and link them to user accounts upon login.

## Proposed Changes

### 1. Database Layer (Haskell)

#### [MODIFY] [DB/Schema/Type.hs](file:///home/rinne/projects/my-package/my-realworld/haskell-servant-realworld/backend/src/DB/Schema/Type.hs)
Add the `Visitor` entity to store unique visitor information.

```haskell
Visitor
    browserFingerprint Text
    userId UserId Maybe
    ipAddress Text
    userAgent Text Maybe
    visitCount Int
    lastVisitAt UTCTime
    UniqueBrowserFingerprint browserFingerprint
    deriving Show Generic
```

### 2. Logic Layer (Haskell)

#### [NEW] `src/Visitor.hs`
Implement the logic for calculating the fingerprint and managing visitor records.

- **`calculateFingerprint`**: A function that takes `IPAddress`, `UserAgent`, and other browser traits to generate a SHA256 hash.
- **`recordVisit`**: An effectful function to upsert the `Visitor` record and increment `visitCount`.

### 3. API Layer (Haskell)

#### [MODIFY] `src/App.hs` (or Middleware)
Integrate the visit recording logic into the request pipeline.

- Extract headers (`X-Forwarded-For`, `User-Agent`).
- Run `recordVisit` on each request (or via a background task).
- Update the `userId` in the `Visitor` record upon successful login/signup.

### 4. Admin Dashboard (TypeScript)

#### [NEW] [visitor.ts](file:///home/rinne/projects/my-package/my-realworld/tea-cup-realworld-admin/src/common/api/type/visitor.ts)
Define the TypeScript types for the `Visitor` entity.

#### [MODIFY] [mock.ts](file:///home/rinne/projects/my-package/my-realworld/tea-cup-realworld-admin/src/common/api/type/mock.ts)
Add 50+ mock visitors for testing the dashboard.

#### [NEW] `src/page/visitors/`
Create a new admin page to display the visitor table.

## Calculation Details

| Field | Source / Logic |
| :--- | :--- |
| `ipAddress` | `X-Forwarded-For` or `remoteHost` |
| `userAgent` | `User-Agent` header |
| `browserFingerprint` | `hash(ipAddress + userAgent + screenResolution + ...)` |
| `visitCount` | Incremented on each new session or periodic activity |
| `userId` | Linked via JWT claim after authentication |

## Verification Plan

### Automated Tests
- Test fingerprint generation with different IP/UA combinations.
- Verify `visitCount` incrementing correctly.
- Verify `userId` linking after login.

### Manual Verification
- View the new "Visitors" table in the admin dashboard and confirm mock data displays correctly.
- Check that the fingerprint changes when switching networks (IP change).
