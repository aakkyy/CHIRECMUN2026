import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import BottomBar from '../components/BottomBar'
import { SECRETARIAT_LEVELS, type SecretariatMember, type SecTier } from '../data/secretariat'
import styles from './SecretariatPage.module.css'

// Photo diameter (px) by tier
const PHOTO_SIZE: Record<SecTier, number> = {
  sg: 126, dg: 114, cda: 106, hoc: 98, usg: 90,
}

// ── Photo circle with placeholder ─────────────────────────────
function MemberPhoto({ slug, role, size }: { slug: string; role: string; size: number }) {
  const [loaded, setLoaded] = useState(false)
  const [err,    setErr]    = useState(false)
  const iconSize = Math.round(size * 0.32)

  return (
    <div className={styles.photoWrap} style={{ width: size, height: size }}>
      <img
        src={`/media/secretariat/${slug}.jpg`}
        alt={role}
        className={`${styles.photo} ${loaded ? styles.photoLoaded : ''}`}
        onLoad={() => { setLoaded(true); setErr(false) }}
        onError={() => setErr(true)}
      />
      {(!loaded || err) && (
        <div className={styles.photoPlaceholder}>
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="rgba(192,57,43,0.28)" strokeWidth="1.2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
          </svg>
        </div>
      )}
      <div className={styles.photoRing} />
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
  const size = PHOTO_SIZE[member.tier]

  return (
    <motion.button
      className={`${styles.card} ${styles[`tier_${member.tier}`]}`}
      onClick={onClick}
      aria-label={`View profile: ${member.role}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-16px' }}
      transition={{ type: 'spring', stiffness: 78, damping: 18, delay: index * 0.09 }}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 380, damping: 22 } }}
      whileTap={{ scale: 0.96 }}
    >
      <MemberPhoto slug={member.photoSlug} role={member.role} size={size} />
      <span className={styles.cardRole}>{member.role}</span>
      <span className={styles.cardHint}>View Profile</span>
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

  // ESC to close
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose])

  // Lock body scroll
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
        {/* Close */}
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Photo */}
        <div className={styles.modalPhotoWrap}>
          <img
            src={`/media/secretariat/${member.photoSlug}.jpg`}
            alt={member.role}
            className={`${styles.modalPhoto} ${loaded ? styles.modalPhotoLoaded : ''}`}
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
          <div className={styles.modalPhotoRing} />
        </div>

        {/* Role */}
        <span className={styles.modalRole}>{member.role}</span>

        {/* Description */}
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
            {/* Level label */}
            <motion.div
              className={styles.levelLabel}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-16px' }}
              transition={{ duration: 0.45 }}
            >
              {level.levelTitle}
            </motion.div>

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

      <BottomBar />
    </div>
  )
}
