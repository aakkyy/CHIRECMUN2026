import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { COMMITTEES, TYPE_COLORS, TYPE_LABELS } from '../data/committees'
import { DAIS } from '../data/dais'
import { AGENDAS } from '../data/agendas'
import { BG_AVAILABLE } from '../data/backgrounds'
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
  name,
  committeeId,
  index,
}: {
  role: string
  name: string
  committeeId: string
  index: number
}) {
  const [loaded, setLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const nameSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return (
    <motion.div
      className={styles.personCard}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18, delay: index * 0.09 }}
    >
      <div className={styles.personPhotoWrap}>
        <picture>
          <source srcSet={`/media/dais/${committeeId}-${nameSlug}.webp`} type="image/webp" />
          <img
            src={`/media/dais/${committeeId}-${nameSlug}.jpg`}
            alt={role}
            loading="eager"
            decoding="async"
            className={`${styles.personPhoto} ${loaded ? styles.personPhotoLoaded : ''}`}
            onLoad={() => { setLoaded(true); setHasError(false) }}
            onError={() => setHasError(true)}
          />
        </picture>
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
        <p className={styles.personName}>{name || 'To Be Announced'}</p>
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <h2 className={styles.sectionTitle}>Meet the EB</h2>
          </motion.div>

          <div className={styles.daisGrid}>
            {(DAIS[committee.id] ?? [
              { role: 'Chairperson',      name: '' },
              { role: 'Vice Chair', name: '' },
              { role: 'Rapporteur',       name: '' },
            ]).map((member, i) => (
              <PersonCard
                key={member.role}
                role={member.role}
                name={member.name}
                committeeId={committee.id}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* ── AGENDA ── */}
        {(() => {
          const agenda = AGENDAS[committee.id]

          // Classified
          if (agenda?.classified) {
            return (
              <motion.section
                className={styles.agendaSection}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 75, damping: 18 }}
              >
                <div className={styles.agendaLeft}>
                  <div className={styles.agendaLine} />
                </div>
                <div className={styles.agendaRight}>
                  <div className={styles.sectionLabel}>
                    <span className={styles.labelDotBlue} />
                    Agenda
                  </div>
                  <h2 className={styles.sectionTitle}>Agenda</h2>
                  <div className={styles.classifiedBox}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(192,57,43,0.7)" strokeWidth="1.8">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span className={styles.classifiedLabel}>CLASSIFIED</span>
                    <p className={styles.classifiedDesc}>The agenda for this committee is not available to the public at this time.</p>
                  </div>
                </div>
              </motion.section>
            )
          }

          // Has items
          if (agenda?.items?.length) {
            return (
              <motion.section
                className={styles.agendaSection}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 75, damping: 18 }}
              >
                <div className={styles.agendaLeft}>
                  <div className={styles.agendaLine} />
                </div>
                <div className={styles.agendaRight}>
                  <div className={styles.sectionLabel}>
                    <span className={styles.labelDotBlue} />
                    {agenda.items.length > 1 ? `${agenda.items.length} Topics` : '1 Topic'}
                  </div>
                  <h2 className={styles.sectionTitle}>Agenda</h2>
                  <div className={styles.agendaItems}>
                    {agenda.items.map((item, i) => (
                      <div key={i} className={styles.agendaItem}>
                        <span className={styles.agendaItemNum}>{String(i + 1).padStart(2, '0')}</span>
                        <p className={styles.agendaItemText}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )
          }

          // Coming Soon fallback
          return (
            <motion.section
              className={styles.agendaSection}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
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
          )
        })()}

        {/* ── BACKGROUND GUIDE ── */}
        {(() => {
          const hasGuide = BG_AVAILABLE.has(committee.id)
          return (
            <motion.section
              className={styles.bgGuideSection}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
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
                  <span className={hasGuide ? styles.labelDot : styles.labelDotBlue} />
                  {hasGuide ? 'Available Now' : 'Coming Soon'}
                </div>
                <h2 className={styles.bgGuideTitle}>Background Guide</h2>
                <p className={styles.sectionDesc}>
                  {hasGuide
                    ? 'Download the Background Guide to prepare for substantive debate. Read it carefully before the conference.'
                    : 'The Background Guide (Study Guide) will be available for download before the conference. It contains all the context delegates need to prepare for substantive debate.'}
                </p>

                {hasGuide ? (
                  <a
                    href={`/media/backgrounds/${committee.id}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.downloadBtnActive}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 15V3M7 10l5 5 5-5M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
                    </svg>
                    Download Background Guide
                  </a>
                ) : (
                  <button className={styles.downloadBtn} disabled>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 15V3M7 10l5 5 5-5M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
                    </svg>
                    Download PDF — Coming Soon
                  </button>
                )}
              </div>

              <div className={styles.bgGuideGlow} />
            </motion.section>
          )
        })()}

      </div>

      <Footer />
    </div>
  )
}
