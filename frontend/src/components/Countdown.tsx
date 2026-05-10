import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Countdown.module.css'
import BlobBg from './BlobBg'
import { viewport } from '../lib/motion'

const CONFERENCE = new Date('2026-07-31T08:00:00+05:30')

function pad(n) { return String(n).padStart(2, '0') }

function getTimeLeft() {
  const diff = CONFERENCE - new Date()
  if (diff <= 0) return { d: '00', h: '00', m: '00', s: '00' }
  return {
    d: pad(Math.floor(diff / 86400000)),
    h: pad(Math.floor((diff % 86400000) / 3600000)),
    m: pad(Math.floor((diff % 3600000) / 60000)),
    s: pad(Math.floor((diff % 60000) / 1000)),
  }
}

function Block({ value, label, delay }) {
  return (
    <motion.div
      className={styles.unit}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      <div className={styles.numWrap}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className={styles.num}
            initial={{ y: -48, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{   y: 48,  opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className={styles.accent} />
      <span className={styles.label}>{label}</span>
    </motion.div>
  )
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft())

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className={`section ${styles.section}`} id="countdown" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(4,6,10,0.62) 0%, rgba(4,6,10,0.55) 100%)',zIndex:0,pointerEvents:'none'}} />
      <BlobBg variant="red" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.p className={styles.eyebrow}
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        >Mark Your Calendars</motion.p>

        <motion.h2 className={styles.title}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.7, ease: [0.22,1,0.36,1], delay: 0.08 }}
        >The Conference Begins In</motion.h2>

        <div className={styles.grid}>
          <Block value={time.d} label="Days"    delay={0}    />
          <Block value={time.h} label="Hours"   delay={0.08} />
          <Block value={time.m} label="Minutes" delay={0.16} />
          <Block value={time.s} label="Seconds" delay={0.24} />
        </div>

        <motion.p className={styles.sub}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={viewport} transition={{ delay: 0.4, duration: 0.6 }}
        >
          July 31, Aug 1 &amp; 2, 2026 &nbsp;&bull;&nbsp; CHIREC International School, Serilingampalle
        </motion.p>
      </div>
    </section>
  )
}
