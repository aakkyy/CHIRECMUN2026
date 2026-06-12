import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import BlobBg from './BlobBg'
import styles from './About.module.css'
import { viewport } from '../lib/motion'

const pillars = [
  {
    title: 'Represent',
    body: 'Step into the shoes of your nation. Argue its interests, defend its positions, and make your voice heard on the world stage.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
        <line x1="4" y1="22" x2="4" y2="15"/>
      </svg>
    ),
  },
  {
    title: 'Reason',
    body: 'Research deeply. Engage with evidence. Think critically about the most complex global challenges of our time.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    title: 'Resolve',
    body: 'Draft solutions. Build consensus. Leave the room having moved the needle toward something better.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
]

const stats = [
  { num: '14th',   label: 'Edition'    },
  { num: '600+',   label: 'Delegates'  },
  { num: '3',      label: 'Days'       },
]

const leftStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const leftItem = {
  hidden:  { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 90, damping: 20 } },
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 220, damping: 20, mass: 0.5 })
  const sry = useSpring(ry, { stiffness: 220, damping: 20, mass: 0.5 })
  const rotateX = useTransform(srx, (v) => `${v}deg`)
  const rotateY = useTransform(sry, (v) => `${v}deg`)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rx.set(py * -8)
    ry.set(px * 10)
  }

  const onLeave = () => { rx.set(0); ry.set(0) }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <section className={`section ${styles.section}`} id="about" style={{ position: 'relative', overflow: 'hidden' }}>
      <BlobBg variant="nebula" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.grid}>

          {/* LEFT */}
          <motion.div
            className={styles.left}
            initial="hidden" whileInView="visible" viewport={viewport}
            variants={leftStagger}
          >
            <motion.p className={styles.eyebrow} variants={leftItem}>Who We Are</motion.p>

            <motion.h2 className={styles.title} variants={leftItem}>
              Shaping the Leaders<br />of Tomorrow
            </motion.h2>

            <motion.p className={styles.body} variants={leftItem}>
              CHIREC Model United Nations is one of Hyderabad's most prestigious
              student-run conferences, now entering its 14th Edition. Since inception,
              CHIREC MUN has brought together the sharpest young minds to debate the
              world's most pressing issues, build real diplomatic skills, and forge
              connections that last far beyond the conference room.
            </motion.p>

            <motion.p className={styles.body} variants={leftItem}>
              More than a conference, it is a launchpad. Delegates leave with
              confidence, clarity, and a global perspective that sets them apart.
            </motion.p>

            {/* Stats strip */}
            <motion.div className={styles.statsStrip} variants={leftItem}>
              {stats.map((s, i) => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statNum}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                  {i < stats.length - 1 && <span className={styles.statDivider} aria-hidden />}
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={leftItem}
              whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ display: 'inline-flex' }}
            >
              <Link to="/team" className={styles.textLink}>
                Meet the Secretariat
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT — unified glass cards */}
          <motion.div
            className={styles.pillarsStack}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            style={{ perspective: 1100 }}
          >
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewport}
                transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.15 + i * 0.12 }}
                style={{ perspective: 900 }}
              >
                <TiltCard className={styles.pillarWrap}>
                  <div className={styles.pillar}>
                    <div className={styles.iconBox}>{p.icon}</div>
                    <div>
                      <h3 className={styles.pillarTitle}>{p.title}</h3>
                      <p className={styles.pillarBody}>{p.body}</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
