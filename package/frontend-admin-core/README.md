# Sentinel Dashboard Core

The part of the Sentinel Dashboard that does not depend on where it runs: the API, the types, and the Model, Msg, init and update of every screen and of the app itself (navigation, the guard, login and logout). Two apps run on it:

| App      | Package                                       | Views                        |
| -------- | --------------------------------------------- | ---------------------------- |
| Web      | [`package/frontend-admin`](../frontend-admin) | React DOM and Tailwind       |
| Terminal | [`package/cli-admin`](../cli-admin)           | Ink (React for the terminal) |

Both apps import the same `@core/...` modules, so a fix in an update, a decoder or the navigation lands in both. Each app only adds its views and the few things that depend on its platform.

## What is here and what is not

Here (TypeScript only, no view, no DOM):

- `src/common/api/`: the endpoints (`handler/`) and the io-ts decoders (`type/`).
- `src/common/type/`: the session (`shared.ts`), the user, the destinations and the screens.
- `src/common/cache/`: the session token, as Cmds (`saveTokenCmd`, `removeTokenCmd`).
- `src/component/`: the logic of the shared components (the search bar, the page numbers of the pagination, the error text of a list).
- `src/screen/<x>-screen/`: `type.ts`, `update.ts`, `index.ts`, and `util.ts` (the pagination config and the search syntax).
- `src/handler/navigation-handler.ts`, `src/util/guard.ts`, `src/util/destination.ts`: every move of the app, and the guard in front of it.
- `src/type.ts`, `src/update.ts`: the shared part of the app model and its update.

Not here, in each app:

- The views (`component.tsx`, `sub-component/`).
- How the destination is shown: the web writes it to the URL (`withUrl`), the terminal shows tabs.
- Anything else of one platform: the theme and the persona panel of the web, the text field focus of the terminal.

## How an app runs on the core

1. At startup, before its program starts, the app calls `setPlatform` (`src/platform.ts`) with where the API is and where the token is kept: `localStorage` for the web, a file for the terminal. This is the only state of the core.
2. Its model is the core model with its own fields: `Core.Model & { ... }`. Its messages are the core messages with its own: `Core.Msg | ...`.
3. It boots with `Core.initializeCmd` (asks the server who the stored token belongs to) and `Core.init(boot, destination)`, with its own boot destination (the URL for the web, the overview for the terminal).
4. Its `update` handles its own messages and hands every other one to `Core.update`. `Core.update` is generic over the app model: the fields of the app come back as they went in.

```ts
// package/cli-admin/src/update.ts
export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'SetTyping':
      return [{ ...model, isTyping: msg.isTyping }, Cmd.none()]
    default:
      return Core.update(msg, model)
  }
}
```

A screen view gets its model from the core and dispatches the core messages of that screen. The list screens build their pagination from the core config (`mkPaginationConfig`), whose renderers are empty: each app adds its own.

## Imports

- Inside the core, and in the apps, the core is imported through the `@core/*` alias. Each app maps it in its `tsconfig.json` to `../frontend-admin-core/src/*`, and lists the package as a `workspace:*` dependency.
- The core never imports an app (it has no `@/` alias).

## Conventions

The core follows the [code conventions of frontend-admin](../frontend-admin/doc/code-convention.md). Its lint config keeps the move makers (`guardDestination`, `currentScreenModelOfMove`) to the navigation, the boot and the tests, as frontend-admin did.

## Commands

| Command               | Description                            |
| --------------------- | -------------------------------------- |
| `pnpm check`          | Type check                             |
| `pnpm lint`           | ESLint                                 |
| `pnpm check-circular` | Circular dependency check with `madge` |
| `pnpm test`           | Unit tests (Vitest)                    |

## License

MIT
