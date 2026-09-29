import { describe, expect, it } from 'vitest'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { projects, getProject } from '../src/content/projects.js'
import { bridge, market } from '../src/content/vblModel.js'
import { profile, nav } from '../src/content/profile.js'
import { education, experience, skillGroups } from '../src/content/credentials.js'
import { certificateGroups } from '../src/content/certificates.js'
import { ORIGIN, routeSeo, caseStudySeo, notFoundSeo, absoluteUrl } from '../src/content/seo.js'

/**
 * Structural checks on the content.
 *
 * `projects.js` is a large hand-maintained file, and its rows are rendered with
 * little or no runtime validation. A row that is not an array, or a row with the
 * wrong number of cells, therefore does not fail a build: it throws inside a
 * React render and takes the whole route down. These tests are the cheapest
 * place to catch that, and they run on every commit.
 */

const slugs = projects.map((p) => p.slug)

/**
 * Certificate PDFs that exist in public/ but are deliberately not listed.
 *
 * The issuer and date for these are not recorded anywhere in the repository,
 * and the PDF text does not expose them. Listing them with guessed details
 * would put an unverifiable claim on a CV, so they stay unlisted until someone
 * can supply the real issuer and date. Anything else that turns up here is a
 * bug, and the test below fails on it.
 */
const UNLISTED_CERTIFICATES = new Set([
  '/certificates/excel-essential-training-microsoft-365.pdf',
  '/certificates/learning-data-analytics-foundations.pdf',
  '/certificates/marketing-strategy-case-studies.pdf',
])

/**
 * Every piece of prose a case study renders, as one string. `method` is a list
 * and `headline` is an object of fields, so both are flattened here rather than
 * being concatenated, which would itself produce "[object Object]".
 */
function allCopy(project) {
  return [
    project.summary,
    project.question,
    project.method,
    ...Object.values(project.headline ?? {}),
    ...project.sections.flatMap((section) => [
      ...(section.paragraphs ?? []),
      section.callout?.label,
      section.callout?.text,
      section.heading,
      section.table?.caption,
      ...(section.steps ?? []).flatMap((step) => [step.title, step.body]),
    ]),
  ]
    .flat(Infinity)
    .filter((part) => typeof part === 'string' && part.length > 0)
    .join(' ')
}

