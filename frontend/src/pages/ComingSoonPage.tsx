import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import BottomBar from '../components/BottomBar'
import AuraBg from '../components/AuraBg'
import styles from './ComingSoonPage.module.css'

export default function ComingSoonPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className={styles.page}>
      <AuraBg />
      <Navbar />
      <div className={styles.center}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          CHIREC MUN 2026
        </motion.p>
        <motion.h1
          className={styles.headline}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.12 }}
        >
          COMING SOON
        </motion.h1>
        <motion.p
          className={styles.sub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.48, duration: 0.7 }}
        >
          Stay Tuned
        </motion.p>
        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.65, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <BottomBar />
    </div>
  )
}
