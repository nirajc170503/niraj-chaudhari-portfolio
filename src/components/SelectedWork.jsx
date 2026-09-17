import { projects } from '../content/projects'
import SectionLabel from './SectionLabel.jsx'
import ProjectCard from './ProjectCard.jsx'

export default function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="shell scroll-mt-24 py-14 md:py-20">
      <SectionLabel id="work-heading" label="Selected work" />

      <div className="mt-10 space-y-12 md:space-y-14">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} delay={i * 60} />
        ))}
      </div>

      <p className="mt-12 text-[0.8125rem] leading-relaxed text-ink-3">
        These are academic and self-directed projects. They demonstrate the methods described, and are not client
        engagements.
      </p>
    </section>
  )
}