describe('the project index', () => {
  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it('uses unique slugs', () => {
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('uses slugs that are safe in a URL', () => {
    for (const slug of slugs) {
      expect(slug, `${slug} should be lowercase and hyphenated`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('orders the projects for the numbered list the home page renders', () => {
    const indexes = projects.map((p) => p.index)
    expect(indexes).toEqual(indexes.toSorted((a, b) => a - b))
    expect(new Set(indexes).size).toBe(indexes.length)
  })
})

describe('getProject', () => {
  it('finds every project by its own slug', () => {
    for (const project of projects) {
      expect(getProject(project.slug)).toBe(project)
    }
  })

  it('returns undefined for an unknown slug, so the route can show a 404', () => {
    expect(getProject('no-such-project')).toBeUndefined()
    expect(getProject(undefined)).toBeUndefined()
  })
})

describe('project fields', () => {
  it('gives every project the fields the layout reads', () => {
    for (const project of projects) {
      for (const field of ['title', 'domain', 'summary', 'question', 'method', 'headline']) {
        expect(project[field], `${project.slug}.${field}`).toBeTruthy()
      }
      expect(project.sections.length, `${project.slug} has sections`).toBeGreaterThan(0)
    }
  })

  it('keeps the summary short enough to work as a meta description', () => {
    for (const project of projects) {
      expect(project.summary.length, `${project.slug}.summary is too long for a meta tag`)
        .toBeLessThan(300)
    }
  })

  it('numbers the sections in the order they are declared', () => {
    for (const project of projects) {
      const ids = project.sections.map((s) => s.id)
      expect(new Set(ids).size, `${project.slug} has duplicate section ids`).toBe(ids.length)
    }
  })
})

describe('case-study tables', () => {
  /**
   * The regression this exists for: a stray header string was left in `rows`,
   * which rendered fine until a route called `.map` on it and the whole case
   * study went blank.
   */
  it('has a row for every table', () => {
    for (const project of projects) {
      for (const section of project.sections) {
        if (!section.table) continue
        expect(section.table.rows.length, `${project.slug}/${section.id}`).toBeGreaterThan(0)
      }
    }
  })

  it('gives every row an array of cells, not a bare value', () => {
    for (const project of projects) {
      for (const section of project.sections) {
        if (!section.table) continue
        for (const [i, row] of section.table.rows.entries()) {
          expect(Array.isArray(row), `${project.slug}/${section.id} row ${i}`).toBe(true)
        }
      }
    }
  })

  it('sizes every row to its own header', () => {
    for (const project of projects) {
      for (const section of project.sections) {
        const { head, rows } = section.table ?? {}
        if (!head) continue
        expect(head.length, `${project.slug}/${section.id} has a header`).toBeGreaterThan(0)
        for (const [i, row] of rows.entries()) {
          expect(row.length, `${project.slug}/${section.id} row ${i} cell count`).toBe(head.length)
        }
      }
    }
  })

  it('names every table, since a caption is its only accessible name', () => {
    for (const project of projects) {
      for (const section of project.sections) {
        if (!section.table) continue
        expect(section.table.caption, `${project.slug}/${section.id} needs a caption`).toBeTruthy()
      }
    }
  })

  it('leaves no cell empty', () => {
    for (const project of projects) {
      for (const section of project.sections) {
        if (!section.table) continue
        for (const [i, row] of section.table.rows.entries()) {
          for (const [j, cell] of row.entries()) {
            expect(
              String(cell ?? '').trim(),
              `${project.slug}/${section.id} cell ${i},${j} is empty`,
            ).not.toBe('')
          }
        }
      }
    }
  })
})

describe('declared figures', () => {
  it('only declares a figure id that a chart is registered for', () => {
    // The registry lives in CaseStudyPage. Duplicated here so the test does not
    // need to render JSX; the runtime check in verify.mjs covers the rest.
    const registered = new Set([
      'revenue-margin',
      'value-per-share',
      'sensitivity-grid',
      'cash-conversion',
      'cash-collapse',
    ])
    for (const project of projects) {
      for (const section of project.sections) {
        if (!section.figure) continue
        expect(registered.has(section.figure), `${project.slug}/${section.id} figure`).toBe(true)
      }
    }
  })
})

describe('prose', () => {
  it('never states the old incorrect 43% downside as the headline figure', () => {
    // The page quotes the average of the two methods, which is 37.6%. The 43%
    // figure is the perpetuity method alone and belongs only beside that label.
    for (const project of projects) {
      for (const section of project.sections) {
        const text = [...(section.paragraphs ?? []), section.callout?.text]
          .filter(Boolean)
          .join(' ')
        expect(text, `${project.slug}/${section.id}`).not.toMatch(/\b43(\.\d+)?%\s+downside/i)
      }
    }
  })

  it('quotes the derived downside rather than a hardcoded one', () => {
    const expected = `${Math.abs(bridge.impliedUpside).toFixed(1)}%`
    const findings = getProject('varun-beverages').sections.find((s) => s.id === 'findings')
    const text = findings.paragraphs.join(' ')
    expect(text).toContain(expected)
  })

  it('keeps every sentence free of doubled punctuation or empty brackets', () => {
    for (const project of projects) {
      const text = allCopy(project)
      expect(text, `${project.slug} has a stray comma`).not.toMatch(/,\s*\./)
      expect(text, `${project.slug} has an empty bracket`).not.toMatch(/\(\s*\)/)
    }
  })

  it('leaks no undefined, NaN or stringified object into the copy', () => {
    // A template literal over an object field renders "[object Object]" in the
    // page, which is the sort of thing that survives review unnoticed.
    for (const project of projects) {
      const text = allCopy(project)
      for (const token of ['undefined', 'NaN', '[object Object]', 'Infinity']) {
        expect(text, `${project.slug} contains "${token}"`).not.toContain(token)
      }
    }
  })

  it('gives every headline the four fields the case-study header renders', () => {
    for (const project of projects) {
      for (const field of ['label', 'value', 'unit', 'context']) {
        expect(project.headline[field], `${project.slug}.headline.${field}`).toBeTruthy()
      }
    }
  })
})

describe('route metadata', () => {
  it('gives every route a distinct title and description', () => {
    const entries = ['/', '/resume'].map((path) => routeSeo(path))
    const titles = entries.map((e) => e.title)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('gives every case study its own metadata', () => {
    const entries = projects.map((project) => caseStudySeo(project))
    for (const field of ['title', 'description', 'path']) {
      const values = entries.map((entry) => entry[field])
      expect(new Set(values).size, `${field} is not unique across case studies`).toBe(
        entries.length,
      )
    }
  })

  it('builds absolute URLs against the single declared origin', () => {
    for (const project of projects) {
      expect(caseStudySeo(project).path).toBe(`/projects/${project.slug}`)
    }
    expect(absoluteUrl('/resume')).toBe(`${ORIGIN}/resume`)
    expect(absoluteUrl('/')).toBe(`${ORIGIN}/`)
  })

  it('marks the 404 as noindex and gives it its own canonical', () => {
    const seo = notFoundSeo('/nope')
    expect(seo.noindex).toBe(true)
    expect(seo.path).toBe('/nope')
  })
})

describe('profile and credentials', () => {
  it('keeps the identity fields the header and hero read', () => {
    for (const field of ['name', 'location', 'headline', 'availability', 'positioning']) {
      expect(profile[field], `profile.${field}`).toBeTruthy()
    }
    expect(profile.targetRoles.length).toBeGreaterThan(0)
  })

  it('has a LinkedIn URL and an email in the profile', () => {
    expect(profile.links.linkedin).toMatch(/^https:\/\//)
    expect(profile.links.email).toMatch(/@/)
  })

  it('points every nav item at a section id that the home page renders', () => {
    // The nav is a list of hashes, and a hash with no matching section is a
    // dead link that only shows up when a visitor clicks it.
    const ids = new Set(
      ['about', 'projects', 'experience', 'education', 'skills', 'contact'],
    )
    for (const item of nav) {
      expect(item.to, `${item.label} target format`).toMatch(/^\/#[a-z]+$/)
      expect(ids.has(item.to.slice(2)), `${item.label} has no matching section`).toBe(true)
    }
  })

  it('describes every experience entry', () => {
    for (const role of experience) {
      expect(role.role, 'role name').toBeTruthy()
      expect(role.organisation, 'organisation').toBeTruthy()
      expect(role.period, 'period').toBeTruthy()
      expect(role.points.length, `${role.organisation} has bullet points`).toBeGreaterThan(0)
    }
  })

  it('describes every education entry', () => {
    for (const item of education) {
      expect(item.qualification, 'qualification').toBeTruthy()
      expect(item.institution, 'institution').toBeTruthy()
      expect(item.period, 'period').toBeTruthy()
    }
  })

  it('gives every skill group some items', () => {
    for (const group of skillGroups) {
      expect(group.items.length, `${group.heading} has no items`).toBeGreaterThan(0)
    }
  })

  it('references a certificate file that is actually published', () => {
    // A missing PDF only fails when a visitor clicks it, which may be months
    // after the change that broke it. The path is checked on disk here.
    for (const group of certificateGroups) {
      for (const item of group.items) {
        expect(item.file, `${item.title} has no file`).toMatch(/^\/certificates\/.+\.pdf$/)
        const onDisk = join('public', item.file)
        expect(existsSync(onDisk), `${item.title} is missing ${onDisk}`).toBe(true)
      }
    }
  })

  it('has no certificate file on disk that nothing links to', () => {
    // `extraFile` counts as linked: a transcript or grade card is attached to
    // its parent certificate rather than listed on its own.
    const referenced = new Set(
      certificateGroups.flatMap((group) =>
        group.items.flatMap((item) => [item.file, item.extraFile].filter(Boolean)),
      ),
    )
    const published = readdirSync('public/certificates')
      .filter((name) => name.endsWith('.pdf'))
      .map((name) => `/certificates/${name}`)

    for (const file of published) {
      if (UNLISTED_CERTIFICATES.has(file)) continue
      expect(referenced.has(file), `${file} is published but never linked`).toBe(true)
    }
  })

  it('does not list a certificate that is not in the allowlist of unlisted files', () => {
    // If a file moves out of the allowlist it must gain real metadata, so the
    // two lists cannot quietly both contain the same name.
    const referenced = new Set(
      certificateGroups.flatMap((group) =>
        group.items.flatMap((item) => [item.file, item.extraFile].filter(Boolean)),
      ),
    )
    for (const file of UNLISTED_CERTIFICATES) {
      expect(referenced.has(file), `${file} is now listed; drop it from the allowlist`).toBe(false)
    }
  })
})

describe('the published model figures quoted in prose', () => {
  it('agrees with the market price the model uses', () => {
    expect(bridge.cmp).toBe(market.price)
  })
})
