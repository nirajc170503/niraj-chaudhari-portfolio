import { useEffect } from 'react'
import { absoluteUrl } from '../content/seo.js'

/**
 * Applies the metadata for the current route to the document.
 *
 * A single-page app serves the same `index.html` for every URL, so whatever
 * `index.html` declares applies to all of them. That is why every case study
 * used to be indexed as a duplicate of the home page. This component owns the
 * tags that have to change per route; `index.html` seeds all of them, so there
 * is no need to create or remove anything except `robots`.
 *
 * Existing tags are updated in place rather than replaced, so navigating does
 * not churn the head.
 */
function setContent(selector, value) {
  const element = document.head.querySelector(selector)
  // A null value means "this route does not set this tag". Leaving the previous
  // route's value behind would be worse than clearing it, and for `robots` it
  // would actively stop the page being indexed.
  if (value == null) {
    element?.remove()
    return
  }
  if (element) element.setAttribute('content', value)
}

function setHref(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`)
  if (href == null) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

export default function Seo({ title, description, path, type = 'website', image, noindex = false }) {
  useEffect(() => {
    if (title) document.title = title

    const url = path ? absoluteUrl(path) : null

    setContent('meta[name="description"]', description)
    setContent('meta[property="og:title"]', title)
    setContent('meta[property="og:description"]', description)
    setContent('meta[property="og:type"]', type)
    setContent('meta[property="og:url"]', url)
    setContent('meta[property="og:image"]', image)

    setContent('meta[name="twitter:title"]', title)
    setContent('meta[name="twitter:description"]', description)
    setContent('meta[name="twitter:image"]', image)

    setHref('canonical', url)

    // Only the 404 opts out of indexing, and the tag is removed on the way out
    // so that a later visit to a real page is not left marked noindex.
    if (noindex) {
      let robots = document.head.querySelector('meta[name="robots"]')
      if (!robots) {
        robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        document.head.appendChild(robots)
      }
      robots.setAttribute('content', 'noindex, follow')
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove()
    }
  }, [title, description, path, type, image, noindex])

  return null
}
