import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './CommitteeMarquee.module.css'
import { COMMITTEES, TYPE_COLORS, TYPE_LABELS, type Committee } from '../data/committees'
import { viewport } from '../lib/motion'

// Row 1 scrolls left — GA, Security, Specialized spread
const ROW_1_IDS = ['unsc', 'who', 'disec', 'copuos', 'unhrc', 'unctad', 'unodc']
// Row 2 scrolls right — Crisis + Press
const ROW_2_IDS = ['jcc', 'loksabha', 'ec', 'bcci', 'sci', 'ip-r', 'ip-p']

function byIds(ids: string[]): Committee[] {
  return ids.map(id => COMMITTEES.find(c => c.id === id)!).filter(Boolean)
}

function CommitteeCard({ committee }: { committee: Committee }) {
  const navigate = useNavigate()
  const tc = TYPE_COLORS[committee.type]

  return (
    /*
     * All hover styling is pure CSS via custom properties — no React state,
     * no re-renders, clicks feel instant.
     */
    <button
      className={styles.card}
      style={{
        ['--type-color' as string]:       `${tc}1)`,
        ['--tc-border' as string]:        `${tc}0.11)`,
        ['--tc-hover-border' as string]:  `${tc}0.48)`,
        ['--tc-glow' as string]:          `${tc}0.16)`,
      }}
      onClick={() => navigate(`/committees/${committee.id}`)}
      aria-label={`View ${committee.name}`}
    >
      <span
        className={styles.badge}
        style={{
          color:       `${tc}0.88)`,
          borderColor: `${tc}0.28)`,
          background:  `${tc}0.07)`,
        }}
      >
        {TYPE_LABELS[committee.type]}
      </span>

      <span className={styles.abbr}>{committee.abbr}</span>
      <span className={styles.name}>{committee.name}</span>
    </button>
  )
}

function MarqueeRow({
  ids,
  reverse = false,
  duration = 38,
}: {
  ids: string[]
  reverse?: boolean
  duration?: number
}) {
  const committees = byIds(ids)
  const doubled = [...committees, ...committees]

  return (
    <div className={styles.rowWrap}>
      <div
        className={`${styles.track} ${reverse ? styles.trackReverse : ''}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((c, i) => (
          <CommitteeCard key={`${c.id}-${i}`} committee={c} />
        ))}
      </div>
    </div>
  )
}

export default function CommitteeMarquee() {
  return (
    <section className={styles.section} id="committees-preview">
      <div className={styles.sectionBg} aria-hidden="true" />

      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ type: 'spring', stiffness: 88, damping: 22 }}
      >
        <p className={styles.eyebrow}>What Awaits You</p>
        <h2 className={styles.title}>The Committees</h2>
        <p className={styles.sub}>14 committees across 5 tracks</p>
      </motion.div>

      <motion.div
        className={styles.marqueeOuter}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.55, delay: 0.18 }}
      >
        <MarqueeRow ids={ROW_1_IDS} duration={38} />
        <MarqueeRow ids={ROW_2_IDS} reverse duration={46} />
      </motion.div>

      <motion.div
        className={styles.footer}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ type: 'spring', stiffness: 88, damping: 22, delay: 0.3 }}
      >
        <a href="/committees" className={styles.viewAll}>
          Explore all 14 committees
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </motion.div>
    </section>
  )
}
