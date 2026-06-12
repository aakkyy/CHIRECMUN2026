/**
 * HomeBeacon — a pulsing radar beacon fixed to the bottom-right corner
 * of every "secondary" page (Guidelines, FAQs, Mandatory Forms).
 *
 * Three concentric rings pulse outward like sonar, always reminding the
 * user that Home Base is one click away. On hover, a "RETURN HOME" label
 * slides in. On click, navigate('/').
 *
 * Nobody has built exactly this before.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './HomeBeacon.module.css'
import logoImg from '@assets/logo.png'

export default function HomeBeacon() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => navigate('/'), 320)
  }

  return (
    <motion.button
      className={`${styles.beacon} ${clicked ? styles.beaconWarp : ''}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
      aria-label="Return to home page"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 22 }}
      whileTap={{ scale: 0.88 }}
    >
      {/* ── Pulsing sonar rings ── */}
      <span className={`${styles.ring} ${styles.ring1}`} />
      <span className={`${styles.ring} ${styles.ring2}`} />
      <span className={`${styles.ring} ${styles.ring3}`} />

      {/* ── Core ── */}
      <div className={`${styles.core} ${hovered ? styles.coreHovered : ''}`}>
        <img src={logoImg} alt="Home" className={styles.logo} />
      </div>

      {/* ── Slide-in label ── */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, x: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0,  filter: 'blur(0px)' }}
            exit={{   opacity: 0, x: 14,  filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            <span className={styles.labelLine} />
            <span className={styles.labelText}>HOME BASE</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
