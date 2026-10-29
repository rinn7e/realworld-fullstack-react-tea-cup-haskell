import type * as Core from '@core/type'

import type * as Persona from '@/component/persona-panel'

import { type ColorScheme, type Theme } from './theme/type'

// The model of the core (the screen shown and the session) with the web's
// own fields
export type Model = Core.Model & {
  readonly persona: Persona.Model
  readonly showScrollTop: boolean
  readonly theme: Theme
  readonly colorScheme: ColorScheme
}

// The messages of the core with the web's own: the boot (`Init`, from the
// page's URL and the core's `Boot`) and the panels and theme of the page
export type Msg =
  | Core.Msg
  | {
      readonly _tag: 'Init'
      readonly location: Location
      readonly boot: Core.Boot
    }
  | { readonly _tag: 'PersonaMsg'; readonly subMsg: Persona.Msg }
  | { readonly _tag: 'SetShowScrollTop'; readonly value: boolean }
  | { readonly _tag: 'ScrollToTop' }
  | { readonly _tag: 'SwitchTheme'; readonly theme: Theme }
  | { readonly _tag: 'SetColorScheme'; readonly scheme: ColorScheme }
