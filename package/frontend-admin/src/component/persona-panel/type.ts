import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher } from 'tea-cup-fp'

import { type ColorScheme, type Theme, ThemeEq } from '@/theme/type'

export type Persona = {
  id: string
  name: string
  // Label on the persona selection button
  shortName: string
  bio: string
  portraitUrl: string
  dialogue: string
  actions: {
    clearCache: string
    screenshot: string
    debug: string
    back: string
  }
}

export type Model = {
  isCollapse: boolean
  showDetails: boolean
  currentPersona: Persona
  hoveredAction: keyof Persona['actions'] | null
}

export const PersonaEq = EqClass.struct<Persona>({
  id: S.Eq,
  name: S.Eq,
  shortName: S.Eq,
  bio: S.Eq,
  portraitUrl: S.Eq,
  dialogue: S.Eq,
  actions: EqClass.struct({
    clearCache: S.Eq,
    screenshot: S.Eq,
    debug: S.Eq,
    back: S.Eq,
  }),
})

export const ModelEq = EqClass.struct<Model>({
  isCollapse: B.Eq,
  showDetails: B.Eq,
  currentPersona: PersonaEq,
  hoveredAction: EqClass.fromEquals((a, b) => a === b),
})

export type Msg =
  | { _tag: 'ToggleCollapse' }
  | { _tag: 'ToggleDetails' }
  | { _tag: 'SwitchPersona'; persona: Persona }
  | { _tag: 'SetHoveredAction'; action: keyof Persona['actions'] | null }
  | { _tag: 'NoOp' }

export type Props = {
  model: Model
  theme: Theme
  colorScheme: ColorScheme
  dispatch: Dispatcher<Msg>
  onSwitchTheme: (theme: Theme) => void
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  theme: ThemeEq,
  colorScheme: S.Eq,
  dispatch: EqAlways,
  onSwitchTheme: EqAlways,
})
