# Sentinel Dashboard CLI

The Sentinel Dashboard in the terminal. It runs on the same core as the web dashboard ([`frontend-admin-core`](../frontend-admin-core)): the same API, the same Model, Msg and update of every screen, the same navigation and guard. Only the views are its own, written with [Ink](https://github.com/vadimdemedes/ink) (React for the terminal, also used by Claude Code and Gemini CLI) and run by [react-tea-cup](https://github.com/vankeisb/react-tea-cup)'s `Program`.

## Tech Stack

- [**ink 8.x**](https://github.com/vadimdemedes/ink): React renderer for the terminal
- [**react-tea-cup 5.x**](https://github.com/vankeisb/react-tea-cup): The Elm Architecture
- [**frontend-admin-core**](../frontend-admin-core): the Model, Msg, update and API shared with the web
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

The folders mirror frontend-admin, minus what the core holds:

| frontend-admin                                                         | cli-admin                                               |
| ---------------------------------------------------------------------- | ------------------------------------------------------- |
| `src/type.ts`, `src/update.ts` (core model, theme, persona panel, URL) | `src/type.ts`, `src/update.ts` (core model, `isTyping`) |
| `src/root.tsx` (`setPlatform(webPlatform)`)                            | `src/main.tsx` (`setPlatform(cliPlatform)`)             |
| `src/platform.ts` (`localStorage`)                                     | `src/platform.ts` (a token file)                        |
| `src/app.tsx` (sidebar)                                                | `src/app.tsx` (tabs and the app keys)                   |
| `src/screen/<x>-screen/component.tsx`                                  | `src/screen/<x>-screen/component.tsx`                   |
| `src/component/search-bar`, `list-state`, `pagination-nav`             | the same, with Ink                                      |
| table and overlay of each screen                                       | `src/component/list-view`, `table`, `detail-panel`      |
| URL (`withUrl`)                                                        | none: the terminal boots on the overview                |

## Terminal notes

- **Text fields own the keys.** While the search or the login form has the keys, the app keys are off. That is `Model.isTyping`, set by `SetTyping` and cleared by every move.
- **The cursor is view state.** The highlighted row is local state of the list view (like the focus of a page). The item opened is app state (`selectedUser` of the core and the like).
- **Long lists scroll.** A table shows the rows the terminal has room for, around the cursor (`useWindowSize`).
- **No page to scroll.** tea-cup-pagination scrolls the page to the top after each fetch (`window.scrollTo`). `src/main.tsx` gives it a `window` and a `document` that do nothing.
- **The build bundles the fp libraries.** The core imports `fp-ts/lib/Option` without an extension, which Node ESM cannot resolve, so `tsup.config.ts` bundles fp-ts, io-ts, remote-data-ts and the tea-cup packages.

## Commands

| Command               | Description                            |
| --------------------- | -------------------------------------- |
| `pnpm check`          | Type check                             |
| `pnpm lint`           | ESLint                                 |
| `pnpm check-circular` | Circular dependency check with `madge` |
| `pnpm test`           | Unit tests (Vitest)                    |

## License

MIT
