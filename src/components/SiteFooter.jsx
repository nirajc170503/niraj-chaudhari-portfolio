import { profile } from '../content/profile'

/**
 * Closing line. Shares the inverse surface with the contact block above it so
 * the two read as one deliberate ending.
 */
export default function SiteFooter() {
  return (
    <footer className="no-print border-t border-on-inverse/12 bg-inverse">
      {/* Extra bottom room on phones so the floating back-to-top control never
          covers the closing line. */}
      <div className="shell pt-5 pb-24 text-center sm:pb-5">
        <p className="font-mono text-xs tracking-[0.12em] text-on-inverse/60 uppercase">
          © {new Date().getFullYear()} {profile.name}, {profile.location}
        </p>
      </div>
    </footer>
  )
}
