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
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

Requires Node 20.19 or later.

## Project structure

```
src/content/      All copy and data
src/components/   UI components and charts
src/pages/        Home, case study, resume, 404
public/           Resume PDF, certificate PDFs, favicon, social image
scripts/          Dev tooling
```

## Deployment

Static SPA. The host needs to rewrite unknown paths to `index.html`, otherwise case study URLs
like `/projects/varun-beverages` will 404. `vercel.json` and `public/_redirects` (Netlify) are
already set up.
