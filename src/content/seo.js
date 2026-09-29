/**
 * Per-route document metadata.
 *
 * A single-page app serves the same `index.html` for every URL, so whatever
 * `index.html` declares applies to all of them. That is why every case study
 * used to be indexed as a duplicate of the home page. This module owns the
 * tags that have to change per route, and the home page's own values in
 * `index.html` are the defaults it falls back to.
 *
 * The origin lives in one place. Hardcoding it in both `index.html` and here
 * would eventually drift, which is exactly the kind of bug that is invisible
 * until a search index has already formed.
 */
export const ORIGIN = 'https://nirajc170503.github.io/niraj-chaudhari-portfolio'

export const SITE_NAME = 'Niraj Chaudhari'

const HOME = {
  title: `${SITE_NAME} | MBA Finance, Financial Analysis, Modelling & Valuation`,
  description:
    'MBA Finance candidate in Pune, India working across financial statement analysis, three-statement modelling, DCF valuation, working capital analysis and credit-risk analytics. Selected modelling and analysis work.',
  path: '/',
  type: 'profile',
  image: '/og-image.png',
}

const ROUTES = {
  '/': HOME,

  '/resume': {
    title: `Resume | ${SITE_NAME}`,
    description:
      'Education, internships, skills and certifications for Niraj Chaudhari, MBA Finance candidate at MIT World Peace University. Includes a one-page PDF download.',
    path: '/resume',
    type: 'profile',
    image: '/og-image.png',
  },
}

/** A case study route, built from the project's own content. */
export function caseStudySeo(project) {
  return {
    title: `${project.title} | ${project.domain} | ${SITE_NAME}`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    type: 'article',
    image: '/og-image.png',
  }
}

/**
 * The 404 route.
 *
 * This is a soft 404: the host answers every path with 200 and the app
 * decides. `noindex` is what actually keeps it out of search results, and a
 * self-referencing canonical alongside it is the combination Google documents
 * for a page that must not be indexed but must still be identified as itself.
 * Pointing a 404 at the home page instead would tell a crawler the missing
 * URL is a duplicate of the home page.
 */
export function notFoundSeo(path) {
  return {
    title: `Page not found | ${SITE_NAME}`,
    description: 'That page does not exist on this site.',
    path: path ?? null,
    type: 'website',
    image: '/og-image.png',
    noindex: true,
  }
}

export function routeSeo(pathname) {
  if (ROUTES[pathname]) return ROUTES[pathname]
  return { ...HOME, path: pathname }
}

export function absoluteUrl(path) {
  // A leading '/' must be trimmed, otherwise `new URL` resolves it against the
  // domain root and drops the repo's subpath (the GitHub Pages project base).
  const relative = path.replace(/^\//, '')
  return new URL(relative, `${ORIGIN}/`).toString()
}
