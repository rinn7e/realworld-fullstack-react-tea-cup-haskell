# Caching Strategy: Dynamic ETags with On-Demand Invalidation

This document outlines the architecture for treating API responses like a static CDN, serving fast cached data, and invalidating it dynamically on-demand.

---

## 🎯 Goal
To implement a lightweight ETag validation mechanism for read-heavy GET API routes (such as `/api/articles` and `/api/tags`) to allow browsers and edge proxies to cache responses. This prevents database queries and JSON serialization overhead, returning a lightweight `304 Not Modified` response (0ms database load) when the cache is valid.

The cache is invalidated instantly whenever a mutation occurs (creates, updates, deletes, favorites).

---

## 🛠️ Architecture

### 1. Storage Choice for Cache Versions

Depending on scale, we can choose between:

*   **Choice 1: Simple In-Memory TVar (For Single Machine)**
    *   **Mechanism**: Uses a thread-safe Haskell `TVar (Map Text Int)` in the server's global environment.
    *   **Performance**: Fastest possible (0ms latency, no network/DB calls).
    *   **Trade-off**: If running multiple instances in the cloud, each machine holds its own state. Invalidation on instance A won't immediately update instance B.

*   **Choice 2: Database-Backed Cache Versions (For Multi-Machine HA)**
    *   **Mechanism**: Stores version numbers in a small, highly-indexed PostgreSQL table (`cache_version`).
    *   **Performance**: Extremely fast (<1ms simple primary key index lookups).
    *   **Benefit**: Globally consistent across all instances in the cloud.

---

### 2. Request Lifecycle (WAI Middleware)

We implement this caching logic using a custom **WAI Middleware** that intercepts requests before they reach the Servant routing logic:

```
[ Client Request ]
       │
       ▼
┌───────────────────────────────┐
│     Cache WAI Middleware      │
│  - Inspects GET request       │
│  - Reads "If-None-Match"      │
│  - Checks current Version     │
└──────────────┬────────────────┘
               │
       ┌───────┴───────┐
  No Match          Match (Valid Cache)
       │               │
       ▼               ▼
┌──────────────┐ ┌──────────────┐
│ Servant / DB │ │  Immediate   │
│ 200 OK + ETag│ │    304 Not   │
│              │ │   Modified   │
└──────────────┘ └──────────────┘
```

#### Middleware Logic
1.  Intercept incoming `GET` requests to specific cached paths (e.g., `/api/articles` and `/api/tags`).
2.  Lookup the `If-None-Match` header in the request.
3.  Compare it against the current version counter of the resource (e.g. `articles-v1` from memory or database).
4.  **If they match**: Intercept the request and return `304 Not Modified` with an empty body immediately.
5.  **If they don't match**: Pass the request to the Servant handlers. When the handler returns `200 OK`, append these headers to the response before sending it to the client:
    *   `Cache-Control: no-cache`
    *   `ETag: "[resource]-version-[count]"`

---

### 3. Invalidation Flow

Mutating requests (POST, PUT, DELETE) trigger invalidation. Invalidation simply increments the integer counter in the cache store:

```haskell
invalidateCache :: Text -> App ()
```

We call this function in mutating controller endpoints:
*   **Articles Controller** (Create, Update, Delete, Favorite, Unfavorite) -> Increments `"articles"` version.
*   **Comments Controller** (Create, Delete comments) -> Increments `"articles"` version (since comments are nested).
*   **Tags Controller** -> Increments `"tags"` version.

---

## 🧪 Verification Plan

1.  **Request ETag**:
    ```bash
    curl -I http://localhost:3000/api/articles
    ```
    *Expected*: Returns `200 OK` with an `ETag` header (e.g. `ETag: "articles-v1"`).

2.  **Verify Cache (304)**:
    ```bash
    curl -I -H 'If-None-Match: "articles-v1"' http://localhost:3000/api/articles
    ```
    *Expected*: Returns `304 Not Modified` instantly with no body.

3.  **Invalidate & Rebuild**:
    *   Create or edit an article.
    *   Send the request again with the old ETag:
    ```bash
    curl -I -H 'If-None-Match: "articles-v1"' http://localhost:3000/api/articles
    ```
    *Expected*: Returns `200 OK` with the new data and a new ETag header (e.g. `ETag: "articles-v2"`).
