import { useEffect, useState, useRef } from 'react'
import styles from './Navbar.module.css'
import logoImg from '../assets/logo.png'

const links = [
  { label: 'About',       href: '#about' },
  { label: 'Secretariat', href: '#secretariat' },
  { label: 'Conference',  href: '#countdown' },
  { label: 'Location',    href: '#location' },
  { label: 'Contact',     href: '#contact' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const navRef     = useRef(null)
  const rafRef     = useRef(null)
  const lastY      = useRef(0)
  const currentY   = useRef(0)   // current visual offset (px, negative = up)
  const targetY    = useRef(0)   // desired offset
  const navHeight  = useRef(80)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    // Physics constants
    const SPRING    = 0.10   // how fast it chases target
    const DAMPING   = 0.78   // momentum bleed
    let   velocity  = 0

    function tick() {
      // Spring toward targetY
      const diff = targetY.current - currentY.current
      velocity = velocity * DAMPING + diff * SPRING
      currentY.current += velocity

      // Clamp so it never goes above fully hidden or below 0
      currentY.current = Math.max(-navHeight.current - 20, Math.min(0, currentY.current))

      nav.style.transform = `translateX(-50%) translateY(${currentY.current}px)`
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    const onScroll = () => {
      const y  = window.scrollY
      const dy = y - lastY.current
      lastY.current = y

      if (y < 60) {
        // Near top — always show
        targetY.current = 0
      } else if (dy > 0) {
        // Scrolling down: push nav up proportionally
        targetY.current = Math.max(
          -navHeight.current - 20,
          targetY.current - dy * 1.2
        )
      } else {
        // Scrolling up: pull nav back down
        targetY.current = Math.min(0, targetY.current - dy * 1.6)
      }

      setScrolled(y > 60)
    }

    // Store nav height after mount
    navHeight.current = nav.getBoundingClientRect().height || 80

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <a href="#hero" className={styles.brand}>
            <div className={styles.logoWrap}>
              <img src={logoImg} alt="CHIREC MUN" className={styles.logoImg} />
            </div>
            <div className={styles.brandText}>
              <span className={styles.name}>CHIREC MUN</span>
              <span className={styles.edition}>Edition XIV · 2026</span>
            </div>
          </a>

          <ul className={styles.links}>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={styles.link}>{l.label}</a>
              </li>
            ))}
            <li>
              <a href="#register" className={styles.cta}>Register Now</a>
            </li>
          </ul>

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className={styles.mmLink}
               onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#register" className={`${styles.mmLink} ${styles.mmCta}`}
             onClick={() => setMenuOpen(false)}>
            Register Now
          </a>
        </div>
      )}
    </>
  )
}
