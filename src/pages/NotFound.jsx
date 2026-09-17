import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="shell py-24 md:py-32">
      <p className="kicker mb-4 text-navy">404</p>
      <h1 className="max-w-2xl font-display text-[clamp(1.75rem,5vw,2.75rem)] leading-tight tracking-[-0.025em] text-ink">
        That page isn&rsquo;t here.
      </h1>
      <p className="prose-note mt-4 max-w-xl">
        The link may be out of date. Everything on this site is reachable from the home page.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 border border-inverse bg-inverse px-5 py-3 font-mono text-[0.6875rem] tracking-[0.12em] text-on-inverse uppercase transition-colors hover:border-navy hover:bg-navy hover:text-paper"
      >
        Back to home →
      </Link>
    </div>
  )
}
