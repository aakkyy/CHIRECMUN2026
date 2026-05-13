import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>

        {/* LEFT */}
        <div className={styles.brand}>
          <button className={styles.logoBtnWrap} onClick={handleHomeClick} aria-label="Go to homepage">
            <img src={logoImg} alt="CHIREC MUN" className={styles.logoImg} />
          </button>
          <a href="/" className={styles.brandName} onClick={handleHomeClick}>CHIREC MUN</a>
        </div>

        {/* CENTER */}
        <ul className={styles.linksPill}>
          {links.map((l) => {
            const isActive = location.pathname === l.to
            return (
              <li key={l.to} className={styles.linkItem}>
                <Link
                  to={l.to}
                  className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                >
                  {/* sliding background pill */}
                  {isActive && (
                    <motion.span
                      layoutId="navActivePill"
                      className={styles.activePill}
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
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
