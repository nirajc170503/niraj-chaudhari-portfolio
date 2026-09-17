import Reveal from './Reveal.jsx'

/**
 * Section marker. Replaces the previous large display title plus standfirst
 * pair: one clear label is enough for a reader to know where they are.
 */
export default function SectionLabel({ label, id, className = '' }) {
  return (
    <Reveal className={className}>
      <h2 id={id} className="section-label">
        {label}
      </h2>
    </Reveal>
  )
}
