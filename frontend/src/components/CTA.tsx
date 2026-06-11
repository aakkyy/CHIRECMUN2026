import BlobBg from './BlobBg'
import { motion } from 'framer-motion'
import styles from './CTA.module.css'
import { viewport } from '../lib/motion'
import BlobButton from './BlobButton'

const crashIn = {
  hidden:  { opacity: 0, y: 70, scale: 1.06 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 16, mass: 1.1 },
  },
}

export default function CTA() {
  return (
    <section className={styles.section} id="register" style={{ position: 'relative', overflow: 'hidden' }}>
      <BlobBg variant="cta" />

      <motion.div
        className={styles.inner} style={{ position: 'relative', zIndex: 1 }}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.p className={styles.eyebrow} variants={crashIn}>Don't Miss Out</motion.p>
        <motion.h2 className={styles.title} variants={crashIn}>
          Ready to Make<br />
          <span className={styles.titleAccent}>Your Mark?</span>
        </motion.h2>
        <motion.p className={styles.sub} variants={crashIn}>
          Join hundreds of delegates from across the country at CHIREC International School
          across three days of diplomacy, debate, and discovery.
        </motion.p>
        <motion.div className={styles.actions} variants={crashIn}>
          <BlobButton href="#" className={styles.btnPrimary} variant="red">
            Register as Delegate
          </BlobButton>
          <BlobButton href="/committees" className={styles.btnOutline} variant="blue">
            View Committees
          </BlobButton>
        </motion.div>
      </motion.div>
    </section>
  )
}
