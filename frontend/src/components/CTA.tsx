import BlobBg from './BlobBg'
import { motion } from 'framer-motion'
import styles from './CTA.module.css'
import { viewport } from '../lib/motion'
import BlobButton from './BlobButton'

export default function CTA() {
  return (
    <section className={styles.section} id="register" style={{ position: 'relative', overflow: 'hidden' }}>
      <BlobBg variant="cta" />
      <motion.div
        className={styles.inner} style={{ position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={viewport}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      >
        <p className={styles.eyebrow}>Don't Miss Out</p>
        <h2 className={styles.title}>
          Ready to Make Your Mark<br />on the World Stage?
        </h2>
        <p className={styles.sub}>
          Join hundreds of delegates from across the country at CHIREC International School
          across three days of diplomacy, debate, and discovery.
        </p>
        <div className={styles.actions}>
          <BlobButton href="#" className={styles.btnPrimary} variant="red">
            Register as Delegate
          </BlobButton>
          <BlobButton href="#" className={styles.btnOutline} variant="blue">
            Download Brochure
          </BlobButton>
        </div>
      </motion.div>
    </section>
  )
}
