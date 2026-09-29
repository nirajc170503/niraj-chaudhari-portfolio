import { describe, expect, it } from 'vitest'
import {
  bridge,
  market,
  wacc,
  ratios,
  sensitivity,
  fmt2,
  fmtX,
  fmtParen,
  fmtPct,
  fmtPctSigned,
} from '../src/content/vblModel.js'

/**
 * These are the numbers a reader would check. The published prose quotes them,
 * so if the model moves, the copy has to move with it. Assertions are written
 * against the model's own inputs and outputs rather than pasted literals
 * wherever possible, so a failure means the model and the stated relationship
 * disagree, not merely that a number was edited.
 */

describe('cost of capital', () => {
  it('derives the cost of equity from the risk-free rate and beta', () => {
    expect(wacc.costOfEquity).toBeCloseTo(wacc.riskFree + wacc.leveredBeta * wacc.equityRiskPremium, 10)
  })

  it('taxes the cost of debt at the marginal rate', () => {
    expect(wacc.postTaxCostOfDebt).toBeCloseTo(
      wacc.preTaxCostOfDebt * (1 - wacc.marginalTax / 100),
      10,
    )
  })

  it('weights the two costs into the WACC', () => {
    expect(wacc.wacc).toBeCloseTo(
      wacc.costOfEquity * (wacc.weightEquity / 100) + wacc.postTaxCostOfDebt * (wacc.weightDebt / 100),
      2,
    )
  })

  it('expresses the capital structure weights as percentages that sum to 100', () => {
    expect(wacc.weightEquity + wacc.weightDebt).toBeCloseTo(100, 6)
  })
})

describe('the market bridge', () => {
  it('quotes the average of the two terminal-value methods', () => {
    expect(bridge.valuePerShareAverage).toBeCloseTo(
      (bridge.valuePerSharePerpetuity + bridge.valuePerShareExit) / 2,
      10,
    )
  })

  it('states the implied downside as the gap between value and market price', () => {
    expect(bridge.impliedUpside).toBeCloseTo(
      ((bridge.valuePerShareAverage - market.price) / market.price) * 100,
      6,
    )
  })

  it('reports the headline gap as a negative number, since the value is below the price', () => {
    // This is the figure the prose previously stated as 43%. That is the
    // perpetuity method on its own; the page quotes the average, which is
    // 37.6%. The test pins both so the two can never be confused again.
    expect(bridge.impliedUpside).toBeLessThan(0)
    expect(bridge.impliedUpside).toBeCloseTo(-37.62, 1)
  })

  it('keeps the average distinct from either method', () => {
    expect(bridge.impliedUpsidePerpetuity).toBeCloseTo(-43.29, 1)
    expect(bridge.impliedUpsideExit).toBeCloseTo(-31.96, 1)
    expect(bridge.impliedUpside).toBeCloseTo(
      (bridge.impliedUpsidePerpetuity + bridge.impliedUpsideExit) / 2,
      10,
    )
  })

  it('puts the average between the two methods', () => {
    const a = bridge.impliedUpsidePerpetuity
    const b = bridge.impliedUpsideExit
    expect(bridge.impliedUpside).toBeGreaterThan(Math.min(a, b))
    expect(bridge.impliedUpside).toBeLessThan(Math.max(a, b))
  })

  it('finds a value per share below the market price on both methods', () => {
    expect(bridge.valuePerSharePerpetuity).toBeLessThan(market.price)
    expect(bridge.valuePerShareExit).toBeLessThan(market.price)
  })

  it('arrives at each method by deducting debt and adding cash from enterprise value', () => {
    for (const method of ['Perpetuity', 'Exit']) {
      const enterprise = bridge[`enterpriseValue${method}`]
      const equity = bridge[`equityValue${method}`]
      expect(equity).toBeCloseTo(
        enterprise - bridge.lessTotalDebt + bridge.addCash - bridge.lessMinorityInterest,
        1,
      )
      // Published per-share figures are rounded to paise, so the identity holds
      // to two decimal places rather than exactly.
      expect(bridge[`valuePerShare${method}`]).toBeCloseTo(equity / bridge.sharesCr, 1)
    }
  })
})

