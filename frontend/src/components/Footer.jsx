import styles from './Footer.module.css'
import logoImg from '../assets/logo.png'
import BottomBar from './BottomBar'

const col1 = [
  { label: 'Home',        href: '#hero' },
  { label: 'About',       href: '#about' },
  { label: 'Secretariat', href: '#secretariat' },
  { label: 'Conference',  href: '#countdown' },
  { label: 'Contact',     href: '#contact' },
]

const col2 = [
  { label: 'Location',   href: '#location' },
  { label: 'Instagram',  href: 'https://instagram.com/chirecmun', external: true },
  { label: 'Email Us',   href: 'mailto:contact.mun@chirec.ac.in', external: true },
  { label: 'Register',   href: '#register' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* LEFT — brand */}
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <img src={logoImg} alt="CHIREC MUN" className={styles.logoImg} />
            <span className={styles.brandName}>CHIREC MUN.</span>
          </div>
          <p className={styles.desc}>
            Three days of diplomacy,<br />
            debate, and discovery.<br />
            July 31 – Aug 2, 2026.
          </p>
          <a href="#register" className={styles.cta}>Register as Delegate</a>
        </div>

        {/* COL 1 */}
        <ul className={styles.linkCol}>
          {col1.map(l => (
            <li key={l.label}>
              <a href={l.href} className={styles.link}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* COL 2 */}
        <ul className={styles.linkCol}>
          {col2.map(l => (
            <li key={l.label}>
              <a href={l.href} className={styles.link}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

      </div>

      <BottomBar />
    </footer>
  )
}
