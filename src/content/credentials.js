/**
 * Experience, education, and skills.
 * Sourced from the résumé, the LinkedIn profile export, and the certificate
 * PDFs in the workspace. No dates, issuers or titles are inferred.
 */

export const experience = [
  {
    role: 'Finance Intern',
    organisation: 'Defiance Knitting Industries Pvt. Ltd.',
    location: 'Ambernath, Mumbai',
    period: 'June 2026 to July 2026',
    type: 'Internship',
    points: [
      'Assisted the finance team using the company\u2019s ERP system.',
      'Studied the company\u2019s B2B manufacturing model and its recently launched D2C brand to understand the business strategy behind the move.',
    ],
    skills: ['ERP systems', 'B2B manufacturing', 'D2C strategy', 'Business model analysis'],
  },
  {
    role: 'Data Science Intern',
    organisation: 'Datamind Labs',
    location: null,
    period: 'January 2025 to February 2025',
    type: 'Internship',
    points: [
      'Processed and engineered features on high-dimensional borrower datasets, identifying key risk drivers and patterns associated with loan defaults.',
      'Collaborated with senior industry professionals to develop predictive classification models on the Zindi platform, achieving a Top 15% ranking (rank ~70 of 500+ participants).',
    ],
    skills: ['Feature engineering', 'Credit risk', 'Classification models', 'Python'],
  },
]

export const education = [
  {
    qualification: 'MBA, Finance',
    institution: 'MIT World Peace University',
    location: 'Pune, India',
    period: 'July 2025 to July 2027 (expected)',
    grade: { label: 'CGPA', value: '8.31' },
    coursework: [
      'Corporate Finance',
      'Financial Modelling',
      'Corporate Valuation',
      'Financial Statement Analysis',
    ],
  },
  {
    qualification: 'Post Graduate Program in Data Science and Engineering',
    institution: 'Great Learning',
    location: 'Pune, India',
    period: 'August 2023 to May 2024',
    grade: null,
    coursework: [
      'Python',
      'Pandas and NumPy',
      'Statistics',
      'Machine Learning',
      'Supervised Learning',
      'Unsupervised Learning',
      'Time Series Forecasting',
    ],
  },
  {
    qualification: 'BBA, Finance',
    institution: 'Savitribai Phule Pune University',
    location: 'Pune, India',
    period: 'June 2020 to July 2023',
    grade: { label: 'CGPA', value: '9.11' },
    coursework: [],
  },
  {
    qualification: 'Foundation Level, Programming and Data Science',
    institution: 'IIT Madras Degree Program (CODE)',
    location: null,
    period: 'January 2022 to December 2022',
    grade: { label: 'CGPA', value: '7.8' },
    coursework: [
      'Computational Thinking',
      'Mathematics for Data Science',
      'Statistics for Data Science',
      'Programming in Python',
    ],
  },
]

export const skillGroups = [
  {
    id: 'finance',
    heading: 'Finance',
    primary: true,
    note: 'The core of the work.',
    items: [
      'Financial Statement Analysis',
      'Financial Modelling',
      'Valuation',
      'DCF',
      'Relative Valuation',
      'Ratio Analysis',
      'Corporate Finance',
      'Credit Risk Assessment',
    ],
  },
  {
    id: 'analytics',
    heading: 'Analytics & Tools',
    primary: false,
    note: 'Applied to support the finance work.',
    items: [
      'Excel',
      'Python',
      'Pandas',
      'NumPy',
      'Power BI',
      'Statistical Analysis',
      'Exploratory Data Analysis',
      'Predictive Modelling',
      'Forecasting',
    ],
  },
  {
    id: 'professional',
    heading: 'Professional',
    primary: false,
    note: 'What the work requires around the analysis.',
    items: [
      'Analytical Problem Solving',
      'Critical Thinking',
      'Communication',
      'Time Management',
      'Adaptability',
    ],
  },
]
