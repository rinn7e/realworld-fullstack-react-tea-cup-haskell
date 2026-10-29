import type * as Core from '@core/type'

// The model of the core (the screen shown and the session) with the
// terminal's own field: whether a text field has the keys (the search or
// the login form), so the app's own keys (`1`-`6`, `q`) stay off
export type Model = Core.Model & {
  readonly isTyping: boolean
}

// The messages of the core with the terminal's own: the boot (`Init`) and
// the text field taking or giving back the keys
export type Msg =
  | Core.Msg
  | { readonly _tag: 'Init'; readonly boot: Core.Boot }
  | { readonly _tag: 'SetTyping'; readonly isTyping: boolean }
