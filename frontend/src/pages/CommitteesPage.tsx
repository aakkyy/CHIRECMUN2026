import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import Navbar from '../components/Navbar'
import BottomBar from '../components/BottomBar'
import styles from './CommitteesPage.module.css'

const COMMITTEES = [
  { id: 'disec',    abbr: 'DISEC',   name: 'Disarmament and International Security Committee', category: 'General Assembly',      type: 'ga' },
  { id: 'unhrc',    abbr: 'UNHRC',   name: 'United Nations Human Rights Council',              category: 'Human Rights',          type: 'ga' },
  { id: 'who',      abbr: 'WHO',     name: 'World Health Organization',                        category: 'Specialized Agency',    type: 'specialized' },
  { id: 'unctad',   abbr: 'UNCTAD',  name: 'UN Conference on Trade and Development',           category: 'Trade & Development',   type: 'specialized' },
  { id: 'loksabha', abbr: 'LS',      name: 'Lok Sabha',                                        category: 'National Legislature',  type: 'crisis' },
  { id: 'unsc',     abbr: 'UNSC',    name: 'United Nations Security Council',                  category: 'Security Council',      type: 'security' },
  { id: 'unodc',    abbr: 'UNODC',   name: 'UN Office on Drugs and Crime',                     category: 'Specialized Agency',    type: 'specialized' },
  { id: 'copuos',   abbr: 'COPUOS',  name: 'Committee on the Peaceful Uses of Outer Space',    category: 'Specialized Committee', type: 'specialized' },
  { id: 'ec',       abbr: 'EC',      name: 'European Council',                                 category: 'Regional Body',         type: 'crisis' },
  { id: 'jcc',      abbr: 'JCC',     name: 'Joint Crisis Cabinet',                             category: 'Crisis Committee',      type: 'crisis' },
  { id: 'sci',      abbr: 'SCI',     name: 'Supreme Court of India',                           category: 'Legal Body',            type: 'crisis' },
  { id: 'bcci',     abbr: 'BCCI',    name: 'Board of Control for Cricket in India',            category: 'Specialized Committee', type: 'crisis' },
  { id: 'ip-r',     abbr: 'IP',      name: 'International Press — Reporters',                  category: 'Press Corps',           type: 'press' },
  { id: 'ip-p',     abbr: 'IP',      name: 'International Press — Photojournalists',           category: 'Press Corps',           type: 'press' },
]

function CommitteeImage({ id, abbr, type }: { id: string; abbr: string; type: string }) {
  const [hasError, setHasError] = useState(true) // start with placeholder until image loads
  const [loaded, setLoaded] = useState(false)

  const typeColors: Record<string, string> = {
    ga:          'rgba(192,57,43,',
    security:    'rgba(139,0,0,',
    specialized: 'rgba(12,38,172,',
    crisis:      'rgba(140,30,10,',
    press:       'rgba(80,80,80,',
  }
  const col = typeColors[type] || typeColors.ga

  return (
    <div className={styles.imgWrap}>
      {/* Actual image — hidden until loaded */}
      <img
        src={`/media/committees/${id}.jpg`}
        alt={abbr}
        className={`${styles.img} ${loaded ? styles.imgLoaded : ''}`}
        onLoad={() => { setHasError(false); setLoaded(true) }}
        onError={() => setHasError(true)}
      />
      {/* Placeholder — visible when image missing */}
      {hasError && (
        <div
          className={styles.imgPlaceholder}
          style={{ background: `linear-gradient(135deg, ${col}0.18) 0%, rgba(4,0,2,0.95) 100%)` }}
        >
          <span className={styles.imgAbbrText}>{abbr}</span>
          <span className={styles.imgUploadHint}>Image Pending</span>
        </div>
      )}
    </div>
  )
}

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 40, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 85, damping: 18, delay: i * 0.055 },
  }),
}

const TYPE_LABELS: Record<string, string> = {
  ga: 'General Assembly', security: 'Security', specialized: 'Specialized',
  crisis: 'Crisis', press: 'Press Corps',
}

export default function CommitteesPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className={styles.page}>
      {/* CSS-only Aura background */}
      <div className={styles.vignette} />
      <div className={`${styles.orb} ${styles.orbRed1}`} />
      <div className={`${styles.orb} ${styles.orbBlue1}`} />
      <div className={`${styles.orb} ${styles.orbRed2}`} />
      <div className={`${styles.orb} ${styles.orbBlue2}`} />
      <div className={`${styles.orb} ${styles.orbCenter}`} />

      <Navbar />

      {/* HERO */}
      <div className={styles.hero}>
        <motion.p className={styles.eyebrow}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >CHIREC MUN 2026</motion.p>

        <h1 className={styles.heroTitle}>
          {['The', 'Committees'].map((word, i) => (
            <motion.span key={word} className={styles.heroWord}
              initial={{ opacity: 0, y: 60, rotateX: -22 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.1 + i * 0.14 }}
            >{word}</motion.span>
          ))}
        </h1>

        <motion.p className={styles.heroSub}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.6 }}
        >14 committees across diplomacy, crisis, law, and press.</motion.p>

        <motion.div className={styles.heroDivider}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.72, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {COMMITTEES.map((c, i) => (
          <motion.div
            key={c.id}
            className={styles.card}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 280, damping: 20 } }}
          >
            <CommitteeImage id={c.id} abbr={c.abbr} type={c.type} />
            <div className={styles.cardBody}>
              <span className={`${styles.tag} ${styles[`tag_${c.type}`]}`}>{c.category}</span>
              <h2 className={styles.cardName}>{c.name}</h2>
              <p className={styles.cardType}>{TYPE_LABELS[c.type]}</p>
            </div>
            <div className={styles.cardGlow} aria-hidden="true" />
          </motion.div>
        ))}
      </div>

      <BottomBar />
    </div>
  )
}
