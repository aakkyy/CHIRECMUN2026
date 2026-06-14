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

const blurIn = (delay = 0) => ({
  initial:    { opacity: 0, filter: 'blur(8px)', y: 14 },
  animate:    { opacity: 1, filter: 'blur(0px)',  y: 0  },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
})

export default function RegisterPage() {
  return (
    <div className={styles.page}>

      {/* ── background ── */}
      <div className={styles.bgGrad} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.bgOrb1} aria-hidden="true" />
      <div className={styles.bgOrb2} aria-hidden="true" />

      <Navbar />

      <main className={styles.main}>
        <HomeBeacon />

        <div className={styles.split}>

          {/* ══════════════ LEFT ══════════════ */}
          <div className={styles.left}>

            <motion.p className={styles.eyebrow} {...blurIn(0.05)}>
              CHIREC MUN 2026 &nbsp;·&nbsp; Edition XIV
            </motion.p>

            <motion.h1 className={styles.headline} {...blurIn(0.12)}>
              Shape the world.<br />
              <span className={styles.headlineDim}>Start here.</span>
            </motion.h1>

            <motion.p className={styles.desc} {...blurIn(0.20)}>
              Three days. Fourteen committees. One chance to represent, reason,
              and resolve on some of the world's most pressing issues.
              Spots are limited — and they go fast.
            </motion.p>

            {/* Stats */}
            <motion.div className={styles.statsGrid} {...blurIn(0.28)}>
              {STATS.map(s => (
                <div key={s.label} className={styles.statBox}>
                  <span className={styles.statNum}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Date bar */}
            <motion.div className={styles.dateBar} {...blurIn(0.36)}>
              <span className={styles.dateBarLabel}>Conference Dates</span>
              <span className={styles.dateBarValue}>July 31 – August 2, 2026</span>
              <span className={styles.dateBarVenue}>CHIREC International School, Hyderabad</span>
            </motion.div>

          </div>

          {/* ══════════════ RIGHT ══════════════ */}
          <motion.div
            className={styles.right}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          >

            <p className={styles.rightEyebrow}>Registration — Two Phases</p>

            {/* ── Phase 01 ── */}
            <div className={styles.phaseCard}>
              {/* status strip */}
              <div className={`${styles.statusStrip} ${styles.statusStripSoon}`}>
                <span className={styles.statusDot} />
                <span>Coming Soon</span>
              </div>

              <div className={styles.phaseInner}>
                {/* big number */}
                <span className={styles.phaseNumBg} aria-hidden="true">01</span>

                <div className={styles.phaseContent}>
                  <div className={styles.phaseLeft}>
                    <span className={styles.phaseLabel}>Phase 01</span>
                    <h3 className={styles.phaseTitle}>Complete Payment</h3>
                    <p className={styles.phaseDesc}>
                      Secure your delegate seat through the official payment
                      portal. Save your transaction ID. You'll need it for Phase 02.
                    </p>
                  </div>

                  <div className={styles.phaseRight}>
                    <div className={`${styles.phaseBtn} ${styles.phaseBtnDisabled}`} aria-disabled="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/>
                      </svg>
                      <span>Pay Fee</span>
                      <span className={styles.lockIcon}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* connector */}
            <div className={styles.phaseConnector}>
              <div className={styles.connectorLine} />
              <span className={styles.connectorText}>then</span>
              <div className={styles.connectorLine} />
            </div>

            {/* ── Phase 02 ── */}
            <div className={`${styles.phaseCard} ${styles.phaseCardLocked}`}>
              {/* status strip */}
              <div className={`${styles.statusStrip} ${styles.statusStripPriority}`}>
                <span className={`${styles.statusDot} ${styles.statusDotAmber}`} />
                <span>Priority Round Opening Soon</span>
              </div>

              <div className={styles.phaseInner}>
                <span className={`${styles.phaseNumBg} ${styles.phaseNumBgDim}`} aria-hidden="true">02</span>

                <div className={styles.phaseContent}>
                  <div className={styles.phaseLeft}>
                    <span className={styles.phaseLabel}>Phase 02</span>
                    <h3 className={`${styles.phaseTitle} ${styles.phaseTitleDim}`}>Registration Form</h3>
                    <p className={styles.phaseDesc}>
                      Tell us who you are, your school, and your top committee
                      choices. Early applicants get first pick. Don't wait.
                    </p>
                  </div>

                  <div className={styles.phaseRight}>
                    <div className={`${styles.phaseBtn} ${styles.phaseBtnGhost}`} aria-disabled="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span>Fill Form</span>
                      <span className={styles.lockIcon}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* contact note */}
            <p className={styles.contactNote}>
              Questions? &nbsp;
              <a href="mailto:contact.mun@chirec.ac.in" className={styles.contactLink}>contact.mun@chirec.ac.in</a>
              &nbsp;·&nbsp;
              <a href="https://instagram.com/chirecmun" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>@chirecmun</a>
            </p>

          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
