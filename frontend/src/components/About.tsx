import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import BlobBg from './BlobBg'
import styles from './About.module.css'
import { viewport } from '../lib/motion'

const pillars = [
  {
    letter: 'R',
    variant: 'red',
    title: 'Represent',
    body: 'Step into the shoes of your nation. Argue its interests, defend its positions, and make your voice heard on the world stage.',
    sparkle: true,
  },
  {
    letter: 'R',
    variant: 'blue',
    title: 'Reason',
    body: 'Research deeply. Engage with evidence. Think critically about the most complex global challenges of our time.',
    sparkle: false,
  },
  {
    letter: 'R',
    variant: 'mix',
    title: 'Resolve',
    body: 'Draft solutions. Build consensus. Leave the room having moved the needle toward something better.',
    sparkle: false,
  },
]

const leftStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const leftItem = {
  hidden:  { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 90, damping: 20 } },
}

/* 3D tilt card — perspective transform follows the cursor */
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
    rx.set(py * -10)
    ry.set(px * 12)
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

          <motion.div
            className={styles.left}
            initial="hidden" whileInView="visible" viewport={viewport}
            variants={leftStagger}
          >
            <motion.div variants={leftItem} className={styles.eyebrowWrap}>
              <p className={styles.eyebrow}>Who We Are</p>
              <motion.span
                className={styles.eyebrowLine}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewport}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              />
            </motion.div>
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

          {/* RIGHT — gradient-bordered container with 3D-tilt pillar cards */}
          <motion.div
            className={styles.pillarsContainer}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            style={{ perspective: 1100 }}
          >
            <div className={styles.pillarsInner}>
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewport}
                  transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.15 + i * 0.12 }}
                  style={{ perspective: 900 }}
                >
                  <TiltCard className={`${styles.pillarWrap} ${styles[`wrap_${p.variant}`]}`}>
                    <div className={styles.pillar}>
                      {p.sparkle && <span className={styles.sparkle}>✦</span>}
                      <div className={`${styles.icon} ${styles[`icon_${p.variant}`]}`}>
                        {p.letter}
                      </div>
                      <div>
                        <h3 className={styles.pillarTitle}>{p.title}</h3>
                        <p className={styles.pillarBody}>{p.body}</p>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
