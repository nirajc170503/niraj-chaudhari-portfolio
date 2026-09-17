/**
 * Varun Beverages Ltd. Figures lifted directly from
 * "FinalFM&V_Varun Beverages.xlsx" (6 sheets: Assumptions, Income Statement,
 * Balance Sheet, Cash Flow Statement, Ratio Analysis, Stage2, DCF Valuation).
 *
 * Currency: ₹ crore unless stated. Market data as of 23-Aug-2026.
 * Forecast years are labelled exactly as the model labels them.
 */

export const modelMeta = {
  company: 'Varun Beverages Ltd.',
  sheetCount: 6,
  currency: '₹ crore',
  marketDataAsOf: '23 August 2026',
  historicalYears: ['2020A', '2021A', '2022A', '2023A', '2024A', '2025A'],
  forecastYears: ['2026E', '2027E', '2028E', '2029E', '2030E'],
  stage2Years: ['2031E', '2032E', '2033E', '2034E', '2035E'],
}

export const market = {
  price: 430.2,
  sharesCr: 338.21,
  marketCapCr: 145497.94,
  week52High: 568.5,
  week52Low: 381,
  faceValue: 2,
}

export const wacc = {
  riskFree: 6.75,
  equityRiskPremium: 6.25,
  leveredBeta: 0.61,
  costOfEquity: 10.5625,
  preTaxCostOfDebt: 7.5,
  marginalTax: 24,
  postTaxCostOfDebt: 5.7,
  weightDebt: 1.3721,
  weightEquity: 98.6279,
  wacc: 10.4958,
}

export const terminal = {
  growth: 5.75,
  exitMultiple: 16,
}

/** Income statement history + forecast. Values in ₹ crore. */
export const incomeStatement = {
  years: [...modelMeta.historicalYears, ...modelMeta.forecastYears],
  revenue: [
    6450.14, 8823.23, 13173.14, 16042.58, 20007.65, 21685.38, 24908.26, 28050.44, 31164.04,
    34308.49, 37423.7,
  ],
  ebitda: [
    1201.86, 1654.64, 2788.11, 3609.48, 4711.07, 5049.38, 5756.34, 6481.5, 7214.66, 8033.15, 8828.45,
  ],
  ebit: [
    673.16, 1123.38, 2170.92, 2928.57, 3763.68, 3832.92, 4436.2, 5022.87, 5656.45, 6352.03, 7032.12,
  ],
  pat: [
    329.0, 694.05, 1497.43, 2055.92, 2594.63, 3036.49, 3496.13, 3943.84, 4430.04, 4970.23, 5494.37,
  ],
  ebitdaMargin: [
    18.63, 18.75, 21.17, 22.5, 23.55, 23.28, 23.11, 23.11, 23.15, 23.41, 23.59,
  ],
  netMargin: [5.1, 7.87, 11.37, 12.82, 12.97, 14.0, 14.04, 14.06, 14.22, 14.49, 14.68],
  volumeMnCases: [
    560, 693, 802, 913, 1124.4, 1213.1, 1376.87, 1535.21, 1688.73, 1840.71, 1987.97,
  ],
  realisationPerCase: [
    115.18, 127.32, 164.25, 175.71, 177.94, 178.76, 180.91, 182.71, 184.54, 186.39, 188.25,
  ],
  eps: [2.28, 3.21, 4.61, 6.33, 7.67, 8.98, 10.34, 11.66, 13.1, 14.7, 16.25],
  dividendPerShare: [0.5, 0.5, 0.5, 0.7, 0.96, 1.5, 1.38, 1.55, 1.74, 1.95, 2.16],
}

/** Balance sheet extracts. Values in ₹ crore. */
export const balanceSheet = {
  years: modelMeta.historicalYears,
  totalDebt: [2693.48, 2441.82, 3694.81, 5194.39, 2364.27, 2024.12],
  netDebt: [2503.43, 2105.2, 3409.54, 4734.53, -85.78, 25.63],
  netDebtToEbitda: [2.08, 1.27, 1.22, 1.31, -0.02, 0.01],
  cash: [190.05, 336.62, 285.27, 459.86, 2450.05, 1998.49],
  shareholdersFunds: [3524.0, 4079.91, 5102.38, 6936.15, 16609.83, 19578.43],
  capex: [null, 863.21, 1348.66, 3473.45, 4907.74, 3624.45],
}

/** Ratio analysis extracts, from the sheet the model calls "Ratio Analysis". */
export const ratios = {
  years: modelMeta.historicalYears,
  roe: [null, 18.26, 32.62, 34.16, 22.04, 16.78],
  roce: [null, 19.4, 33.52, 34.02, 27.02, 20.25],
  roic: [null, 13.08, 21.86, 21.5, 18.68, 15.24],
  debtToEquity: [0.76, 0.6, 0.72, 0.75, 0.14, 0.1],
  interestCover: [2.39, 6.08, 11.66, 10.92, 8.36, 22.6],
  currentRatio: [0.74, 0.84, 0.86, 1.02, 1.74, 1.94],
  inventoryDays: [126.1, 133.17, 113.41, 111.71, 122.84, 115.39],
  receivableDays: [13.68, 9.15, 8.29, 8.18, 15.43, 21.02],
  payableDays: [69.43, 65.46, 46.88, 39.39, 68.67, 54.78],
  cashConversionCycle: [70.35, 76.87, 74.82, 80.5, 69.6, 81.63],
  impliedPE: [188.75, 134.21, 93.3, 67.97, 56.07, 47.91],
  impliedEvEbitda: [123.2, 89.28, 53.45, 41.66, 30.89, 28.85],
}

