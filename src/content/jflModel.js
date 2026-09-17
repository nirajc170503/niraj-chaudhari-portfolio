/**
 * Jubilant Foodworks Ltd. Figures transcribed from
 * "JFL_Working_Capital_Presentation.pdf" (16 slides, MBA Finance Semester II,
 * Financial Management FAT-2, academic year 2025–26).
 *
 * Source of the underlying data as stated in the deck: CMIE Prowess,
 * consolidated financials, non-annualised, FY2021–FY2025.
 * Currency: ₹ crore.
 */

export const jflMeta = {
  company: 'Jubilant Foodworks Ltd.',
  ticker: 'NSE: JUBLFOOD',
  ownershipNote: 'Consolidated financials; DP Eurasia included from FY2024',
  years: ['FY2021', 'FY2022', 'FY2023', 'FY2024', 'FY2025'],
  source: 'CMIE Prowess',
}

/** Five-year snapshot, slide 4. */
export const jflFinancials = {
  revenue: [3268.87, 4331.1, 5095.99, 5341.85, 6104.67],
  cogs: [1959.72, 2397.79, 2965.99, 3182.66, 3672.88],
  operatingExpenses: [2490.26, 3221.78, 3930.24, 4232.92, 4920.01],
  currentAssets: [815.06, 898.19, 654.14, 585.09, 638.19],
  currentLiabilities: [853.9, 906.13, 1005.91, 1153.83, 1351.49],
}

/** Working capital position and liquidity, slides 5–6. */
export const jflWorkingCapital = {
  grossWorkingCapital: [null, 898.19, null, null, 638.19],
  netWorkingCapital: [-38.84, null, null, null, -713.3],
  workingCapitalRequirement: [-852.44, null, -785.88, null, -456.98],
  cashAndBank: [517.46, 541, 233, 72, 101.51],
  shortTermDebt: [0, 0, 0, 9.5, 68.1],
  currentRatio: [0.95, null, null, null, 0.47],
  quickRatio: [0.73, null, null, null, 0.17],
  cashRatio: [0.06, 0.11, 0.07, 0.06, 0.12],
  interestCoverage: [null, null, null, null, 2.08],
}

/** Working capital requirement build, cost of sales method, slide 5. */
export const jflWcrBuild = {
  years: ['FY2021', 'FY2023', 'FY2025'],
  costPerDay: [7.8, 12.07, 15.23],
  icpCost: [430.39, 572.15, 951.42],
  rcpCost: [17.71, 28.0, 63.19],
  creditFromSuppliers: [-1300.54, -1386.03, -1471.6],
  netWcr: [-852.44, -785.88, -456.98],
}

/** Operating cycle components, slides 8–10. */
export const jflOperatingCycle = {
  years: jflMeta.years,
  icp: [55.18, 52.28, 47.41, 60.61, 62.48],
  rawMaterialDays: [null, null, null, null, 59.2],
  wipDays: [null, null, null, null, 2.78],
  finishedGoodsDays: [null, null, null, null, 0.5],
  rcp: [2.27, 2.08, 2.32, 3.39, 4.15],
  pdp: [166.74, 139.8, 114.85, 105.7, 96.64],
  ccc: [-109.29, -85.44, -65.12, -41.7, -30.01],
  fy2025OperatingCycle: 66.63,
}

/** Efficiency and turnover ratios, slide 11. */
export const jflTurnover = {
  years: jflMeta.years,
  inventory: [6.61, 6.98, 7.7, 6.02, 5.84],
  debtors: [160.8, 175.5, 157.3, 107.7, 88.0],
  creditors: [2.19, 2.61, 3.18, 3.45, 3.78],
  workingCapital: [-3.83, -5.15, -6.48, -9.77, -13.36],
}

