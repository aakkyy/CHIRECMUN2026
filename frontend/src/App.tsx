import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import Countdown from './components/Countdown'
import Secretariat from './components/Secretariat'
import CommitteeMarquee from './components/CommitteeMarquee'
import Location from './components/Location'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FAQPage from './pages/FAQPage'
import GuidelinesPage from './pages/GuidelinesPage'
import ComingSoonPage from './pages/ComingSoonPage'
import CommitteesPage from './pages/CommitteesPage'
import CommitteeDetailPage from './pages/CommitteeDetailPage'
import SecretariatPage from './pages/SecretariatPage'
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
      <CommitteeMarquee />
      <Location />
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
      <Route path="/team"       element={<SecretariatPage />} />
      <Route path="/committees" element={<CommitteesPage />} />
      <Route path="/committees/:id" element={<CommitteeDetailPage />} />
      <Route path="/guidelines" element={<GuidelinesPage />} />
      <Route path="/schedule"   element={<ComingSoonPage />} />
    </Routes>
  )
}
