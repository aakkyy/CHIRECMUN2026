import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import logoImg from '../assets/logo.png'
import BottomBar from './BottomBar'

const navLinks = [
  { label: 'Home',        href: '#hero' },
  { label: 'About',       href: '#about' },
  { label: 'Secretariat', href: '#secretariat' },
  { label: 'Conference',  href: '#countdown' },
  { label: 'Location',    href: '#location' },
  { label: 'Contact',     href: '#contact' },
]

const delegateLinks = [
  { label: 'FAQs',            to: '/faq' },
  { label: 'Guidelines',      to: '/guidelines' },
  { label: 'Mandatory Forms', to: '/forms' },
  { label: 'Committees',      to: '/committees' },
  { label: 'Schedule',        to: '/schedule' },
]

const IgIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="4" width="20" height="16" rx="2.5" />
    <path d="M2 7l10 7 10-7" />
  </svg>
)

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
)

const CalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="17" rx="2.5" />
    <path d="M8 2v3M16 2v3M3 10h18" />
  </svg>
)

export default function Footer() {
  return (
    <footer className={styles.footer}>

      {/* ── Large faded watermark ── */}
      <span className={styles.watermark} aria-hidden="true">XIV</span>

      {/* ── Main content grid ── */}
      <div className={styles.inner}>

        {/* ── BRAND ── */}
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <div className={styles.logoWrap}>
              <img src={logoImg} alt="CHIREC MUN" className={styles.logoImg} />
            </div>
            <div className={styles.brandText}>
              <a href="/" className={styles.brandName}>CHIREC MUN</a>
              <span className={styles.brandEdition}>Edition XIV</span>
            </div>
          </div>

          <p className={styles.desc}>
            Three days of diplomacy, debate, and discovery. Bringing together
            600+ delegates from across India at CHIREC ISRP Campus.
          </p>

          <div className={styles.motto}>&ldquo;Represent. Reason. Resolve.&rdquo;</div>

          {/* Social icons */}
          <div className={styles.socials}>
            <a
              href="https://instagram.com/chirecmun"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
              aria-label="Instagram"
            >
              <IgIcon />
            </a>
            <a
              href="mailto:contact.mun@chirec.ac.in"
              className={styles.socialBtn}
              aria-label="Email"
            >
              <MailIcon />
            </a>
          </div>

          <a href="#register" className={styles.cta}>
            <span>Register as Delegate</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* ── NAVIGATE ── */}
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span>Navigate</span>
          </div>
          <ul className={styles.linkList}>
            {navLinks.map(l => (
              <li key={l.label}>
                <a href={l.href} className={styles.link}>
                  <span className={styles.linkDot} />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── DELEGATE ── */}
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span>Delegate</span>
          </div>
          <ul className={styles.linkList}>
            {delegateLinks.map(l => (
              <li key={l.label}>
                <Link to={l.to} className={styles.link}>
                  <span className={styles.linkDot} />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── CONTACT ── */}
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span>Contact</span>
          </div>
          <div className={styles.contactList}>
            <a
              href="mailto:contact.mun@chirec.ac.in"
              className={styles.contactItem}
            >
              <span className={styles.contactIcon}><MailIcon /></span>
              <span className={styles.contactText}>
                <span className={styles.contactLabel}>General Enquiries</span>
                contact.mun@chirec.ac.in
              </span>
            </a>
            <a
              href="https://instagram.com/chirecmun"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <span className={styles.contactIcon}><IgIcon /></span>
              <span className={styles.contactText}>
                <span className={styles.contactLabel}>Instagram</span>
                @chirecmun
              </span>
            </a>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}><PinIcon /></span>
              <span className={styles.contactText}>
                <span className={styles.contactLabel}>Venue</span>
                CHIREC ISRP Campus,<br />Serilingampally, Hyderabad
              </span>
            </div>
          </div>
        </div>

        {/* ── EVENT DETAILS ── */}
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span>Event Details</span>
          </div>

          <div className={styles.eventCard}>
            <div className={styles.eventCardGlow} />
            <div className={styles.eventRow}>
              <span className={styles.eventIcon}><CalIcon /></span>
              <div>
                <span className={styles.eventLabel}>Dates</span>
                <span className={styles.eventValue}>July 31 – Aug 2, 2026</span>
              </div>
            </div>
            <div className={styles.eventSep} />
            <div className={styles.eventRow}>
              <span className={styles.eventIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
              </span>
              <div>
                <span className={styles.eventLabel}>Duration</span>
                <span className={styles.eventValue}>3 Days · 14 Committees</span>
              </div>
            </div>
            <div className={styles.eventSep} />
            <div className={styles.eventRow}>
              <span className={styles.eventIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <div>
                <span className={styles.eventLabel}>Theme</span>
                <span className={styles.eventValue}>Represent. Reason. Resolve.</span>
              </div>
            </div>
          </div>

          <div className={styles.editionBadge}>
            <span className={styles.editionNum}>XIV</span>
            <span className={styles.editionText}>Annual Edition</span>
          </div>
        </div>

      </div>

      {/* ── Divider strip with motto ── */}
      <div className={styles.mottoStrip}>
        <div className={styles.mottoLine} />
        <span className={styles.mottoCenter}>CHIREC MUN 2026</span>
        <div className={styles.mottoLine} />
      </div>

      <BottomBar />
    </footer>
  )
}
