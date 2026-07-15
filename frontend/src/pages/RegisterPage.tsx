import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomeBeacon from '../components/HomeBeacon'
import FormsInterstitial from '../components/FormsInterstitial'
import styles from './RegisterPage.module.css'

const STATS = [
  { num: '13',   label: 'Committees' },
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
      <FormsInterstitial />

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
            Three days. Thirteen committees. One chance to represent, reason,
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

        {/* ════════════════ MANDATORY FORMS BANNER ════════════════ */}
        <motion.a
          href="/forms"
          className={styles.formsBanner}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        >
          <div className={styles.formsBannerLeft}>
            <span className={styles.formsBannerPulse} aria-hidden="true" />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className={styles.formsBannerBody}>
            <p className={styles.formsBannerTitle}>Mandatory Forms Required</p>
            <p className={styles.formsBannerSub}>All delegates must carry signed copies of the Tech Release and Liability Release forms on Day 1. Missing forms = no entry.</p>
          </div>
          <div className={styles.formsBannerCta}>
            View Forms
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </motion.a>

        {/* ════════════════ PHASE CARDS ════════════════ */}
        <motion.section
          className={styles.phases}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
        >
          <div className={styles.phaseGrid}>

            {/* ── Phase 01: Delegate Registration ── */}
            <div className={styles.phaseCard}>
              <div className={`${styles.statusStrip} ${styles.statusStripGreen}`}>
                <span className={`${styles.dot} ${styles.dotGreen}`} />
                Open Now
              </div>

              <div className={styles.phaseBody}>
                <span className={styles.phaseNumBg} aria-hidden="true">01</span>

                <div className={styles.phaseContent}>
                  <p className={styles.phaseTag}>Phase 01</p>
                  <h2 className={styles.phaseTitle}>Delegate Registration</h2>
                  <p className={styles.phaseDesc}>
                    Round 2 Delegate Applications are open now.
                  </p>

                  <a
                    href="https://forms.office.com/e/aj2BanzKV3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.phaseBtn} ${styles.phaseBtnActive}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Apply Now
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* ── Connector ── */}
            <div className={styles.phaseConnector}>
              <div className={styles.connLine} />
              <div className={styles.connLine} />
            </div>

            {/* ── Phase 02: IP Registration ── */}
            <div className={styles.phaseCard}>
              <div className={`${styles.statusStrip} ${styles.statusStripGreen}`}>
                <span className={`${styles.dot} ${styles.dotGreen}`} />
                Open Now
              </div>

              <div className={styles.phaseBody}>
                <span className={styles.phaseNumBg} aria-hidden="true">02</span>

                <div className={styles.phaseContent}>
                  <p className={styles.phaseTag}>Phase 02</p>
                  <h2 className={styles.phaseTitle}>IP Registration</h2>
                  <p className={styles.phaseDesc}>
                    Round 2 International Press applications are open now.
                  </p>

                  <a
                    href="https://forms.office.com/e/R8mH4JdyKs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.phaseBtn} ${styles.phaseBtnActive}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Apply Now
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* ── Connector ── */}
            <div className={styles.phaseConnector}>
              <div className={styles.connLine} />
              <div className={styles.connLine} />
            </div>

            {/* ── Phase 03: Allocation Matrix ── */}
            <div className={styles.phaseCard}>
              <div className={`${styles.statusStrip} ${styles.statusStripGreen}`}>
                <span className={`${styles.dot} ${styles.dotGreen}`} />
                Open Now
              </div>

              <div className={styles.phaseBody}>
                <span className={styles.phaseNumBg} aria-hidden="true">03</span>

                <div className={styles.phaseContent}>
                  <p className={styles.phaseTag}>Phase 03</p>
                  <h2 className={styles.phaseTitle}>Allocation Matrix</h2>
                  <p className={styles.phaseDesc}>
                    Check the spreadsheet to see your allocation.
                  </p>

                  <a
                    href="https://cognitaschoolsuk-my.sharepoint.com/:x:/g/personal/policy_mun_chirec_ac_in/IQCFZQpTLMT3QJjROuyqJpc8AWYqTT70dK05nxgAOi0QGrM?web=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.phaseBtn} ${styles.phaseBtnActive}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>
                    </svg>
                    View Allocation Matrix
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
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
