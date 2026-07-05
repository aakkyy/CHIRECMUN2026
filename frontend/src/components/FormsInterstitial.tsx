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
          transition={{ duration: 0.28 }}
          onClick={(e) => { if (e.target === e.currentTarget) setVisible(false) }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{    opacity: 0, scale: 0.9, y: 24  }}
            transition={{ type: 'spring', stiffness: 340, damping: 28, delay: 0.06 }}
          >
            {/* pulsing ring behind icon */}
            <div className={styles.iconWrap}>
              <span className={styles.iconRing} aria-hidden="true" />
              <span className={styles.iconRing2} aria-hidden="true" />
              <svg className={styles.icon} width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>

            <h2 className={styles.title}>Mandatory Forms Required</h2>

            <p className={styles.desc}>
              All delegates must carry <strong>signed printed copies</strong> of the Tech Release and
              Liability Release forms on <strong>Day 1</strong>. No forms = no entry. No exceptions.
            </p>

            <div className={styles.divider} />

            <div className={styles.actions}>
              <Link
                to="/forms"
                className={styles.btnPrimary}
                onClick={() => setVisible(false)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                View &amp; Download Forms
              </Link>

              <button className={styles.btnGhost} onClick={() => setVisible(false)}>
                I understand, continue to register
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
