import useMeasure from '../../hooks/useMeasure'
import { jflOperatingCycle, jflMeta } from '../../content/jflModel'
import { GridLines } from './chartKit'
import { pickLabels, useChartColors } from './chartTokens'

const { years, icp, rcp, pdp, ccc } = jflOperatingCycle

/**
 * Jubilant Foodworks: the working capital float, decomposed.
 *
 * Above the line: what consumes cash (inventory held, receivables outstanding).
 * Below the line: what provides it (supplier credit). The annual cash
 * conversion cycle is the net of the two, plotted as a line so the 79-day
 * erosion is unmistakable.
 */
export default function CashConversionChart() {
  const [ref, width] = useMeasure()
  const c = useChartColors()
  const isNarrow = width < 560
  const height = isNarrow ? 300 : 340
  const pad = { top: 26, right: isNarrow ? 14 : 34, bottom: 44, left: isNarrow ? 42 : 54 }
  const plotWidth = Math.max(0, width - pad.left - pad.right)
  const plotHeight = Math.max(0, height - pad.top - pad.bottom)

  const min = -180
  const max = 180
  const ticks = [-150, -100, -50, 0, 50, 100, 150]

  const band = plotWidth / years.length
  const barWidth = Math.min(isNarrow ? 34 : 52, band * 0.5)
  const x = (i) => pad.left + band * i + band / 2
  const y = (v) => pad.top + plotHeight - ((v - min) / (max - min)) * plotHeight
  const zeroY = y(0)
  const labels = pickLabels(years, plotWidth, 62)

  const cccPath = ccc.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ')
  const operatingCycle = icp.map((v, i) => v + rcp[i])

  return (
    <div ref={ref}>
      {width > 0 ? (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="Jubilant Foodworks working capital decomposition, FY2021 to FY2025, in days. Inventory days rise from 55.18 to 62.48 and receivable days from 2.27 to 4.15, so the operating cycle rises from 57.45 to 66.63 days. Supplier credit falls from 166.74 to 96.64 days. The net cash conversion cycle therefore rises from minus 109.29 to minus 30.01 days."
        >
          <defs>
            <pattern id="jflHatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="6" stroke={c.ochre} strokeWidth="1.3" opacity="0.55" />
            </pattern>
          </defs>

          <GridLines yTicks={ticks} plotLeft={pad.left} plotWidth={plotWidth} yScale={y} />

          {years.map((year, i) => {
            const icpTop = y(icp[i])
            const cycleTop = y(operatingCycle[i])
            const pdpBottom = y(-pdp[i])

            return (
              <g key={year}>
                {/* inventory consumed */}
                <rect
                  x={x(i) - barWidth / 2}
                  y={icpTop}
                  width={barWidth}
                  height={zeroY - icpTop}
                  fill={c.navy}
                />
                {/* receivables consumed */}
                <rect
                  x={x(i) - barWidth / 2}
                  y={cycleTop}
                  width={barWidth}
                  height={icpTop - cycleTop}
                  fill={c.navySoft}
                />
                {/* supplier credit provided */}
                <rect
                  x={x(i) - barWidth / 2}
                  y={zeroY}
                  width={barWidth}
                  height={pdpBottom - zeroY}
                  fill="url(#jflHatch)"
                />
                <rect
                  x={x(i) - barWidth / 2}
                  y={zeroY}
                  width={barWidth}
                  height={pdpBottom - zeroY}
                  fill={c.ochre}
                  opacity="0.12"
                />
              </g>
            )
          })}

          {/* net position */}
          <line
            x1={pad.left}
            x2={pad.left + plotWidth}
            y1={zeroY}
            y2={zeroY}
            stroke={c.ink}
            strokeWidth="1"
            opacity="0.4"
          />
          <path d={cccPath} fill="none" stroke={c.clay} strokeWidth="2.25" />
          {ccc.map((v, i) => (
            <g key={`net${years[i]}`}>
              <circle
                cx={x(i)}
                cy={y(v)}
                r="3.4"
                fill={c.paper}
                stroke={c.clay}
                strokeWidth="1.75"
              />
              <text
                x={x(i)}
                y={y(v) - 11}
                textAnchor={i === 0 ? 'start' : i === years.length - 1 ? 'end' : 'middle'}
                fontSize="11"
                fontFamily="var(--font-mono)"
                fontWeight="500"
                fill={c.clay}
              >
                {v.toFixed(0)}
              </text>
            </g>
          ))}

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
                key={years[i]}
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

          {/* axis sense labels */}
          <text
            x={pad.left + plotWidth}
            y={pad.top + 8}
            textAnchor="end"
            fontSize="10.5"
            fontFamily="var(--font-mono)"
            fill={c.navy}
            opacity="0.75"
          >
            cash consumed ↑
          </text>
          <text
            x={pad.left + plotWidth}
            y={pad.top + plotHeight - 4}
            textAnchor="end"
            fontSize="10.5"
            fontFamily="var(--font-mono)"
            fill={c.ochre}
            opacity="0.9"
          >
            cash provided ↓
          </text>
        </svg>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.6875rem] tracking-wide text-ink-3">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-3 w-3 bg-navy" />
          Inventory (ICP)
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-3 w-3 bg-navy-soft" />
          Receivables (RCP)
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-3 w-3 bg-ochre/25 ring-1 ring-ochre/50" />
          Supplier credit (PDP)
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-[2px] w-4 bg-clay" />
          Net cash conversion cycle
        </span>
      </div>

      <details className="mt-4 border-t border-rule pt-3">
        <summary className="cursor-pointer font-mono text-[0.6875rem] tracking-[0.1em] text-ink-3 uppercase hover:text-ink">
          Read as a table
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-left text-[0.8125rem]">
            <thead>
              <tr className="border-b border-rule-strong">
                <th scope="col" className="py-2 pr-4 font-mono text-[0.6875rem] tracking-wider text-ink-3 uppercase">
                  Days
                </th>
                {jflMeta.years.map((year) => (
                  <th
                    key={year}
                    scope="col"
                    className="py-2 pr-4 text-right font-mono text-[0.6875rem] tracking-wider text-ink-3 uppercase"
                  >
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['ICP (inventory)', icp],
                ['RCP (receivables)', rcp],
                ['Operating cycle', operatingCycle],
                ['PDP (supplier credit)', pdp],
                ['Cash conversion cycle', ccc],
              ].map(([label, series]) => (
                <tr key={label} className="border-b border-rule/70">
                  <th scope="row" className="py-1.5 pr-4 text-left font-normal text-ink-2">
                    {label}
                  </th>
                  {series.map((v, i) => (
                    <td key={jflMeta.years[i]} className="tnum py-1.5 pr-4 text-right text-ink-2">
                      {v.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
