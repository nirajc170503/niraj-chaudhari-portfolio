import { Link, useLocation, useParams } from 'react-router-dom'
import { projects, getProject } from '../content/projects'
import { caseStudySeo, notFoundSeo } from '../content/seo.js'
import Seo from '../components/Seo.jsx'
import {
  CaseStudyLayout,
  CaseSection,
  CaseStudyFooter,
  Prose,
  Callout,
  DataTable,
  StepList,
} from '../components/CaseStudy.jsx'
import RevenueMarginChart from '../components/charts/RevenueMarginChart.jsx'
import ValuePerShareChart from '../components/charts/ValuePerShareChart.jsx'
import SensitivityGrid from '../components/charts/SensitivityGrid.jsx'
import CashConversionChart from '../components/charts/CashConversionChart.jsx'
import CashCollapseChart from '../components/charts/CashCollapseChart.jsx'
import { Figure } from '../components/charts/chartKit.jsx'

/**
 * Charts are looked up by the `figure` id a section declares, rather than by
 * matching on slug and section id here. The mapping of id to component has to
 * exist somewhere, but keeping the decision in the content means a section can
 * declare which figure it wants and the renderer does not have to know the
 * shape of every case study.
 */
const FIGURES = {
  'revenue-margin': {
    title: 'Revenue and margin, CY2020A–CY2030E',
    subtitle:
      'Solid bars are reported years; outlined bars are the model’s forecast. The margin line is EBITDA margin.',
    source: 'Varun Beverages 3-statement model, Income Statement sheet',
    Chart: RevenueMarginChart,
  },
  'value-per-share': {
    title: 'Value per share against market price',
    subtitle:
      'The two terminal-value methods bracket the headline output. The market price is included as a reference point, not as a valuation.',
    source: 'DCF Valuation sheet, section D',
    Chart: ValuePerShareChart,
  },
  'sensitivity-grid': {
    title: 'Sensitivity of value per share',
    subtitle:
      'Two grids from the model: perpetual growth, and exit EV/EBITDA. The outlined cell in each grid is the base case used in the headline output.',
    source: 'DCF Valuation sheet, sections E and F',
    Chart: SensitivityGrid,
  },
  'cash-conversion': {
    title: 'The float, decomposed',
    subtitle:
      'Upward bars are cash tied up in the operating cycle; the hatched downward bars are supplier credit, which funds it. The line is the net of the two (the cash conversion cycle) and it has risen 79 days in five years.',
    source: 'CMIE Prowess, FY2021–FY2025 · Working Capital Management Analysis',
    Chart: CashConversionChart,
  },
  'cash-collapse': {
    title: 'Where the buffer went',
    subtitle:
      'Cash and bank balances across the five-year window, against the minimum reserve the analysis recommends.',
    source: 'CMIE Prowess · Working Capital Management Analysis',
    Chart: CashCollapseChart,
  },
}

function SectionFigure({ figure }) {
  const entry = FIGURES[figure]
  // A section may declare a figure id with no registered chart. That is a
  // content bug, so it is visible in development rather than rendering nothing.
  if (!entry) {
    if (import.meta.env.DEV) console.warn(`No chart registered for figure "${figure}"`)
    return null
  }
  const { Chart, ...meta } = entry
  return (
    <Figure {...meta}>
      <Chart />
    </Figure>
  )
}

/** Generic section renderer. Content drives the markup. */
function SectionBody({ section }) {
  return (
    <>
      {section.paragraphs?.map((paragraph) => (
        <Prose key={paragraph.slice(0, 40)}>{paragraph}</Prose>
      ))}

      {section.table ? (
        <DataTable caption={section.table.caption} head={section.table.head} rows={section.table.rows} />
      ) : null}

      {section.steps ? <StepList steps={section.steps} /> : null}

      {section.figure ? <SectionFigure figure={section.figure} /> : null}

      {section.callout ? <Callout label={section.callout.label}>{section.callout.text}</Callout> : null}
    </>
  )
}

function nextProjectAfter(slug) {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}

export default function CaseStudyPage({ slug: slugProp }) {
  const params = useParams()
  const slug = slugProp ?? params.slug
  const project = getProject(slug)
  const { pathname } = useLocation()

  if (!project) {
    return (
      <div className="shell py-24 md:py-32">
        <Seo {...notFoundSeo(pathname)} />

        <p className="kicker mb-4 text-navy">Not found</p>
        <h1 className="font-display text-[2rem] tracking-[-0.02em] text-ink md:text-[2.75rem]">
          That case study doesn&rsquo;t exist.
        </h1>
        <p className="prose-note mt-4 max-w-xl">
          There are three projects on this site. The link may be out of date.
        </p>
        <Link
          to="/#projects"
          className="mt-8 inline-flex items-center gap-2 border border-inverse bg-inverse px-5 py-3 font-mono text-xs tracking-[0.12em] text-on-inverse uppercase transition-colors hover:border-navy hover:bg-navy hover:text-paper"
        >
          See selected work →
        </Link>
      </div>
    )
  }

  return (
    <>
      <Seo {...caseStudySeo(project)} />
      <CaseStudyLayout project={project}>
        {project.sections.map((section, i) => (
          <CaseSection key={section.id} id={section.id} index={i + 1} heading={section.heading}>
            <SectionBody section={section} />
          </CaseSection>
        ))}
        <CaseStudyFooter project={project} next={nextProjectAfter(project.slug)} />
      </CaseStudyLayout>
    </>
  )
}
