import useMeasure from '../../hooks/useMeasure'
import { bridge, market } from '../../content/vblModel'
import { useChartColors } from './chartTokens'

const bars = [
  { label: 'Perpetuity growth', value: bridge.valuePerSharePerpetuity, tone: 'navySoft', note: 'g = 5.75%' },
  { label: 'Average of methods', value: bridge.valuePerShareAverage, tone: 'navy', note: 'The headline output' },
  { label: 'Exit multiple', value: bridge.valuePerShareExit, tone: 'navySoft', note: '16x EV/EBITDA' },
  { label: 'Market price', value: market.price, tone: 'clay', note: '₹430.20 on 23 Aug 2026' },
]

/** Bar treatments, resolved against the active theme palette. */
function fillsFor(c) {
  return {
    navy: c.navy,
    navySoft: 'none',
    clay: c.clay,
  }
}

/**
 * The single most useful visual in the Varun Beverages case study: what the
 * model values the equity at, against what the market was paying.
 */
export default function ValuePerShareChart() {
  const [ref, width] = useMeasure()
  const c = useChartColors()
  const toneFill = fillsFor(c)
  const isNarrow = width < 560
  const height = isNarrow ? 210 : 240
  const pad = { top: 34, right: 12, bottom: 46, left: isNarrow ? 40 : 56 }
  const plotWidth = Math.max(0, width - pad.left - pad.right)
  const plotHeight = Math.max(0, height - pad.top - pad.bottom)

  const max = 460
  const ticks = [0, 100, 200, 300, 400]
  const band = plotWidth / bars.length
  const barWidth = Math.min(isNarrow ? 46 : 64, band * 0.52)

  const y = (v) => pad.top + plotHeight - (v / max) * plotHeight

  return (
    <div ref={ref}>
      {width > 0 ? (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="Value per share in rupees: 243.96 using the perpetuity growth method, 268.34 as the average of both methods, 292.72 using the exit multiple method, against a market price of 430.20 rupees."
        >
          <g aria-hidden="true">
            {ticks.map((t) => (
              <line
                key={t}
                x1={pad.left}
                x2={pad.left + plotWidth}
                y1={y(t)}
                y2={y(t)}
                stroke={t === 0 ? c.ruleStrong : c.rule}
                strokeWidth="1"
              />
            ))}
          </g>

          {bars.map((bar, i) => {
            const cx = pad.left + band * i + band / 2
            const barTop = y(bar.value)
            const isMarket = bar.tone === 'clay'
            const isEmphasis = bar.tone === 'navy' || isMarket

            return (
              <g key={bar.label}>
                <rect
                  x={cx - barWidth / 2}
                  y={barTop}
                  width={barWidth}
                  height={pad.top + plotHeight - barTop}
                  fill={isMarket ? 'none' : toneFill[bar.tone]}
                  stroke={toneFill[bar.tone] === 'none' ? c.navySoft : toneFill[bar.tone]}
                  strokeWidth={isMarket ? 1.5 : 1}
                  strokeDasharray={isMarket ? '5 4' : undefined}
                />
                <text
                  x={cx}
                  y={barTop - 9}
                  textAnchor="middle"
                  fontSize={isNarrow ? 12 : 13}
                  fontWeight={isEmphasis ? 600 : 500}
                  fontFamily="var(--font-mono)"
                  fill={isMarket ? c.clay : c.ink}
                >
                  ₹{bar.value.toFixed(2)}
                </text>
                <text
                  x={cx}
                  y={pad.top + plotHeight + 17}
                  textAnchor="middle"
                  fontSize={isNarrow ? 10 : 11}
                  fontFamily="var(--font-mono)"
                  fill={c.ink3}
                >
                  {isNarrow ? bar.label.split(' ')[0] : bar.label}
                </text>
                {!isNarrow ? (
                  <text
                    x={cx}
                    y={pad.top + plotHeight + 32}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                    fill={c.ink3}
                    opacity="0.8"
                  >
                    {bar.note}
                  </text>
                ) : null}
              </g>
            )
          })}

          {ticks.map((t) => (
            <text
              key={`l${t}`}
              x={pad.left - 8}
              y={y(t) + 4}
              textAnchor="end"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fill={c.ink3}
            >
              {t}
            </text>
          ))}
        </svg>
      ) : null}

      <p className="mt-3 max-w-2xl text-[0.75rem] leading-relaxed text-ink-3">
        The model value and the market price are presented together, not resolved. The gap is the finding: at
        ₹430.20 the market was capitalising materially more than the model's base-case cash flows support. Axis in
        ₹ per share.
      </p>
    </div>
  )
}
