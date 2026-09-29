import { Component } from 'react'

/**
 * Catches render errors anywhere below it and shows a readable page instead of
 * an empty one.
 *
 * This matters more than it usually would. The root element ships with a
 * static shell, and React clears it on the first commit. A throw during render
 * therefore wipes the shell and leaves nothing behind, which is the one case
 * the shell cannot cover on its own.
 *
 * It is a class because React still has no hook equivalent for
 * `componentDidCatch`.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Without a reporting endpoint this is the only trace that exists, so it
    // is worth keeping during development.
    if (import.meta.env.DEV) {
      console.error('Unhandled render error', error, info)
    }
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="shell py-24 md:py-32">
        <p className="kicker mb-4 text-clay">Something broke</p>
        <h1 className="max-w-2xl font-display text-[clamp(1.75rem,5vw,2.75rem)] leading-tight tracking-[-0.025em] text-ink">
          This page failed to render.
        </h1>
        <p className="prose-note mt-4 max-w-xl">
          That is a bug on this site rather than anything you did. The rest of the portfolio is
          still reachable, and reloading usually clears it.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center border border-inverse bg-inverse px-5 py-3 font-mono text-xs tracking-[0.12em] text-on-inverse uppercase transition-colors hover:border-navy hover:bg-navy hover:text-paper"
          >
            Reload
          </button>
          <a
            href={import.meta.env.BASE_URL}
            className="inline-flex items-center px-1 py-1 font-mono text-xs tracking-[0.12em] text-ink-2 uppercase underline-offset-4 transition-colors hover:text-navy hover:underline hover:decoration-1"
          >
            Back to home
          </a>
        </div>

        {import.meta.env.DEV ? (
          <pre className="mt-10 max-w-2xl overflow-x-auto border border-rule bg-paper-2 p-4 font-mono text-[0.75rem] leading-relaxed text-clay">
            {String(error?.stack ?? error)}
          </pre>
        ) : null}
      </div>
    )
  }
}
