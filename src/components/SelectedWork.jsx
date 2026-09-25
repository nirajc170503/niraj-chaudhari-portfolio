import { projects } from '../content/projects'
import SectionLabel from './SectionLabel.jsx'
import ProjectCard from './ProjectCard.jsx'

export default function SelectedWork() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="shell py-14 md:py-20">
      <SectionLabel id="projects-heading" label="Projects" />

      <div className="mt-10 space-y-12 md:space-y-14">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} delay={i * 60} />
        ))}
      </div>
    </section>
  )
}
