import { motion } from 'framer-motion'
import AnimatedBg from './AnimatedBg'
import styles from './About.module.css'
import { slideLeft, viewport } from '../lib/motion'

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

export default function About() {
  return (
    <section className={`section ${styles.section}`} id="about" style={{ position: 'relative', overflow: 'hidden' }}>
      <AnimatedBg variant="nebula" color="86,204,242" color2="120,55,210" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.grid}>

          <motion.div
            className={styles.left}
            initial="hidden" whileInView="visible" viewport={viewport}
            variants={slideLeft}
          >
            <p className={styles.eyebrow}>Who We Are</p>
            <h2 className={styles.title}>Shaping the Leaders<br />of Tomorrow</h2>
            <p className={styles.body}>
              CHIREC Model United Nations is one of Hyderabad's most prestigious
              student-run conferences, now entering its 14th Edition. Since inception,
              CHIREC MUN has brought together the sharpest young minds to debate the
              world's most pressing issues, build real diplomatic skills, and forge
              connections that last far beyond the conference room.
            </p>
            <p className={styles.body}>
              More than a conference, it is a launchpad. Delegates leave with
              confidence, clarity, and a global perspective that sets them apart.
            </p>
            <motion.a href="#secretariat" className={styles.textLink}
              whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Meet the Secretariat
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.a>
          </motion.div>

          {/* RIGHT — gradient-bordered container like image 5 */}
          <div className={styles.pillarsContainer}>
            <div className={styles.pillarsInner}>
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  className={`${styles.pillarWrap} ${styles[`wrap_${p.variant}`]}`}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewport}
                  transition={{ type: 'spring', stiffness: 80, damping: 20, delay: i * 0.1 }}
                >
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
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
