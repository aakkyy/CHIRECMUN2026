import { Routes, Route, useLocation } from 'react-router-dom'
import { Component, useEffect, useLayoutEffect } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import Countdown from './components/Countdown'
import Secretariat from './components/Secretariat'
import CommitteeMarquee from './components/CommitteeMarquee'
import Location from './components/Location'
import Sponsors from './components/Sponsors'
import Footer from './components/Footer'
import FAQPage from './pages/FAQPage'
import GuidelinesPage from './pages/GuidelinesPage'
import ComingSoonPage from './pages/ComingSoonPage'
import CommitteesPage from './pages/CommitteesPage'
import CommitteeDetailPage from './pages/CommitteeDetailPage'
import SecretariatPage from './pages/SecretariatPage'
import FormsPage from './pages/FormsPage'
import RegisterPage from './pages/RegisterPage'
import { useReveal } from './hooks/useReveal'
import AnnouncementBanner from './components/AnnouncementBanner'

// ── Error boundary — catches render crashes and shows them on screen ──
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error
      return (
        <div style={{
          color: '#fff', padding: '2rem', fontFamily: 'monospace',
          background: '#040002', minHeight: '100vh',
        }}>
          <h1 style={{ color: '#e74c3c', marginBottom: '1rem' }}>React render crash</h1>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#ff6b6b' }}>
            {err.message}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75em', opacity: 0.55, marginTop: '1rem' }}>
            {err.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

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
      <Sponsors />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <>
    <AnnouncementBanner />
    <ScrollToTop />
    <ErrorBoundary>
      <Routes>
        <Route path="/"           element={<HomePage />}      />
        <Route path="/faq"        element={<FAQPage />}       />
        <Route path="/team"       element={<SecretariatPage />} />
        <Route path="/committees" element={<CommitteesPage />} />
        <Route path="/committees/:id" element={<CommitteeDetailPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="/schedule"   element={<ComingSoonPage />} />
        <Route path="/forms"      element={<FormsPage />} />
        <Route path="/register"   element={<RegisterPage />} />
      </Routes>
    </ErrorBoundary>
    </>
  )
}
