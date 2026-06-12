import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import BlobButton from './BlobButton'
import styles from './Navbar.module.css'
import logoImg from '@assets/logo.png'

interface NavLink { label: string; to: string }

const links: NavLink[] = [
  { label: 'Home',          to: '/'           },
  { label: 'Meet The Team', to: '/team'        },
  { label: 'Committees',    to: '/committees'  },
  { label: 'Schedule',      to: '/schedule'    },
]

const menuItems: NavLink[] = [
  { label: 'Guidelines',      to: '/guidelines' },
  { label: 'FAQs',            to: '/faq'        },
  { label: 'Mandatory Forms', to: '/forms'      },
]

export default function Navbar() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [hovered,  setHovered]  = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 24)
  })

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [menuOpen])

  // Close on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

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
                  {hovered === l.to && !isActive && (
                    <motion.span
                      layoutId="navHoverPill"
                      className={styles.hoverPill}
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="navActivePill"
                      className={styles.activePill}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className={styles.linkLabel}>{l.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* RIGHT */}
        <div className={styles.rightGroup}>

          {/* Hamburger — Guidelines / FAQs / Mandatory Forms */}
          <div className={styles.menuWrap} ref={menuRef}>
            <motion.button
              className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnOpen : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="More pages"
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              <span className={styles.menuLine} />
              <span className={styles.menuLine} />
              <span className={styles.menuLine} />
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className={styles.menuDropdown}
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                >
                  {menuItems.map((item, i) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.055, duration: 0.22 }}
                    >
                      <Link
                        to={item.to}
                        className={`${styles.menuItem} ${location.pathname === item.to ? styles.menuItemActive : ''}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className={styles.menuItemDot} />
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <BlobButton href="/#register" className={styles.cta} variant="red">
            Register Now
          </BlobButton>
        </div>

      </div>
    </nav>
  )
}
