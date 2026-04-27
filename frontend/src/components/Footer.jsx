import styles from './Footer.module.css'
import logoImg from '../assets/logo.png'

const quickLinks = [
  { label: 'Home',         href: '#hero' },
  { label: 'About',        href: '#about' },
  { label: 'Secretariat',  href: '#secretariat' },
  { label: 'Conference',   href: '#countdown' },
  { label: 'Location',     href: '#location' },
  { label: 'Contact',      href: '#contact' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        <div className={styles.brand}>
          <div className={styles.brandTop}>
            <img src={logoImg} alt="CHIREC MUN Logo" className={styles.logoImg} />
            <div>
              <p className={styles.name}>CHIREC MUN 2026</p>
              <p className={styles.slogan}>Represent. Reason. Resolve.</p>
            </div>
          </div>
          <p className={styles.copy}>&copy; 2026 CHIREC Model United Nations. All rights reserved.</p>
          <p className={styles.dev}>
            Developed by{' '}
            <a href="https://instagram.com/akshajvelpula" target="_blank" rel="noopener noreferrer" className={styles.devLink}>Akshaj Velpula</a>
            {' '}and{' '}
            <a href="https://instagram.com/tirumalai.aditya" target="_blank" rel="noopener noreferrer" className={styles.devLink}>Aditya Tirumalai</a>
          </p>
        </div>

        <div className={styles.col}>
          <p className={styles.colHead}>Quick Links</p>
          <ul className={styles.linkList}>
            {quickLinks.map((l) => (
              <li key={l.label}><a href={l.href} className={styles.footLink}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <p className={styles.colHead}>Details</p>
          <ul className={styles.detailList}>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>CHIREC International School, Serilingampalle</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <span>July 31, Aug 1 &amp; 2, 2026</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
              </svg>
              <a href="mailto:contact.mun@chirec.ac.in" className={styles.footLink}>contact.mun@chirec.ac.in</a>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
              <a href="https://instagram.com/chirecmun" target="_blank" rel="noopener noreferrer" className={styles.footLink}>@chirecmun</a>
            </li>
          </ul>
        </div>

      </div>

      <div className={styles.bar}>
        Edition XIV &nbsp;&bull;&nbsp; Represent. Reason. Resolve.
      </div>
    </footer>
  )
}
