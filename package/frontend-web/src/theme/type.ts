export type ColorScheme = 'light' | 'dark' | 'auto'

export const ALL_COLOR_SCHEMES: ColorScheme[] = ['light', 'dark', 'auto']

export const formatColorSchemeLabel = (scheme: ColorScheme): string => {
  switch (scheme) {
    case 'light':
      return 'Light'
    case 'dark':
      return 'Dark'
    case 'auto':
      return 'System'
  }
}
