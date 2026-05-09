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
