# Niraj Chaudhari | Finance Portfolio

I'm an MBA Finance candidate based in Pune, India, working towards financial analysis, corporate
finance, FP&A and credit risk roles. This is my portfolio: a place to show the analysis I've
actually done rather than describe it.

## What's here

- A home page covering intro, projects, experience, education, certificates, skills and contact
- Three case studies, each on its own page with charts:
  - **Varun Beverages**: three-statement financial model and DCF valuation
  - **Loan Default Analysis**: credit risk modelling on consumer lending data
  - **Jubilant Foodworks**: five-year working capital decomposition
- My resume, viewable in the browser and downloadable as a one-page PDF
- Light and dark themes, following your system preference
- Responsive layout that works on phones, tablets and desktops

## Built with

- React 19 with Vite
- Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`)
- react-router-dom
- Hand-written SVG charts, no chart library
- Typefaces: Newsreader, Inter and IBM Plex Mono

## Running it locally

```bash
npm install
npm run dev       # dev server with hot reload
npm run build     # production build into dist/
npm run preview   # serve the production build on :4173
npm run lint      # oxlint
npm run test      # vitest
npm run check     # lint, then test, then build
```

Requires Node 22.4 or later.

## Tests

Unit tests cover the parts where a mistake would be silent and expensive: the financial models and
the content that renders them. If a table cell goes missing or a valuation total drifts, the tests
fail rather than the page quietly showing a wrong number.

```bash
npm run test            # once
npm run test:watch      # on change
npm run test:coverage   # text + html report for src/content
```

`scripts/verify.mjs` is the other half. It drives real Chrome over the DevTools Protocol and
asserts what only shows up in a browser: metadata, heading order, scroll reveals, the responsive
header, table captions, image `srcset` selection, and that the page still makes sense with
JavaScript disabled or the bundle blocked.

```bash
npm run build
npm run preview &
npm run verify          # defaults to http://localhost:4173
npm run check:layout    # 24 layout checks across 5 routes and 4 widths
```

Set `CHROME_PATH` if Chrome is not in the default macOS location. On CI, wait for the preview
server first, then pass the URL explicitly.

`check:layout` is the part that stands in for eyeballing breakpoints. It fails on horizontal page
scroll, elements that overflow the viewport without a scrollable parent, interactive targets under
the WCAG 2.2 minimum of 24px, and text below 12px. It waits for the app to actually mount before
measuring, and treats a page that failed to render as a failure rather than a pass.

### Other scripts

These are dev tools, not part of the build:

- `scripts/shot.mjs` — screenshot a URL at a given width, useful when checking a layout
- `scripts/audit-layout.mjs` — the interactive version of the layout audit; dumps the full report
  including a comfort-preference list that `check:layout` deliberately does not fail on
- `scripts/diagnose.mjs` — dumps computed styles for a selector
- `scripts/og-source.html`, `scripts/resume-one-page.html` — sources for the generated social
  image and one-page resume; regenerate rather than hand-editing the output

## How the numbers stay honest

Financial figures live in `src/content/vblModel.js` and `src/content/jflModel.js` as models, not as
pre-formatted strings. Pages and charts import them and format from the same source, so a change to
a driver propagates instead of needing to be repeated in six places. `tests/` asserts the
relationships between those values.

Case-study copy lives in `src/content/projects.js` and is likewise the single source for the cards,
the page body, the figures and the SEO metadata.

## Resilience

The reader should get something even in bad conditions, so:

- `index.html` contains a self-contained static shell — the name, the summary, the project links
  and the contact details — inside the same `#root` the app mounts to. With JavaScript disabled or
  the bundle blocked, React replaces it and the reader never sees a blank page.
- `index.html` already contains the home page's title, description and canonical URL, so crawlers
  and link previews get them before any script runs.
- Scroll reveals are progressive enhancement: the `.js` class on `<html>` is added by script, so
  content is visible by default and only hidden once the code that reveals it is known to be
  running.
- A render error in one route is caught by `ErrorBoundary` rather than blanking the page.

## Project structure

```
src/content/      All copy, data and the financial models
src/components/   UI components and charts
src/pages/        Home, case study, resume, 404
public/           Resume PDF, certificate PDFs, responsive hero images, favicon, social image
tests/            Vitest suites for the models and content
scripts/          Dev tooling, including the browser verification
```

## Deployment

Static SPA. The host needs to rewrite unknown paths to `index.html`, otherwise case study URLs
like `/projects/varun-beverages` will 404. `vercel.json` and `public/_redirects` (Netlify) are
already set up.

`.github/workflows/ci.yml` runs the same checks on every push and pull request, and follows the
build with the browser verification.
