/**
 * Certificate library. Titles, issuers and dates are read directly from the
 * certificate PDFs themselves. `file` paths resolve to /public/certificates.
 */
export const certificateGroups = [
  {
    id: 'finance-risk',
    heading: 'Finance & Risk',
    items: [
      {
        id: 'finance-foundations',
        title: 'Finance Foundations',
        issuer: 'LinkedIn Learning',
        date: 'Aug 2026',
        file: '/certificates/finance-foundations.pdf',
        topics: ['Corporate finance', 'Financial accounting'],
      },
      {
        id: 'introduction-to-risk-management',
        title: 'Introduction to Risk Management',
        issuer: 'LinkedIn Learning',
        date: 'Jun 2026',
        file: '/certificates/introduction-to-risk-management.pdf',
        topics: ['Finance', 'Financial risk management'],
      },
    ],
  },
  {
    id: 'financial-modelling-excel',
    heading: 'Financial Modelling & Excel',
    items: [
      {
        id: 'excel-for-finance-three-statement-operating-model',
        title: 'Excel for Finance: Building a Three-Statement Operating Model',
        issuer: 'LinkedIn Learning',
        date: 'Jun 2026',
        file: '/certificates/excel-for-finance-three-statement-operating-model.pdf',
        topics: ['Operating models', 'Finance', 'Microsoft Excel'],
      },
      {
        id: 'advanced-excel-fpa',
        title: 'Advanced Excel for Financial Planning and Analysis (FP&A)',
        issuer: 'LinkedIn Learning',
        date: 'Jul 2026',
        file: '/certificates/advanced-excel-fpa.pdf',
        topics: [
          'Financial planning and analysis (FP&A)',
          'Corporate FP&A',
          'Microsoft Excel',
        ],
      },
      {
        id: 'excel-essential-training-microsoft-365',
        title: 'Excel Essential Training (Microsoft 365) (2025)',
        issuer: 'LinkedIn Learning',
        date: 'Jul 2026',
        file: '/certificates/excel-essential-training-microsoft-365.pdf',
        topics: ['Microsoft Excel'],
      },
    ],
  },
  {
    id: 'analytics-visualisation',
    heading: 'Analytics & Visualisation',
    items: [
      {
        id: 'power-bi-essential-training',
        title: 'Power BI Essential Training',
        issuer: 'LinkedIn Learning',
        date: 'Aug 2026',
        file: '/certificates/power-bi-essential-training.pdf',
        topics: ['Business intelligence (BI)', 'Microsoft Power BI'],
      },
      {
        id: 'power-bi-strategic-financial-partner',
        title: 'Using Power BI to be a Strategic Financial Partner',
        issuer: 'LinkedIn Learning',
        date: 'Jun 2026',
        file: '/certificates/power-bi-strategic-financial-partner.pdf',
        topics: ['Finance', 'Strategic financial management', 'Microsoft Power BI'],
      },
      {
        id: 'learning-data-analytics-foundations',
        title: 'Learning Data Analytics: 1 Foundations',
        issuer: 'LinkedIn Learning',
        date: 'Aug 2026',
        file: '/certificates/learning-data-analytics-foundations.pdf',
        topics: ['Data analytics'],
      },
    ],
  },
  {
    id: 'data-ai',
    heading: 'Data & AI',
    items: [
      {
        id: 'great-learning-data-science-engineering',
        title: 'Post Graduate Program in Data Science and Engineering',
        issuer: 'Great Learning',
        date: 'Apr 2024',
        file: '/certificates/great-learning-data-science-certificate.pdf',
        extraFile: '/certificates/great-learning-data-science-transcript.pdf',
        extraLabel: 'Transcript',
        topics: ['Python', 'Machine learning', 'Statistics', 'Data visualisation'],
      },
      {
        id: 'iit-madras-foundation',
        title: 'Foundation Level, BS in Data Science and Applications',
        issuer: 'IIT Madras',
        date: 'Dec 2022',
        file: '/certificates/iit-madras-foundation-certificate.pdf',
        extraFile: '/certificates/iit-madras-foundation-grade-card.pdf',
        extraLabel: 'Grade card',
        topics: ['Programming and data science', 'Mathematics', 'Statistics', 'Python'],
      },
      {
        id: 'ai-in-fintech-essential-training',
        title: 'AI in Fintech Essential Training',
        issuer: 'LinkedIn Learning',
        date: 'Jun 2026',
        file: '/certificates/ai-in-fintech-essential-training.pdf',
        topics: ['AI for business', 'FinTech', 'Artificial intelligence (AI)'],
      },
    ],
  },
  {
    id: 'additional',
    heading: 'Additional coursework',
    items: [
      {
        id: 'marketing-strategy-case-studies',
        title: 'Marketing Strategy: Case Studies from Leading Brands',
        issuer: 'LinkedIn Learning',
        date: 'Feb 2026',
        file: '/certificates/marketing-strategy-case-studies.pdf',
        topics: ['Case studies', 'Marketing strategy'],
      },
    ],
  },
];
