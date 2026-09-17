import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import SelectedWork from '../components/SelectedWork.jsx'
import Experience from '../components/Experience.jsx'
import Education from '../components/Education.jsx'
import Certificates from '../components/Certificates.jsx'
import Skills from '../components/Skills.jsx'
import Contact from '../components/Contact.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <SelectedWork />
      <Experience />
      <Education />
      <Certificates />
      <Skills />
      <Contact />
    </>
  )
}
