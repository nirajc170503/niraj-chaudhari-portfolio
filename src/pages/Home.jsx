import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import SelectedWork from '../components/SelectedWork.jsx'
import Experience from '../components/Experience.jsx'
import Education from '../components/Education.jsx'
import Skills from '../components/Skills.jsx'
import Contact from '../components/Contact.jsx'
import Seo from '../components/Seo.jsx'
import { routeSeo } from '../content/seo.js'

export default function Home() {
  return (
    <>
      <Seo {...routeSeo('/')} />
      <Hero />
      <About />
      <SelectedWork />
      <Experience />
      <Education />
      <Skills />
      <Contact />
    </>
  )
}
