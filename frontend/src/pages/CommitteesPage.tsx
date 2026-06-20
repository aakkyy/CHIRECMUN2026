import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { COMMITTEES, TYPE_COLORS, TYPE_LABELS, type CommitteeType } from '../data/committees'
import styles from './CommitteesPage.module.css'

function CommitteeImage({ id, abbr, type }: { id: string; abbr: string; type: CommitteeType }) {
  const [hasError, setHasError] = useState(false)

  const col = TYPE_COLORS[type] || TYPE_COLORS.ga

  return (
    <div className={styles.imgWrap}>
      {!hasError ? (
        <picture>
          <source srcSet={`/media/committees/${id}.webp`} type="image/webp" />
          <img
            src={`/media/committees/${id}.jpg`}
            alt={abbr}
            className={styles.img}
            loading="eager"
            decoding="async"
            onError={() => setHasError(true)}
          />
        </picture>
      ) : (
        <div
          className={styles.imgPlaceholder}
          style={{ background: `linear-gradient(135deg, ${col}0.18) 0%, rgba(4,0,2,0.95) 100%)` }}
        >
          <span className={styles.imgAbbrText}>{abbr}</span>
        </div>
      )}
    </div>
  )
}

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 40, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 85, damping: 18, delay: i * 0.055 },
  }),
}

export default function CommitteesPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className={styles.page}>
      {/* CSS-only Aura background */}
      <div className={styles.vignette} />
      <div className={`${styles.orb} ${styles.orbRed1}`} />
      <div className={`${styles.orb} ${styles.orbBlue1}`} />
      <div className={`${styles.orb} ${styles.orbRed2}`} />
      <div className={`${styles.orb} ${styles.orbBlue2}`} />
      <div className={`${styles.orb} ${styles.orbCenter}`} />

      <Navbar />

      {/* HERO */}
      <div className={styles.hero}>
        <motion.p className={styles.eyebrow}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >CHIREC MUN 2026</motion.p>

        <h1 className={styles.heroTitle}>
          {['The', 'Committees'].map((word, i) => (
            <motion.span key={word} className={styles.heroWord}
              initial={{ opacity: 0, y: 60, rotateX: -22 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.1 + i * 0.14 }}
            >{word}</motion.span>
          ))}
        </h1>

        <motion.p className={styles.heroSub}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.6 }}
        >13 committees across diplomacy, crisis, law, and press.</motion.p>

        <motion.div className={styles.heroDivider}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.72, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {COMMITTEES.map((c, i) => (
          <Link
            key={c.id}
            to={`/committees/${c.id}`}
            className={styles.cardLink}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <motion.div
              className={styles.card}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 280, damping: 20 } }}
            >
              <CommitteeImage id={c.id} abbr={c.abbr} type={c.type} />
              <div className={styles.cardBody}>
                <span className={`${styles.tag} ${styles[`tag_${c.type}`]}`}>{c.category}</span>
                <h2 className={styles.cardName}>{c.name}</h2>
                <p className={styles.cardType}>{TYPE_LABELS[c.type]}</p>
                <div className={styles.cardArrow}>
                  <span>View Committee</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
              <div className={styles.cardGlow} aria-hidden="true" />
            </motion.div>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  )
}
