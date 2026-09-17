import useMeasure from '../../hooks/useMeasure'
import { jflWorkingCapital, jflMeta } from '../../content/jflModel'
import { GridLines } from './chartKit'
import { pickLabels, useChartColors } from './chartTokens'

const cash = jflWorkingCapital.cashAndBank
const recommendedFloor = 300

/**
 * Jubilant Foodworks: cash and bank balances against the ₹300 Cr minimum
 * reserve recommended in the analysis itself. A real benchmark, taken from the
 * project's own conclusions.
 */
export default function CashCollapseChart() {
  const [ref, width] = useMeasure()
  const c = useChartColors()
  const isNarrow = width < 560
  const height = isNarrow ? 240 : 270
  const pad = { top: 26, right: isNarrow ? 14 : 34, bottom: 36, left: isNarrow ? 40 : 52 }
  const plotWidth = Math.max(0, width - pad.left - pad.right)
  const plotHeight = Math.max(0, height - pad.top - pad.bottom)

  const max = 600
  const ticks = [0, 150, 300, 450, 600]
  const band = plotWidth / cash.length
  const barWidth = Math.min(isNarrow ? 40 : 58, band * 0.5)
  const x = (i) => pad.left + band * i + band / 2
  const y = (v) => pad.top + plotHeight - (v / max) * plotHeight
  const labels = pickLabels(jflMeta.years, plotWidth, 62)

  return (
    <div ref={ref}>
      {width > 0 ? (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="Cash and bank balances in rupees crore: 517.46 in FY2021, 541 in FY2022, 233 in FY2023, 72 in FY2024 and 101.51 in FY2025, against a recommended minimum reserve of 300 crore."
        >
          <GridLines yTicks={ticks} plotLeft={pad.left} plotWidth={plotWidth} yScale={y} />

          {cash.map((v, i) => {
            const barTop = y(v)
            const belowFloor = v < recommendedFloor
            return (
              <g key={jflMeta.years[i]}>
                <rect
                  x={x(i) - barWidth / 2}
                  y={barTop}
                  width={barWidth}
                  height={pad.top + plotHeight - barTop}
                  fill={belowFloor ? c.clay : c.navy}
                  opacity={belowFloor ? 0.85 : 1}
                />
                <text
                  x={x(i)}
                  y={barTop - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                  fontWeight="500"
                  fill={belowFloor ? c.clay : c.ink}
                >
                  {v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </text>
              </g>
            )
          })}

          {/* Recommended floor from the project's own recommendations */}
          <line
            x1={pad.left}
            x2={pad.left + plotWidth}
            y1={y(recommendedFloor)}
            y2={y(recommendedFloor)}
            stroke={c.ochre}
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <text
            x={pad.left + plotWidth}
            y={y(recommendedFloor) - 7}
            textAnchor="end"
            fontSize="10.5"
            fontFamily="var(--font-mono)"
            fill={c.ochre}
          >
            ₹300 Cr recommended floor
          </text>

          <line
            x1={pad.left}
            x2={pad.left + plotWidth}
            y1={pad.top + plotHeight}
            y2={pad.top + plotHeight}
            stroke={c.ruleStrong}
            strokeWidth="1"
          />

          {ticks.map((t) => (
            <text
              key={`t${t}`}
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
          {labels.map((label, i) =>
            label ? (
              <text
                key={jflMeta.years[i]}
                x={x(i)}
                y={pad.top + plotHeight + 21}
                textAnchor="middle"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fill={c.ink3}
              >
                {label}
              </text>
            ) : null,
          )}
        </svg>
      ) : null}

      <p className="mt-3 max-w-2xl text-[0.75rem] leading-relaxed text-ink-3">
        Cash and bank balances, ₹ crore. The FY2022 peak of ₹541 Cr, the position that made a negative working
        capital model comfortable, has not been rebuilt. The dashed line is the reserve policy the analysis
        recommends, not an industry benchmark.
      </p>
    </div>
  )
}
