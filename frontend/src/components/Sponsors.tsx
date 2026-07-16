import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Sponsors.module.css'

const TITLE_SPONSORS = [
  { name: 'Bajaj',               slug: 'bajaj' },
  { name: 'Bhrunda',             slug: 'bhrunda' },
  { name: 'G Pulla Reddy Sweets',slug: 'g-pulla-reddy-sweets' },
  { name: 'Hi Sun',              slug: 'hi-sun' },
  { name: 'Legala Grp',          slug: 'legala-grp' },
]

const SPONSORS = [
  { name: 'Veeresh',           slug: 'veeresh' },
  { name: 'Midwest Energy',    slug: 'midwest-energy' },
  { name: 'ERP Tech',          slug: 'erp-tech' },
  { name: 'Mussadilal',        slug: 'mussadilal' },
  { name: 'Parthasarathy',     slug: 'parthasarathy' },
  { name: 'BOP Consultants',   slug: 'bop-consultants' },
  { name: 'Qatalys Tech',      slug: 'qatalys-tech' },
  { name: 'Greencity Estates', slug: 'greencity-estates' },
  { name: 'Lumbini Builders',  slug: 'lumbini-builders' },
]

function SponsorLogo({ name, slug, size, title }: { name: string; slug: string; size: 'large' | 'small'; title?: boolean }) {
  const [err, setErr] = useState(false)
  return (
    <div className={`${styles.logoCard} ${size === 'large' ? styles.logoCardLarge : styles.logoCardSmall} ${title ? styles.logoCardTitle : ''}`}>
      {!err ? (
        <img
          src={`/media/sponsors/${slug}.png`}
          alt={name}
          className={styles.logoImg}
          onError={() => setErr(true)}
        />
      ) : (
        <span className={styles.logoFallback}>{name}</span>
      )}
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 },
  }),
}

export default function Sponsors() {
  return (
    <section className={styles.section} id="sponsors">
      <div className={styles.glow} aria-hidden="true" />

      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className={styles.eyebrow}>CHIREC MUN 2026</p>
        <h2 className={styles.title}>OUR SPONSORS</h2>
        <div className={styles.titleUnderline} />
      </motion.div>

      {/* Title Sponsors */}
      <div className={styles.tier}>
        <motion.p
          className={`${styles.tierLabel} ${styles.tierLabelGold}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className={styles.tierDot} />
          Title Sponsors
        </motion.p>
        <div className={styles.titleGrid}>
          {TITLE_SPONSORS.map((s, i) => (
            <motion.div
              key={s.slug}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SponsorLogo name={s.name} slug={s.slug} size="large" title />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Sponsors */}
      <div className={styles.tier}>
        <motion.p
          className={`${styles.tierLabel} ${styles.tierLabelDim}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className={styles.tierDotDim} />
          Sponsors
        </motion.p>
        <div className={styles.sponsorGrid}>
          {SPONSORS.map((s, i) => (
            <motion.div
              key={s.slug}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SponsorLogo name={s.name} slug={s.slug} size="small" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
