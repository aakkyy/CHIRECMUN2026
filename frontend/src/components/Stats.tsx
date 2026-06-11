import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import styles from './Stats.module.css'
import { spring, viewport } from '../lib/motion'

const stats = [
  { num: '14',   label: 'Editions' },
  { num: '350+', label: 'Expected Delegates' },
  { comingSoon: true },
  { num: '3',    label: 'Days of Diplomacy', sub: 'Jul 31 · Aug 1 & 2' },
]

function AnimatedNum({ target, suffix }) {
  const count   = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v) + suffix)
  const ref     = useRef(null)
  const inView  = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!inView) return
    const ctrl = animate(count, target, { duration: 1.6, ease: [0.22, 1, 0.36, 1] })
    return ctrl.stop
  }, [inView])

  return <motion.span ref={ref} className={styles.num}>{rounded}</motion.span>
}

const itemVariant = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { ...spring } },
}

export default function Stats() {
  const [selected, setSelected] = useState(null)
  const stripRef = useRef(null)

  // Click outside the strip → deselect
  const handleOutsideClick = useCallback((e) => {
    if (stripRef.current && !stripRef.current.contains(e.target)) {
      setSelected(null)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [handleOutsideClick])

  const handleCardClick = (i) => {
    setSelected(prev => prev === i ? null : i)
  }

  return (
    <div className={styles.strip} ref={stripRef}>
      <motion.div
        className={styles.inner}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {stats.map((s, i) => {
          const isSelected = selected === i

          return (
            <motion.div key={i} className={styles.itemWrap} variants={itemVariant}>
              {i > 0 && <div className={styles.divider} />}

              <motion.div
                className={`${styles.item} ${s.comingSoon ? styles.csItem : ''}`}
                onClick={() => handleCardClick(i)}
                animate={isSelected
                  ? { boxShadow: '0 0 0 2px #c0392b, 0 4px 24px rgba(192,57,43,0.22)', scale: 1 }
                  : { boxShadow: '0 0 0 0px rgba(192,57,43,0)',                          scale: 1 }
                }
                whileHover={isSelected ? { y: -3 } : {
                  y: -3,
                  boxShadow: '0 0 0 1.5px rgba(192,57,43,0.40), 0 10px 28px rgba(192,57,43,0.12)',
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                style={{ cursor: 'pointer', borderRadius: 12, padding: '1rem 1.5rem' }}
              >
                {s.comingSoon ? (
                  <>
                    <div className={styles.csBadge}>
                      <span className={styles.csShimmer} aria-hidden="true" />
                      <span className={styles.csText}>Coming Soon</span>
                    </div>
                    <span className={styles.csLabel}>Committees</span>
                  </>
                ) : (
                  <>
                    <span className={styles.numWrap}>
                      <AnimatedNum target={parseInt(s.num)} suffix={s.num.includes('+') ? '+' : ''} />
                      <motion.span
                        className={styles.numUnderline}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={viewport}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 + i * 0.1 }}
                        aria-hidden="true"
                      />
                    </span>
                    <span className={styles.label}>{s.label}</span>
                    {s.sub && <span className={styles.sub}>{s.sub}</span>}
                  </>
                )}
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
