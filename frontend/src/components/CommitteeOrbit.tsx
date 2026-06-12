import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './CommitteeOrbit.module.css'
import { COMMITTEES, TYPE_COLORS, TYPE_LABELS, type Committee } from '../data/committees'
import { viewport } from '../lib/motion'

// Three rings: inner = big UN bodies, middle = specialized, outer = crisis + press
const INNER_IDS  = ['unsc', 'disec', 'unhrc']
const MIDDLE_IDS = ['who', 'unctad', 'unodc', 'copuos', 'loksabha']
const OUTER_IDS  = ['ec', 'jcc', 'sci', 'bcci', 'ip-r', 'ip-p']

function byId(ids: string[]): Committee[] {
  return ids.map(id => COMMITTEES.find(c => c.id === id)!).filter(Boolean)
}

const INNER  = byId(INNER_IDS)
const MIDDLE = byId(MIDDLE_IDS)
const OUTER  = byId(OUTER_IDS)

interface CommitteePillProps {
  committee: Committee
  radius: number
  angle: number
  duration: number
  reverse: boolean
}

function CommitteePill({ committee, radius, angle, duration, reverse }: CommitteePillProps) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const delay = -(angle / 360) * duration
  const armAnim  = `orbitCW ${duration}s linear ${delay}s infinite ${reverse ? 'reverse' : 'normal'}`
  const termAnim = `orbitCCW ${duration}s linear ${delay}s infinite ${reverse ? 'reverse' : 'normal'}`

  const typeColor = TYPE_COLORS[committee.type]

  return (
    <div
      className={styles.orbitArm}
      style={{ animation: armAnim, animationPlayState: 'var(--play-state)' }}
    >
      <div
        className={styles.pillWrap}
        style={{
          left: `${radius}px`,
          animation: termAnim,
          animationPlayState: 'var(--play-state)',
        }}
      >
        {/* Tooltip */}
        {hovered && (
          <div className={styles.tooltip}>
            <span className={styles.tooltipName}>{committee.name}</span>
            <span
              className={styles.tooltipCat}
              style={{ color: `${typeColor}0.80)`.replace('(', '(') }}
            >
              {TYPE_LABELS[committee.type]}
            </span>
          </div>
        )}

        {/* Pill */}
        <button
          className={styles.pill}
          style={{
            borderColor: hovered
              ? `${typeColor}0.55)`
              : `${typeColor}0.18)`,
            color: hovered
              ? `${typeColor}0.95)`
              : `${typeColor}0.45)`,
            background: hovered
              ? `${typeColor}0.08)`
              : 'transparent',
            boxShadow: hovered
              ? `0 0 18px ${typeColor}0.15), inset 0 1px 0 rgba(255,255,255,0.06)`
              : 'none',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => navigate(`/committees/${committee.id}`)}
          aria-label={`View ${committee.name}`}
        >
          {committee.abbr}
        </button>
      </div>
    </div>
  )
}

interface RingProps {
  committees: Committee[]
  radius: number
  duration: number
  reverse?: boolean
}

function Ring({ committees, radius, duration, reverse = false }: RingProps) {
  const count = committees.length
  return (
    <>
      {committees.map((c, i) => (
        <CommitteePill
          key={c.id}
          committee={c}
          radius={radius}
          angle={(i / count) * 360}
          duration={duration}
          reverse={reverse}
        />
      ))}
    </>
  )
}

export default function CommitteeOrbit() {
  return (
    <section className={styles.section} id="committees-preview">
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ type: 'spring', stiffness: 88, damping: 22 }}
      >
        <p className={styles.eyebrow}>What Awaits You</p>
        <h2 className={styles.title}>The Committees</h2>
        <p className={styles.sub}>
          Fourteen committees. Hover to pause. Click to explore.
        </p>
      </motion.div>

      {/* Orbit stage */}
      <motion.div
        className={styles.stage}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewport}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Ring outlines */}
        <div className={`${styles.ringCircle} ${styles.rc1}`} />
        <div className={`${styles.ringCircle} ${styles.rc2}`} />
        <div className={`${styles.ringCircle} ${styles.rc3}`} />

        {/* Center stat */}
        <div className={styles.centerStat}>
          <span className={styles.centerNum}>14</span>
          <span className={styles.centerLabel}>Committees</span>
        </div>

        {/* Orbit hub */}
        <div className={styles.orbitHub}>
          <Ring committees={INNER}  radius={145} duration={28} />
          <Ring committees={MIDDLE} radius={250} duration={48} reverse />
          <Ring committees={OUTER}  radius={365} duration={68} />
        </div>
      </motion.div>

      {/* CTA link */}
      <motion.div
        className={styles.footer}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ type: 'spring', stiffness: 88, damping: 22, delay: 0.3 }}
      >
        <a href="/committees" className={styles.viewAll}>
          View all committees
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </motion.div>
    </section>
  )
}