/** Five-year scorecard, slide 15. */
export const jflScorecard = [
  { metric: 'Revenue (₹ Cr)', fy2021: '3,268.87', fy2025: '6,104.67', change: '+86.8%', signal: 'strong' },
  { metric: 'Net Working Capital (₹ Cr)', fy2021: '−38.84', fy2025: '−713.30', change: 'Widened ×18', signal: 'monitor' },
  { metric: 'Cash Conversion Cycle (days)', fy2021: '−109.29', fy2025: '−30.01', change: '−79 days', signal: 'alert' },
  { metric: 'Current Ratio (×)', fy2021: '0.95', fy2025: '0.47', change: '−50%', signal: 'alert' },
  { metric: 'Quick Ratio (×)', fy2021: '0.73', fy2025: '0.17', change: '−77%', signal: 'alert' },
  { metric: 'Cash & Bank (₹ Cr)', fy2021: '517.46', fy2025: '101.51', change: '−80%', signal: 'alert' },
  { metric: 'Inventory Days', fy2021: '55.18', fy2025: '62.48', change: '+13%', signal: 'monitor' },
  { metric: 'Creditor Days (PDP)', fy2021: '166.74', fy2025: '96.64', change: '−42%', signal: 'alert' },
  { metric: 'Debtor Days (RCP)', fy2021: '2.27', fy2025: '4.15', change: '+83%', signal: 'monitor' },
  { metric: 'Short-Term Debt (₹ Cr)', fy2021: '0', fy2025: '68.10', change: 'First appearance', signal: 'alert' },
  { metric: 'Interest Coverage (×)', fy2021: 'Debt-free', fy2025: '2.08', change: 'Watch', signal: 'monitor' },
]

/**
 * Managerial recommendations, slide 14. The deck ranks these by urgency and
 * states an estimated cash impact for the first two.
 */
export const jflRecommendations = [
  {
    rank: 1,
    title: 'Renegotiate supplier terms',
    horizon: 'Immediate',
    impact: '₹200–300 Cr',
    detail:
      'Extend payables from 97 to 115+ days using combined Domino\u2019s, Popeyes and Dunkin\u2019 purchasing scale.',
  },
  {
    rank: 2,
    title: 'Implement AI inventory management',
    horizon: '3–6 months',
    impact: '₹80–150 Cr',
    detail: 'Cut raw-material days from 59 toward 45 to release tied-up working capital and reduce spoilage.',
  },
  {
    rank: 3,
    title: 'Set a ₹300 Cr cash floor',
    horizon: 'Policy now',
    impact: 'Risk shield',
    detail: '₹101 Cr of cash covers roughly 7 days of operating expenses, so a minimum reserve policy should be formalised.',
  },
  {
    rank: 4,
    title: 'Revive dine-in with a lunch offer',
    horizon: 'Immediate',
    impact: 'Margin ↑',
    detail: 'Push lunch bundles into the 11am–3pm window, which carries only ~20% of daily sales.',
  },
  {
    rank: 5,
    title: 'Negotiate aggregator settlement SLAs',
    horizon: '6 months',
    impact: '₹15–20 Cr',
    detail: 'Target 48-hour settlement from Swiggy and Zomato instead of the current 3–7 day cycle.',
  },
  {
    rank: 6,
    title: 'Separate India vs international working capital',
    horizon: 'Strategic',
    impact: 'Clarity',
    detail: 'DP Eurasia consolidation inflates the Indian ratios; segment reporting would isolate the Indian position.',
  },
]

/** Structural risks identified in the deck, slides 12–13. */
export const jflRisks = [
  { risk: '79-day float erosion', severity: 'High', note: 'CCC compressed from −109 to −30 days over five years.' },
  { risk: 'Cash at historic low', severity: 'High', note: '₹101 Cr against ₹553 Cr of trade payables.' },
  { risk: 'Turkey macro exposure', severity: 'Medium', note: 'Lira depreciation and inflation flow through consolidated profit.' },
  { risk: 'Inventory build-up', severity: 'Medium', note: 'Raw-material days rose from 46 to 59 with separate cold chains for new brands.' },
  { risk: 'Delivery mix dilution', severity: 'Medium', note: 'Delivery-heavy revenue carries lower margin than dine-in at the same price.' },
  { risk: 'Short-term debt emerging', severity: 'Watch', note: 'First short-term borrowings after a long debt-free period.' },
]
