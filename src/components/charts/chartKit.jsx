import { useChartColors } from './chartTokens'

/**
 * Chart chrome shared by every figure: the caption block and the hairline grid.
 */

export function Figure({ title, subtitle, children, note, source }) {
  return (
    <figure className="rule-t mt-8 pt-5">
      <figcaption className="mb-4">
        <p className="kicker mb-1.5 text-navy">{title}</p>
        {subtitle ? (
          <p className="max-w-2xl text-[0.8125rem] leading-relaxed text-ink-3">{subtitle}</p>
        ) : null}
      </figcaption>
      {children}
      {note ? <p className="mt-3 text-[0.75rem] leading-relaxed text-ink-3">{note}</p> : null}
      {source ? (
        <p className="mt-2 font-mono text-xs tracking-wide text-ink-3">{source}</p>
      ) : null}
    </figure>
  )
}

export function GridLines({ yTicks, plotLeft, plotWidth, yScale }) {
  const c = useChartColors()

  return (
    <g aria-hidden="true">
      {yTicks.map((tick) => {
        const y = yScale(tick)
        return (
          <line
            key={tick}
            x1={plotLeft}
            x2={plotLeft + plotWidth}
            y1={y}
            y2={y}
            stroke={c.rule}
            strokeWidth="1"
          />
        )
      })}
    </g>
  )
}
