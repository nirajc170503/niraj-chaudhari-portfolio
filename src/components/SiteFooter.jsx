import { profile } from '../content/profile'

/** Deliberately minimal: the name, and one line of context. */
export default function SiteFooter() {
  return (
    <footer className="no-print border-t border-rule bg-paper">
      <div className="shell flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono text-[0.75rem] tracking-[0.08em] text-ink uppercase">
          {profile.name}
        </p>
        <p className="text-[0.75rem] text-ink-3">
          Figures shown are the output of academic and self-directed models.
        </p>
      </div>
    </footer>
  )
}
