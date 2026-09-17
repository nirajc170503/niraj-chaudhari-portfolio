import { useTheme } from '../theme/themeContext.js'

/**
 * Toggle between the light and dark palettes. Sits in the header beside the
 * résumé action so it is reachable from every page.
 */
export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center border border-rule-strong text-ink-2 transition-colors hover:border-navy hover:text-navy"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="h-[1.05rem] w-[1.05rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isDark ? (
          <>
            <circle cx="10" cy="10" r="3.5" />
            <path d="M10 1.7v1.9M10 16.4v1.9M1.7 10h1.9M16.4 10h1.9M4.2 4.2l1.35 1.35M14.45 14.45l1.35 1.35M15.8 4.2l-1.35 1.35M5.55 14.45L4.2 15.8" />
          </>
        ) : (
          <path d="M16.3 12.2A7 7 0 0 1 7.8 3.7a7.3 7.3 0 1 0 8.5 8.5Z" />
        )}
      </svg>
    </button>
  )
}
