import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import BottomBar from '../components/BottomBar'
import HomeBeacon from '../components/HomeBeacon'
import styles from './FormsPage.module.css'

// ── Form definitions ──────────────────────────────────────────
// Place PDFs at: home/static/media/forms/coc.pdf,
//                home/static/media/forms/liability-release.pdf,
//                home/static/media/forms/tech-release.pdf
// Then set available: true for each form.
const forms = [
  {
    tag: 'Required · All delegates',
    title: 'Code of Conduct',
    desc: 'Outlines the behavioural standards all participants are expected to uphold throughout CHIREC MUN 2026. Read thoroughly before the conference.',
    file: '/media/forms/coc.pdf',
    available: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(231,76,60,0.82)" strokeWidth="1.6">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
  {
    tag: 'Required · All delegates',
    title: 'Liability Release Form',
    desc: 'Must be signed and carried on Day 1. Participants under 18 require a parent or guardian signature as well.',
    file: '/media/forms/liability-release.pdf',
    available: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(231,76,60,0.82)" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    tag: 'Required · All delegates',
    title: 'Tech Release Form',
    desc: 'Covers device usage, photography, and recording permissions during the conference. Must be signed and carried on Day 1.',
    file: '/media/forms/tech-release.pdf',
    available: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(231,76,60,0.82)" strokeWidth="1.6">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
]

const titleWords = ['Mandatory', 'Forms']

// Download icon
const DlIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 15V3M7 10l5 5 5-5M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2"/>
  </svg>
)

// Clock icon (coming soon)
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
)

export default function FormsPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className={styles.page}>
      <div className={styles.vignette} />
      <div className={`${styles.orb} ${styles.orbRed1}`} />
      <div className={`${styles.orb} ${styles.orbBlue1}`} />
      <div className={`${styles.orb} ${styles.orbRed2}`} />
      <div className={`${styles.orb} ${styles.orbBlue2}`} />
      <div className={`${styles.orb} ${styles.orbCenter}`} />
      <div className={styles.scanH} />

      <Navbar />

      {/* ── HERO ── */}
      <div className={styles.hero}>
        <HomeBeacon />
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          CHIREC MUN 2026
        </motion.p>

        <h1 className={styles.title}>
          {titleWords.map((word, i) => (
            <motion.span
              key={word}
              className={styles.titleWord}
              initial={{ opacity: 0, y: 55, rotateX: -28 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 82, damping: 15, delay: 0.08 + i * 0.13 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          All delegates must download, sign, and carry the following forms on the first day of the conference.
        </motion.p>

        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.70, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* ── SECRETARIAT NOTICE ── */}
      <motion.div
        className={styles.noticeWrap}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.78, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.notice}>
          <div className={styles.noticeIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(231,76,60,0.85)" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
          </div>
          <p className={styles.noticeText}>
            <strong>Notice from the Secretariat</strong>
            Dear Delegates, please carry a signed copy of the Tech Release Form and the Liability Release Form on the day of the event. Forms that are unsigned or missing will result in delayed registration at the venue.
            <br /><br />
            Thanks,<br />
            CHIREC MUN 2026 Secretariat
          </p>
        </div>
      </motion.div>

      {/* ── FORM CARDS ── */}
      <div className={styles.content}>
        {forms.map((form, i) => (
          <motion.div
            key={form.title}
            className={styles.card}
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.88 + i * 0.10 }}
          >
            <div className={styles.cardIcon}>{form.icon}</div>
            <p className={styles.cardTag}>{form.tag}</p>
            <h2 className={styles.cardTitle}>{form.title}</h2>
            <p className={styles.cardDesc}>{form.desc}</p>

            {form.available ? (
              <a
                href={form.file}
                download
                className={`${styles.downloadBtn} ${styles.downloadBtnActive}`}
              >
                <DlIcon />
                Download PDF
              </a>
            ) : (
              <span className={`${styles.downloadBtn} ${styles.downloadBtnSoon}`}>
                <ClockIcon />
                Uploading Soon
              </span>
            )}
          </motion.div>
        ))}
      </div>

      <BottomBar />
    </div>
  )
}
