import { type Theme } from './type'

export const themes: Record<string, Theme> = {
  modernBlue: {
    id: 'modernBlue',
    name: 'Modern Blue',
    primaryColor: '#2563eb', // blue-600
    secondaryColor: '#0f172a', // slate-900
    primaryColorDarkMode: '#2563eb', // blue-400
    secondaryColorDarkMode: '#0f172a', // slate-800 (lighter than light-mode secondary)
    // primaryColorDarkMode: '#60a5fa', // blue-400
    // secondaryColorDarkMode: '#1e293b', // slate-800 (lighter than light-mode secondary)
    headerFont: "'Inter', sans-serif",
    normalFont: "'Inter', sans-serif",
  },
  midnightPurple: {
    id: 'midnightPurple',
    name: 'Midnight Purple',
    primaryColor: '#7c3aed', // violet-600
    secondaryColor: '#020617', // slate-950
    primaryColorDarkMode: '#7c3aed', // violet-400
    secondaryColorDarkMode: '#020617', // slate-900 (lighter than light-mode secondary)
    // primaryColorDarkMode: '#a78bfa', // violet-400
    // secondaryColorDarkMode: '#0f172a', // slate-900 (lighter than light-mode secondary)
    headerFont: "'Outfit', sans-serif",
    normalFont: "'Inter', sans-serif",
  },
  emeraldForest: {
    id: 'emeraldForest',
    name: 'Emerald Forest',
    primaryColor: '#059669', // emerald-600
    secondaryColor: '#064e3b', // emerald-950
    primaryColorDarkMode: '#059669', // emerald-400
    secondaryColorDarkMode: '#064e3b', // emerald-900 (lighter than light-mode secondary)
    // primaryColorDarkMode: '#34d399', // emerald-400
    // secondaryColorDarkMode: '#065f46', // emerald-900 (lighter than light-mode secondary)
    headerFont: "'JetBrains Mono', monospace",
    normalFont: "'JetBrains Mono', monospace",
  },
}

export const defaultTheme = themes.modernBlue
