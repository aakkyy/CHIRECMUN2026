import { useRef } from 'react'
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
  const logoRef  = useRef(null)

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
    <nav className={styles.nav}>
      <div className={styles.inner}>

        {/* LEFT — 3D logo + brand name */}
        <div className={styles.brand}>
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
          <a href="/" className={styles.brandName}>CHIREC MUN.</a>
        </div>

        {/* CENTER — links pill */}
        <ul className={styles.linksPill}>
          {links.map((l) => {
            const isActive = location.pathname === l.href
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                >
                  {l.label}
                  {isActive && <span className={styles.dot} />}
                </a>
              </li>
            )
          })}
        </ul>

        {/* RIGHT — CTA */}
        <a href="/#register" className={styles.cta}>Register Now</a>

      </div>
    </nav>
  )
}
