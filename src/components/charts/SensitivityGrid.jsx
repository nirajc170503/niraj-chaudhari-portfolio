import { sensitivity } from '../../content/vblModel'
import { useTheme } from '../../theme/themeContext.js'
import { heatTone, useChartColors } from './chartTokens'

/**
 * WACC against assumption sensitivity heatmaps, rendered with the model's own
 * figures. Cells are tinted on a single low-to-high scale so the reader can
 * see the spread at a glance; the cell at the base case is outlined.
 */
function Grid({ data, baseRowIndex, baseColIndex }) {
  const { isDark } = useTheme()
  const c = useChartColors()
  const flat = data.values.flat()
  const min = Math.min(...flat)
  const max = Math.max(...flat)

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[0.75rem]">
        <caption className="sr-only">
          Sensitivity of value per share to {data.rowLabel} and {data.colLabel}
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="bg-paper-2 px-3 py-2 text-left font-mono text-xs tracking-wider text-ink-3 uppercase whitespace-nowrap"
            >
              {data.rowLabel} ↓ / {data.colLabel} →
            </th>
            {data.colHeaders.map((col) => (
              <th
                key={col}
                scope="col"
                className="bg-paper-2 px-3 py-2 text-right font-mono text-xs font-medium tracking-wider text-ink-2 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.values.map((row, r) => (
            <tr key={data.rowHeaders[r]}>
              <th
                scope="row"
                className="bg-paper-2 px-3 py-2 text-left font-mono text-xs font-medium tracking-wider text-ink-2 whitespace-nowrap"
              >
                {data.rowHeaders[r]}
              </th>
              {row.map((value, col) => {
                const isBase = r === baseRowIndex && col === baseColIndex
                const { bg, fg } = heatTone(isDark, (value - min) / (max - min))
                return (
                  <td
                    key={`${r}-${col}`}
                    className="tnum px-3 py-2 text-right whitespace-nowrap"
                    style={{
                      backgroundColor: bg,
                      color: fg,
                      fontWeight: isBase ? 600 : 400,
                      boxShadow: isBase ? `inset 0 0 0 1.5px ${c.navy}` : undefined,
                    }}
                  >
                    {value.toFixed(2)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SensitivityGrid() {
  return (
    <div className="mt-6 space-y-8">
      <div>
        <p className="mb-3 max-w-2xl text-[0.875rem] leading-relaxed text-ink-2">
          <span className="font-medium text-ink">Perpetuity growth method.</span> The base case (10.50% WACC
          against 5.75% terminal growth) is outlined. Moving one row down and one column left moves the equity
          value by roughly ₹65 a share.
        </p>
        <Grid data={sensitivity.perpetuity} baseRowIndex={0} baseColIndex={4} />
      </div>

      <div>
        <p className="mb-3 max-w-2xl text-[0.875rem] leading-relaxed text-ink-2">
          <span className="font-medium text-ink">Exit multiple method.</span> The same WACC range against exit
          EV/EBITDA multiples from 12x to 24x. Even at the most conservative corner of this grid the value
          stays below the market price, which is itself a finding.
        </p>
        <Grid data={sensitivity.exitMultiple} baseRowIndex={0} baseColIndex={2} />
      </div>

      <p className="font-mono text-xs tracking-wide text-ink-3">
        Values are ₹ per share, computed in the model's own sensitivity tables. Tint rises with value.
      </p>
    </div>
  )
}
