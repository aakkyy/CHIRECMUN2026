import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { COMMITTEES, TYPE_COLORS, TYPE_LABELS, type Committee, type CommitteeType } from '../data/committees'
import styles from './CommitteesPage.module.css'

/* ── type accent config ── */
const TYPE_ACCENT: Record<CommitteeType, { border: string; glow: string; tag: string; bg: string }> = {
  ga:          { border: 'rgba(192,57,43,0.35)',  glow: 'rgba(192,57,43,0.08)',  tag: 'rgba(231,76,60,0.85)',   bg: 'rgba(192,57,43,0.04)'  },
  security:    { border: 'rgba(139,0,0,0.40)',    glow: 'rgba(139,0,0,0.10)',    tag: 'rgba(200,40,40,0.85)',   bg: 'rgba(139,0,0,0.05)'    },
  specialized: { border: 'rgba(12,38,172,0.35)',  glow: 'rgba(12,38,172,0.08)',  tag: 'rgba(86,160,242,0.85)',  bg: 'rgba(12,38,172,0.04)'  },
  crisis:      { border: 'rgba(180,80,10,0.35)',  glow: 'rgba(180,80,10,0.08)',  tag: 'rgba(255,160,60,0.85)',  bg: 'rgba(180,80,10,0.04)'  },
  press:       { border: 'rgba(120,120,120,0.30)',glow: 'rgba(120,120,120,0.06)',tag: 'rgba(200,200,200,0.75)', bg: 'rgba(100,100,100,0.03)' },
}

/* ── preview panel ── */
function Preview({ c }: { c: Committee }) {
  const acc = TYPE_ACCENT[c.type]
  const [imgOk, setImgOk] = useState(false)

  return (
    <motion.div
      key={c.id}
      className={styles.preview}
      initial={{ opacity: 0, x: 18, filter: 'blur(4px)' }}
      animate={{ opacity: 1, x: 0,  filter: 'blur(0px)' }}
      exit={{    opacity: 0, x: -12, filter: 'blur(3px)' }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* image / placeholder */}
      <div className={styles.previewImgWrap} style={{ borderColor: acc.border }}>
        <img
          src={`/media/committees/${c.id}.jpg`}
          alt={c.abbr}
          className={`${styles.previewImg} ${imgOk ? styles.previewImgLoaded : ''}`}
          onLoad={() => setImgOk(true)}
          onError={() => setImgOk(false)}
        />
        {!imgOk && (
          <div className={styles.previewImgPlaceholder} style={{ background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${acc.glow.replace('0.08','0.18')} 0%, rgba(4,0,2,0.96) 100%)` }}>
            <span className={styles.previewAbbrBg} aria-hidden="true">{c.abbr}</span>
            <span className={styles.previewImgPending}>Image Pending</span>
          </div>
        )}
      </div>

      {/* info */}
      <div className={styles.previewInfo}>
        <span
          className={styles.previewTag}
          style={{ color: acc.tag, borderColor: acc.border, background: acc.bg }}
        >
          {c.category}
        </span>

        <h2 className={styles.previewName}>{c.name}</h2>

        <p className={styles.previewType}>{TYPE_LABELS[c.type]}</p>

        <div className={styles.previewDivider} style={{ background: acc.border }} />

        <Link to={`/committees/${c.id}`} className={styles.previewCta} style={{ borderColor: acc.border, color: acc.tag }}>
          View Committee
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </motion.div>
  )
}

/* ── empty state ── */
function EmptyPreview() {
  return (
    <motion.div
      className={styles.previewEmpty}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'rgba(244,244,239,0.12)' }}>
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
      <span>Hover a committee to preview</span>
    </motion.div>
  )
}

/* ── list row ── */
function CommitteeRow({ c, active, onEnter }: { c: Committee; active: boolean; onEnter: () => void }) {
  const acc = TYPE_ACCENT[c.type]
  return (
    <Link
      to={`/committees/${c.id}`}
      className={`${styles.row} ${active ? styles.rowActive : ''}`}
      onMouseEnter={onEnter}
      style={active ? { borderLeftColor: acc.tag } : {}}
    >
      <div className={styles.rowLeft}>
        <span className={styles.rowName}>{c.name}</span>
        <span className={styles.rowAbbr}>{c.abbr}</span>
      </div>
      <span
        className={styles.rowPill}
        style={{ color: acc.tag, borderColor: acc.border, background: acc.bg }}
      >
        {TYPE_LABELS[c.type].split(' ')[0]}
      </span>
      <svg className={styles.rowArrow} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </Link>
  )
}

/* ── page ── */
export default function CommitteesPage() {
  const [active, setActive] = useState<Committee | null>(null)
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className={styles.page}>
      <div className={styles.vignette} />
      <div className={`${styles.orb} ${styles.orbRed1}`} />
      <div className={`${styles.orb} ${styles.orbBlue1}`} />
      <div className={`${styles.orb} ${styles.orbRed2}`} />
      <div className={`${styles.orb} ${styles.orbBlue2}`} />
      <div className={`${styles.orb} ${styles.orbCenter}`} />

      <Navbar />

      {/* ── SHELL: left list + right preview ── */}
      <div className={styles.shell} onMouseLeave={() => setActive(null)}>

        {/* LEFT — scrollable list */}
        <div className={styles.listCol}>
          <div className={styles.listHeader}>
            <p className={styles.listHeaderLabel}>CHIREC MUN 2026</p>
            <p className={styles.listHeaderCount}>
              {COMMITTEES.length} <span>Committees</span>
            </p>
          </div>

          <div className={styles.listBody}>
            {COMMITTEES.map(c => (
              <CommitteeRow
                key={c.id}
                c={c}
                active={active?.id === c.id}
                onEnter={() => setActive(c)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — preview panel */}
        <div className={styles.previewCol}>
          <AnimatePresence mode="wait">
            {active ? <Preview key={active.id} c={active} /> : <EmptyPreview key="empty" />}
          </AnimatePresence>
        </div>

      </div>

      <Footer />
    </div>
  )
}
