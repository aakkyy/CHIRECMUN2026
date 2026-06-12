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
      <img
        src={`/media/committees/${id}.jpg`}
        alt={abbr}
        className={`${styles.heroImg} ${loaded ? styles.heroImgLoaded : ''}`}
        onLoad={() => { setLoaded(true); setHasError(false) }}
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div
          className={styles.heroImgPlaceholder}
          style={{ background: `linear-gradient(160deg, ${col}0.22) 0%, rgba(4,0,2,0.98) 100%)` }}
        >
          <span className={styles.heroAbbrBg}>{abbr}</span>
        </div>
      )}
      <div className={styles.heroImgGradient} />
    </div>
  )
}

// ── Dais member card with photo placeholder ───────────────────
function PersonCard({
  role,
  committeeId,
  index,
}: {
  role: string
  committeeId: string
  index: number
}) {
  const [loaded, setLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const roleSlug = role.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')

  return (
    <motion.div
      className={styles.personCard}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ type: 'spring', stiffness: 80, damping: 18, delay: index * 0.09 }}
    >
      <div className={styles.personPhotoWrap}>
        <img
          src={`/media/dais/${committeeId}-${roleSlug}.jpg`}
          alt={role}
          className={`${styles.personPhoto} ${loaded ? styles.personPhotoLoaded : ''}`}
          onLoad={() => { setLoaded(true); setHasError(false) }}
          onError={() => setHasError(true)}
        />
        {(!loaded || hasError) && (
          <div className={styles.personPhotoPlaceholder}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(192,57,43,0.28)" strokeWidth="1.2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
            </svg>
          </div>
        )}
        <div className={styles.personPhotoBorder} />
      </div>

      <div className={styles.personInfo}>
        <span className={styles.personRole}>{role}</span>
        <p className={styles.personName}>To Be Announced</p>
      </div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function CommitteeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const committee = COMMITTEES.find(c => c.id === id)

  useEffect(() => {
    // instant scroll — html{scroll-behavior:smooth} would make this animate visually
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    document.documentElement.style.scrollBehavior = ''
    if (!committee) navigate('/committees')
  }, [id, committee, navigate])

  if (!committee) return null

  return (
    <div className={styles.page}>
      <div className={styles.bg} />

      <Navbar />

      {/* ── HERO ── */}
      <motion.div
        className={styles.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55 }}
      >
        <HeroImage id={committee.id} abbr={committee.abbr} type={committee.type} />

        <div className={styles.heroOverlay}>
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.45 }}
          >
            <Link to="/committees" className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              All Committees
            </Link>
          </motion.div>

          <div className={styles.heroMeta}>
            <motion.span
              className={styles.heroAbbr}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22, duration: 1.0 }}
            >
              {committee.abbr}
            </motion.span>

            <div className={styles.heroMetaContent}>
              <motion.span
                className={`${styles.heroTag} ${styles[`tag_${committee.type}`]}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.45 }}
              >
                {committee.category}
              </motion.span>

              <motion.h1
                className={styles.heroTitle}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.35 }}
              >
                {committee.name}
              </motion.h1>

              <motion.p
                className={styles.heroType}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.52, duration: 0.45 }}
              >
                {TYPE_LABELS[committee.type]} · CHIREC MUN 2026
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── CONTENT ── */}
      <div className={styles.content}>

        {/* ── DAIS ── */}
        <section className={styles.daisSection}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <div className={styles.sectionLabel}>
              <span className={styles.labelDot} />
              Coming Soon
            </div>
            <h2 className={styles.sectionTitle}>Meet the Dais</h2>
            <p className={styles.sectionDesc}>
              The Chairs, Vice Chairs, and Rapporteurs for this committee will be announced closer to the conference.
            </p>
          </motion.div>

          <div className={styles.daisGrid}>
            {['Chairperson', 'Vice Chair', 'Rapporteur'].map((role, i) => (
              <PersonCard
                key={role}
                role={role}
                committeeId={committee.id}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* ── AGENDA ── */}
        <motion.section
          className={styles.agendaSection}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 75, damping: 18 }}
        >
          <div className={styles.agendaLeft}>
            <div className={styles.agendaLine} />
          </div>

          <div className={styles.agendaRight}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelDotBlue} />
              Coming Soon
            </div>
            <h2 className={styles.sectionTitle}>Agenda</h2>
            <p className={styles.sectionDesc}>
              The committee's agenda topic will be released once finalized. Stay tuned for updates on the official topic for debate.
            </p>

            <div className={styles.agendaPlaceholders}>
              {[1].map(n => (
                <div key={n} className={styles.agendaPlaceholder}>
                  <span className={styles.agendaPlaceholderNum}>{n < 10 ? `0${n}` : n}</span>
                  <div className={styles.agendaPlaceholderContent}>
                    <div className={styles.agendaPlaceholderBar} />
                    <div className={styles.agendaPlaceholderBarShort} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── BACKGROUND GUIDE ── */}
        <motion.section
          className={styles.bgGuideSection}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 75, damping: 18, delay: 0.08 }}
        >
          <div className={styles.bgGuideIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(192,57,43,0.82)" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" />
            </svg>
          </div>

          <div className={styles.bgGuideBody}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelDot} />
              Coming Soon
            </div>
            <h2 className={styles.bgGuideTitle}>Background Guide</h2>
            <p className={styles.sectionDesc}>
              The Background Guide (Study Guide) will be available for download before the conference. It contains all the context delegates need to prepare for substantive debate.
            </p>

            <button className={styles.downloadBtn} disabled>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 15V3M7 10l5 5 5-5M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
              </svg>
              Download PDF — Coming Soon
            </button>
          </div>

          <div className={styles.bgGuideGlow} />
        </motion.section>

      </div>

      <BottomBar />
    </div>
  )
}
