import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Countdown.module.css'
import BlobBg from './BlobBg'
import { viewport } from '../lib/motion'

const CONFERENCE = new Date('2026-07-31T08:00:00+05:30')
const JOURNEY_START = new Date('2025-08-03T08:00:00+05:30')

function pad(n: number) { return String(n).padStart(2, '0') }

function getTimeLeft() {
  const diff = CONFERENCE.getTime() - Date.now()
  if (diff <= 0) return { d: '00', h: '00', m: '00', s: '00' }
  return {
    d: pad(Math.floor(diff / 86400000)),
    h: pad(Math.floor((diff % 86400000) / 3600000)),
    m: pad(Math.floor((diff % 3600000) / 60000)),
    s: pad(Math.floor((diff % 60000) / 1000)),
  }
}

function getProgress() {
  const total   = CONFERENCE.getTime() - JOURNEY_START.getTime()
  const elapsed = Date.now()             - JOURNEY_START.getTime()
  return Math.min(1, Math.max(0, elapsed / total))
}

// ── Conference schedule data ──────────────────────────────────
const schedule = [
  {
    day: 'Day 01',
    date: 'July 31',
    weekday: 'Friday',
    color: 'red' as const,
    sessions: [
      { time: '08:00', label: 'Delegate Registration' },
      { time: '09:30', label: 'Opening Ceremony' },
      { time: '11:00', label: 'Committee Session I' },
      { time: '14:00', label: 'Committee Session II' },
      { time: '17:00', label: 'End of Day' },
    ],
  },
  {
    day: 'Day 02',
    date: 'August 1',
    weekday: 'Saturday',
    color: 'blue' as const,
    sessions: [
      { time: '09:00', label: 'Committee Session III' },
      { time: '12:00', label: 'Lunch Break' },
      { time: '13:30', label: 'Committee Session IV' },
      { time: '16:30', label: 'Social Night' },
      { time: '20:00', label: 'Social Night Ends' },
    ],
  },
  {
    day: 'Day 03',
    date: 'August 2',
    weekday: 'Sunday',
    color: 'red' as const,
    sessions: [
      { time: '09:00', label: 'Committee Session V' },
      { time: '11:30', label: 'Final Voting Procedures' },
      { time: '13:00', label: 'Lunch Break' },
      { time: '14:30', label: 'Closing Ceremony' },
      { time: '16:30', label: 'Conference Concludes' },
    ],
  },
]

// ── Timer block ───────────────────────────────────────────────
function Block({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      className={styles.unit}
      initial={{ opacity: 0, y: 36, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={viewport}
      transition={{ type: 'spring', stiffness: 90, damping: 19, delay }}
    >
      <div className={styles.card}>
        <span className={styles.cardSeam} aria-hidden="true" />
        <div className={styles.numWrap}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              className={styles.num}
              initial={{ rotateX: -92, y: -14, opacity: 0 }}
              animate={{ rotateX: 0,   y: 0,   opacity: 1 }}
              exit={{   rotateX: 88,  y: 16,  opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26, mass: 0.9 }}
              style={{ transformOrigin: 'center 60%', display: 'inline-block', backfaceVisibility: 'hidden' }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <div className={styles.accent} />
      <span className={styles.label}>{label}</span>
    </motion.div>
  )
}

// ── Schedule day card ─────────────────────────────────────────
function DayCard({ day, index }: { day: typeof schedule[0]; index: number }) {
  return (
    <motion.div
      className={`${styles.dayCard} ${styles[`dayCard_${day.color}`]}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ type: 'spring', stiffness: 80, damping: 20, delay: index * 0.10 }}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
    >
      {/* Card header */}
      <div className={styles.dayHeader}>
        <div>
          <span className={styles.dayNum}>{day.day}</span>
          <span className={styles.dayWeekday}>{day.weekday}</span>
        </div>
        <div className={`${styles.datePill} ${styles[`datePill_${day.color}`]}`}>
          {day.date}
        </div>
      </div>

      {/* Sessions list */}
      <ul className={styles.sessions}>
        {day.sessions.map((s, i) => (
          <li key={i} className={styles.session}>
            <span className={styles.sessionTime}>{s.time}</span>
            <span className={`${styles.sessionDot} ${styles[`sessionDot_${day.color}`]}`} aria-hidden="true" />
            <span className={styles.sessionLabel}>{s.label}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft())
  const progress = getProgress()

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className={`section ${styles.section}`} id="countdown" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(4,6,10,0.62) 0%, rgba(4,6,10,0.55) 100%)', zIndex:0, pointerEvents:'none' }} />
      <BlobBg variant="red" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Eyebrow + title ── */}
        <motion.p className={styles.eyebrow}
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        >Mark Your Calendars</motion.p>

        <motion.h2 className={styles.title}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.7, ease: [0.22,1,0.36,1], delay: 0.08 }}
        >The Conference Begins In</motion.h2>

        {/* ── Countdown timer ── */}
        <div className={styles.grid}>
          <Block value={time.d} label="Days"    delay={0}    />
          <span className={styles.colon} aria-hidden="true">:</span>
          <Block value={time.h} label="Hours"   delay={0.08} />
          <span className={styles.colon} aria-hidden="true">:</span>
          <Block value={time.m} label="Minutes" delay={0.16} />
          <span className={styles.colon} aria-hidden="true">:</span>
          <Block value={time.s} label="Seconds" delay={0.24} />
        </div>

        {/* ── Progress bar ── */}
        <motion.div
          className={styles.progressWrap}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.7, ease: [0.22,1,0.36,1], delay: 0.3 }}
        >
          <div className={styles.progressMeta}>
            <span>Road to Edition XIV</span>
            <span className={styles.progressPct}>{Math.round(progress * 100)}%</span>
          </div>
          <div className={styles.progressTrack}>
            <motion.div
              className={styles.progressFill}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: progress }}
              viewport={viewport}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
            />
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          className={styles.sectionDivider}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.8, ease: [0.22,1,0.36,1], delay: 0.2 }}
        />

        {/* ── Schedule heading ── */}
        <motion.div className={styles.scheduleHeader}
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        >
          <p className={styles.scheduleEyebrow}>Conference Schedule</p>
          <h3 className={styles.scheduleTitle}>Three Days of Diplomacy</h3>
        </motion.div>

        {/* ── Day cards ── */}
        <div className={styles.dayGrid}>
          {schedule.map((day, i) => (
            <DayCard key={day.day} day={day} index={i} />
          ))}
        </div>

        {/* ── Location sub ── */}
        <motion.p className={styles.sub}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={viewport} transition={{ delay: 0.4, duration: 0.6 }}
        >
          CHIREC International School, Serilingampalle · Hyderabad
        </motion.p>

      </div>
    </section>
  )
}
