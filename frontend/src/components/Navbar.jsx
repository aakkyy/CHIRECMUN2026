import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import BlobButton from './BlobButton'
import styles from './Navbar.module.css'
import logoImg from '../assets/logo.png'

const links = [
  { label: 'Home',          to: '/'           },
  { label: 'Meet The Team', to: '/team'        },
  { label: 'Committees',    to: '/committees'  },
  { label: 'Guidelines',    to: '/guidelines'  },
  { label: 'Schedule',      to: '/schedule'    },
  { label: 'FAQs',          to: '/faq'         },
]

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  )
}

export default function Navbar() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const [theme, toggleTheme] = useTheme()

  const handleHomeClick = (e) => {
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

        {/* LEFT — logo + brand name */}
        <div className={styles.brand}>
          <button className={styles.logoBtnWrap} onClick={handleHomeClick} aria-label="Go to homepage">
            <img src={logoImg} alt="CHIREC MUN" className={styles.logoImg} />
          </button>
          <a href="/" className={styles.brandName} onClick={handleHomeClick}>CHIREC MUN</a>
        </div>

        {/* CENTER — links pill — use React Router Link so basename is respected */}
        <ul className={styles.linksPill}>
          {links.map((l) => {
            const isActive = location.pathname === l.to
            return (
              <li key={l.to}>
                <Link to={l.to} className={`${styles.link} ${isActive ? styles.linkActive : ''}`}>
                  {l.label}
                  {isActive && <span className={styles.dot} />}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* RIGHT — theme toggle + CTA */}
        <div className={styles.rightGroup}>
          <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
            <span key={theme} className={styles.themeIcon}>
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </span>
          </button>
          <BlobButton href="/#register" className={styles.cta} variant="red">
            Register Now
          </BlobButton>
        </div>

      </div>
    </nav>
  )
}
