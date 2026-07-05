import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './AnnouncementBanner.module.css'

const BANNER_H = 44

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const h = visible ? `${BANNER_H}px` : '0px'
    document.documentElement.style.setProperty('--banner-h', h)
  }, [visible])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.documentElement.style.setProperty('--banner-h', '0px')
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.banner}
          initial={{ y: -BANNER_H }}
          animate={{ y: 0 }}
          exit={{ y: -BANNER_H }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        >
          <div className={styles.inner}>
            <span className={styles.liveDot} aria-hidden="true" />
            <p className={styles.text}>
              Round 1 Delegate &amp; IP Registration is now open
              <span className={styles.sep} aria-hidden="true">·</span>
              <Link to="/register" className={styles.cta}>Apply Now →</Link>
            </p>
          </div>

          <motion.button
            className={styles.close}
            onClick={() => setVisible(false)}
            aria-label="Dismiss announcement"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
