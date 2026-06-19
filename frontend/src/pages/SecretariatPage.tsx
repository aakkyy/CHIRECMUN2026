import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { SECRETARIAT_LEVELS, type SecretariatMember, type SecTier } from '../data/secretariat'
import styles from './SecretariatPage.module.css'

// ── Portrait card photo ────────────────────────────────────────
function PortraitPhoto({ slug, role, tier }: { slug: string; role: string; tier: SecTier }) {
  const [loaded, setLoaded] = useState(false)
  const [err,    setErr]    = useState(false)

  return (
    <div className={`${styles.portrait} ${styles[`portrait_${tier}`]}`}>
      <picture>
        <source srcSet={`/media/secretariat/${slug}.webp`} type="image/webp" />
        <img
          src={`/media/secretariat/${slug}.jpg`}
          alt={role}
          loading="eager"
          decoding="async"
          className={`${styles.portraitImg} ${loaded ? styles.portraitImgLoaded : ''}`}
          onLoad={() => { setLoaded(true); setErr(false) }}
          onError={() => setErr(true)}
        />
      </picture>
      {(!loaded || err) && (
        <div className={styles.portraitPlaceholder}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(192,57,43,0.22)" strokeWidth="0.9">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
          </svg>
        </div>
      )}
      {/* Hover overlay */}
      <div className={styles.portraitOverlay}>
        <span className={styles.portraitHint}>View Profile</span>
      </div>
    </div>
  )
}

// ── Individual card ────────────────────────────────────────────
function MemberCard({
  member,
  index,
  onClick,
}: {
  member: SecretariatMember
  index: number
  onClick: () => void
}) {
  return (
    <motion.button
      className={`${styles.card} ${styles[`card_${member.tier}`]}`}
      onClick={onClick}
      aria-label={`View profile: ${member.role}`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 78, damping: 18, delay: index * 0.10 }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 360, damping: 22 } }}
      whileTap={{ scale: 0.97 }}
    >
      <PortraitPhoto slug={member.photoSlug} role={member.role} tier={member.tier} />
    </motion.button>
  )
}

// ── Profile modal ──────────────────────────────────────────────
function ProfileModal({
  member,
  onClose,
}: {
  member: SecretariatMember
  onClose: () => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [err,    setErr]    = useState(false)

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.88, y: 44 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 44 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Portrait in modal */}
        <div className={styles.modalPortrait}>
          <img
            src={`/media/secretariat/${member.photoSlug}.jpg`}
            alt={member.role}
            className={`${styles.modalPortraitImg} ${loaded ? styles.modalPortraitImgLoaded : ''}`}
            onLoad={() => { setLoaded(true); setErr(false) }}
            onError={() => setErr(true)}
          />
          {(!loaded || err) && (
            <div className={styles.modalPhotoPlaceholder}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(192,57,43,0.25)" strokeWidth="1.0">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
              </svg>
            </div>
          )}
          {/* Gradient at bottom */}
          <div className={styles.modalPortraitGrad} />
        </div>

        <span className={styles.modalRole}>{member.role}</span>
        <div className={styles.modalDivider} />
        <p className={styles.modalDesc}>
          {member.description || 'Description coming soon.'}
        </p>
      </motion.div>
    </motion.div>
  )
}

// ── Page ───────────────────────────────────────────────────────
export default function SecretariatPage() {
  const [selected, setSelected] = useState<SecretariatMember | null>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <Navbar />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroInner}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }}
        >
          <span className={styles.eyebrow}>CHIREC MUN 2026 · Edition XIV</span>
          <h1 className={styles.heroTitle}>The Secretariat</h1>
          <p className={styles.heroSub}>The team driving the fourteenth edition</p>
        </motion.div>
      </section>

      {/* ── ORG CHART ── */}
      <section className={styles.chart}>
        {SECRETARIAT_LEVELS.map((level) => (
          <div
            key={level.levelId}
            className={`${styles.level} ${styles[`level_${level.members[0].tier}`]}`}
          >
            {/* Section title */}
            <motion.h2
              className={`${styles.levelTitle} ${styles[`lt_${level.members[0].tier}`]}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {level.levelTitle}
            </motion.h2>

            {/* Cards */}
            <div className={styles.levelCards}>
              {level.members.map((member, mi) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={mi}
                  onClick={() => setSelected(member)}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selected && (
          <ProfileModal
            member={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
