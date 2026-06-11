import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import BlobButton from './BlobButton'
import styles from './Navbar.module.css'
import logoImg from '@assets/logo.png'

interface NavLink { label: string; to: string }

const links: NavLink[] = [
  { label: 'Home',          to: '/'           },
  { label: 'Meet The Team', to: '/team'        },
  { label: 'Committees',    to: '/committees'  },
  { label: 'Schedule',      to: '/schedule'    },
  { label: 'Guidelines',    to: '/guidelines'  },
  { label: 'FAQs',          to: '/faq'         },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 24)
  })

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
      <div className={styles.glassLayer} aria-hidden="true" />
      <div className={styles.hairline} aria-hidden="true" />

      <div className={styles.inner}>

        {/* LEFT */}
        <div className={styles.brand}>
          <motion.button
            className={styles.logoBtnWrap}
            onClick={handleHomeClick}
            aria-label="Go to homepage"
            whileHover={{ scale: 1.07, rotate: 6 }}
            whileTap={{ scale: 0.92, rotate: -4 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          >
            <span className={styles.logoRing} aria-hidden="true" />
            <img src={logoImg} alt="CHIREC MUN" className={styles.logoImg} />
          </motion.button>
          <a href="/" className={styles.brandName} onClick={handleHomeClick}>
            CHIREC<span className={styles.brandAccent}> MUN</span>
          </a>
        </div>

        {/* CENTER */}
        <ul className={styles.linksPill} onMouseLeave={() => setHovered(null)}>
          {links.map((l) => {
            const isActive = location.pathname === l.to
            return (
              <li key={l.to} className={styles.linkItem}>
                <Link
                  to={l.to}
                  className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                  onMouseEnter={() => setHovered(l.to)}
                >
                  {/* magnetic hover pill — glides between links */}
                  {hovered === l.to && !isActive && (
                    <motion.span
                      layoutId="navHoverPill"
                      className={styles.hoverPill}
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  {/* sliding active pill */}
                  {isActive && (
                    <motion.span
                      layoutId="navActivePill"
                      className={styles.activePill}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {/* label sits above the pill */}
                  <span className={styles.linkLabel}>{l.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* RIGHT */}
        <div className={styles.rightGroup}>
          <BlobButton href="/#register" className={styles.cta} variant="red">
            Register Now
          </BlobButton>
        </div>

      </div>
    </nav>
  )
}
