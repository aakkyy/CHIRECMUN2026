import { motion } from 'framer-motion'
import styles from './Location.module.css'
import { viewport } from '../lib/motion'

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 20 } },
}

export default function Location() {
  return (
    <section className={`section ${styles.section}`} id="location">
      <div className="container">
        <motion.div
          initial="hidden" whileInView="visible" viewport={viewport}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p className={styles.eyebrow} variants={fadeUp}>Getting Here</motion.p>
          <motion.h2 className={styles.title} variants={fadeUp}>Find Us Here</motion.h2>
          <motion.p className={styles.sub} variants={fadeUp}>
            Visit us at our campus in Serilingampalle, Hyderabad
          </motion.p>
        </motion.div>

        <motion.div
          className={styles.mapWrap}
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={viewport}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        >
          <div className={styles.mapFrame} aria-hidden="true" />
          <div className={styles.mapTint} aria-hidden="true" />
          <iframe
            className={styles.map}
            title="CHIREC International School, Serilingampalle"
            src="https://maps.google.com/maps?q=F8HM%2B3VM+Serilingampalle+Hyderabad+Telangana&output=embed&z=17"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        <motion.div
          className={styles.details}
          initial="hidden" whileInView="visible" viewport={viewport}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
        >
          <motion.div className={styles.detailItem} variants={fadeUp}>
            <span className={styles.detailIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <div>
              <p className={styles.detailLabel}>Address</p>
              <p className={styles.detailValue}>F8HM+3VM, Spring Valley, Serilingampalle (M), Hyderabad, Telangana 500019</p>
            </div>
          </motion.div>
          <motion.div className={styles.detailItem} variants={fadeUp}>
            <span className={styles.detailIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            <div>
              <p className={styles.detailLabel}>Conference Dates</p>
              <p className={styles.detailValue}>July 31, August 1 &amp; 2, 2026</p>
            </div>
          </motion.div>
          <motion.div className={styles.linkCell} variants={fadeUp}>
            <a
              href="https://share.google/vIwGsXgARRpKcd9LC"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapsLink}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Open in Google Maps
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
