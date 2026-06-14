import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomeBeacon from '../components/HomeBeacon'
import styles from './RegisterPage.module.css'

const STATS = [
  { num: '14',   label: 'Committees' },
  { num: '300+', label: 'Delegates' },
  { num: '3',    label: 'Days' },
  { num: 'XIV',  label: 'Edition' },
]

const blurIn = (delay = 0) => ({
  initial:    { opacity: 0, filter: 'blur(10px)', y: 16 },
  animate:    { opacity: 1, filter: 'blur(0px)',  y: 0  },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
})

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <canvas className={styles.bgNoise} aria-hidden="true" />

      <Navbar />

      <main className={styles.main}>
        <HomeBeacon />

        <div className={styles.split}>

          {/* ── LEFT ── */}
          <div className={styles.left}>

            <motion.p className={styles.eyebrow} {...blurIn(0.05)}>
              CHIREC MUN 2026 &nbsp;·&nbsp; Edition XIV
            </motion.p>

            <motion.h1 className={styles.headline} {...blurIn(0.13)}>
              Shape the world.<br />
              <span className={styles.headlineDim}>Start here.</span>
            </motion.h1>

            <motion.p className={styles.desc} {...blurIn(0.22)}>
              Three days. Fourteen committees. One chance to represent, reason,
              and resolve on some of the world's most pressing issues.
              Spots are limited — and they go fast.
            </motion.p>

            {/* Stats grid */}
            <motion.div className={styles.statsGrid} {...blurIn(0.30)}>
              {STATS.map(s => (
                <div key={s.label} className={styles.statBox}>
                  <span className={styles.statNum}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Date bar */}
            <motion.div className={styles.dateBar} {...blurIn(0.40)}>
              <span className={styles.dateBarLabel}>Conference Dates</span>
              <span className={styles.dateBarValue}>July 31 – August 2, 2026</span>
              <span className={styles.dateBarVenue}>CHIREC International School, Hyderabad</span>
            </motion.div>

          </div>

          {/* ── RIGHT ── */}
          <motion.div
            className={styles.right}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {/* Watermark */}
            <span className={styles.watermark} aria-hidden="true">XIV</span>

            <div className={styles.panel}>
              <div className={styles.panelTop}>
                <p className={styles.panelTag}>Registration</p>
                <h2 className={styles.panelTitle}>Two steps to your seat.</h2>
                <p className={styles.panelSub}>
                  Complete both steps in order. Your registration is only
                  confirmed once payment is verified by the Secretariat.
                </p>
              </div>

              {/* ── Step 1 ── */}
              <div className={styles.stepWrap}>
                <div className={styles.stepTrack}>
                  <div className={styles.stepBubble}>1</div>
                  <div className={styles.stepLine} />
                </div>
                <div className={styles.stepBody}>
                  <div className={styles.stepMeta}>
                    <span className={styles.stepMetaLabel}>Step 1</span>
                    <span className={styles.stepMetaBadge}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                      Coming Soon
                    </span>
                  </div>
                  <h3 className={styles.stepTitle}>Complete Payment</h3>
                  <p className={styles.stepDesc}>
                    Pay the registration fee via the official CHIREC payment
                    portal. You'll receive a transaction ID to carry forward.
                  </p>
                  <div className={styles.stepBtn} aria-disabled="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></svg>
                    Pay Registration Fee
                    <span className={styles.stepBtnLock}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Step 2 ── */}
              <div className={styles.stepWrap}>
                <div className={styles.stepTrack}>
                  <div className={`${styles.stepBubble} ${styles.stepBubbleDim}`}>2</div>
                </div>
                <div className={styles.stepBody}>
                  <div className={styles.stepMeta}>
                    <span className={styles.stepMetaLabel}>Step 2</span>
                    <span className={styles.stepMetaBadge}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                      Priority Round Opening Soon
                    </span>
                  </div>
                  <h3 className={styles.stepTitle}>Registration Form</h3>
                  <p className={styles.stepDesc}>
                    Fill in your delegate details, school information, and
                    committee preferences. Priority spots go to early applicants.
                  </p>
                  <div className={`${styles.stepBtn} ${styles.stepBtnGhost}`} aria-disabled="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Fill Registration Form
                    <span className={styles.stepBtnLock}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    </span>
                  </div>
                </div>
              </div>

              <p className={styles.panelNote}>
                Questions? Reach us at{' '}
                <a href="mailto:contact.mun@chirec.ac.in" className={styles.noteLink}>contact.mun@chirec.ac.in</a>
                {' '}or DM{' '}
                <a href="https://instagram.com/chirecmun" target="_blank" rel="noopener noreferrer" className={styles.noteLink}>@chirecmun</a>
              </p>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
