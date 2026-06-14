import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomeBeacon from '../components/HomeBeacon'
import styles from './RegisterPage.module.css'

// ── Replace these with your actual links ──────────────────────
const PAYMENT_LINK = 'https://chirec.ac.in/payment'   // TODO: real payment portal
const FORM_LINK    = 'https://forms.gle/placeholder'   // TODO: real Google Form link

const FACTS = [
  '14 committees spanning global policy & crisis',
  '300+ delegates from schools across India',
  '3 full days of high-level debate & diplomacy',
  'Official awards, certificates & recognition',
  'Edition XIV — our most ambitious year yet',
]

const blurUp = (delay = 0) => ({
  initial:     { opacity: 0, filter: 'blur(8px)', y: 14 },
  animate:     { opacity: 1, filter: 'blur(0px)', y: 0 },
  transition:  { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
})

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      {/* Background atmosphere */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgGrid} />

      <Navbar />

      <main className={styles.main}>
        <HomeBeacon />

        <div className={styles.split}>

          {/* ── LEFT ── */}
          <div className={styles.left}>

            {/* Status pill */}
            <motion.div className={styles.statusPill} {...blurUp(0.05)}>
              <span className={styles.statusDot} />
              Registration Open
            </motion.div>

            {/* Headline */}
            <motion.h1 className={styles.headline} {...blurUp(0.12)}>
              Debate<br />
              <span className={styles.headlineAccent}>what matters.</span>
            </motion.h1>

            {/* Description */}
            <motion.p className={styles.desc} {...blurUp(0.22)}>
              Seats are limited. When registrations open, they go fast —
              300+ delegates compete for spots across 14 committees. Don't
              be the one who missed it.
            </motion.p>

            {/* Fact list */}
            <motion.ul className={styles.facts} {...blurUp(0.30)}>
              {FACTS.map((fact, i) => (
                <motion.li
                  key={i}
                  className={styles.factItem}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.35 + i * 0.07 }}
                >
                  <span className={styles.factCheck}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {fact}
                </motion.li>
              ))}
            </motion.ul>

            {/* Date strip */}
            <motion.div className={styles.dates} {...blurUp(0.72)}>
              {['Jul 31', 'Aug 1', 'Aug 2'].map((d, i) => (
                <span key={d} className={styles.dateChip}>
                  <span className={styles.dateDay}>{d}</span>
                  <span className={styles.dateSub}>Day {i + 1}</span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT ── */}
          <motion.div
            className={styles.right}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          >
            <div className={styles.panel}>
              <div className={styles.panelGlow} />

              <div className={styles.panelHeader}>
                <p className={styles.panelEyebrow}>CHIREC MUN 2026 · Edition XIV</p>
                <h2 className={styles.panelTitle}>
                  Secure your <span className={styles.panelAccent}>seat.</span>
                </h2>
                <p className={styles.panelSub}>
                  Complete payment first, then fill the registration form.
                  Both steps are required to confirm your spot.
                </p>
              </div>

              {/* Step 1 */}
              <motion.a
                href={PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.step}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              >
                <div className={styles.stepLeft}>
                  <span className={styles.stepNum}>Step 1</span>
                  <span className={styles.stepTitle}>Complete Payment</span>
                  <span className={styles.stepDesc}>
                    Pay the registration fee through the official CHIREC payment portal to confirm your seat.
                  </span>
                </div>
                <div className={styles.stepArrow}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

              {/* Step connector */}
              <div className={styles.connector}>
                <div className={styles.connectorLine} />
                <span className={styles.connectorLabel}>then</span>
                <div className={styles.connectorLine} />
              </div>

              {/* Step 2 */}
              <motion.a
                href={FORM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.step} ${styles.stepGhost}`}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              >
                <div className={styles.stepLeft}>
                  <span className={styles.stepNum}>Step 2</span>
                  <span className={styles.stepTitle}>Registration Form</span>
                  <span className={styles.stepDesc}>
                    Fill in your details, school, and committee preferences via our registration form.
                  </span>
                </div>
                <div className={styles.stepArrow}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

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
