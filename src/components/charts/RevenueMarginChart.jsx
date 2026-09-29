import useMeasure from '../../hooks/useMeasure'
import { incomeStatement } from '../../content/vblModel'
import { GridLines } from './chartKit'
import { pickLabels, useChartColors } from './chartTokens'

const { years, revenue, ebitdaMargin } = incomeStatement

/**
 * Varun Beverages: revenue (bars) against EBITDA margin (line).
 * Historical years are solid; forecast years are outlined to make the
 * actual-versus-estimate boundary explicit.
 */
export default function RevenueMarginChart() {
  const [ref, width] = useMeasure()
  const c = useChartColors()
  const height = width < 520 ? 250 : 300

  const pad = { top: 22, right: width < 520 ? 12 : 30, bottom: 34, left: width < 520 ? 38 : 54 }
  const plotWidth = Math.max(0, width - pad.left - pad.right)
  const plotHeight = Math.max(0, height - pad.top - pad.bottom)

  const maxRevenue = 40000
  const yTicks = [0, 10000, 20000, 30000, 40000]
  const marginMin = 0
  const marginMax = 40
  const marginTicks = [0, 10, 20, 30]

  const band = plotWidth / years.length
  const barWidth = Math.max(6, Math.min(34, band * 0.46))

  const x = (i) => pad.left + band * i + band / 2
  const yRevenue = (v) => pad.top + plotHeight - (v / maxRevenue) * plotHeight
  const yMargin = (v) => pad.top + plotHeight - ((v - marginMin) / (marginMax - marginMin)) * plotHeight

  const labels = pickLabels(years, plotWidth, width < 520 ? 62 : 54)
  const marginPath = ebitdaMargin.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${yMargin(v)}`).join(' ')
  const historicalCount = 6

  return (
    <div ref={ref}>
      {width > 0 ? (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="Varun Beverages revenue by year in rupees crore, with EBITDA margin as a percentage line. Revenue rises from 6,450 crore in 2020A to 21,685 crore in 2025A and is forecast to reach 37,424 crore in 2030E. EBITDA margin moves from 18.6 percent to 23.6 percent."
        >
          <GridLines yTicks={yTicks} plotLeft={pad.left} plotWidth={plotWidth} yScale={yRevenue} />

          {/* margin axis grid, lighter */}
          <g aria-hidden="true">
            {marginTicks.map((tick) => (
              <line
                key={tick}
                x1={pad.left}
                x2={pad.left + plotWidth}
                y1={yMargin(tick)}
                y2={yMargin(tick)}
                stroke={c.rule}
                strokeWidth="1"
                strokeDasharray="2 4"
                opacity="0.7"
              />
            ))}
          </g>

          {/* forecast band */}
          <rect
            x={pad.left + band * historicalCount}
            y={pad.top}
            width={band * (years.length - historicalCount)}
            height={plotHeight}
            fill={c.ochre}
            opacity="0.05"
            aria-hidden="true"
          />
          <line
            x1={pad.left + band * historicalCount}
            x2={pad.left + band * historicalCount}
            y1={pad.top}
            y2={pad.top + plotHeight}
            stroke={c.ruleStrong}
            strokeWidth="1"
            strokeDasharray="3 3"
            aria-hidden="true"
          />

          {/* revenue bars */}
          {revenue.map((v, i) => {
            const isForecast = i >= historicalCount
            return (
              <rect
                key={years[i]}
                x={x(i) - barWidth / 2}
                y={yRevenue(v)}
                width={barWidth}
                height={pad.top + plotHeight - yRevenue(v)}
                fill={isForecast ? 'none' : c.navy}
                stroke={isForecast ? c.navySoft : c.navy}
                strokeWidth="1"
                opacity={isForecast ? 0.85 : 1}
              />
            )
          })}

          {/* EBITDA margin line */}
          <path d={marginPath} fill="none" stroke={c.forest} strokeWidth="1.75" />

          {/* axis */}
          <line
            x1={pad.left}
            x2={pad.left + plotWidth}
            y1={pad.top + plotHeight}
            y2={pad.top + plotHeight}
            stroke={c.ruleStrong}
            strokeWidth="1"
          />

          {/* left axis labels, revenue */}
          {yTicks.map((tick) => (
            <text
              key={tick}
              x={pad.left - 8}
              y={yRevenue(tick) + 4}
              textAnchor="end"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fill={c.ink3}
            >
              {tick === 0 ? '0' : `${tick / 1000}k`}
            </text>
          ))}

          {/* right axis labels, margin */}
          {width >= 520
            ? marginTicks.map((tick) => (
                <text
                  key={`m${tick}`}
                  x={pad.left + plotWidth + 8}
                  y={yMargin(tick) + 4}
                  textAnchor="start"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                  fill={c.forest}
                >
                  {tick}%
                </text>
              ))
            : null}

          {/* x labels */}
          {labels.map((label, i) =>
            label ? (
              <text
                key={years[i]}
                x={x(i)}
                y={pad.top + plotHeight + 20}
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

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs tracking-wide text-ink-3">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-3 w-3 bg-navy" />
          Revenue, ₹ Cr
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-3 w-3 border border-navy/40" />
          Forecast revenue
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-[2px] w-4 bg-forest" />
          EBITDA margin
        </span>
      </div>

      <details className="mt-4 border-t border-rule pt-3">
        <summary className="cursor-pointer font-mono text-xs tracking-[0.1em] text-ink-3 uppercase hover:text-ink">
          Read as a table
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-[0.8125rem]">
            <caption className="sr-only">
              Revenue and EBITDA margin by year, CY2020A to CY2030E, in ₹ crore and per cent
            </caption>
            <thead>
              <tr className="border-b border-rule-strong">
                <th scope="col" className="py-2 pr-4 font-mono text-xs tracking-wider text-ink-3 uppercase">
                  Year
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-mono text-xs tracking-wider text-ink-3 uppercase">
                  Revenue
                </th>
                <th scope="col" className="py-2 text-right font-mono text-xs tracking-wider text-ink-3 uppercase">
                  EBITDA margin
                </th>
              </tr>
            </thead>
            <tbody>
              {years.map((year, i) => (
                <tr key={year} className="border-b border-rule/70">
                  <th scope="row" className="py-1.5 pr-4 font-mono text-[0.75rem] font-normal text-ink-2">
                    {year}
                  </th>
                  <td className="tnum py-1.5 pr-4 text-right text-ink-2">
                    {revenue[i].toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                  <td className="tnum py-1.5 text-right text-ink-2">
                    {ebitdaMargin[i].toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
