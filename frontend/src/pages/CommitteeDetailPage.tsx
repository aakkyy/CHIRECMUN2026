import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import BottomBar from '../components/BottomBar'
import { COMMITTEES, TYPE_COLORS, TYPE_LABELS } from '../data/committees'
import styles from './CommitteeDetailPage.module.css'

// ── Hero image with full-bleed fallback ──────────────────────
function HeroImage({ id, abbr, type }: { id: string; abbr: string; type: string }) {
  const [loaded, setLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const col = TYPE_COLORS[type as keyof typeof TYPE_COLORS] || TYPE_COLORS.ga

  return (
    <div className={styles.heroImgWrap}>
      {/* Real image */}
      <img
        src={`/media/committees/${id}.jpg`}
        alt={abbr}
        className={`${styles.heroImg} ${loaded ? styles.heroImgLoaded : ''}`}
        onLoad={() => { setLoaded(true); setHasError(false) }}
        onError={() => setHasError(true)}
      />
      {/* Placeholder when no image */}
      {hasError && (
        <div
          className={styles.heroImgPlaceholder}
          style={{ background: `linear-gradient(160deg, ${col}0.22) 0%, rgba(4,0,2,0.98) 100%)` }}
        >
          <span className={styles.heroAbbrBg}>{abbr}</span>
        </div>
      )}
      {/* Bottom gradient so text below reads cleanly */}
      <div className={styles.heroImgGradient} />
    </div>
  )
}

// ── "Coming Soon" section card ────────────────────────────────
function ComingSoonCard({ icon, title, description, action }: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <motion.div
      className={styles.csCard}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
    >
      <div className={styles.csIconWrap}>{icon}</div>
      <div className={styles.csBody}>
        <div className={styles.csBadge}>
          <span className={styles.csBadgeDot} />
          Coming Soon
        </div>
        <h3 className={styles.csTitle}>{title}</h3>
        <p className={styles.csDesc}>{description}</p>
        {action && <div className={styles.csAction}>{action}</div>}
      </div>
      <div className={styles.csGlow} aria-hidden="true" />
    </motion.div>
  )
}

export default function CommitteeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const committee = COMMITTEES.find(c => c.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!committee) navigate('/committees')
  }, [id, committee, navigate])

  if (!committee) return null

  return (
    <div className={styles.page}>
      {/* Aura background */}
      <div className={styles.vignette} />
      <div className={`${styles.orb} ${styles.orbRed1}`} />
      <div className={`${styles.orb} ${styles.orbBlue1}`} />
      <div className={`${styles.orb} ${styles.orbRed2}`} />

      <Navbar />

      {/* ── HERO IMAGE SECTION ── */}
      <motion.div
        className={styles.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HeroImage id={committee.id} abbr={committee.abbr} type={committee.type} />

        {/* Overlay content */}
        <div className={styles.heroOverlay}>
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link to="/committees" className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              All Committees
            </Link>
          </motion.div>

          {/* Committee identity */}
          <div className={styles.heroMeta}>
            <motion.span
              className={`${styles.heroTag} ${styles[`tag_${committee.type}`]}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {committee.category}
            </motion.span>

            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.38 }}
            >
              {committee.name}
            </motion.h1>

            <motion.p
              className={styles.heroType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              {TYPE_LABELS[committee.type]} · CHIREC MUN 2026
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* ── THREE SECTIONS ── */}
      <div className={styles.sections}>

        {/* 1. DAIS */}
        <ComingSoonCard
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(231,76,60,0.75)" strokeWidth="1.5">
              <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
              <circle cx="19" cy="7" r="2"/><path d="M23 21v-1a2 2 0 00-2-2h-2"/>
            </svg>
          }
          title="Dais"
          description="The Chairs, Vice Chairs, and Rapporteurs for this committee will be announced soon. Check back closer to the conference."
        />

        {/* 2. AGENDA */}
        <ComingSoonCard
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(86,160,242,0.75)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M8 12h8M8 8h8M8 16h5"/>
            </svg>
          }
          title="Agenda"
          description="The committee's agenda topics will be released once finalized. Stay tuned for updates."
        />

        {/* 3. BACKGROUND GUIDE */}
        <ComingSoonCard
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(192,57,43,0.75)" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/>
            </svg>
          }
          title="Background Guide"
          description="The Background Guide (Study Guide) for this committee will be available for download before the conference. It will be a PDF document."
          action={
            <button className={styles.downloadBtn} disabled>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 15V3M7 10l5 5 5-5M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2"/>
              </svg>
              Download PDF — Coming Soon
            </button>
          }
        />
      </div>

      <BottomBar />
    </div>
  )
}
