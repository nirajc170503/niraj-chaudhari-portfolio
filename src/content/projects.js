/**
 * Project content. Every claim below is traceable to a supplied source file:
 *
 *  01  FinalFM&V_Varun Beverages.xlsx
 *  02  Resume + LinkedIn profile export (Home Credit / Datamind Labs / Zindi)
 *  03  JFL_Working_Capital_Presentation.pdf
 *
 * Where a figure was not available in the source it is omitted rather than
 * estimated. No project dates are stated where the source carries none.
 */

export const projects = [
  /* ------------------------------------------------------------------ 01 */
  {
    slug: 'varun-beverages',
    index: '01',
    flagship: true,
    title: 'Varun Beverages Ltd.',
    subtitle: 'Three-statement financial model and DCF valuation',
    domain: 'Financial Modelling & Valuation',
    accent: 'navy',
    question:
      'What is Varun Beverages worth on a fully integrated model of its own financials, and what does the market price imply about expected growth?',

    summary:
      'A six-sheet Excel model that rebuilds six years of consolidated financials, forecasts five more from ' +
      'volume and realisation drivers, extends ten years into the DCF, and values the equity two ways.',

    method: [
      'Three-statement modelling',
      'Driver-based forecasting',
      'WACC / CAPM build',
      'DCF, perpetual growth',
      'DCF, exit multiple',
      'Sensitivity analysis',
      'Ratio and DuPont analysis',
    ],

    headline: {
      label: 'DCF fair value, average of two terminal value methods',
      value: '₹268.34',
      unit: 'per share',
      context: 'Against a market price of ₹430.20 at the model date.',
    },

    facts: [
      { label: 'Model sheets', value: '6' },
      { label: 'Historical years', value: '6' },
      { label: 'Explicit forecast', value: '10 yrs' },
      { label: 'Sensitivity grids', value: '2' },
    ],

    tools: ['Excel', 'Financial statements', 'MD&A and concalls', 'Damodaran sector data'],

    /** Section-by-section case study body. */
    sections: [
      {
        id: 'objective',
        heading: 'The question',
        paragraphs: [
          'Varun Beverages is one of PepsiCo\u2019s largest franchise bottlers outside the United States, which ' +
            'makes it a good candidate for a driver-based model. Volumes, realisation per case and capital ' +
            'intensity explain most of the outcome.',
          'The objective was not to reach a share price target. It was to build a model in which every forecast ' +
            'line traces back to a stated assumption, so a reader can question a specific input rather than the ' +
            'whole output.',
        ],
      },
      {
        id: 'architecture',
        heading: 'Model architecture',
        paragraphs: [
          'The workbook runs to six linked sheets. Assumptions sits first so that every driver is visible in one ' +
            'place. The income statement, balance sheet and cash flow statement are fully linked, and the ratio ' +
            'analysis and DCF read off those three.',
        ],
        table: {
          caption: 'Workbook structure',
          head: ['Sheet', 'Role'],
          rows: [
            ['Assumptions', 'Market data, WACC build, revenue, margin, capex and working capital drivers'],
            ['Income statement', 'Historicals CY2020A to CY2025A, forecast CY2026E to CY2030E'],
            ['Balance sheet', 'Full statement with a balance check row enforced to zero in forecast years'],
            ['Cash flow statement', 'Indirect method, tied back to the balance sheet cash balance'],
            ['Ratio analysis', 'Growth, profitability, liquidity, leverage, efficiency and a five-step DuPont'],
            ['DCF valuation', 'FCFF build, two terminal value methods, two sensitivity grids'],
          ],
        },
      },
      {
        id: 'revenue-build',
        heading: 'Revenue build',
        paragraphs: [
          'Revenue is modelled as the product of two explicit drivers: consolidated sales volume in million ' +
            'cases, and net realisation per case. It is not modelled as a single top-down growth rate. Historical ' +
            'volume growth runs from 23.8% in CY2021A to 7.9% in CY2025A, and the forecast fades that to 13.5% in ' +
            'CY2026E and 8.0% by CY2030E.',
          'Realisation is held close to flat at roughly 1% growth a year. This is the most conservative assumption ' +
            'in the model, and it is also the most significant one: at the modelled volumes, a 1% change in ' +
            'realisation is worth materially more than a 1% change in volume.',
        ],
        callout: {
          label: 'Mid-year convention',
          text:
            'Free cash flows are discounted using a mid-year convention, so the discount period for CY2026E is ' +
            '0.5 years rather than 1.0. This raises the present value of the explicit forecast relative to ' +
            'end-year discounting.',
        },
      },
      {
        id: 'wacc',
        heading: 'Cost of capital',
        paragraphs: [
          'The discount rate is built from published inputs rather than a single assumed rate, so each component ' +
            'can be assessed separately.',
        ],
        table: {
          caption: 'WACC build-up, capital asset pricing model',
          head: ['Component', 'Value', 'Basis'],
          rows: [
            ['Risk-free rate', '6.75%', 'India 10-year G-Sec, July 2026'],
            ['Equity risk premium', '6.25%', 'Country-risk approach'],
            ['Levered beta', '0.61', 'Indian beverage sector'],
            ['Cost of equity', '10.56%', 'Risk-free + beta x ERP'],
            ['Pre-tax cost of debt', '7.50%', 'AAA-rated post CRISIL upgrade'],
            ['Marginal tax rate', '24.00%', 'Census and past history'],
            ['Weight of equity', '98.63%', 'Capital structure at model date'],
            ['WACC', '10.50%', 'Weighted average'],
          ],
        },
      },
      {
        id: 'valuation',
        heading: 'Valuation',
        paragraphs: [
          'Two terminal value methods are run side by side and averaged, rather than presented as a single answer, ' +
            'because the two disagree by roughly fifty rupees a share.',
        ],
        table: {
          caption: 'Enterprise value to value per share, ₹ crore unless stated',
          head: ['Line', 'Perpetuity growth', 'Exit multiple'],
          rows: [
            ['PV of explicit FCFF, CY2026E to CY2035E', '22,563.02', '22,563.02'],
            ['PV of terminal value', '60,135.70', '76,626.40'],
            ['Enterprise value', '82,698.72', '99,189.42'],
            ['Less: total debt', '(2,024.12)', '(2,024.12)'],
            ['Add: cash and equivalents', '1,998.49', '1,998.49'],
            ['Less: minority interest', '(162.25)', '(162.25)'],
            ['Equity value', '82,510.84', '99,001.54'],
            ['Value per share (₹)', '243.96', '292.72'],
          ],
        },
      },
      {
        id: 'findings',
        heading: 'Findings',
        paragraphs: [
          'The analysis produced four main findings, and only one of them concerns the share price.',
          'The company reduced leverage substantially. Total debt fell from ₹2,693 Cr in CY2020A to ₹2,024 Cr in ' +
            'CY2025A while shareholders\u2019 funds rose from ₹3,524 Cr to ₹19,578 Cr. Net debt moved from ' +
            '₹2,503 Cr to roughly break-even, and interest coverage improved from 2.39x to 22.60x. Debt to equity ' +
            'is 0.10x by CY2025A.',
          'Growth is real but decelerating. Revenue compounded from ₹6,450 Cr to ₹21,685 Cr across the historical ' +
            'window, but the annual growth rate fell from 49.3% in CY2022A to 8.4% in CY2025A. The forecast assumes ' +
            '11% to 15%, which is above the latest actual figure and is therefore an assumption to review.',
          'Working capital moved in the opposite direction to the balance sheet. The cash conversion cycle ' +
            'lengthened from 70.4 days to 81.6 days over the historical window, driven by receivable days rising ' +
            'from 13.7 to 21.0. Growth is absorbing cash at the operating level even as the balance sheet ' +
            'de-levers.',
          'The market price was above the base case value. At ₹430.20, the average DCF value of ₹268.34 implies ' +
            'roughly 43% downside. The model\u2019s own implied multiples at that price, 47.9x earnings and 28.9x ' +
            'EV/EBITDA on CY2025A, show what the market was capitalising.',
        ],
        callout: {
          label: 'Where the valuation is fragile',
          text:
            'The output is highly sensitive to the discount rate. At 13.5% WACC and 4.75% terminal growth, the ' +
            'perpetuity method values the equity at ₹129.83 a share. That range, rather than the ₹268 point ' +
            'estimate, is the most useful output of the exercise.',
        },
      },
      {
        id: 'limitations',
        heading: 'Limitations',
        paragraphs: [
          'The forecast relies on published guidance and consensus for capital expenditure and margin, so it ' +
            'inherits their optimism. Terminal growth of 5.75% for a bottler with exposure to mature markets is ' +
            'generous, and it is stress-tested in the sensitivity grid for that reason.',
          'The exit multiple of 16x EV/EBITDA is an assumption rather than an observed transaction multiple. It is ' +
            'included to show the spread between methods, not as a defensible exit price.',
          'No attempt is made to value growth optionality or a potential re-rating. The gap between the model ' +
            'value and the market price is presented as a finding rather than a recommendation.',
        ],
      },
    ],

    demonstrates: [
      'Building a fully linked three-statement model without plug figures',
      'Converting a business narrative into driver-level assumptions',
      'Constructing WACC from published inputs and defending each one',
      'Running and interpreting two terminal value methods',
      'Testing a valuation for sensitivity rather than presenting a single number',
      'Reporting a modelling result honestly, including where it is fragile',
    ],
  },

  /* ------------------------------------------------------------------ 02 */
  {
    slug: 'loan-default',
    index: '02',
    flagship: false,
    title: 'Loan Default Analysis & Prediction',
    subtitle: 'Credit risk analysis on consumer lending data',
    domain: 'Credit Risk & Financial Analytics',
    accent: 'forest',
    question:
      'Which characteristics of a loan applicant are associated with default, and can those patterns be used to rank borrowers by risk?',

    summary:
      'Feature engineering and classification modelling on high-dimensional borrower data from Home Credit Group, ' +
      'framed around credit risk drivers rather than model architecture.',

    method: [
      'Exploratory data analysis',
      'Feature engineering',
      'Risk driver identification',
      'Classification modelling',
      'Model evaluation',
      'Credit risk interpretation',
    ],

    headline: {
      label: 'Zindi platform competition result',
      value: 'Top 15%',
      unit: 'rank ~70 of 500+',
      context: 'Predictive classification models built with senior practitioners.',
    },

    facts: [
      { label: 'Data source', value: 'Home Credit' },
      { label: 'Records', value: 'High-dimensional' },
      { label: 'Problem type', value: 'Binary classification' },
      { label: 'Platform', value: 'Zindi' },
    ],

    tools: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'EDA'],

    sections: [
      {
        id: 'context',
        heading: 'The question',
        paragraphs: [
          'Consumer lenders price risk with incomplete information. The practical question is not only who ' +
            'defaulted, but which observable applicant characteristics carry real signal about default, and how ' +
            'much of that signal a model can recover.',
          'The work was framed as a credit risk exercise: describe the risk drivers in language a lending team ' +
            'would recognise, then test whether a predictive model adds value beyond those drivers.',
        ],
      },
      {
        id: 'dataset',
        heading: 'Data',
        paragraphs: [
          'The dataset comprises loan applicant records from Home Credit Group, structured for a binary default ' +
            'outcome. It is a wide dataset, with many columns relative to rows in the modelling subsets, which ' +
            'makes feature selection and leakage control the difficult part rather than model choice.',
          'No headline accuracy or AUC figure is quoted on this page. The competition outcome is the only external ' +
            'benchmark available, and it is reported as such.',
        ],
      },
      {
        id: 'approach',
        heading: 'Approach',
        paragraphs: [
          'The workflow followed six steps, with interpretation at each stage rather than only at the end.',
        ],
        steps: [
          {
            title: 'Profiling and missingness',
            detail:
              'Established data types, distributions and missing value structure before any modelling, because ' +
              'in credit data missingness is informative rather than random.',
          },
          {
            title: 'Exploratory analysis',
            detail:
              'Compared default rates across applicant segments to find where the outcome separates, rather than ' +
              'assuming the strongest raw correlations would be the strongest predictors.',
          },
          {
            title: 'Feature engineering',
            detail:
              'Built and transformed features on the high-dimensional borrower dataset, including derived ratios ' +
              'and aggregations intended to express credit behaviour rather than raw fields.',
          },
          {
            title: 'Risk driver identification',
            detail:
              'Ranked engineered features by contribution to identify which patterns are associated with loan ' +
              'default.',
          },
          {
            title: 'Classification modelling',
            detail:
              'Trained predictive classification models to score borrowers by risk, working alongside senior ' +
              'industry practitioners on the Zindi platform.',
          },
          {
            title: 'Evaluation and iteration',
            detail:
              'Assessed model performance on held-out data and iterated on features rather than on ' +
              'hyperparameters alone.',
          },
        ],
      },
      {
        id: 'findings',
        heading: 'Findings',
        paragraphs: [
          'Borrower risk was concentrated in a small subset of engineered signals rather than spread evenly ' +
            'across the feature set. This is consistent with how consumer credit books behave in practice, and it ' +
            'is the reason feature engineering influenced the outcome more than model selection did.',
          'The combined model reached the top 15% of the field on the Zindi platform, ranking around 70th out of ' +
            'more than 500 participants.',
          'The most transferable result was methodological. High-dimensional credit data punishes feature ' +
            'construction done carelessly, and most of the gain came from defining features that describe ' +
            'repayment behaviour rather than from adding model complexity.',
        ],
        callout: {
          label: 'Scope',
          text:
            'This is applied analytics on a public competition dataset, not a production credit scoring system. ' +
            'No credit decision was made using these models, and no lending outcome is claimed.',
        },
      },
      {
        id: 'limitations',
        heading: 'Limitations',
        paragraphs: [
          'Competition leaderboard ranking is a relative measure against a specific field of participants on a ' +
            'specific metric. It is a signal of method quality, not of commercial credit model performance.',
          'The dataset is historical and fixed. It carries no information about how these relationships hold ' +
            'through a credit cycle, which is the most important question for a real risk model.',
          'Fairness and regulatory suitability were outside the scope of the exercise and would be a first-order ' +
            'requirement before any real-world use.',
        ],
      },
    ],

    demonstrates: [
      'Working with high-dimensional and imperfect real-world data',
      'Translating a lending problem into a modelling problem',
      'Feature engineering grounded in domain behaviour',
      'Ranking and interpreting risk drivers',
      'Evaluating a classifier and being precise about what the result does and does not prove',
    ],
  },

  /* ------------------------------------------------------------------ 03 */
  {
    slug: 'jubilant-foodworks',
    index: '03',
    flagship: false,
    title: 'Jubilant Foodworks Ltd.',
    subtitle: 'Five-year working capital decomposition',
    domain: 'Working Capital & Business Finance',
    accent: 'ochre',
    question:
      'Jubilant Foodworks runs a negative working capital model. How much free funding does it generate, and how has that changed over five years?',

    summary:
      'A five-year decomposition of India\u2019s largest QSR operator using CMIE Prowess consolidated data, ' +
      'rebuilding the cash conversion cycle from its components and testing liquidity against benchmark.',

    method: [
      'Working capital analysis',
      'Cash conversion cycle',
      'Ratio analysis',
      'Liquidity benchmarking',
      'Database financial analysis',
      'Managerial recommendations',
    ],

    headline: {
      label: 'Cash conversion cycle, FY2021 to FY2025',
      value: '−109 to −30',
      unit: 'days',
      context: 'A 79-day reduction in the free-funding float over five years.',
    },

    facts: [
      { label: 'Period analysed', value: 'FY21 to FY25' },
      { label: 'Data source', value: 'CMIE Prowess' },
      { label: 'Deck length', value: '16 slides' },
      { label: 'Recommendations', value: '6 ranked' },
    ],

    tools: ['Excel', 'PowerPoint', 'CMIE Prowess', 'Ratio analysis'],

    sections: [
      {
        id: 'context',
        heading: 'The question',
        paragraphs: [
          'Quick service restaurants are one of the few businesses that collect cash before paying for what they ' +
            'sold. Debtor days are close to zero, inventory turns quickly, and scale buys extended supplier ' +
            'credit. The result is negative working capital, a float that funds day-to-day operations rather than ' +
            'consuming cash.',
          'Jubilant Foodworks is India\u2019s largest pizza operator, so it should be a textbook case. The project ' +
            'tested whether that remained true for FY2021 to FY2025, and if not, where the float had gone.',
        ],
        callout: {
          label: 'Why negative working capital works here',
          text:
            'Cash is collected at the counter, so receivables are small. Food is perishable, so inventory cannot ' +
            'sit. And the combined purchasing scale of Domino\u2019s, Popeyes and Dunkin\u2019 historically bought ' +
            'supplier credit measured in months rather than weeks.',
        },
      },
      {
        id: 'data',
        heading: 'Data and method',
        paragraphs: [
          'All figures are drawn from CMIE Prowess consolidated financials for FY2021 to FY2025, non-annualised. ' +
            'The working capital requirement was rebuilt using the cost of sales method so that each component, ' +
            'inventory, receivables and supplier credit, could be examined separately.',
          'The cash conversion cycle is decomposed rather than reported as a single number: inventory conversion ' +
            'period plus receivable collection period, less the payables deferral period.',
        ],
        table: {
          caption: 'Cash conversion cycle components, days',
          head: ['Component', 'FY2021', 'FY2023', 'FY2025'],
          rows: [
            ['Inventory conversion period', '55.18', '47.41', '62.48'],
            ['Receivable collection period', '2.27', '2.32', '4.15'],
            ['Gross operating cycle', '57.45', '49.73', '66.63'],
            ['Payables deferral period', '(166.74)', '(114.85)', '(96.64)'],
            ['Cash conversion cycle', '(109.29)', '(65.12)', '(30.01)'],
          ],
        },
      },
      {
        id: 'analysis',
        heading: 'Analysis',
        paragraphs: [
          'The float remains, but it has reduced by 79 days over five years. The cash conversion cycle narrowed ' +
            'from −109.29 days to −30.01 days. At the observed pace of roughly 16 days a year, it turns positive ' +
            'around FY2027, at which point the business begins funding its own operations.',
          'Three components explain the compression, and they are related to each other.',
        ],
        table: {
          caption: 'Working capital requirement, cost of sales method, ₹ crore',
          head: ['Component', 'FY2021', 'FY2023', 'FY2025'],
          rows: [
            ['Cost per day', '7.80', '12.07', '15.23'],
            ['Inventory conversion cost', '430.39', '572.15', '951.42'],
            ['Receivable collection cost', '17.71', '28.00', '63.19'],
            ['Credit from suppliers', '(1,300.54)', '(1,386.03)', '(1,471.60)'],
            ['Net working capital requirement', '(852.44)', '(785.88)', '(456.98)'],
          ],
        },
        callout: {
          label: 'The three drivers',
          text:
            'Payables deferral fell 70 days (167 to 97) as the newer brands lacked Domino\u2019s bargaining power. ' +
            'Inventory days rose 15 days (47 to 62) as Popeyes required separate cold chain handling. Receivable ' +
            'days doubled (2.27 to 4.15) as aggregator settlement replaced cash at counter.',
        },
      },
      {
        id: 'liquidity',
        heading: 'Liquidity position',
        paragraphs: [
          'A smaller float would matter less if the cash position were strong, and it is not. Cash and bank ' +
            'balances fell from ₹517.46 Cr to ₹101.51 Cr, a reduction of 80%, while trade payables stood at ' +
            'roughly ₹553 Cr.',
          'The ratio picture describes the same position from a different angle. The current ratio halved from ' +
            '0.95 to 0.47 against a benchmark of about 0.78. The quick ratio fell 77% to 0.17. Short-term debt ' +
            'appeared for the first time: zero until FY2024, then ₹68.10 Cr by FY2025, with interest coverage of ' +
            '2.08x against an effectively infinite figure in a previously debt-free business.',
          'There is a reasonable counterargument. A QSR collects cash daily from thousands of stores, so a low ' +
            'quick ratio is less concerning here than in manufacturing. That daily flow is real, but it is not ' +
            'recorded on the balance sheet, and it stops if same-store sales growth turns negative.',
        ],
        table: {
          caption: 'Five-year scorecard, FY2021 against FY2025',
          head: ['Metric', 'FY2021', 'FY2025', 'Change'],
          rows: [
            ['Revenue (₹ Cr)', '3,268.87', '6,104.67', '+86.8%'],
            ['Net working capital (₹ Cr)', '−38.84', '−713.30', 'Widened 18x'],
            ['Cash conversion cycle (days)', '−109.29', '−30.01', '−79 days'],
            ['Current ratio (x)', '0.95', '0.47', '−50%'],
            ['Quick ratio (x)', '0.73', '0.17', '−77%'],
            ['Cash and bank (₹ Cr)', '517.46', '101.51', '−80%'],
            ['Creditor days', '166.74', '96.64', '−42%'],
            ['Short-term debt (₹ Cr)', '0', '68.10', 'First appearance'],
          ],
        },
      },
      {
        id: 'recommendations',
        heading: 'Recommendations',
        paragraphs: [
          'Six actions were ranked by urgency and, where the analysis supports it, by estimated cash impact. The ' +
            'first two carry quantified ranges and the remainder are directional.',
        ],
        table: {
          caption: 'Ranked recommendations',
          head: ['#', 'Action', 'Horizon', 'Estimated impact'],
          rows: [
            ['1', 'Renegotiate supplier terms to extend payables from 97 to 115+ days', 'Immediate', '₹200 to ₹300 Cr'],
            ['2', 'AI-assisted inventory management to cut raw material days from 59 toward 45', '3 to 6 months', '₹80 to ₹150 Cr'],
            ['3', 'Formalise a ₹300 Cr minimum cash reserve policy', 'Policy now', 'Risk shield'],
            ['4', 'Revive dine-in with a targeted lunch offer in the 11am to 3pm window', 'Immediate', 'Margin improvement'],
            ['5', 'Negotiate 48-hour aggregator settlement instead of 3 to 7 days', '6 months', '₹15 to ₹20 Cr'],
            ['6', 'Report Indian and international working capital separately', 'Strategic', 'Clarity'],
          ],
        },
        callout: {
          label: 'Scale check',
          text:
            'The first recommendation is worth more than the entire FY2025 cash balance. That is why supplier ' +
            'terms are treated as the primary lever rather than a cost-saving exercise.',
        },
      },
      {
        id: 'limitations',
        heading: 'Limitations',
        paragraphs: [
          'This is a database-driven analysis of published consolidated financials. It describes what happened to ' +
            'working capital, but it cannot observe the commercial negotiations that caused it.',
          'DP Eurasia is consolidated from FY2024, so Turkey\u2019s higher inflation and interest rate environment ' +
            'is included in the group ratios. This is why the analysis recommends segment-level reporting before ' +
            'drawing conclusions about the Indian business.',
          'The recommendation impacts are estimates from the analysis rather than committed outcomes. The payables ' +
            'extension in particular depends on supplier terms that financial statements cannot show.',
        ],
      },
    ],

    demonstrates: [
      'Decomposing working capital into its components rather than reporting one ratio',
      'Extracting and validating financial data from a commercial database',
      'Reading a business model from its balance sheet and cash cycle',
      'Benchmarking liquidity against a relevant peer set',
      'Turning analysis into ranked and costed management actions',
      'Stating the limitations of a database-led analysis',
    ],
  },
]

export const getProject = (slug) => projects.find((p) => p.slug === slug)
