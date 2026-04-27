import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import Countdown from './components/Countdown'
import Secretariat from './components/Secretariat'
import Location from './components/Location'
import CTA from './components/CTA'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Countdown />
      <Secretariat />
      <Location />
      <CTA />
      <Contact />
      <Footer />
    </>
  )
}
