import { useTheme } from '../../theme/themeContext.js'

/**
 * Chart palettes. Charts are drawn with SVG and cannot inherit CSS variables,
 * so the same semantic names are mapped per theme and read through
 * `useChartColors()`.
 */
export const chartPalettes = {
  light: {
    navy: '#0f2b46',
    navySoft: '#8fa6bd',
    forest: '#2c6349',
    ochre: '#7f5c20',
    clay: '#9a3b2f',
    ink: '#16181a',
    ink3: '#6b6a63',
    rule: '#ddd6c6',
    ruleStrong: '#c9c0ac',
    paper: '#faf7f0',
  },
  dark: {
    navy: '#8aacd0',
    navySoft: '#5d7691',
    forest: '#83bd9b',
    ochre: '#d5ac66',
    clay: '#dd8f82',
    ink: '#f1efe9',
    ink3: '#94928b',
    rule: '#2c2f35',
    ruleStrong: '#41454d',
    paper: '#17181b',
  },
}

export function useChartColors() {
  const { isDark } = useTheme()
  return isDark ? chartPalettes.dark : chartPalettes.light
}

/**
 * Heatmap cell treatment for the sensitivity grids, on a single low-to-high
 * scale. Tuned separately per theme so the text stays legible on every cell.
 */
export function heatTone(isDark, t) {
  if (isDark) {
    if (t < 0.18) return { bg: 'rgba(221,143,130,0.20)', fg: '#f3c9c1' }
    if (t < 0.38) return { bg: 'rgba(213,172,102,0.18)', fg: '#e8cd9c' }
    if (t < 0.62) return { bg: 'rgba(138,172,208,0.14)', fg: '#c8dcf0' }
    if (t < 0.82) return { bg: 'rgba(131,189,155,0.18)', fg: '#b6dfc6' }
    return { bg: 'rgba(131,189,155,0.30)', fg: '#cdebd8' }
  }
  if (t < 0.18) return { bg: 'rgba(154,59,47,0.16)', fg: '#7c2d22' }
  if (t < 0.38) return { bg: 'rgba(138,101,36,0.14)', fg: '#6d4f1c' }
  if (t < 0.62) return { bg: 'rgba(15,43,70,0.09)', fg: '#0f2b46' }
  if (t < 0.82) return { bg: 'rgba(44,99,73,0.14)', fg: '#22513b' }
  return { bg: 'rgba(44,99,73,0.24)', fg: '#1b4230' }
}

/** X-axis labels, thinned on narrow screens so they never collide. */
export function pickLabels(labels, availableWidth, minGap = 44) {
  const max = Math.max(2, Math.floor(availableWidth / minGap))
  if (labels.length <= max) return labels
  const step = Math.ceil(labels.length / max)
  return labels.map((label, i) => (i % step === 0 ? label : ''))
}
