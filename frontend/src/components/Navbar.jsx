import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import logoImg from '../assets/logo.png'

const links = [
  { label: 'Home',          href: '/'           },
  { label: 'Meet The Team', href: '/team'        },
  { label: 'Committees',    href: '/committees'  },
  { label: 'Guidelines',    href: '/guidelines'  },
  { label: 'Schedule',      href: '/schedule'    },
  { label: 'FAQs',          href: '/faq'         },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef    = useRef(null)
  const rafRef    = useRef(null)
  const lastY     = useRef(0)
  const currentY  = useRef(0)
  const targetY   = useRef(0)
  const navHeight = useRef(80)
  const logoRef   = useRef(null)

  /* ── spring-physics navbar hide/show ── */
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const SPRING = 0.10
    const DAMPING = 0.78
    let velocity = 0

    function tick() {
      const diff = targetY.current - currentY.current
      velocity = velocity * DAMPING + diff * SPRING
      currentY.current += velocity
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
        targetY.current = 0
      } else if (dy > 0) {
        targetY.current = Math.max(-navHeight.current - 20, targetY.current - dy * 1.2)
      } else {
        targetY.current = Math.min(0, targetY.current - dy * 1.6)
      }
      setScrolled(y > 60)
    }

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

  /* ── 3D logo handlers ── */
  const onLogoMove = (e) => {
    const el = logoRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    el.style.transition = 'none'
    el.style.transform  = `perspective(260px) rotateY(${x * 38}deg) rotateX(${-y * 38}deg) scale(1.14)`
  }

  const onLogoLeave = () => {
    const el = logoRef.current
    if (!el) return
    el.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1)'
    el.style.transform  = 'perspective(260px) rotateY(0deg) rotateX(0deg) scale(1)'
  }

  const onLogoDown = () => {
    const el = logoRef.current
    if (!el) return
    el.style.transition = 'transform 0.1s ease'
    el.style.transform  = 'perspective(260px) rotateY(0deg) rotateX(0deg) scale(0.86)'
  }

  const onLogoUp = () => {
    const el = logoRef.current
    if (!el) return
    el.style.transition = 'transform 0.35s cubic-bezier(0.22,1,0.36,1)'
    el.style.transform  = 'perspective(260px) rotateY(0deg) rotateX(0deg) scale(1)'
    navigate('/')
  }

  return (
    <>
      <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>

          {/* 3D animated logo */}
          <div
            ref={logoRef}
            className={styles.logoBtnWrap}
            onMouseMove={onLogoMove}
            onMouseLeave={onLogoLeave}
            onMouseDown={onLogoDown}
            onMouseUp={onLogoUp}
            role="button"
            tabIndex={0}
            aria-label="Go to homepage"
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          >
            <div className={styles.logoRing} />
            <img src={logoImg} alt="CHIREC MUN" className={styles.logoImg} />
          </div>

          <ul className={styles.links}>
            {links.map((l) => {
              const isActive = location.pathname === l.href
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                  >
                    {l.label}
                  </a>
                </li>
              )
            })}
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
        </div>
      )}
    </>
  )
}
