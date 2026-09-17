import { createContext, useContext } from 'react'

export const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggle: () => {},
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}
