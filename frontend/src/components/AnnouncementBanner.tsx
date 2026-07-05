import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './AnnouncementBanner.module.css'

const BANNER_H = 44

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
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: BANNER_H, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className={styles.inner}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.18, duration: 0.28, ease: 'easeOut' }}
          >
            <span className={styles.badge}>OPEN</span>
            <p className={styles.text}>
              Round 1 Delegate &amp; IP Registration is now open
              <span className={styles.sep} aria-hidden="true">·</span>
              <Link to="/register" className={styles.cta}>Apply Now →</Link>
            </p>
          </motion.div>

          <motion.button
            className={styles.close}
            onClick={() => setVisible(false)}
            aria-label="Dismiss announcement"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
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
