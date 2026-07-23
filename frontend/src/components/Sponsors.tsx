import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Sponsors.module.css'

const TITLE_SPONSORS = [
  { name: 'Bajaj',               slug: 'bajaj' },
  { name: 'Bhrunda',             slug: 'bhrunda' },
  { name: 'G Pulla Reddy Sweets',slug: 'g-pulla-reddy-sweets' },
  { name: 'Hi Sun',              slug: 'hi-sun' },
]

const SPONSORS = [
  { name: 'Midwest Energy',    slug: 'midwest-energy' },
  { name: 'ERP Tech',          slug: 'erp-tech' },
  { name: 'Mussadilal',        slug: 'mussadilal' },
  { name: 'BOP Consultants',   slug: 'bop-consultants' },
  { name: 'Qatalys Tech',      slug: 'qatalys-tech' },
  { name: 'Greencity Estates', slug: 'greencity-estates' },
  { name: 'Saabi',             slug: 'saabi' },
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
      <motion.div
        className={styles.posterWrap}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/media/sponsors/sponsors-poster.png"
          alt="CHIREC MUN 2026 Sponsors"
          className={styles.posterImg}
        />
      </motion.div>
    </section>
  )
}