/** DCF build: FCFF by year, with mid-year discounting. ₹ crore. */
export const dcf = {
  years: [...modelMeta.forecastYears, ...modelMeta.stage2Years],
  revenue: [
    24908.26, 28050.44, 31164.04, 34308.49, 37423.7, 40632.78, 43911.85, 47327.31, 50819.12,
    54364.77,
  ],
  nopat: [
    3371.51, 3817.38, 4298.9, 4827.55, 5344.41, 5867.37, 6407.62, 6906.0, 7492.77, 8015.54,
  ],
  capex: [3300, 3175, 3050, 2925, 2800, 2844.29, 2854.27, 2839.64, 2795.05, 2718.24],
  nwc: [
    3824.9, 4235.62, 4643.44, 5060.5, 5463.86, 5952.7, 6367.22, 6791.47, 7216.31, 7638.25,
  ],
  increaseInNwc: [517.63, 410.72, 407.83, 417.06, 403.36, 488.84, 414.52, 424.25, 424.85, 421.94],
  fcff: [
    874.02, 1690.29, 2399.28, 3166.6, 3937.39, 4443.98, 5158.78, 5819.17, 6559.73, 7321.78,
  ],
  discountFactor: [
    0.9513, 0.861, 0.7792, 0.7052, 0.6382, 0.5776, 0.5227, 0.4731, 0.4281, 0.3875,
  ],
  pvFcff: [
    831.47, 1455.27, 1869.46, 2232.97, 2512.77, 2566.67, 2696.5, 2752.76, 2808.33, 2836.83,
  ],
}

/** Enterprise-to-equity bridge, ₹ crore. */
export const bridge = {
  pvExplicitFcff: 22563.02,
  pvTerminalPerpetuity: 60135.7,
  enterpriseValuePerpetuity: 82698.72,
  pvTerminalExit: 76626.4,
  enterpriseValueExit: 99189.42,
  lessTotalDebt: 2024.12,
  addCash: 1998.49,
  lessMinorityInterest: 162.25,
  sharesCr: 338.21,
  equityValuePerpetuity: 82510.84,
  equityValueExit: 99001.54,
  valuePerSharePerpetuity: 243.96,
  valuePerShareExit: 292.72,
  valuePerShareAverage: 268.34,
  cmp: 430.2,
  impliedUpside: -43.29,
}

/**
 * Sensitivity tables, exactly as computed in the model.
 * Perpetuity method: rows = WACC, columns = terminal growth.
 * Exit-multiple method: rows = WACC, columns = exit EV/EBITDA.
 */
export const sensitivity = {
  perpetuity: {
    rowLabel: 'WACC',
    colLabel: 'Terminal growth',
    rowHeaders: ['10.50%', '11.00%', '11.50%', '12.00%', '12.50%', '13.00%', '13.50%'],
    colHeaders: ['4.75%', '5.00%', '5.25%', '5.50%', '5.75%', '6.00%', '6.25%'],
    values: [
      [211.45, 218.42, 226.05, 234.45, 243.72, 254.03, 265.55],
      [192.22, 197.87, 204.0, 210.69, 218.02, 226.08, 234.99],
      [175.92, 180.55, 185.55, 190.97, 196.86, 203.28, 210.32],
      [161.92, 165.77, 169.9, 174.35, 179.15, 184.36, 190.01],
      [149.79, 153.02, 156.47, 160.16, 164.13, 168.4, 173.02],
      [139.18, 141.91, 144.82, 147.92, 151.23, 154.78, 158.59],
      [129.83, 132.16, 134.63, 137.25, 140.04, 143.02, 146.21],
    ],
  },
  exitMultiple: {
    rowLabel: 'WACC',
    colLabel: 'Exit EV/EBITDA',
    rowHeaders: ['10.50%', '11.00%', '11.50%', '12.00%', '12.50%', '13.00%', '13.50%'],
    colHeaders: ['12.0×', '14.0×', '16.0×', '18.0×', '20.0×', '22.0×', '24.0×'],
    values: [
      [236.0, 264.31, 292.62, 320.93, 349.24, 377.55, 405.86],
      [226.8, 253.86, 280.92, 307.98, 335.04, 362.1, 389.16],
      [218.02, 243.9, 269.77, 295.64, 321.51, 347.38, 373.25],
      [209.65, 234.39, 259.13, 283.86, 308.6, 333.34, 358.08],
      [201.65, 225.31, 248.97, 272.63, 296.3, 319.96, 343.62],
      [194.02, 216.65, 239.28, 261.92, 284.55, 307.19, 329.82],
      [186.72, 208.38, 230.04, 251.69, 273.35, 295.01, 316.67],
    ],
  },
}

/** Assumption drivers behind the forecast, from the Assumptions sheet. */
export const assumptionDrivers = {
  volumeGrowth: [13.5, 11.5, 10.0, 9.0, 8.0],
  realisationGrowth: [1.2, 1.0, 1.0, 1.0, 1.0],
  impliedRevenueGrowth: [14.86, 12.62, 11.1, 10.09, 9.08],
  ebitdaMargin: [23.11, 23.11, 23.15, 23.41, 23.59],
  dnaPctOfRevenue: [5.3, 5.2, 5.0, 4.9, 4.8],
  capexPctOfRevenue: [13.25, 11.32, 9.79, 8.53, 7.48],
  taxRate: [24, 24, 24, 24, 24],
  inventoryPctOfRevenue: [13.66, 13.55, 13.5, 13.4, 13.3],
  receivablePctOfRevenue: [5.7, 5.6, 5.55, 5.5, 5.45],
  payablePctOfRevenue: [6.4, 6.45, 6.5, 6.5, 6.5],
  longTermBorrowings: [600, 620, 640, 660, 680],
}
