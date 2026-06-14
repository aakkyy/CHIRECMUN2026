import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomeBeacon from '../components/HomeBeacon'
import styles from './RegisterPage.module.css'

const STATS = [
  { num: '14',   label: 'Committees' },
  { num: '600+', label: 'Delegates'  },
  { num: '3',    label: 'Days'       },
  { num: 'XIV',  label: 'Edition'    },
]

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 18, filter: 'blur(6px)' },
  animate:    { opacity: 1, y: 0,  filter: 'blur(0px)' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
})

export default function RegisterPage() {
  return (
    <div className={styles.page}>

      <div className={styles.bgGrad}   aria-hidden="true" />
      <div className={styles.bgGrid}   aria-hidden="true" />
      <div className={styles.bgOrb1}   aria-hidden="true" />
      <div className={styles.bgOrb2}   aria-hidden="true" />

      <Navbar />

      <main className={styles.main}>
        <HomeBeacon />

        {/* ════════════════ HERO ════════════════ */}
        <section className={styles.hero}>

          <motion.p className={styles.eyebrow} {...fadeUp(0.05)}>
            CHIREC MUN 2026 &nbsp;&middot;&nbsp; Edition XIV
          </motion.p>

          <motion.h1 className={styles.headline} {...fadeUp(0.12)}>
            Shape the world.{' '}
            <span className={styles.headlineDim}>Start here.</span>
          </motion.h1>

          <motion.p className={styles.desc} {...fadeUp(0.19)}>
            Three days. Fourteen committees. One chance to represent, reason,
            and resolve on some of the world's most pressing issues.
            Spots are limited and they go fast.
          </motion.p>

          {/* Stats bar */}
          <motion.div className={styles.statsRow} {...fadeUp(0.26)}>
            {STATS.map((s, i) => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
                {i < STATS.length - 1 && <span className={styles.statDivider} aria-hidden="true" />}
              </div>
            ))}
          </motion.div>

          {/* Date band */}
          <motion.div className={styles.dateBand} {...fadeUp(0.32)}>
            <span className={styles.dateBandDot} aria-hidden="true" />
            <span>July 31 – August 2, 2026</span>
            <span className={styles.dateBandSep} aria-hidden="true">·</span>
            <span>CHIREC International School, Hyderabad</span>
          </motion.div>

        </section>

        {/* ════════════════ PHASE CARDS ════════════════ */}
        <motion.section
          className={styles.phases}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
        >
          <div className={styles.phaseGrid}>

            {/* ── Phase 01 ── */}
            <div className={styles.phaseCard}>
              <div className={`${styles.statusStrip} ${styles.statusStripRed}`}>
                <span className={`${styles.dot} ${styles.dotRed}`} />
                Coming Soon
              </div>

              <div className={styles.phaseBody}>
                <span className={styles.phaseNumBg} aria-hidden="true">01</span>

                <div className={styles.phaseContent}>
                  <p className={styles.phaseTag}>Phase 01</p>
                  <h2 className={styles.phaseTitle}>Complete Payment</h2>
                  <p className={styles.phaseDesc}>
                    Secure your delegate seat through the official payment
                    portal. Save your transaction ID. You'll need it for Phase 02.
                  </p>

                  <div className={`${styles.phaseBtn} ${styles.phaseBtnRed}`} aria-disabled="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/>
                    </svg>
                    Pay Registration Fee
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.lockSvg}>
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Connector ── */}
            <div className={styles.phaseConnector}>
              <div className={styles.connLine} />
              <span className={styles.connChip}>then</span>
              <div className={styles.connLine} />
            </div>

            {/* ── Phase 02 ── */}
            <div className={`${styles.phaseCard} ${styles.phaseCardDim}`}>
              <div className={`${styles.statusStrip} ${styles.statusStripAmber}`}>
                <span className={`${styles.dot} ${styles.dotAmber}`} />
                Priority Round Opening Soon
              </div>

              <div className={styles.phaseBody}>
                <span className={`${styles.phaseNumBg} ${styles.phaseNumBgDim}`} aria-hidden="true">02</span>

                <div className={styles.phaseContent}>
                  <p className={styles.phaseTag}>Phase 02</p>
                  <h2 className={`${styles.phaseTitle} ${styles.phaseTitleDim}`}>Registration Form</h2>
                  <p className={styles.phaseDesc}>
                    Tell us who you are, your school, and your top committee
                    choices. Early applicants get first pick. Don't wait.
                  </p>

                  <div className={`${styles.phaseBtn} ${styles.phaseBtnGhost}`} aria-disabled="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Fill Registration Form
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.lockSvg}>
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <p className={styles.contactNote}>
            Questions? Reach us at{' '}
            <a href="mailto:contact.mun@chirec.ac.in" className={styles.contactLink}>contact.mun@chirec.ac.in</a>
            {' '}or DM{' '}
            <a href="https://instagram.com/chirecmun" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>@chirecmun</a>
          </p>

        </motion.section>

      </main>

      <Footer />
    </div>
  )
}