describe('sensitivity grids', () => {
  const grids = Object.entries(sensitivity)

  it('has a grid per terminal-value method', () => {
    expect(grids.map(([name]) => name).toSorted()).toEqual(['exitMultiple', 'perpetuity'])
  })

  it('gives every grid a value for every cell', () => {
    for (const [name, grid] of grids) {
      expect(grid.values.length, `${name} row count`).toBe(grid.rowHeaders.length)
      for (const row of grid.values) {
        expect(row.length, `${name} column count`).toBe(grid.colHeaders.length)
        for (const cell of row) {
          expect(Number.isFinite(cell), `${name} has no empty cells`).toBe(true)
          expect(cell, `${name} has no negative values`).toBeGreaterThan(0)
        }
      }
    }
  })

  it('brackets the base case of the method it belongs to', () => {
    // Each grid varies one axis of one method, so it must contain that
    // method's own value. It does not have to contain the average of the two,
    // which sits between the two grids rather than inside either one.
    const expected = {
      perpetuity: bridge.valuePerSharePerpetuity,
      exitMultiple: bridge.valuePerShareExit,
    }
    for (const [name, grid] of grids) {
      const values = grid.values.flat()
      expect(expected[name], `${name} low end`).toBeGreaterThanOrEqual(Math.min(...values) - 1)
      expect(expected[name], `${name} high end`).toBeLessThanOrEqual(Math.max(...values) + 1)
    }
  })

  it('reproduces each base case at the base-case axis intersection', () => {
    // The grid rounds the WACC axis to 10.50% while the model runs at 10.4958%,
    // so agreement is to the rupee rather than to the paisa.
    const cases = [
      { name: 'perpetuity', value: bridge.valuePerSharePerpetuity, row: 0, col: 4 },
      { name: 'exitMultiple', value: bridge.valuePerShareExit, row: 0, col: 2 },
    ]
    for (const { name, value, row, col } of cases) {
      const grid = sensitivity[name]
      expect(grid.rowHeaders[row]).toBe('10.50%')
      expect(grid.values[row][col], `${name} base cell`).toBeCloseTo(value, 0)
    }
  })

  it('runs the base assumptions at the intersections above', () => {
    expect(sensitivity.perpetuity.colHeaders[4]).toBe('5.75%')
    expect(sensitivity.exitMultiple.colHeaders[2]).toBe('16.0×')
  })

  it('rises across a growth axis and falls down a WACC axis', () => {
    for (const [name, grid] of grids) {
      const row = grid.values.at(0)
      const rises = row.at(-1) > row.at(0)
      const colHeaderRises = parseFloat(grid.colHeaders.at(-1)) > parseFloat(grid.colHeaders[0])
      expect(rises, `${name}: value should move with ${grid.colLabel}`).toBe(colHeaderRises)

      const first = grid.values.map((r) => r.at(0))
      const falls = first.at(-1) < first.at(0)
      const rowHeaderRises = parseFloat(grid.rowHeaders.at(-1)) > parseFloat(grid.rowHeaders[0])
      expect(falls, `${name}: value should fall as ${grid.rowLabel} rises`).toBe(rowHeaderRises)
    }
  })
})

describe('formatters', () => {
  it('groups thousands in the Indian format', () => {
    expect(fmt2(1234567.891)).toBe('12,34,567.89')
    expect(fmt2(430.2)).toBe('430.20')
  })

  it('renders multiples with a trailing x', () => {
    expect(fmtX(1.234)).toBe('1.23x')
  })

  it('wraps negatives in accounting parentheses', () => {
    expect(fmtParen(-166.74)).toBe('(166.74)')
    expect(fmtParen(166.74)).toBe('166.74')
    expect(fmtParen(0)).toBe('0.00')
  })

  it('reports a percentage by magnitude when the sign is stated in the words', () => {
    expect(fmtPct(-37.62)).toBe('37.6%')
    expect(fmtPct(37.62)).toBe('37.6%')
  })

  it('signs a percentage explicitly when direction matters', () => {
    expect(fmtPctSigned(-37.62)).toBe('−37.6%')
    expect(fmtPctSigned(37.62)).toBe('+37.6%')
  })
})

describe('ratios', () => {
  // `years` is a label list, not a numeric series.
  const series = Object.entries(ratios).filter(
    ([name, value]) => name !== 'years' && Array.isArray(value),
  )

  it('covers the reported years for every ratio', () => {
    for (const [name, values] of series) {
      expect(values.length, `${name} covers every reported year`).toBe(ratios.years.length)
    }
  })

  it('uses null, not a number, where a ratio cannot be computed', () => {
    // A missing first year is legitimate: there is no opening balance to take
    // a return against. Substituting zero would quietly distort the chart.
    for (const [name, values] of series) {
      for (const value of values) {
        if (value === null) continue
        expect(Number.isFinite(value), `${name} has no undefined entries`).toBe(true)
      }
    }
  })
})
