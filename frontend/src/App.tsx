import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect } from 'react'
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

// Instantly scrolls to top on every route change — prevents new pages
// from inheriting the scroll offset of the previous page, which would
// leave Framer Motion whileInView elements invisible (off-screen below fold).
function ScrollToTop() {
  const { pathname } = useLocation()
  // useLayoutEffect fires synchronously before the browser paints — this
  // resets scroll BEFORE Framer Motion's IntersectionObserver evaluates
  // whileInView visibility, so top-of-page elements aren't stuck at opacity:0.
  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    document.documentElement.style.scrollBehavior = ''
  }, [pathname])
  return null
}

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
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/"           element={<HomePage />}      />
      <Route path="/faq"        element={<FAQPage />}       />
      <Route path="/team"       element={<SecretariatPage />} />
      <Route path="/committees" element={<CommitteesPage />} />
      <Route path="/committees/:id" element={<CommitteeDetailPage />} />
      <Route path="/guidelines" element={<GuidelinesPage />} />
      <Route path="/schedule"   element={<ComingSoonPage />} />
    </Routes>
    </>
  )
}
