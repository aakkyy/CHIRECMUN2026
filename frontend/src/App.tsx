import { Routes, Route } from 'react-router-dom'
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
import FAQPage from './pages/FAQPage'
import GuidelinesPage from './pages/GuidelinesPage'
import ComingSoonPage from './pages/ComingSoonPage'
import { useReveal } from './hooks/useReveal'

function HomePage() {
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

export default function App() {
  return (
    <Routes>
      <Route path="/"           element={<HomePage />}      />
      <Route path="/faq"        element={<FAQPage />}       />
      <Route path="/team"       element={<ComingSoonPage />} />
      <Route path="/committees" element={<ComingSoonPage />} />
      <Route path="/guidelines" element={<GuidelinesPage />} />
      <Route path="/schedule"   element={<ComingSoonPage />} />
    </Routes>
  )
}
