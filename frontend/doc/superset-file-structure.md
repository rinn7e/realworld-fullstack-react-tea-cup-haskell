# Frontend File Structure

Overall file structure of the frontend directory.

```yaml
frontend/
├── dist/                # Production build output
├── doc/                 # Documentation
├── e2e/                 # Playwright end-to-end tests
├── public/              # Static assets
├── scripts/             # Build and utility scripts
├── src/                 # Main source code
│   ├── asset/           # Icons, images, and global styles
│   │   ├── fonts/
│   │   ├── icon/
│   │   ├── image/
│   │   └── style.css
│   ├── common/          # Common utilities and constants
│   │   ├── api/         # API client and endpoints
│   │   │   ├── handler/ # API fetch implementations
│   │   │   │   ├── account.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── bundle.ts
│   │   │   │   ├── fetcher.ts
│   │   │   │   └── [feature].ts
│   │   │   ├── type/    # API request/response types
│   │   │   │   ├── error.ts
│   │   │   │   ├── pagination.ts
│   │   │   │   └── [feature].ts
│   │   │   └── index.ts
│   │   ├── cache/       # Caching logic
│   │   │   ├── db/      # Database abstraction
│   │   │   ├── idb/     # IndexedDB logic
│   │   │   └── local-storage/
│   │   ├── global-context/ # React Contexts for global state
│   │   │   ├── db-context.ts
│   │   │   ├── route-context.ts
│   │   │   ├── network-status-context.ts
│   │   │   └── [feature]-context.ts
│   │   ├── hook/        # Shared React hooks
│   │   │   ├── use-keyboard.ts
│   │   │   ├── use-scroll.ts
│   │   │   ├── use-responsive.ts
│   │   │   └── use-[name].ts
│   │   ├── provider/    # Context providers (e.g., fetcher-status)
│   │   ├── util/        # Shared utility functions
│   │   │   ├── date.ts
│   │   │   ├── route.ts
│   │   │   ├── string.ts
│   │   │   └── [category].ts
│   │   └── type/        # Common type definitions
│   │       ├── bundle.tsx
│   │       ├── sse.ts
│   │       ├── msg.ts
│   │       └── [category].ts
│   ├── component/       # Shared UI components
│   │   ├── [component-name]/
│   │   │   ├── component.tsx
│   │   │   ├── type.ts
│   │   │   ├── update.ts    # (Optional) For stateful components
│   │   │   ├── handler.ts   # (Optional) Event handlers
│   │   │   ├── sub-component/ # Feature-specific sub-components
│   │   │   ├── common/      # Feature-specific utilities/constants
│   │   │   └── style.css    # (Optional) Component styles
│   ├── entry/           # Specific entry points (Separate mini-apps)
│   │   ├── login/
│   │   │   ├── app.tsx
│   │   │   ├── program.tsx
│   │   │   ├── root.tsx
│   │   │   ├── type.tsx
│   │   │   └── update.ts
│   │   └── signup/
│   │       ├── app.tsx
│   │       ├── program.tsx
│   │       ├── root.tsx
│   │       ├── type.tsx
│   │       └── update.ts
│   ├── generated/       # Generated code (e.g., from backend types)
│   ├── handler/         # Event handlers and side-effect logic
│   │   ├── global-event-handler.ts
│   │   ├── route-handler.ts
│   │   └── sse-handler.ts
│   ├── package/         # Internal library-like modules
│   │   ├── tea-cup-prelude/
│   │   └── [package-name]/
│   ├── page/            # Application pages
│   │   ├── [page-name]/
│   │   │   ├── component.tsx
│   │   │   ├── type.ts
│   │   │   ├── update.ts
│   │   │   ├── handler/     # Page-specific event handlers
│   │   │   ├── sub-component/ # Page-specific sub-components
│   │   │   └── common/      # Page-specific utilities/constants
│   ├── process/         # Business logic processes
│   │   ├── register-sw/
│   │   └── sse/
│   ├── worker/          # Web Workers
│   ├── util/            # Utilities NOT for use in components or pages
│   ├── app.tsx          # Main App component
│   ├── program.tsx      # TEA (The Elm Architecture) program setup
│   ├── root.tsx         # Application root entry point
│   ├── type.ts          # Global type definitions
│   └── update.ts        # Main TEA update function
├── test/                # Unit and component tests
├── index.html           # Main entry HTML
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```
