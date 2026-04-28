import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './FAQPage.module.css'
import AnimatedBg from '../components/AnimatedBg'
import BottomBar from '../components/BottomBar'
import logoImg from '../assets/logo.png'

const faqs = [
  {
    q: 'What is an MUN?',
    a: 'A Model United Nations (MUN) is an educational simulation of the United Nations where students take on the roles of delegates representing different countries. Participants research global issues, debate policies, and collaborate on resolutions — building skills in public speaking, diplomacy, critical thinking, and leadership.',
  },
  {
    q: 'What forms must be signed prior to the conference?',
    a: 'The liability and tech release form are mandatory to be filled prior to the conference.',
  },
  {
    q: 'Will there be transport provided?',
    a: 'Coming soon.',
    soon: true,
  },
  {
    q: 'What food options are available for delegates?',
    a: 'Delegates can buy food from stalls, but school lunch will also be provided for free.',
  },
  {
    q: 'What is the dress code that must be followed?',
    a: 'Delegates must wear formal clothing on Day 1 and Day 3 of the conference (skirts and dresses are not allowed), and traditional clothing on Day 2.',
  },
  {
    q: 'Where is the event occurring?',
    a: 'The event will be held at the new CHIREC ISRP Campus in Serilingampally.',
  },
  {
    q: 'Will on-spot registrations be available?',
    a: 'Coming soon.',
    soon: true,
  },
  {
    q: 'Will cameras be provided to IP photographers?',
    a: 'No, IP photographers are required to carry their own cameras.',
  },
  {
    q: 'Is there a social night?',
    a: 'Yes — there will be a social night following the last committee session on Day 2.',
  },
]

function FAQItem({ faq, isOpen, onToggle, index }) {
  return (
    <motion.div
      className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 20, delay: index * 0.06 }}
    >
      <button className={styles.question} onClick={onToggle} aria-expanded={isOpen}>
        <span className={styles.qText}>{faq.q}</span>
        <motion.span
          className={styles.chevron}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className={styles.answer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <p className={`${styles.aText} ${faq.soon ? styles.soon : ''}`}>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQPage() {
  const [open, setOpen] = useState(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className={styles.page}>
      <AnimatedBg variant="blue" />
      <div className={styles.overlay} />

      {/* Mini nav */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Home
        </Link>
        <Link to="/" className={styles.brand}>
          <img src={logoImg} alt="CHIREC MUN" className={styles.logoImg} />
          <span className={styles.brandName}>CHIREC MUN 2026</span>
        </Link>
        <a href="/#register" className={styles.register}>Register</a>
      </nav>

      {/* Hero text */}
      <div className={styles.hero}>
        <motion.p className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        >Got Questions?</motion.p>
        <motion.h1 className={styles.title}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1], delay: 0.08 }}
        >Frequently Asked<br />Questions</motion.h1>
        <motion.p className={styles.sub}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.6 }}
        >Everything you need to know about CHIREC MUN 2026.</motion.p>
      </div>

      {/* FAQ list */}
      <div className={styles.list}>
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            faq={faq}
            index={i}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}
      </div>

      <BottomBar />
    </div>
  )
}
