import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './AnnouncementBanner.module.css'

const BANNER_H = 40

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    document.documentElement.style.setProperty('--banner-h', visible ? `${BANNER_H}px` : '0px')
  }, [visible])

  useEffect(() => {
    return () => document.documentElement.style.setProperty('--banner-h', '0px')
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.banner}
          initial={{ y: -BANNER_H }}
          animate={{ y: 0 }}
          exit={{ y: -BANNER_H }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.inner}>
            <p className={styles.text}>
              Round 1 Delegate &amp; IP Registration is live
              <span className={styles.sep} aria-hidden="true">·</span>
              <Link to="/register" className={styles.cta}>Apply Now →</Link>
            </p>
          </div>

          <button
            className={styles.close}
            onClick={() => setVisible(false)}
            aria-label="Dismiss announcement"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
