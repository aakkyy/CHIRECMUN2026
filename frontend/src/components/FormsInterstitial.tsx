import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './FormsInterstitial.module.css'

export default function FormsInterstitial() {
  const [visible, setVisible] = useState(true)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => { if (e.target === e.currentTarget) setVisible(false) }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: 16 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          >
            {/* header row */}
            <div className={styles.header}>
              <div className={styles.iconBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <span className={styles.headerLabel}>Before you register</span>
              <button className={styles.closeBtn} onClick={() => setVisible(false)} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <h2 className={styles.title}>Mandatory Forms Required</h2>

            <p className={styles.desc}>
              All delegates must carry <strong>signed printed copies</strong> of the Tech Release
              and Liability Release forms on Day 1. Missing forms means no entry.
            </p>

            <div className={styles.actions}>
              <Link
                to="/forms"
                className={styles.btnPrimary}
                onClick={() => setVisible(false)}
              >
                View &amp; Download Forms
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <button className={styles.btnGhost} onClick={() => setVisible(false)}>
                Got it, continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
