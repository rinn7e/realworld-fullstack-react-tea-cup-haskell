import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'

export type Theme = {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  primaryColorDarkMode: string
  secondaryColorDarkMode: string
  headerFont: string
  normalFont: string
}

// Themes are static presets, so the id identifies one
export const ThemeEq: EqClass.Eq<Theme> = EqClass.contramap((t: Theme) => t.id)(
  S.Eq,
)

export type ColorScheme = 'light' | 'dark' | 'auto'

export const ALL_COLOR_SCHEMES: ColorScheme[] = ['light', 'dark', 'auto']
