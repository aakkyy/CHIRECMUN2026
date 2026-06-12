/**
 * HomeBeacon — clean top-right pill on hamburger-accessed pages.
 * Shows CHIREC logo chip, BACK / HOME label, left-pointing arrow.
 * Pulsing border keeps it present without being aggressive.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './HomeBeacon.module.css'
import logoImg from '@assets/logo.png'

export default function HomeBeacon() {
  const navigate = useNavigate()
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => navigate('/'), 300)
  }

  return (
    <motion.button
      className={`${styles.beacon} ${clicked ? styles.beaconWarp : ''}`}
      onClick={handleClick}
      aria-label="Return to home page"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 26 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Logo chip */}
      <span className={styles.logoChip}>
        <img src={logoImg} alt="" className={styles.logo} aria-hidden="true" />
      </span>

      {/* Label */}
      <span className={styles.labelGroup}>
        <span className={styles.labelTop}>Back</span>
        <span className={styles.labelMain}>Home</span>
      </span>

      {/* Left arrow */}
      <svg
        className={styles.arrow}
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
    </motion.button>
  )
}
