import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './CommitteeOrbit.module.css'
import { COMMITTEES, TYPE_COLORS, TYPE_LABELS, type Committee } from '../data/committees'
import { viewport } from '../lib/motion'

const INNER  = ['unsc', 'disec', 'unhrc']
const MIDDLE = ['who', 'unctad', 'unodc', 'copuos', 'loksabha']
const OUTER  = ['ec', 'jcc', 'sci', 'bcci', 'ip-r', 'ip-p']

function byId(ids: string[]): Committee[] {
  return ids.map(id => COMMITTEES.find(c => c.id === id)!).filter(Boolean)
}

interface PillProps {
  committee: Committee
  x: number
  y: number
}

function CommitteePill({ committee, x, y }: PillProps) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const tc = TYPE_COLORS[committee.type]

  return (
    /*
     * THREE separate layers — this is critical for the animation to work:
     *
     * 1. POSITIONER  — absolute position at (x,y), no transform
     * 2. CENTERER    — translate(-50%,-50%) to center pill on the point
     * 3. COUNTER-SPIN — the CSS animation that counter-rotates
     *
     * Mixing translate + animation on the same element breaks the rotation.
     */
    <div className={styles.positioner} style={{ left: x, top: y }}>
      <div className={styles.centerer}>
        <div className={styles.counterSpin}>
          {hovered && (
            <div className={styles.tooltip}>
              <span className={styles.tooltipName}>{committee.name}</span>
              <span className={styles.tooltipCat} style={{ color: `${tc}0.82)` }}>
                {TYPE_LABELS[committee.type]}
              </span>
            </div>
          )}
          <button
            className={styles.pill}
            style={{
              borderColor: hovered ? `${tc}0.60)` : `${tc}0.22)`,
              color:       hovered ? `${tc}0.96)` : `${tc}0.52)`,
              background:  hovered ? `${tc}0.10)` : `${tc}0.03)`,
              boxShadow:   hovered ? `0 0 18px ${tc}0.18), inset 0 1px 0 rgba(255,255,255,0.06)` : 'none',
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
    </div>
  )
}

interface RingProps {
  ids: string[]
  radius: number
  duration: number
  reverse?: boolean
}

function Ring({ ids, radius, duration, reverse = false }: RingProps) {
  const committees = byId(ids)
  const count = committees.length
  const diameter = radius * 2

  return (
    <div
      className={`${styles.ringWrapper} ${reverse ? styles.ringReverse : ''}`}
      style={{
        width:  diameter,
        height: diameter,
        /* Negative margins center the wrapper; transform-origin pivots on the visual center */
        marginLeft: -radius,
        marginTop:  -radius,
        transformOrigin: `${radius}px ${radius}px`,
        /* CSS custom property — propagates to all .counterSpin descendants */
        ['--ring-dur' as string]: `${duration}s`,
      }}
    >
      {committees.map((c, i) => {
        // Start at top (-90°) and spread evenly
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2
        const x = radius + radius * Math.cos(angle)
        const y = radius + radius * Math.sin(angle)
        return <CommitteePill key={c.id} committee={c} x={x} y={y} />
      })}
    </div>
  )
}

export default function CommitteeOrbit() {
  return (
    <section className={styles.section} id="committees-preview">
      {/* Background gradient layer */}
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
        <p className={styles.sub}>Hover to pause · click to explore</p>
      </motion.div>

      {/* Stage — :hover sets --orbit-play: paused on all children */}
      <motion.div
        className={styles.stage}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewport}
        transition={{ type: 'spring', stiffness: 70, damping: 20, delay: 0.15 }}
      >
        {/* Decorative ring outlines */}
        <div className={`${styles.ringOutline} ${styles.ro1}`} />
        <div className={`${styles.ringOutline} ${styles.ro2}`} />
        <div className={`${styles.ringOutline} ${styles.ro3}`} />

        {/* Radial glow at center */}
        <div className={styles.stageGlow} aria-hidden="true" />

        {/* Center stat */}
        <div className={styles.centerStat}>
          <span className={styles.centerNum}>13</span>
          <span className={styles.centerLabel}>Committees</span>
        </div>

        {/* Orbit rings */}
        <Ring ids={INNER}  radius={120} duration={28} />
        <Ring ids={MIDDLE} radius={205} duration={50} reverse />
        <Ring ids={OUTER}  radius={300} duration={72} />
      </motion.div>

      <motion.div
        className={styles.footer}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ type: 'spring', stiffness: 88, damping: 22, delay: 0.3 }}
      >
        <a href="/committees" className={styles.viewAll}>
          View all committees
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </motion.div>
    </section>
  )
}
