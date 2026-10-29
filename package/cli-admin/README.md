# Sentinel Dashboard CLI

The Sentinel Dashboard in the terminal, a port of [frontend-admin](../frontend-admin) like the [iOS](../mobile-admin-ios) and [Android](../mobile-admin-android) apps. Its API, types, and the Model, Msg and update of every screen, the navigation and the guard are a copy of the ones of frontend-admin (a change to one is made to the other by hand). Its views are its own, written with [Ink](https://github.com/vadimdemedes/ink) (React for the terminal, also used by Claude Code and Gemini CLI) and run by the `Program` of [react-tea-cup](https://github.com/vankeisb/react-tea-cup).

## Tech Stack

- [**ink 8.x**](https://github.com/vadimdemedes/ink): React renderer for the terminal
- [**react-tea-cup 5.x**](https://github.com/vankeisb/react-tea-cup): The Elm Architecture
- [**tsx**](https://github.com/privatenumber/tsx) to run the source, [**tsup**](https://github.com/egoist/tsup) to bundle it

## How to Run

Start the backend first (see the root README), then from this folder:

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs the source. To build one file and run it with Node:

```bash
pnpm build
pnpm start
```

The build is `dist/main.js`, with the `sentinel-admin` bin of `package.json`.

### Environment

| Variable              | Default                          | Description                                             |
| --------------------- | -------------------------------- | ------------------------------------------------------- |
| `SENTINEL_API_BASE`   | `http://localhost:3000/api`      | The API                                                 |
| `SENTINEL_TOKEN_FILE` | `~/.config/sentinel-admin/token` | Where the session token is kept between runs (mode 600) |

## Keys

| Where                  | Keys                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| Everywhere (signed in) | `1`-`6` open a screen, `tab` / `shift+tab` the next or previous one, `r` refresh, `q` quit                      |
| Login                  | `tab` next field, `enter` sign in, `ctrl+c` quit                                                                |
| Lists                  | `j`/`k` or arrows move, `enter` open, `esc` close, `h`/`l` or `[`/`]` page, `/` search, `s` sort, `d` direction |
| Overview               | `j`/`k` move in the logs, `enter` open, `f` time range of the chart                                             |
| Settings               | `o` log out                                                                                                     |

## From frontend-admin to cli-admin

The folders mirror frontend-admin. The logic files are the same, with `@/` imports:

- `src/common/api/`, `src/common/type/`: the endpoints, decoders and types.
- `src/screen/<x>-screen/`: `type.ts`, `update.ts`, `index.ts`, `util.ts`.
- `src/component/search-bar/`, `list-state/util.ts`, `pagination-nav/util.ts`.
- `src/handler/navigation-handler.ts`, `src/util/guard.ts`, `src/util/destination.ts`.

What differs:

| frontend-admin                                                    | cli-admin                                                                           |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `src/type.ts`, `src/update.ts` (theme, persona panel, URL)        | `src/type.ts`, `src/update.ts` (`isTyping`, boots on the overview)                  |
| `src/common/cache` (`localStorage`)                               | `src/common/cache` (a token file), saved and removed by Cmds                        |
| `src/common/env.ts` (`VITE_*`)                                    | `src/common/env.ts` (`SENTINEL_*`)                                                  |
| `src/root.tsx`, `src/app.tsx` (sidebar)                           | `src/main.tsx`, `src/app.tsx` (tabs and the app keys)                               |
| `src/screen/<x>-screen/component.tsx`, `util.tsx` (the renderers) | `src/screen/<x>-screen/component.tsx`, with `src/component/list-view` for the lists |
| `src/component/search-bar`, `list-state`, `pagination-nav` views  | the same, with Ink, and `table`, `detail-panel`                                     |
| URL (`withUrl`)                                                   | none                                                                                |

## Terminal notes

- **Text fields own the keys.** While the search or the login form has the keys, the app keys are off. That is `Model.isTyping`, set by `SetTyping` and cleared by every move.
- **The cursor is view state.** The highlighted row is local state of the list view (like the focus of a page). The item opened is app state (`selectedUser` and the like).
- **Long lists scroll.** A table shows the rows the terminal has room for, around the cursor (`useWindowSize`).
- **No page to scroll.** tea-cup-pagination scrolls the page to the top after each fetch (`window.scrollTo`). `src/main.tsx` gives it a `window` and a `document` that do nothing.
- **The build bundles the fp libraries.** The app imports `fp-ts/lib/Option` without an extension, which Node ESM cannot resolve, so `tsup.config.ts` bundles fp-ts, io-ts, remote-data-ts and the tea-cup packages.

## Commands

| Command               | Description                            |
| --------------------- | -------------------------------------- |
| `pnpm check`          | Type check                             |
| `pnpm lint`           | ESLint                                 |
| `pnpm check-circular` | Circular dependency check with `madge` |
| `pnpm test`           | Unit tests (Vitest)                    |

## License

MIT
